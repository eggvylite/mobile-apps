import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from "moment";
import { ScrollView } from "react-native-virtualized-view";
import CommonFunction from "../../../../../utill/CommonFunction";
import Loader from "../../../../component/Loader";
import { useIsFocused } from '@react-navigation/native'
import NoRecord from "../../../../component/NoRecord";
import { useBackHandler } from "@react-native-community/hooks";
import { Dropdown } from "react-native-element-dropdown";
import getStyles from "../../../../styles";
import DoubleBarChart from "../../../../component/DoubleBarChart";
import Filter from "../../../../component/Filter";
import { BottomContext } from "../../../../../context/BottomContext";
import GradientBackground from "../../../../component/GradientBackground";
import CommonHeader from "../../../../component/CommonHeader";
import Entypo from 'react-native-vector-icons/Entypo';
import BudgetBar from "../../../../component/BudgetBar";
import { useDispatch, useSelector } from "react-redux";
import XLSX from "xlsx";
import RNFS from "react-native-fs";
import FileViewer from 'react-native-file-viewer';
import { dropdownacc } from "../../../../../utill/Utills";
import { getLoginInfo } from "../../../../../service/storage";


function BudgetVariance(props) {
    const [currentMonth, setCurrentMonth] = useState();
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [month, setmonth] = useState('')
    const [endDate, setendDate] = useState('')
    const [date, setDate] = useState(new Date());
    const [loginfo, setloginfo] = useState('')
    const [loading, setloading] = useState(false)
    const [record, setRecord] = useState('')
    const [icon, seticon] = useState([])
    const [isFilter, setIsFilter] = useState(false)
    const [timeLine, setSelectTimeLine] = useState('')
    const [disDate, setdisDate] = useState('')
    const [disDate1, setdisDate1] = useState('')
    const [fDate, setfDate] = useState('')
    const [toDate, setoDate] = useState('')
    const [dateRange, setdateRange] = useState(false)
    const [account, setaccount] = useState([])
    const [firstTrans, setFirstTrans] = useState('')
    const [file, setfile] = useState('')
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);
    const [clrbtn, setclrbtn] = useState(false)
    const { enableMenu, disableMenu } = useContext(BottomContext);
    const now = new Date();
    const { records } = useSelector((state) => state.statement);
    const { menudata, reportmenu, settingcms,icons } = useSelector((state) => state.menuicons);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);
    const [categoryBudget, setCategorybudget] = useState([])
    const [selectdefultaccount, setdefulaccount] = useState('')
    const [accoundata, setaccountdata] = useState([]);
    const dispatch = useDispatch();
    const [getxlreportdata, setxlreportdata] = useState([])
    const [selectdefultbank, setdefutbank] = useState('')
    const [chval, setchval] = useState(false)
    const [list, setList] = useState([])
    const reportName = 'BudgetVariance'
    const [tagbgdata, setTagbgdata] = useState([])
    const [accId, setaccId] = useState('')
    const [statements, setStatements] = useState([])
    const [excelreport, setExcelreport] = useState([])
    const { budgetcategorydata } = useSelector((state) => state.budgetcategory);
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
    const [category, setCategory] = useState([])
    const [defbankid, setDefbankid] = useState('')


    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = async () => {
        const userinfo = await getLoginInfo()
        setloginfo(userinfo)
        setendDate(monthend(new Date(props.route.params.date)))
        setfDate(props.route?.params?.date ? apiDate(props.route?.params?.date) : apiDate(monthName))
        setoDate(props.route?.params?.date ? apiDate(props.route?.params?.date) : apiDate(new Date()))
        setdisDate(props.route?.params?.date ? formatDate1(props.route?.params?.date) : formatDate1(new Date()))
        setdisDate1(props.route?.params?.date ? formatDate1(props.route?.params?.date) : formatDate1(new Date()))
        setCurrentMonth(new Date(props.route?.params?.date))
        setdateRange(false)
        setclrbtn(false)
    }


    useEffect(() => {
        if (0 < defaccount.length) {

            const acc = dropdownacc(defaccount)
            var defaccid = defaccount.find((obj) => obj.account_default === 'Yes')
            setDefbankid(defaccid.bank_id)
            setaccId(defaccid.guid)
            setaccountdata(acc)

        }

    }, [defaccount])

    useEffect(() => {
        if (records) {
            const accountrans = records.filter(item =>
                item.account_guid === accId && item.bank_id === defbankid && item.type === 'DEBIT'
            )

            console.log('test 1')
            var firstdata = accountrans[accountrans.length - 1]
            setFirstTrans(firstdata?.transacted_at)
            setStatements(accountrans)
            setCategory(categorydata.records)

            if (firstdata || budgetcategorydata || descripiondata) {
                const updated = budgetcategorydata?.records.flatMap(value =>
                    value.categories.map(subvalue => ({
                        ...subvalue,
                        history: fillMonthlyBudgetsFromFirst(
                            subvalue.history,
                            firstdata?.transacted_at
                        )
                    }))
                );

                setCategorybudget(updated)
            }



        }


    }, [records, accId, budgetcategorydata])




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
            var exceldata = []


            bardata = getBudgetchart(ch)
            listdata = getBudgetlist(ch)
            setExcelreport(exceldata)
            setRecord(bardata?.bardata)
            setList(listdata)
            setchval('')
        }

    }, [statements, currentMonth, accId, timeLine, chval])


    const getBudgetchart = (transactions) => {
        const catarr = [];
        const budgetarr = [];
        const spendarr = [];
        const isTagArr = [];

        const catarr1 = [];
        const budgetarr1 = [];
        const spendarr1 = [];
        const isTagArr1 = [];

        const statement = transactions.filter((obj) => obj.type === 'DEBIT');

        category.forEach(cat => {
            const catName = cat.category;

            const budgetObj = categoryBudget?.find(b => b.id === cat._id);

            const budgetamt = budgetObj?.history.find(h => h.Month === apiDate(currentMonth))?.budget || 0;
            const totalSpend = statement
                .filter(tx => tx.top_level_category === catName)
                .reduce((sum, tx) => sum + (tx.amount || 0), 0);

            if (totalSpend > 0) {
                catarr.push(catName);
                budgetarr.push(budgetamt);
                spendarr.push(totalSpend);
                isTagArr.push(false); // category

                catarr1.push(catName);
                budgetarr1.push(budgetamt);
                spendarr1.push(totalSpend);
                isTagArr1.push(false); // category

            }
        });





        // tag.forEach(data => {
        //     const budgetObj = tagbgdata.find(obj => obj.tag_id === data._id);
        //     if (!budgetObj) return;

        //     const budgetamt = budgetObj?.history.find(h => h.Month === apiDate(date))?.budget || 0;


        //     const totalSpend = statement
        //         .filter(tx =>
        //             budgetObj.tags?.some(tagItem => tagItem.id === tx.description)
        //         )
        //         .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        //     if (totalSpend > 0) {
        //         catarr.push(data.tagname);
        //         spendarr.push(totalSpend.toFixed(2)); // format as string with 2 decimals
        //         budgetarr.push(budgetamt);
        //         isTagArr.push(true); //
        //     }
        // });



        const obj = {
            bardata: getBarData(catarr, budgetarr, spendarr, isTagArr),
            bardata1: [],
        }
        return obj;

    }

    const getBudgetlist = (transactions) => {
        const currentMonthStr = apiDate(currentMonth);

        // 1. Category-level data
        const categoryList = category.map(cat => {
            const budgetObj = categoryBudget?.find(b => b.id === cat._id);
            const budgetamt = budgetObj?.history.find(h => h.Month === currentMonthStr)?.budget || 0;

            const totalSpend = transactions
                .filter(tx => tx.top_level_category === cat.category)
                .reduce((sum, tx) => sum + (tx.amount || 0), 0);

            return {
                name: cat.category,
                budget: budgetamt,
                spend: totalSpend,
                id: budgetObj?.category_id || ''
            };
        });

        // // 2. Tag-level data
        // const tagList = tag
        //     .map(data => {
        //         const budgetObj = tagbgdata.find(b => b.tag_id === data._id);
        //         if (!budgetObj) return null;

        //         const totalSpend = transactions
        //             .filter(tx =>
        //                 budgetObj.tags?.some(tagItem => tagItem.id === tx.description)
        //             )
        //             .reduce((sum, tx) => sum + (tx.amount || 0), 0);

        //         const budgetamt = budgetObj?.history.find(h => h.Month === currentMonthStr)?.budget || 0;

        //         return {
        //             name: data.tagname + '123',
        //             budget: budgetamt,
        //             spend: totalSpend,
        //             id: budgetObj?.tag_id || ''
        //         };
        //     })
        //     .filter(Boolean); // remove nulls

        // // Merge both lists
        // const mergedList = [...categoryList, ...tagList];

        // // Optional: sort by spend descending
        // mergedList.sort((a, b) => b.spend - a.spend);

        return categoryList;
    };

    const getBarData = (labels, income, expense, istagArr) => {
        const barData = [];
        for (let i = 0; i < labels.length; i++) {
            const obj1 = {
                value: parseFloat(income[i] ? income[i] : 0),
                label: labels[i],
                type: 'Budget',
                spacing: 0,
                frontColor: themeColors.chartincome,
            };
            const obj2 = {
                value: parseFloat(expense[i] ? expense[i] : 0),
                type: 'Actual',
                lab: labels[i],
                frontColor: themeColors.chartexpenses,
            };
            barData.push(obj1, obj2)
        }
        return barData;
    };


    function fillMonthlyBudgetsFromFirst(history, fdate) {
        if (!fdate) return [];

        const sorted = [...(history || [])].sort(
            (a, b) => new Date(a.Month + "-01") - new Date(b.Month + "-01")
        );

        const res = [];
        let loop = new Date(fdate);
        loop.setDate(1);

        let lastBudget = 0;
        let lastSetDate = null;
        let lastUpdateDate = null;
        let started = false;

        // const monthadd = moment(date).add(2,'month')
        const currentDate = new Date().toISOString();


        while (loop <= new Date()) {
            const monthStr = `${loop.getFullYear()}-${String(loop.getMonth() + 1).padStart(2, "0")}`;

            const found = sorted.find(item => item.Month === monthStr);

            if (found && Number(found.budget) > 0) {
                lastBudget = Number(found.budget);
                lastSetDate = found.setdate || currentDate;
                lastUpdateDate = found.updatedate || currentDate;
                started = true;
            }

            res.push({
                Month: monthStr,
                budget: started ? lastBudget : 0,
                setdate: started ? lastSetDate : null,
                updatedate: started ? lastUpdateDate : null
            });

            loop.setMonth(loop.getMonth() + 1);
        }

        return res;
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


    const formatDate = (date) => {
        const format = moment(date).format(loginfo.format)
        return format
    }


    const monthend = (date) => {
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const getDate = moment(end).format("DD")
        changelable(getDate)
        return getDate

    }

    const onValueChange = (selectedDate) => {
        setShow(false)
        setdisDate(formatDate1(selectedDate))
        setfDate(apiDate(selectedDate));
        setdateRange(true)
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



    const applyBtn = (data) => {

        if (dateRange) {
            setchval('1')
        }
        setIsFilter(false)

    }

    const clearBtn = () => {
        console.log('hello')
        setdateRange(false)
        setclrbtn(true)
        getDetails()
    }





    const filterBack = () => {
        if (dateRange) {
            setdisDate(formatDate1(new Date(timeLine)))
            setDate(new Date(timeLine))
            setmonth(apiDate(new Date(timeLine)))
            setfDate(apiDate(new Date(timeLine)))
        } else {
            setdisDate(formatDate1(new Date()))
            setfDate(apiDate((new Date())))
            setDate(new Date());
            setmonth(apiDate(new Date()))
        }
        setIsFilter(false)
        setShow(false)
    }




    const backActionHandler = () => {
        props.route.params?.screen ? props.navigation.goBack() : props.navigation.navigate('Insights', { screen: 'categories' })
        return true;
    };

    useBackHandler(backActionHandler)


    function formatDate1(date) {
        const df = moment(date).format('MMMM - YYYY')
        return df

    }



    const apiDate = (date) => {


        const df = moment(new Date(date)).format("YYYY-MM")
        return df
    }

    const apiDate1 = (date) => {


        const df = moment(new Date(date)).format("YYYY-MM")
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

    const variance = (budget, total) => {
        if (budget === 0) {

            return parseFloat(0).toFixed(2)
        } else {
            return Math.abs(parseFloat(budget - total || 0)).toFixed(2)
        }

    }



    const getYear = (date) => {
        const df = moment(new Date(date)).format("YYYY")
        return df
    }



    const createReport = (transactions) => {

        let acc = [];

        transactions.forEach((item) => {
            if (item?.spend > 0) {
                acc.push({
                    date: item.date,
                    category: item.category,
                    Budget: item.budget,
                    spend: item.spend,
                    variance: item.spend < item.budget ? item.budget - item.spend : 0,
                    istag: item?.istag

                });
            }
        });

        return acc
    };


    const getPercentage = (spend, budget) => {
        if (!budget || budget === 0) return 0;
        return Math.min(100, Math.round((spend / budget) * 100));
    };


    const exportTagTransactionsToExcel = async (transactions, reportName) => {
        const loginfo = await getLoginInfo()
        const currency = loginfo?.currency || "";



        try {
            const weeklyReport = [...(transactions || [])].reverse();


            const rows = weeklyReport.flatMap((week) => {

                const summaryRow = {
                    Month: week?.date || "N/A",
                    Category: !week?.istag && week?.category || "N/A",
                    TagName: week?.istag && week?.category || "N/A",

                    [`Spend ${currency}`]: week?.spend || 0,
                    [`Budget ${currency}`]: week?.Budget || 0,
                    [`variance ${currency}`]: week?.variance || 0,

                };

                return [summaryRow];
            });

            const ws = XLSX.utils.json_to_sheet(rows);


            ws["!cols"] = [
                { wch: 20 }, // Month
                { wch: 20 }, // No.of.Transaction
                { wch: 20 }, // No.of.Transaction
                { wch: 20 }, // Total Amount
                { wch: 20 }, // Date
                { wch: 20 }, // Date

            ]

            // ✅ Workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Transactions");

            // ✅ Write file
            const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
            const filePath = `${RNFS.DocumentDirectoryPath}/${reportName}.xlsx`;

            await RNFS.writeFile(filePath, wbout, "base64");
            await FileViewer.open(filePath, { showOpenWithDialog: true });
        } catch (error) {
            console.error("❌ Error exporting Excel:", error);
        }
    };




    if (isFilter) {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title="Filter" back={'yes'} onBackPress={() => { filterBack(), enableMenu() }} />
                    <View style={[styles.container, { backgroundColor: themeColors.white }]}>

                        <Filter
                            disDate={disDate}
                            timeLine={'7'}
                            type={'variance'}
                            chaCancel={(res) => setclrbtn(false)}
                            firstTrans={firstTrans}
                            onApplyClk={(result) => applyBtn(result)}
                            onCancelClk={(res) => clearBtn(res)}
                            changeFdatevalue={(rec) => onValueChange(rec)}
                        />


                    </View>

                </View>
            </GradientBackground>

        )

    } else {
        return (
            <GradientBackground>
                <View style={styles.container}>
                    <CommonHeader title={props.route.params.name} back={'yes'} onBackPress={() => {
                        if (props.route.params?.screen) {
                            props.navigation.goBack()
                        } else {
                            props.navigation.navigate('Insights', { screen: 'categories' })
                        }
                    }} />
                    {
                        loading ?
                            <Loader
                                label={'Loading...'}
                            /> :
                            <View style={[styles.container]}>
                                <View style={[{ marginEnd: 5, marginTop: 10, padding: 10 }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                                        <View style={{ flex: 2, top: 3,marginEnd:10 }}>
                                            <Dropdown
                                                data={accoundata}
                                                value={accId}
                                                labelField="type"
                                                valueField="guid"
                                                itemTextStyle={{ color: themeColors?.dark }}
                                                style={[styles.dropdownreport,{borderRadius:8}]}
                                                iconColor={themeColors?.bg_light_text}
                                                selectedTextStyle={styles.reportDropText}
                                                onChange={item => {
                                                    if (accId !== item.guid) {
                                                        setaccId(item.guid)
                                                    }
                                                }}
                                            />
                                        </View>
                                        <TouchableOpacity style={[styles.filterBackground]} onPress={() => setIsFilter(false)}>
                                            <MaterialCommunityIcons name="tune" size={25} color={themeColors?.white} />
                                        </TouchableOpacity>


                                        {
                                            0 < getxlreportdata?.length ? <TouchableOpacity style={styles.downloadbackground} onPress={() => {

                                                exportTagTransactionsToExcel(getxlreportdata, reportName)
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

                                {
                                    dateRange ?
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                                            <Text style={styles.daterangeincreaseDecrease}>{disDate}</Text>
                                        </View> :
                                        <View style={styles.insightsMonthContainer}>
                                            <View style={[styles.insightsMonthbg, { flexDirection: 'row', paddingStart: 15, paddingEnd: 15 }]}>


                                                {
                                                    apiDate(firstTrans) === apiDate(currentMonth) ?
                                                        <View>
                                                            <Entypo name="chevron-left" size={20} color={themeColors?.bglight} />
                                                        </View> :
                                                        <TouchableOpacity onPress={decrementMonth}>
                                                            <Entypo name="chevron-left" size={20} color={themeColors?.bg_light_text} />
                                                        </TouchableOpacity>
                                                }


                                                <View style={{ alignItems: 'center', marginStart: 15, marginEnd: 15 }}>
                                                    <Text style={styles.daterangeincreaseDecrease}>{'1st - ' + endDate + changelable(endDate) + " " + displayDate(currentMonth) + " " + getYear(currentMonth)}</Text>
                                                </View>

                                                {
                                                    balanceDay(currentMonth) == 'before' ?
                                                        <TouchableOpacity onPress={incrementMonth}>
                                                            <Entypo name="chevron-right" size={20} color={themeColors?.bg_light_text} />
                                                        </TouchableOpacity> :
                                                        <View>
                                                            <Entypo name="chevron-right" size={20} color={themeColors?.bglight} />
                                                        </View>

                                                }


                                            </View>
                                        </View>



                                }




                                {
                                    0 < record?.length && 0 < record?.length ?
                                        <ScrollView>


                                            <View style={[{ marginTop: 5, margin: 5, backgroundColor: themeColors?.cardbg, padding: 15 }]}>

                                                <DoubleBarChart
                                                    type={'report'}
                                                    currency={loginfo.currency}
                                                    label1={'Budget'}
                                                    label2={'Actual'}
                                                    data={record}
                                                />




                                            </View>



                                            {
                                                0 < list.length &&
                                                <View style={{ marginStart: 10, marginTop: 20, marginEnd: 10 }}>
                                                    <View>
                                                        <Text style={styles.listTitle}>BUDGETS</Text>
                                                        {
                                                            list.map((value, key) => {
                                                                const iconview = icons.find((obj) => obj.name === value.name)
                                                                if (0 < value.spend) {

                                                                    return (
                                                                        <View key={key}>
                                        
                                                                            <BudgetBar
                                                                                color={themeColors?.card_list_bg}
                                                                                icon={iconview}
                                                                                category={value.name}
                                                                                budget={value.budget}
                                                                                spent={value?.spend}
                                                                                bottomStartlabel={'Actual: ' + loginfo.currency + value.spend.toFixed(2)}
                                                                                bottomEndlabel={'Variance: ' + loginfo.currency + variance(value.budget, value.spend)}
                                                                                toplabel={'Budget: ' + loginfo.currency + parseFloat(value.budget || 0).toFixed(2)}

                                                                            />
                                                                        </View>

                                                                    )


                                                                }


                                                            })
                                                        }

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

                </View >
            </GradientBackground>

        )
    }






}

export default BudgetVariance

