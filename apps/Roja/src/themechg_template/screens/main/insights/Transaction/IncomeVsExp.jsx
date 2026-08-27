import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView, AppState, FlatList, TouchableOpacity, useWindowDimensions, Image, Pressable, Platform, BackHandler } from "react-native";
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BarChart } from 'react-native-gifted-charts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NoRecord from "../../../../component/NoRecord";
import moment from "moment";
import HeaderMenu from "../../../../component/HeaderMenu";
import MonthPicker from "react-native-month-picker";
import { useBackHandler } from "@react-native-community/hooks";
import { Dropdown } from "react-native-element-dropdown";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from "../../../../styles";
import DoubleBarChart from "../../../../component/DoubleBarChart";
import ListTransaction from "../../../../component/ListTransaction";
import Filter from "../../../../component/Filter";
import { BottomContext } from "../../../../../context/BottomContext";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import { useDispatch, useSelector } from "react-redux";
import { splitWeeklyReport } from "../../../../../constants/content";
import { commontimeline,dropdownacc } from "../../../../../utill/Utills";
import { useFocusEffect } from "@react-navigation/native";
import XLSX from 'xlsx';




const Tab = createMaterialTopTabNavigator();
function IncomeVsExp(props) {
    const reportName = props.route.params.screen ? 'Income Vs Expense' : props.route.params?.name
    const [isReport, setisReport] = useState(false)
    const [account, setaccount] = useState([])
    const [record, setRecord] = useState([])
    const [record1, setRecord1] = useState([])
    const [themeRecord, setthemeRecord] = useState([])
    const [count, setcount] = useState('')
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [defaultvalue, setdefaultvalue] = useState('load')
    const [acid, setacid] = useState('')
    const [chval, setchval] = useState('')
    const [loading, setloading] = useState(false)
    const [filterview, setfilteview] = useState(false)
    const [fitype, setfitype] = useState('')
    const [disDate, setdisDate] = useState('')
    const [disDate1, setdisDate1] = useState('')
    const { height, width } = Dimensions.get('window')
    const [fidate, setfidate] = useState('0')
    const [loginfo, setloginfo] = useState('')
    const [inrecord, setinrecord] = useState([])
    const [transactionView, settransactionview] = useState(false)
    const [transName, setTransName] = useState('')
    const [lastData, setlastdata] = useState([])
    const [fidatetype, setdatefitype] = useState('')
    const [chart, setChart] = useState([])
    const [chart1, setChart1] = useState([])
    const [list, setList] = useState([])
    const [monthChart, setmonthChart] = useState([])
    const [monthList, setMonthList] = useState([])
    const [calOpen, setcalOpen] = useState(false)
    const [listview, setListview] = useState(false)
    const [date, setDate] = useState('');
    const [date1, setDate1] = useState(new Date());
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [endDate, setendDate] = useState('')
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [fDate, setfDate] = useState('-1')
    const [toDate, setoDate] = useState('-1')
    const [mdate, setmdate] = useState('')
    const [change, setchange] = useState('')
    // const [oldMonth, setOldmonth] = useState('')
    const [oldMonth1, setOldmonth1] = useState('')
    const [dateRange, setdateRange] = useState(false)
    const [month, setMonth] = useState(new Date())
    const [firstTrans, setFirstTrans] = useState('')
    const [request, setrequest] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [timeLine, setSelectTimeLine] = useState('')
    const [aplybtn, setaplybtn] = useState(false)
    const [clrbtn, setclrbtn] = useState(false)
    const [chval1, setchval1] = useState('')
    const [accId, setaccId] = useState('')
    const [pageload, setpageload] = useState('')
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const dispatch = useDispatch()
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { records } = useSelector((state) => state.statement);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { bankdata, defbank, bankloading, bankerror } = useSelector((state) => state.bank);
    const [statements, setStatements] = useState([])
    const [excelreport, setExcelreport] = useState([])
    const [accoundata, setaccountdata] = useState([]);
    const [defbankid, setDefbankid] = useState('')
    const transactions = [
        { id: 1, category: "Shopping", type: "debit", amount: 100, date: "2025-09-01" },
        { id: 2, category: "Shopping", type: "debit", amount: 52, date: "2025-09-02" },
        { id: 3, category: "Food", type: "debit", amount: 30, date: "2025-09-03" },
        { id: 4, category: "Food", type: "debit", amount: 20, date: "2025-09-04" }
    ]




    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = () => {
        setloginfo(storedata)
        setdisDate(formatDate(new Date(props.route.params.date)))
        setdisDate1(formatDate(new Date(props.route.params.date)))
        setendDate(monthend(new Date(props.route.params.date)))
        setfDate(apiDate((new Date(props.route.params.date))))
        setoDate(apiDate((new Date(props.route.params.date))))
        setCurrentMonth(new Date(props.route.params.date))
        setdateRange(false)
        setDate('')
        setSelectTimeLine('')

    }



    useFocusEffect(
        useCallback(() => {
            const onBackPress = async () => {
                props.navigation.goBack()
                return true;
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => subscription.remove();
        }, [])
    );



    const apiDate = (date) => {
        const value = moment(date).format('YYYY-MM')
        return value
    }

    const monthend = (date) => {
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const getDate = moment(end).format("DD")
        changelable(getDate)
        return getDate

    }

    const changelable = (data) => {
        const rec = data.split('')
        if (rec[1] == '1') {
            return 'st'
        } else {
            return 'th'

        }
    }

    const formatDate = (date) => {
        const df = moment(new Date(date)).format("MMMM-YYYY")
        return df
    }




    const exportTransactionsToExcel = async (transactions) => {
        try {

            const rows = [];
            const weeklyReport = transactions.reverse();
            weeklyReport.forEach((week) => {
                rows.push({
                    Month: week.Month,
                    "No.of.Transaction": week["No.of.Transaction"],
                    Credit: week.Credit,
                    Debit: week.Debit,
                    Date: "",
                    Category: "",
                    Details: "",
                    Bank: "",
                    Account: "",
                    Type: "",
                    ["Amount" + "( " + loginfo.currency + " )"]: ""
                });
                week.record.forEach((rec) => {
                    rows.push({
                        Month: "",
                        "No.of.Transaction": "",
                        Credit: "",
                        Debit: "",
                        Date: rec.date,
                        Category: rec.category,
                        Details: rec.details,
                        Bank: rec.bankname,
                        Account: rec.account,
                        Type: rec.type,
                        ["Amount" + "( " + loginfo.currency + " )"]: rec.amount
                    });
                });
            });

            const ws = XLSX.utils.json_to_sheet(rows);
            ws["!cols"] = [
                { wch: 25 }, // Month
                { wch: 18 }, // No.of.Transaction
                { wch: 12 }, // Credit
                { wch: 12 }, // Debit
                { wch: 15 }, // Date
                { wch: 35 }, // category
                { wch: 35 }, // Details
                { wch: 10 }, // Type
                { wch: 20 }, // Transaction Amount
            ];
            CommonFunction.downloadFie(reportName, ws)




        } catch (error) {
            console.error('❌ Error exporting Excel:', error);
            Alert.alert('Error', 'Could not export Excel file.');
        }
    };



    useEffect(() => {
        if (accountdata) {
            if (0 < defaccount?.length) {
                var defaccid = defaccount.find((obj) => obj.account_default === 'Yes')
                const acc = dropdownacc(defaccount)
                setaccountdata(acc)
                setDefbankid(defaccid.bank_id)
                setaccId(defaccid.guid)
            }
        }

    }, [accountdata])


    useEffect(() => {
        if (records) {
            const accountrans = records.filter(item =>
                item.account_guid === accId && item.bank_id === defbankid
            )
            var firstdata = accountrans[accountrans.length - 1]
            setFirstTrans(firstdata?.transacted_at)
            setStatements(accountrans)



        }


    }, [records, accId])



    useEffect(() => {
        if (0 < statements.length && currentMonth) {
            var begin = ''
            var end = ''
            if (dateRange) {
                if (timeLine === '7') {
                    begin = CommonFunction.getDate(fDate).begin
                    end = CommonFunction.getDate(toDate).end
                } else {
                    begin = date.begin
                    end = date.end
                }
            } else {
                begin = CommonFunction.getDate(currentMonth).begin
                end = CommonFunction.getDate(currentMonth).end
            }

            const ch = statements.filter(item => {
                const txDate = CommonFunction.changeformat(item.transacted_at);
                const matchDate = txDate >= begin && txDate <= end
                return matchDate;
            });

            var bardata = []
            var listdata = []
            var exceldata
            var getmonth = moment(currentMonth).format('MM')
            var getyear = moment(currentMonth).format('YYYY')
            const leftbarcolr = themeColors.chartincome
            const rightbarcolor = themeColors.chartexpenses

            if (dateRange) {
                if (timeLine === '3' || timeLine === '4') {
                    bardata = CommonFunction.splitWeeklyReport(ch, getmonth / 1, getyear / 1, leftbarcolr, rightbarcolor)
                    listdata = splitWeeklylistReport(ch, getmonth / 1, getyear / 1)
                } else {
                    bardata = splitMonthlyReport(ch)
                    listdata = splitMonthlylistReport(ch)
                }

            } else {
                bardata = CommonFunction.splitWeeklyReport(ch, getmonth / 1, getyear / 1, leftbarcolr, rightbarcolor)
                listdata = splitWeeklylistReport(ch, getmonth / 1, getyear / 1)
            }
            exceldata = createReport(ch)
            setExcelreport(exceldata)
            setRecord(bardata)
            setList(listdata)
            setchval('')
        }

    }, [statements, currentMonth, accId, timeLine, chval])

    const createReport = (transactions) => {
        const report = {};

        transactions.forEach(tx => {
            const dateObj = new Date(tx.transacted_at);
            var bankName = bankdata?.records?.find((obj) => obj._id === tx.bank_id)
            var account = accountdata?.records?.find((obj) => obj.guid === tx.account_guid)

            const recordDate = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
            const monthYear = dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });
            if (dateRange) {
                if (!report[monthYear]) {
                    report[monthYear] = {
                        Month: monthYear,
                        "No.of.Transaction": 0,
                        Credit: 0,
                        Debit: 0,
                        record: []
                    };
                }

                // Update counts
                report[monthYear]["No.of.Transaction"] += 1;
                if (tx.type.toUpperCase() === "CREDIT") {
                    report[monthYear].Credit += tx.amount;
                } else if (tx.type.toUpperCase() === "DEBIT") {
                    report[monthYear].Debit += tx.amount;
                }

                // Add transaction record

                report[monthYear].record.push({
                    date: recordDate,
                    category: tx.top_level_category,
                    details: tx.description,
                    type: tx.type.toLowerCase(),
                    amount: tx.amount,
                    account: account?.type.toLowerCase(),
                    bankname: bankName?.bank_name
                });
            } else {
                const weekOfMonth = Math.ceil(dateObj.getDate() / 7); // 1-5
                const weekKey = `Week${weekOfMonth} - ${monthYear}`;
                if (!report[weekKey]) {
                    report[weekKey] = {
                        Month: weekKey,
                        "No.of.Transaction": 0,
                        Credit: 0,
                        Debit: 0,
                        record: []
                    };
                }

                report[weekKey]["No.of.Transaction"] += 1;
                if (tx.type.toUpperCase() === "CREDIT") {
                    report[weekKey].Credit += tx.amount;
                } else if (tx.type.toUpperCase() === "DEBIT") {
                    report[weekKey].Debit += tx.amount;
                }

                report[weekKey].record.push({
                    date: recordDate,
                    details: tx.description,
                    category: tx.top_level_category,
                    type: tx.type.toUpperCase(),
                    account: account?.type.toLowerCase(),
                    amount: tx.amount,
                    bankname: bankName?.bank_name
                });
            }

        });

        return Object.values(report);
    }



    function splitWeeklylistReport(transactions, month, year) {
        const filtered = transactions.filter(tx => {
            const d = new Date(tx.transacted_at);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });


        const daysInMonth = new Date(year, month, 0).getDate();
        const totalWeeks = Math.ceil(daysInMonth / 7);


        const list = [];
        for (let i = 1; i <= totalWeeks; i++) {
            list.push({
                credit: 0,
                debit: 0,
                total: 0,
                data: [],
                month: `Week${i}`
            });
        }


        filtered.forEach(tx => {
            const type = tx.type.toLowerCase();
            const d = new Date(tx.transacted_at);
            const week = Math.ceil(d.getDate() / 7);
            const weekObj = list[week - 1];

            if (type === "credit") {
                weekObj.credit += tx.amount;
            } else if (type === "debit") {
                weekObj.debit += tx.amount;
            }

            weekObj.total += tx.amount;
            weekObj.data.push(tx);
        });


        const formattedList = list.map(item => ({
            ...item,
            credit: item.credit.toFixed(2),
            debit: item.debit.toFixed(2),
            total: item.total.toFixed(2)
        }));



        return formattedList
    }

    function splitMonthlyReport(transactions) {
        const report = {};

        transactions.forEach(tx => {
            const d = new Date(tx.transacted_at);
            const monthKey = d.toLocaleString("en-US", { month: "short", year: "numeric" });

            if (!report[monthKey]) {
                report[monthKey] = { month: monthKey, debit: 0, credit: 0 };
            }

            const type = tx.type.toLowerCase();
            report[monthKey][type] += tx.amount;
        });
        const chart = Object.values(report);
        const getbar = getBarData(chart)
        return getbar
    }

    function splitMonthlylistReport(transactions) {
        const report = {};

        transactions.forEach(tx => {
            const d = new Date(tx.transacted_at);
            const monthKey = d.toLocaleString("en-US", { month: "short", year: "numeric" }); // e.g. "Mar 2025"

            if (!report[monthKey]) {
                report[monthKey] = {
                    month: monthKey,
                    debit: 0,
                    credit: 0,
                    data: []
                };
            }

            var type = tx.type.toLowerCase()
            report[monthKey][type] += tx.amount;
            report[monthKey].data.push(tx);
        });

        const result = Object.values(report).sort((a, b) => {
            const da = new Date(a.data[0].transacted_at);
            const db = new Date(b.data[0].transacted_at);
            return db - da;
        });

        return result;
    }

    const getBarData = (final) => {
        const barData = [];
        for (let i = 0; i < final.length; i++) {

            const obj1 = {
                value: parseFloat(final[i].credit),
                label: final[i].month,
                type: 'Income',
                spacing: 0,
                frontColor: themeColors.chartincome,
            };


            const obj2 = {
                value: parseFloat(final[i].debit),
                type: 'Expense',
                lab: final[i].month,
                frontColor: themeColors.chartexpenses,
            };
            barData.push(obj1, obj2)

        }

        return barData;
    }


    const navigateBack = () => {
        enableMenu()
        if (props?.route?.params?.group) {
            props.navigation.navigate('Insights', { group: props?.route?.params?.group })
        } else {
            props.navigation.goBack()
        }
    }

    const incrementMonth = () => {
        setCurrentMonth(prevMonth => {
            var nextMonth = moment(new Date(prevMonth)).add(1, 'months')
            setendDate(monthend(new Date(nextMonth)))
            displayDate(nextMonth)
            return nextMonth;
        });

        setMonth((prevMonth) => {
            var prevMonthDate = moment(new Date(prevMonth)).add(1, 'months')
            return prevMonthDate;
        })
    };

    const decrementMonth = () => {
        displayDate(currentMonth)
        setCurrentMonth(prevMonth => {
            var prevMonthDate = moment(new Date(prevMonth)).subtract(1, 'months')
            displayDate(prevMonthDate)
            setendDate(monthend(new Date(prevMonthDate)))
            return prevMonthDate;
        });

        setMonth((prevMonth) => {
            var prevMonthDate = moment(new Date(prevMonth)).subtract(1, 'months')
            return prevMonthDate;
        })
    };

    const displayDate = (rec) => {
        const dt = moment(rec).format('MMM')
        return dt

    }

    const getYear = (date) => {
        const df = moment(new Date(date)).format("YYYY")
        return df
    }

    const balanceDay = (date) => {
        if (date) {
            const current = new Date(toDate)
            const changemonth = new Date(date)
            const curmont = moment(current).format('MM-YYYY')
            const checkmonth = moment(changemonth).format('MM-YYYY')
            if (curmont == checkmonth) {
                const curDate = moment(new Date()).format('DD')
                return (endDate - curDate)
            } else {
                if (current.getTime() < changemonth.getTime()) {
                    return 'after'
                } else if (current.getTime() > changemonth.getTime()) {
                    return 'before'
                } else {
                    return '0'
                }
            }
        }

    }

    const clearBtn = () => {
        setclrbtn(true)
        getDetails()
    }

    const applyBtn = (data) => {
        if (!clrbtn && data) {
            var dt = {}
            if (data !== '7') {
                dt = CommonFunction.timeline(data)
            }
            setSelectTimeLine(data)
            setDate(dt)
            setchval('1')
            setdateRange(true)
        }

        setIsFilter(false)

    }

    const filterBack = () => {
        setIsFilter(false)
    }

    const formatDate1 = (date) => {
        const df = moment(new Date(date)).format("MMM YYYY")
        return df
    }

    const onValueChange = (selectedDate) => {
        setShow(false)
        setdisDate(formatDate(selectedDate))
        setfDate(apiDate(selectedDate));
        setdateRange(true)

        setdisDate1(formatDate(new Date()))
        setoDate(apiDate(new Date()))
    }

    const onValueChange1 = (rec) => {
        setdisDate1(formatDate(rec))
        setDate1(rec);
        setoDate(apiDate(rec))
        setShow1(false)
        setdateRange(true)
    }

    const checkRecord = (listarr) => {
        for (let i = 0; i < listarr.length; i++) {
            if (0 < parseFloat(listarr[i].value)) {
                return true
            }

        }

    }



    if (isFilter) {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title="Filter" back={'yes'}
                        onBackPress={() => { filterBack(), enableMenu() }} />
                    <View style={[styles.container,]}>
                        <Filter
                            timeLine={timeLine}
                            disDate={disDate}
                            disDate1={disDate1}
                            firstTrans={firstTrans}
                            picker={'monthpicker'}
                            chaCancel={(res) => setclrbtn(false)}
                            changeFdatevalue={(rec) => onValueChange(rec)}
                            changeTdatevalue={(rec) => onValueChange1(rec)}
                            onApplyClk={(result) => applyBtn(result)}
                            onCancelClk={(res) => clearBtn(res)}
                            fDate={fDate}
                            tDate={toDate} />
                    </View>

                </View>
            </GradientBackground>

        )

    } else {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title={props.route.params.screen ? 'Income Vs Expense' : props.route.params?.name} back={'yes'}
                        onBackPress={() => props.navigation.goBack()} />
                    {
                        loading ?
                            <Loader
                                label={'Loading...'} /> :
                            <View style={[styles.container, { marginTop: 0 }]}>

                                <>

                                    <View style={[{ marginEnd: 5, marginTop: 5, padding: 10, }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ flex: 2, }}>
                                                <Dropdown
                                                    data={accoundata}
                                                    value={accId}
                                                    labelField="type"
                                                    valueField="guid"
                                                    itemTextStyle={{ color: themeColors?.dark }}
                                                    style={styles.dropdownreport}
                                                    iconColor={themeColors?.bg_light_text}
                                                    selectedTextStyle={styles.reportDropText}
                                                    onChange={item => {
                                                        if (accId !== item.guid) {
                                                            setaccId(item.guid)
                                                        }
                                                    }}
                                                />
                                            </View>
                                            <TouchableOpacity style={styles.filterBackground} onPress={() => { setIsFilter(true), setclrbtn(false) }}>
                                                <MaterialCommunityIcons name="tune" size={geticonSize} color={themeColors?.white} />
                                            </TouchableOpacity>

                                            {
                                                checkRecord(record) ? <TouchableOpacity style={styles.downloadbackground} onPress={() => {

                                                    exportTransactionsToExcel(excelreport, reportName)
                                                }
                                                } >
                                                    <AntDesign name="download" size={geticonSize} color={themeColors?.white} />
                                                </TouchableOpacity> : <TouchableOpacity style={[styles.downloadbackground, { opacity: 0.1 }]} onPress={() => {


                                                }
                                                } >
                                                    <AntDesign name="download" size={geticonSize} color={themeColors?.white} />
                                                </TouchableOpacity>
                                            }


                                        </View>
                                    </View>


                                    <ScrollView

                                        contentContainerStyle={{ flexGrow: 1 }}
                                    >


                                        <>
                                            {
                                                0 < record.length && <View>

                                                    <View style={[{ marginStart: 5, marginEnd: 5, padding: 10, backgroundColor: themeColors?.cardbg }]}>

                                                        <View style={{}}>

                                                            {
                                                                !dateRange && !timeLine &&
                                                                <View style={styles.insightsMonthContainer}>
                                                                    <View style={[styles.insightsMonthbg, { flexDirection: 'row', paddingStart: 15, paddingEnd: 15 }]}>

                                                                        {
                                                                            apiDate(firstTrans) === apiDate(currentMonth) ?
                                                                                <View >
                                                                                    <Entypo name="chevron-left" size={20} color={themeColors?.bglight} />
                                                                                </View> :
                                                                                <TouchableOpacity onPress={decrementMonth}>
                                                                                    <Entypo name="chevron-left" size={20} color={themeColors?.bg_light_text} />
                                                                                </TouchableOpacity>
                                                                        }






                                                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginStart: 15, marginEnd: 15 }}>
                                                                            <Text style={[styles.cardfilterdate, { color: themeColors?.bg_light_text }]}>{'1st - ' + endDate + changelable(endDate) + " " + displayDate(currentMonth) + " " + getYear(currentMonth)}</Text>
                                                                        </View>



                                                                        {
                                                                            balanceDay(currentMonth) == 'before' ?
                                                                                <TouchableOpacity onPress={incrementMonth}>
                                                                                    <Entypo name="chevron-right" size={20} color={themeColors?.bg_light_text} />
                                                                                </TouchableOpacity> :
                                                                                <View style={{}}>
                                                                                    <Entypo name="chevron-right" size={20} color={themeColors?.bglight} />
                                                                                </View>

                                                                        }





                                                                    </View>


                                                                </View>
                                                            }

                                                        </View>

                                                        {
                                                            dateRange &&
                                                            <View style={{ alignItems: 'center', justifyContent: 'center', marginStart: 15, marginEnd: 15 }}>
                                                                <Text style={[styles.cardfilterdate, { color: themeColors?.bg_light_text }]}>{'1st - ' + endDate + changelable(endDate) + " " + displayDate(currentMonth) + " " + getYear(currentMonth)}</Text>
                                                            </View>

                                                        }

                                                        <View style={{ marginTop: 10 }}>
                                                            <DoubleBarChart
                                                                label1={'Income'}
                                                                label2={'Expense'}
                                                                type={'report'}
                                                                currency={loginfo?.currency}
                                                                data={record} />
                                                        </View>
                                                    </View>
                                                </View>
                                            }
                                        </>

                                        {
                                            0 < list.length ?
                                                <View style={{ marginTop: 10, marginStart: 10, marginEnd: 10, padding: 10 }}>
                                                    <Text style={styles.listTitle}>List of Income vs Expense</Text>
                                                    <View style={{ marginTop: 10 }}>

                                                        {

                                                            list.map((value, key) => {

                                                                return (
                                                                    <Pressable key={key} onPress={() => (value.credit != "0.00" || value.debit != "0.00") && props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}>
                                                                        <ListTransaction
                                                                            color={themeColors?.card_list_bg}
                                                                            name={value.month}
                                                                            label1={'Income'}
                                                                            label2={'Expense'}
                                                                            type={'report'}
                                                                            label={1 < value.data.length ? 'Transactions' : 'Transaction'}
                                                                            label1val={value.credit ? parseFloat(value.credit).toFixed(2) : '0.00'}
                                                                            label2val={value.debit ? parseFloat(value.debit).toFixed(2) : '0.00'}
                                                                            currency={loginfo.currency}
                                                                            labelval={value.data.length}
                                                                        />

                                                                    </Pressable>
                                                                )

                                                            })
                                                        }
                                                    </View>
                                                </View> : <View
                                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                                >

                                                    {

                                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginStart: 15, marginEnd: 15, marginTop: 20 }}>
                                                            <Text style={[styles.cardfilterdate, { color: themeColors?.bg_light_text, }]}>{'1st - ' + endDate + changelable(endDate) + " " + displayDate(currentMonth) + " " + getYear(currentMonth)}</Text>
                                                        </View>

                                                    }
                                                    <NoRecord />
                                                </View>
                                        }


                                        {
                                            // 0 < record1.length && dateRange ?
                                            //     <View

                                            //     >

                                            //         <View style={[{ marginStart: 5, marginEnd: 5, padding: 10, backgroundColor: themeColors?.cardbg }]}>






                                            //             {
                                            //                 timeLine &&
                                            //                 <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                            //                     <Text style={styles.cardfilterdate}>{
                                            //                         timeLine === '1' ? 'This Year' : timeLine === '13' ? 'Last 3 Months' : timeLine === '14' ? 'Last 6 Months' :
                                            //                             timeLine === '7' ? formatDate1(fDate) === formatDate1(toDate) ? formatDate1(fDate) : formatDate1(fDate) + ' - ' + formatDate1(toDate) : ''}</Text>
                                            //                 </View>
                                            //             }


                                            //             <View style={{ marginTop: 10 }}>
                                            //                 <DoubleBarChart
                                            //                     label1={'Income'}
                                            //                     label2={'Expense'}
                                            //                     type={'report'}
                                            //                     currency={loginfo.currency}
                                            //                     data={record1} />
                                            //             </View>



                                            //         </View>


                                            //         <View style={{ marginTop: 10, marginStart: 10, marginEnd: 10, padding: 10 }}>
                                            //             <Text style={styles.listTitle}>List of Income vs Expense</Text>
                                            //             <View style={{ marginTop: 10 }}>

                                            //                 {
                                            //                     0 < record.length &&
                                            //                     record.map((value, key) => {
                                            //                         return (
                                            //                             <View key={key} onPress={() => (value.CREDIT != "0.00" || value.DEBIT != "0.00") && props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}>
                                            //                                 <ListTransaction
                                            //                                     color={themeColors?.card_list_bg}
                                            //                                     name={value.month}
                                            //                                     label={1 < value.data.length ? 'Transactions' : 'Transaction'}
                                            //                                     label1={'Income'}
                                            //                                     label2={'Expense'}
                                            //                                     type={'report'}
                                            //                                     labelval={value.data.length}
                                            //                                     currency={loginfo.currency}
                                            //                                     label1val={value.CREDIT ? parseFloat(value.CREDIT).toFixed(2) : '0.00'}
                                            //                                     label2val={value.DEBIT ? parseFloat(value.DEBIT).toFixed(2) : '0.00'}
                                            //                                     navigation={(value.CREDIT != "0.00" || value.DEBIT != "0.00") ? 'yes' : 'no'}
                                            //                                     onClick={() => props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}
                                            //                                 />

                                            //                             </View>
                                            //                         )

                                            //                     })
                                            //                 }
                                            //             </View>
                                            //         </View>

                                            //     </View>:<>


                                            //     </>

                                            // : dateRange && 0 < record.length ?
                                            //     <View

                                            //     >

                                            //         <View style={{ marginStart: 5, marginEnd: 5, marginTop: 10, padding: 10, backgroundColor: themeColors?.cardbg }}>
                                            //             <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                            //                 <Text style={styles.daterangeincreaseDecrease}>{
                                            //                     timeLine === '1' ? 'This Year' : timeLine === '13' ? 'Last 3 Months' : timeLine === '14' ? 'Last 6 Months' :
                                            //                         timeLine === '7' ? formatDate1(fDate) === formatDate1(toDate) ? formatDate1(fDate) : formatDate1(fDate) + ' - ' + formatDate1(toDate) : ''}</Text>
                                            //             </View>

                                            //             <View style={{ marginTop: 10 }}>
                                            //                 <DoubleBarChart
                                            //                     label1={'Income'}
                                            //                     label2={'Expense'}
                                            //                     type={'report'}
                                            //                     currency={loginfo.currency}
                                            //                     data={record} />
                                            //             </View>

                                            //         </View>
                                            //         <View style={{ marginStart: 15, marginEnd: 15, marginTop: 20, }}>
                                            //             <Text style={styles.listTitle}>List of Income vs Expense</Text>
                                            //             <View style={{ marginTop: 10 }}>
                                            //                 {
                                            //                     console.log(record,'-------')
                                            //                 }

                                            //                 {
                                            //                     0 < record.length &&
                                            //                     record.map((value, key) => {
                                            //                         if (value.months === mdate || (0 < chart.length && chart[0].CREDIT)) {
                                            //                             return (

                                            //                                 <View key={key} onPress={() => (value.CREDIT != "0.00" || value.DEBIT != "0.00") && props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}>
                                            //                                     <ListTransaction
                                            //                                         color={themeColors?.card_list_bg}
                                            //                                         name={value.month}
                                            //                                         label={1 < value.data.length ? 'Transactions' : 'Transaction'}
                                            //                                         label1={'Income'}
                                            //                                         label2={'Expense'}
                                            //                                         type={'report'}
                                            //                                         labelval={value.data.length}
                                            //                                         currency={loginfo.currency}
                                            //                                         label1val={value.CREDIT ? parseFloat(value.CREDIT).toFixed(2) : '0.00'}
                                            //                                         label2val={value.DEBIT ? parseFloat(value.DEBIT).toFixed(2) : '0.00'}
                                            //                                         navigation={(value.CREDIT != "0.00" || value.DEBIT != "0.00") ? 'yes' : 'no'}
                                            //                                         onClick={() => props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}
                                            //                                     />

                                            //                                 </View>


                                            //                             )
                                            //                         }

                                            //                     })
                                            //                 }
                                            //             </View>
                                            //         </View>
                                            //     </View> :
                                            //     0 < record.length ?
                                            //         <View

                                            //         >

                                            //             <View style={{ marginTop: 10, marginStart: 5, marginEnd: 5, padding: 10, backgroundColor: themeColors?.cardbg, borderRadius: 5 }}>

                                            //                 <DoubleBarChart
                                            //                     type={'report'}
                                            //                     currency={loginfo.currency}
                                            //                     label1={'Income'}
                                            //                     label2={'Expense'}
                                            //                     data={record} />


                                            //             </View>
                                            //             <View style={{ marginStart: 15, marginEnd: 15, marginTop: 20 }}>
                                            //                 <Text style={styles.listTitle}>List of Income vs Expense</Text>
                                            //                 <View style={{ marginTop: 10 }}>

                                            //                     {
                                            //                         0 < record.length &&
                                            //                         record.map((value, key) => {
                                            //                             if (value.months === mdate  || value.months === props.route.params?.months) {
                                            //                                 return (
                                            //                                     <View key={key} onPress={() => (value.CREDIT != "0.00" || value.DEBIT != "0.00") && props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}>
                                            //                                         <ListTransaction
                                            //                                             color={themeColors?.card_list_bg}
                                            //                                             name={value.month}
                                            //                                             label={1 < value.data.length ? 'Transactions' : 'Transaction'}
                                            //                                             label1={'Income'}
                                            //                                             label2={'Expense'}
                                            //                                             type={'report'}
                                            //                                             labelval={value.data.length}
                                            //                                             currency={loginfo.currency}
                                            //                                             label1val={value.CREDIT ? parseFloat(value.CREDIT).toFixed(2) : '0.00'}
                                            //                                             label2val={value.DEBIT ? parseFloat(value.DEBIT).toFixed(2) : '0.00'}
                                            //                                             navigation={(value.CREDIT != "0.00" || value.DEBIT != "0.00") ? 'yes' : 'no'}
                                            //                                             onClick={() => props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}
                                            //                                         />

                                            //                                     </View>
                                            //                                 )
                                            //                             }

                                            //                         })
                                            //                     }
                                            //                 </View>
                                            //             </View>
                                            //         </View> :
                                            //         <View style={{ flex: 1 }}>
                                            //             <NoRecord />
                                            //         </View>


                                        }




                                    </ScrollView>

                                </>





                            </View>

                    }



                    {
                        show1 && (
                            <MonthPicker
                                onChange={onValueChange1}
                                value={date1}
                                minimumDate={new Date(fDate)}
                                maximumDate={new Date()}

                            />
                        )
                    }

                </View>
            </GradientBackground>

        )

    }

}

export default IncomeVsExp