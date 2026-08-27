
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, Modal, TextInput, TouchableOpacity, View, Pressable, FlatList, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import getStyles from '../../../../../styles';
import GradientBackground from '../../../../../component/GradientBackground';
import CommonHeader from '../../../../../component/CommonHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Checkbox, Divider } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { fontsFamily } from '../../../../../../constants/fontsFamily';
import { getFontSize } from '../../../../../../constants/Font';
import CommonFunction from '../../../../../../utill/CommonFunction';
import CommonIcon from '../../../../../component/Commonicons';
import { fetchReminder } from '../../../../../../redux/slices/reminderSlice';
import { content } from '../../../../../../constants/content';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { BottomContext } from '../../../../../../context/BottomContext';
import { useIsFocused } from '@react-navigation/native';
import { deleteBillItem, fetchBills } from '../../../../../../redux/slices/billSlice';
import CustomModal from '../../../../../component/CustomModal';
import { appuseBackHandler } from '../../../../../../utill/appuseBackHandler';
import { resetStatement } from '../../../../../../redux/slices/statementSlice';
import api from '../../../../../../service/api';



const months = [
    { label: "January", value: '1' },
    { label: "February", value: '2 ' },
    { label: "March", value: '3 ' },
    { label: "April", value: '4' },
    { label: "May", value: '5' },
    { label: "June", value: '6' },
    { label: "July", value: '7' },
    { label: "August", value: '8' },
    { label: "September", value: '9' },
    { label: "October", value: '10' },
    { label: "November", value: '11' },
    { label: "December", value: '12' },
];

const { width, height } = Dimensions.get('window');

const ViewBill = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const styles = createStyles(themeColors)
    const billdatapram = route?.params?.item
    const [billHistory, setBillhistory] = useState([])
    const { reminderdata, reminderoading, remindererror } = useSelector((state) => state.reminder);
    const { page, size, records, hasMore, stloading } = useSelector((state) => state.statement);
    const { categorydata } = useSelector((state) => state.category);
    const { billdata: BillList } = useSelector((state) => state.bill);
    const [pendingValue, setPendingvalue] = useState('')
    const [loading, setloading] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const isFocused = useIsFocused()
    const [selectitem, setselectitem] = useState('')
    const [cancelbillitem, setcancelbill] = useState('')
    const GoalrefRBSheet = useRef(null);
    const BillcancelrefRBSheet = useRef(null);
    const dispatch = useDispatch()
    const [billdata, setbilldate] = useState('')
    const [isModal, setIsmodal] = useState(false)


    useEffect(() => {

        if (isFocused) {
            disableMenu()
        }

    }, [isFocused])


    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });


    useEffect(() => {

        if (route?.params?.screen == 'dash') {
            const billone = BillList?.find((item) => item?._id === billdatapram?.bill_id)
            setbilldate(billone)

        } else {
            const billone = BillList?.find((item) => item?._id === billdatapram?._id)
            setbilldate(billone)
        }





    }, [BillList, billdatapram])




    useEffect(() => {
        if (0 < reminderdata?.length) {
            const historydata = reminderdata.filter((obj) => obj.bill_id === billdata?._id).reverse();
            setBillhistory(historydata)
        } else {
            setBillhistory([])
        }

    }, [reminderdata, billdata])




    const dateformat = (date) => {
        if (date) {
            var dt = moment(new Date(date)).format(storedata.format)
            return dt
        } else {
            return '-'
        }

    }




    const { pendingBill, paidBill } = useMemo(() => {
        const pendingBill = [];
        const paidBill = [];

        billHistory?.forEach(item => {
            const status = item?.status?.toLowerCase();

            if (status === 'pending') pendingBill.push(item);
            if (status === 'paid') paidBill.push(item);
        });

        return { pendingBill, paidBill };
    }, [billHistory]);





    const formatOrdinal = (value) => {
        if (value === undefined || value === null || value === '') return '-';
        const str = String(value).toLowerCase();
        if (str === 'last') return 'last';
        const n = parseInt(str, 10);
        if (Number.isNaN(n)) return String(value);
        const mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    }

    const occurrence = (selectedrecord) => {
        const freq = selectedrecord?.frequency;
        const dayordate = selectedrecord?.dayordate || selectedrecord?.Weeklyorday || selectedrecord?.weekday || selectedrecord?.monthDate || '';
        const dayof = selectedrecord?.dayof; // 'month' or 'week'
        const occ = selectedrecord?.occurance;
        const yearmonth = selectedrecord?.yearmonth;
        const yns = months.find((item) => item.value === yearmonth)
        const ym = yns?.label ?? ''
        if (!freq) return '-';

        if (freq === 'Every week') {
            return `Every week on ${dayordate || '-'} `;
        }

        if (freq === 'Every month') {
            if (dayof === 'month') return `Every month on ${formatOrdinal(dayordate)}`;
            return `${formatOrdinal(occ || '1')} ${dayordate || '-'} of each month`;
        }

        if (freq === 'Every year') {
            const monthLabel = ym ? `${ym}` : '-';
            if (dayof === 'month') return `Every year on ${monthLabel} ${formatOrdinal(dayordate)}`;
            return `Every year in ${monthLabel}: ${formatOrdinal(occ || '1')} ${dayordate || '-'} `;
        }

        return '-';


    }


    const payReminder = (value) => {
        setloading(true)
        api.get('dashboard/remindermarkaspaid/' + value?._id).then((res) => {
            console.log(res.data)
            dispatch(fetchReminder())
            CommonFunction.message(res?.data?.message)
            console.log(res?.data)
            setloading(false)
        }).catch((err) => {
            setloading(false)
            console.log(err.response.data)

        })

    }


    async function setmarkset(value) {


        Alert.alert(
            "Alert",
            "Do you want to mark it as paid?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                },
                {
                    text: "Mark as Paid",
                    onPress: () => payReminder(value)
                }
            ],
            { cancelable: true }
        );

    }



    const calculateDaysAgo = (date) => {
        if (date) {
            const now = new Date();
            const Due = new Date(date);
            const differenceInTime = now - Due;
            const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
            return differenceInDays;
        }

    };


    const getcolor = (date) => {
        var countdays = calculateDaysAgo(date)
        if (countdays === 0) {
            return themeColors?.danger
        } else if (0 < countdays) {
            return themeColors?.warning
        } else {
            return '#000'
        }

    }

    const formatchDate = (date) => {
        const d = new Date(date);
        return `${d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })}`;
    };

    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                    <CommonHeader back={'yes'} title='View Reminder' onBackPress={() => {
                        navigation.goBack()
                        enableMenu()
                    }} />
                    <View style={{ marginStart: 10, marginEnd: 10, }}>

                        <SkeletonPlaceholder
                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >
                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={100}
                                marginTop={10}
                                borderRadius={8}
                            />
                            <View style={{ marginTop: 10 }}>
                                <SkeletonPlaceholder.Item
                                    width={width * 0.95}
                                    height={50}
                                    marginTop={10}
                                    borderRadius={8}
                                />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <SkeletonPlaceholder.Item
                                    width={width * 0.95}
                                    height={300}
                                    marginTop={10}
                                    borderRadius={8}
                                />
                            </View>
                            <View style={{ marginTop: 10 }}>

                                {[...Array(3)].map((_, index) => (
                                    <View
                                        key={index}

                                    >
                                        <SkeletonPlaceholder.Item
                                            width={width * 0.95}
                                            height={100}
                                            marginTop={10}
                                            borderRadius={3}
                                        />


                                    </View>
                                ))}
                            </View>

                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };



    async function DeletedBill() {
        if (selectitem) {
            dispatch(deleteBillItem(selectitem?._id))
            navigation.goBack()
            GoalrefRBSheet.current.close()
            enableMenu()
            api.get('dashboard/deletebills/' + selectitem?._id).then((res) => {
                console.log(res.data)
                dispatch(fetchBills())
                dispatch(fetchReminder())
                dispatch(resetStatement())
                CommonFunction.message(res?.data?.message)

            }).catch((err) => {
                console.log(err)
                console.log(err?.response.data)
            })

        }

    }

    async function CanceldBillService() {
        if (cancelbillitem) {

            BillcancelrefRBSheet.current.close()
            api.get('dashboard/cancelbill/' + cancelbillitem?._id).then((res) => {
                console.log(res.data)
                dispatch(fetchBills())
                dispatch(fetchReminder())
                // navigation.goBack()
                CommonFunction.message(res?.data?.message)
            }).catch((err) => {
                console.log(err)
            })

        }

    }



    if (reminderoading || loading) {
        return (
            <CardSkeleton />
        )
    }





    return (
        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />


            <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                <CommonHeader back={'yes'} title='View Reminder' onBackPress={() => {
                    navigation.goBack(),
                        enableMenu()
                }}
                    onEdit={billdata?.status === 'Active' && paidBill.length === 0 ? () => {
                        navigation.navigate('BillCreate', { item: billdata, screen: 'edit' })
                    } : ''}
                    onDelete={billdata?.status === 'Canceled' || billdata?.status === 'Completed' ? () => {
                        setIsmodal(true)
                        // GoalrefRBSheet.current.open()
                        setselectitem(billdata)
                    } : ''} />

                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, margin: 10 }}
                        showsVerticalScrollIndicator={false}
                    >

                        {
                            0 < pendingBill.length &&
                            <>
                                {
                                    pendingBill.slice(0, 1).map((value, key) => {


                                        const accountDetails = value?.account_id

                                        var number = ''
                                        if (accountDetails?.account_number) {
                                            number = ' -  XX' + CommonFunction.slicenum(accountDetails?.account_number)
                                        } else {
                                            number = ' - ' + content.manual
                                        }
                                        if (value && value?.date && value?.status === 'Pending') {
                                            // var days = calculateDaysAgo(value?.date)
                                            const daysAgo = calculateDaysAgo(value.date);
                                            let displayText = "";
                                            let dispalypast = '';

                                            if (value.status !== "Paid") {
                                                if (daysAgo > 0 && daysAgo <= 7) {
                                                    // Past within 7 days

                                                    if (1 < daysAgo) {
                                                        displayText = `${daysAgo} days ago`;
                                                    } else {
                                                        displayText = `${daysAgo} day ago`;
                                                    }

                                                }
                                                else if (daysAgo > 7) {
                                                    // Past more than 7 days
                                                    displayText = `${formatchDate(value.date)}`;
                                                }
                                                else if (daysAgo === 0) {
                                                    displayText = "Today";
                                                }
                                                else if (daysAgo < 0 && Math.abs(daysAgo) <= 7) {
                                                    // Future within 7 days
                                                    if (1 < Math.abs(daysAgo)) {
                                                        displayText = `Due In ${Math.abs(daysAgo)} days`;
                                                    } else {
                                                        displayText = `Due In ${Math.abs(daysAgo)} day`;
                                                    }

                                                }
                                                else {
                                                    // Future more than 7 days (e.g., -13)
                                                    displayText = `${formatchDate(value.date)}`;
                                                }
                                            }

                                            if (daysAgo > 0) {
                                                dispalypast = 'Past'
                                            } else {
                                                dispalypast = ''
                                            }
                                            return (
                                                <>

                                                    <Pressable style={{ backgroundColor: themeColors?.card_list_bg, padding: 20, margin: 5, borderRadius: 12, paddingStart: 15, marginTop: 10, elevation: 5 }} key={key}
                                                    // onPress={() => setmarkset(value)}

                                                    >


                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <View style={{ flex: 1 }}>

                                                                <View >
                                                                    <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(16), fontFamily: fontsFamily.semiboldFont }}>{value.name}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                                    <View>
                                                                        <CommonIcon family={'FontAwesome'} name={'bank'} size={12} color={themeColors?.card_secondary_color} />
                                                                    </View>
                                                                    <View style={{ marginStart: 10 }}>
                                                                        <Text style={[styles.textchg, { fontSize: getFontSize(12), marginTop: 0, color: themeColors?.card_secondary_color, fontWeight: 'normal' }]}>{value?.account_id?.type}{number}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>

                                                            <View style={{ flex: 1, alignItems: 'flex-end', marginEnd: 10 }}>
                                                                <View >
                                                                    <Text style={{ color: getcolor(value?.date), fontSize: getFontSize(14), color: themeColors?.card_secondary_color }}>{displayText}</Text>
                                                                </View>
                                                                <View style={{ marginTop: 10 }}>
                                                                    <Text style={[styles.textchg, { fontSize: getFontSize(16), color: themeColors?.card_secondary_color, marginTop: 0 }]}>{storedata.currency}{CommonFunction.formatamount(value.amount)}</Text>

                                                                </View>

                                                            </View>

                                                        </View>

                                                    </Pressable>



                                                    <TouchableOpacity style={{ backgroundColor: themeColors?.bgbtn, padding: 8, borderRadius: 6, alignItems: 'center', marginTop: 10, marginStart: 8, marginEnd: 8 }}
                                                        onPress={() => {
                                                            setmarkset(value)
                                                        }}>
                                                        <View style={{ flexDirection: 'row', }}>
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <CommonIcon family={'Entypo'} name={'check'} color={themeColors?.btn_text_color} size={18} />
                                                            </View>
                                                            <View style={{ justifyContent: 'center', marginStart: 5 }}>
                                                                <Text style={[styles.textchg, { fontSize: getFontSize(15), fontFamily: fontsFamily.mediumFont, color: themeColors?.btn_text_color, marginTop: 0 }]}>Mark as Paid</Text>
                                                            </View>

                                                        </View>
                                                    </TouchableOpacity>
                                                </>


                                            )
                                        }

                                    })
                                }


                            </>


                        }





                        <View style={{ marginStart: 10, marginTop: 20, marginEnd: 10 }}>
                            <View style={{ flexDirection: 'row', marginStart: 5, marginEnd: 10 }}>
                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }}>Reminder Details</Text>
                                </View>
                                <View style={{ justifyContent: 'center', backgroundColor: billdata?.status === 'Active' ? themeColors?.success : themeColors?.warning, padding: 5, paddingStart: 10, paddingEnd: 10, borderRadius: 8 }}>
                                    <Text style={{ color: '#fff', fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(14) }}>{billdata?.status}</Text>
                                </View>

                            </View>




                            <View style={{ backgroundColor: themeColors?.cardbg, padding: 12, borderRadius: 12, marginTop: 10, }}>

                                <View >
                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Name
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {billdata?.name}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Amount
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {storedata?.currency || "$"} {CommonFunction.formatamount(billdata?.amount)}
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Category
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {billdata?.category_id?.category}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Type
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {billdata?.type}
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Start Date
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {dateformat(billdata?.startdate)}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                End Date
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {dateformat(billdata?.enddate)}
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Recurrence
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color }]}>
                                                {billdata?.frequency}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={[styles?.headstyle, { color: themeColors?.card_text_color }]}>
                                                Occurrence Details
                                            </Text>
                                            <Text style={[styles?.subheadstyle, { color: themeColors?.card_text_color, textAlign: 'right' }]}>
                                                {occurrence(billdata)}
                                            </Text>
                                        </View>

                                    </View>

                                </View>

                            </View>
                        </View>


                        {

                            <View style={{ marginTop: 20, marginStart: 10, marginEnd: 10 }}>
                                <View style={{ marginStart: 5 }}>
                                    <Text style={{ color: themeColors?.text_primary, fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }}>Payment History</Text>
                                </View>
                                {0 < paidBill.length ? <View>

                                    {
                                        billHistory.map((value, key) => {
                                            const accountDetails = value?.account_id
                                            var number = ''
                                            if (accountDetails?.account_number) {
                                                number = ' -  XX' + CommonFunction.slicenum(accountDetails?.account_number)
                                            } else {
                                                number = ' - ' + content.manual
                                            }

                                            if (value?.status === 'Paid') {
                                                var displayText = `${formatchDate(value.date)}`;
                                                return (

                                                    <View style={{ backgroundColor: themeColors?.card_list_bg, padding: 12, borderRadius: 12, marginTop: 10, }} key={key}
                                                    >

                                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                                            <View style={{ flex: 1 }}>

                                                                <View >
                                                                    <Text style={{ color: themeColors?.card_secondary_color, fontSize: getFontSize(16), fontFamily: fontsFamily.semiboldFont }}>{value.name}</Text>
                                                                </View>


                                                            </View>

                                                            <View style={{ flex: 1, alignItems: 'flex-end', }}>
                                                                <View >
                                                                    <Text style={[styles?.headstyle, { color: themeColors?.success, fontSize: getFontSize(14) }]}>{value?.status}</Text>
                                                                </View>


                                                            </View>

                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginTop: 10, flex: 1, }}>
                                                            <View style={{ flex: 1 }}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <View style={{ justifyContent: 'center' }}>
                                                                        <CommonIcon family={'FontAwesome'} name={'calendar'} size={14} color={themeColors?.card_secondary_color} />
                                                                    </View>
                                                                    <View style={{ marginStart: 5 }}>
                                                                        <Text style={{ color: getcolor(value?.date), fontSize: getFontSize(14), color: themeColors?.card_secondary_color }}>{displayText}</Text>
                                                                    </View>

                                                                </View>
                                                                {
                                                                    value?.account_id?.type &&
                                                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                                        <View>
                                                                            <CommonIcon family={'FontAwesome'} name={'bank'} size={14} color={themeColors?.card_secondary_color} />
                                                                        </View>


                                                                        <View style={{ marginStart: 5 }}>
                                                                            <Text style={[{ fontSize: getFontSize(14), marginTop: 0, color: themeColors?.card_secondary_color, fontWeight: 'normal' }]}>{value?.account_id?.type}{number}</Text>
                                                                        </View>


                                                                    </View>
                                                                }



                                                            </View>

                                                            <View>
                                                                <Text style={[{ fontSize: getFontSize(14), color: themeColors?.card_secondary_color, marginTop: 0 }]}>{storedata.currency}{CommonFunction.formatamount(value.amount)}</Text>
                                                            </View>
                                                        </View>

                                                    </View>
                                                )
                                            }

                                        })
                                    }
                                </View> : <View style={{ flex: 1, marginTop: 20, alignItems: 'center', justifyContent: 'center', padding: 20, height: 100, backgroundColor: themeColors?.card_list_bg }}>
                                    <Text style={{ color: themeColors?.card_secondary_color, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14) }}>
                                        No history found
                                    </Text>
                                </View>



                                }


                            </View>
                        }






                    </ScrollView>
                    {
                        billdata?.status === 'Active' &&
                        <View style={{ flexDirection: 'row', margin: 20, }}>
                            {
                                <TouchableOpacity style={{ backgroundColor: themeColors.warning, padding: 13, marginEnd: 10, borderRadius: 8, flex: 1, alignItems: 'center' }} onPress={() => {
                                    BillcancelrefRBSheet.current.open();
                                    setcancelbill(billdata)
                                }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ justifyContent: 'center' }}>
                                            <CommonIcon name="cancel" family="MaterialDesignIcons" size={18} color={themeColors?.btn_text_color} />
                                        </View>

                                        <View style={{ marginStart: 5, justifyContent: 'center' }}>
                                            <Text style={[appstyle.filterapplycancelBtnTxt]}>Cancel</Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            }


                            <TouchableOpacity style={{ backgroundColor: themeColors.danger, padding: 13, marginStart: 10, borderRadius: 8, flex: 1, alignItems: 'center', opacity: 0.76 }} onPress={() => {
                                setIsmodal(true)
                                // GoalrefRBSheet.current.open()
                                setselectitem(billdata)
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <CommonIcon name="trash-outline" family="Ionicons" size={18} color={themeColors?.btn_text_color} />
                                    </View>

                                    <View style={{ marginStart: 5, justifyContent: 'center' }}>
                                        <Text style={[appstyle.filterapplycancelBtnTxt]}>Delete</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </View>



            <RBSheet
                ref={BillcancelrefRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={300}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        backgroundColor: themeColors?.cardbg,

                    },
                    draggableIcon: {
                        backgroundColor: themeColors?.bgbtn,

                    },
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                            Cancel Reminder
                        </Text>
                        <Pressable

                            onPress={() => BillcancelrefRBSheet.current.close()}
                            style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                            <CommonIcon
                                name={'clear'}
                                family={'MaterialIcons'}
                                color={themeColors?.iconcolor}
                            />
                        </Pressable>

                    </View>
                    <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color }}>Are you sure you want to cancel ?</Text>
                    </View>

                    <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color, lineHeight: 22 }}>Ending this reminder will only mark it as completed. It will not delete the reminder or its associated history.</Text>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', marginBottom: 20 }}>
                        <Pressable
                            onPress={() => BillcancelrefRBSheet.current.close()}
                            android_ripple={{ color: "#ffffff30" }}
                            style={({ pressed }) => [
                                {

                                    height: 45,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: themeColors?.bgbtn,
                                    transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: themeColors?.card_secondary_color,
                                    fontFamily: fontsFamily.semiboldFont
                                }}
                            >
                                No
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => CanceldBillService()}
                            android_ripple={{ color: "#ffffff30" }}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: themeColors?.bgbtn,
                                    height: 45,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    marginStart: 10,
                                    transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: themeColors?.btn_text_color,
                                    fontFamily: fontsFamily.semiboldFont
                                }}
                            >
                                Yes
                            </Text>
                        </Pressable>

                    </View>


                </View>
            </RBSheet>

            <CustomModal
                visible={isModal}
                onClose={() => setIsmodal(false)}
                alertTitle="Delete Reminder !"
                actionText="Yes"
                cancelText="No"
                onAction={() => {
                    DeletedBill()
                }}
            >
                <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15) }}>
                    Are you sure you want to delete this Reminder?
                </Text>
            </CustomModal>


            <RBSheet
                ref={GoalrefRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={250}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: 20,
                        backgroundColor: themeColors?.cardbg,

                    },
                    draggableIcon: {
                        backgroundColor: themeColors?.bgbtn,

                    },
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                            Delete Reminder
                        </Text>
                        <Pressable

                            onPress={() => GoalrefRBSheet.current.close()}
                            style={{ backgroundColor: themeColors?.iconbg, borderRadius: 50, padding: 5 }}>
                            <CommonIcon
                                name={'clear'}
                                family={'MaterialIcons'}
                                color={themeColors?.iconcolor}
                            />
                        </Pressable>

                    </View>
                    <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />

                    <View style={{ flex: 1, marginTop: 10 }}>
                        <Text style={{ fontFamily: fontsFamily?.semiboldFont, fontSize: getFontSize(16), color: themeColors?.card_secondary_color }}> Are you sure you want to delete this Reminder?</Text>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row', marginBottom: 20 }}>
                        <Pressable
                            onPress={() => GoalrefRBSheet.current.close()}
                            android_ripple={{ color: "#ffffff30" }}
                            style={({ pressed }) => [
                                {

                                    height: 45,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: themeColors?.bgbtn,
                                    transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: themeColors?.card_secondary_color,
                                    fontFamily: fontsFamily.semiboldFont
                                }}
                            >
                                No
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => DeletedBill()}
                            android_ripple={{ color: "#ffffff30" }}
                            style={({ pressed }) => [
                                {
                                    backgroundColor: themeColors?.bgbtn,
                                    height: 45,
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    marginStart: 10,
                                    transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: themeColors?.btn_text_color,
                                    fontFamily: fontsFamily.semiboldFont
                                }}
                            >
                                Yes
                            </Text>
                        </Pressable>

                    </View>


                </View>
            </RBSheet>


        </GradientBackground>



    )
}

export default ViewBill




const createStyles = (themeColors) =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10
        },
        flexstyle: {
            flex: 1,
            marginTop: 5

        },
        valueflexstyle: {
            flex: 1,
            // marginTop: 15,
            // alignItems: 'flex-end'

        },
        headstyle: {
            fontFamily: fontsFamily.mediumFont,
            fontSize: getFontSize(14),
            color: '#fff', opacity: 0.8
        },
        subheadstyle: {
            fontFamily: fontsFamily.mediumFont,
            fontSize: getFontSize(14),
            marginTop: 5,
            color: '#fff'
        }

    });

