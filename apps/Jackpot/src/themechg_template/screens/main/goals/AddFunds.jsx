
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { useForm } from 'react-hook-form';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { Divider, RadioButton, Switch } from 'react-native-paper';
import MonthPicker from 'react-native-month-year-picker';
import getStyles from '../../../styles';
import CommonIcon from '../../../component/Commonicons';
import { fontsFamily } from '../../../../constants/fontsFamily';
import { getFontSize } from '../../../../constants/Font';
import { useBottomSheet } from '../../../component/GlobalBottomSheet';
import SubmitButton from '../../../component/SubmitButton';
import { useDispatch, useSelector } from 'react-redux';
import GradientBackground from '../../../component/GradientBackground';
import CommonHead from '../../../component/CommonHead';
import { fetchgoalAccount, fetchgoallistAccount } from '../../../../redux/slices/goalSlice';
import moment from 'moment';
import CommonFunction from '../../../../utill/CommonFunction';
import LoaderButton from '../../../component/LoaderButton';
import { fetchGoalhis } from '../../../../redux/slices/goalhisSlice';
import { content } from '../../../../constants/content';
import { fetchgetAccount } from '../../../../redux/slices/getmanulaccountSlice';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import CloudImage from '../../../../utill/CloudImage';
import api from '../../../../service/api';



const { width } = Dimensions.get('window');
const circleSize = width * 0.25;
const imageSize = circleSize * 0.8;


const AddFunds = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const insets = useSafeAreaInsets();
    const [isEnabled, setIsEnabled] = useState(false);
    const progress = useSharedValue(0);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState('no');
    const { openSheet, closeSheet } = useBottomSheet();
    const [activeaccount, setactiveaccount] = useState('')
    const itemvalue = route?.params?.item
    const [record, setrecord] = useState('')
    const dispatch = useDispatch()
    const { goalaccount } = useSelector((state) => state.goal);
    const [bankaccount, setbankaccount] = useState([])
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
        mode: 'onBlur',

    });
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [contriptiondata, setcontriptiondata] = useState('')
    const [loading, setLoading] = useState(false)


    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });

    useEffect(() => {
        if (goalaccount.length === 0) {
            dispatch(fetchgoalAccount())
        }

    }, [])

    useEffect(() => { reset(contriptiondata) }, [contriptiondata])

    const contributeamount = (startdate, targetdatee, amount, type) => {
        var contributeamt = 0
        if (startdate && targetdatee) {
            const startdata = convertDate(startdate)
            const targetdate = convertDate(targetdatee)
            const startmonth = moment.utc(startdata).startOf('month');
            const targetmonth = moment.utc(targetdate).startOf('month')
            const monthcount = targetmonth.diff(startmonth, 'months') + 1;
            var targetamount = amount ? amount : 0
            console.log(targetamount, startmonth.toISOString(), targetmonth.toISOString())
            var contributeamt = targetamount / monthcount
            if (0 < contributeamt) {
                contributeamt = contributeamt
            } else {
                contributeamt = 0
            }

        }
        // if(type !== 'intial') {
        //   setrecord({...record,contribution: parseFloat(contributeamt).toFixed(2) })
        // }


        return contributeamt

    }



    const convertDate = (chdate) => {
        const input = chdate;
        const [year, month] = input.split("-");

        const formatted = new Date(Date.UTC(year, month - 1, 1));
        return formatted
    }


    useEffect(() => {
        if (itemvalue) {
            var contributeamt = contributeamount(itemvalue?.startdate, itemvalue?.targetdate, itemvalue?.amount);
            const update = {
                ...itemvalue, contribution: parseFloat(contributeamt).toFixed(2)
            }
            setrecord(update)
        }
    }, [itemvalue])


    const handleInputChange = (name, value) => {
        setcontriptiondata({ ...contriptiondata, [name]: value });
    };


    useEffect(() => {
        if (record) {
            const loadData = async () => {
                const data = {
                    amount: '',
                    bankaccount: '',
                    goal_id: record?._id,
                    customer_id: storedata?.id,
                    savedamount: record?.savedamount,
                    platform: CommonFunction.getOS(),
                    device_name: await CommonFunction.getdevicename(),
                    ipaddress: await CommonFunction.getipaddress()
                }
                setcontriptiondata(data)

            }

            loadData()

        }
    }, [record])




    useEffect(() => {
        if (0 < goalaccount.length) {
            let arrey = []

            goalaccount.forEach(element => {
                var number = ''
                if (element?.account_number) {
                    number = ' - XX' + CommonFunction.slicenum(element?.account_number)
                } else {
                    number = ' - ' + content.manual
                }
                var amount = ''
                if (0 < element.balance) {
                    amount = storedata?.currency + CommonFunction.formatamount(element.balance)
                } else {
                    amount = '-' + storedata?.currency + CommonFunction.formatamount(Math.abs(element.balance))
                }
                arrey.push({
                    label: element.type + ' ' + number + ' (' + amount + ') ',
                    value: element._id,
                    balance: element.balance,

                })

            });
            setbankaccount(arrey)
        }
    }, [goalaccount])




    async function contriputionService(params) {
        // console.log(contriptiondata,'save amount')
        setLoading(true)
        api.post('dashboard/goalcontribution', contriptiondata).then((res) => {
            console.log(res.data)
            // navigation.replace('Goal')
            CommonFunction.message(res?.data?.message ?? '')
            navigation.goBack()
            dispatch(fetchGoalhis())
            dispatch(fetchgetAccount())
            dispatch(fetchgoallistAccount())
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
            console.log(err.response.data)
            console.log(err)

        })
    }




    return (

        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>

                <CommonHead title={'Add Funds'} back={'yes'} navigation={navigation} onBackPress={() => navigation.goBack()} />

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
                                        <Text style={[styles.cardText, { color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont, textAlign: 'center' }]}>Monthly Contribution</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont }]}>Current Savings</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', alignItems: 'center' }}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_secondary_color, fontFamily: fontsFamily.regularFont }]}>Still to save</Text>
                                    </View>
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>

                                    <View style={[styles.bannercontainer, { backgroundColor: themeColors?.cardbg, marginRight: 5 }]}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_text_color }]}>{storedata?.currency}{CommonFunction?.formatamount(record?.contribution)}</Text>
                                    </View>
                                    <View style={[styles.bannercontainer, { marginStart: 5, backgroundColor: themeColors?.cardbg }]}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_text_color }]}>{storedata?.currency}{CommonFunction?.formatamount(record?.spent + record?.savedamount)}</Text>
                                    </View>
                                    <View style={[styles.bannercontainer, { marginStart: 5, backgroundColor: themeColors?.cardbg }]}>
                                        <Text style={[styles.cardText, { color: themeColors?.card_text_color }]}>{storedata?.currency}{CommonFunction?.formatamount((record?.amount || 0) - (record?.savedamount || 0) - (record?.spent || 0))}</Text>
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
                                            // elevation: 5,
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
                                    <View style={{ alignItems: 'center', }}>
                                        <View style={{ marginBottom: 20 }}>
                                            <Text style={{ marginTop: 5, color: themeColors?.card_text_color, fontFamily: fontsFamily?.boldFont, fontSize: getFontSize(16) }}>{itemvalue?.name}</Text>
                                        </View>
                                        <Text style={{ marginTop: 5, color: themeColors?.card_text_color }}>Enter the contribution amount</Text>


                                        <View
                                            style={{
                                                marginTop: 20,
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
                                                        value={contriptiondata?.amount}
                                                        onChangeText={(val) => handleInputChange("amount", parseFloat(val))}

                                                        style={{
                                                            fontSize: getFontSize(38),
                                                            fontFamily: fontsFamily.boldFont,
                                                            color: themeColors?.inputsecondary,
                                                            fontSize: 32,
                                                            marginLeft: 5,
                                                            width: Math.max(80, String(contriptiondata?.amount ?? '').length * 20)
                                                            // backgroundColor:'#000',

                                                        }}
                                                        {...register('amount', {
                                                            required: 'Contribution amount is required',
                                                            validate: {
                                                                numeric: (v) =>
                                                                    !isNaN(Number(v)) || 'Must be a number',

                                                                minVal: (v) =>
                                                                    Number(v) > 0 || 'Amount must be greater than 0',
                                                                decimalLimit: (v) =>
                                                                    /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',

                                                                maxVal: (v) => {
                                                                    const input = Number(v);
                                                                    const goalAmount = Number(record?.amount || 0);
                                                                    const savedAmount = Number(record?.savedamount || 0);
                                                                    const spentAmount = Number(record?.spent || 0);

                                                                    const remaining = goalAmount - savedAmount - spentAmount;

                                                                    return (
                                                                        input <= remaining ||
                                                                        `Cannot contribution more than goal amount ${storedata?.currency}${CommonFunction.formatamount(remaining)}`
                                                                    );
                                                                }
                                                            }
                                                        })}


                                                    />
                                                </View>
                                            </View>
                                            {errors.amount && <Text style={appstyle.errortext}>{errors.amount.message}</Text>}
                                        </View>
                                    </View>



                                    <View style={{ marginTop: 40 }}>
                                        <View style={{
                                            paddingHorizontal: 3,
                                            marginHorizontal: 20,
                                            marginBottom: 15, flexDirection: 'row'
                                        }}>
                                            <View>
                                                <Text style={{ color: themeColors?.card_text_color }}>Take from account</Text>
                                            </View>
                                            <Text style={appstyle.require}>*</Text>
                                        </View>

                                        <Dropdown
                                            data={bankaccount}
                                            labelField="label"
                                            placeholderStyle={{ color: 'grey' }}
                                            valueField="value"
                                            placeholder="Select Account"
                                            selectedTextStyle={{ color: themeColors?.inputsecondary, }}
                                            itemTextStyle={{ color: themeColors?.inputsecondary, }}
                                            containerStyle={{ backgroundColor: themeColors?.inputprimary }}
                                            activeColor={themeColors?.inputprimary}
                                            style={{
                                                flex: 1,
                                                // borderWidth: 1,
                                                backgroundColor: themeColors?.inputprimary,
                                                // borderColor: themeColors.dashboardBannerbgColor,
                                                borderRadius: 5,
                                                paddingHorizontal: 10,
                                                height: 45, marginHorizontal: 20
                                            }}
                                            value={activeaccount.account}
                                            {...register("bankaccount", {
                                                required: 'Account is required.',
                                                validate: (val) => {
                                                    const account = bankaccount?.find(
                                                        (item) => item?.value === val
                                                    );

                                                    if (!account) return "Invalid bank account";

                                                    if (account.balance <= 0)
                                                        return "Your account balance is low";

                                                    if (Number(contriptiondata?.amount) > Number(account.balance))
                                                        return "Insufficient balance";

                                                    return true;
                                                }
                                            })}
                                            onChange={(e) => {

                                                handleInputChange('bankaccount', e.value)

                                            }}
                                        />

                                    </View>

                                    <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', marginStart: 10 }}>
                                        {errors.bankaccount && <Text style={appstyle.errortext}>{errors.bankaccount.message}</Text>}
                                    </View>

                                </View>
                            </View>





                            <View style={{ marginTop: 30, alignItems: 'center' }}>
                                {
                                    loading ?
                                        <LoaderButton /> :
                                        <TouchableOpacity style={[appstyle.btnbg, { padding: 15 }]} onPress={handleSubmit(contriputionService)}>
                                            <Text style={appstyle.btnText}>Add Funds</Text>

                                        </TouchableOpacity>
                                }

                            </View>



                            {/* <SubmitButton
                                onPress={handleSubmit(contriputionService)}
                                textColor='#fff'
                                backgroundColor={themeColors?.bgbtn}
                                title='Add Fund'
                                style={{ marginTop: hp(10) }}

                            /> */}



                        </Animated.ScrollView>
                    </View>
                </KeyboardAvoidingView>

            </View>
        </GradientBackground>


    )
}

export default AddFunds

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