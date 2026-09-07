import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, StatusBar, TouchableOpacity, useWindowDimensions, Alert, Image, Modal, Pressable, Platform, StyleSheet, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from "react-native-raw-bottom-sheet";
import { useBackHandler } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import AddPaymentCard from './AddPaymentCard';
import CommonFunction from '../../utill/CommonFunction';
import GradientBackground from './GradientBackground';
import Statusbar from './Statusbar';
import Loader from './Loader';
import CommonHeader from './CommonHeader';
import { getFontSize } from '../../constants/Font';
import { fetchCustomer } from '../../redux/slices/customerSlice';
import { fetchadvanceActiveSubscription, fetchOutstanding } from '../../redux/slices/advenceSlice';
import { fetchAdvancesListHistory } from '../../redux/slices/advanceTransSlice';
import getStyles from '../styles';
import { fetchPaymentMethods } from '../../redux/slices/paymentSlice';
import { resetAdvTransaction } from '../../redux/slices/advanceTransSlice';
import { resetTransaction } from '../../redux/slices/transactionSlice';
import { updateAuthdata } from '../../redux/slices/authSlice';
import { fontsFamily } from '../../constants/fontsFamily';
import CommonIcon from './Commonicons';
const { width, height } = Dimensions.get('window');
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import PaymentCardlist from './PaymentCardlist';
import { fetchNotication } from '../../redux/slices/notificationSlice';
import { getLoginInfo } from '../../service/storage';
import api from '../../service/api';
import ListPlan from './ListPlan';


function Plan(props) {
    const { height, width } = useWindowDimensions();
    const [loading, setLoading] = useState(false);
    const [cusLoginInfo, setCusLoginInfo] = useState(null);
    const [cusData, setCusData] = useState(null);
    const [plans, setPlans] = useState(null);
    const [chosenPlan, setChosenPlan] = useState('');
    const [currentPlan, setCurrentPlan] = useState(props?.route?.params && props?.route?.params?.currentPlan);
    const [migrInfo, setMigrInfo] = useState(null);
    const [reload, setReload] = useState(false);
    const refRBSheet = useRef(null)
    const creditCardRef = useRef()
    const refRBCardSheet = useRef(null);
    const [cardOpen, setcardOpen] = useState(false)
    const [updatecard, setupdatecard] = useState('')
    const [updatebtn, setupdatebtn] = useState(false)
    const [purchaseamt, setpurchaseamt] = useState('')
    const [purchaseplan, setpurchaseplan] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [planfeature, setplanfeatue] = useState([])
    const [cardlenth, setcardlength] = useState('')
    const dispatch = useDispatch()
    const { themedata } = useSelector((state) => state.appcolor);
    const { plandata, planloading, planerror } = useSelector((state) => state.chooseplan);
    const { paymentMethods, paymentloading, defcardpm } = useSelector(state => state.payment);
    const { cusDetails, error } = useSelector((state) => state.customer);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [plan, setPlan] = useState('')
    const [cardno, setCardno] = useState('')



    useEffect(() => {
        if (plandata) {
            setplanfeatue(plandata?.features)
            setPlans(plandata.list);
        }

    }, [plandata])

    useEffect(() => {
        if (cusDetails) {
            setCusData(cusDetails)
        }

    }, [cusDetails])


    useEffect(() => {
        if (0 < paymentMethods.length) {
            const defcard = paymentMethods?.find((obj) => obj.default === 'yes')
            setCardno(defcard?.pm_id)
            // state.defcardpm = defcard?.pm_id || ''
        }

    }, [paymentMethods])

    const backActionHandler = () => {
        props.navigation.goBack()
        return true;

    };
    useBackHandler(backActionHandler)





    function choosePlan(plan) {
        const data = {
            ...plan, pmcard: cardno, type: 'pay', amount: plan?.partmonthly,
        }



        setPlan(data)


        if (0 < paymentMethods.length) {
            refRBCardSheet?.current?.open()
        } else {
            setcardOpen(true)
            if (props?.screen !== 'subscription') {
                props?.addPaymentCard('add')
            }


        }
    }



    const purchasePlan = async (obj) => {

        var info = await getLoginInfo()
        setLoading(true)
        refRBCardSheet.current.close()

        const payload = {
            amount: plan?.partmonthly.toString(),
            customer_id: info?.id,
            pm: obj.cardno,
            plan_id: plan.id,
            type: "monthly",
            device_name: CommonFunction.getdevicename(),
            platform: CommonFunction.getOS(),
            ipaddress: await CommonFunction.getipaddress(),
        }

        console.log('pay load ', payload)

        // info.plan = 'Yes';




        api.post('customer/paymentcapture', payload)
            .then(function (response) {
                const data = response.data
                console.log(data)
                console.log('enter a5')
                api.get("customer/" + storedata.id).then((res) => {
                    if (res.data?.subscription === 'Yes') {
                        const infodata = {
                            ...info, plan: res?.data?.subscription
                        }
                        CommonFunction.storeData('@cusLoginInfo', infodata)
                        dispatch(updateAuthdata(infodata))
                        dispatch(fetchCustomer())
                        CommonFunction.message("Your subscription is now active!",)
                        props.onChange('completed')

                    } else {
                        dispatch(fetchNotication(10))
                        dispatch(resetTransaction())
                        props.onChange()
                        Alert.alert(
                            'Alert!',
                            'Something went wrong. Please contact the administrator.',
                            [{ text: 'OK' }]
                        );
                    }




                }).catch((err) => {
                    console.log(err.response.data)
                    setLoading(false)
                })



                // if (props.screen === 'subscription') {
                //     setLoading(false)
                //     props.navigation.replace("Subscription")

                // } else {

                //     props.onChange('completed')
                // }




            }).catch(err => {
                setLoading(false);
                console.log(err.response.data)
                dispatch(resetTransaction())
                Alert.alert(
                    "Subscription Failed",
                    err?.response?.data?.Message || "Something went wrong"
                );
                // CommonFunction.message(err.response.data.Message)


            })

    }




    return (

        <GradientBackground>
            <Statusbar />

            {
                loading ? <Loader label={"Loading"} /> :
                    cardOpen ?
                        <AddPaymentCard
                            screen='plan'
                            amount={purchaseamt}
                            onExit={() => {
                                if (0 < paymentMethods?.length) {
                                    refRBCardSheet?.current?.open()
                                }
                                if (props?.screen !== 'subscription') {
                                    props?.addPaymentCard()
                                }

                                setcardOpen(false)

                            }}
                            disable={(obj) => {
                                const data = {
                                    ...plan, pmcard: obj
                                }


                                setPlan(data)
                                setCardno(obj)
                                refRBCardSheet?.current?.open()
                                if (props?.screen !== 'subscription') {
                                    props?.addPaymentCard()
                                }
                                setcardOpen(false)
                            }}
                        /> :
                        <View style={{ flex: 1 }}>

                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                                style={{ flex: 1, margin: 10 }}>

                                {plans?.length &&
                                    <ScrollView snapToInterval={width * 0.65 + 20}
                                        showsVerticalScrollIndicator={false}
                                    >

                                        {

                                            plans.map((plan, i) => {
                                                return (
                                                    <ListPlan
                                                        data={plan}
                                                        feature={planfeature}
                                                        key={i}
                                                        postion={i}
                                                        freeTrial={cusData.freetrial}
                                                        customer={cusData}
                                                        onPress={() => choosePlan(plan)
                                                        }></ListPlan>
                                                )

                                            }

                                            )}


                                    </ScrollView>}

                            </ScrollView>
                        </View>
            }


            <RBSheet
                ref={refRBCardSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                openDuration={250}
                height={500}
                useNativeDriver={true}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },


                }}>



                <View style={{ flex: 1, padding: 10, borderRadius: 30, backgroundColor: themeColors?.cardbg }}>
                    <PaymentCardlist
                        data={plan}
                        addCard={() => {
                            setcardOpen(true)
                            refRBCardSheet?.current?.close()
                        }}
                        onCloseSheet={() => {
                            refRBCardSheet?.current?.close()
                            setcardOpen(false)
                        }}
                        onComplete={(obj) => {
                            purchasePlan(obj)
                        }}
                    />
                    {/* <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.signUpsubTitle, { textAlign: 'left' }]}>
                                Select Payment Method
                            </Text>

                        </View>
                        <View style={{ justifyContent: 'center', top: 10, end: 5 }}>
                            <Pressable

                                onPress={() => refRBCardSheet.current.close()}
                                style={{ backgroundColor: themeColors?.iconbg, borderRadius: 30, padding: 5 }}>
                                <CommonIcon
                                    name={'clear'}
                                    family={'MaterialIcons'}
                                    color={themeColors?.iconcolor}
                                    size={20}
                                />
                            </Pressable>

                        </View>

                    </View>


                    {
                        paymentloading ?
                            <PaymentCardSkeleton /> :
                            <ScrollView>



                                {
                                    paymentMethods.map((value, key) => {
                                        return (
                                            <Pressable
                                                key={key}
                                                onPress={() => {

                                                    setcardno(value.pm_id)
                                                }}
                                                style={{ borderColor: cardno === value.pm_id  ? themeColors?.bgbtn: themeColors?.iconbg, borderWidth: 1, borderRadius: 10, flexDirection: 'row', padding: 15, marginTop: key === 0 ? 20 : 15 }}
                                            >
                                                <View>
                                                    <CommonIcon family={'FontAwesome'} name={'credit-card-alt'} size={20} color={themeColors?.bgbtn} />
                                                </View>
                                                <View style={{ flex: 1, justifyContent: 'center', marginStart: 10, }}>
                                                    <Text style={[styles.signUpTitle, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(16), color: themeColors?.text_primary }]}>XXXX-XXXX-XXXX-{value.number} </Text>

                                                </View>
                                                {
                                                    value.default === 'yes' &&
                                                    <View style={{ marginEnd: 20, backgroundColor: themeColors?.success, alignItems: 'center', justifyContent: 'center', padding: 3, paddingStart: 8, paddingEnd: 8, borderRadius: 10 }}>
                                                        <Text style={[styles.signUpTitle, { fontFamily: fontsFamily.regularFont, fontSize: getFontSize(12), color: '#fff' }]}>default </Text>
                                                    </View>
                                                }



                                                <View style={{ justifyContent: 'center', marginEnd: 10 }}>

                                                    {
                                                        cardno === value.pm_id ?
                                                            <CommonIcon family={'FontAwesome'} name='dot-circle-o' color={themeColors?.bgbtn} size={23} />
                                                            :
                                                            <View style={{ height: 20, width: 20, borderWidth: 2, borderRadius: 50, borderColor: themeColors?.bgbtn, justifyContent: 'center', alignItems: 'center' }}>


                                                            </View>
                                                    }
                                                </View>

                                            </Pressable>
                                        )
                                    })
                                }
                            </ScrollView>

                    }


                    <View style={{ flexDirection: 'row', margin: 10, marginBottom: 20 }}>

                        <TouchableOpacity style={{ backgroundColor: 'transparnt', padding: 13, marginEnd: 10, borderRadius: 8, flex: 1, alignItems: 'center', borderColor: themeColors?.bgbtn, borderWidth: 1 }}
                            onPress={() => {
                                setcardOpen(true)
                                props.addPaymentCard('add')
                                refRBCardSheet?.current?.close()
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center' }}>
                                    <CommonIcon name="plus" family="AntDesign" size={18} color={themeColors?.bgbtn} />
                                </View>

                                <View style={{ marginStart: 5, justifyContent: 'center' }}>
                                    <Text style={[styles.filterapplycancelBtnTxt, { color: themeColors?.bgbtn }]}>Add Card</Text>
                                </View>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: themeColors.bgbtn, padding: 13, marginStart: 10, borderRadius: 8, flex: 1, alignItems: 'center', }} onPress={() => {
                            purchasePlan()
                        }}>
                            <View >
                                <Text style={[styles.filterapplycancelBtnTxt]}>Pay {storedata?.currency}{CommonFunction.formatamount(plan?.partmonthly || 0)}</Text>


                            </View>
                        </TouchableOpacity>
                    </View> */}







                </View>

            </RBSheet>

        </GradientBackground>
    )
}





export default Plan