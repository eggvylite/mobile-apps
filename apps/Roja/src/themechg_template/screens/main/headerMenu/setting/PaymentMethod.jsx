import React, { useCallback, useMemo, useRef, useState, useEffect, useContext } from 'react';
import { useWindowDimensions, View, StatusBar, Keyboard, TouchableOpacity, Pressable, Animated, ImageBackground, ViewPagerAndroidBase, Text, Alert, ScrollView, LogBox, TouchableWithoutFeedback, Image, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import { useBackHandler } from '@react-native-community/hooks';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import CommonFunction from '../../../../../utill/CommonFunction';
import GradientBackground from '../../../../component/GradientBackground';
import { clearpaymentDetails, fetchPaymentMethods } from '../../../../../redux/slices/paymentSlice';
import CommonHeader from '../../../../component/CommonHeader';
import { getFontSize } from '../../../../../constants/Font';
import AddPaymentCard from '../../../../component/AddPaymentCard';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import Loader from '../../../../component/Loader';
import getStyles from '../../../../styles';
import LinearGradient from 'react-native-linear-gradient';
import { RadioButton } from 'react-native-paper';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import CommonIcon from '../../../../component/Commonicons';
import NoRecord from '../../../../component/NoRecord';
import { BottomContext } from '../../../../../context/BottomContext';
import CustomModal from '../../../../component/CustomModal';
import { getLoginInfo } from '../../../../../service/storage';
import api from '../../../../../service/api';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();




const PaymentMethod = (props) => {

    const { height, width } = useWindowDimensions();
    const refRBSheet = useRef();
    const [loading1, setLoading] = useState(false);
    const [bottomSheetLoading, setBSLoading] = useState(false);
    const [ccForm, setCCForm] = useState(null)
    const [invalidFields, setInvalidFields] = useState("")
    const [invalidAttempt, setInvalidAttempt] = useState(false)
    const [invalidAttemptText, setInvalidAttemptText] = useState(false)
    const [cusLoginInfo, setCusLoginInfo] = useState(null);
    const [cusData, setCusData] = useState(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [payMethodInfo, setPayMethodInfo] = useState(null);
    const [modalLoading, setModalLoading] = useState(false)
    const [reload, setReload] = useState(false)
    const [app, setapp] = useState('')
    const [paymentcardopen, setpamentcard] = useState(false)
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const bottomSheetRef = useRef(null);
    const { paymentMethods, paymentloading, error } = useSelector(state => state.payment);
    const kPrimaryPadding = 20
    const { themedata } = useSelector((state) => state.appcolor);
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const themeColors = themedata.theme
    var { styles } = getStyles(themeColors);
    const [checked, setChecked] = React.useState('first');
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDelmodel, setisDelmodel] = useState(false)
    const [isDefmodel, setisDefmodel] = useState(false)




    useEffect(() => {
        if (isFlipped) {
            flipToBack()
        } else {
            flipToFront()

        }

    }, [isFlipped])

    const backActionHandler = () => {
        props.navigation.goBack()
        return true;

    };
    useBackHandler(backActionHandler)



    const getDetails = async () => {
        var login = await getLoginInfo()
        setapp(login)
    }

    const getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }


    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });







    function formatDateTime(date) {
        const df = moment(new Date(date)).format(storedata.format)
        return df
    }


    async function deletePayment() {
        setLoading(true);
        const cusData = await getLoginInfo()
        setisDelmodel(false)
        api.get("customer/deletecard?card=" + payMethodInfo.pm_id + "&customer=" + cusData.id + "&platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress())
            .then(function (response) {
                const data = response.data
                CommonFunction.message(data.message)
                setChecked('')
                setPayMethodInfo('')
                dispatch(clearpaymentDetails())


                dispatch(fetchPaymentMethods())
                setLoading(false)


            }).catch(err => {
                setLoading(false)
                CommonFunction.message("Something went wrong")
            })
    }

    async function makeAsDefault(cardid) {
        console.log('helllo 323332')
        setLoading(true)
        setisDefmodel(false)
        const cusData = await getLoginInfo()

        api.get('customer/defpaymentcard/' + payMethodInfo.id + "/" + cusData.id + "?platform=" + CommonFunction.getOS() + "&device_name=" + await CommonFunction.getdevicename() + "&ipaddress=" + await CommonFunction.getipaddress())
            .then(function (response) {
                if (response.status == 200) {
                    dispatch(clearpaymentDetails())

                    const data = response.data
                    console.log('dataa ', data)
                    dispatch(fetchPaymentMethods())
                    CommonFunction.message(data.message)
                    setReload(!reload)
                    setChecked('')
                    setPayMethodInfo('')


                    setLoading(false)

                } else {
                    CommonFunction.message("We are unable to process your request at the moment. Please try again later!")
                    setLoading(false)
                }
            }).catch(err => {

                console.log(err.response)
                dispatch(fetchPaymentMethods())
                setModalLoading(false);
                setIsPayModalOpen(false)
                setLoading(false)
                CommonFunction.message("Something went wrong")
            })


    }



    const deleteCard = () => {
        setIsPayModalOpen(false)
        Alert.alert(
            "Alert",
            "Are you sure want to delete this card ?",
            [
                {
                    text: "No",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Yes", onPress: () => deletePayment() }
            ]
        );
    }

    const defaultCard = () => {
        setIsPayModalOpen(false)
        Alert.alert(
            "Alert",
            "Are you sure want to default this card ?",
            [
                {
                    text: "No",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: "Yes", onPress: () => makeAsDefault() }
            ]
        );
    }

    const flipToBack = () => {
        Animated.timing(animatedValue, {
            toValue: 180,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };


    const flipToFront = () => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                    <CommonHeader title={props?.route?.params?.name ? props?.route?.params?.name : 'Payment Methods'} back={'yes'} onBackPress={() => props.navigation.goBack()} />
                    <View style={{ marginStart: 10, marginEnd: 10, }}>

                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={40}
                                marginTop={10}
                                borderRadius={10}
                            />

                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={180}
                                marginTop={10}
                                borderRadius={10}
                            />

                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={40}
                                marginTop={10}
                                borderRadius={10}
                            />


                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: 'row', marginTop: 20 }}
                                >
                                    <View style={{ width: width * 0.95, height: 60, borderRadius: 10 }} />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };

    if (loading1 || paymentloading) {
        return (
            <CardSkeleton />
        )

    }



    return (
        <GradientBackground >
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                <CommonHeader title={paymentcardopen ? 'Add New Payment Method' : props?.route?.params?.name ? props?.route?.params?.name : 'Payment Methods'} back={'yes'} onBackPress={() => {
                    if (paymentcardopen) {
                        setpamentcard(false)
                        enableMenu()
                    } else {
                        props.navigation.goBack()
                    }
                }} />

                <View style={{ flex: 1 }}>


                    {
                        paymentcardopen ?

                            <AddPaymentCard
                                onExit={() => {
                                    setpamentcard(false)
                                    setChecked('')
                                    setPayMethodInfo('')

                                }}
                                disable={(obj) => {
                                    setpamentcard(false)
                                    setChecked('')
                                    setPayMethodInfo('')

                                }}
                            /> :

                            <View style={{ flex: 1 }}>

                                {
                                    0 < paymentMethods.length ?
                                        <ScrollView>



                                            <View style={{ flex: 1 }}>
                                                {
                                                    paymentMethods && 0 < paymentMethods.length &&
                                                    <View style={{ margin: 20 }}>
                                                        <Text style={[{ fontSize: getFontSize(16), fontFamily: fontsFamily.semiboldFont, fontWeight: '600', color: themeColors?.text_primary }]}>Default Payment Card</Text>
                                                    </View>
                                                }

                                                {paymentMethods && paymentMethods.map((payMeth, i) => {

                                                    if (payMeth.default === 'yes') {

                                                        return (
                                                            <Pressable onPress={() => {
                                                                setIsFlipped(!isFlipped)
                                                            }} style={{ marginStart: 15, marginEnd: 15 }}>


                                                                <Animated.View
                                                                    style={{

                                                                        width: '100%',
                                                                        borderRadius: 20,
                                                                        backgroundColor: themeColors?.payment_card_bg,
                                                                        padding: 35,
                                                                        transform: [{ rotateY: frontInterpolate }],
                                                                        backfaceVisibility: 'hidden',
                                                                    }}
                                                                >


                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                                                        <Image
                                                                            source={require('../../../../../../assets/images/sim.png')}
                                                                            style={{ height: 30, width: 45 }}
                                                                        />

                                                                        {/* {cardType !== 'default' && (
                                                                            <PaymentIcon type={cardType} width={40} height={25} />
                                                                        )} */}
                                                                    </View>

                                                                    <Text style={{ marginTop: 20, color: themeColors?.textlight, fontSize: getFontSize(18), fontFamily: fontsFamily.regularFont }}>
                                                                        {'**** **** **** ' + payMeth?.number}
                                                                    </Text>


                                                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                                                        <View style={{ flex: 1 }}>
                                                                            <Text style={{ color: themeColors?.textlight, fontSize: getFontSize(10), fontFamily: fontsFamily.semiboldFont, marginRight: 5 }}>
                                                                                CARD HOLDER
                                                                            </Text>
                                                                            <Text style={{ color: themeColors?.textlight, fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont, marginTop: 5 }}>
                                                                                {payMeth?.name || 'CARD HOLDER'}
                                                                            </Text>
                                                                        </View>
                                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                <Text style={{ color: themeColors?.textlight, fontSize: getFontSize(10), fontFamily: fontsFamily.semiboldFont, marginRight: 5 }}>
                                                                                    VALID
                                                                                </Text>
                                                                                <Text style={{ color: themeColors?.textlight, fontSize: getFontSize(10), fontFamily: fontsFamily.semiboldFont, marginRight: 5 }}>
                                                                                    THRU
                                                                                </Text>
                                                                            </View>
                                                                            <View style={{ marginTop: 5 }}>
                                                                                <Text style={{ color: themeColors?.textlight, fontSize: getFontSize(14), fontFamily: fontsFamily.regularFont }}>
                                                                                    {payMeth?.ExpMonth && payMeth?.ExpYear ? payMeth?.ExpMonth + '/' + payMeth?.ExpYear : 'MM/YY'}
                                                                                </Text>
                                                                            </View>
                                                                        </View>


                                                                    </View>

                                                                </Animated.View>


                                                                <Animated.View
                                                                    style={{
                                                                        position: 'absolute',
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        borderRadius: 20,
                                                                        backgroundColor: themeColors?.payment_card_bg,
                                                                        padding: 20,
                                                                        transform: [{ rotateY: backInterpolate }],
                                                                        backfaceVisibility: 'hidden',
                                                                    }}
                                                                >


                                                                    <View style={{
                                                                        backgroundColor: '#000',
                                                                        height: 40,
                                                                        borderRadius: 5,
                                                                        marginTop: 10
                                                                    }} />


                                                                    <View style={{
                                                                        backgroundColor: themeColors?.textlight,
                                                                        height: 40,
                                                                        marginTop: 30,
                                                                        borderRadius: 5,
                                                                        justifyContent: 'center',
                                                                        alignItems: 'flex-end',
                                                                        paddingHorizontal: 10
                                                                    }}>
                                                                        <Text style={{ color: '#000', fontSize: getFontSize(16), fontFamily: fontsFamily.regularFont }}>
                                                                            ***
                                                                        </Text>
                                                                    </View>

                                                                    <Text style={{ color: themeColors?.textlight, marginTop: 10 }}>
                                                                        CVV
                                                                    </Text>

                                                                </Animated.View>
                                                            </Pressable>
                                                        )
                                                    } else {
                                                        null
                                                    }


                                                }

                                                )
                                                }

                                                {
                                                    paymentMethods && 1 < paymentMethods.length &&
                                                    <View style={{ marginTop: 20, marginStart: 20, }}>
                                                        <Text style={[{ marginTop: 20, fontSize: getFontSize(16), fontFamily: fontsFamily.semiboldFont, color: themeColors?.text_primary }]}>Other Payment Cards</Text>
                                                    </View>
                                                }


                                                <View style={{ flex: 1 }}>
                                                    <ScrollView style={{}}>
                                                        <View>

                                                            {paymentMethods && paymentMethods.map((payMeth, i) => {

                                                                if (payMeth.default !== 'yes') {



                                                                    return (

                                                                        <View key={i}>
                                                                            <TouchableOpacity onPress={() => {

                                                                                setPayMethodInfo(payMeth)
                                                                                if (checked === i) {
                                                                                    setChecked('')
                                                                                } else {
                                                                                    setChecked(i)
                                                                                }

                                                                            }} style={[{ flexDirection: 'row', margin: 10, marginTop: 20, marginStart: 20, padding: 15, borderRadius: 8, justifyContent: 'space-between', backgroundColor: themeColors?.card_list_bg }]} >

                                                                                <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                                                                                    <View style={{ borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                                                                        <View>
                                                                                            <CommonIcon family={'FontAwesome'} name={'credit-card-alt'} size={20} color={themeColors?.bgbtn} />
                                                                                        </View>

                                                                                    </View>

                                                                                    <Text style={[{ marginStart: 20, fontSize: getFontSize(14), color: themeColors?.card_secondary_color }]}>{'**** **** ****'}{payMeth.number}</Text>



                                                                                </View>

                                                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                                    <AntDesign name={checked === i ? 'down' : 'right'} color={themeColors?.card_secondary_color} size={16} />

                                                                                </View>




                                                                            </TouchableOpacity>

                                                                            {
                                                                                checked === i && <View style={{ marginBottom: 10, backgroundColor: themeColors?.card_list_bg, marginHorizontal: 20 }}>



                                                                                    <LabelValueRow label="Default Card" value={CommonFunction.captialize(payMeth?.default.toLowerCase())} color={themeColors?.card_secondary_color} />
                                                                                    <LabelValueRow label="Cardholder Name" value={payMeth?.name} color={themeColors?.card_secondary_color} />
                                                                                    <LabelValueRow label="Expire Month" value={payMeth?.ExpMonth} color={themeColors?.card_secondary_color} />
                                                                                    <LabelValueRow label="Expire Year" value={payMeth?.ExpYear} color={themeColors?.card_secondary_color} />
                                                                                    <LabelValueRow label="Added On" value={formatDateTime(payMeth?.createdAt)} color={themeColors?.card_secondary_color} />

                                                                                    {payMeth.default != "yes" &&
                                                                                        <>

                                                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, paddingBottom: 10 }}>

                                                                                                <TouchableOpacity onPress={() => setisDelmodel(true)} style={[{ width: '40%', borderColor: themeColors.bgbtn, borderWidth: 1, backgroundColor: "transparent", borderRadius: 5, justifyContent: 'center', alignItems: 'center', padding: 10 }]}>
                                                                                                    <Text style={[styles.signUpTitle, { fontSize: getFontSize(14), color: themeColors?.card_secondary_color }]} >Delete</Text>
                                                                                                </TouchableOpacity>
                                                                                                <TouchableOpacity onPress={() => setisDefmodel(true)} style={[{ width: '40%', borderRadius: 5, backgroundColor: themeColors.bgbtn, padding: 10, marginStart: 10 }]}>
                                                                                                    <Text style={[styles.signUpTitle, { fontSize: getFontSize(14), color: 'white', textAlign: 'center' }]} >Set as default</Text>
                                                                                                </TouchableOpacity>


                                                                                            </View>




                                                                                        </>

                                                                                    }

                                                                                </View>
                                                                            }


                                                                        </View>


                                                                    )
                                                                } else {
                                                                    null
                                                                }


                                                            }

                                                            )
                                                            }


                                                        </View>


                                                    </ScrollView>

                                                </View>



                                            </View>



                                        </ScrollView> : <NoRecord />
                                }

                                <CustomModal
                                    visible={isDelmodel}
                                    onClose={() => setisDelmodel(false)}
                                    alertTitle="Alert !"
                                    actionText="Yes"
                                    cancelText="No"
                                    onAction={() => deletePayment()}
                                >
                                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                        Are you sure want to delete this card?
                                    </Text>
                                </CustomModal>

                                <CustomModal
                                    visible={isDefmodel}
                                    onClose={() => setisDefmodel(false)}
                                    alertTitle="Alert !"
                                    actionText="Yes"
                                    cancelText="No"
                                    onAction={() => makeAsDefault()}
                                >
                                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                        Are you sure want to default this card ?
                                    </Text>
                                </CustomModal>


                                <TouchableOpacity style={[{ marginBottom: 40, marginTop: 20, height: 50, backgroundColor: themeColors.bgbtn, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, borderRadius: 10 }]} onPress={() => setpamentcard(true)}>
                                    <Text style={[{ color: themeColors.btn_text_color, fontSize: getFontSize(14), fontFamily: fontsFamily.semiboldFont }]}>Add New Payment Method</Text>
                                </TouchableOpacity>

                            </View>
                    }



                </View>
            </View>
        </GradientBackground>
    )
}

export default PaymentMethod


const LabelValueRow = ({ label, value, color }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4, marginHorizontal: 40, marginTop: 15 }}>
            <Text style={{ color: color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>
                {label}
            </Text>
            <Text style={{ color: color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>
                {value}
            </Text>
        </View>
    );
};


const styles = StyleSheet.create({})