import { Dimensions, KeyboardAvoidingView,Platform, Pressable,RefreshControl,SectionList,StatusBar,StyleSheet,Text,TextInput, View,TouchableOpacity,FlatList,Animated as RNAnimated, Alert, ScrollView} from 'react-native';
import React, { useCallback, useContext, useState, useRef, useEffect, useMemo } from 'react';
import moment from 'moment/moment';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {useSharedValue,useAnimatedStyle, withTiming,useAnimatedScrollHandler} from "react-native-reanimated";
import { useIsFocused } from '@react-navigation/native';
import { Button, Divider } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import RBSheet from 'react-native-raw-bottom-sheet';
import getStyles from '../../../styles';
import CommonIcon from '../../../component/Commonicons';
import MonthPicker from 'react-native-month-year-picker';
import { fontsFamily } from '../../../../constants/fontsFamily';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getFontSize } from '../../../../constants/Font';
import { apiformatDate,formatDate  } from '../../../../utill/Utills';
import BudgetCard from '../../../component/BudgetCard';
import SectionHeader from '../../../component/SectionHeader';
import { useSelector } from 'react-redux';
import CommonHead from '../../../component/CommonHead';
import GradientBackground from '../../../component/GradientBackground';
import { BottomContext } from '../../../../context/BottomContext';
import { useDispatch } from 'react-redux';
import { fetchBudgetcategory, updateBudgetcategory } from '../../../../redux/slices/budgetcategorySlice';
import { content, fillMonthlyBudgetsFromFirst } from '../../../../constants/content';
import { commontimeline } from '../../../../utill/Utills';
import CommonFunction from '../../../../utill/CommonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Menu, PaperProvider, Portal } from "react-native-paper";
import { fetchCategory } from '../../../../redux/slices/categorySlice';
import SetBudgetModal from '../../../component/SetBudgetModal';
import LoaderKit from 'react-native-loader-kit'
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import CustomModal from '../../../component/CustomModal';
import { resetStatement } from '../../../../redux/slices/statementSlice';
import { appuseBackHandler } from '../../../../utill/appuseBackHandler';
import { fetchBills, resetBill } from '../../../../redux/slices/billSlice';
import api from '../../../../service/api';

const CustomStatusBar = ({ backgroundColor }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ height: insets.top, backgroundColor }}>
            <StatusBar animated backgroundColor={backgroundColor} barStyle="dark-content" />
        </View>
    );
};


const rippleConfig = { color: "#ccc", borderless: false };

const IconButton = ({ family, name, onPress, themeColors, size = 20, style }) => {
    if (style) {
        return <Pressable
            onPress={onPress}
            android_ripple={rippleConfig}
            style={({ pressed }) => [styles.iconActionButton, { backgroundColor: themeColors?.iconbg, height: 30, width: 30 }, pressed && { opacity: 0.6 }]}
        >
            <CommonIcon family={family} name={name} size={size} color={themeColors?.iconcolor} />
        </Pressable>

    } else {

        return <Pressable
            onPress={onPress}
            android_ripple={rippleConfig}
            style={({ pressed }) => [styles.iconActionButton, { backgroundColor: themeColors?.iconbg }, pressed && { opacity: 0.6 }]}
        >
            <CommonIcon family={family} name={name} size={size} color={themeColors?.iconcolor} />
        </Pressable>
    }
}




const filterModel = [
    { id: 1, name: 'All' }, { id: 2, name: 'Under Funded' }, { id: 2, name: 'Over Funded' }, { id: 3, name: 'Money Available' }, { id: 4, name: 'Snoozed' }, { id: 5, name: 'Today' }
]


const Budget = ({ navigation, route }) => {

    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    const { styles: appstyle, geticonSize } = getStyles(themeColors);
    const insets = useSafeAreaInsets();
    const scrollRef = useRef();
    const GoalrefRBSheet = useRef();
    const addgrouprefRBSheet = useRef()
    const editgrouprefRBSheet = useRef()
    const addcatrefRBSheet = useRef()
    const editcatrefRBSheet = useRef()
    const { control, handleSubmit, reset, register, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused()
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [categoryData, setCatgorydata] = useState([]);
    const [data, setData] = useState('')
    const cardRefs = useRef([]);
    const [openStates, setOpenStates] = useState([]);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [showPicker, setshowPicker] = useState(false)
    const { icons } = useSelector((state) => state.menuicons);
    const [record, setRecord] = useState('')
    const [date, setDate] = useState(new Date())
    const dispatch = useDispatch()
    const [activeIndex, setActiveIndex] = useState(null);
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const { page, size, records, hasMore, stloading, firstTransDate } = useSelector((state) => state.statement);
    const { getnameaccountdata, getnameaccountloading, getnameaccounterror, } = useSelector((state) => state.getaccountname);
    const [keyNumber, setkeyNumber] = useState('')
    const scrollY = useSharedValue(0);
    const flatIndexRef = useRef(0);
    const lastVisibilityRef = useRef(null);
    const [assigAmt, setAssignAmt] = useState(0)
    const scroll1Y = useRef(0);
    const [firstTrans, setFirstTrans] = useState('')
    const { height, width } = Dimensions.get('window')
    const [isMenu, setIsMenu] = useState(false)
    const [isAssign, setisAssign] = useState(false)
    const [isReset, setIsreset] = useState(false)
    const [flag, setflag] = useState(0)
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            scrollY.value = event.contentOffset.y;
        },
    });
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
    const { budgetcategorydata, budgetcategoryloading } = useSelector((state) => state.budgetcategory);
    const { firsttransationdate } = useSelector((state) => state.statement);
    const [underFundid, setunderFundId] = useState([])
    const [checkAssign, setCheckassign] = useState([])
    const [checkAssign1, setCheckassign1] = useState([])
    const [includeassignid, setincludeassignid] = useState([])
    const { notificationdata, notificationerror, notificationloading } = useSelector((state) => state.notification);
    const [type, setType] = useState('')
    const budgetSheetref = useRef()
    const [details, setDetails] = useState('')
    const [showSetBudgetModal, setShowSetBudgetModal] = useState(false);
    const [selectedCategoryForBudget, setSelectedCategoryForBudget] = useState(null);
    const [btnLoad, setIsbtnload] = useState(false)
    const [showopenmovemodel, setopenmovemodel] = useState(false)
    const [showdelete, setshowdelete] = useState(false)




    appuseBackHandler(() => {
        navigation.goBack();
        return true;
    });




    useEffect(() => {
        if (isFocused) {
            getDetails()

        }


    }, [isFocused])

    useEffect(() => {
        if (firstTransDate) {
            setFirstTrans(firstTransDate)
        }

    }, [firstTransDate])


    const getDetails = () => {


        if (0 < records.length) {
            var firstdata = records[records.length - 1]
            setFirstTrans(firstdata?.transacted_at)
        }

        setShowKeyboard(false)
        setOpenStates([])
        enableMenu()
        setkeyNumber('')
        setActiveIndex('')
        enableMenu()
        flatIndexRef.current = 0;
        const info = {
            affectspending: 'Yes',
            affectreports: 'Yes',
            type: 'DEBIT',
            date: new Date()
        }
        setData(info)

        if (route.params?.date) {
            const dt = new Date(route.params?.date)
            setDate(dt)
        } else {
            setDate(new Date())
        }




    }





    useEffect(() => {
        if (budgetcategorydata) {
            var begin = ''
            var end = ''
            begin = commontimeline(date).begin
            end = commontimeline(date).end

            // setCatgorydata(budgetcategorydata?.records);

            var targetamt = 0

            var arrst = []
            const groupedCheckass = {};
            const groupedCheckass1 = {};

            const catgoryid = []
            var firstdata = records[records.length - 1]
            const firstdate = firstdata?.transacted_at
                ? new Date(firstdata.transacted_at)
                : budgetcategorydata?.plans?.[0]?.createdAt
                    ? new Date(budgetcategorydata.plans[0].createdAt)
                    : new Date();


            if (0 < budgetcategorydata?.records?.length) {

                // const historyupdate = budgetcategorydata?.records.map(value => {
                //     return {
                //         ...value,
                //         categories: value.categories.map(subvalue => {
                //             const monthExists = subvalue.history.some(his => his.Month === apiformatDate(date));
                //             return {
                //                 ...subvalue,
                //                 history: monthExists ? subvalue.history : [...subvalue.history,
                //                 {
                //                     Month: apiformatDate(date),
                //                     balance: 0,
                //                     budget: "0",
                //                     setdate: date.toISOString(),
                //                     updatedAt: date.toISOString()
                //                 }]
                //             };
                //         })
                //     };
                // });

                const historyupdate = budgetcategorydata?.records.map(value => {
                    return {
                        ...value,
                        categories: value.categories.map(subvalue => {
                            return {
                                ...subvalue,
                                history: fillMonthlyBudgetsFromFirst(subvalue.history, firstdate)
                            };
                        })
                    };
                });




                setCatgorydata(historyupdate)


                historyupdate?.forEach((group) => {

                    group.categories?.forEach((category) => {

                        // Get target details
                        const datarec = getTargetdetails(
                            category?.target,
                            category?.history,
                            category?.id
                        );
                        const budgethis = category?.history?.find(
                            (obj) => obj?.Month === apiformatDate(date)
                        );

                        if (budgethis && Number(budgethis?.budget) > 0) {

                            catgoryid.push(category?.id)
                            if (!groupedCheckass[group?.group_id]) {
                                groupedCheckass[group?.group_id] = {
                                    ...group,
                                    categories: []
                                };
                            }
                            groupedCheckass[group?.group_id].categories.push({
                                ...category,
                                history: budgethis
                            });
                        }

                        targetamt += Number(datarec?.amount || 0);

                        if (datarec?.id) {
                            arrst.push(category?.id)
                            if (!groupedCheckass1[group?.group_id]) {
                                groupedCheckass1[group?.group_id] = {
                                    ...group,
                                    categories: []
                                };
                            }
                            groupedCheckass1[group?.group_id].categories.push({
                                ...category,
                                history: { ...budgethis, targetamt: datarec?.amount }
                            });
                            // arrst.push({
                            //     catid: datarec?.id,
                            //     group_id: group?.group_id,
                            //     targetamt: datarec?.amount,
                            //     budgetamt: datarec?.budgetamt
                            // });
                        }

                    });

                });


            }

            const checkass = Object.values(groupedCheckass);

            const checkass1 = Object.values(groupedCheckass1);


            setCheckassign(checkass)
            setincludeassignid(catgoryid)

            setunderFundId(arrst)
            setCheckassign1(checkass1)



            setAssignAmt(parseFloat(targetamt).toFixed(2))




        }
    }, [budgetcategorydata, date, records]);



    const searchcategoryTransaction = useMemo(() => {

        const transaction = records?.find((item) => item?.category_id === record?.category_id && item?.transaction_source == 'manual')

        return transaction

    }, [record])

    const searchroupTransaction = useMemo(() => {
        return budgetcategorydata?.records?.some((group) => {
            if (group?.group_id !== record?.group_id) return false;

            return group?.categories?.some((val) =>
                records?.some(
                    (txn) =>
                        txn?.category_id === val?.id &&
                        txn?.amount > 0 &&
                        txn?.transaction_source === 'manual'
                )
            );
        });
    }, [budgetcategorydata?.records, records, record?.group_id]);





    // function fillMonthlyBudgetsFromFirst(history, fdate) {
    //     if (!fdate) return [];

    //     const sorted = [...(history || [])].sort(
    //         (a, b) => new Date(a.Month + "-01") - new Date(b.Month + "-01")
    //     );

    //     const res = [];
    //     let loop = new Date(fdate);
    //     loop = new Date(loop.getFullYear(), loop.getMonth(), 1);

    //     let lastBudget = 0;
    //     let lastSetDate = null;
    //     let lastUpdateDate = null;
    //     let started = false;

    //     // const monthadd = moment(date).add(2,'month')
    //     const currentDate = new Date().toISOString();

    //     const today = new Date();
    //     const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);





    //     while (loop <= currentMonthStart) {

    //         const monthStr = `${loop.getFullYear()}-${String(loop.getMonth() + 1).padStart(2, "0")}`;
    //         const found = sorted.find(item => item.Month === monthStr);

    //         if (found && Number(found.budget) > 0) {
    //             lastBudget = Number(found.budget);
    //             lastSetDate = found.setdate || currentDate;
    //             lastUpdateDate = found.updatedate || currentDate;
    //             started = true;
    //         }

    //         res.push({
    //             Month: monthStr,
    //             budget: started ? lastBudget : 0,
    //             setdate: started ? lastSetDate : null,
    //             updatedate: started ? lastUpdateDate : null
    //         });

    //         loop.setMonth(loop.getMonth() + 1);
    //     }

    //     return res;
    // }




    const getRemainingWeekdaysInMonth = (dateStr, targetWeekday) => {
        const startDate = new Date(dateStr);

        const year = startDate.getFullYear();
        const month = startDate.getMonth(); // 0-based

        const weekdayMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
        };

        const targetDay = weekdayMap[targetWeekday];
        if (targetDay === undefined) return 0;

        let count = 0;

        // Start checking from the given date
        let current = new Date(startDate);

        while (current.getMonth() === month) {
            if (current.getDay() === targetDay) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    };




    const getTargetdetails = (data, budegthis, catid) => {
        let totaltarget = 0;
        let year = ''
        let arrid = ''
        let budgetamount = 0

        if (0 < data?.length) {
            const targetbgdate = CommonFunction.getDate(data[0].setdate).begin
            const newtargetbgdate = new Date(targetbgdate)
            const screendateend = CommonFunction.getDate(date).end
            const newscreendateend = new Date(screendateend)

            if (newtargetbgdate <= newscreendateend) {
                data.map((val) => {
                    year = val.endDate
                    var monthdate = ''
                    if (val?.month === apiformatDate(date) && val.month === apiformatDate(new Date())) {
                        monthdate = new Date()
                    } else {
                        var begindt = CommonFunction.getDate(date).begin
                        monthdate = new Date(begindt)
                    }

                    if (val.targetType === 'MONTHLY') {
                        var monthamount = Number(val?.budget)
                        budegthis.forEach(subval => {
                            if (subval?.Month === apiformatDate(date)) {
                                if (monthamount <= subval?.budget) {
                                    totaltarget = 0
                                    arrid = ''
                                } else {
                                    arrid = catid
                                    totaltarget = monthamount - Number(subval?.budget)
                                    budgetamount = subval?.budget
                                }

                            }
                        })
                    } else if (val.targetType === 'WEEKLY') {

                        const countdays = getRemainingWeekdaysInMonth(monthdate, val?.weekday)
                        var weekamount = countdays * Number(val?.budget)
                        budegthis.forEach(subval => {
                            if (subval?.Month === apiformatDate(date)) {
                                if (weekamount <= subval?.budget) {
                                    totaltarget = 0
                                    arrid = ''
                                } else {
                                    arrid = catid
                                    totaltarget = weekamount - Number(subval?.budget)
                                    budgetamount = subval?.budget
                                }

                            }
                        })
                    } else if (val.targetType === 'YEARLY') {
                        let remainingAmount = Number(val?.budget);
                        const currentDate = date
                        const originalStart = val?.setdate ? moment(new Date(val.setdate)).startOf('month') : moment(currentDate).startOf('month');
                        const currentMonthStart = moment(currentDate).startOf('month');
                        const effectiveStart = moment.max(originalStart, currentMonthStart);
                        let endMonth = moment(new Date(val.endDate)).startOf('month');
                        const baseEndMonth = moment(new Date(val.endDate)).startOf('month');
                        if (endMonth.isBefore(originalStart)) {
                            endMonth = endMonth.add(1, 'year');
                        }
                        while (endMonth.isBefore(effectiveStart)) {
                            endMonth = endMonth.add(1, 'year');
                        }
                        const remainingMonths = endMonth.diff(effectiveStart, 'months') + 1;
                        const totalBudget = Number(val?.budget) || 0;
                        const firstCycleEnd = baseEndMonth.clone().isBefore(originalStart)
                            ? baseEndMonth.clone().add(1, 'year')
                            : baseEndMonth.clone();
                        const cycleMonths = firstCycleEnd.diff(originalStart, 'months') + 1;
                        const windowStart = endMonth.clone().subtract(Math.max(cycleMonths - 1, 0), 'months');
                        let fundedBefore = 0;
                        let fundedCurrent = 0;
                        let budetamount = 0
                        if (budegthis?.length > 0) {
                            budegthis.forEach(subval => {
                                const usedMonth = moment(new Date(subval.Month)).startOf('month');
                                const b = Number(subval.budget) || 0;
                                const inActiveWindow =
                                    (usedMonth.isSame(windowStart) || usedMonth.isAfter(windowStart)) &&
                                    (usedMonth.isSame(endMonth) || usedMonth.isBefore(endMonth));

                                if (inActiveWindow && usedMonth.isBefore(effectiveStart)) {
                                    fundedBefore += b;
                                } else if (inActiveWindow && usedMonth.isSame(effectiveStart)) {
                                    fundedCurrent += b;
                                }
                                if (subval?.Month === apiformatDate(date)) {
                                    budetamount = subval?.budget
                                }
                            });
                        }
                        const remainingAfterPast = Math.max(totalBudget - fundedBefore, 0);
                        remainingAmount = remainingMonths > 0 ? remainingAfterPast / remainingMonths : 0;
                        // amount = Math.max(remainingAmount - fundedCurrent, 0);
                        // totaltarget = remainingAmount

                        if (remainingAmount <= budetamount) {
                            totaltarget = 0
                            arrid = ''
                        } else {
                            arrid = catid
                            totaltarget = remainingAmount - budetamount
                            budgetamount = budetamount
                        }
                    }

                    else {

                    }


                })
            }




        }
        const categorydata = {
            amount: totaltarget,
            budgetamt: budgetamount,
            id: arrid
        }

        return categorydata

    };



    const statementByCategory = useMemo(() => {
        const map = {};
        for (const txn of records || []) {
            const txnMonth = moment(txn.transacted_at).format("YYYY-MM");
            const currentMonth = apiformatDate(date)
            if (txnMonth !== currentMonth) continue;
            const catId = String(txn?.category_id);
            if (!map[catId]) {
                map[catId] = { spend: 0, count: 0 };
            }
            const amount = Number(txn.amount || 0);
            // Add for DEBIT, subtract for CREDIT
            if (txn.type === "DEBIT") {
                map[catId].spend += amount;
            }
            //  else if (txn.type === "CREDIT") {
            //     map[catId].spend -= amount;
            // }
            // Count all transactions for reference
            map[catId].count += 1;
        }
        return map;
    }, [records, date]);

    const lastMonth = useMemo(() => {
        const map = {};
        for (const txn of records || []) {
            const txnMonth = moment(txn.transacted_at).format("YYYY-MM");
            var lastMonth = moment(date).subtract(1, 'month')
            const currentMonth = apiformatDate(lastMonth)
            if (txnMonth !== currentMonth) continue;
            const catId = String(txn?.category_id);
            if (!map[catId]) {
                map[catId] = { spend: 0, count: 0 };
            }
            const amount = Number(txn.amount || 0);
            // Add for DEBIT, subtract for CREDIT
            if (txn.type === "DEBIT") {
                map[catId].spend += amount;
            }
            //  else if (txn.type === "CREDIT") {
            //     map[catId].spend -= amount;
            // }
            // Count all transactions for reference
            map[catId].count += 1;
        }
        return map;
    }, [date]);


    useEffect(() => {
        reset(record)
    }, [record])




    const createGroup = () => {
        enableMenu()

        setIsbtnload(true)
        const payload = {
            ...record, category: record?.category.trim()
        }

        api.post('dashboard/createbudgetgroupcate', payload).then((res) => {
            setType('')
            const mergedata = {
                id: res.data.id,
                group_id: res.data.id,
                category: record.category,
                plan_id: record.plan_id,
                categories: []
            }
            setCatgorydata((prev) => {
                const updated = [...prev, mergedata];
                const data = {
                    ...budgetcategorydata, records:
                        updated
                }
                dispatch(updateBudgetcategory(data));
                return updated;
            });
            setIsbtnload(false)

            addgrouprefRBSheet.current.close()
            CommonFunction.message(res.data.message)

            setRecord('')

            dispatch(fetchBudgetcategory())

            reset({ category: '' })

        }).catch((err) => {
            setIsbtnload(false)
            console.log(err)
            addgrouprefRBSheet.current.close()
            CommonFunction.message(err.response.data.message)
            console.log(err.response.data)
        })

    }

    const handleKeyPress = (key) => {
        if (/^\d$/.test(key) || (key === '.' && !keyNumber.includes('.') && keyNumber !== '')) {
            if (keyNumber.length <= 8) {
                setkeyNumber((p) => p + key);
                // hasScrolledRef.current = false; // reset scroll
                requestAnimationFrame(() => {
                    ensureInputVisible(activeIndex.index);
                });
            }


        }
        else if (key === 'back') {
            console.log(keyNumber)
            setkeyNumber(prev => {
                if (!prev) return '';
                return prev.toString().slice(0, -1);
            });
        }
        else if (key === 'x') {
            setkeyNumber('');
            setShowKeyboard(false);
            enableMenu();
            setActiveIndex('');
        }
        else if (key === 'y' || key === 'Assign') {
            setShowKeyboard(false);
            enableMenu();
            assignamount();
            setActiveIndex('');
        }
        else if (key === 'Move') {
            setShowKeyboard(false);
            enableMenu();
            navigation.navigate('MoveBudget', { details: activeIndex });
        }
        else if (key === 'Details') {
            setShowKeyboard(false);
            enableMenu();
            navigation.navigate('BudgetDetails', { details: activeIndex });
        }

        requestAnimationFrame(() => {
            ensureInputVisible(activeIndex.index);
        });
    };












    const toggleSection = (value) => {
        if (0 < openStates.length && openStates.includes(value)) {
            const removeid = openStates.filter(
                obj => obj.group_id !== value.group_id
            )
            setOpenStates(removeid)


        } else {
            var arr = []
            arr.push(value)

            if (0 < openStates.length) {
                var mergearr = [...openStates, ...arr]
                setOpenStates(mergearr)
            } else {
                setOpenStates(arr)
            }
        }
        setShowKeyboard(false)
        enableMenu()
        setActiveIndex('')

    }

    const assigncheck = (value) => {


        const exists = includeassignid.some(
            item => item === value
        );

        if (exists) {
            // ✅ Remove
            setincludeassignid(prev =>
                prev.filter(item => item !== value)
            );
        } else {

            // ✅ Add
            setincludeassignid(prev => [...prev, value]);
        }
    };

    const assigncheck1 = (value) => {


        const exists = underFundid.some(
            item => item === value
        );

        if (exists) {
            // ✅ Remove
            setunderFundId(prev =>
                prev.filter(item => item !== value)
            );
        } else {

            // ✅ Add
            setunderFundId(prev => [...prev, value]);
        }
    };

    const assignamount = (data) => {

        const send = {
            budget: data.budget,
            month: apiformatDate(date),
            setdate: date?.toISOString(),
            customer_id: storedata.id,
        };



        const updatedRecords = budgetcategorydata.records.map(group => {
            if (group.group_id !== selectedCategoryForBudget.group_id) return group;

            return {
                ...group,
                categories: group.categories.map(cat => {
                    if (cat.id !== selectedCategoryForBudget.id) return cat;

                    const monthExists = cat.history?.some(
                        h => h.Month === send.month
                    );

                    return {
                        ...cat,
                        history: monthExists
                            ? cat.history.map(h =>
                                h.Month === send.month
                                    ? { ...h, budget: send.budget, setdate: send.setdate }
                                    : h
                            )
                            : [
                                ...(cat.history || []),
                                {
                                    Month: send.month,
                                    budget: send.budget,
                                    setdate: send.setdate,
                                    updatedAt: send.setdate,
                                },
                            ],
                    };
                }),
            };
        });

        dispatch(
            updateBudgetcategory({
                ...budgetcategorydata,
                records: updatedRecords,
            })
        );


        setCatgorydata(updatedRecords)



        api.post(
            `dashboard/setbudget/${selectedCategoryForBudget.id}`,
            send
        )
            .then(res => {
                dispatch(fetchBudgetcategory());
                CommonFunction.message(res?.data?.message);
            })
            .catch(err => {
                console.log(err?.response?.data);
            });
    };




    const resetAssigncat = async () => {
        setIsMenu(false)
        const selectedData = checkAssign.flatMap(group =>
            group.categories
                .filter(cat => includeassignid.includes(cat.id))
                .map(cat => ({
                    ...cat,
                    group_id: group.group_id
                }))
        );

        const month = apiformatDate(date);
        const setdate = date.toISOString();

        // 1️⃣ Update local state in one pass
        const updatedRecords = budgetcategorydata.records.map(group => {
            const matchingItems = selectedData.filter(
                item => item.group_id === group.group_id
            );

            if (!matchingItems.length) return group;

            return {
                ...group,
                categories: group.categories.map(cat => {
                    const matchedValue = matchingItems.find(
                        item => item.id === cat.id
                    );

                    if (!matchedValue) return cat;

                    const newBudget = 0

                    const monthExists = cat.history?.some(
                        h => h.Month === month
                    );



                    return {
                        ...cat,
                        history: monthExists
                            ? cat.history.map(h =>
                                h.Month === month
                                    ? {
                                        ...h,
                                        budget: 0,
                                        updatedAt: setdate,
                                    }
                                    : h
                            )
                            : [
                                ...(cat.history || []),
                                {
                                    Month: month,
                                    budget: 0,
                                    setdate,
                                    updatedAt: setdate,
                                },
                            ],
                    };
                }),
            };
        });



        // 2️⃣ Dispatch once
        dispatch(
            updateBudgetcategory({
                ...budgetcategorydata,
                records: updatedRecords,
            })
        );


        setIsreset(false)



        // 3️⃣ Call APIs (clean way)
        try {
            await Promise.all(
                includeassignid.map(value => {
                    const send = {
                        budget: 0,
                        month,
                        setdate,
                        customer_id: storedata.id,
                    };



                    return api.post(
                        `dashboard/setbudget/${value}`,
                        send
                    );
                })
            );

            CommonFunction.message('Budget updated successfully');
        } catch (err) {
            console.log(err?.response?.data);
        }
    }




    const onValueChange = useCallback(
        (event, newDate) => {
            if (event === "dateSetAction") {
                setDate(newDate);
            }
            setshowPicker(false);
        },
        []
    );


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    // header (unchanged)

    const fututeDate = () => {
        // const nextMonth = moment(new Date()).add(1, 'month');
        return new Date()
    }
    const handleInputChange = (name, value) => {
        setRecord({ ...record, [name]: value });
    }

    const navigatetransaction = () => {

        if (0 < getnameaccountdata?.length) {
            navigation.navigate('Transactionform', { data: data, screen: 'budget' })
        } else {
            AsyncStorage.setItem('screenname', 'Budget')

            navigation.navigate('AddmanualAccount')
        }
    }


    const navigateAccount = () => {
        AsyncStorage.setItem('screennamebudget', 'Budget')

        navigation.replace('Account')
    }


    // const openbottomSheet = useCallback=(() => {
    //     setIsMenu(false)
    //     reset({
    //         category: ''
    //     })
    //     setRecord('')
    //     const data = {
    //         customer_id: storedata.id,
    //         plan_id: budgetcategorydata?.plans?.id,
    //         type: 'group'
    //     }

    //     setRecord(data)

    //     // disableMenu()
    //     addgrouprefRBSheet.current.open()
    // },[])

    const openbottomSheet = useCallback(async () => {
        setIsMenu(false)

        reset({
            category: ''
        });

        const data = {
            customer_id: storedata.id,
            plan_id: budgetcategorydata?.plans?.id,
            type: 'group',
            platform: CommonFunction.getOS(),
            device_name: await CommonFunction.getdevicename(),
            ipaddress: await CommonFunction.getipaddress()
        };

        setRecord(data);

        addgrouprefRBSheet.current?.open();
    }, [storedata.id, budgetcategorydata?.plans?.id]);

    const openMenu = () => setIsMenu(true);
    const closeMenu = () => setIsMenu(false);


    const header = () => (
        <View style={{ position: 'static', marginBottom: 10 }}>
            {/* <View style={[styles.headerWrapper, { backgroundColor: themeColors.backgroundcolor }]}>
                <Text style={[styles.titleText, { color: themeColors?.text_primary }]}>Budget</Text>
            </View> */}
            <CommonHead title={'Budget'} screen={'Budget'} back={'no'} navigation={navigation} />

            <View style={[styles.bannerContainer, { backgroundColor: themeColors.cardbg }]}>
                <View style={{ flex: 0.7 }}>
                    <Pressable
                        android_ripple={rippleConfig}
                        style={({ pressed }) => [styles.dateBox, { backgroundColor: themeColors?.bgbtn }, pressed && { opacity: 0.6 }]}
                        onPress={() => { setshowPicker(true) }}
                    >
                        <CommonIcon family="FontAwesome5" name="calendar-alt" size={20} color={themeColors.btn_text_color} />
                        <Text style={[styles.dateText, { color: themeColors.btn_text_color }]}>{formatDate(date)}</Text>

                        <View style={{ justifyContent: 'center', marginStart: 10, bottom: 5 }}>
                            <FontAwesome name="sort-down" size={geticonSize} color={themeColors?.btn_text_color} />
                        </View>
                    </Pressable>
                </View>


                <View style={styles.headerRight}>

                    <Menu
                        visible={isMenu}
                        onDismiss={closeMenu}
                        contentStyle={{
                            backgroundColor: themeColors?.cardbg,
                            borderRadius: 5,
                            marginTop: 40,
                            marginRight: 30

                        }}
                        anchor={
                            <Pressable
                                onPress={openMenu}
                                android_ripple={rippleConfig}
                                style={({ pressed }) => [
                                    styles.iconActionButton,
                                    pressed && { opacity: 0.6 },
                                ]}
                            >
                                <CommonIcon family={'Feather'} name={'more-vertical'} />
                            </Pressable>
                        }
                    >

                        <Menu.Item
                            onPress={() => {
                                openbottomSheet()
                            }}
                            title="Create Group"
                            style={{
                                // borderBottomWidth: 1,
                                borderBottomColor: '#E3E3E3',
                            }}
                            contentStyle={{

                                justifyContent: 'center',
                            }}
                            leadingIcon={() => (
                                <IconButton
                                    onPress={() => navigatetransaction()}
                                    family="Entypo"
                                    name="plus"
                                    size={18}
                                    themeColors={themeColors}
                                    style={'change'}
                                />
                            )}
                            titleStyle={{
                                fontSize: getFontSize(12),
                                fontFamily: fontsFamily.semiboldFont,
                                color: themeColors?.card_text_color,
                                justifyContent: 'center', marginStart: 10
                            }}
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu()
                                navigatetransaction()
                            }}
                            title="Add Transaction"
                            style={{
                                // borderBottomWidth: 1,
                                borderBottomColor: '#E3E3E3',
                            }}
                            contentStyle={{

                                justifyContent: 'center',
                            }}
                            leadingIcon={() => (
                                <IconButton
                                    onPress={() => navigatetransaction()}
                                    family="Entypo"
                                    name="plus"
                                    size={18}
                                    themeColors={themeColors}
                                    style={'change'}
                                />
                            )}
                            titleStyle={{
                                fontSize: getFontSize(12),
                                fontFamily: fontsFamily.semiboldFont,
                                color: themeColors?.card_text_color,
                                justifyContent: 'center', marginStart: 10
                            }}
                        />

                        <Menu.Item
                            onPress={() => {
                                closeMenu()
                                navigateAccount()
                            }}
                            title="Bank Accounts Summary"
                            style={{
                                // borderBottomWidth: 1,
                                borderBottomColor: '#E3E3E3',
                            }}
                            contentStyle={{

                                justifyContent: 'center',
                            }}
                            leadingIcon={() => (
                                <IconButton
                                    onPress={() => navigatetransaction()}
                                    family="FontAwesome"
                                    name="bank"
                                    size={18}
                                    themeColors={themeColors}
                                    style={'change'}
                                />
                            )}
                            titleStyle={{
                                fontSize: getFontSize(12),
                                fontFamily: fontsFamily.semiboldFont,
                                color: themeColors?.card_text_color,
                                justifyContent: 'center', marginStart: 10
                            }}
                        />

                        {/* <Menu.Item
                            onPress={() => {
                                setIsreset(true)
                            }}

                            contentStyle={{
                                justifyContent: 'center',
                            }}
                            style={{
                                borderBottomWidth: 0,
                                borderBottomColor: '#E3E3E3',
                            }}
                            title="Reset Assigned"
                            leadingIcon={() => (
                                <IconButton
                                    onPress={() => setIsreset(true)}
                                    family="Ionicons"
                                    name="refresh-outline"
                                    size={18}
                                    themeColors={themeColors}
                                    style={'change'}
                                />
                            )}
                            titleStyle={{
                                fontSize: getFontSize(12),
                                fontFamily: fontsFamily.semiboldFont,
                                color: themeColors?.card_text_color,
                                justifyContent: 'center',
                                marginStart: 10,

                            }}
                        /> */}

                    </Menu>
                </View>
            </View>



        </View>
    );




    // const getAvailableBalance = (categorydata) => {
    //     if (categorydata)
    //         var spendCategoryAmount = 0
    //     var budgetCategoryAmount = 0
    //     var totalAvilabeamount = 0
    //     var avilablebalnce = 0
    //     const screenDate = new Date(CommonFunction.getDate(date).end);
    //     records.map((obj) => {
    //         var tarnsactiondatae = new Date(obj.transacted_at)
    //         if (obj.category_id === categorydata.category_id && obj.type === 'DEBIT' && tarnsactiondatae <= screenDate) {
    //             spendCategoryAmount += Number(obj.amount) || 0;

    //         }
    //     })


    //     categorydata.history.forEach((val) => {
    //         var budgetsetdate = new Date(val.setdate)
    //         if (budgetsetdate <= screenDate) {
    //             budgetCategoryAmount += Number(val.budget) || 0;
    //         }
    //     });

    //     totalAvilabeamount = budgetCategoryAmount - spendCategoryAmount

    //     if (0 < totalAvilabeamount) {
    //         avilablebalnce = totalAvilabeamount
    //     }


    //     console.log(categorydata.category, avilablebalnce, budgetCategoryAmount, spendCategoryAmount)


    // };





    // const getPreviousMonthBalance = (categorydata) => {
    //     if (!categorydata) return 0;




    //     const prevMonth = moment(date).subtract(1, 'month');
    //     const prevStart = prevMonth.startOf('month').toDate();
    //     const prevEnd = prevMonth.endOf('month').toDate();

    //     let prevSpend = 0;
    //     let prevBudget = 0;

    //     // Spend ONLY in previous month
    //     records.forEach((obj) => {
    //         const d = new Date(obj.transacted_at);
    //         if (
    //             obj.category_id === categorydata.category_id &&
    //             obj.type === 'DEBIT' &&
    //             d >= prevStart &&
    //             d <= prevEnd
    //         ) {
    //             prevSpend += Number(obj.amount) || 0;
    //         }
    //     });

    //     // Budget ONLY in previous month
    //     categorydata.history.forEach((val) => {
    //         const d = new Date(val.setdate);
    //         if (d >= prevStart && d <= prevEnd) {
    //             prevBudget += Number(val.budget) || 0;
    //         }
    //     });

    //     return prevBudget - prevSpend;
    // };



    // const getAvailableBalance = (categorydata) => {
    //     if (!categorydata) return 0;

    //     const currEnd = moment(date).endOf('month').toDate();

    //     let totalSpend = 0;
    //     let totalBudget = 0;

    //     // ✅ Total spend up to selected month
    //     records.forEach((obj) => {
    //         const d = new Date(obj.transacted_at);
    //         if (
    //             obj.category_id === categorydata.category_id &&
    //             obj.type === 'DEBIT' &&
    //             d <= currEnd
    //         ) {
    //             totalSpend += Number(obj.amount) || 0;
    //         }
    //     });

    //     // ✅ Total budget up to selected month
    //     categorydata.history.forEach((val) => {
    //         const d = new Date(val.setdate);
    //         if (d <= currEnd) {
    //             totalBudget += Number(val.budget) || 0;
    //         }
    //     });

    //     return totalBudget - totalSpend;
    // };


    const spendByCategoryMonth = useMemo(() => {
        const map = {};

        for (const txn of records || []) {
            const isDebit =
                String(txn.type || "").toUpperCase() === "DEBIT";

            if (!isDebit) continue;

            const month = moment(txn.transacted_at).format("YYYY-MM");
            const catId = String(txn.category_id);

            if (!map[catId]) map[catId] = {};
            map[catId][month] =
                (map[catId][month] || 0) + Number(txn.amount || 0);
        }

        return map;
    }, [records]);
    function calculateCategoryBalances(history = [], spendMap = {}) {
        const timeline = buildTimelineMonths(history, spendMap);
        const historyMap = mapHistoryByMonth(history);

        let carryForward = 0;
        let lastBudget = 0; // :point_left: Track latest budget

        return timeline.map(month => {
            const hasHistory = Object.prototype.hasOwnProperty.call(historyMap, month);
            const hasSpend = Object.prototype.hasOwnProperty.call(spendMap, month);

            // :point_down: If budget explicitly set this month → update lastBudget
            if (hasHistory) {
                lastBudget = Number(historyMap[month]?.budget || 0);
            }

            const budget = lastBudget;
            const spend = Number(spendMap[month] || 0);

            let balance;

            /*  if (!hasHistory && !hasSpend) {
                 // pure carryforward month
                 balance = carryForward;
             } else {
                 balance = carryForward + budget - spend;
             } */

            balance = budget - spend;;

            return {
                Month: month,
                budget,
                spend,
                balance,
                available: balance
            };
        });
    }




    const categoryBalances = useMemo(() => {
        const result = {};

        budgetcategorydata?.records?.forEach(group => {
            group.categories?.forEach(cat => {
                const catId = String(cat.category_id);

                result[catId] = calculateCategoryBalances(
                    cat.history || [],
                    spendByCategoryMonth[catId] || {}
                );
            });
        });

        return result;
    }, [budgetcategorydata, spendByCategoryMonth]);


    function buildTimelineMonths(history = [], spendMap = {}) {
        if (!history.length) return [];

        const months = new Set();
        Object.keys(spendMap).forEach(m => months.add(m));

        // Extract months
        const historyMonths = history
            .map(h => h?.Month)
            .filter(Boolean)
            .sort();

        const firstMonth = historyMonths[0];
        const lastHistoryMonth = historyMonths[historyMonths.length - 1];

        const [startYear, startMonth] = firstMonth.split("-").map(Number);

        // Current month
        const now = new Date();
        let endYear = now.getFullYear();
        let endMonth = now.getMonth() + 2; // current + next

        if (endMonth === 13) {
            endMonth = 1;
            endYear++;
        }

        let y = startYear;
        let m = startMonth;

        while (
            y < endYear ||
            (y === endYear && m <= endMonth)
        ) {
            months.add(`${y}-${String(m).padStart(2, "0")}`);

            m++;
            if (m === 13) {
                m = 1;
                y++;
            }
        }
        return Array.from(months).sort();
    }
    function mapHistoryByMonth(history = []) {
        const map = {};
        history.forEach(h => {
            if (h?.Month) map[h.Month] = h;
        });
        return map;
    }


    const ensureInputVisible = (flatIndex) => {

        const ref = cardRefs.current[flatIndex];
        if (!ref) return;

        ref.measure(scrollRef.current, (x, y, width, height) => {
            const VIEWPORT_HEIGHT = 100;
            const THRESHOLD = 8;

            const top = y;
            const bottom = y + height;

            const visibleTop = scroll1Y.current;
            const visibleBottom = scroll1Y.current

            // only scroll if visibility actually changes
            if (bottom > visibleBottom) {
                scrollRef.current.scrollTo({
                    y: bottom - VIEWPORT_HEIGHT + 12,
                    animated: false,
                });
                return;
            }

            if (top < visibleTop) {
                scrollRef.current.scrollTo({
                    y: Math.max(top - 12, 0),
                    animated: false,
                });
            }
        });
    };








    const moveUncategoryservice = async (type, operation) => {
        console.log(type, operation)

        setopenmovemodel(false)
        if (type && operation) {
            setIsbtnload(true)
            const payload = {
                operation: operation,
                customer_id: storedata?.id,
                platform: CommonFunction.getOS(),
                device_name: await CommonFunction.getdevicename(),
                ipaddress: await CommonFunction.getipaddress()
            }

            setType('')


            api.post(`dashboard/deletemovebudget/${record.id}/${type}`, payload).then((res) => {
                setRecord('')
                reset({ category: '' })
                dispatch(fetchBudgetcategory())
                dispatch(fetchCategory())
                if (type === 'category' && operation === 'Delete') {

                    dispatch(resetBill())
                    dispatch(fetchBills())
                }

                setIsbtnload(false)
                CommonFunction.message(res.data.message)
                dispatch(resetStatement())

            }).catch((err) => {
                setIsbtnload(false)
                CommonFunction.message(err.response.data.message)
                console.log(err.response.data)
            })
        }

    }


    const openCustomSheet = async (value) => {
        // disableMenu()
        setType('category')
        addcatrefRBSheet.current.open();
        const data = {
            group_id: value.group_id,
            plan_id: value.plan_id,
            type: 'category',
            customer_id: storedata.id,
            group_name: value?.category,
            platform: CommonFunction.getOS(),
            device_name: await CommonFunction.getdevicename(),
            ipaddress: await CommonFunction.getipaddress()

        }
        setRecord(data)
        // opencateforyRFSheetModel.current.open();
    }

    async function categoryApiservice(params) {
        setIsbtnload(true)
        enableMenu()
        if (type === 'categoryedit') {

            const data = {
                ...budgetcategorydata, records: categoryData.map((group) =>
                    group.group_id === record.group_id
                        ? {
                            ...group,
                            categories: group.categories?.map((cat) =>
                                cat.id === record.id
                                    ? { ...cat, category: record.category }
                                    : cat
                            ),
                        }
                        : group
                )
            }
            setCatgorydata(data?.records)
            dispatch(updateBudgetcategory(data))
            editcatrefRBSheet.current.close()


            api.post(`dashboard/updatebudgetgroupcate/${record?.id}`, record).then((res) => {
                setIsbtnload(false)
                CommonFunction.message(res.data.message)
                setType('')
                setRecord('')
                reset({ category: '' })
                dispatch(fetchCategory())
            }).catch((err) => {
                setIsbtnload(false)
                GoalrefRBSheet.current.close()
                console.log(err)
            })
        } else {



            api.post('dashboard/createbudgetgroupcate', record).then((res) => {
                addcatrefRBSheet.current.close()
                const mergedata = {
                    id: res.data.id,
                    category: record.category,
                    history: [
                        {
                            Month: apiformatDate(new Date()),
                            budget: 0,
                            setdate: new Date(),
                            updatedAt: new Date()
                        }
                    ],
                    entry_type: 'Manual'
                }
                const data = {
                    ...budgetcategorydata, records: categoryData.map((item) =>
                        item.group_id === record?.group_id
                            ? {
                                ...item,
                                categories: [...item.categories, mergedata],
                            }
                            : item
                    )
                }


                setRecord('')
                reset({ category: '' })
                setIsbtnload(false)
                setCatgorydata(data?.records)
                setType('')
                dispatch(updateBudgetcategory(data))
                dispatch(fetchCategory())
                dispatch(fetchBudgetcategory())
                CommonFunction.message(res.data.message)
            }).catch((err) => {
                setIsbtnload(false)
                GoalrefRBSheet.current.close()
                console.log(err.response.data)
            })
        }

    }
    const opengroupSheet = useCallback(async (value) => {
        setType('group');
        const data = {
            ...value,
            platform: CommonFunction.getOS(),
            device_name: await CommonFunction.getdevicename(),
            ipaddress: await CommonFunction.getipaddress()
        }
        setRecord(data);
        editgrouprefRBSheet.current?.open();
    }, []);

    const groupApiservice = () => {
        setIsbtnload(true)
        enableMenu()
        if (record?.group_id) {
            const updated = categoryData.map((item) =>
                item.id === record?.id
                    ? {
                        ...item,
                        category: record.category,
                    }
                    : item
            );
            setCatgorydata(updated)

            dispatch(updateBudgetcategory({ records: updated }))
            editgrouprefRBSheet.current.close()
            console.log(record)
            api.post(`dashboard/updatebudgetgroupcate/${record?.id}`, record).then((res) => {
                setIsbtnload(false)
                setRecord('')
                reset({ category: '' })
                setType('')
                CommonFunction.message(res.data.message)
            }).catch((err) => {
                setIsbtnload(false)
                console.log(err)
            })
        }

    }

    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                    <CommonHead title={'Budget'} screen={'Budget'} back={'no'} navigation={navigation} />
                    <View style={{ marginStart: 10, marginEnd: 10, }}>

                        <SkeletonPlaceholder

                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >
                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={60}
                                marginTop={10}
                                borderRadius={3}
                            />
                            <View style={{ marginTop: 10 }}>
                                <SkeletonPlaceholder.Item
                                    width={width * 0.95}
                                    height={60}
                                    marginTop={10}
                                    borderRadius={3}
                                />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <SkeletonPlaceholder.Item
                                    width={width * 0.95}
                                    height={60}
                                    marginTop={10}
                                    borderRadius={3}
                                />
                            </View>

                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}

                                >
                                    <SkeletonPlaceholder.Item
                                        width={width * 0.95}
                                        height={130}
                                        marginTop={20}
                                        borderRadius={3}
                                    />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };



    if (budgetcategoryloading || categoryloading || stloading) {
        return (
            <GradientBackground>
                <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

                <View style={themeColors?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>
                    <CardSkeleton />
                </View>
            </GradientBackground>

        )
    }







    return (


        <GradientBackground>
            <StatusBar backgroundColor={themeColors.statusbar} translucent={Platform.OS === 'android' ? false : true} barStyle={themeColors?.themelogo === 'Light' ? 'light-content' : 'dark-content'} />

            <View style={themeColors?.gradient === 'No' ? appstyle.primaryBackground : { flex: 1 }}>



                <KeyboardAvoidingView
                    style={appstyle.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={appstyle.container}>

                        {header()}

                        {

                            <View style={{ position: 'absolute', bottom: 40, zIndex: 1, end: 20, }}>
                                <TouchableOpacity style={[appstyle.dashbaordBalIconbg, {
                                    backgroundColor: themeColors?.bgbtn, width: 45,
                                    height: 45, borderRadius: 10
                                }]} onPress={() => {

                                    navigatetransaction()
                                }}>

                                    <CommonIcon name={'add-outline'} family={'Ionicons'} color={themeColors?.btn_text_color} />
                                </TouchableOpacity>
                            </View>

                            // <AnimatedFAB scrollY={scrollY} onPressTransaction={() => navigatetransaction()} />
                        }







                        <Animated.ScrollView
                            scrollEventThrottle={16}
                            onScroll={scrollHandler}
                            ref={scrollRef}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={["#2C3E50", "#00BCD4", "#FFC107"]}
                                />
                            }
                            contentContainerStyle={{
                                paddingTop: 10,
                                paddingBottom: insets.bottom + 30,
                            }}
                        >



                            <View style={{ marginStart: 10, marginEnd: 10 }}>


                                {
                                    0 < categoryData?.length &&
                                    categoryData.map((value, key) => {


                                        const groupTotals = (value.categories || []).reduce(
                                            (acc, cat) => {

                                                const catKey = String(cat?.category_id);
                                                const history = categoryBalances[catKey] || [];
                                                const current = cat.history.find(h => h.Month === apiformatDate(date)) || {
                                                    budget: 0,
                                                };
                                                const cathis = history.find(h => h.Month === apiformatDate(date)) || {
                                                    spend: 0,
                                                    available: 0
                                                };
                                                const { budget } = current;
                                                const { spend } = cathis


                                                // const avg = budget > 0 ? (spend * 100) / budget : 0;
                                                acc.budget += budget;
                                                // acc.balance += available;
                                                acc.spend += Number(spend || 0);

                                                return acc;
                                            },
                                            { budget: 0, spend: 0, balance: 0 }
                                        );

                                        const available1 = groupTotals?.balance;
                                        const totalssigned = groupTotals?.budget
                                        const totalSpend = groupTotals?.spend
                                        const available = totalssigned - totalSpend;



                                        return (
                                            <View key={key}>
                                                <SectionHeader
                                                    totalassined={totalssigned}
                                                    totalspend={totalSpend}
                                                    section={value}
                                                    available={available}
                                                    isOpen={openStates.includes(value) ? true : false}
                                                    editOnpress={() => opengroupSheet(value)}
                                                    onToggle={() => toggleSection(value)}
                                                    addCat={() => openCustomSheet(value)}
                                                    themeColors={themeColors}
                                                />


                                                {
                                                    !openStates.includes(value) && 0 < value?.categories?.length &&
                                                    <View>
                                                        <View style={[styles.sectionHeader, { backgroundColor: themeColors?.cardbg, marginStart: 5, marginEnd: 5 }]}>
                                                            <View style={{ flex: 1 }}>
                                                                <View style={{ start: 10 }}>
                                                                    <Text style={[styles.availText, { marginBottom: 5, color: themeColors?.card_text_color }]}>Budget</Text>
                                                                    <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{storedata?.currency}{CommonFunction.formatamount(totalssigned)}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flex: 1, alignItems: 'center' }}>
                                                                <Text style={[styles.availText, { marginBottom: 5, color: themeColors?.card_text_color }]}>Spent</Text>
                                                                <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{storedata?.currency}{CommonFunction.formatamount(totalSpend)}</Text>
                                                            </View>
                                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                                <View style={{ end: 10 }}>
                                                                    <Text style={[styles.availText, { marginBottom: 5, color: themeColors?.card_text_color }]}>Available</Text>
                                                                    <Text style={[styles.availText, { fontWeight: 'bold', color: themeColors?.card_text_color, fontSize: getFontSize(13) }]}>{available < 0 ? '-' : ''} {storedata?.currency}{CommonFunction.formatamount(Math.abs(available))}</Text>
                                                                </View>
                                                            </View>



                                                        </View>
                                                        {
                                                            value.categories.map((subvalue, subkey) => {
                                                                const flatIndex = flatIndexRef.current++;

                                                                const iconview = icons.find(
                                                                    (obj) => obj.name === subvalue.category
                                                                );

                                                                const historyMonth = subvalue.history.find(
                                                                    (obj) => obj.Month === apiformatDate(date)
                                                                );



                                                                const amount = historyMonth?.budget ?? 0;
                                                                const displayValue =
                                                                    subvalue.id === activeIndex?.id && keyNumber !== ''
                                                                        ? keyNumber
                                                                        : amount;

                                                                const spentamt = statementByCategory[subvalue?.category_id] ? statementByCategory[subvalue?.category_id] : 0
                                                                var spentamount = spentamt?.spend ? spentamt?.spend : 0
                                                                const avilabeamt = historyMonth?.balance ? historyMonth.balance : 0
                                                                // const avg = getAvailableBalance(subvalue)

                                                                const catKey = String(subvalue?.category_id);
                                                                // const stat = statementByCategory[catKey] || { spend: 0, count: 0 };
                                                                const history = categoryBalances[catKey] || [];


                                                                const current = history.find(h => h.Month === apiformatDate(date)) || {
                                                                    budget: 0,
                                                                    spend: 0,
                                                                    available: 0
                                                                };

                                                                const { budget, spend, available } = current;
                                                                const avbBalance = Number(displayValue ? displayValue : 0) - Number(spentamt?.spend ? spentamt?.spend : 0)


                                                                return (
                                                                    <View key={subvalue.id} >
                                                                        <BudgetCard
                                                                            item={subvalue}
                                                                            // value={activeIndex?.id === subvalue.id ? Number(keyNumber) : parseFloat(displayValue).toFixed(2)}
                                                                            value={activeIndex?.id === subvalue.id ? keyNumber : displayValue}
                                                                            spent={spentamt?.spend ? spentamt?.spend : 0}
                                                                            edit={subvalue?.entry_type ? false : true}
                                                                            ref={ref => (cardRefs.current[subvalue.id] = ref)}
                                                                            activeid={activeIndex?.id}
                                                                            avilabeamt={avbBalance}
                                                                            themeColors={themeColors}
                                                                            iconview={iconview}
                                                                            onLablepress={async () => {
                                                                                setType('categoryedit')
                                                                                // const data = {
                                                                                //     ...subvalue,
                                                                                //     group_id: value.group_id,
                                                                                //     group_name: value?.category
                                                                                // }
                                                                                console.log('1222')
                                                                                const data = {
                                                                                    category: subvalue?.category,
                                                                                    category_id: subvalue?.category_id,
                                                                                    id: subvalue?.category_id,
                                                                                    customer_id: storedata?.id,
                                                                                    plan_id: value.plan_id,
                                                                                    group_id: value.group_id,
                                                                                    group_name: value?.category,
                                                                                    type: 'category',
                                                                                    platform: CommonFunction.getOS(),
                                                                                    device_name: await CommonFunction.getdevicename(),
                                                                                    ipaddress: await CommonFunction.getipaddress()

                                                                                }
                                                                                setRecord(data);
                                                                                editcatrefRBSheet.current.open();
                                                                                // disableMenu()
                                                                            }}
                                                                            onPress={() => {
                                                                                var spentamount = spentamt?.spend ? spentamt?.spend : 0
                                                                                const availabel = Number(displayValue) - Number(spentamount)
                                                                                const data = {
                                                                                    ...subvalue,
                                                                                    group_id: value.group_id, date: date, budget: displayValue, group_name: value?.category
                                                                                }
                                                                                setSelectedCategoryForBudget(data)
                                                                                setShowSetBudgetModal(true)
                                                                                setDetails(data)
                                                                                budgetSheetref?.current?.open()
                                                                                // navigation.navigate('TargetBudget', { details: data })
                                                                                // console.log(subvalue, value, subvalue.id, iconview, availabel, spentamount, displayValue)
                                                                            }}
                                                                            progress={0}
                                                                        />
                                                                    </View>
                                                                )
                                                            })
                                                        }

                                                    </View>
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>


                        </Animated.ScrollView>




                        <RBSheet
                            ref={addgrouprefRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            useNativeDriver={true}
                            height={250}
                            customStyles={{
                                container: {
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 20,
                                    backgroundColor: themeColors?.cardbg,

                                },
                                draggableIcon: {
                                    backgroundColor: '#ccc',

                                },
                            }}
                        >



                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: getFontSize(16), fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                        Create Group
                                    </Text>
                                    <Pressable

                                        onPress={() => {
                                            reset({ category: '' })
                                            enableMenu()
                                            addgrouprefRBSheet.current.close()
                                        }}
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


                                    <View style={{ marginTop: 10, flex: 1 }}>

                                        <View style={{}}>
                                            <TextInput
                                                onChangeText={(val) => handleInputChange('category', val)}
                                                value={record?.category}
                                                style={{ height: 45, backgroundColor: themeColors?.inputprimary, borderColor: themeColors.dashboardBannerbgColor, borderRadius: 5, paddingHorizontal: 10, color: themeColors?.inputsecondary }}
                                                selectionColor={appstyle.selectColor}
                                                placeholderTextColor={'grey'}
                                                placeholder="Group Name"
                                                {...register("category", {
                                                    required: content.fieldrequire,
                                                    validate: {
                                                        noLongSpaces: (value) =>
                                                            !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",

                                                        noSpecialChars: (value) =>
                                                            /^[a-zA-Z0-9 ]*$/.test(value) || "Invalid Name",

                                                        minTwoChars: (value) =>
                                                            value.trim().length >= 2 || "Invalid Name",

                                                        noDuplicate: (value) => {
                                                            const isDuplicate = categoryData?.find(
                                                                (item) =>
                                                                    item?.category.trim()?.toLowerCase() === value.trim().toLowerCase()
                                                            );
                                                            return !isDuplicate || 'Group name already in use';
                                                        },
                                                    }
                                                })}

                                            />

                                        </View>

                                        {errors.category && <Text style={appstyle.errortext}>{errors.category.message}</Text>}
                                    </View>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Pressable
                                        disabled={btnLoad}
                                        android_ripple={{ color: "#ffffff30" }}
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: themeColors?.bgbtn,
                                                paddingHorizontal: 30,
                                                paddingVertical: 15,
                                                borderRadius: 5,
                                                transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                                opacity: pressed ? 0.8 : 1,
                                                bottom: 10
                                            },
                                        ]}
                                        onPress={handleSubmit(createGroup)}>
                                        {
                                            btnLoad ?
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text
                                                        style={{
                                                            color: themeColors?.btn_text_color,
                                                            fontFamily: fontsFamily.semiboldFont
                                                        }}
                                                    >
                                                        Loading
                                                    </Text>
                                                    <View style={{ marginStart: 5 }}>
                                                        <LoaderKit
                                                            style={{ height: 20, width: 20, }}
                                                            name={'BallPulse'}
                                                            color={themeColors.btn_text_color}
                                                        />
                                                    </View>
                                                </View>
                                                :
                                                <Text
                                                    style={{
                                                        color: themeColors?.btn_text_color,
                                                        fontFamily: fontsFamily.semiboldFont
                                                    }}
                                                >
                                                    Save Group
                                                </Text>
                                        }

                                    </Pressable>
                                </View>


                            </View>

                        </RBSheet>

                        <RBSheet
                            ref={editgrouprefRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            useNativeDriver={true}
                            height={250}
                            customStyles={{
                                container: {
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 20,
                                    backgroundColor: themeColors?.cardbg,

                                },
                                draggableIcon: {
                                    backgroundColor: '#ccc',

                                },
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                        Edit Group
                                    </Text>
                                    <Pressable

                                        onPress={() => { editgrouprefRBSheet.current.close(), setType(''), setRecord(''), setflag(1), enableMenu(), reset({ category: '' }) }}
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

                                    <View style={{ marginTop: 10, flex: 1 }}>

                                        <View >
                                            <TextInput
                                                onChangeText={(val) => handleInputChange('category', val)}
                                                value={record.category}
                                                style={{ height: 45, backgroundColor: themeColors?.inputprimary, borderColor: themeColors.dashboardBannerbgColor, borderRadius: 5, paddingHorizontal: 10, color: themeColors?.inputsecondary }}
                                                selectionColor={appstyle.selectColor}
                                                placeholderTextColor={'grey'}
                                                placeholder="Group"
                                                {...register("category", {
                                                    required: content.fieldrequire,
                                                    validate: {
                                                        noLongSpaces: (value) =>
                                                            !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",

                                                        noSpecialChars: (value) =>
                                                            /^[a-zA-Z0-9 ]*$/.test(value) || "Invalid Name",

                                                        minTwoChars: (value) =>
                                                            value.trim().length >= 2 || "Invalid Name",


                                                    },
                                                })}

                                            />

                                        </View>

                                        {errors.category && <Text style={appstyle.errortext}>{errors.category.message}</Text>}
                                    </View>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Pressable
                                            disabled={btnLoad}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: themeColors.bgbtn,
                                                padding: 13,
                                                borderRadius: 8,
                                                alignItems: "center",
                                                flex: 1, marginEnd: 10
                                            }}
                                            onPress={() => {
                                                editgrouprefRBSheet.current.close()
                                                setTimeout(() => {

                                                    setopenmovemodel(true)

                                                }, 300);


                                            }
                                            }
                                        >
                                            <Text
                                                style={[

                                                    { fontSize: getFontSize(16), color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont },
                                                ]}
                                            >
                                                Delete
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            disabled={btnLoad}
                                            onPress={handleSubmit(groupApiservice)}
                                            android_ripple={{ color: "#ffffff30" }}
                                            style={({ pressed }) => [
                                                {
                                                    backgroundColor: themeColors.bgbtn,
                                                    padding: 13,
                                                    borderRadius: 8,
                                                    alignItems: "center",
                                                    flex: 1,
                                                    marginStart: 10
                                                },
                                            ]}
                                        >
                                            {
                                                btnLoad ?
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text
                                                            style={{
                                                                color: themeColors?.btn_text_color,
                                                                fontFamily: fontsFamily.semiboldFont
                                                            }}
                                                        >
                                                            Loading
                                                        </Text>
                                                        <View style={{ marginStart: 5 }}>
                                                            <LoaderKit
                                                                style={{ height: 20, width: 20, }}
                                                                name={'BallPulse'}
                                                                color={themeColors.btn_text_color}
                                                            />
                                                        </View>
                                                    </View> :
                                                    <Text
                                                        style={{
                                                            color: themeColors?.btn_text_color,
                                                            fontFamily: fontsFamily.semiboldFont,
                                                            fontSize: getFontSize(14)
                                                        }}
                                                    >
                                                        Update
                                                    </Text>
                                            }

                                        </Pressable>
                                    </View>
                                </View>


                            </View>
                        </RBSheet>

                        <RBSheet
                            ref={editcatrefRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            useNativeDriver={true}
                            height={250}
                            customStyles={{
                                container: {
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 20,
                                    backgroundColor: themeColors?.cardbg,

                                },
                                draggableIcon: {
                                    backgroundColor: '#ccc',

                                },
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 18, marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                            Edit Category for <Text style={{ fontWeight: 'bold' }}>{record?.group_name}</Text>
                                        </Text>
                                    </View>
                                    <Pressable

                                        onPress={() => { editcatrefRBSheet.current.close(), setType(''), enableMenu(), reset({ category: '' }) }}
                                        style={{ backgroundColor: themeColors?.iconbg, height: 25, width: 25, borderRadius: 25 }}>
                                        <CommonIcon
                                            name={'clear'}
                                            family={'MaterialIcons'}
                                            color={themeColors?.iconcolor}
                                        />
                                    </Pressable>

                                </View>
                                <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />


                                <View style={{ flex: 1 }}>

                                    <View style={{ marginTop: 10, flex: 1 }}>

                                        <View >
                                            <TextInput
                                                onChangeText={(val) => handleInputChange('category', val)}
                                                value={record.category}
                                                style={{ height: 45, backgroundColor: themeColors?.inputprimary, borderColor: themeColors.dashboardBannerbgColor, borderRadius: 5, paddingHorizontal: 10, color: themeColors?.inputsecondary }}
                                                selectionColor={appstyle.selectColor}
                                                placeholderTextColor={'grey'}
                                                placeholder="Category"
                                                {...register("category", {
                                                    required: content.fieldrequire,
                                                    validate: {
                                                        noLongSpaces: (value) =>
                                                            !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                        noSpecialChars: (value) =>
                                                            /^[a-zA-Z0-9 ]*$/.test(value) || "Invalid Name",
                                                        minTwoChars: (value) =>
                                                            value.trim()?.length >= 2 || "Invalid Name",
                                                        ...(type === 'category' && {
                                                            noDuplicate: (value) => {
                                                                const isDuplicate = categorydata?.records.some(
                                                                    rec =>
                                                                        rec.category.toLowerCase() ===
                                                                        value.toLowerCase()
                                                                );

                                                                return !isDuplicate || "Category name already in use";
                                                            }
                                                        })
                                                    },
                                                })}

                                            />

                                        </View>

                                        {errors.category && <Text style={appstyle.errortext}>{errors.category.message}</Text>}
                                    </View>
                                </View>


                                <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row' }}>

                                    <Pressable
                                        disabled={btnLoad}
                                        onPress={() => {

                                            editcatrefRBSheet.current.close()
                                            setTimeout(() => {

                                                setopenmovemodel(true)

                                            }, 300);



                                        }}
                                        style={({ pressed }) => [
                                            {
                                                borderWidth: 1,
                                                borderColor: themeColors.bgbtn,
                                                padding: 13,
                                                borderRadius: 8,
                                                alignItems: "center",
                                                flex: 1, marginEnd: 10
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontSize: getFontSize(16), color: themeColors?.card_text_color, fontFamily: fontsFamily.semiboldFont
                                            }}
                                        >
                                            Delete
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        disabled={btnLoad}
                                        onPress={handleSubmit(categoryApiservice)}
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: themeColors.bgbtn,
                                                padding: 13,
                                                borderRadius: 8,
                                                alignItems: "center",
                                                flex: 1,
                                                marginStart: 10

                                            },
                                        ]}
                                    >
                                        {
                                            btnLoad ?
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text
                                                        style={{
                                                            color: themeColors?.btn_text_color,
                                                            fontFamily: fontsFamily.semiboldFont
                                                        }}
                                                    >
                                                        Loading
                                                    </Text>
                                                    <View style={{ marginStart: 5 }}>
                                                        <LoaderKit
                                                            style={{ height: 20, width: 20, }}
                                                            name={'BallPulse'}
                                                            color={themeColors.btn_text_color}
                                                        />
                                                    </View>
                                                </View> :
                                                <Text
                                                    style={{
                                                        color: themeColors?.btn_text_color,
                                                        fontFamily: fontsFamily.semiboldFont,
                                                        fontSize: getFontSize(14)
                                                    }}
                                                >
                                                    Update
                                                </Text>
                                        }

                                    </Pressable>

                                </View>


                            </View>

                        </RBSheet>

                        <RBSheet
                            ref={addcatrefRBSheet}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            useNativeDriver={true}
                            height={250}
                            customStyles={{
                                container: {
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    padding: 20,
                                    backgroundColor: themeColors?.cardbg,

                                },
                                draggableIcon: {
                                    backgroundColor: '#ccc',

                                },
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 18, marginBottom: 10, color: themeColors?.card_secondary_color }}>
                                            Add Category for <Text style={{ fontWeight: 'bold' }}>{record?.group_name}</Text>
                                        </Text>
                                    </View>
                                    <Pressable

                                        onPress={() => { addcatrefRBSheet.current.close(), setType(''), enableMenu(), reset({ category: '' }) }}
                                        style={{ backgroundColor: themeColors?.iconbg, height: 25, width: 25, borderRadius: 25 }}>
                                        <CommonIcon
                                            name={'clear'}
                                            family={'MaterialIcons'}
                                            color={themeColors?.iconcolor}
                                        />
                                    </Pressable>

                                </View>
                                <Divider style={{ marginVertical: 8, backgroundColor: '#ccc' }} />


                                <View style={{ flex: 1 }}>

                                    <View style={{ marginTop: 10, flex: 1 }}>

                                        <View >
                                            <TextInput
                                                onChangeText={(val) => handleInputChange('category', val)}
                                                value={record.category}
                                                style={{ height: 45, backgroundColor: themeColors?.inputprimary, borderColor: themeColors.dashboardBannerbgColor, borderRadius: 5, paddingHorizontal: 10, color: themeColors?.inputsecondary }}
                                                selectionColor={appstyle.selectColor}
                                                placeholderTextColor={'grey'}
                                                placeholder="Category"
                                                {...register("category", {
                                                    required: content.fieldrequire,
                                                    validate: {
                                                        noLongSpaces: (value) =>
                                                            !/\s{2,}/.test(value) && value.trim() !== "" || "Invalid Name",
                                                        noSpecialChars: (value) =>
                                                            /^[a-zA-Z0-9 ]*$/.test(value) || "Invalid Name",
                                                        minTwoChars: (value) =>
                                                            value.trim()?.length >= 2 || "Invalid Name",
                                                        ...(type === 'category' && {
                                                            noDuplicate: (value) => {
                                                                const isDuplicate = value && categorydata?.records.some(
                                                                    rec =>
                                                                        rec.category.trim().toLowerCase() ===
                                                                        value.trim().toLowerCase()
                                                                );

                                                                return !isDuplicate || "Category name already in use";
                                                            }
                                                        })
                                                    },
                                                })}

                                            />

                                        </View>

                                        {errors.category && <Text style={appstyle.errortext}>{errors.category.message}</Text>}
                                    </View>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 0 }}>
                                    <Pressable
                                        disabled={btnLoad}
                                        onPress={handleSubmit(categoryApiservice)}
                                        style={({ pressed }) => [
                                            {
                                                backgroundColor: themeColors?.bgbtn,
                                                paddingHorizontal: 30,
                                                paddingVertical: 15,
                                                borderRadius: 5,
                                                transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
                                                opacity: pressed ? 0.8 : 1,
                                            },
                                        ]}
                                    >
                                        {
                                            btnLoad ?
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text
                                                        style={{
                                                            color: themeColors?.btn_text_color,
                                                            fontFamily: fontsFamily.semiboldFont
                                                        }}
                                                    >
                                                        Loading
                                                    </Text>
                                                    <View style={{ marginStart: 5 }}>
                                                        <LoaderKit
                                                            style={{ height: 20, width: 20, }}
                                                            name={'BallPulse'}
                                                            color={themeColors.btn_text_color}
                                                        />
                                                    </View>
                                                </View>
                                                :
                                                <Text
                                                    style={{
                                                        color: themeColors.btn_text_color,
                                                        fontFamily: fontsFamily.semiboldFont
                                                    }}
                                                >
                                                    Save Category
                                                </Text>
                                        }

                                    </Pressable>
                                </View>


                            </View>

                        </RBSheet>






                        {
                            type === 'group' ?
                                searchroupTransaction ?
                                    <CustomModal
                                        visible={showopenmovemodel}
                                        onClose={() => { setopenmovemodel(false), setType('') }}
                                        alertTitle="Alert !"
                                        actionText="Move"
                                        cancelText="Delete"
                                        onCancel={() => { moveUncategoryservice('group', 'Delete') }}
                                        onAction={() => { moveUncategoryservice('group', 'Move') }}
                                    >

                                        <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                            This group in the category is used in existing transactions. Would you like to move it to ‘Uncategorized’ or delete it?
                                        </Text>


                                    </CustomModal> :
                                    <CustomModal
                                        visible={showopenmovemodel}
                                        onClose={() => { setopenmovemodel(false), setType('') }}
                                        alertTitle="Alert !"
                                        actionText="Yes"
                                        cancelText="No"
                                        onAction={() => { moveUncategoryservice('group', 'Delete') }}
                                    >
                                        {
                                            <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                                Are you sure you want to delete this group?
                                            </Text>
                                        }

                                    </CustomModal> :
                                type === 'categoryedit' &&
                                    searchcategoryTransaction ? <CustomModal
                                        visible={showopenmovemodel}
                                        onClose={() => { setopenmovemodel(false), setType('') }}
                                        alertTitle="Alert !"
                                        actionText="Move"
                                        cancelText="Delete"
                                        onCancel={() => { moveUncategoryservice('group', 'Delete') }}
                                        onAction={() => { moveUncategoryservice('category', 'Move') }}
                                    >

                                    <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: getFontSize(15), lineHeight: 22, fontFamily: fontsFamily.regularFont }}>
                                        This category is used in existing transactions. Would you like to move it to Uncategorized or delete it?
                                    </Text>


                                </CustomModal> : <CustomModal
                                    visible={showopenmovemodel}
                                    onClose={() => { setopenmovemodel(false), setType('') }}
                                    alertTitle="Alert !"
                                    actionText="Yes"
                                    cancelText="No"
                                    onAction={() => { moveUncategoryservice('category', 'Delete') }}
                                >
                                    {
                                        <Text style={{ color: themeColors?.card_text_color, textAlign: 'center', fontSize: 15 }}>
                                            Are you sure you want to delete this category?
                                        </Text>
                                    }

                                </CustomModal>
                        }







                        {selectedCategoryForBudget && (
                            <SetBudgetModal
                                visible={showSetBudgetModal}
                                onClose={() => {
                                    setShowSetBudgetModal(false);
                                    setSelectedCategoryForBudget(null);
                                }}
                                category={selectedCategoryForBudget}
                                onSave={(obj) => {
                                    assignamount(obj)
                                }}
                                totalBalance={''}
                                formatCurrency={''}
                            />
                        )}




                        <Modal isVisible={isAssign}>
                            <View style={{ padding: 22 }}>
                                <View style={{ marginTop: Platform.OS == 'ios' ? 30 : 0, borderTopWidth: 0, borderBottomWidth: 1, backgroundColor: themeColors?.cardbg, borderRadius: 16, height: height * 0.50, padding: 20 }}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: themeColors?.card_text_color, flexDirection: 'row', paddingBottom: 10 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles.textchg, { fontSize: getFontSize(18), marginTop: 0, color: themeColors?.card_text_color }]}>Assign Category</Text>
                                        </View>
                                        <TouchableOpacity style={{ justifyContent: 'center', bottom: 5 }} onPress={() => setisAssign(false)}>
                                            <AntDesign name="close" size={25} color={themeColors.danger} />
                                        </TouchableOpacity>

                                    </View>
                                    <ScrollView>
                                        {
                                            checkAssign1.map((value, key) => {
                                                return (
                                                    <View style={{ marginTop: 20 }} key={key}>
                                                        <Text style={[styles.textchg, { fontSize: getFontSize(16), marginTop: 0, color: themeColors?.card_text_color, opacity: 0.6 }]}>{value.category}</Text>
                                                        {
                                                            0 < value?.categories?.length &&
                                                            value.categories.map((subvalue, subkey) => {

                                                                const budgetamount = storedata?.currency + '' + CommonFunction.formatamount(subvalue?.history?.targetamt)
                                                                return (
                                                                    <Pressable style={{ marginTop: 10, flexDirection: 'row' }} key={subkey} onPress={() => {

                                                                        assigncheck1(subvalue?.id)
                                                                    }}>
                                                                        <View>
                                                                            <CommonIcon
                                                                                name={underFundid.includes(subvalue?.id) ? 'checkbox' : 'square-outline'}
                                                                                size={20}   // :white_check_mark: full control
                                                                                color={themeColors?.bgbtn}
                                                                                family={'Ionicons'}
                                                                            />
                                                                        </View>
                                                                        <View style={{ flex: 1, marginStart: 10 }}>
                                                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, color: themeColors?.card_text_color }]}>{subvalue?.category}</Text>
                                                                        </View>
                                                                        <View>
                                                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, color: themeColors?.card_text_color }]}>{budgetamount}</Text>
                                                                        </View>
                                                                    </Pressable>
                                                                )

                                                            })
                                                        }
                                                    </View>
                                                )
                                            })
                                        }


                                    </ScrollView>

                                    <Pressable style={{ backgroundColor: themeColors?.bgbtn, padding: 10, borderRadius: 8, alignItems: 'center' }} onPress={() => {
                                        autoAssign()
                                    }}>
                                        <Text style={{ color: themeColors?.btn_text_color, fontFamily: fontsFamily.boldFont }}>Assign Money</Text>
                                    </Pressable>
                                </View>

                            </View>

                        </Modal>

                        <Modal isVisible={isReset}>
                            <View style={{ padding: 22 }}>
                                <View style={{ marginTop: Platform.OS == 'ios' ? 30 : 0, borderTopWidth: 0, borderBottomWidth: 1, backgroundColor: themeColors?.cardbg, borderRadius: 16, height: height * 0.65, padding: 20 }}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: themeColors?.card_text_color, flexDirection: 'row', paddingBottom: 10 }}>
                                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                            <Text style={[styles.textchg, { fontSize: getFontSize(18), marginTop: 0, color: themeColors?.card_text_color }]}>Reset Assign Category</Text>
                                        </View>
                                        <TouchableOpacity style={{ justifyContent: 'center', bottom: 5 }} onPress={() => { setIsreset(false), setIsMenu(false) }}>
                                            <AntDesign name="close" size={25} color={themeColors.danger} />
                                        </TouchableOpacity>

                                    </View>
                                    <ScrollView>


                                        {
                                            checkAssign.map((value, key) => {
                                                return (
                                                    <View style={{ marginTop: 20 }} key={key}>
                                                        <Text style={[styles.textchg, { fontSize: getFontSize(16), marginTop: 0, color: themeColors?.card_text_color, opacity: 0.6 }]}>{value.category}</Text>
                                                        {
                                                            0 < value?.categories?.length &&
                                                            value.categories.map((subvalue, subkey) => {

                                                                const budgetamount = storedata?.currency + '' + CommonFunction.formatamount(subvalue?.history?.budget)
                                                                return (
                                                                    <Pressable style={{ marginTop: 10, flexDirection: 'row' }} key={subkey} onPress={() => {

                                                                        assigncheck(subvalue?.id)
                                                                    }}>
                                                                        <View>
                                                                            <CommonIcon
                                                                                name={includeassignid.includes(subvalue?.id) ? 'checkbox' : 'square-outline'}
                                                                                size={20}   // :white_check_mark: full control
                                                                                color={themeColors?.bgbtn}
                                                                                family={'Ionicons'}
                                                                            />
                                                                        </View>
                                                                        <View style={{ flex: 1, marginStart: 10 }}>
                                                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, color: themeColors?.card_text_color }]}>{subvalue?.category}</Text>
                                                                        </View>
                                                                        <View>
                                                                            <Text style={[styles.textchg, { fontSize: getFontSize(14), marginTop: 0, color: themeColors?.card_text_color }]}>{budgetamount}</Text>
                                                                        </View>
                                                                    </Pressable>
                                                                )

                                                            })
                                                        }
                                                    </View>
                                                )
                                            })
                                        }
                                    </ScrollView>

                                    <Pressable style={{ backgroundColor: themeColors?.bgbtn, padding: 10, borderRadius: 8, alignItems: 'center' }} onPress={() => {
                                        resetAssigncat()
                                    }}>
                                        <Text style={{ color: themeColors?.btn_text_color, fontFamily: fontsFamily.boldFont }}>Reset Assigned</Text>
                                    </Pressable>
                                </View>

                            </View>

                        </Modal>


                    </View>
                </KeyboardAvoidingView>


                {
                    showPicker && (
                        <MonthPicker
                            onChange={onValueChange}
                            value={date}
                            minimumDate={firstTrans ? new Date(firstTrans) : budgetcategorydata?.plans[0]?.createdAt ? new Date(budgetcategorydata?.plans[0]?.createdAt) : new Date()}
                            maximumDate={fututeDate()}
                            locale="en"
                        />
                    )
                }

            </View>

        </GradientBackground>



    );
};

export default Budget;




const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FEF7FF" },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 24,
        zIndex: 999,
        shadowColor: '#3F2B96',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerWrapper: { padding: 10, backgroundColor: "#FEF7FF" },
    titleText: { fontFamily: fontsFamily.boldFont, fontSize: getFontSize(18) },
    sectionHeader: {
        padding: 10,
        backgroundColor: "#FAF4FF",
        borderRadius: 5,
        marginVertical: 6,
        flexDirection: "row",
    },

    sectionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    sectionRight: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flex: 1 },

    sectionTitle: {
        color: "black",
        fontSize: getFontSize(15),
        fontFamily: fontsFamily.boldFont,
        marginStart: 20,
    },

    iconCircle: {
        height: 30,
        width: 30,
        backgroundColor: "white",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    availText: {
        fontFamily: fontsFamily.regularFont,
        color: "#5F5F5F",
        fontSize: getFontSize(12),
    },


    bannerContainer: {
        height: 60,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        // paddingHorizontal: 10,
        // padding:1
    },

    dateBox: {
        backgroundColor: "white",
        height: 35,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginStart: 10
        // paddingHorizontal: 12,
    },

    dateText: { fontFamily: fontsFamily.semiboldFont, marginLeft: 10 },

    headerRight: { flex: 1, flexDirection: "row", justifyContent: 'flex-end' },

    iconActionButton: {
        backgroundColor: "white",
        height: 35,
        width: 35,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginEnd: 10,
    },





});
