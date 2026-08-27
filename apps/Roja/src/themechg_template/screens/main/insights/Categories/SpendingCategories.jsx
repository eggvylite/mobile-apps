import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Dimensions, Pressable, FlatList, TouchableOpacity, useWindowDimensions, Image, Platform, BackHandler } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { PieChart, } from "react-native-gifted-charts";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import moment from "moment";
import NoRecord from "../../../../component/NoRecord";
import { useBackHandler } from "@react-native-community/hooks";
import { Dropdown } from "react-native-element-dropdown";
import { getFontSize } from "../../../../../constants/Font";
import Filter from "../../../../component/Filter";
import getStyles from "../../../../styles";
import { BottomContext } from "../../../../../context/BottomContext";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import ListTransaction from "../../../../component/ListTransaction";
import { useDispatch, useSelector } from "react-redux";
import { commontimeline, dropdownacc } from "../../../../../utill/Utills";
import Entypo from 'react-native-vector-icons/Entypo';
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import FileViewer from 'react-native-file-viewer';
import { useFocusEffect } from "@react-navigation/native";
import { domain } from "../../../../../service/environment";

function SpendingCategories(props) {
    const reportName = props.route.params.name
    const [isReport, setisReport] = useState(false)
    const [user, setuser] = useState('')
    const [account, setaccount] = useState([])
    const [piechart, setpiechart] = useState([])
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [count, setcount] = useState('')
    const [defaultvalue, setdefaultvalue] = useState('load')
    const [acid, setacid] = useState('')
    const [chval, setchval] = useState(false)
    const [loading, setloading] = useState(false)
    const [filterview, setfilteview] = useState(false)
    const [fitype, setfitype] = useState('')
    const [disDate, setdisDate] = useState('')
    const { height, width } = useWindowDimensions();
    const [fidate, setfidate] = useState('0')
    const [file, setfile] = useState('')
    const [loginfo, setloginfo] = useState('')
    const [fidatetype, setdatefitype] = useState('')
    const [inrecord, setinrecord] = useState([])
    const [transactionView, settransactionview] = useState(false)
    const [transName, setTransName] = useState('')
    const colors = ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#ead1dc', '#E6E6FA', '#FFE4E1', '#D2B48C', '#DEB887', '#F5DEB3', '#FFB6C1', '#DDA0DD',
        '#87CEFA', '#AFEEEE', '#BDB76B', '#FFA07A', '#F0E68C', '#20B2AA', '#D8BFD8',
        '#FAEBD7', '#BC8F8F', '#778899', '#808080', '#FFEBCD', '#DB7093', '#F4A460'
    ]

    const [chart, setChart] = useState(false)
    const [list, setList] = useState([])
    const [listview, setListview] = useState(false)
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
    const [icon, seticons] = useState([])
    const [request, setrequest] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [timeLine, setSelectTimeLine] = useState('7')
    const [oldMonth1, setOldmonth1] = useState('')
    const [monthChart, setmonthChart] = useState([])
    const [monthList, setMonthList] = useState([])
    const [aplybtn, setaplybtn] = useState(false)
    const [clrbtn, setclrbtn] = useState(false)
    const [chgval1, setchgval1] = useState('')
    const [accId, setaccId] = useState('')
    const [amt, setamt] = useState(false)
    const [isVisbleamt, setisVisibleamt] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const dispatch = useDispatch()
    const { records } = useSelector((state) => state.statement);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { reportmenu, insights, report, settingcms, spendingcategoryicons } = useSelector((state) => state.menuicons);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const [statements, setStatements] = useState([])
    const [record, setRecord] = useState([])
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
        setendDate(monthend(new Date(props.route.params.date)))
        setfDate(props.route?.params?.date ? apiDate(props.route?.params?.date) : apiDate(monthName))
        setoDate(props.route?.params?.date ? apiDate(props.route?.params?.date) : apiDate(new Date()))
        setdisDate(props.route?.params?.date ? formatDate1(props.route?.params?.date) : formatDate1(new Date()))
        setdisDate1(props.route?.params?.date ? formatDate1(props.route?.params?.date) : formatDate1(new Date()))
        setCurrentMonth(new Date(props.route?.params?.date))
        setSelectTimeLine('')
        setdateRange(false)
    }

    const apiDate = (date) => {
        const value = moment(date).format('YYYY-MM')
        return value
    }

    const exportTransactionsToExcel = async (transaction) => {
        try {
            const rows = [];
            const categoryReport = [...transaction].reverse(); // keep original order intact

            categoryReport.forEach((group) => {
                // Summary row
                rows.push({
                    Month: group.Month,
                    Category: group.category,
                    Code: group.code,
                    "No.of.Transaction": group["No.of.Transaction"],
                    ["Total" + "( " + loginfo.currency + " )"]: group.amount,
                    Date: "",
                    Details: "",
                    Type: "",
                    ["Amount" + "( " + loginfo.currency + " )"]: ""
                });

                // Child rows
                group.record.forEach((rec) => {
                    rows.push({
                        Month: "",
                        "No.of.Transaction": "",
                        Category: "",
                        Code: "",
                        ["Total" + "( " + loginfo.currency + " )"]: "",
                        Date: rec.date,
                        Details: rec.details,
                        Type: rec.type,
                        ["Amount" + "( " + loginfo.currency + " )"]: rec.amount
                    });
                });
            });

            const ws = XLSX.utils.json_to_sheet(rows);

            ws["!cols"] = [
                { wch: 15 }, // Month
                { wch: 18 }, // No.of.Transaction
                { wch: 20 }, // Category
                { wch: 10 }, // Code
                { wch: 12 }, // Total
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
                item.account_guid === accId && item.type === 'DEBIT' && item.bank_id === defbankid
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


            var exceldata = createReport(ch)
            setExcelreport(exceldata)
            bardata = getSpendchart(ch)
            listdata = getSpendList(ch)
            setRecord(bardata)
            setList(listdata)
            setchval('')
        }

    }, [statements, currentMonth, accId, timeLine, chval])

    const createReport = (transactions) => {
        const report = {};

        transactions.forEach((tx) => {
            const dateObj = new Date(tx.transacted_at);

            // Month-Year key (e.g., "Mar 2025")
            const monthYear = dateObj.toLocaleString("en-US", { month: "short", year: "numeric" });

            // Format transaction date
            const recordDate = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });

            if (!report[monthYear]) {
                report[monthYear] = {
                    Month: monthYear,
                    category: tx.top_level_category,
                    code: tx.parentCategoryCode,
                    "No.of.Transaction": 0,
                    amount: 0,
                    record: [],
                };
            }

            // Update counters
            report[monthYear]["No.of.Transaction"] += 1;
            report[monthYear].amount += tx.amount;
            // Push transaction
            report[monthYear].record.push({
                date: recordDate,
                details: tx.description,
                type: tx.type.toUpperCase(),
                amount: tx.amount,
            });
        });

        // Ensure totals rounded to 2 decimals
        return Object.values(report).map((r) => ({
            ...r,
            amount: Number(r.amount.toFixed(2)),
        }));
    };



    const getSpendchart = (transactions) => {
        const grouped = transactions.reduce((acc, tx) => {
            const key = tx.top_level_category;

            if (!acc[key]) {
                acc[key] = { category: key, amount: 0 };
            }
            acc[key].amount += tx.amount;

            return acc;
        }, {});

        const categories = Object.values(grouped).map(g => g.category);
        const amounts = Object.values(grouped).map(g => g.amount);

        const resultbar = getPiechart(categories, amounts);
        return resultbar;
    };


    const getPiechart = (label, amount) => {
        const barData = [];
        for (let i = 0; i < label.length; i++) {
            var j = i > 30 ? i - 30 : i;
            const obj1 = {
                name: label[i],
                value: amount[i],
                color: colors[j],
                text: loginfo.currency + ' ' + colors[i]
            };



            barData.push(obj1);
        }



        return barData;
    };

    function formatDate1(date) {
        const df = moment(date).format('MMMM - YYYY')
        return df

    }


    const getSpendList = (transactions) => {
        const result = {};

        transactions.forEach(tx => {
            const key = tx.top_level_category;
            if (!result[key]) {
                result[key] = { category: key, amount: 0, data: [] };
            }

            result[key].amount += tx.amount;

            // Push transaction to data array
            result[key].data.push(tx);
        });

        return Object.values(result);
    };


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

    const monthend = (date) => {
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const getDate = moment(end).format("DD")
        changelable(getDate)
        return getDate

    }

    const displayDate = (rec) => {
        const dt = moment(rec).format('MMM')
        return dt

    }

    const changelable = (data) => {
        const rec = data.split('')
        if (rec[1] == '1') {
            return 'st'
        } else {
            return 'th'

        }
    }

    const getYear = (date) => {
        const df = moment(new Date(date)).format("YYYY")
        return df
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


    const onValueChange = (selectedDate) => {
        setShow(false)
        setdisDate(formatDate1(selectedDate))
        setfDate(apiDate(selectedDate));
        setdateRange(true)

        setdisDate1(formatDate1(new Date()))
        setoDate(apiDate(new Date()))
    }

    const onValueChange1 = (rec) => {
        setdisDate1(formatDate1(rec))
        setDate1(rec);
        setoDate(apiDate(rec))
        setShow1(false)
        setdateRange(true)
    }

    const changFormat = (data) => {
        const df = moment(data).format('MMM YYYY')
        return df

    }

    const handlePress = () => {
        setisVisibleamt(true);

        setTimeout(() => {
            setamt('')
            setisVisibleamt(false);
        }, 3000); // 3 seconds delay
    };

    const filterBack = () => {
        setIsFilter(false)
    }


    if (isFilter) {
        return (
            <GradientBackground>
                <View style={styles.container}>

                    <CommonHeader title="Filter" back={'yes'} onBackPress={() => { filterBack(), enableMenu() }} />

                    <View style={[styles.container]}>
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
                    <CommonHeader title={domain === 'live' ? props.route.params.name : "Spending Categories"} back={'yes'}
                        onBackPress={() => {

                            if (props.route.params?.screen) {
                                props.navigation.goBack()
                            } else {
                                props.navigation.navigate('Insights', { screen: 'categories' })
                            }
                        }} />


                    {
                        loading ?
                            <Loader
                                label={'Loading...'} /> :
                            loginfo &&
                            <View style={[styles.container,]}>



                                <View style={[{ marginEnd: 10, borderRadius: 8, marginTop: 10, padding: 10 }]}>

                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
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
                                                    if (accId !== item.value) {
                                                        setaccId(item.guid)
                                                    }
                                                }}
                                            />
                                        </View>
                                        <TouchableOpacity style={[styles.filterBackground]} onPress={() => setIsFilter(true)}>
                                            <MaterialCommunityIcons name="tune" size={geticonSize} color={themeColors?.white} />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.downloadbackground} onPress={() => exportTransactionsToExcel(excelreport)}>
                                            <AntDesign name="download" size={geticonSize} color={themeColors?.white} />
                                        </TouchableOpacity>

                                    </View>

                                </View>


                                <View style={{ flex: 1 }}>



                                    <ScrollView

                                        contentContainerStyle={{ flexGrow: 1 }}
                                    >

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

                                        {
                                            isVisbleamt &&
                                            <View style={[styles.tooltip]}>
                                                <Text style={{ fontSize: getFontSize(14), color: themeColors?.card_text_color }}>{amt}</Text>
                                            </View>
                                        }

                                        {
                                            0 < record.length && <View style={[{ marginStart: 10, marginEnd: 10, borderRadius: 8, marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 10, backgroundColor: themeColors?.cardbg }]}>

                                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <PieChart
                                                            // showGradient
                                                            radius={100}
                                                            data={record}
                                                            toggleFocusOnPress
                                                            onPress={(data) => { setamt(data.name + ' : ' + loginfo.currency + ' ' + data.value), handlePress(data) }}
                                                        // onPress={(data) => CommonFunction.message(data.name + " : " + data.value)}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={{ marginStart: 20, marginTop: 10 }}>
                                                    <FlatList
                                                        data={record}
                                                        scrollEnabled={false}
                                                        keyExtractor={(item, index) => index}
                                                        numColumns={2}
                                                        renderItem={({ item, index }) => {
                                                            return (
                                                                <View style={{ flex: 1, flexGrow: 1 }}>
                                                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                                                        <View style={{ height: 15, width: 15, backgroundColor: item.color, borderRadius: 100 }}></View>
                                                                        <View style={{ marginStart: 5, bottom: 2 }}>
                                                                            <Text style={[styles.reportText, { fontSize: getFontSize(12), color: themeColors?.card_text_color }]}>{item.name}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            )
                                                        }}
                                                    />
                                                </View>

                                            </View>
                                        }

                                        {
                                            0 < list.length ? <View>
                                                <View style={[, { marginStart: 10, marginEnd: 10, padding: 10, marginTop: 10 }]}>
                                                    <View>
                                                        <Text style={[styles.listTitle,]}>List of Spending Categories</Text>
                                                        <View style={{ marginTop: 10 }}>
                                                            {
                                                                0 < list.length &&
                                                                list.map((value, key) => {
                                                                    const showIcons = spendingcategoryicons.find((obj) => obj.name === value.category)
                                                                    const colorname = piechart.find((obj) => obj.name === value.category)

                                                                    return (
                                                                        <View key={key}>

                                                                            <ListTransaction
                                                                                color={themeColors?.card_list_bg}
                                                                                icons={showIcons}
                                                                                charIcon={value.category.charAt(0).toUpperCase()}
                                                                                name={value.category}
                                                                                label={1 < value?.data?.length ? 'Total Transactions' : 'Total Transaction'}
                                                                                labelval={'#' + value?.data?.length}
                                                                                label1={'Amount'}
                                                                                type={'report'}
                                                                                currency={loginfo.currency}
                                                                                label1val={value.amount ? parseFloat(value.amount).toFixed(2) : '0.00'}
                                                                                navigation={value.amount != '0.00' ? 'yes' : 'no'}
                                                                                onClick={() => props.navigation.navigate('ViewTransaction', { rec: value.data, title: value.category, cur: loginfo.currency, info: loginfo, icons: showIcons })}
                                                                            />
                                                                        </View>

                                                                    )


                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </View> : <View>
                                                <NoRecord />
                                            </View>
                                        }

                                    </ScrollView>

                                </View>






                            </View>
                    }







                </View>
            </GradientBackground>

        )
    }


}
export default SpendingCategories

