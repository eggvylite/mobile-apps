import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm } from 'react-hook-form';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { Divider, RadioButton, Switch } from 'react-native-paper';
import MonthPicker from 'react-native-month-year-picker';
import getStyles from '../../../styles';
import CommonIcon from '../../../component/Commonicons';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import { hp } from '../../../../utill/responsive';
import { useBottomSheet } from '../../../component/GlobalBottomSheet';
import SubmitButton from '../../../component/SubmitButton';
import { useDispatch, useSelector } from 'react-redux';
import GradientBackground from '../../../component/GradientBackground';
import CommonFunction from '../../../../utill/CommonFunction';
import { fetchgoallistAccount } from '../../../../redux/slices/goalSlice';
import { fetchgetAccount } from '../../../../redux/slices/getmanulaccountSlice';
import { imagecall } from '../../../../utill/utills';
import CommonHeader from '../../../component/CommonHeader';
import { fetchGoalhis } from '../../../../redux/slices/goalhisSlice';
import { content } from '../../../../constants/content';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import LoaderButton from '../../../component/LoaderButton';
import CloudImage from '../../../../utill/CloudImage';
import api from '../../../../service/api';



const { width } = Dimensions.get('window');

const circleSize = width * 0.25;
const imageSize = circleSize * 0.8;


const Takeout = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const insets = useSafeAreaInsets();
    const [isEnabled, setIsEnabled] = useState(false);
    const progress = useSharedValue(0);
    const [date, setDate] = useState(new Date());

    const { openSheet, closeSheet } = useBottomSheet();
    const [activeaccount, setactiveaccount] = useState('')
    const { item: itemdata, type } = route?.params
    const dispatch = useDispatch()
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [record, setrecord] = useState('')
    const [registerdata, setregisterdata] = useState('')
    const sheetRef = useRef();
    const [loading, setloading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({ mode: 'onBlur' });



    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });



    const openCustomSheet = (data) => {


        openSheet(() => (

            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                        Select Account
                    </Text>
                    <Pressable

                        onPress={() => closeSheet()}
                        style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                        <CommonIcon
                            name={'clear'}
                            family={'MaterialIcons'}
                            color={themeColors?.iconcolor}
                        />
                    </Pressable>

                </View>
                <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />
                <View style={{ flex: 1 }}>

                    <ScrollView>
                        {
                            record?.bank_contributions?.slice()?.reverse()?.map((item, index) => {
                                // var number = ''
                                // if (item?.account_number) {
                                //     number = ' - XX' + CommonFunction.slicenum(item?.account_number)
                                // } else {
                                //     number = ' - ' + content.manual
                                // }
                                return (
                                    <Pressable

                                        onPress={() => {
                                            setactiveaccount(item)
                                            // handleInputchage(item?.)

                                            setregisterdata({
                                                ...registerdata, balance: item?.total_amount, bankaccount: item?.bankaccount_id
                                            })
                                            closeSheet()
                                        }}
                                        style={{ flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 10, marginVertical: 10, alignItems: 'center', justifyContent: 'center' }} key={index}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ fontSize: getFontSize(14), marginBottom: 10, color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont, }}>
                                                {displayAccount(item)}
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: getFontSize(14), marginBottom: 10, color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont, }}>
                                                {storedata?.currency}{CommonFunction.formatamount(item?.total_amount)}
                                            </Text>
                                        </View>


                                    </Pressable>
                                )
                            })
                        }
                    </ScrollView>



                </View>



            </View>
        )


            ,
            650,
            {
                backgroundColor: '#f2f2f2',
                draggableIconColor: '#FF6347',
            }
        );
    };


    useEffect(() => {
        if (itemdata) {
            // console.log(itemdata)
            setrecord(itemdata)
        }
    }, [itemdata])




    const handleInputchage = (name, value) => {
        setregisterdata({ ...registerdata, [name]: value })
    }





    useEffect(() => {
        reset(registerdata)
    }, [registerdata])






    async function WithdrewService(params) {

        setloading(true)

        console.log(registerdata)

        api.post('dashboard/goalwithdraw/' + record?._id, registerdata).then((res) => {
            console.log(res.data)
            CommonFunction.message(res.data.message)
            dispatch(fetchGoalhis())
            dispatch(fetchgoallistAccount())
            dispatch(fetchgetAccount())
            setloading(false)
            // navigation.replace('Goal')
            navigation.goBack()


        }).catch((err) => {
            console.log(err.response.data)
            console.log(err)
            CommonFunction.message(err.response.data?.message)
            setloading(false)
        })

    }



    useEffect(() => {
        if (record) {
            const activeaccount = 0 < record?.bank_contributions?.length ? record?.bank_contributions[0] : 0

            setactiveaccount(activeaccount)
            const loadData = async () => {
                const data = {
                    ...registerdata,
                    bankaccount: 0 < record?.bank_contributions?.length ? record?.bank_contributions[0].bankaccount_id : [{ lable: 'No Account', value: 'No account' }],
                    customer_id: storedata?.id,
                    balance: 0 < record?.bank_contributions?.length ? record?.bank_contributions[0].total_amount : [{ lable: 'No Account', value: 'No account' }],
                    wdamount: '',
                    type: type,
                    spent: record?.spent,
                    savedamount: record?.savedamount,
                    platform: CommonFunction.getOS(),
                    device_name: await CommonFunction.getdevicename(),
                    ipaddress: await CommonFunction.getipaddress()

                }
                setregisterdata(data)
            }
            loadData()

        }
    }, [record])




    useEffect(() => {
        register('bankaccount', {
            required: 'Please select an account ',
            validate: () => {




                return true
            },
        });
    }, [register, activeaccount?.total_amount, registerdata]);





    const savegoalamount = 0 < record?.bank_contributions?.length ? record?.bank_contributions?.reduce(
        (sum, row) => sum + Number(row.total_amount || 0),
        0
    ) : 0




    const isEmpty = !record?.wdamount;

    const displayAccount = (accrec) => {
        var acname = 'Select Account'
        if (accrec) {
            var number = ' - ' + content.manual
            if (accrec?.account_number) {
                number = ' - XX' + CommonFunction.slicenum(accrec?.account_number)
            }
            acname = accrec?.bank_name+number
        }

        return acname

    }


    return (
        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>

                <CommonHeader back={'yes'} title={type === 'spend' ? 'Spend a Custom Amount' : 'Withdraw From Goal'} onBackPress={() => navigation.goBack()} />

                <KeyboardAvoidingView style={appstyle.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <View style={appstyle.container}>



                        <Animated.ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingTop: 10,
                                paddingHorizontal: 10,
                                paddingBottom: insets.bottom + 30,
                            }}
                        >

                            <View style={{ backgroundColor: themeColors?.card_list_bg, padding: 20, borderRadius: 5 }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont }]}>Saved so far</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont }]}>Available to withdraw</Text>
                                    </View>

                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>

                                    <View style={[styles.bannercontainer, { backgroundColor: themeColors?.cardbg, marginRight: 5 }]}>
                                        <Text
                                            style={[
                                                styles.cardText,
                                                { color: themeColors?.card_text_color },
                                            ]}
                                        >
                                            {storedata?.currency}
                                            {CommonFunction.formatamount(
                                                (Number(record?.spent ?? 0) + Number(savegoalamount ?? 0))
                                            )}
                                        </Text>
                                    </View>
                                    <View style={[styles.bannercontainer, { marginStart: 5, backgroundColor: themeColors?.cardbg }]}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_text_color }]}>{storedata?.currency}{CommonFunction.formatamount(record?.savedamount)}</Text>
                                    </View>

                                </View>

                            </View>

                            <View style={{ marginTop: width * 0.2 }}>
                                <View
                                    style={{
                                        height: width * 0.2,
                                        backgroundColor: themeColors?.card_list_bg,
                                        borderRadius: 5,
                                        marginHorizontal: width * 0.01,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >

                                    <View
                                        style={{
                                            height: circleSize,
                                            width: circleSize,
                                            backgroundColor: themeColors?.cardbg,
                                            borderRadius: circleSize / 2,
                                            position: 'absolute',
                                            alignSelf: 'center',
                                            top: -(circleSize / 2),
                                            zIndex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {
                                            record?.emoji ? <Text style={{ fontSize: imageSize }}>
                                                {
                                                    record?.emoji
                                                }
                                            </Text> :
                                                record?.image &&
                                                <CloudImage
                                                    style={{
                                                        height: imageSize,
                                                        width: imageSize,
                                                        resizeMode: 'contain'
                                                    }}
                                                    page='goal'
                                                    cloudSource={record?.image} />

                                        }
                                    </View>
                                </View>

                                <View style={{
                                    backgroundColor: themeColors?.card_list_bg,
                                    borderRadius: 5,
                                    marginHorizontal: 10,
                                    justifyContent: 'center',
                                    paddingBottom: 20
                                }}>
                                    <View style={{ alignItems: 'center' }}>

                                        <Text style={{ marginTop: 10, color: themeColors?.card_text_color }}>Enter the Amount to Withdraw</Text>

                                        <View
                                            style={{
                                                marginTop: hp(7),
                                                justifyContent: 'center', alignItems: 'center', flex: 1
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row', alignItems: 'center'


                                                }}
                                            >

                                                <Text
                                                    style={{
                                                        fontSize: getFontSize(32),
                                                        fontFamily: fontsFamily.boldFont,
                                                        color: themeColors?.card_text_color,

                                                    }}
                                                >
                                                    {storedata?.currency}
                                                </Text>



                                                <View style={{}}>
                                                    <TextInput
                                                        placeholder="0.00"
                                                        keyboardType="decimal-pad"
                                                        placeholderTextColor="grey"
                                                        maxLength={7}
                                                        value={registerdata?.wdamount}
                                                        onChangeText={(val) => handleInputchage("wdamount", parseFloat(val))}

                                                        style={{
                                                            fontSize: getFontSize(38),
                                                            fontFamily: fontsFamily.boldFont,
                                                            color: themeColors?.inputsecondary,
                                                            fontSize: 32,
                                                            marginLeft: 5,
                                                            width: Math.max(80, String(registerdata?.wdamount ?? '').length * 20)
                                                            // backgroundColor:'#000',

                                                        }}
                                                        {...register("wdamount", {
                                                            required: "Enter an amount to withdraw",
                                                            validate: {
                                                                numeric: (v) =>
                                                                    !isNaN(Number(v)) || 'Must be a number',

                                                                minVal: (v) =>
                                                                    Number(v) > 0 || 'Withdraw Amount must be greater than 0',

                                                                decimalLimit: (v) =>
                                                                    /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',
                                                                maxamount: (v) => {
                                                                    const account = Number(activeaccount?.total_amount || 0);
                                                                    const input = Number(v);

                                                                    if (input > account) {
                                                                        return "Amount exceeds account balance";
                                                                    }
                                                                    return true; // ✅ important
                                                                },

                                                                maxVal: (v) => {
                                                                    const input = Number(v);
                                                                    const remaining = savegoalamount;

                                                                    return (
                                                                        input <= remaining ||
                                                                        `Cannot contribute more than the goal amount(${remaining})`
                                                                    );
                                                                }

                                                            }

                                                        })}

                                                    />
                                                </View>
                                            </View>
                                            {errors.wdamount && <Text style={appstyle.errortext}>{errors.wdamount.message}</Text>}
                                        </View>
                                    </View>



                                    <Pressable
                                        onPress={() => {

                                            if (0 < record?.bank_contributions.length) {
                                                openCustomSheet();
                                            }

                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            marginTop: 40,
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            padding: 5,
                                            marginHorizontal: 10,
                                            borderColor: errors.bankaccount
                                                ? 'red'
                                                : themeColors?.btnborder,
                                        }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: getFontSize(10), marginBottom: 5, color: themeColors?.inputsecondary, }}>Withdraw to</Text>
                                            <Text style={[styles?.innerboldtext, { color: themeColors?.inputsecondary, }]}>
                                                {displayAccount(activeaccount)}
                                            </Text>
                                        </View>

                                        <View style={{  alignItems: 'flex-end', justifyContent: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                                <Text style={[styles?.innerboldtext, { color: themeColors?.inputsecondary }]}>Max </Text>
                                                <Text style={[styles?.innerboldtext, { color: themeColors?.inputsecondary }]}>
                                                    {storedata?.currency}
                                                    {(Number(activeaccount?.total_amount) || 0).toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                    </Pressable>

                                    {errors.bankaccount && (
                                        <Text style={{ color: 'red', marginHorizontal: 10 }}> {errors.bankaccount.message}</Text>
                                    )}

                                </View>
                            </View>



                            <View style={{ marginTop: hp(10), alignItems: 'center' }}>
                               
                                {
                                    loading ? <LoaderButton /> : <TouchableOpacity style={[appstyle.btnbg, { padding: 15 }]} onPress={handleSubmit(WithdrewService)}>
                                        <Text style={appstyle.btnText}>Submit</Text>

                                    </TouchableOpacity>
                                }
                            
                            </View>



                        </Animated.ScrollView>
                    </View>
                </KeyboardAvoidingView>

            </View>
        </GradientBackground>


    )
}

export default Takeout

const styles = StyleSheet.create({
    headerWrapper: { padding: 10, backgroundColor: "#FEF7FF", flexDirection: "row" },
    titleText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) },

    dropdownText: {
        fontFamily: fontsFamily.boldFont,
        fontSize: getFontSize(14),
    },
    rowcontainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
    },
    datecardcontainer: {
        flexDirection: 'row', height: 50, backgroundColor: '#F2E7FF', marginTop: 20, borderRadius: 5
    },
    cardText: {
        fontFamily: fontsFamily.semiboldFont, color: '#000', fontSize: getFontSize(14),
    },
    bannercontainer: {
        flex: 1, alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'center', borderRadius: 5
    }
})