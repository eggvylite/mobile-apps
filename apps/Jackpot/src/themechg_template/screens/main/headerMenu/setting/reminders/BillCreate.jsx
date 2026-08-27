import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, Modal, TextInput, TouchableOpacity, View, Pressable, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
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
import { Dropdown } from 'react-native-element-dropdown';
import CommonIcon from '../../../../../component/Commonicons';
import { useBottomSheet } from '../../../../../component/GlobalBottomSheet';
import { fetchBudgetcategory } from '../../../../../../redux/slices/budgetcategorySlice';
import { fetchCategory } from '../../../../../../redux/slices/categorySlice';
import { fetchTag } from '../../../../../../redux/slices/tagSlice';
import { fetchnamegetAccount } from '../../../../../../redux/slices/getnameAccountSlice';
import { content } from '../../../../../../constants/content';
import MonthPicker from 'react-native-month-year-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchAuth } from '../../../../../../redux/slices/authSlice';
import SubmitButton from '../../../../../component/SubmitButton';
import { addBillItem, fetchBills, resetBill } from '../../../../../../redux/slices/billSlice';
import { fetchgetllAccount } from '../../../../../../redux/slices/getmanulaccountSlice';
import { fetchReminder, resetReminder } from '../../../../../../redux/slices/reminderSlice';
import CalendarPicker from 'react-native-calendar-picker';
import CommonFunction from '../../../../../../utill/CommonFunction';
import { resetStatement, updateStatement } from '../../../../../../redux/slices/statementSlice';
import { BottomContext } from '../../../../../../context/BottomContext';
import LoaderButton from '../../../../../component/LoaderButton';
import LoaderKit from 'react-native-loader-kit'
import CustomModal from '../../../../../component/CustomModal';
import { appuseBackHandler } from '../../../../../../utill/appuseBackHandler';
import api from '../../../../../../service/api';


const { width, height } = Dimensions.get('window');
const COLORS = {


    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    inputBorder: '#7B45A8',
    tabBackground: '#F5F5F5',
    radioUnselected: '#9E9E9E',
    lightPurple: '#F3E5F5',
};



const automactchdata = [

]



const payDays = [
    { value: "", label: "Select a day" },
    { value: "1", label: "1st day of month" },
    { value: "2", label: "2nd day of month" },
    { value: "3", label: "3rd day of month" },
    { value: "4", label: "4th day of month" },
    { value: "5", label: "5th day of month" },
    { value: "6", label: "6th day of month" },
    { value: "7", label: "7th day of month" },
    { value: "8", label: "8th day of month" },
    { value: "9", label: "9th day of month" },
    { value: "10", label: "10th day of month" },
    { value: "11", label: "11th day of month" },
    { value: "12", label: "12th day of month" },
    { value: "13", label: "13th day of month" },
    { value: "14", label: "14th day of month" },
    { value: "15", label: "15th day of month" },
    { value: "16", label: "16th day of month" },
    { value: "17", label: "17th day of month" },
    { value: "18", label: "18th day of month" },
    { value: "19", label: "19th day of month" },
    { value: "20", label: "20th day of month" },
    { value: "21", label: "21st day of month" },
    { value: "22", label: "22nd day of month" },
    { value: "23", label: "23rd day of month" },
    { value: "24", label: "24th day of month" },
    { value: "25", label: "25th day of month" },
    { value: "26", label: "26th day of month" },
    { value: "27", label: "27th day of month" },
    { value: "28", label: "28th day of month" },
    { value: "29", label: "29th day of month" },
    { value: "30", label: "30th day of month" },
    { value: "31", label: "31th day of month" },
];
const weekdays = [
    { value: "Sunday", label: 'Sunday' },
    { value: "Monday", label: 'Monday' },
    { value: "Tuesday", label: 'Tuesday' },
    { value: "Wednesday", label: 'Wednesday' },
    { value: "Thursday", label: 'Thursday' },
    { value: "Friday", label: 'Friday' },
    { value: "Saturday", label: 'Saturday' },
];

const WEEKDAY_MAP = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

const weekdata = [
    { value: "1", label: 'First' },
    { value: "2", label: 'Second' },
    { value: "3", label: 'Third' },
    { value: "4", label: 'Fourth' },
    { value: "5", label: 'Last' },
]



const paymentFrequencyOptions = [
    // { label: 'One-time payment', value: 'One-time payment' },
    { label: 'Every week', value: 'Every week' },
    { label: 'Every month', value: 'Every month' },
    { label: 'Every year', value: 'Every year' },

];


const MatchCriteria = [
    { label: 'Auto Match', value: 'Auto Match' },
    { label: 'Any Amount', value: 'Any Amount' },
    { label: 'Exact Amount', value: 'Exact Amount' },
    { label: 'Limit Range', value: 'Limit Tange' }
]



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


const BillCreate = ({ navigation, route }) => {
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle } = getStyles(themeColors);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const styles = useMemo(() => createStyles(themeColors), [themeColors]);
    const [tabIndex, setTabIndex] = React.useState(0);
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
        shouldUnregister: false,
        mode: 'onBlur',
    });
    const [activeTab, setActiveTab] = useState('Basic');
    const [billType, setBillType] = useState('Bill');
    const [confirmmoth, setconfirmmonth] = useState(0)
    const [activeaccount, setactiveaccount] = useState('')
    const { openSheet, closeSheet } = useBottomSheet()
    const [frequency, setFrequency] = useState(null);
    const [selectedWeekDays, setSelectedWeekDays] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const { records } = useSelector((state) => state.statement);

    const [monthlyDates, setMonthlyDates] = useState([]);
    const [monthlyWeekIndex, setMonthlyWeekIndex] = useState([]);
    const [monthlyDayName, setMonthlyDayName] = useState('Monday');
    const [date, setDate] = useState(new Date());
    const [stardate, setstartDate] = useState(new Date())
    const [show, setShow] = useState(false);
    const [showenddate, setshowenddate] = useState(false)
    const [enddate, setendate] = useState(new Date(moment().add('month', 1)))
    const [selectweeklydata, setselectweeklydata] = useState([])
    const { getnameaccountdata } = useSelector((state) => state.getaccountname)
    const dispatch = useDispatch()
    const [allaccountList, setallAccountList] = useState([])
    const { categorydata } = useSelector((state) => state.category);
    const { tagdata } = useSelector((state) => state.taglist);
    const { getaccount, allbankaccountlist, } = useSelector((state) => state.getaccount);
    const refRBSheet = useRef(null)
    const [tagList, setTagList] = useState([])
    const [categoryList, setcategoryList] = useState([])
    const [accountList, setaccountList] = useState([])
    const [record, setrecord] = useState('')
    const [checked, setChecked] = useState('')
    const [checked2, setChecked2] = useState('')
    const [occurrence, setOccurrence] = useState([])
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const selectItem = route?.params?.item
    const [isChange, setIsChange] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [loading, setLoading] = useState(false)


    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);




    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });


    useEffect(() => {
        getDetails()

    }, [])

    const firstalertmodel = [
        { label: '7 Days Before', value: '7' },
        { label: '6 Days Before', value: '6' }

    ]



    const secondalertmodel = [
        { label: '5 Days Before', value: '5' },
        { label: '4 Days Before', value: '4' },
        { label: '3 Days Before', value: '3' }

    ]

    const thirdalertmodel = [
        { label: '2 Days Before', value: '2' },
        { label: '1 Day Before', value: '1' }



    ]


    const textinputStyle = () => {
        var conatin = ''
        conatin = Platform.OS === 'ios' ?
            CommonFunction.getDeviceType() === 'Tablet' ?
                [appstyle.textInputContainer, { height: height * 0.06, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
                : [appstyle.textInputContainer, { marginTop: 10, width: width * 0.91, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
            : [appstyle.textInputContainer, { height: height * 0.06, width: width * 0.91, marginTop: 10, flexDirection: 'row', backgroundColor: themeColors?.inputprimary, borderWidth: 0, borderColor: themeColors.buttonBgColor }]
        return conatin

    }


    const startdatetrans = (transactiondate) => {
        const currentDate = new Date()
        const transtDay = new Date(transactiondate).getDate()
        var start = currentDate
        const lastDay = moment().daysInMonth();

        if (currentDate.getDate() < transtDay) {
            if (transtDay <= lastDay) {
                start = moment()
                    .date(transtDay)
                    .format();
            } else {
                start = moment()
                    .date(lastDay)
                    .format();
            }

        } else {
            start = moment()
                .add(1, 'month')
                .date(transtDay)
                .format();

            console.log(start, 'step 2')

        }
        return start
    }

    const getDetails = async () => {
        disableMenu()
        var data = {}
        if (selectItem && route?.params?.screen !== 'edit') {
            const startdt = startdatetrans(selectItem?.transacted_at)
            const getDay = new Date(startdt).getDate()
            const paydayval = payDays.find((obj) => obj.value.toString() === String(getDay))

            const account = allbankaccountlist.find((obj) => obj._id === selectItem?.bankaccount)

            const category = categorydata?.records.find((obj) => obj?.category_id === selectItem?.category_id)

            data = {
                account_guid: selectItem?.account_guid,
                account_id: account ? selectItem?.bankaccount : '',
                affectreports: selectItem?.affectreports,
                affectspending: selectItem?.affectspending,
                amount: selectItem?.amount.toString(),
                bankaccount: account ? selectItem?.bankaccount : '',
                category: selectItem?.category,
                category_guid: category?._id,
                category_id: category?._id,
                customer_id: storedata?.id,
                dayof: "month",
                dayordate: paydayval?.value,
                description: selectItem?.description,
                frequency: paymentFrequencyOptions[1].value,
                name: selectItem?.description,
                occurance: "1",
                startdate: startdt,
                trans_id: selectItem?._id,
                transacted_at: selectItem?.transacted_at,
                transaction_source: selectItem?.transaction_source,
                type: "Bill",
                monthDate: getDay,
                platform: CommonFunction.getOS(),
                device_name: await CommonFunction.getdevicename(),
                ipaddress: await CommonFunction.getipaddress()
                // reminder1: '7',
                // reminder2: '5',
                // reminder3: '2'

            }

        } else if (route?.params?.screen) {
            data = {
                ...selectItem, customer_id: selectItem?.customer_id,
                category_id: selectItem?.category_id?._id,
                account_id: selectItem?.account_id?._id,
                amount: selectItem?.amount.toString(),
                id: selectItem?._id,
                platform: CommonFunction.getOS(),
                device_name: await CommonFunction.getdevicename(),
                ipaddress: await CommonFunction.getipaddress()
            }

        } else {
            data = {
                type: 'Bill',
                dayof: 'month',
                dayordate: payDays[1].value,
                customer_id: storedata?.id,
                monthDate: 1,
                occurance: '1',
                frequency: paymentFrequencyOptions[1].value,
                occurance: "1",
                startdate: new Date().toISOString(),
                platform: CommonFunction.getOS(),
                device_name: await CommonFunction.getdevicename(),
                ipaddress: await CommonFunction.getipaddress()
                // reminder1: '7',
                // reminder2: '5',
                // reminder3: '2'
            }


        }
        setrecord(data)

    }


    const calculateNextOccurrences = (freq, startDt, weeklyWeekday, endDt, dayofType, yearMonth, monthDt, occurance, monthWeekday) => {
        if (!startDt) return [];


        const occurrences = [];
        let start = new Date(startDt);

        start.setHours(0, 0, 0, 0);

        // Convert endDt to date for comparison if provided
        let endDate = null;
        if (endDt) {
            endDate = new Date(endDt);
            endDate.setHours(23, 59, 59, 999);
        }

        if (freq === 'Every week') {
            let current = new Date(start);
            const targetDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(weeklyWeekday || 'Monday');
            const dayOfWeek = current.getDay();
            const daysUntilTarget = (targetDay - dayOfWeek + 7) % 7;
            if (daysUntilTarget !== 0) current.setDate(current.getDate() + daysUntilTarget);

            while (occurrences.length < 6) {
                if (endDate && current > endDate) break;
                occurrences.push(new Date(current));
                current.setDate(current.getDate() + 7);
            }

            return occurrences;
        }

        const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

        const getNthWeekdayOfMonth = (y, m, weekdayIdx, n) => {
            if (n === 'last') {
                const lastDay = getDaysInMonth(y, m);
                let d = new Date(y, m, lastDay);
                while (d.getDay() !== weekdayIdx) d.setDate(d.getDate() - 1);
                return d;
            }
            const target = parseInt(n, 10);
            let d = new Date(y, m, 1);
            let count = 0;
            while (d.getMonth() === m) {
                if (d.getDay() === weekdayIdx) {
                    count += 1;
                    if (count === target) return d;
                }
                d.setDate(d.getDate() + 1);
            }
            return null;
        };

        if (freq === 'Every month') {
            let current = new Date(start.getFullYear(), start.getMonth(), 1);
            const maxCount = 6;
            const results = [];

            let y = current.getFullYear();
            let m = current.getMonth();

            while (results.length < maxCount) {
                let occDate = null;
                if (dayofType === 'month') {
                    const day = parseInt(monthDt, 10) || 1;
                    const daysInMonth = getDaysInMonth(y, m);
                    const dayToUse = Math.min(day, daysInMonth);
                    occDate = new Date(y, m, dayToUse);


                } else {

                    // dayofType === 'week' -> nth weekday pattern
                    const weekdayIdx = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(monthWeekday || 'Monday');
                    occDate = getNthWeekdayOfMonth(y, m, weekdayIdx, occurance);
                }

                if (occDate) {
                    // only include if occDate >= start
                    if (occDate >= start) {
                        if (endDate && occDate > endDate) break;


                        results.push(occDate);
                    }
                }

                // move to next month
                m += 1;
                if (m > 11) {
                    m = 0;
                    y += 1;
                }
            }

            return results;
        }

        if (freq === 'Every year') {
            const results = [];
            const maxCount = 6;
            const targetMonth = parseInt(yearMonth, 10);
            if (!targetMonth || targetMonth < 1 || targetMonth > 12) return results;

            // start searching from the start year
            let y = start.getFullYear();

            while (results.length < maxCount) {
                const m = targetMonth - 1; // zero-based month
                let occDate = null;

                if (dayofType === 'month') {
                    const day = parseInt(monthDt, 10) || 1;
                    const daysInMonth = getDaysInMonth(y, m);
                    const dayToUse = Math.min(day, daysInMonth);
                    occDate = new Date(y, m, dayToUse);
                } else {
                    const weekdayIdx = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(monthWeekday || 'Monday');
                    occDate = getNthWeekdayOfMonth(y, m, weekdayIdx, occurance);
                }

                if (occDate) {
                    if (occDate >= start) {
                        if (endDate && occDate > endDate) break;
                        results.push(occDate);
                    }
                }

                y += 1; // next year
            }

            return results;
        }

        return [];
    };

    useEffect(() => {
        if ((record?.startdate && record?.frequency && record?.dayordate)) {

            const countweeks = calculateNextOccurrences(
                record.frequency,
                record.startdate,
                record.dayordate,
                record.enddate,
                record.dayof,
                record.yearmonth,
                record.dayordate,
                record.occurance,
                record.dayordate
            );


            setOccurrence(countweeks)
        }

    }, [record?.startdate, record?.frequency, record?.enddate, record?.dayordate, record?.occurance, record.yearmonth, record.dayof]);


    useEffect(() => {
        if (record.startdate && record.enddate) {
            const start = new Date(record.startdate);
            var end = new Date(record.enddate);
            end.setHours(
                start.getHours(),
                start.getMinutes(),
                start.getSeconds()
            );
            record.enddate = end;
        }

    }, [record?.startdate, record?.enddate])





    function chageTabbutton() {
        return setActiveTab('Occurrence')
    }


    function handleInputChange(name, value) {
        setIsChange(true)
        setrecord({ ...record, [name]: value });
    }

    function chageTapone() {
        setActiveTab('Basic')
        return onTabChange('Basic')
    }

    function chageTaptwo() {
        setActiveTab('Occurrence')
        return onTabChange('Occurrence')
    }


    const CustomTabs = ({ activeTab }) => {




        return (
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Basic' && styles.tabActive,]}
                    onPress={handleSubmit(chageTapone)}>
                    <Text style={[styles.tabText, activeTab === 'Basic' && styles.tabTextActive]}>
                        Basic Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Occurrence' && styles.tabActive]}
                    onPress={handleSubmit(chageTaptwo)}>
                    <Text style={[styles.tabText, activeTab === 'Occurrence' && styles.tabTextActive]}>
                        Occurrence
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };



    const RadioOption = ({ label, selected, onSelect }) => (
        <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={[styles.radioLabel, { color: themeColors?.text_primary }]}>{label}</Text>
        </TouchableOpacity>
    );



    const DateInfoCard = () => (
        <View style={styles.dateCard}>
            <View style={styles.dateRow}>
                <TouchableOpacity

                // onPress={() => setShow(true)}
                >
                    <Text style={styles.dateLabel}>Start By</Text>
                    <Text style={styles.dateValue}>{moment(record?.startdate).format(storedata.format)}</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.dateLabel}>Frequency</Text>
                    <Text style={styles.dateValue}>{record?.frequency}</Text>
                </View>
                <View>
                    <Text style={styles.dateLabel}>End By</Text>
                    <Text style={styles.dateValue}> {record?.enddate ? moment(record?.enddate).format(storedata.format) : '-'}</Text>
                </View>
            </View>
            <View style={[styles.dateFooter, { justifyContent: 'flex-end' }]}>
                {/* <View style={styles.frequencyBg}>
                    <Text style={styles.frequencyText}>Repeat every month on 25th</Text>
                </View> */}
                <TouchableOpacity
                    onPress={handleSubmit(chageTabbutton)}
                    style={styles.changeButton}>
                    <MaterialIcons name="cached" size={16} color={themeColors?.btn_text_color} />
                    <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>
    );



    const openFrequencySheet = () => {
        openSheet(() => (
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: themeColors?.card_text_color }}>Select Frequency</Text>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    {paymentFrequencyOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={{
                                paddingVertical: 15,
                                borderBottomWidth: 1,
                                borderBottomColor: '#eee',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                setFrequency(option.value);
                                handleInputChange('frequency', option?.value)
                                closeSheet();
                            }}
                        >
                            <Text style={{ fontSize: 16, color: frequency === option.value ? themeColors?.card_text_color : themeColors?.card_text_color, fontWeight: frequency === option.value ? '600' : '400' }}>
                                {option.label}
                            </Text>
                            {frequency === option.value && <MaterialIcons name="check" size={20} color={themeColors?.card_text_color} />}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        ), 400);
    };



    // useEffect(() => {

    //     dispatch(fetchgetllAccount())
    //     dispatch(fetchCategory())
    //     dispatch(fetchTag())
    //     dispatch(fetchnamegetAccount())
    //     dispatch(fetchAuth())
    // }, [dispatch])






    useEffect(() => {
        reset(record)
    }, [record])


    useEffect(() => {
        if (0 < tagdata?.records?.length) {
            tagdrapService()
        }

        if (0 < categorydata?.records?.length) {
            categorydrapService()
        }

        if (0 < allbankaccountlist?.length) {
            accountdrapService()
        }


    }, [tagdata, categorydata, allbankaccountlist,])


    function tagdrapService(params) {
        let arr = [];
        tagdata?.records.forEach(element => {

            arr.push({
                label: element?.tagname,
                value: element?.id

            })
            setTagList(arr)
        });
    }



    function categorydrapService(params) {
        let arr = [];
        categorydata?.records?.forEach(element => {
            arr.push({
                label: element?.category,
                value: element?._id

            })
            // if (selectItem) {
            //     arr.push({
            //         label: element?.category,
            //         value: element?.category_id

            //     })
            // } else {
            //     arr.push({
            //         label: element?.category,
            //         value: element?._id

            //     })
            // }


        });
        setcategoryList(arr)
    }


    function accountdrapService(params) {
        let arr = [];
        allbankaccountlist.forEach(element => {
            var number = ''
            if (element?.account_number) {
                number = ' - XX' + CommonFunction.slicenum(element?.account_number)
            } else {
                number = ' - ' + content.manual
            }
            arr.push({
                label: element?.type + number,
                value: element?._id

            })
            setaccountList(arr)
        });
    }

    const onDone = () => {

        handleInputChange('enddate', enddate?.toISOString())
        setshowenddate(false);
    };

    const onCancel = () => {

        setshowenddate(false)
    };

    const onDone1 = () => {

        handleInputChange('startdate', stardate?.toISOString())
        setShow(false);
    };

    const onCancel1 = () => {

        setShow(false);
    }




    async function submitBill(params) {
        setLoading(true)
        if (route?.params?.screen) {
            api.post('dashboard/updatebills/' + selectItem?._id, record).then((res) => {
                console.log(res.data)
                dispatch(fetchBills())
                dispatch(fetchReminder())
                navigation.replace("Bill")

                CommonFunction?.message(res?.data?.message)
                enableMenu()
                setLoading(false)
            }).catch((err) => {
                console.log(err.response.data)
                console.log(err)
                setLoading(false)
                CommonFunction?.message(err.response.data?.message, 'danger')
            })

        } else {
            // dispatch(addBillItem(record))
            if (selectItem) {
                const updated = records.map((item) =>
                    selectItem._id === record?._id
                        ? {
                            ...item,
                            bill_id: 1
                        }
                        : item
                );
                // dispatch(updateStatement(updated));
            }

            console.log(record)

            api.post('dashboard/createbills', record).then((res) => {
                dispatch(resetBill())
                if (selectItem) {
                    dispatch(resetStatement())
                }
                dispatch(resetReminder())


                console.log(res.data)
                dispatch(fetchBills())

                dispatch(fetchReminder())
                CommonFunction.message(res?.data?.message)
                navigation.replace('Bill', { item: null })
                setLoading(false)
                enableMenu()

                // setLoading(false)
            }).catch((err) => {
                setLoading(false)
                console.log(err.response.data)
                CommonFunction.message(err?.response?.data?.message, 'danger')
                console.log(err)
                // setLoading(false)
            })
        }


    }


    return (
        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />


            <KeyboardAvoidingView
                style={appstyle.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={themedata?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                    <CommonHeader back={'yes'} title={route?.params?.screen ? 'Edit Reminder' : 'Add Reminder'}
                        onBackPress={() => {
                            if (isChange) {
                                setIsModal(true)
                            } else {
                                enableMenu()
                                navigation.replace('Bill')
                            }
                        }} />
                    <View style={{ marginTop: 20 }}>
                        <View style={[styles.tabsContainer]}>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'Basic' && styles.tabActive, { justifyContent: 'center' }]}
                                onPress={handleSubmit(chageTapone)}>
                                <Text style={[styles.tabText, activeTab === 'Basic' && styles.tabTextActive, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }]}>
                                    Basic Details
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'Occurrence' && styles.tabActive, { justifyContent: 'center' }]}
                                onPress={handleSubmit(chageTaptwo)}>
                                <Text style={[styles.tabText, activeTab === 'Occurrence' && styles.tabTextActive, { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(16) }]}>
                                    Occurrence
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >

                        {
                            activeTab === 'Basic' ?
                                <View style={styles.formSection}>


                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Name</Text>
                                            <Text style={appstyle.require}>*</Text>
                                        </View>
                                        <View style={[textinputStyle()]}>
                                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                                <TextInput
                                                    style={appstyle.text}
                                                    value={record?.name}
                                                    placeholderTextColor={'#909090'}
                                                    placeholder={'Name'}
                                                    onChangeText={(val) => {
                                                        handleInputChange('name', val)
                                                    }}
                                                    {...register("name", {
                                                        required: content.fieldrequire, // Required validation
                                                        validate: {
                                                            noLongSpaces: (value) =>
                                                                !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                            minTwoChars: (value) =>
                                                                value.trim().length >= 2 || "Invalid Name"
                                                        },

                                                    })}
                                                />
                                            </View>
                                        </View>
                                        {errors.name && (
                                            <Text style={styles.errortext}>{errors.name.message}</Text>
                                        )}
                                    </View>

                                    <View style={{ marginTop: 20, flexDirection: 'row' }}>
                                        <View >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Amount</Text>
                                                <Text style={appstyle.require}>*</Text>
                                            </View>
                                            <View style={[textinputStyle()]}>
                                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                                    <TextInput
                                                        style={appstyle.text}
                                                        placeholderTextColor={'#909090'}
                                                        placeholder={'Amount'}
                                                        keyboardType={'numeric'}
                                                        onChangeText={(val) => {
                                                            handleInputChange('amount', val)
                                                        }}
                                                        value={record?.amount}
                                                        {...register("amount", {
                                                            required: content.fieldrequire, // Required validation
                                                            validate: {
                                                                numeric: (v) => !isNaN(v) || 'Must be a number',
                                                                minVal: (v) => Number(v) > 0 || 'Amount must be greater than 0',
                                                                decimalLimit: (v) =>
                                                                    /^\d+(\.\d{1,2})?$/.test(v) || 'Only up to 2 decimal places allowed',


                                                            },
                                                        })}
                                                    />
                                                </View>
                                            </View>
                                            {errors.amount && (
                                                <Text style={styles.errortext}>{errors.amount.message}</Text>
                                            )}
                                        </View>

                                    </View>

                                    {/* <View style={{ marginTop: 20, flexDirection: 'row'  }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Account</Text>

                                                <Text style={appstyle.require}>*</Text>
                                            </View>
                                            <Dropdown
                                                style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height:45 }}
                                                placeholderStyle={{ color: 'gray' }}
                                                placeholderTextColor={"grey"}
                                                selectedTextStyle={appstyle.text}
                                                inputSearchStyle={[appstyle.inputSearchStyle]}
                                                iconStyle={appstyle.iconStyle}
                                                search={true}
                                                itemTextStyle={[appstyle.text]}
                                                itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                data={accountList}
                                                maxHeight={400}
                                                activeColor={themeColors?.inputprimary}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select account"
                                                searchPlaceholder="Search..."
                                                c
                                                {...register("account_id", { required: content.fieldrequire, })}
                                                onChange={(e) => {
                                                    // handleInputChange('account_id', e?.value)
                                                    setrecord({ ...record, account_id: e?.value, bankaccount: e?.value })

                                                }}

                                            />
                                            {errors.account_id && <Text style={styles.errortext}>{errors.account_id.message}</Text>}

                                        </View> */}

                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Account</Text>

                                            <Text style={appstyle.require}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                            placeholderStyle={{ color: 'gray' }}
                                            placeholderTextColor={"grey"}
                                            selectedTextStyle={appstyle.text}
                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                            iconStyle={appstyle.iconStyle}
                                            search={true}
                                            itemTextStyle={[appstyle.text]}
                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                            data={accountList}
                                            maxHeight={400}
                                            activeColor={themeColors?.inputprimary}
                                            value={record?.account_id}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select account"
                                            searchPlaceholder="Search..."
                                            {...register("account_id", { required: content.fieldrequire, })}
                                            onChange={(e) => {
                                                // handleInputChange('account_id', e?.value)
                                                setrecord({ ...record, account_id: e?.value, bankaccount: e?.value })

                                            }}
                                        />
                                        {errors.account_id && <Text style={styles.errortext}>{errors.account_id.message}</Text>}

                                    </View>




                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Category</Text>

                                            <Text style={appstyle.require}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                            placeholderStyle={{ color: 'gray' }}
                                            placeholderTextColor={"grey"}
                                            selectedTextStyle={appstyle.text}
                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                            iconStyle={appstyle.iconStyle}
                                            search={true}
                                            itemTextStyle={[appstyle.text]}
                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                            data={categoryList}
                                            maxHeight={400}
                                            activeColor={themeColors?.inputprimary}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select account"
                                            searchPlaceholder="Search..."
                                            value={record?.category_id}
                                            {...register("category_id", { required: content.fieldrequire, })} onChange={(e) => {
                                                setrecord({ ...record, category_id: e?.value, category_guid: e?.value })
                                                // handleInputChange('category_id', e?.value)

                                            }}
                                        />
                                        {errors.category_id && <Text style={styles.errortext}>{errors.category_id.message}</Text>}

                                    </View>

                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Reminder Type</Text>
                                            <Text style={appstyle.require}>*</Text>
                                        </View>
                                        <View style={[styles.radioGroup, { margin: 10, marginStart: 5, marginTop: 20 }]}>
                                            <RadioOption label="Bill" selected={record?.type === 'Bill'} onSelect={() => handleInputChange('type', 'Bill')} />
                                            <RadioOption label="Subscription" selected={record?.type === 'Subscription'} onSelect={() => handleInputChange('type', 'Subscription')} />
                                        </View>
                                    </View>


                                    <View>
                                        {
                                            record?.frequency !== 'Every week' && <>

                                                <View style={{ marginTop: 20 }}>

                                                    <View >
                                                        <Text style={[appstyle.textchg, { fontSize: getFontSize(16), marginTop: 0, marginStart: 5, fontFamily: fontsFamily.mediumFont }]}>Reminder Schedule</Text>
                                                    </View>

                                                    <View style={{ marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>First Reminder</Text>

                                                            <Text style={appstyle.require}>*</Text>
                                                        </View>
                                                        <Dropdown
                                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                            placeholderStyle={{ color: 'gray' }}
                                                            placeholderTextColor={"grey"}
                                                            selectedTextStyle={appstyle.text}
                                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                                            iconStyle={appstyle.iconStyle}
                                                            itemTextStyle={[appstyle.text]}
                                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                            data={firstalertmodel}
                                                            maxHeight={200}
                                                            activeColor={themeColors?.inputprimary}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select first reminder"
                                                            searchPlaceholder="Search..."
                                                            value={record?.reminder1}
                                                            {...register("reminder1", { required: content.fieldrequire, })} onChange={(e) => {
                                                                handleInputChange('reminder1', e?.value)

                                                            }}
                                                        />
                                                        {errors.reminder1 && <Text style={styles.errortext}>{errors.reminder1.message}</Text>}

                                                    </View>

                                                    <View style={{ marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Second Reminder</Text>

                                                            <Text style={appstyle.require}>*</Text>
                                                        </View>
                                                        <Dropdown
                                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                            placeholderStyle={{ color: 'gray' }}
                                                            placeholderTextColor={"grey"}
                                                            selectedTextStyle={appstyle.text}
                                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                                            iconStyle={appstyle.iconStyle}
                                                            itemTextStyle={[appstyle.text]}
                                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                            data={secondalertmodel}
                                                            maxHeight={200}
                                                            activeColor={themeColors?.inputprimary}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select second reminder"
                                                            searchPlaceholder="Search..."
                                                            value={record?.reminder2}
                                                            {...register("reminder2", { required: content.fieldrequire, })} onChange={(e) => {
                                                                handleInputChange('reminder2', e?.value)

                                                            }}
                                                        />
                                                        {errors.reminder2 && <Text style={styles.errortext}>{errors.reminder2.message}</Text>}

                                                    </View>

                                                    <View style={{ marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Final Reminder</Text>

                                                            <Text style={appstyle.require}>*</Text>
                                                        </View>
                                                        <Dropdown
                                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                            placeholderStyle={{ color: 'gray' }}
                                                            placeholderTextColor={"grey"}
                                                            selectedTextStyle={appstyle.text}
                                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                                            iconStyle={appstyle.iconStyle}
                                                            itemTextStyle={[appstyle.text]}
                                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                            data={thirdalertmodel}
                                                            maxHeight={200}
                                                            activeColor={themeColors?.inputprimary}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select third reminder"
                                                            searchPlaceholder="Search..."
                                                            value={record?.reminder3}
                                                            {...register("reminder3", { required: content.fieldrequire, })} onChange={(e) => {
                                                                handleInputChange('reminder3', e?.value)

                                                            }}
                                                        />
                                                        {errors.reminder3 && <Text style={styles.errortext}>{errors.reminder3.message}</Text>}

                                                    </View>


                                                </View>




                                            </>
                                        }
                                    </View>




                                </View>
                                :
                                <View style={styles.formSection}>
                                    <View style={{ marginTop: 20 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Select Frequency</Text>

                                            <Text style={appstyle.require}>*</Text>
                                        </View>
                                        <Dropdown
                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                            placeholderStyle={{ color: 'gray' }}
                                            placeholderTextColor={"grey"}
                                            selectedTextStyle={appstyle.text}
                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                            iconStyle={appstyle.iconStyle}
                                            search={true}
                                            itemTextStyle={[appstyle.text]}
                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                            data={paymentFrequencyOptions}
                                            maxHeight={200}
                                            activeColor={themeColors?.inputprimary}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Frequency"
                                            searchPlaceholder="Search..."
                                            value={record?.frequency}
                                            {...register("frequency", { required: content.fieldrequire, })} onChange={(e) => {

                                                setrecord({
                                                    ...record, frequency: e?.value,
                                                    dayordate: e?.value === 'Every week' ? weekdays[0].value : payDays[1].value,
                                                    yearmonth: e?.value === 'Every year' ? months[0].value : '',
                                                    dayof: 'month'
                                                })

                                            }}

                                        />
                                        {errors.frequency && <Text style={styles.errortext}>{errors.frequency.message}</Text>}

                                    </View>

                                    <View style={{ marginTop: 20, flexDirection: 'row' }}>
                                        <View >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Start Date</Text>

                                                <Text style={appstyle.require}>*</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setshowenddate(false),
                                                        setShow(true)

                                                }
                                                }
                                                style={[textinputStyle(), { width: width * 0.43 }]}>
                                                <View style={{ top: Platform.OS === 'ios' ? 3 : 14 }}>
                                                    <CommonIcon name={'calendar'} family={'Ionicons'} color={themeColors?.inputsecondary} size={16} />
                                                </View>
                                                <View style={{ top: Platform.OS === 'ios' ? 3 : 13, flex: 1 }}>
                                                    <Text style={[appstyle.text, { marginStart: 10 }]}>
                                                        {moment(record?.startdate).format(storedata?.format)}
                                                    </Text>
                                                </View>

                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1, marginStart: 10 }}>

                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>End Date</Text>

                                                <Text style={appstyle.require}>*</Text>
                                            </View>
                                            <View

                                                style={[textinputStyle(), { width: width * 0.46, justifyContent: 'center' }]}>
                                                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => {
                                                    setShow(false)
                                                    setshowenddate(true)

                                                }
                                                }>
                                                    <View style={{ top: Platform.OS === 'ios' ? 3 : 13 }}>
                                                        <CommonIcon name={'calendar'} family={'Ionicons'} color={themeColors?.inputsecondary} size={16} />
                                                    </View>
                                                    <View style={{ top: Platform.OS === 'ios' ? 3 : 13, flex: 1 }}>
                                                        <Text style={[appstyle.text, { marginStart: 10 }]}>
                                                            {record?.enddate ? moment(record?.enddate).format(storedata.format) : '-'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                                {
                                                    record?.enddate &&
                                                    <Pressable style={{ justifyContent: 'center' }} onPress={() => {
                                                        setrecord({ ...record, enddate: '' })
                                                    }}>
                                                        <CommonIcon family={'AntDesign'} name={'close'} size={15} />
                                                    </Pressable>
                                                }

                                            </View>
                                        </View>

                                    </View>




                                    {record?.frequency === 'Every week' ? (
                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Day of the Week</Text>

                                                <Text style={appstyle.require}>*</Text>
                                            </View>
                                            <Dropdown
                                                style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: Platform.OS === 'ios' ? height * 0.06 : height * 0.06 }}
                                                placeholderStyle={{ color: 'gray' }}
                                                placeholderTextColor={"grey"}
                                                selectedTextStyle={appstyle.text}
                                                inputSearchStyle={[appstyle.inputSearchStyle]}
                                                iconStyle={appstyle.iconStyle}
                                                search={true}
                                                itemTextStyle={[appstyle.text]}
                                                itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                data={weekdays}
                                                maxHeight={200}
                                                activeColor={themeColors?.inputprimary}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                searchPlaceholder="Search..."
                                                value={record?.dayordate}
                                                {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                    handleInputChange('dayordate', e?.value)

                                                }}
                                            />
                                            {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}

                                        </View>


                                    ) :
                                        <View>
                                            {
                                                record?.frequency === 'Every year' &&
                                                <View style={{ marginTop: 20 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Select Months</Text>

                                                        <Text style={appstyle.require}>*</Text>
                                                    </View>
                                                    <Dropdown
                                                        style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                        placeholderStyle={{ color: 'gray' }}
                                                        placeholderTextColor={"grey"}
                                                        selectedTextStyle={appstyle.text}
                                                        inputSearchStyle={[appstyle.inputSearchStyle]}
                                                        iconStyle={appstyle.iconStyle}
                                                        search={true}
                                                        itemTextStyle={[appstyle.text]}
                                                        itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                        containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                        data={months}
                                                        activeColor={themeColors?.inputprimary}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder="Select month"
                                                        searchPlaceholder="Search..."
                                                        value={record?.yearmonth}
                                                        {...register("yearmonth", { required: content.fieldrequire, })} onChange={(e) => {
                                                            handleInputChange('yearmonth', e?.value)

                                                        }}

                                                    />
                                                    {errors.yearmonth && <Text style={styles.errortext}>{errors.yearmonth.message}</Text>}

                                                </View>

                                            }

                                            <View style={{ marginTop: 20, }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Every Month</Text>
                                                    <Text style={appstyle.require}>*</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', backgroundColor: themeColors?.tabbg, borderRadius: 30, height: Platform.OS === 'ios' ? height * 0.06 : height * 0.07, padding: 5, marginTop: 10 }}>
                                                    <Pressable
                                                        onPress={() => {
                                                            setrecord({ ...record, dayof: 'month', dayordate: payDays[1].value })
                                                        }}
                                                        style={[{ backgroundColor: record?.dayof === 'month' ? themeColors.tab_active_bg : 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 30 }]}>
                                                        <Text style={{ color: record?.dayof === 'month' ? themeColors?.tab_active_text : themeColors?.text_primary }}>Day of the Month</Text>
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => {
                                                            setrecord({ ...record, dayof: 'week', dayordate: weekdays[0].value, occurance: weekdata[0].value })
                                                        }}
                                                        style={[styles.segmentPill, { backgroundColor: record?.dayof === 'week' ? themeColors.tab_active_bg : 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5, borderRadius: 30 }]}>
                                                        <Text style={{ color: record?.dayof === 'week' ? themeColors?.tab_active_text : themeColors?.text_primary }}>Day of the Week</Text>
                                                    </Pressable>
                                                </View>
                                            </View>

                                            {record?.dayof === 'month' ? (
                                                <View style={{ marginTop: 20 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Select a Day</Text>

                                                        <Text style={appstyle.require}>*</Text>
                                                    </View>
                                                    <Dropdown
                                                        style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                        placeholderStyle={{ color: 'gray' }}
                                                        placeholderTextColor={"grey"}
                                                        selectedTextStyle={appstyle.text}
                                                        inputSearchStyle={[appstyle.inputSearchStyle]}
                                                        iconStyle={appstyle.iconStyle}
                                                        search={true}
                                                        itemTextStyle={[appstyle.text]}
                                                        itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                        containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                        data={payDays}
                                                        activeColor={themeColors?.inputprimary}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder="Select a day"
                                                        searchPlaceholder="Search..."
                                                        value={record?.dayordate}
                                                        {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                            handleInputChange('dayordate', e?.value)

                                                        }}

                                                    />
                                                    {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}

                                                </View>

                                            ) : (
                                                <>
                                                    <View style={{ marginTop: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Week Pattern</Text>

                                                            <Text style={appstyle.require}>*</Text>
                                                        </View>
                                                        <Dropdown
                                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                            placeholderStyle={{ color: 'gray' }}
                                                            placeholderTextColor={"grey"}
                                                            selectedTextStyle={appstyle.text}
                                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                                            iconStyle={appstyle.iconStyle}
                                                            search={true}
                                                            itemTextStyle={[appstyle.text]}
                                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                            data={weekdata}
                                                            activeColor={themeColors?.inputprimary}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select a day"
                                                            searchPlaceholder="Search..."
                                                            value={record?.occurance}
                                                            {...register("occurance", { required: content.fieldrequire, })} onChange={(e) => {
                                                                handleInputChange('occurance', e?.value)

                                                            }}

                                                        />
                                                        {errors.occurance && <Text style={styles.errortext}>{errors.occurance.message}</Text>}

                                                    </View>
                                                    <View >

                                                        <Dropdown
                                                            style={{ padding: 12, marginTop: 10, borderRadius: 7, backgroundColor: themeColors?.inputprimary, height: 45 }}
                                                            placeholderStyle={{ color: 'gray' }}
                                                            placeholderTextColor={"grey"}
                                                            selectedTextStyle={appstyle.text}
                                                            inputSearchStyle={[appstyle.inputSearchStyle]}
                                                            iconStyle={appstyle.iconStyle}
                                                            search={true}
                                                            itemTextStyle={[appstyle.text]}
                                                            itemContainerStyle={{ flex: 1, backgroundColor: themeColors?.inputprimary }}
                                                            containerStyle={{ height: 300, borderRadius: 10, bottom: 60, backgroundColor: themeColors?.inputprimary }}
                                                            data={weekdays}
                                                            activeColor={themeColors?.inputprimary}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select a day"
                                                            searchPlaceholder="Search..."
                                                            value={record?.dayordate}
                                                            {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                                handleInputChange('dayordate', e?.value)

                                                            }}

                                                        />
                                                        {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}

                                                    </View>
                                                </>

                                                // <View style={{ marginTop: 20, gap: 10 }}>
                                                //     <View style={{ flexDirection: 'row' }}>
                                                //         <Text style={[styles?.sidehead]}>Week Pattern</Text>
                                                //         <Text style={[appstyle.require,]}>*</Text>
                                                //     </View>
                                                //     <View style={{ flexDirection: 'row', marginTop: 10 }}>

                                                //         <View style={{ flex: 1 }}>

                                                //             <Dropdown
                                                //                 data={weekdata}
                                                //                 labelField="label"
                                                //                 valueField="value"
                                                //                 placeholder="Select occurance"
                                                //                 activeColor={themeColors?.inputprimary}
                                                //                 placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                //                 containerStyle={[styles.dropdowncontainer,]}
                                                //                 itemTextStyle={styles?.drapdownselecttext}
                                                //                 selectedTextStyle={styles?.drapdownselecttext}
                                                //                 style={[styles?.dropdownbackground, {}]}
                                                //                 value={record?.occurance}
                                                //                 {...register("occurance", { required: content.fieldrequire, })} onChange={(e) => {
                                                //                     handleInputChange('occurance', e?.value)

                                                //                 }}

                                                //             />

                                                //             {errors.occurance && <Text style={styles.errortext}>{errors.occurance.message}</Text>}
                                                //         </View>

                                                //         <View style={{ flex: 1, marginStart: 10 }}>

                                                //             <Dropdown
                                                //                 data={weekdays}
                                                //                 labelField="label"
                                                //                 valueField="value"
                                                //                 placeholder="Select day"
                                                //                 activeColor={themeColors?.inputprimary}
                                                //                 placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                //                 containerStyle={[styles.dropdowncontainer,]}
                                                //                 itemTextStyle={styles?.drapdownselecttext}
                                                //                 selectedTextStyle={styles?.drapdownselecttext}
                                                //                 style={[styles?.dropdownbackground, {}]}
                                                //                 value={record?.dayordate}
                                                //                 {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                //                     handleInputChange('dayordate', e?.value)

                                                //                 }}

                                                //             />

                                                //             {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}
                                                //         </View>

                                                //     </View>
                                                // </View>
                                            )}
                                        </View>}




                                    {/* {record?.frequency === 'Every month' && (
                                        <View>
                                            <View style={{ marginTop: 25, }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={[styles.monthText,]}>Every Month</Text>
                                                    <Text style={[appstyle.require]}>*</Text>
                                                </View>
                                                <View style={[styles.segmentControl, { marginTop: 10 }]}>
                                                    <Pressable
                                                        onPress={() => {
                                                            setrecord({ ...record, dayof: 'month', dayordate: payDays[1].value })
                                                        }}
                                                        style={[styles.segmentPill, { backgroundColor: record?.dayof === 'month' ? themeColors.tab_active_bg : 'transparent', flex: 1, alignItems: 'center' }]}>
                                                        <Text style={{ color: record?.dayof === 'month' ? themeColors?.tab_active_text : themeColors?.text_primary }}>Day of the Month</Text>
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => {
                                                            setrecord({ ...record, dayof: 'week', dayordate: weekdays[0].value, occurance: weekdata[0].value })
                                                        }}
                                                        style={[styles.segmentPill, { backgroundColor: record?.dayof === 'week' ? themeColors.tab_active_bg : 'transparent', flex: 1, alignItems: 'center' }]}>
                                                        <Text style={{ color: record?.dayof === 'week' ? themeColors?.tab_active_text : themeColors?.text_primary }}>Day of the Week</Text>
                                                    </Pressable>
                                                </View>
                                            </View>

                                            {record?.dayof === 'month' ? (
                                                <View style={{ marginTop: 15 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles?.sidehead, { marginBottom: 10 }]}>Select a Day</Text>
                                                        <Text style={[appstyle.require, { marginBottom: 10 }]}>*</Text>
                                                    </View>
                                                    <Dropdown
                                                        data={payDays}
                                                        labelField="label"
                                                        valueField="value"
                                                        placeholder="Select occurance"
                                                        activeColor={themeColors?.inputprimary}
                                                        placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                        containerStyle={[styles.dropdowncontainer,]}
                                                        itemTextStyle={styles?.drapdownselecttext}
                                                        selectedTextStyle={styles?.drapdownselecttext}
                                                        style={[styles?.dropdownbackground, {}]}
                                                        value={record?.dayordate}
                                                        {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                            handleInputChange('dayordate', e?.value)

                                                        }}

                                                    />

                                                    {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}

                                                </View>
                                            ) : (
                                                <View style={{ marginTop: 20, gap: 10 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={[styles?.sidehead]}>Week Pattern</Text>
                                                        <Text style={[appstyle.require,]}>*</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                                                        <View style={{ flex: 1 }}>

                                                            <Dropdown
                                                                data={weekdata}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder="Select occurance"
                                                                activeColor={themeColors?.inputprimary}
                                                                placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                                containerStyle={[styles.dropdowncontainer,]}
                                                                itemTextStyle={styles?.drapdownselecttext}
                                                                selectedTextStyle={styles?.drapdownselecttext}
                                                                style={[styles?.dropdownbackground, {}]}
                                                                value={record?.occurance}
                                                                {...register("occurance", { required: content.fieldrequire, })} onChange={(e) => {
                                                                    handleInputChange('occurance', e?.value)

                                                                }}

                                                            />

                                                            {errors.occurance && <Text style={styles.errortext}>{errors.occurance.message}</Text>}
                                                        </View>

                                                        <View style={{ flex: 1, marginStart: 10 }}>

                                                            <Dropdown
                                                                data={weekdays}
                                                                labelField="label"
                                                                valueField="value"
                                                                placeholder="Select day"
                                                                activeColor={themeColors?.inputprimary}
                                                                placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                                containerStyle={[styles.dropdowncontainer,]}
                                                                itemTextStyle={styles?.drapdownselecttext}
                                                                selectedTextStyle={styles?.drapdownselecttext}
                                                                style={[styles?.dropdownbackground, {}]}
                                                                value={record?.dayordate}
                                                                {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                                    handleInputChange('dayordate', e?.value)

                                                                }}

                                                            />

                                                            {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}
                                                        </View>

                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    )}


                                    {record?.frequency === 'Every year' && (
                                        <View style={{ marginTop: 20 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.sectionTitle}>Select Months</Text>
                                                <Text style={[appstyle.require]}>*</Text>
                                            </View>

                                            <View style={{ marginTop: 10 }}>

                                                <Dropdown
                                                    data={months}
                                                    labelField="label"
                                                    valueField="value"
                                                    placeholder="Select month"
                                                    activeColor={themeColors?.inputprimary}
                                                    placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                    containerStyle={[styles.dropdowncontainer, { height: 250 }]}
                                                    itemTextStyle={styles?.drapdownselecttext}
                                                    selectedTextStyle={styles?.drapdownselecttext}
                                                    style={[styles?.dropdownbackground,]}
                                                    value={record?.yearmonth}
                                                    {...register("yearmonth", { required: content.fieldrequire, })} onChange={(e) => {
                                                        handleInputChange('yearmonth', e?.value)

                                                    }}

                                                />

                                                {errors.yearmonth && <Text style={styles.errortext}>{errors.yearmonth.message}</Text>}
                                            </View>


                                            <View>
                                                <View style={{ marginTop: 25 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.monthText}>Every Month</Text>
                                                        <Text style={[appstyle.require]}>*</Text>
                                                    </View>
                                                    <View style={[styles.segmentControl, { marginTop: 10 }]}>
                                                        <Pressable
                                                            onPress={() => {
                                                                setrecord({ ...record, dayof: 'month', dayordate: payDays[1].value })
                                                            }}
                                                            style={[styles.segmentPill, { backgroundColor: record?.dayof === 'month' ? themeColors.tab_active_bg : 'transparent', flex: 1, alignItems: 'center' }]}>
                                                            <Text style={{ color: record?.dayof === 'month' ? themeColors?.tab_active_text : themeColors?.text_primary }}>Day of the Month</Text>
                                                        </Pressable>
                                                        <Pressable
                                                            onPress={() => {
                                                                setrecord({ ...record, dayof: 'week', dayordate: weekdays[0].value, occurance: weekdata[0].value })
                                                            }}
                                                            style={[styles.segmentPill, { backgroundColor: record?.dayof === 'week' ? themeColors.tab_active_bg : 'transparent', flex: 1, alignItems: 'center' }]}>
                                                            <Text style={{ color: record?.dayof === 'week' ? themeColors?.tab_active_text : themeColors?.text_primary }}>Day of the Week</Text>
                                                        </Pressable>
                                                    </View>
                                                </View>

                                                {record?.dayof === 'month' ? (
                                                    <View style={{ marginTop: 15 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles?.sidehead, { marginBottom: 10 }]}>Select a Day</Text>
                                                            <Text style={[appstyle.require, { marginBottom: 10 }]}>*</Text>
                                                        </View>

                                                        <Dropdown
                                                            data={payDays}
                                                            labelField="label"
                                                            valueField="value"
                                                            placeholder="Select occurance"
                                                            activeColor={themeColors?.inputprimary}
                                                            placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                            containerStyle={[styles.dropdowncontainer,]}
                                                            itemTextStyle={styles?.drapdownselecttext}
                                                            selectedTextStyle={styles?.drapdownselecttext}
                                                            style={[styles?.dropdownbackground, {}]}
                                                            value={record?.dayordate}
                                                            {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                                handleInputChange('dayordate', e?.value)

                                                            }}

                                                        />

                                                        {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}

                                                    </View>
                                                ) : (
                                                    <View style={{ marginTop: 20, gap: 10 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles?.sidehead]}>Week Pattern</Text>
                                                            <Text style={[appstyle.require,]}>*</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                                                            <View style={{ flex: 1 }}>

                                                                <Dropdown
                                                                    data={weekdata}
                                                                    labelField="label"
                                                                    valueField="value"
                                                                    placeholder="Select occurance"
                                                                    activeColor={themeColors?.inputprimary}
                                                                    placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                                    containerStyle={[styles.dropdowncontainer,]}
                                                                    itemTextStyle={styles?.drapdownselecttext}
                                                                    selectedTextStyle={styles?.drapdownselecttext}
                                                                    style={[styles?.dropdownbackground, {}]}
                                                                    value={record?.occurance}
                                                                    {...register("occurance", { required: content.fieldrequire, })} onChange={(e) => {
                                                                        handleInputChange('occurance', e?.value)

                                                                    }}

                                                                />

                                                                {errors.occurance && <Text style={styles.errortext}>{errors.occurance.message}</Text>}
                                                            </View>

                                                            <View style={{ flex: 1, marginStart: 10 }}>

                                                                <Dropdown
                                                                    data={weekdays}
                                                                    labelField="label"
                                                                    valueField="value"
                                                                    placeholder="Select day"
                                                                    activeColor={themeColors?.inputprimary}
                                                                    placeholderStyle={{ color: 'grey', fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(12) }}
                                                                    containerStyle={[styles.dropdowncontainer,]}
                                                                    itemTextStyle={styles?.drapdownselecttext}
                                                                    selectedTextStyle={styles?.drapdownselecttext}
                                                                    style={[styles?.dropdownbackground, {}]}
                                                                    value={record?.dayordate}
                                                                    {...register("dayordate", { required: content.fieldrequire, })} onChange={(e) => {
                                                                        handleInputChange('dayordate', e?.value)

                                                                    }}

                                                                />

                                                                {errors.dayordate && <Text style={styles.errortext}>{errors.dayordate.message}</Text>}
                                                            </View>

                                                        </View>
                                                    </View>
                                                )}
                                            </View>


                                        </View>
                                    )} */}





                                    <View style={{ marginTop: 20 }}>
                                        <Text style={[appstyle.textchg, { fontSize: getFontSize(14), marginTop: 0, marginStart: 5 }]}>Next Occurrences</Text>


                                        {
                                            0 < occurrence?.length ? <View>
                                                {
                                                    occurrence.slice(0, 6).map((value, key) => {
                                                        var datech = moment(value).format('MMM DD, YYYY')
                                                        return (
                                                            <View style={{ marginTop: 15, flexDirection: 'row' }} key={key}>
                                                                <View style={{ marginStart: 20 }}>
                                                                    <CommonIcon name={'calendar'} family={'FontAwesome'} color={themeColors?.text_primary} size={15} />
                                                                </View>
                                                                <View style={{ flex: 0.5, marginStart: 20 }}>
                                                                    <Text style={appstyle.text}>{datech}</Text>
                                                                </View>
                                                                <View>
                                                                    <Text style={appstyle.text}>{storedata?.currency}{CommonFunction.formatamount(record?.amount ? record?.amount : 0)}</Text>
                                                                </View>
                                                            </View>
                                                        )

                                                    })
                                                }

                                            </View> : <View style={{ marginTop: 10, backgroundColor: '#fdfadd', flexDirection: 'row', padding: 10, borderRadius: 5 }} >

                                                <CommonIcon name={'question-circle'} family={'FontAwesome'} />
                                                <Text style={[appstyle.text, { marginStart: 10 }]}>
                                                    Adjust start date or end date to see upcoming occurrences.
                                                </Text>
                                            </View>
                                        }



                                    </View>


                                    {/* <View style={{ margin: 30, alignItems: 'center' }}>
                                        {
                                            loading ? <LoaderButton /> : <TouchableOpacity style={[appstyle.btnbg, { padding: 15 }]} onPress={handleSubmit(submitBill)}>
                                                <Text style={appstyle.btnText}>{route?.params?.screen ? "Update" : "Submit"}</Text>

                                            </TouchableOpacity>
                                        }


                                    </View> */}



                                </View>

                        }






                    </ScrollView>

                    {
                        !keyboardVisible &&
                        <View style={{ margin: 18 }}>
                            {
                                activeTab === 'Basic' ?
                                    <TouchableOpacity style={[appstyle.newbgbtn]} onPress={handleSubmit(chageTaptwo)}>
                                        <Text style={appstyle.newbtnText}>Next</Text>

                                    </TouchableOpacity> : <>

                                        {
                                            0 < occurrence?.length ? <View>


                                                <TouchableOpacity
                                                    disabled={loading}
                                                    style={[appstyle.newbgbtn, { flexDirection: 'row' }]}
                                                    onPress={handleSubmit(submitBill)}>
                                                    <View style={{ flex: 1, alignItems: loading ? 'flex-end' : 'center' }}>
                                                        <Text
                                                            style={appstyle.newbtnText}
                                                        >
                                                            {loading ? 'Loading' : 'Submit'}
                                                        </Text>
                                                    </View>
                                                    {
                                                        loading &&
                                                        <View style={{ flex: 0.8, start: 10 }}>
                                                            <LoaderKit
                                                                style={{ height: 20, width: 20, }}
                                                                name={'BallPulse'}
                                                                color={themeColors.btn_text_color}
                                                            />
                                                        </View>
                                                    }

                                                </TouchableOpacity>
                                            </View> : <View>

                                                <Pressable
                                                    disabled={loading}
                                                    style={[appstyle.newbgbtn, { flexDirection: 'row', opacity: 0.5 }]}
                                                >
                                                    <View style={{ flex: 1, alignItems: loading ? 'flex-end' : 'center' }}>
                                                        <Text
                                                            style={appstyle.newbtnText}
                                                        >
                                                            Submit
                                                        </Text>
                                                    </View>

                                                </Pressable>
                                            </View>
                                        }


                                    </>


                            }


                        </View>
                    }







                </View>
            </KeyboardAvoidingView>






            {
                showenddate && (
                    <Modal visible={showenddate} transparent animationType="slide">
                        <View style={appstyle.overlay1}>
                            <View style={appstyle.container1}>
                                {/* Header Buttons */}
                                <View style={appstyle.header1}>
                                    <Pressable onPress={onCancel}>
                                        <Text style={appstyle.cancel1}>Cancel</Text>
                                    </Pressable>

                                    <Pressable onPress={onDone}>
                                        <Text style={appstyle.done1}>Done</Text>
                                    </Pressable>
                                </View>


                                {
                                    Platform.OS === 'ios' ?
                                        <View style={{ alignItems: 'center' }}>
                                            <DateTimePicker
                                                value={record?.enddate ? new Date(record?.enddate) : enddate}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                // maximumDate={new Date()}
                                                minimumDate={record?.startdate ? new Date(record?.startdate) : stardate}
                                                style={{ backgroundColor: '#F2F2F2' }}
                                                textColor="black"   // iOS only

                                                onChange={(e, date) => {
                                                    if (!date) return;

                                                    let selectedDate = new Date(date);

                                                    if (selectedDate.toDateString() === record?.startdate ? new Date(stardate).toDateString() : new Date(stardate).toDateString()) {
                                                        selectedDate.setDate(selectedDate.getDate() + 1);

                                                    }

                                                    setendate(selectedDate);
                                                }}
                                            />
                                        </View> :
                                        <CalendarPicker
                                            width={330}
                                            // initialDate={stardate}
                                            selectedStartDate={enddate}
                                            // maxDate={maxDate}
                                            minDate={stardate}
                                            selectedDayColor={themeColors?.bgbtn}
                                            selectedDayTextColor='#fff'
                                            todayBackgroundColor='#fff'
                                            textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(16) }}
                                            {...register("enddate")}
                                            onDateChange={(value) => {

                                                console.log(value)

                                                handleInputChange('enddate', value), setendate(value), setshowenddate(false)
                                            }}
                                        />
                                }



                            </View>
                        </View>
                    </Modal>
                )
            }





            {
                show && (
                    <Modal visible={show} transparent animationType="slide">
                        <View style={[appstyle.overlay1]}>
                            <View style={[appstyle.container1]}>
                                {/* Header Buttons */}
                                <View style={appstyle.header1}>
                                    <Pressable onPress={onCancel1}>
                                        <Text style={appstyle.cancel1}>Cancel</Text>
                                    </Pressable>

                                    <Pressable onPress={onDone1}>
                                        <Text style={appstyle.done1}>Done</Text>
                                    </Pressable>
                                </View>
                                {
                                    Platform.OS === 'ios' ?
                                        <View style={{ alignItems: 'center' }}>
                                            <DateTimePicker
                                                value={record?.startdate ? new Date(record?.startdate) : stardate}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                maximumDate={enddate ? enddate : new Date()}
                                                minimumDate={new Date()}
                                                style={{ backgroundColor: '#F2F2F2' }}
                                                textColor="black"   // iOS only
                                                // onChange={(e, date) => date && setstartDate(date)}
                                                onChange={(e, date) => {
                                                    if (!date) return;

                                                    let selectedDate = new Date(date);

                                                    if (selectedDate.toDateString() === record?.endDate ? new Date(enddate).toDateString() : new Date(enddate).toDateString()) {
                                                        selectedDate.setDate(selectedDate.getDate() - 1);

                                                    }

                                                    setstartDate(selectedDate);
                                                }}
                                            />
                                        </View> :
                                        <CalendarPicker
                                            width={330}
                                            // initialDate={stardate}
                                            selectedStartDate={stardate}
                                            maxDate={enddate ? enddate : new Date()}
                                            minDate={new Date()}
                                            selectedDayColor={themeColors?.bgbtn}
                                            selectedDayTextColor='#fff'
                                            todayBackgroundColor='#fff'
                                            textStyle={{ color: themeColors?.inputsecondary, fontSize: getFontSize(16) }}
                                            {...register("startdate")}
                                            onDateChange={(value) => {
                                                handleInputChange('startdate', value), setstartDate(value), setShow(false)
                                            }}
                                        />
                                }


                            </View>
                        </View>
                    </Modal>
                )
            }

            {/* <Modal visible={isModal} transparent animationType="fade">
                <View style={[appstyle.modalBackground]}>
                    <View style={[appstyle.alertBox1]}>
                        <Text style={[appstyle.textHeader, { color: themeColors?.text_primary }]}>Leaving Page</Text>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[appstyle.text, { color: themeColors?.text_primary }]}>There are some changes,If you proceed your changes will be lost.Are you sure you want to proceed?</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginEnd: 20, justifyContent: 'center', flex: 1, alignItems: 'center', borderWidth: 1, borderColor: themeColors?.bgbtn, borderRadius: 3 }} onPress={() => { setIsModal(false) }}>
                                    <Text style={[appstyle.text, { color: themeColors?.text_primary }]}>No</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[appstyle.btnbg, { marginTop: 0, width: width * 0.35, padding: 8, borderRadius: 3 }]} onPress={() => { navigation?.goBack(), enableMenu() }}>
                                    <Text style={[appstyle.btnText]}>Yes</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                    </View>
                </View>

            </Modal> */}

            <CustomModal
                visible={isModal}
                onClose={() => setIsModal(false)}

                // type="success"
                alertTitle="Leaving Page!"
                actionText="Yes"
                cancelText="No"
                onAction={() => {
                    navigation?.goBack(), enableMenu()
                }}
            >
                <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15) }}>
                    There are some changes,If you proceed your changes will be lost.Are you sure you want to proceed?
                </Text>
            </CustomModal>





        </GradientBackground >

    )
}

export default BillCreate




const createStyles = (themeColors) =>
    StyleSheet.create({

        sidehead: {
            color: themeColors?.text_primary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14)
        },
        errortext: {
            color: themeColors?.danger,
            fontSize: getFontSize(14)
        },
        sheetDateTextActive: {
            color: themeColors?.btn_text_color
        },
        sheetDateText: {
            color: themeColors?.card_text_color
        },
        dropdowncontainer: {
            backgroundColor: themeColors.inputprimary,
            color: themeColors?.inputsecondary
        },
        dropdownbackground: {
            backgroundColor: themeColors.inputprimary,
            borderRadius: 5,
            paddingHorizontal: 10,
            height: 40,
            flex: 1,
            color: themeColors?.inputsecondary
        },
        drapdownselecttext: {
            color: themeColors?.inputsecondary,
            fontSize: getFontSize(14),
            fontFamily: fontsFamily.semiboldFont
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
        },
        backButton: {
            padding: 4,
            marginRight: 16,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: COLORS.text,
        },
        bannerContainer: {
            backgroundColor: '#612B82',
            borderRadius: 8,
            marginHorizontal: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        bannerIconWrapper: {
            backgroundColor: '#FFF',
            borderRadius: 20,
            padding: 8,
            marginRight: 12,
        },
        bannerTitle: {
            color: '#FFF',
            fontSize: 18,
            fontWeight: '600',
        },
        tabsContainer: {
            flexDirection: 'row',
            backgroundColor: themeColors?.tabbg,
            borderRadius: 10,
            marginHorizontal: 16,
            padding: 2,
            marginBottom: 10,
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 10,
        },
        tabActive: {
            backgroundColor: themeColors?.tab_active_bg
        },
        tabText: {
            fontWeight: '600',
            color: themeColors?.text_primary,
        },
        tabTextActive: {
            color: themeColors?.tab_active_text,
        },
        formSection: {
            paddingHorizontal: 16,
        },
        inputField: {
            // borderWidth: 1,
            // borderColor: '#612B82',
            backgroundColor: themeColors?.inputprimary,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,


            color: themeColors?.inputsecondary,
            color: themeColors?.inputsecondary, fontFamily: fontsFamily.semiboldFont, fontSize: getFontSize(14)

        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'

        },
        selectField: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#612B82',
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        selectText: {
            fontSize: 16,
            fontWeight: '600',
            color: COLORS.text,
        },
        rowCenter: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        tagIcon: {
            backgroundColor: '#F3E5F5',
            padding: 14,
            borderRadius: 25,
            marginLeft: 12,
        },
        dateCard: {
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 8,
            padding: 16,
            marginVertical: 20,
            backgroundColor: themeColors?.cardbg
        },
        dateRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        dateLabel: {
            fontSize: getFontSize(14),
            color: themeColors?.card_text_color,
            marginBottom: 4,
            opacity: 0.6
        },
        dateValue: {
            fontSize: getFontSize(14),
            fontFamily: fontsFamily.semiboldFont,
            fontWeight: '600',
            color: themeColors?.card_text_color,
            marginTop: 10
        },
        dateFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        frequencyBg: {
            backgroundColor: themeColors?.bgbtn, // Light Blue/Cyan tip
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 4,
        },
        frequencyText: {
            fontSize: getFontSize(12),
            color: '#455A64',
            fontWeight: '500',
            fontFamily: fontsFamily.semiboldFont,
            color: themeColors?.btn_text_color
        },
        changeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: themeColors?.bgbtn,
            paddingHorizontal: 10,
        },
        changeButtonText: {
            marginLeft: 4,
            fontWeight: '600',
            color: themeColors?.btn_text_color,
        },
        typeSection: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20

        },
        typeLabel: {
            fontSize: getFontSize(14),
            fontWeight: '700',
            color: themeColors?.text_primary,
            marginRight: 24,
            marginStart: 10
        },
        radioGroup: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        radioContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 24,
        },
        radioOuter: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: themeColors?.bgbtn,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
        },
        radioOuterSelected: {
            borderColor: themeColors?.bgbtn,
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: themeColors?.bgbtn,
        },
        radioLabel: {
            fontSize: 14,
            color: '#9E9E9E',
            fontWeight: '500',
        },
        radioLabelSelected: {
            color: '#9E9E9E', // Design has greyish text even when selected usually, or can make primary
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#FFF',
            // borderTopWidth: 1,
            // borderTopColor: '#EEE',
        },
        cancelButton: {
            flex: 1,
            marginRight: 12,
            paddingVertical: 14,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#612B82',
            alignItems: 'center',
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#612B82',
        },
        createButton: {
            flex: 1,
            marginLeft: 12,
            paddingVertical: 14,
            borderRadius: 8,
            backgroundColor: '#612B82',
            alignItems: 'center',
        },
        createButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFF',
        },
        segmentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
        monthText: { fontFamily: fontsFamily.mediumFont, fontSize: getFontSize(14), color: themeColors?.text_primary },
        segmentControl: { flexDirection: 'row', backgroundColor: themeColors?.tabbg, borderRadius: 8, padding: 4, elevation: 0 },
        segmentPill: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 }, segmentActive: { backgroundColor: '#6b2b8f' },
        segmentText: { fontFamily: fontsFamily.regularFont, color: '#5a5a5a' },
        segmentTextActive: { color: '#fff', fontFamily: fontsFamily.boldFont },
        sectionCard: { marginTop: 18, backgroundColor: 'transparent' },
        // New Styles
        dropdown: {
            borderWidth: 1,
            borderColor: '#612B82', // Reusing purple
            borderRadius: 5,
            paddingHorizontal: 10,
            height: 40,
            backgroundColor: '#fff',
        },
        daysContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        dayButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            // borderWidth: 1,
            borderColor: '#E0EN0',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColors?.card_list_bg,
        },
        dayButtonActive: {
            backgroundColor: themeColors?.bgbtn,
            borderColor: '#612B82',
        },
        dayText: {
            fontSize: 14,
            color: themeColors?.card_text_color,
            fontWeight: '500',
        },
        dayTextActive: {
            color: themeColors?.btn_text_color,
        },
        sectionTitle: {
            fontSize: getFontSize(14),
            fontWeight: '600',
            marginBottom: 8,
            color: themeColors?.text_primary,
        },
        monthsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'space-between',
            marginTop: 10,
        },
        monthButton: {
            width: '30%', // Grid of 3
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: '#E0E0E0',
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 8,
            backgroundColor: '#f5f5f5',
        },
        monthButtonActive: {
            backgroundColor: '#612B82',
            borderColor: '#612B82',
        },
        monthTextBtn: {
            fontSize: 14,
            color: '#666',
            fontWeight: '500',
        },
        monthTextActive: {
            color: '#fff',
        },
        selectedStyle: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#612B82',
            marginTop: 5,
        },
        dropdownButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            // borderColor: '#612B82',
            borderRadius: 5,
            paddingHorizontal: 10,
            height: 45,
            backgroundColor: themeColors?.inputprimary,
        },

    });

