import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Dimensions, Pressable, ScrollView, FlatList, TouchableOpacity, useWindowDimensions, Image, BackHandler } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CommonFunction from "../../../../../utill/CommonFunction";
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal";
import moment from "moment";
import Loader from "../../../../component/Loader";
import NoRecord from "../../../../component/NoRecord";
import { Dropdown } from "react-native-element-dropdown";
import BarChartDiagram from "../../../../component/BarChartDigram";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MonthPickers from "react-native-month-year-picker";
import MonthPicker from "react-native-month-picker";
import { useBackHandler } from "@react-native-community/hooks";
import getStyles from "../../../../styles";
import ListTransaction from "../../../../component/ListTransaction";
import Filter from "../../../../component/Filter";
import { BottomContext } from "../../../../../context/BottomContext";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from "react-redux";
import { splitWeeklyReport } from "../../../../../constants/content";
import { commontimeline,dropdownacc } from "../../../../../utill/Utills";
import { useFocusEffect } from "@react-navigation/native";



function Repayment(props) {
    const reportName = props.route.params.name
    const [isReport, setisReport] = useState(false)
    const [account, setaccount] = useState([])
    const [chval, setchval] = useState(false)
   const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [defaultvalue, setdefaultvalue] = useState('load')
    const [acid, setacid] = useState('')
    const [record, setRecord] = useState([])
    const [record1, setRecord1] = useState([])
    const [loading, setloading] = useState(false)
    const [filterview, setfilteview] = useState(false)
    const { height, width } = useWindowDimensions();
    const [fidate, setfidate] = useState('0')
    const [disDate, setdisDate] = useState('')
    const [lastdata, setlastdata] = useState([])
    const [loginfo, setloginfo] = useState('')
    const [fidatetype, setdatefitype] = useState('')
    const [chart, setChart] = useState([])
    const [chart1, setChart1] = useState([])
    const [list, setList] = useState([])
    const [list1, setList1] = useState([])
    const [listview, setListview] = useState(false)
    const [inrecord, setinrecord] = useState([])
    const [transactionView, settransactionview] = useState(false)
    const [result, setresult] = useState('')
    const [endDate, setendDate] = useState('')
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [date, setDate] = useState(new Date());
    const [date1, setDate1] = useState(new Date());
    const showPicker = useCallback((value) => setShow(value), []);
    const showPicker1 = useCallback((value) => setShow1(value), []);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [fDate, setfDate] = useState('')
    const [toDate, setoDate] = useState('')
    const [disDate1, setdisDate1] = useState('')
    const [month, setmonth] = useState('')
    const [change, setchange] = useState('')
    // const [oldMonth, setOldmonth] = useState('')
    const [dateRange, setdateRange] = useState(false)
    const [firstTrans, setFirstTrans] = useState('')
    const [request, setrequest] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [timeLine, setSelectTimeLine] = useState('-1')
    const [oldMonth1, setOldmonth1] = useState('')
    const [monthChart, setmonthChart] = useState([])
    const [monthList, setMonthList] = useState([])
    const [aplybtn, setaplybtn] = useState(false)
    const [clrbtn, setclrbtn] = useState(false)
    const [chgval1, setchgval1] = useState('')
    const [accId, setaccId] = useState('')
    const [monthlabel, setmonthlabels] = useState([])
    const [monthValue, setmonthValue] = useState([])
    const [timeLinelng, settimlinelng] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const dispatch = useDispatch()
    const { reportmenu, insights, report, settingcms } = useSelector((state) => state.menuicons);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { records } = useSelector((state) => state.statement);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [statements, setStatements] = useState([])
    const [excelreport, setExcelreport] = useState([])
    const [defbankid, setDefbankid] = useState('')
    const [accoundata, setaccountdata] = useState([]);

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
    )

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

    const apiDate = (date) => {
        const value = moment(date).format('YYYY-MM')
        return value
    }

    const formatDate = (date) => {
        const df = moment(new Date(date)).format("MMMM-YYYY")
        return df
    }

    const exportTransactionsToExcel = async (transaction) => {
        try {
            const rows = [];
            const weeklyReport = [...transaction].reverse();
            weeklyReport.forEach((week) => {
                // Summary row
                rows.push({
                    Month: week.Month,
                    "No.of.Transaction": week["No.of.Transaction"],
                    Amount: week.amount,
                    Date: "",
                    Details: "",
                    Type: "",
                    ["Transaction Amount" + " ( " + loginfo.currency + " ) "]: ""
                });

                // Child rows
                week.record.forEach((rec) => {
                    rows.push({
                        Month: "",
                        "No.of.Transaction": "",
                        Amount: "",
                        Date: rec.date,
                        Details: rec.details,
                        Type: rec.type,
                        ["Transaction Amount" + " ( " + loginfo.currency + " ) "]: rec.amount
                    });
                });
            });

            const ws = XLSX.utils.json_to_sheet(rows);

            // Set column widths
            ws["!cols"] = [
                { wch: 25 }, // Month
                { wch: 18 }, // No.of.Transaction
                { wch: 12 }, // Total Amount
                { wch: 15 }, // Date
                { wch: 35 }, // Details
                { wch: 10 }, // Type
                { wch: 25 }, // Transaction Amount
            ];

            CommonFunction.downloadFie(reportName, ws)
        } catch (error) {
            console.error("❌ Error exporting Excel:", error);
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

            const loankeyword = settingcms.loankeyword.map(w => w.text)

            const ch = statements.filter(item => {
                var type = item.type.toLowerCase()
                const matchword = loankeyword.length > 0 && new RegExp(`\\b(${loankeyword.join("|")})\\b`, "i").test(item.description)
                const txDate = CommonFunction.changeformat(item.transacted_at);
                const matchDate = txDate >= begin && txDate <= end
                const matchtype = type === 'debit'
                return matchDate && matchword && matchtype
            });




            var bardata = []
            var listdata = []
            var getmonth = moment(currentMonth).format('MM')
            var getyear = moment(currentMonth).format('YYYY')
            const leftbarcolr = themeColors.bardarkColor
            const rightbarcolor = themeColors.barlightColor
            var exceldata = []
            if (dateRange) {
                if (timeLine === '3' || timeLine === '4') {
                    bardata = splitWeeklychart(ch, getmonth / 1, getyear / 1)
                    listdata = splitWeeklylistReport(ch, getmonth / 1, getyear / 1)
                } else {
                    bardata = splitMonthlyChart(ch)
                    listdata = splitMonthlylistReport(ch)
                }

            } else {
                bardata = splitWeeklychart(ch, getmonth / 1, getyear / 1)
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

            // Format transaction date
            const recordDate = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const monthYear = dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });

            // If monthly report
            if (dateRange) {
                if (!report[monthYear]) {
                    report[monthYear] = {
                        Month: monthYear,
                        "No.of.Transaction": 0,
                        amount: 0,
                        record: []
                    };
                }

                report[monthYear]["No.of.Transaction"] += 1;
                report[monthYear].amount += tx.amount;

                report[monthYear].record.push({
                    date: recordDate,
                    details: tx.description,
                    type: tx.type.toUpperCase(),
                    amount: tx.amount
                });
            }
            // Else weekly report
            else {
                const weekOfMonth = Math.ceil(dateObj.getDate() / 7); // Week1-Week5
                const weekKey = `Week${weekOfMonth} - ${monthYear}`;

                if (!report[weekKey]) {
                    report[weekKey] = {
                        Month: weekKey,
                        "No.of.Transaction": 0,
                        amount: 0,
                        record: []
                    };
                }

                report[weekKey]["No.of.Transaction"] += 1;
                report[weekKey].amount += tx.amount;

                report[weekKey].record.push({
                    date: recordDate,
                    details: tx.description,
                    type: tx.type.toUpperCase(),
                    amount: tx.amount
                });
            }
        });

        // Ensure totals are rounded to 2 decimals
        return Object.values(report).map(r => ({
            ...r,
            amount: Number(r.amount.toFixed(2))
        }));
    };

    const splitWeeklychart = (transactions, month, year, lcolor, rcolor) => {

        const filtered = transactions.filter(tx => {
            const d = new Date(tx.transacted_at);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });
        const daysInMonth = new Date(year, month, 0).getDate();
        const totalWeeks = Math.ceil(daysInMonth / 7);
        const report = {};
        for (let i = 1; i <= totalWeeks; i++) {
            report['week' + i] = { total: 0, credit: 0, debit: 0 };
        }

        filtered.forEach(tx => {
            var type = tx.type.toLowerCase()
            const d = new Date(tx.transacted_at);
            const week = Math.ceil(d.getDate() / 7);
            report['week' + week].total += tx.amount;
            report['week' + week][type] += tx.amount;

        });

        const weeks = Object.keys(report);
        const debits = weeks.map(w => report[w].debit);
        const resultbar = CommonFunction.getweekBardata(weeks, debits)
        return resultbar;
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
                amount: 0,
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

            if (type === "debit") {
                weekObj.debit += tx.amount;
            }

            weekObj.total += tx.amount;
            weekObj.data.push(tx);
        });


        const formattedList = list.map(item => ({
            ...item,
            amount: item.amount.toFixed(2),
            total: item.total.toFixed(2)
        }));



        return formattedList
    }

    function splitMonthlyChart(transactions) {
        const report = {};

        transactions.forEach(tx => {
            const d = new Date(tx.transacted_at);
            const monthKey = d.toLocaleString("en-US", { month: "short", year: "numeric" });

            if (!report[monthKey]) {
                report[monthKey] = { month: monthKey, debit: 0 };
            }

            const type = tx.type.toLowerCase();
            if (type === 'debit') {
                report[monthKey][type] += tx.amount;
            }


        });
        const chart = Object.values(report);
        const getbar = CommonFunction.getBarData(chart)
        return getbar

    }

    function splitMonthlylistReport(transactions) {
        const report = {};

        transactions.forEach(tx => {
            const d = new Date(tx.transacted_at);
            const monthKey = d.toLocaleString("en-US", { month: "short", year: "numeric" }); // e.g. "Jul 2025"

            if (!report[monthKey]) {
                report[monthKey] = {
                    month: monthKey,
                    total: 0,
                    data: []
                };
            }

            report[monthKey].total += tx.amount;
            report[monthKey].data.push(tx);
        });


        return Object.values(report).sort((a, b) => {
            const da = new Date(a.data[0].transacted_at);
            const db = new Date(b.data[0].transacted_at);
            return db - da;
        });
    }


    const incrementMonth = () => {
        setCurrentMonth(prevMonth => {
            var nextMonth = moment(new Date(prevMonth)).add(1, 'months')
            setendDate(monthend(new Date(nextMonth)))
            displayDate(nextMonth)
            return nextMonth;
        });


    };

    const decrementMonth = () => {
        displayDate(currentMonth)
        setCurrentMonth(prevMonth => {
            var prevMonthDate = moment(new Date(prevMonth)).subtract(1, 'months')
            displayDate(prevMonthDate)
            setendDate(monthend(new Date(prevMonthDate)))
            return prevMonthDate;
        });

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

    const navigateBack = () => {
        enableMenu()
        if (props?.route?.params?.group) {
            props.navigation.navigate('Insights', { group: props?.route?.params?.group })
        } else {
            props.navigation.goBack()
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

    const changFormat = (data) => {
        const df = moment(data).format('MMM YYYY')
        return df

    }

    const checkRecord = (listarr) => {
        for (let i = 0; i < listarr.length; i++) {
            if (0 < parseFloat(listarr[i].value)) {
                return true
            }
        }

    }


    const filterBack = () => {
        setIsFilter(false)
    }


    if (isFilter) {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title="Filter" back={'yes'} onBackPress={() => { filterBack(), enableMenu() }} />
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
                            fDate={fDate} />
                    </View>

                </View>
            </GradientBackground>

        )

    } else {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title={props.route.params.name} back={'yes'} onBackPress={() => props.navigation.goBack()} />
                    {
                        loading ?
                            <Loader
                                label={'Loading...'} /> :
                            <View style={[styles.container, {}]}>
                                <View style={[{ marginTop: 0, marginEnd: 10 }]}>

                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                        <View style={{ flex: 2, marginStart: 10, top: 5 }}>
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
                                                    if (accId !== item.value) {
                                                        setaccId(item.guid)
                                                    }
                                                }}
                                            />
                                        </View>
                                        <TouchableOpacity style={styles.filterBackground} onPress={() => setIsFilter(true)}>
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

                                <View style={{ flex: 1, marginTop: 10 }}>
                                    <ScrollView

                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                    >


                                        <View>
                                            {
                                                dateRange ?
                                                    <View style={{ alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                                                        <Text style={styles.daterangeincreaseDecrease}>{
                                                            timeLine === '1' ? 'This Year' : timeLine === '13' ? 'Last 3 Months' : timeLine === '14' ? 'Last 6 Months' : timeLine === '3' ? 'This Month' : timeLine === '4' ? 'Last Month' :
                                                                timeLine === '7' ? changFormat(fDate) + ' - ' + changFormat(toDate) : ''}</Text>
                                                    </View>
                                                    :
                                                    <View style={styles.insightsMonthContainer}>
                                                        <View style={[styles.insightsMonthbg, { flexDirection: 'row', paddingStart: 15, paddingEnd: 15, alignItems: 'center' }]}>

                                                            {
                                                                apiDate(firstTrans) === apiDate(currentMonth) ?
                                                                    <View style={{}}>
                                                                        <Entypo name="chevron-left" size={20} color={themeColors?.bglight} />
                                                                    </View> :
                                                                    <TouchableOpacity style={{}} onPress={decrementMonth}>
                                                                        <Entypo name="chevron-left" size={20} color={themeColors?.bg_light_text} />
                                                                    </TouchableOpacity>
                                                            }

                                                            <View style={{ alignItems: 'center', justifyContent: 'center', marginStart: 15, marginEnd: 15 }}>
                                                                <Text style={styles.daterangeincreaseDecrease}>{'1st - ' + endDate + changelable(endDate) + " " + displayDate(currentMonth) + " " + getYear(currentMonth)}</Text>
                                                            </View>

                                                            {
                                                                balanceDay(currentMonth) == 'before' ?
                                                                    <TouchableOpacity style={{}} onPress={incrementMonth}>
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



                                        <View style={{ flex: 1, marginTop: 10 }}>
                                            {
                                                0 < record.length ? <>
                                                    <View style={[{ marginStart: 10, marginEnd: 10, borderRadius: 8, marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 10, backgroundColor: themeColors?.cardbg }]}>
                                                        <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                                            {/* <Text style={styles.daterangeincreaseDecrease}>{datecChange(month)}</Text> */}
                                                        </View>


                                                        <BarChartDiagram
                                                            currency={loginfo.currency}
                                                            data={record}
                                                        />
                                                    </View>



                                                    <View style={[{ marginStart: 10, marginEnd: 10, marginTop: 10, padding: 10 }]}>
                                                        <View>
                                                            <Text style={styles.listTitle}>List of Repayment</Text>
                                                            <View style={{ marginTop: 10 }}>

                                                                {

                                                                    0 < list.length &&
                                                                    list.map((value, key) => {

                                                                        return (
                                                                            <View key={key}>
                                                                                <ListTransaction
                                                                                    color={themeColors?.card_list_bg}
                                                                                    name={value.month}
                                                                                    label={1 < value.data.length ? 'Transactions' : 'Transaction'}
                                                                                    labelval={value.data.length}
                                                                                    label1={'Amount'}
                                                                                    type={'report'}
                                                                                    currency={loginfo.currency}
                                                                                    label1val={value.total ? parseFloat(value.total).toFixed(2) : '0.00'}
                                                                                    navigation={value.total != '0.00' ? 'yes' : 'no'}
                                                                                    onClick={() => props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.month, cur: loginfo.currency, info: loginfo })}
                                                                                />
                                                                            </View>

                                                                        )




                                                                    })
                                                                }
                                                            </View>
                                                        </View>

                                                    </View>
                                                </> : <NoRecord />
                                            }

                                        </View>


                                    </ScrollView>
                                </View>


                            </View>

                    }




                </View>
            </GradientBackground>

        )
    }


}
export default Repayment