import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, Dimensions, FlatList, TouchableOpacity, useWindowDimensions, Image, Platform, Pressable, BackHandler } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { PieChart, } from "react-native-gifted-charts";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import NoRecord from "../../../../component/NoRecord";
import { useBackHandler } from "@react-native-community/hooks";
import { Dropdown } from "react-native-element-dropdown";
import getStyles from "../../../../styles";
import { getFontSize } from "../../../../../constants/Font";
import Filter from "../../../../component/Filter";
import { BottomContext } from "../../../../../context/BottomContext";
import { fontsFamily } from "../../../../../constants/fontsFamily";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import Entypo from 'react-native-vector-icons/Entypo';
import ListTransaction from "../../../../component/ListTransaction";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import XLSX from "xlsx";
import { dropdownacc } from "../../../../../utill/Utills";

function TagTrasaction(props) {

    const reportName = props.route.params.name
    const [isReport, setisReport] = useState(false)
    const [user, setuser] = useState('')
    const [account, setaccount] = useState([])
    const [piechart, setpiechart] = useState([])
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
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [transName, setTransName] = useState('')
    const colors = ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#ead1dc', '#E6E6FA', '#FFE4E1', '#D2B48C', '#DEB887', '#F5DEB3', '#FFB6C1', '#DDA0DD',
        '#87CEFA', '#AFEEEE', '#BDB76B', '#FFA07A', '#F0E68C', '#20B2AA', '#D8BFD8',
        '#FAEBD7', '#BC8F8F', '#778899', '#808080', '#FFEBCD', '#DB7093', '#F4A460'
    ]

    const [chart, setChart] = useState([])
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
    const [icon, seticon] = useState([])
    const [groupResult, setgroupResult] = useState([])
    const [request, setrequest] = useState(false)
    const [isFilter, setIsFilter] = useState(false)
    const [timeLine, setSelectTimeLine] = useState('-1')
    const [oldMonth1, setOldmonth1] = useState('')
    const [monthChart, setmonthChart] = useState([])
    const [monthList, setMonthList] = useState([])
    const [accId, setaccId] = useState('')
    const [aplybtn, setaplybtn] = useState(false)
    const [clrbtn, setclrbtn] = useState(false)
    const [pageload, setpageload] = useState('')
    const [apival, setapival] = useState('')
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const dispatch = useDispatch()
    const { records } = useSelector((state) => state.statement);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const { storedata, storeloading, storeerror } = useSelector((state) => state.auth);
    const { descripiondata, descriptionloading, descriptionerror } = useSelector((state) => state.tagdescription);
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
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
        setdateRange(false)
        setclrbtn(false)
    }

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

    function formatDate1(date) {
        const df = moment(date).format('MMMM - YYYY')
        return df

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

    const exportTransactionsToExcel = async (transaction) => {
        try {
            const rows = [];
            const categoryReport = transaction

            categoryReport.forEach((group) => {
                // Summary row
                rows.push({
                    Month: group.date,
                    Tagname: group.name,
                    Tagtype: group.type,
                    ["Amount" + "( " + loginfo.currency + " )"]: group.amount,
                });

            });

            const ws = XLSX.utils.json_to_sheet(rows);

            ws["!cols"] = [
                { wch: 15 }, // Month
                { wch: 18 }, // No.of.Transaction
                { wch: 20 }, // Category
                { wch: 10 }, // Code
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

    const onValueChange = (selectedDate) => {
        setShow(false)
        setdisDate(formatDate1(selectedDate))
        setfDate(apiDate(selectedDate));
        setdateRange(true)
    }


    useEffect(() => {
        if (0 < statements.length && currentMonth) {
            var begin = ''
            var end = ''
            if (dateRange) {
                begin = CommonFunction.getDate(fDate).begin
                end = CommonFunction.getDate(fDate).end
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
            bardata = getTagchart(ch)
            listdata = getTagList(ch)
            setRecord(bardata)
            setList(listdata)
            setchval('')
        }

    }, [statements, currentMonth, accId, chval])

    const createReport = (transactions) => {
        const tagtrans = tagdata.records.reduce((acc, value) => {
            const checkdesc = descripiondata.records.find(obj => obj.tag_id === value._id);

            if (!checkdesc) return acc;

            const matchedTransactions = transactions.filter(subvalue =>
                checkdesc.tags.some(obj => obj.id === subvalue.description)
            );

            if (matchedTransactions.length === 0) return acc;

            // Group by date + type
            const grouped = matchedTransactions.reduce((map, tx) => {
                const date = tx.transacted_at;
                const key = `${date}_${tx.type}`;
                if (!map[key]) map[key] = { amount: 0, date, type: tx.type };
                map[key].amount += tx.amount || 0;
                return map;
            }, {});

            // Push one object per (date, type)
            Object.values(grouped).forEach(item => {
                acc.push({
                    date: formatDate1(item.date),
                    type: item.type,
                    name: value.tagname,
                    amount: item.amount
                });
            });

            return acc;
        }, []);

        return tagtrans

    };

    const getTagchart = (transacion) => {

        const tagtrans = tagdata.records.reduce((acc, value) => {
            const checkdesc = descripiondata.records.find(obj => obj.tag_id === value._id);

            if (!checkdesc) return acc; // skip if no match

            const matchedTransactions = transacion.filter(subvalue =>
                checkdesc.tags.some(obj => obj.id === subvalue.description)
            );

            const totalAmount = matchedTransactions.reduce(
                (sum, tx) => sum + (tx.amount || 0),
                0
            );

            if (totalAmount > 0) {
                acc.push({
                    name: value.tagname,
                    amount: totalAmount
                });
            }

            return acc;
        }, []);


        const resultbar = getPiechart(tagtrans)
        return resultbar



    };

    const getPiechart = (trans) => {
        const barData = [];
        for (let i = 0; i < trans.length; i++) {
            var j = i > 30 ? i - 30 : i;
            const obj1 = {
                name: trans[i].name,
                value: trans[i].amount,
                color: colors[j],
                text: loginfo.currency + ' ' + colors[i]
            };

            barData.push(obj1);
        }

        return barData;
    };

    const getTagList = (transactions) => {
        // const result = {};

        // transactions.forEach(tx => {
        //     if (!result[tx.category]) {
        //         result[tx.category] = {
        //             category: tx.category,
        //             amount: 0,
        //             data: []
        //         };
        //     }

        //     // Add amount (only for debit type, if required)
        //     result[tx.category].amount += tx.amount;
        //     result[tx.category].data.push(tx);
        // });

        // // Convert object values to array if you need a list
        // return Object.values(result);
    };

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

    const applyBtn = (data) => {
        if (dateRange) {
            setchval('1')
        }
        setIsFilter(false)

    }

    const clearBtn = () => {
        setdateRange(false)
        setclrbtn(true)
        getDetails()
    }

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
                    <CommonHeader title={props.route.params.name} back={'yes'} onBackPress={() => props.navigation.navigate('Insights', { screen: 'categories' })} />

                    {
                        loading ?
                            <Loader
                                label={'Loading...'} /> :
                            <View style={[styles.container]}>
                                <View style={[{ marginEnd: 10, borderRadius: 8, marginTop: 10, padding: 10 }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                        <View style={{ flex: 2, top: 3 }}>
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
                                            <MaterialCommunityIcons name="tune" size={25} color={themeColors?.white} />
                                        </TouchableOpacity>


                                        {
                                            0 < record.length ? <TouchableOpacity style={styles.downloadbackground} onPress={() => {

                                                exportTransactionsToExcel(excelreport)
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


                                    {
                                        dateRange ?
                                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                                <Text style={{ color: themeColors?.dark, fontFamily: fontsFamily.mediumFont, fontSize: 16 }}>{disDate}</Text>
                                            </View> :
                                            <View style={styles.insightsMonthContainer}>
                                                <View style={[styles.insightsMonthbg, { flexDirection: 'row', paddingStart: 15, paddingEnd: 15 }]}>


                                                    {
                                                        apiDate(firstTrans) === apiDate(currentMonth) ?
                                                            <View style={{ top: 2 }}>
                                                                <Entypo name="chevron-left" size={20} color={themeColors?.bglight} />
                                                            </View> :
                                                            <TouchableOpacity style={{ top: 2 }} onPress={decrementMonth}>
                                                                <Entypo name="chevron-left" size={20} color={themeColors?.bg_light_text} />
                                                            </TouchableOpacity>
                                                    }






                                                    <View style={{ alignItems: 'center', justifyContent: 'center', marginStart: 15, marginEnd: 15 }}>
                                                        <Text style={[styles.daterangeincreaseDecrease]}>{'1st - ' + endDate + changelable(endDate) + " " + displayDate(currentMonth) + " " + getYear(currentMonth)}</Text>
                                                    </View>



                                                    {
                                                        balanceDay(currentMonth) == 'before' ?
                                                            <TouchableOpacity style={{ top: 2 }} onPress={incrementMonth}>
                                                                <Entypo name="chevron-right" size={20} color={themeColors?.bg_light_text} />
                                                            </TouchableOpacity> :
                                                            <View style={{ top: 2 }}>
                                                                <Entypo name="chevron-right" size={20} color={themeColors?.bglight} />
                                                            </View>

                                                    }

                                                </View>
                                            </View>



                                    }


                                </View>


                                {
                                    0 < record.length ?
                                        <ScrollView>
                                            <View style={[, { marginStart: 10, marginEnd: 10, borderRadius: 8, marginTop: 10, padding: 10, backgroundColor: themeColors?.cardbg }]}>
                                                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <PieChart
                                                            radius={100}
                                                            data={record}
                                                            toggleFocusOnPress onPress={(data) => CommonFunction.message(data.name + " : " + loginfo?.currency + parseFloat(data.value).toFixed(2))} />
                                                    </View>


                                                </View>

                                                <View style={{ marginStart: 20 }}>
                                                    <FlatList
                                                        data={record}
                                                        keyExtractor={(item, index) => index}
                                                        numColumns={2}
                                                        renderItem={({ item, index }) => {

                                                            return (
                                                                <View style={{ flex: 1, flexGrow: 1 }}>
                                                                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                                                        <View style={{ height: 15, width: 15, backgroundColor: item.color, borderRadius: 100 }}></View>
                                                                        <View style={{ marginStart: 5, bottom: 2 }}>
                                                                            <Text style={[styles.reportText, { fontSize: getFontSize(14) }]}>{item.name}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            )
                                                        }}
                                                    />
                                                </View>
                                            </View>

                                            {
                                                0 < record.length &&
                                                <View style={[, { marginStart: 10, marginEnd: 10, borderRadius: 8, padding: 10, marginTop: 10 }]}>
                                                    <View>
                                                        <Text style={styles.listTitle}>List of Tag Transaction</Text>
                                                        <View style={{ marginTop: 10 }}>

                                                            {
                                                                0 < record.length &&
                                                                record.map((value, key) => {
                                                                    return (
                                                                        <View key={key}>
                                                                            <ListTransaction
                                                                                color={themeColors?.card_list_bg}
                                                                                name={value.name}
                                                                                label={1 < value?.count ? "Total Transactions" : 'Total Transaction'}
                                                                                labelval={value?.count}
                                                                                label1={'Amount'}
                                                                                type={'report'}
                                                                                currency={loginfo.currency}
                                                                                label1val={value.value ? parseFloat(value.value).toFixed(2) : '0.00'}


                                                                            />
                                                                        </View>

                                                                    )


                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                </View>

                                            }
                                        </ScrollView> :
                                        <View style={{ flex: 1 }}>
                                            <NoRecord />
                                        </View>

                                }
                            </View>
                    }

                </View>
            </GradientBackground>
        )
    }


}
export default TagTrasaction