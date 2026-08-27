
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View, Text, Image, Pressable, TouchableOpacity, ScrollView, Alert, useWindowDimensions, Keyboard, BackHandler,
    ActivityIndicator, StatusBar, TouchableWithoutFeedback, KeyboardAvoidingView,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import Modal from "react-native-modal";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCustomer } from '../../../../../redux/slices/customerSlice';
import GradientBackground from '../../../../component/GradientBackground';
import CommonHeader from '../../../../component/CommonHeader';
import { getFontSize } from '../../../../../constants/Font';
import { fontsFamily } from '../../../../../constants/fontsFamily';
import { content } from '../../../../../constants/content';
import { fetchOutstanding } from '../../../../../redux/slices/advenceSlice';
import Loader from '../../../../component/Loader';
import CommonFunction from '../../../../../utill/CommonFunction';
import LoaderKit from 'react-native-loader-kit'
import getStyles from '../../../../styles';
import { appuseBackHandler } from '../../../../../utill/appuseBackHandler';
import { getLoginInfo } from '../../../../../service/storage';
import api from '../../../../../service/api';


const PaymentFrequency = (props) => {

    const [loader, setloader] = useState(false)
    const [getregister, setregister] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles } = getStyles(themeColors);
    const { height, width } = useWindowDimensions();
    const { cusDetails, loading, error } = useSelector((state) => state.customer);
    const { allrecord, cusData, advances, totalBill, storePay, activeSub, minAmount, maxAmount, enabled, } = useSelector((state) => state.advance);
    const [day, setDay] = useState([])
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const { control, trigger, register, handleSubmit, reset, resetField, formState: { errors, isValid } } = useForm({ mode: 'onBlur', });
    const [totelcreditAmount, setTotelcreditAmount] = useState('')
    const [isModal, setIsmodal] = useState(false);
    const [month, setmonth] = useState([])

    const [isbuttonVisible, setbuttonVisible] = useState(false)
    const [visiblemonth, setviblemonth] = useState([])
    const paymentArrangement = [
        { label: "Bi-Weekly", value: "bi-weekly" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "Monthly" }
    ]
    const option = [{
        label: "No Option", value: 0
    }]
    const [getarangeregister, setarrangeregister] = useState(cusDetails?.payment_frequency)
    const dispatch = useDispatch()
    const routenavigationname = props?.route?.params?.page



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    const weekday = [
        { label: "Sunday", value: "Sunday" },
        { label: "Monday", value: "Monday" },
        { label: "Tuesday", value: "Tuesday" },
        { label: "Wednesday", value: "Wednesday" },
        { label: "Thursday", value: "Thursday" },
        { label: "Friday", value: "Friday" },
        { label: "Saturday", value: "Saturday" },
    ]


    const conformday = [
        { label: "On Pay day", value: "0" },
        { label: "Next day of the pay day", value: "1" },

        { label: "2nd Day of the pay day", value: "2" },
        { label: "3rd Day of the pay day", value: "3" },

    ]




    const currentmonth = [
        { label: '1st day of month', value: 1 },
        { label: '2nd day of month', value: 2 },
        { label: '3rd day of month', value: 3 },
        { label: '4th day of month', value: 4 },
        { label: '5th day of month', value: 5 },
        { label: '6th day of month', value: 6 },
        { label: '7th day of month', value: 7 },
        { label: '8th day of month', value: 8 },
        { label: '9th day of month', value: 9 },
        { label: '10th day of month', value: 10 },
        { label: '11th day of month', value: 11 },
        { label: '12th day of month', value: 12 },
        { label: '13th day of month', value: 13 },
        { label: '14th day of month', value: 14 },
        { label: '15th day of month', value: 15 },
        { label: '16th day of month', value: 16 },
        { label: '17th day of month', value: 17 },
        { label: '18th day of month', value: 18 },
        { label: '19th day of month', value: 19 },
        { label: '20th day of month', value: 20 },
        { label: '21st day of month', value: 21 },
        { label: '22rd day of month', value: 22 },
        { label: '23th day of month', value: 23 },
        { label: '24th day of month', value: 24 },
        { label: '25th day of month', value: 25 },
        { label: '26th day of month', value: 26 },
        { label: '27th day of month', value: 27 },
        { label: '28th day of month', value: 28 },
        { label: 'End of month', value: "end_of_month" },
    ]





    const Daterestriction = () => {
        var tday = new Date();
        tday.setDate(getregister['billGeneratedate']);
        var todate = new Date(tday)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-');


        return todate;
    };




    useEffect(() => {
        reset(getregister)
        // gettotelcredit()
        filltermonth()
        if (getregister['weekday']) {
            weekdaybymonth(getregister['weekday'])
        }

    }, [getregister])


    // useEffect(()=>{
    //  if(Object.keys(data).length !== 0) {
    //     dispatch(fetchCustomer())
    //  }
    // },[data])



    // useEffect(() => {
    //     dispatch(fetchCustomer())
    // dispatch(fetchOutstanding())
    // }, [dispatch])







    const weekdaybymonth = (day) => {

        const startbilldate = moment();
        const endbilldate = Daterestriction();

        const selectDay = day;
        const startDate = moment();


        if (0 < getregister.used && getarangeregister) {
            const getNextDay = (day) => {
                let dayNumber = moment().day(day).day();
                if (startDate.day() === dayNumber) {
                    return startDate.clone().add(1, 'week');
                } else if (startDate.day() < dayNumber) {
                    return startDate.clone().day(dayNumber);
                } else {
                    return startDate.clone().day(dayNumber + 7);
                }
            };

            let firstDay = getNextDay(selectDay);
            const nextMonthSameDay = startDate.clone().add(1, 'month');
            let selectedDays = [];
            let currentDate = firstDay.clone();

            while (currentDate.isBefore(nextMonthSameDay)) {

                if (
                    currentDate.isAfter(moment()) &&
                    currentDate.isSameOrAfter(startbilldate) &&
                    currentDate.isSameOrBefore(endbilldate)
                ) {
                    selectedDays.push(currentDate.format('YYYY-MM-DD'));
                }
                currentDate.add(1, 'week');
            }

            const arr = [];
            selectedDays.forEach((value) => {
                const day = moment(value).format('DD');
                const date = moment(value).format('ddd MMM DD YYYY');

                arr.push({
                    label: date,
                    value: date,
                    data: day,
                    cuspayday: `${day}##${date}`,
                });
            });

            setDay(arr);
        } else {
            const getNextDay = (day) => {
                let dayNumber = moment().day(day).day();
                if (startDate.day() === dayNumber) {
                    return startDate.clone().add(1, 'week');
                } else if (startDate.day() < dayNumber) {
                    return startDate.clone().day(dayNumber);
                } else {
                    return startDate.clone().day(dayNumber + 7);
                }
            };

            let firstDay = getNextDay(selectDay);

            const nextMonthSameDay = startDate.clone().add(1, 'month');
            let selectedDays = [];
            let currentDate = firstDay.clone();

            while (currentDate.isBefore(nextMonthSameDay)) {
                if (currentDate.isAfter(moment())) {
                    selectedDays.push(currentDate.format('YYYY-MM-DD'));
                }
                currentDate.add(1, 'week');
            }


            const arr = []

            selectedDays.map((value, key) => {
                const day = moment(value).format('DD')
                const date = moment(value).format('ddd MMM DD YYYY')

                arr.push(
                    { label: date, value: date, data: day, cuspayday: day + '##' + date }
                )

            })



            setDay(arr)
        }

    };

    const weekdaybymonth1 = (day) => {
        const selectDay = day

        const startDate = moment();

        const getNextDay = (day) => {
            let dayNumber = moment().day(day).day();
            if (startDate.day() === dayNumber) {
                return startDate.clone().add(1, 'week');
            } else if (startDate.day() < dayNumber) {
                return startDate.clone().day(dayNumber);
            } else {
                return startDate.clone().day(dayNumber + 7);
            }
        };

        let firstDay = getNextDay(selectDay);

        const nextMonthSameDay = startDate.clone().add(1, 'month');
        let selectedDays = [];
        let currentDate = firstDay.clone();

        while (currentDate.isBefore(nextMonthSameDay)) {
            if (currentDate.isAfter(moment())) {
                selectedDays.push(currentDate.format('YYYY-MM-DD'));
            }
            currentDate.add(1, 'week');
        }


        const arr = []

        selectedDays.map((value, key) => {
            const day = moment(value).format('DD')
            const date = moment(value).format('ddd MMM DD YYYY')

            arr.push(
                { label: date, value: date, data: day, cuspayday: day + '##' + date }
            )

        })



        setDay(arr)


    }


    useEffect(() => {
        getDetails()


        setregister(cusDetails)

    }, [cusDetails])




    function filltermonth() {

        const currentDay = moment().format('DD');
        const endDay = getregister['billGeneratedate']


        setmonth(currentmonth)
        setviblemonth(currentmonth)


    }


    const handleInputChange1 = (text) => {
        const formattedValue = text.match(/^\d+(\.\d{0,2})?/)?.[0] || '';
        return formattedValue

    };


    async function gettotelcredit() {
        const totelcredit = await getFromStorage('totelcredit')
        setTotelcreditAmount(parseInt(totelcredit).toString())
    }


    useEffect(() => {

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            },
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            },
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [])


    const getDetails = () => {

        setarrangeregister(cusDetails?.payment_frequency?.payment_frequency)

    }

    const handleInputChange = (name, value) => {
        setregister({ ...getregister, [name]: value });
    }



    function submit() {

        const currentdate = moment().format("YYYY-DD-MM");
        const isoDate = moment(getregister['weekly_pay_day']).format('YYYY-DD-MM');
        const monthcurrentdate = moment().format("DD");
        const monthpayday = getregister['pay_day']
        const currentmont = moment().format("MM")
        const selectcurrentmonth = moment(getregister['weekly_pay_day']).format('MM')

        if (getregister['payment_frequency'] === 'weekly') {

            if (currentdate < isoDate && currentmont === selectcurrentmonth) {
                setIsmodal(true)
            } else {
                sendsubmit()
            }
        } else {

            if (monthcurrentdate < monthpayday) {
                setIsmodal(true)
            } else {

                sendsubmit()
            }

        }

    }



    async function sendsubmit(data) {
        // setIsmodal(false)
        // if (getregister['payment_frequency'] === 'weekly') {
        //     getregister['weekpaydate'] = getregister['pay_day']
        // }
        const sent = { ...getregister, payment_arrangement: 'Yes' }

        const user = await getLoginInfo()


        setloader(true)
        api.post("customer/profile/" + user?.id, sent).then(res => {

            dispatch(fetchCustomer())
            if (props.screen === 'advance') {
                props.onClick('update')
            } else {
                props.navigation.goBack()
            }

            // if(props.route.params?.page) {
            //     props.navigation.navigate('Advance',{ screen: 'ok' })
            // }

            CommonFunction.message(res.data.message)
            setloader(false)
        }).catch(e => {
            setloader(false)

            console.log(e, '-------')
        })
    }


    if (loading) {
        return (
            <Loader />
        )
    }

    return (
        <GradientBackground >
            <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                {
                    !props.screen &&
                    <CommonHeader title='Payment Arrangement'

                        back={'yes'}
                        onBackPress={() => props.navigation.goBack()} />
                }



                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={[{ flex: 1, },]}>
                    <TouchableWithoutFeedback>

                        <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>


                            {
                                // 0 < totalBill ? <ScrollView>


                                //     <View style={{ margin: 20 }}>
                                //         <View style={{ flexDirection: 'row' }}>
                                //             <Text style={[styles?.sidehead, { marginVertical: 10 }]}>Name</Text>
                                //             <Text style={[styles.require, { marginVertical: 10 }]}>*</Text>
                                //         </View>
                                //         <Dropdown

                                //             data={paymentArrangement}

                                //             containerStyle={{
                                //                 borderRadius: 10,
                                //                 borderWidth: 1,
                                //                 // borderColor: '#ccc',
                                //                 paddingHorizontal: 10,
                                //                 paddingVertical: 8,
                                //                 color: themeColors?.inputsecondary
                                //             }}


                                //             style={{

                                //                 borderRadius: 5,
                                //                 // borderWidth: 1,
                                //                 borderColor: '#ccc',
                                //                 paddingHorizontal: 10,
                                //                 paddingVertical: 8,
                                //                 backgroundColor: themeColors?.inputprimary,
                                //                 height: 50,
                                //                 color: themeColors?.inputsecondary

                                //             }}
                                //             activeColor={themeColors?.inputprimary}

                                //             itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //             selectedTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //             placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}

                                //             labelField="label"
                                //             valueField="value"
                                //             disable={true}
                                //             placeholder="Select a Payment Arrangement"
                                //             searchPlaceholder="Search..."
                                //             value={getregister['payment_frequency']}
                                //             {...register("payment_frequency", { required: content.fieldrequire })}
                                //             onChange={(e) => {
                                //                 setregister({ ...getregister, payment_frequency: e.value, weekly_pay_day: '', pay_day: '', weekday: '' });
                                //                 setbuttonVisible(true)
                                //             }}

                                //         />

                                //         {errors.payment_frequency && <Text style={{ color: 'red', fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.payment_frequency.message}</Text>}
                                //     </View>

                                //     {
                                //         (getregister['payment_frequency'] === 'weekly' || getregister['payment_frequency'] === 'bi-weekly') &&
                                //         <View style={{}}>

                                //             <Dropdown

                                //                 data={weekday}
                                //                 disable={true}
                                //                 itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 selectedTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 containerStyle={{
                                //                     borderRadius: 10,
                                //                     // borderWidth: 1,
                                //                     borderColor: '#ccc',
                                //                     paddingHorizontal: 10,
                                //                     paddingVertical: 8,
                                //                 }}
                                //                 activeColor={themeColors?.inputprimary}
                                //                 style={{
                                //                     marginHorizontal: 20,
                                //                     borderRadius: 5,
                                //                     // borderWidth: 1,
                                //                     borderColor: '#ccc',
                                //                     paddingHorizontal: 10,
                                //                     paddingVertical: 8,
                                //                     backgroundColor: themeColors?.inputprimary,
                                //                     height: 50,
                                //                 }}
                                //                 labelField="label"
                                //                 valueField="value"
                                //                 placeholder="Select a Day"
                                //                 searchPlaceholder="Search..."
                                //                 value={getregister['weekday']}
                                //                 {...register("weekday", { required: content.fieldrequire })}
                                //                 onChange={(e) => {
                                //                     weekdaybymonth(e.value)

                                //                     setregister({ ...getregister, weekday: e.value, weekly_pay_day: "" })
                                //                     setbuttonVisible(true)
                                //                 }}

                                //             />

                                //             {errors.weekday && <Text style={{ color: 'red', fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.weekday.message}</Text>}
                                //         </View>
                                //     }



                                //     {
                                //         getregister['weekday'] && getregister['payment_frequency'] === 'bi-weekly' &&
                                //         <View style={{ marginTop: 20 }}>

                                //             <Dropdown

                                //                 disable={true}
                                //                 itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 selectedTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 data={0 < day.length ? day : option}
                                //                 containerStyle={{
                                //                     borderRadius: 10,
                                //                     // borderWidth: 1,
                                //                     borderColor: '#ccc',
                                //                     paddingHorizontal: 20,
                                //                     paddingVertical: 8,
                                //                 }}
                                //                 activeColor={themeColors?.inputprimary}
                                //                 style={{

                                //                     borderRadius: 5,
                                //                     // borderWidth: 1,
                                //                     borderColor: '#ccc',
                                //                     paddingHorizontal: 10,
                                //                     paddingVertical: 8,
                                //                     marginHorizontal: 20,
                                //                     backgroundColor: themeColors?.inputprimary,
                                //                     height: 50,
                                //                 }}
                                //                 labelField="label"
                                //                 valueField="value"
                                //                 placeholder="Select a Payday"
                                //                 searchPlaceholder="Search..."
                                //                 value={getregister['weekly_pay_day']}
                                //                 {...register("weekly_pay_day", { required: content.fieldrequire })} onChange={(e) => {
                                //                     if (e.value !== 0) {
                                //                         setregister({ ...getregister, weekly_pay_day: e.value, pay_day: e.data, cus_pay_day: e.cuspayday });
                                //                         setbuttonVisible(true)
                                //                     }

                                //                 }}

                                //             />

                                //             {errors.weekly_pay_day && <Text style={{ color: 'red', fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.weekly_pay_day.message}</Text>}
                                //         </View>
                                //     }

                                //     {

                                //         getregister['payment_frequency'] === 'Monthly' &&
                                //         <View style={{ margin: 20 }}>


                                //             <Dropdown

                                //                 disable={true}
                                //                 itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 selectedTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                 data={month}
                                //                 containerStyle={{
                                //                     borderRadius: 10,
                                //                     // borderWidth: 1,      // Add border width
                                //                     borderColor: '#ccc', // Add border color (light gray, you can change it)
                                //                     paddingHorizontal: 10,
                                //                     paddingVertical: 8,
                                //                 }}
                                //                 activeColor={themeColors?.inputprimary}
                                //                 style={{

                                //                     borderRadius: 5,
                                //                     // borderWidth: 1,      // Add border width
                                //                     borderColor: '#ccc', // Add border color (light gray, you can change it)
                                //                     paddingHorizontal: 10,
                                //                     paddingVertical: 8,
                                //                     backgroundColor: themeColors?.inputprimary,
                                //                     height: 50,
                                //                 }}
                                //                 labelField="label"
                                //                 valueField="value"
                                //                 placeholder="Select"
                                //                 searchPlaceholder="Search..."
                                //                 value={getregister['pay_day'] === 'end_of_month' ? getregister['pay_day'] : parseInt(getregister['pay_day'])}
                                //                 {...register("pay_day", { required: content.fieldrequire })} onChange={(e) => {
                                //                     handleInputChange('pay_day', e.value)
                                //                     setbuttonVisible(true)
                                //                 }}

                                //             />

                                //             {errors.pay_day && <Text style={{ color: 'red', fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.pay_day.message}</Text>}
                                //         </View>

                                //     }


                                //     <View style={{}}>

                                //         {


                                //             <View style={{ margin: 20 }}>


                                //                 <Dropdown

                                //                     disable={true}
                                //                     itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                     selectedTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                     placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                //                     data={conformday}
                                //                     containerStyle={{
                                //                         borderRadius: 10,
                                //                         // borderWidth: 1,      // Add border width
                                //                         borderColor: '#ccc', // Add border color (light gray, you can change it)
                                //                         paddingHorizontal: 10,
                                //                         paddingVertical: 8,
                                //                     }}
                                //                     style={{

                                //                         borderRadius: 5,
                                //                         // borderWidth: 1,      // Add border width
                                //                         borderColor: '#ccc', // Add border color (light gray, you can change it)
                                //                         paddingHorizontal: 10,
                                //                         paddingVertical: 8,
                                //                         backgroundColor: themeColors?.inputprimary,
                                //                         height: 50,
                                //                     }}
                                //                     activeColor={themeColors?.inputprimary}
                                //                     labelField="label"
                                //                     valueField="value"
                                //                     placeholder="Select"
                                //                     searchPlaceholder="Search..."
                                //                     value={getregister['payday_confirmation']}
                                //                     {...register("payday_confirmation", { required: content.fieldrequire, })} onChange={(e) => {
                                //                         handleInputChange('payday_confirmation', e.value)
                                //                         setbuttonVisible(true)
                                //                     }}

                                //                 />
                                //                 {errors.payday_confirmation && <Text style={{ color: 'red', fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.pay_day.message}</Text>}
                                //             </View>

                                //         }

                                //     </View>

                                //     <View style={{ height: 50 }}></View>
                                //     {/*
                                // {
                                //     0 < totalBill && <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 20 }}>
                                //         <TouchableOpacity
                                //             onPress={() => props.navigation.goBack()}
                                //             style={{ flex: 1, height: 45, borderWidth: 1, borderColor: themeColors?.primaryColor, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                //             <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>Cancel</Text>
                                //         </TouchableOpacity>
                                //         <TouchableOpacity
                                //             disabled={true}
                                //             onPress={() => handleSubmit(sendsubmit())}
                                //             style={{ flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, backgroundColor: themeColors?.primaryColor, borderRadius: 5 }}>
                                //             <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: 'white' }}>Update</Text>
                                //         </TouchableOpacity>
                                //     </View>
                                // } */}

                                // </ScrollView> :
                                <ScrollView>

                                    {
                                        !cusDetails.payday_confirmation && totalBill === 0 && <View style={{ marginHorizontal: 20, marginTop: 40 }}>
                                            <Text style={{ color: themeColors.danger, textAlign: 'center', fontSize: getFontSize(14) }}> {cusDetails?.re_payment_msg}</Text>
                                        </View>
                                    }



                                    <View style={{ margin: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles?.sidehead, { marginVertical: 10 }]}>Payment Frequency</Text>
                                            <Text style={[styles.require, { marginVertical: 10 }]}>*</Text>
                                        </View>

                                        <Dropdown

                                            data={paymentArrangement}
                                            disable={0 < totalBill ? true : false}
                                            containerStyle={{
                                                borderRadius: 10,
                                                // borderWidth: 1,
                                                borderColor: '#ccc',
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                color: themeColors?.themeColors?.inputsecondary,
                                                backgroundColor: themeColors?.inputprimary


                                            }}
                                            activeColor={themeColors?.inputprimary}
                                            itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                            selectedTextStyle={{ color: themeColors.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                            placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                            style={{

                                                borderRadius: 5,
                                                // borderWidth: 1,
                                                borderColor: themeColors.light,
                                                paddingHorizontal: 10,
                                                paddingVertical: 8,
                                                backgroundColor: themeColors?.inputprimary,
                                                height: 50,

                                            }}
                                            labelField="label"
                                            valueField="value"
                                            // disable={route.params.details.payment_frequency ? true : false}
                                            placeholder="Select a Payment Arrangement"
                                            searchPlaceholder="Search..."
                                            value={getregister['payment_frequency']}
                                            {...register("payment_frequency", { required: content.fieldrequire })}
                                            onChange={(e) => {
                                                setregister({ ...getregister, payment_frequency: e.value, weekly_pay_day: '', pay_day: '', weekday: '' });
                                                setbuttonVisible(true)
                                            }}

                                        />

                                        {errors.payment_frequency && <Text style={{ color: themeColors?.danger, fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.payment_frequency.message}</Text>}
                                    </View>

                                    {
                                        (getregister['payment_frequency'] === 'weekly' || getregister['payment_frequency'] === 'bi-weekly') &&
                                        <View style={{}}>
                                            <View style={{ flexDirection: 'row', marginVertical: 10, marginStart: 20 }}>
                                                <Text style={[styles?.sidehead,]}>Select a weekday</Text>
                                                <Text style={[styles.require]}>*</Text>
                                            </View>
                                            <Dropdown

                                                data={weekday}
                                                disable={0 < totalBill ? true : false}
                                                containerStyle={{
                                                    borderRadius: 10,
                                                    // borderWidth: 1,
                                                    borderColor: themeColors.light,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    color: themeColors?.inputsecondary,
                                                    backgroundColor: themeColors?.inputprimary
                                                }}

                                                itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                selectedTextStyle={{ color: themeColors.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                style={{
                                                    marginHorizontal: 20,
                                                    borderRadius: 5,
                                                    // borderWidth: 1,
                                                    borderColor: themeColors.light,
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    backgroundColor: themeColors?.inputprimary,
                                                    height: 50,
                                                }}
                                                activeColor={themeColors?.inputprimary}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select a Day"
                                                searchPlaceholder="Search..."
                                                value={getregister['weekday']}
                                                {...register("weekday", { required: content.fieldrequire })}
                                                onChange={(e) => {
                                                    weekdaybymonth(e.value)

                                                    setregister({ ...getregister, weekday: e.value, weekly_pay_day: "" })
                                                    setbuttonVisible(true)
                                                }}

                                            />

                                            {errors.weekday && <Text style={{ color: themeColors.danger, fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.weekday.message}</Text>}
                                        </View>
                                    }



                                    {
                                        getregister['weekday'] && getregister['payment_frequency'] === 'bi-weekly' &&
                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ flexDirection: 'row', marginVertical: 10, marginStart: 20 }}>
                                                <Text style={[styles?.sidehead,]}>Select a weekday</Text>
                                                <Text style={[styles.require]}>*</Text>
                                            </View>
                                            <Dropdown
                                                disable={0 < totalBill ? true : false}

                                                itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                selectedTextStyle={{ color: themeColors.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                data={0 < day.length ? day : option}
                                                containerStyle={{
                                                    borderRadius: 10,
                                                    // borderWidth: 1,
                                                    borderColor: '#ccc',
                                                    paddingHorizontal: 20,
                                                    backgroundColor: themeColors?.inputprimary,
                                                    paddingVertical: 8,
                                                }}


                                                style={{

                                                    borderRadius: 5,
                                                    // borderWidth: 1,
                                                    borderColor: '#ccc',
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    marginHorizontal: 20,
                                                    backgroundColor: themeColors?.inputprimary,
                                                    height: 50,
                                                }}

                                                activeColor={themeColors?.inputprimary}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select a Payday"
                                                searchPlaceholder="Search..."
                                                value={getregister['weekly_pay_day']}
                                                {...register("weekly_pay_day", { required: content.fieldrequire })} onChange={(e) => {
                                                    if (e.value !== 0) {
                                                        setregister({ ...getregister, weekly_pay_day: e.value, pay_day: e.data, cus_pay_day: e.cuspayday });
                                                        setbuttonVisible(true)
                                                    }

                                                }}

                                            />

                                            {errors.weekly_pay_day && <Text style={{ color: 'red', fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.weekly_pay_day.message}</Text>}
                                        </View>
                                    }

                                    {

                                        getregister['payment_frequency'] === 'Monthly' &&
                                        <View style={{ margin: 20, marginTop: 0 }}>
                                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                <Text style={[styles?.sidehead,]}>Pay Day</Text>
                                                <Text style={[styles.require]}>*</Text>
                                            </View>

                                            <Dropdown
                                                disable={0 < totalBill ? true : false}
                                                // disable={getregister.used === 0 && 0 < getregister.used && visiblemonth.length === 0 ? true : false}
                                                itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                selectedTextStyle={{ color: themeColors.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                data={month}
                                                containerStyle={{
                                                    borderRadius: 10,
                                                    // borderWidth: 1,      // Add border width
                                                    borderColor: themeColors.light, // Add border color (light gray, you can change it)
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    backgroundColor: themeColors?.inputprimary
                                                }}
                                                style={{

                                                    borderRadius: 5,
                                                    // borderWidth: 1,      // Add border width
                                                    // borderColor: themeColors.light, // Add border color (light gray, you can change it)
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 8,
                                                    backgroundColor: themeColors?.inputprimary,
                                                    height: 50,
                                                }}
                                                activeColor={themeColors?.inputprimary}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                searchPlaceholder="Search..."
                                                value={getregister['pay_day'] === 'end_of_month' ? getregister['pay_day'] : parseInt(getregister['pay_day'])}
                                                {...register("pay_day", { required: content.fieldrequire })} onChange={(e) => {
                                                    handleInputChange('pay_day', e.value)
                                                    setbuttonVisible(true)
                                                }}

                                            />

                                            {errors.pay_day && <Text style={{ color: themeColors.danger, fontSize: getFontSize(12), marginHorizontal: 20 }}>{errors.pay_day.message}</Text>}
                                        </View>

                                    }


                                    <View style={{}}>



                                        {


                                            <View style={{ margin: 20, marginTop: getregister['payment_frequency'] === 'Monthly' && 0 }}>

                                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                    <Text style={[styles?.sidehead,]}>Repayment Day Confirmation</Text>
                                                    <Text style={[styles.require]}>*</Text>
                                                </View>
                                                <Dropdown

                                                    disable={0 < totalBill ? true : false}
                                                    itemTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont, }}
                                                    selectedTextStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                    placeholderStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(13), fontFamily: fontsFamily.semiboldFont }}
                                                    data={conformday}
                                                    containerStyle={{
                                                        borderRadius: 10,
                                                        // borderWidth: 1,      // Add border width
                                                        // borderColor: themeColors.light, // Add border color (light gray, you can change it)
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 8,
                                                        backgroundColor: themeColors?.inputprimary
                                                    }}
                                                    style={{

                                                        borderRadius: 5,
                                                        // borderWidth: 1,      // Add border width
                                                        borderColor: themeColors.light, // Add border color (light gray, you can change it)
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 8,
                                                        backgroundColor: themeColors?.inputprimary,
                                                        height: 50,
                                                        shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.1,
                                                        shadowRadius: 3,
                                                        elevation: 3,
                                                    }}
                                                    activeColor={themeColors?.inputprimary}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select"
                                                    searchPlaceholder="Search..."
                                                    value={getregister['payday_confirmation']}
                                                    {...register("payday_confirmation", { required: content.fieldrequire, })} onChange={(e) => {
                                                        handleInputChange('payday_confirmation', e.value)
                                                        setbuttonVisible(true)
                                                    }}

                                                />
                                                {errors.payday_confirmation && <Text style={{ color: 'red', fontSize: getFontSize(12), }}>{errors.payday_confirmation.message}</Text>}
                                            </View>

                                        }

                                    </View>

                                    <View style={{ height: 50 }}></View>
                                    <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: 20 }}>
                                        {
                                            !props.screen &&
                                            <TouchableOpacity
                                                onPress={() => props.navigation.goBack()}
                                                style={{ flex: 1, height: 45, borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                                <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: themeColors.bgbtn }}>Cancel</Text>
                                            </TouchableOpacity>
                                        }

                                        {
                                            loader ? <View
                                                onPress={{}}
                                                style={{ flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, backgroundColor: themeColors?.bgbtn, borderRadius: 5, flexDirection: 'row' }}>
                                                <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: 'white' }}>Loading</Text>
                                                <LoaderKit
                                                    style={{ height: 20, width: 20, }}
                                                    name={'BallPulse'}
                                                    color={'white'}
                                                />
                                            </View> : <TouchableOpacity
                                                onPress={handleSubmit(sendsubmit)}
                                                style={{ flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, backgroundColor: themeColors?.bgbtn, borderRadius: 5 }}>
                                                <Text style={{ fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14), color: 'white' }}>Update</Text>
                                            </TouchableOpacity>
                                        }

                                    </View>
                                </ScrollView>
                            }
                        </View>


                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </View>
        </GradientBackground>
    )
}

export default PaymentFrequency

