import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, FlatList, BackHandler, Dimensions, ScrollView, Platform, Image } from "react-native";
import CommonFunction from "../../../../utill/CommonFunction";
import HeaderMenu from "../../../component/HeaderMenu";
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { BarChart } from 'react-native-gifted-charts';
import BarChartDiagram from "../../../component/BarChartDigram";
import { PieChart, } from "react-native-gifted-charts";
import Loader from "../../../component/Loader";
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getStyles from "../../../styles";
import { getFontSize } from "../../../../constants/Font";
import InsightsTransactionContainer from "../insights/InsightsTransactionContainer";
const { width, height } = Dimensions.get('window');
import { useDispatch, useSelector } from 'react-redux';
import { fontsFamily } from "../../../../constants/fontsFamily";
import GradientBackground from "../../../component/GradientBackground";
import CommonHeader from "../../../component/CommonHeader";
import ChoosePlan from "../../../component/ChoosePlan";
import { fetchChoosePlan } from "../../../../redux/slices/choosePlanSlice";
import { fetchactivePlan } from "../../../../redux/slices/activePlanSlice";
import Plan from "../../../component/Plan";
import Statusbar from "../../../component/Statusbar";
import { getTransactionsForMonth, splitWeeklyReport } from "../../../../constants/content";
import NoRecord from "../../../component/NoRecord";
import CommonHead from "../../../component/CommonHead";
import { CommandIcon } from "lucide-react-native";
import { fetchTag } from "../../../../redux/slices/tagSlice";
import { fetchTagdescription } from "../../../../redux/slices/tagdescriptionSlice";
import ConnectBank from "../connect_bank_account/ConnectBank";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { appuseBackHandler } from "../../../../utill/appuseBackHandler";
import { getLoginInfo } from "../../../../service/storage";
import { imgApi } from "../../../../service/environment";


function Insights(props) {
    const [menubar, setmenubar] = useState(false)
    const [isVisbleamt, setisVisibleamt] = useState(false)
    const [amt, setamt] = useState('')
    const [trabtn, settrabtn] = useState(true)
    const [catbtn, setcatbtn] = useState(false)
    const [loginfo, setloginfo] = useState('')
    const [chart, setChart] = useState([])
    const [record, setRecord] = useState([])
    const [load, setload] = useState(false)
    const [spmonth, setspmonth] = useState([])
    const [btnName, setbtnName] = useState('')
    const now = new Date();
    const isFocused = useIsFocused()
    const [menu, setmenu] = useState('')
    const scrollref = React.useRef()
    const params = props.route.params?.screen
    var imgURL = imgApi + 'content/original/'
    const dispatch = useDispatch();
    const { plandata, planeerror } = useSelector((state) => state.chooseplan);
    const [selectedBar, setSelectedBar] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const barWidth = 30;
    const spacing = 20;
    const chartHeight = height * 0.3
    const { themedata } = useSelector((state) => state.appcolor);
    const themeColors = themedata.theme
    var { styles, geticonSize, textColor, } = getStyles(themeColors);
    const [isPlanpage, setIsplanPage] = useState(false)
    const [incomeEx, setincomeEx] = useState([])
    const [accId, setaccId] = useState('')
    const [trasactionDetails, setTransactionDetails] = useState('')
    const { descripiondata, descriptionloading, descriptionerror } = useSelector((state) => state.tagdescription);
    const { categorydata, categoryloading, categoryerror } = useSelector((state) => state.category);
    const { tagdata, tagloading, tagerror } = useSelector((state) => state.taglist);
    const { reportmenu, insights, report, settingcms } = useSelector((state) => state.menuicons);
    const { cusDetails, cusloading, cuserror } = useSelector((state) => state.customer);
    const { storedata } = useSelector((state) => state.auth);
    const [defbankid, setDefbankid] = useState('')
    const [categoryBudget, setCategorybudget] = useState([])
    const [category, setCategory] = useState([])
    const [tagmodal, setIstagmodal] = useState(false)
    const [isbudget, setIsbudget] = useState(false)
    const [tag, setTag] = useState([])
    const [tagbgdata, setTagbgdata] = useState([])
    const [statements, setStatements] = useState([])
    const { records } = useSelector((state) => state.statement);
    const [isConnect, setIisConnect] = useState(false)
    const { budgetcategorydata } = useSelector((state) => state.budgetcategory);


    const { getaccountdata, getaccount, getaccountloading, getaccounterror, networth } = useSelector((state) => state.getaccount);
    const { accountdata, accountloading, defaccount, accounterror } = useSelector((state) => state.account);



    const colors = ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#ead1dc', '#E6E6FA', '#FFE4E1', '#D2B48C', '#DEB887', '#F5DEB3', '#FFB6C1', '#DDA0DD',
        '#87CEFA', '#AFEEEE', '#BDB76B', '#FFA07A', '#F0E68C', '#20B2AA', '#D8BFD8',
        '#FAEBD7', '#BC8F8F', '#778899', '#808080', '#FFEBCD', '#DB7093', '#F4A460'
    ]

    useEffect(() => {
        getDetails()
        setload('1')

    }, [isFocused])



    appuseBackHandler(() => {
        props?.navigation.goBack();
        return true;
    });

    const getDetails = async () => {
        var store = await getLoginInfo()
        bankConnect(store)



        if (!tagdata || !descripiondata) {
            dispatch(fetchTag())
            dispatch(fetchTagdescription())
        }
        let arrrid = {};
        if (0 < insights.length) {
            insights.map((value, key) => {
                arrrid[value.id] = { name: value.name, image: value.image, bgcolor: value.bgcolor }
            })
        }


        setmenu(arrrid)
        setRecord(report)
        if (props?.route?.params?.group === '660a49621bdc7febf01948cf' || !props?.route?.params?.group) {
            settrabtn(true)
            setcatbtn(false)
        } else {
            setcatbtn(true)
            settrabtn(false)
        }


    }

    useEffect(() => {
        if (accountdata) {
            if (0 < defaccount?.length) {
                var defaccid = defaccount.find((obj) => obj.account_default === 'Yes')
                setDefbankid(defaccid.bank_id)
                setaccId(defaccid.guid)

                // console.log(defaccid?.guid,'------')
            }
        }

    }, [accountdata])



    const getDate = (date) => {
        let result = {};
        result['begin'] = moment(date).startOf('month').format('YYYY-MM-DD');
        result['end'] = moment(date).endOf('month').format('YYYY-MM-DD');
        return result
    }

    const threemonthdata = (date) => {
        let result = {};
        result['begin'] = moment(date).subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
        result['end'] = moment(date).endOf('month').format('YYYY-MM-DD');
        return result
    }

    const changeformat = (date) => {
        var dt = moment(new Date(date)).format('YYYY-MM-DD');
        return dt
    }

    // function splitWeeklyReport(transactions, month, year) {

    //     const filtered = transactions.filter(tx => {
    //         const d = new Date(tx.transacted_at);
    //         return d.getMonth() + 1 === month && d.getFullYear() === year;
    //     });
    //     const daysInMonth = new Date(year, month, 0).getDate();
    //     const totalWeeks = Math.ceil(daysInMonth / 7);
    //     const report = {};
    //     for (let i = 1; i <= totalWeeks; i++) {
    //         report['week' + i] = { total: 0, credit: 0, debit: 0 };
    //     }

    //     filtered.forEach(tx => {
    //         var type = tx.type.toLowerCase()
    //         const d = new Date(tx.transacted_at);
    //         const week = Math.ceil(d.getDate() / 7);
    //         report['week' + week].total += tx.amount;
    //         report['week' + week][type] += tx.amount;

    //     });

    //     const weeks = Object.keys(report);
    //     const credits = weeks.map(w => report[w].credit);
    //     const debits = weeks.map(w => report[w].debit);
    //     const resultbar = getBarData(weeks, credits, debits, 'incomeex')
    //     return resultbar;
    // }

    const getBarData = (labels, income, expense, type, isTagArr) => {
        const barData = [];


        for (let i = 0; i < labels.length; i++) {
            // const isTag = isTagArr[i];
            const isTag = '';
            const obj1 = {
                value: parseFloat(income[i] ? income[i] : 0),
                label: isTag ? '🏷️ ' + labels[i] : labels[i],
                type: type === 'incomeex' ? 'Income' : 'Budget',
                spacing: 0,
                frontColor: themeColors.chartincome,
            };


            const obj2 = {
                value: parseFloat(expense[i] ? expense[i] : 0),
                type: type === 'incomeex' ? 'Expense' : 'Actual',
                lab: labels[i],
                frontColor: themeColors.chartexpenses,
            };

            barData.push(obj1, obj2)

        }

        return barData;
    };



    useEffect(() => {
        if (records) {
            const transaction = records
            const sdate = transaction[0]?.transacted_at
            const accountrans = records.filter(item =>
                item.account_guid === accId && item.bank_id === defbankid
            )
            var firstdata = accountrans[accountrans.length - 1]
            setStatements(accountrans)
            setCategory(categorydata.records)
            if (tagdata) {
                const debitTag = tagdata.records
                    .filter(value => value.tag_type === 'DEBIT')
                    .map(value => ({
                        ...value
                    }));
                setTag(debitTag)
            }
            if (firstdata || budgetcategorydata || descripiondata) {
                var updated = []
                var updated1 = []
                if (0 < budgetcategorydata?.records?.length) {
                    updated = budgetcategorydata?.records?.flatMap(value =>
                        value.categories.map(subvalue => ({
                            ...subvalue,
                            history: fillMonthlyBudgetsFromFirst(
                                subvalue.history,
                                firstdata?.transacted_at
                            )
                        }))
                    );
                }

                if (0 < descripiondata?.records?.length) {
                    updated1 = descripiondata.records.map(item => ({
                        ...item,
                        history: fillMonthlytagBudgetsFromFirst(item, item.history, firstdata?.transacted_at, updated, transaction, sdate)
                    }));
                }



                setCategorybudget(updated)
                setTagbgdata(updated1)
            }
            setload('')


        }

    }, [accId, records, budgetcategorydata, categorydata, load, defbankid])


    // function fillMonthlyBudgetsFromFirst(history, fdate) {
    //     const sorted = [...history].sort(
    //         (a, b) => new Date(a.Month + "-01") - new Date(b.Month + "-01")
    //     );
    //     const firstBudgetItem = sorted.find(item => item.budget && item.budget !== 0);
    //     const initialBudget = firstBudgetItem ? firstBudgetItem.budget : 0;
    //     const res = [];
    //     let loop = new Date(fdate);
    //     let lastBudget = initialBudget;
    //     while (loop <= now) {

    //         const monthStr = `${loop.getFullYear()}-${String(loop.getMonth() + 1).padStart(2, "0")}`;
    //         const found = sorted.find(item => item.Month === monthStr);
    //         if (found) {
    //             lastBudget = found.budget;
    //         }

    //         res.push({
    //             Month: monthStr,
    //             budget: lastBudget
    //         });
    //         loop.setMonth(loop.getMonth() + 1);
    //     }

    //     return res;
    // }

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

    function fillMonthlytagBudgetsFromFirst(item, history, fdate, category, transacion, sdate) {
        const sorted = [...history].sort(
            (a, b) => new Date(a.Month + "-01") - new Date(b.Month + "-01")
        );
        const res = [];
        if (0 < sorted.length) {
            const firstBudgetItem = sorted.find(item => item.budget && item.budget !== 0);
            const initialBudget = firstBudgetItem ? firstBudgetItem.budget : 0;

            let loop = new Date(fdate);
            let lastBudget = initialBudget;
            while (
                loop.getFullYear() <= now.getFullYear() ||
                (loop.getFullYear() === now.getFullYear() &&
                    loop.getMonth() <= now.getMonth())
            ) {

                const monthStr = `${loop.getFullYear()}-${String(loop.getMonth() + 1).padStart(2, "0")}`;
                const found = sorted.find(item => item.Month === monthStr);
                const updatebgamt = updatebudget(item, monthStr, category, transacion, sdate)
                if (updatebgamt <= found?.budget) {
                    lastBudget = found?.budget
                } else {
                    lastBudget = updatebgamt
                }

                res.push({
                    Month: monthStr,
                    budget: lastBudget
                });
                loop.setMonth(loop.getMonth() + 1);
            }

        }

        return res;
    }

    const updatebudget = (item, monthdate, categorybg, transacion, sdate) => {
        const id = item.tag_id
        var amt = 0

        const destag = descripiondata?.records.find(
            (obj) => obj.tag_id === id
        );

        if (destag?.tags?.length) {

            const statementdat = transacion.filter((obj) =>
                destag.tags.some((tag) => tag.id === obj.description)
            );

            const categorydat = categorydata?.records?.filter((cat) =>
                statementdat.some((st) => st?.top_level_category === cat.category)
            )


            const catbudgetdata = categorybg?.filter((bud) =>
                categorydat.some((cat) => cat?._id === bud.category_id)
            );



            const totalBudgetForMonth = catbudgetdata.reduce((sum, item) => {
                const monthEntry = item.history.find((h) => h.Month === monthdate);
                const num = parseFloat(monthEntry?.budget) || 0;
                return sum + num;
            }, 0);

            if (totalBudgetForMonth) {
                amt = totalBudgetForMonth
            } else {
                amt = 0
            }


            return amt

        } else {
            return amt

        }


    }





    useEffect(() => {
        if (0 < statements.length) {


            const date = statements[0]?.transacted_at
            const begin = threemonthdata(date).begin
            const end = threemonthdata(date).end
            const begin1 = getDate(date).begin
            const end1 = getDate(date).end
            // var getmonth = moment(date).format('MM')
            // var getyear = moment(date).format('YYYY')


            const budgetchart = statements.filter(item => {
                const txDate = changeformat(item.transacted_at);
                const matchAccount = item.account_guid === accId
                const matchDate = txDate >= begin1 && txDate <= end1
                return matchAccount && matchDate
            });
            const threemonthstatement = statements.filter(item => {
                const txDate = changeformat(item.transacted_at);
                const matchAccount = item.account_guid === accId
                const matchDate = txDate >= begin && txDate <= end
                return matchDate && matchAccount;
            });
            const atmkeyword = settingcms.atmkeyword.map(w => w.text);
            const nsfkeyword = settingcms.nsfkeyword.map(w => w.text);
            const feekeyword = settingcms.feekeyword.map(w => w.text);
            const loankeyword = settingcms.loankeyword.map(w => w.text);
            const repaykeyword = settingcms.repaykeyword.map(w => w.text);
            const reverseStatement = threemonthstatement?.reverse()

            const atmreport = reverseStatement.filter((item) => atmkeyword.length > 0 && new RegExp(`\\b(${atmkeyword.join("|")})\\b`, "i").test(item.description) && item.type === 'DEBIT');
            const nsfreport = reverseStatement.filter((item) => nsfkeyword.length > 0 && new RegExp(`\\b(${nsfkeyword.join("|")})\\b`, "i").test(item.description) && item.type === 'DEBIT');
            const feereport = reverseStatement.filter((item) => feekeyword.length > 0 && new RegExp(`\\b(${feekeyword.join("|")})\\b`, "i").test(item.description) && item.type === 'DEBIT');
            const loanreport = reverseStatement.filter((item) => loankeyword.length > 0 && new RegExp(`\\b(${loankeyword.join("|")})\\b`, "i").test(item.description) && item.type === 'DEBIT');
            const repayreport = reverseStatement.filter((item) => repaykeyword.length > 0 && new RegExp(`\\b(${repaykeyword.join("|")})\\b`, "i").test(item.description) && item.type === 'DEBIT');

            const bgchart = getBudgetchart(budgetchart, date)





            const atmchat = splitMonthlyReport(atmreport)
            const nsfchat = splitMonthlyReport(nsfreport)
            const feechat = splitMonthlyReport(feereport)
            const loanchat = splitMonthlyReport(loanreport)
            const repaychat = splitMonthlyReport(repayreport)
            const spendchat = getSpendchart(reverseStatement)
            const budgetchat = bgchart.bardata
            const tagchat = getTagChart(statements)
            const incomeEx = monthlyIncomeExReport(reverseStatement)





            // const incomeEx = splitWeeklyReport(incomeExchart, getmonth / 1, getyear / 1)
            var obj = {
                incomechart: incomeEx,
                atmchart: atmchat,
                nsfchart: nsfchat,
                feechart: feechat,
                loanchart: loanchat,
                repaychart: repaychat,
                spendchart: spendchat,
                budgetchart: budgetchat,
                tagchart: tagchat
            }
            setChart(obj)
            const incomeExdetails = {
                total: incomeEx.length,
                credit: incomeEx.filter(tx => tx.type.toLowerCase() === "income").reduce((sum, tx) => sum + tx.value, 0),
                debit: incomeEx.filter(tx => tx.type.toLowerCase() === "expense").reduce((sum, tx) => sum + tx.value, 0),
                date: `${datechangeformat(begin)} - ${datechangeformat(end)}`,
            };
            const atmdetails = (() => {
                if (atmchat.length === 0) {
                    return { total: 0, value: 0, date: null };
                }

                const date = `${datechangeformat(begin)} - ${datechangeformat(end)}`

                const { value } = atmchat.reduce(
                    (acc, tx) => {
                        acc.value += tx.value;
                        return acc;
                    },
                    { value: 0 }
                );

                return {
                    total: atmchat.length,
                    value: parseFloat(value).toFixed(2),
                    date,
                };
            })();




            const nsfdetails = (() => {

                const date = `${datechangeformat(begin)} - ${datechangeformat(end)}`
                if (nsfchat.length === 0) {
                    return { total: 0, value: 0, date: date };
                }




                const { value } = nsfchat.reduce(
                    (acc, tx) => {
                        acc.value += tx.value;
                        return acc;
                    },
                    { value: 0 }
                );

                return {
                    total: nsfchat.length,
                    value: parseFloat(value).toFixed(2),
                    date,
                };
            })();

            const feedetails = (() => {
                if (feechat.length === 0) {
                    return { total: 0, value: 0, date: null };
                }

                const date = `${datechangeformat(begin)} - ${datechangeformat(end)}`

                const { value } = feechat.reduce(
                    (acc, tx) => {
                        acc.value += tx.value;
                        return acc;
                    },
                    { value: 0 }
                );

                return {
                    total: feechat.length,
                    value: parseFloat(value).toFixed(2),
                    date,
                };
            })();

            const loandetails = (() => {
                if (loanchat.length === 0) {
                    return { total: 0, value: 0, date: null };
                }

                const date = `${datechangeformat(begin)} - ${datechangeformat(end)}`
                const { value } = loanchat.reduce(
                    (acc, tx) => {
                        acc.value += tx.value;
                        return acc;
                    },
                    { value: 0 }
                );

                return {
                    total: loanchat.length,
                    value: parseFloat(value).toFixed(2),
                    date,
                };
            })();

            const repaydetails = (() => {
                if (repaychat.length === 0) {
                    return { total: 0, value: 0, date: null };
                }

                const date = `${datechangeformat(begin)} - ${datechangeformat(end)}`
                const { value } = repaychat.reduce(
                    (acc, tx) => {
                        acc.value += tx.value;
                        return acc;
                    },
                    { value: 0 }
                );

                return {
                    total: repaychat.length,
                    value: parseFloat(value).toFixed(2),
                    date,
                };
            })();

            const spendDetails = (() => {
                if (!spendchat || spendchat?.length === 0) {
                    return {
                        mostspend: { name: null, value: 0 },
                        leastspend: { name: null, value: 0 },
                    };
                }
                var date = datechangeformat(begin) + " - " + datechangeformat(end)

                const mostSpending = spendchat?.reduce(
                    (max, item) => (item.value > max.value ? item : max),
                    spendchat?.[0]
                );

                const leastSpending = spendchat?.reduce(
                    (min, item) => (item.value < min.value ? item : min),
                    spendchat?.[0]
                );

                return {
                    mostspend: { name: mostSpending.name, value: mostSpending.value },
                    leastspend: { name: leastSpending.name, value: leastSpending.value },
                    date
                };
            })();
            const budgetDetails = (() => {
                var total = 0
                var budegtamt = 0
                var actulaamt = 0
                total = bgchart.bardata.length,
                    budegtamt = bgchart.bardata?.filter(tx => tx.type === "Budget").reduce((sum, tx) => sum + tx.value, 0)
                actulaamt = bgchart.bardata?.filter(tx => tx.type === "Actual").reduce((sum, tx) => sum + tx.value, 0)
                const dat = dateChangeFormat(date)

                return {
                    total: total,
                    budget: parseFloat(budegtamt).toFixed(2),
                    actual: parseFloat(actulaamt).toFixed(2),
                    date: dat
                }

            })();

            const tagDetails = (() => {
                var totaltag = 0
                var totalamt = 0
                var date = tagchat[0]?.date
                totaltag = tagchat.length
                totalamt = tagchat.reduce((sum, tx) => sum + tx.value, 0)

                return {
                    totaltag: totaltag,
                    totalamount: totalamt,
                    date
                }

            })()




            var obj1 = {
                incomeExdetails: incomeExdetails,
                atmdetail: atmdetails,
                nsfdetails: nsfdetails,
                feedetails: feedetails,
                loandetails: loandetails,
                repaydetails: repaydetails,
                spendetails: spendDetails,
                budgetdetails: budgetDetails,
                tagdetails: tagDetails
            }
            setTransactionDetails(obj1)

        }
    }, [statements])

    const apiDate = (date) => {
        const value = moment(date).format('YYYY-MM')
        return value
    }


    const getTagChart = (transactions) => {
        const matchedTransactions =
            tagdata?.records?.reduce((acc, tag) => {
                const checkdesc = descripiondata?.records?.find(
                    (obj) => obj.tag_id === tag._id
                );
                if (!checkdesc) return acc;

                const matched = transactions.filter((tx) =>
                    checkdesc.tags.some((t) => t.id === tx.description)
                );

                return [...acc, ...matched];
            }, []) ?? [];

        if (matchedTransactions.length === 0) return [];

        // 2️⃣ Group by month
        const groupedByMonth = matchedTransactions.reduce((acc, tx) => {
            const date = new Date(tx.transacted_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!acc[monthKey]) acc[monthKey] = [];
            acc[monthKey].push(tx);

            return acc;
        }, {});

        // 3️⃣ Get latest month transactions
        const latestMonthKey = Object.keys(groupedByMonth).sort((a, b) => (a < b ? 1 : -1))[0];
        const latestTransactions = groupedByMonth[latestMonthKey] ?? [];

        // 4️⃣ Calculate total amount per tag
        const tagSummary = tagdata?.records?.map((tag) => {
            const checkdesc = descripiondata?.records?.find((obj) => obj.tag_id === tag._id);
            if (!checkdesc) return null;

            const totalAmount = latestTransactions
                .filter((tx) => checkdesc.tags.some((t) => t.id === tx.description))
                .reduce((sum, tx) => sum + Number(tx.amount ?? 0), 0);

            const latestDate = latestTransactions
                .map((tx) => new Date(tx.transacted_at))
                .sort((a, b) => b - a)[0];

            if (0 < totalAmount) {
                return {
                    name: tag.tagname,
                    amount: totalAmount,
                    date: dateChangeFormat(latestDate)
                };
            }


        }).filter(Boolean); // remove nulls

        const resultbar = getPiechart(tagSummary)
        return resultbar

    }





    const getSpendchart = (transactions) => {
        const debitTxs = transactions.filter(
            (tx) => tx.type.toLowerCase() === "debit"
        );

        const grouped = debitTxs.reduce((acc, tx) => {
            const key = tx.top_level_category;

            if (!acc[key]) {
                acc[key] = { category: key, amount: 0 };
            }
            acc[key].amount += tx.amount;

            return acc;
        }, {});

        const categories = Object.values(grouped).map((g) => g.category);
        const amounts = Object.values(grouped).map((g) => g.amount);
        const dates = Object.values(grouped).map((g) => g.date);


        const resultbar = getPiechart(categories, amounts)
        return resultbar
    };


    const getPiechart = (label, amount) => {
        const barData = [];
        if (label) {
            if (amount) {
                for (let i = 0; i < label.length; i++) {
                    const obj1 = {
                        name: label[i],
                        value: amount[i],
                        color: colors[i],
                        text: loginfo.currency + ' ' + colors[i]
                    };



                    barData.push(obj1);
                }
            } else {
                for (let i = 0; i < label.length; i++) {
                    const obj1 = {
                        name: label[i].name,
                        value: label[i].amount,
                        color: colors[i],
                        text: loginfo.currency + ' ' + colors[i],
                        date: label[i].date
                    };



                    barData.push(obj1);
                }
            }
        }

        return barData;
    };

    // const getBudgetchart1 = (transactions, date) => {
    //     const budget = [];
    //     const spendingamt = [];
    //     const categoriesArr = [];
    //     const statement = transactions.filter((obj) => obj.type === 'DEBIT')
    //     const results = statement.map(s => {
    //         // Find record that matches category
    //         const record = descripiondata.records.find(r =>
    //             r.tags.some(tag => tag.text.toLowerCase() === s.description.toLowerCase())
    //         );

    //         if (!record || record.history.length === 0) {
    //             return { category: s.category, latestBudget: null };
    //         }

    //         // Find latest month based on setdate
    //         if (0 < record.history.length) {
    //             const latest = record.history.reduce((a, b) =>
    //                 new Date(a.setdate) > new Date(b.setdate) ? a : b
    //             );

    //             const tag = tagdata.records.find((obj) => obj._id === record.tag_id)

    //             return {
    //                 tagname: tag.tagname,
    //                 latestBudget: latest.budget,
    //             };
    //         }

    //     });





    //     category.forEach(cat => {
    //         const catName = cat.category;



    //         // find matching budget (if exists) by category _id
    //         const budgetObj = categoryBudget.find(b => b.category_id === cat._id);
    //         const budgetamt = budgetObj?.history.find(h => h.Month === apiDate(date))?.budget || 0;




    //         // sum all transaction amounts for this category
    //         const totalSpend = statement
    //             .filter(tx => tx.top_level_category === catName)
    //             .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    //         if (totalSpend > 0) {
    //             budget.push(budgetamt);
    //             spendingamt.push(totalSpend);
    //             categoriesArr.push(catName);
    //         }
    //     });

    //     const resultbar = getBarData(categoriesArr, budget, spendingamt, 'budget');
    //     return resultbar;

    // }

    const getBudgetchart = (transactions, date) => {
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

            const budgetamt = budgetObj?.history.find(h => h.Month === apiDate(date))?.budget || 0;
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
            bardata: getBarData(catarr, budgetarr, spendarr, 'budget', isTagArr),
            bardata1: [],
        }
        // const resultbar = getBarData(catarr, budgetarr, spendarr,'budget',isTagArr);
        return obj;

    }






    function splitMonthlyReport(transactions) {
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
        const getbar = CommonFunction.getBarData(chart, themeColors)
        return getbar

    }

    function monthlyIncomeExReport(transactions) {
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
        const getbar = getmonthlyIncomeexBarData(chart)
        return getbar
    }

    const getmonthlyIncomeexBarData = (final) => {
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

    const tabBgColorChg = (isEnable) => {
        if (isEnable) {
            return themeColors.buttonBgColor
        } else {
            return 'transparent'
        }

    }

    const tabBtnColorChg = (isEnable) => {
        if (isEnable) {
            return '#fff'
        } else {
            return '#878787'
        }
    }

    const datechangeformat = (date) => {
        var dt = moment(new Date(date)).format('MMM YYYY')
        return dt
    }


    const handlebarPress = (bar, index, data, type) => {

        var num = 0
        if (index <= 4 && !type) {
            num = 1.5
        } else {
            num = 4
        }

        setSelectedBar({ value: parseFloat(bar.value).toFixed(2), label: bar.lab ? bar.lab : bar.label, type: bar.type });
        const barSpacing = (barWidth + spacing) * index + barWidth;
        const xPos = barSpacing + (width / num - (data.length * (barWidth + spacing)) / 2); // Center alignment
        const yPos = chartHeight - (bar.value / 2)
        setTooltipPosition({ left: xPos, top: yPos });
        setTimeout(() => {
            setSelectedBar('')
        }, 3000); // 3 seconds delay
    };

    const handlePress = () => {
        setisVisibleamt(true);

        setTimeout(() => {
            setamt('')
            setisVisibleamt(false);
        }, 3000); // 3 seconds delay
    };

    const dateChangeFormat = (month) => {
        var dt = moment(new Date(month)).format("MMM YYYY")
        return dt

    }





    const navigateScreen = (data) => {
        var dt = statements[0]?.transacted_at
        if (data.id === '65cc8785c2567211806e5626') {
            props.navigation.navigate('IncomeVsExp', { name: data.name, date: dt })
        } else if (data.id === '65cca3eb06061e53fcf9e7b0') {
            props.navigation.navigate('Nsf', { name: data.name, date: dt })
        } else if (data.id === '65cca35606061e53fcf9e793') {
            props.navigation.navigate('Atm', { name: data.name, date: dt })
        } else if (data.id === '65cca41106061e53fcf9e7cd') {
            props.navigation.navigate('FeeAnalysis', { name: data.name, date: dt })
        } else if (data.id === '65cca1ba06061e53fcf9e70b') {
            props.navigation.navigate('SpendingCategories', { name: data.name, date: dt })
        } else if (data.id === '65dc375a55f3c765102bd233') {
            props.navigation.navigate('TagTrasaction', { name: data.name, date: dt })
        } else if (data.id === '65d83000f8499e1fb802862d') {
            props.navigation.navigate('BudgetVariance', { name: data.name, date: dt })
        } else if (data.id === '665dabfa0f722a3ed47005b3') {
            props.navigation.navigate('LoanPayment', { name: data.name, date: dt })
        } else if (data.id === '665dac130f722a3ed47005dd') {
            props.navigation.navigate('Repayment', { name: data.name, date: dt })
        } else {
            console.log(data)
        }
    }




    const monthFormat = (formatmonth) => {
        if (formatmonth) {
            const chgMonth = moment(formatmonth).format('MMM YYYY')
            return chgMonth

        }

    }






    //     setSelectedBar({ value: parseFloat(bar.value).toFixed(2), label: bar.lab ? bar.lab : bar.label, type: bar.type });
    //     const barSpacing = (barWidth + spacing) * index + barWidth;
    //     const xPos = barSpacing + (width / num - (data.length * (barWidth + spacing)) / 2); // Center alignment
    //     const yPos = chartHeight - (bar.value / 2)
    //     setTooltipPosition({ left: xPos, top: yPos });
    //     setTimeout(() => {
    //         setSelectedBar('')
    //     }, 3000); // 3 seconds delay
    // };


    const checkRecord = (listarr) => {
        var arr = []

        for (i = 0; i < listarr.length; i++) {
            if (0 < listarr[i]) {
                arr.push(listarr[i])
            }
        }
        return arr

    }


    function enabtbudget(data) {
        const budgetItem = data?.find(item => item.type === "Budget");
        if (budgetItem) {
            if (0 < budgetItem.value) {
                return true
            } else {
                return false
            }
        } else {
            console.log("No Budget type found");
        }
    }


    // if (error || error1) {
    //     return (
    //         <Nointernet />
    //     )
    // }


    const bankConnect = (data) => {
        var info = data ? data : storedata
        if (info?.request_status === 'Yes') {
            setIisConnect(true)
        } else {
            setIisConnect(false)
        }
        setloginfo(info)
    }

    const CardSkeleton = () => {
        return (
            <GradientBackground>
                <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                    <CommonHead title={'Bank Insights'} back={'no'} navigation={props.navigation} screen={'Insights'} />
                    <View style={{ marginStart: 10, marginEnd: 10, }}>

                        <SkeletonPlaceholder
                            backgroundColor={themeColors?.cardbg}
                            highlightColor={themeColors?.backgroundcolor}
                        >
                            <SkeletonPlaceholder.Item
                                width={width * 0.95}
                                height={40}
                                marginTop={10}
                                borderRadius={10}
                            />
                            {[...Array(10)].map((_, index) => (
                                <View
                                    key={index}
                                    style={{ flexDirection: 'row', marginTop: 20 }}
                                >
                                    <View style={{ width: width * 0.95, height: 350, borderRadius: 10 }} />


                                </View>
                            ))}
                        </SkeletonPlaceholder>
                    </View>
                </View>
            </GradientBackground>

        );
    };




    return (
        <GradientBackground>

            {
                load || !loginfo ?
                    <CardSkeleton /> :
                    <View style={themedata?.gradient === 'No' ? styles.primaryBackground : { flex: 1 }}>
                        <CommonHead title={'Bank Insights'} back={'no'} navigation={props.navigation} screen={'Insights'} />



                        {
                            isPlanpage ?
                                <Plan
                                    onChange={(obj) => {
                                        if (obj === 'completed') {
                                            setIsplanPage(false)
                                        }
                                    }} /> :
                                <View style={{ flex: 1 }}>
                                    {
                                        isConnect ?
                                            <View style={{ flex: 1 }}>
                                                {

                                                    <>
                                                        <View style={{ margin: 10 }}>
                                                            <View style={[styles.insightsTabContainer, { padding: 5 }]}>
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Pressable style={[styles.tabtag, { backgroundColor: trabtn ? themeColors?.tab_active_bg : 'transparent' }]} onPress={() => { settrabtn(true), setcatbtn(false) }}>
                                                                        <Text style={[styles.insightsTabTxt, { color: trabtn ? themeColors?.tab_active_text : themeColors?.text_secondary }]}>Transaction</Text>
                                                                    </Pressable>
                                                                    <Pressable style={[styles.tabtag, { backgroundColor: catbtn ? themeColors?.tab_active_bg : 'transparent' }]} onPress={() => { setcatbtn(true), settrabtn(false) }}>
                                                                        <Text style={[styles.insightsTabTxt, { color: catbtn ? themeColors?.tab_active_text : themeColors?.text_secondary }]}>Categories</Text>
                                                                    </Pressable>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {
                                                            0 < statements?.length ?
                                                                <ScrollView showsVerticalScrollIndicator={false} style={{ marginStart: 10, marginEnd: 10, }} ref={scrollref}>

                                                                    {
                                                                        0 < reportmenu.length && menu &&
                                                                        reportmenu.map((value, key) => {
                                                                            if (trabtn && value.group_id === '660a49621bdc7febf01948cf') {
                                                                                return (
                                                                                    <View style={{ backgroundColor: themeColors?.cardbg, padding: 10, borderRadius: 8, paddingBottom: 15, marginVertical: 10 }} key={key}>
                                                                                        <View style={{ alignItems: 'center', marginTop: 20, }}>
                                                                                            <Text style={styles.reportTitle}>{value.name}</Text>
                                                                                        </View>
                                                                                        {
                                                                                            value.id === '65cc8785c2567211806e5626' ?
                                                                                                <View style={{ backgroundColor: themeColors?.cardbg, borderRadius: 8 }}>

                                                                                                    {
                                                                                                        trasactionDetails?.incomeExdetails?.date &&
                                                                                                        <View style={[styles.insightsMonthContainer,]}>
                                                                                                            <View style={[styles.insightsMonthbg]}>
                                                                                                                <Text style={[styles.insightValue]}>{trasactionDetails?.incomeExdetails?.date}</Text>
                                                                                                            </View>

                                                                                                        </View>
                                                                                                    }


                                                                                                    {
                                                                                                        selectedBar &&
                                                                                                        <View style={[styles.tooltip,]}>
                                                                                                            <Text style={{ fontSize: getFontSize(14), color: themeColors?.white }}>{`${selectedBar.label} ${selectedBar.type}: ${loginfo?.currency} ${selectedBar.value}`}</Text>
                                                                                                        </View>
                                                                                                    }

                                                                                                    {
                                                                                                        <BarChart
                                                                                                            width={width * 0.9}
                                                                                                            height={height * 0.3}
                                                                                                            hideRules
                                                                                                            data={chart?.incomechart}
                                                                                                            yAxisTextStyle={styles.YaxisLabelTextStyle}
                                                                                                            yAxisThickness={2}
                                                                                                            spacing={spacing}
                                                                                                            // barBorderRadius={4}
                                                                                                            xAxisColor={'#C3C3C3'}
                                                                                                            yAxisColor={'#C3C3C3'}
                                                                                                            onPress={(bar, index) => handlebarPress(bar, index, incomeEx)}
                                                                                                            xAxisThickness={2}
                                                                                                            xAxisLabelTextStyle={styles.XaxisLabelTextStyle}
                                                                                                            barBorderTopLeftRadius={5}
                                                                                                            barBorderTopRightRadius={5}
                                                                                                            barWidth={barWidth}
                                                                                                        />


                                                                                                    }

                                                                                                    <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 10 }}>
                                                                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                                                <View style={[styles.insightBarColordiff, { backgroundColor: themeColors?.chartincome, borderRadius: 20 }]}></View>
                                                                                                                <View style={{ justifyContent: 'center', marginStart: 5 }}>
                                                                                                                    <Text style={styles.insightLabel}>Income</Text>
                                                                                                                </View>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                        <View style={{ flexDirection: 'row', flex: 1, marginStart: 20 }}>
                                                                                                            <View style={[styles.insightBarColordiff, { backgroundColor: themeColors?.chartexpenses, borderRadius: 20 }]}></View>
                                                                                                            <View style={{ justifyContent: 'center', marginStart: 5 }}>
                                                                                                                <Text style={styles.insightLabel}>Expense</Text>
                                                                                                            </View>
                                                                                                        </View>

                                                                                                    </View>


                                                                                                    <InsightsTransactionContainer
                                                                                                        image={menu['674821c3b2253a1fd8a5b541'].image}
                                                                                                        iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                        iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                        color={themeColors?.card_list_bg}
                                                                                                        transaction={'#' + trasactionDetails?.incomeExdetails?.total}
                                                                                                        count={0}
                                                                                                        amount={loginfo?.currency + parseFloat(trasactionDetails?.incomeExdetails ? trasactionDetails?.incomeExdetails?.credit : 0).toFixed(2)}
                                                                                                        onClick={() => navigateScreen(value)}
                                                                                                        label={menu['674821c3b2253a1fd8a5b541'].name} />


                                                                                                    <View >
                                                                                                        <InsightsTransactionContainer
                                                                                                            image={menu['674821d6b2253a1fd8a5b55d'].image}
                                                                                                            iconname={menu['674821d6b2253a1fd8a5b55d'].appicon}
                                                                                                            iconsfamily={menu['674821d6b2253a1fd8a5b55d'].iconfamily}
                                                                                                            color={themeColors?.card_list_bg}
                                                                                                            transaction={'#' + trasactionDetails?.incomeExdetails?.total}
                                                                                                            // count={item?.totalCount || 0}
                                                                                                            amount={loginfo?.currency + parseFloat(trasactionDetails?.incomeExdetails?.debit ? trasactionDetails?.incomeExdetails?.debit : 0).toFixed(2)}
                                                                                                            onClick={() => navigateScreen(value)}
                                                                                                            label={menu['674821d6b2253a1fd8a5b55d'].name} />
                                                                                                    </View>


                                                                                                </View>
                                                                                                :
                                                                                                value.id === '65cca3eb06061e53fcf9e7b0' ?
                                                                                                    <View style={{ marginTop: 10 }}>
                                                                                                        {
                                                                                                            trasactionDetails?.nsfdetails?.date &&
                                                                                                            <View style={styles.insightsMonthContainer}>
                                                                                                                <View style={styles.insightsMonthbg}>
                                                                                                                    <Text style={[styles.insightValue]}>{
                                                                                                                        trasactionDetails?.nsfdetails?.date
                                                                                                                    }</Text>
                                                                                                                </View>
                                                                                                            </View>

                                                                                                        }

                                                                                                        {

                                                                                                            <BarChartDiagram
                                                                                                                screen='insights'
                                                                                                                currency={loginfo?.currency}
                                                                                                                data={chart?.nsfchart} />
                                                                                                        }



                                                                                                        <InsightsTransactionContainer
                                                                                                            image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                            color={themeColors?.card_list_bg}
                                                                                                            iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                            iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                            transaction={'#' + trasactionDetails?.nsfdetails?.total}
                                                                                                            count={trasactionDetails?.nsfdetails?.total}
                                                                                                            amount={loginfo?.currency + parseFloat(trasactionDetails?.nsfdetails?.value).toFixed(2)}
                                                                                                            onClick={() => navigateScreen(value)}
                                                                                                            label={menu['674821a6b2253a1fd8a5b525'].name} />
                                                                                                    </View>

                                                                                                    : value.id === '65cca35606061e53fcf9e793' ?
                                                                                                        <View style={{ marginTop: 10 }}>


                                                                                                            {
                                                                                                                trasactionDetails?.atmdetail?.date &&
                                                                                                                <View style={styles.insightsMonthContainer}>
                                                                                                                    <View style={styles.insightsMonthbg}>
                                                                                                                        <Text style={[styles.insightValue]}>{
                                                                                                                            trasactionDetails?.atmdetail?.date
                                                                                                                        }</Text>
                                                                                                                    </View>
                                                                                                                </View>



                                                                                                            }


                                                                                                            {

                                                                                                                <BarChartDiagram
                                                                                                                    screen='insights'
                                                                                                                    currency={loginfo?.currency}
                                                                                                                    data={chart?.atmchart}
                                                                                                                />
                                                                                                            }

                                                                                                            <InsightsTransactionContainer
                                                                                                                image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                                color={themeColors?.card_list_bg}
                                                                                                                iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                                iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                                transaction={'#' + trasactionDetails?.atmdetail?.total}
                                                                                                                count={trasactionDetails?.atmdetail?.total}
                                                                                                                amount={loginfo?.currency + parseFloat(trasactionDetails?.atmdetail?.value).toFixed(2)}
                                                                                                                onClick={() => navigateScreen(value)}
                                                                                                                label={menu['674821a6b2253a1fd8a5b525'].name} />

                                                                                                        </View>
                                                                                                        :
                                                                                                        value.id === '65cca41106061e53fcf9e7cd' ?
                                                                                                            <View style={{ marginTop: 10 }}>

                                                                                                                {
                                                                                                                    trasactionDetails?.feedetails?.date &&
                                                                                                                    <View style={styles.insightsMonthContainer}>
                                                                                                                        <View style={styles.insightsMonthbg}>
                                                                                                                            <Text style={[styles.insightValue]}>{
                                                                                                                                trasactionDetails?.feedetails?.date
                                                                                                                            }</Text>
                                                                                                                        </View>
                                                                                                                    </View>
                                                                                                                }

                                                                                                                {

                                                                                                                    <BarChartDiagram
                                                                                                                        screen='insights'
                                                                                                                        currency={loginfo?.currency}
                                                                                                                        data={chart?.feechart} />
                                                                                                                }

                                                                                                                <InsightsTransactionContainer
                                                                                                                    image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                                    color={themeColors?.card_list_bg}
                                                                                                                    iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                                    iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                                    transaction={'#' + trasactionDetails?.feedetails?.total}
                                                                                                                    count={trasactionDetails?.feedetails?.total}
                                                                                                                    amount={loginfo?.currency + parseFloat(trasactionDetails?.feedetails?.value).toFixed(2)}
                                                                                                                    onClick={() => navigateScreen(value)}
                                                                                                                    label={menu['674821a6b2253a1fd8a5b525'].name} />


                                                                                                            </View>
                                                                                                            :
                                                                                                            value.id === '665dabfa0f722a3ed47005b3' ?
                                                                                                                <View style={{ marginTop: 10 }}>
                                                                                                                    {
                                                                                                                        trasactionDetails?.loandetails?.date &&
                                                                                                                        <View style={styles.insightsMonthContainer}>
                                                                                                                            <View style={styles.insightsMonthbg}>
                                                                                                                                <Text style={[styles.insightValue]}>{
                                                                                                                                    trasactionDetails?.loandetails?.date
                                                                                                                                }</Text>
                                                                                                                            </View>
                                                                                                                        </View>
                                                                                                                    }

                                                                                                                    {

                                                                                                                        <BarChartDiagram
                                                                                                                            screen='insights'
                                                                                                                            currency={loginfo?.currency}
                                                                                                                            data={chart?.loanchart} />
                                                                                                                    }


                                                                                                                    <InsightsTransactionContainer
                                                                                                                        image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                                        color={themeColors?.card_list_bg}
                                                                                                                        iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                                        iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                                        transaction={'#' + trasactionDetails?.loandetails?.total}
                                                                                                                        count={trasactionDetails?.loandetails?.total}
                                                                                                                        amount={loginfo?.currency + parseFloat(trasactionDetails?.loandetails?.value).toFixed(2)}
                                                                                                                        onClick={() => navigateScreen(value)}
                                                                                                                        label={menu['674821a6b2253a1fd8a5b525'].name} />

                                                                                                                </View>
                                                                                                                :
                                                                                                                value.id === '665dac130f722a3ed47005dd' ?
                                                                                                                    <View style={{ marginTop: 10 }}>
                                                                                                                        {
                                                                                                                            trasactionDetails?.repaydetails?.date &&
                                                                                                                            <View style={styles.insightsMonthContainer}>
                                                                                                                                <View style={styles.insightsMonthbg}>
                                                                                                                                    <Text style={[styles.insightValue]}>{
                                                                                                                                        trasactionDetails?.repaydetails?.date
                                                                                                                                    }</Text>
                                                                                                                                </View>
                                                                                                                            </View>
                                                                                                                        }



                                                                                                                        {

                                                                                                                            <BarChartDiagram
                                                                                                                                screen='insights'
                                                                                                                                currency={loginfo?.currency}
                                                                                                                                data={chart?.repaychart} />
                                                                                                                        }

                                                                                                                        <InsightsTransactionContainer
                                                                                                                            image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                                            color={themeColors?.card_list_bg}
                                                                                                                            iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                                            iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                                            transaction={'#' + trasactionDetails?.repaydetails?.total}
                                                                                                                            count={trasactionDetails?.repaydetails?.total}
                                                                                                                            amount={loginfo?.currency + parseFloat(trasactionDetails?.repaydetails?.value).toFixed(2)}
                                                                                                                            onClick={() => navigateScreen(value)}
                                                                                                                            label={menu['674821a6b2253a1fd8a5b525'].name} />
                                                                                                                    </View>
                                                                                                                    : null



                                                                                        }



                                                                                    </View>
                                                                                )
                                                                            } else if (!trabtn && value.group_id === '660a49931bdc7febf01948ec') {

                                                                                return (
                                                                                    <View style={{ marginTop: 30, backgroundColor: themeColors?.cardbg, padding: 10, borderRadius: 8 }} key={key}>


                                                                                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                                                                                            <Text style={styles.reportTitle}>{value.name}</Text>
                                                                                        </View>


                                                                                        {
                                                                                            value.id === '65cca1ba06061e53fcf9e70b' ?
                                                                                                <View style={{ marginTop: 10 }}>
                                                                                                    {
                                                                                                        trasactionDetails?.spendetails?.date &&
                                                                                                        <View style={styles.insightsMonthContainer}>
                                                                                                            <View style={styles.insightsMonthbg}>
                                                                                                                <Text style={[styles.insightValue,]}>{trasactionDetails?.spendetails?.date}</Text>
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    }
                                                                                                    {
                                                                                                        isVisbleamt &&
                                                                                                        <View style={styles.tooltip}>
                                                                                                            <Text style={{ fontSize: getFontSize(14), color: themeColors?.white }}>{amt}</Text>
                                                                                                        </View>
                                                                                                    }


                                                                                                    {

                                                                                                        <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                                                                                            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>


                                                                                                                <PieChart
                                                                                                                    radius={width * 0.17}
                                                                                                                    toggleFocusOnPress
                                                                                                                    // showGradient
                                                                                                                    onPress={(data) => { setamt(data.name + ' : ' + loginfo?.currency + ' ' + parseFloat(data.value).toFixed(2)), handlePress(data) }}
                                                                                                                    data={chart?.spendchart}
                                                                                                                />
                                                                                                            </View>
                                                                                                            <View style={{ flex: 1, justifyContent: 'center', end: 10 }}>
                                                                                                                {
                                                                                                                    chart && 0 < chart?.spendchart?.length &&
                                                                                                                    chart?.spendchart.map((value, key) => {
                                                                                                                        return (
                                                                                                                            <View style={{ flexDirection: 'row', marginTop: 10 }} key={key}>
                                                                                                                                <View style={[styles.insightsPieChart, { backgroundColor: value.color }]}>

                                                                                                                                </View>
                                                                                                                                <View style={{ marginStart: 10, flex: 1 }}>
                                                                                                                                    <Text style={[styles.reportText, { fontSize: getFontSize(12), color: themeColors?.card_text_color }]}>{value.name}</Text>
                                                                                                                                </View>
                                                                                                                            </View>
                                                                                                                        )
                                                                                                                    })
                                                                                                                }
                                                                                                            </View>
                                                                                                        </View>
                                                                                                    }

                                                                                                    <InsightsTransactionContainer
                                                                                                        image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                        color={themeColors?.card_list_bg}
                                                                                                        iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                        iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                        transaction={loginfo?.currency + parseFloat(trasactionDetails?.spendetails?.mostspend?.value ? trasactionDetails?.spendetails?.mostspend?.value : 0).toFixed(2)}
                                                                                                        amount={loginfo?.currency + parseFloat(trasactionDetails?.spendetails?.leastspend?.value ? trasactionDetails?.spendetails?.leastspend?.value : 0).toFixed(2)}
                                                                                                        onClick={() => navigateScreen(value)}
                                                                                                        label={'Spending Categories'} />

                                                                                                </View>
                                                                                                : value.id === '65dc375a55f3c765102bd233' ?
                                                                                                    <View style={{ marginTop: 10, }}>

                                                                                                        {

                                                                                                            chart && 0 < chart?.tagchart?.length &&
                                                                                                            <View style={styles.insightsMonthContainer}>
                                                                                                                <View style={styles.insightsMonthbg}>
                                                                                                                    <Text style={[styles.insightValue,]}>{trasactionDetails?.tagdetails?.date}</Text>
                                                                                                                </View>
                                                                                                            </View>

                                                                                                        }
                                                                                                        {
                                                                                                            chart && 0 < chart?.tagchart?.length ? <View>
                                                                                                                {
                                                                                                                    isVisbleamt &&
                                                                                                                    <View style={styles.tooltip}>
                                                                                                                        <Text style={{ fontSize: getFontSize(14), color: themeColors?.white }}>{amt}</Text>
                                                                                                                    </View>
                                                                                                                }


                                                                                                                {
                                                                                                                    chart && 0 < chart?.tagchart?.length && <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                                                                                                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                                                                                            {

                                                                                                                                <PieChart
                                                                                                                                    // showGradient
                                                                                                                                    radius={width * 0.17}
                                                                                                                                    data={chart?.tagchart}
                                                                                                                                    onPress={(data) => { setamt(data.name + ' : ' + loginfo?.currency + ' ' + parseFloat(data.value).toFixed(2)), handlePress(data) }}
                                                                                                                                // onPress={(data) => CommonFunction.message(data.name + " : " + loginfo?.currency + ' ' + parseFloat(data.value).toFixed(2))}
                                                                                                                                />
                                                                                                                            }
                                                                                                                        </View>


                                                                                                                        <View style={{ flex: 1 }}>
                                                                                                                            {
                                                                                                                                chart && 0 < chart?.tagchart?.length && chart?.tagchart?.map((value, key) => {
                                                                                                                                    return (
                                                                                                                                        <View style={{ flexDirection: 'row', marginTop: 10 }} key={key}>
                                                                                                                                            <View style={{ justifyContent: 'center' }}>
                                                                                                                                                <View style={[styles.insightsPieChart, { backgroundColor: value.color }]}>
                                                                                                                                                </View>
                                                                                                                                            </View>
                                                                                                                                            <View style={{ marginStart: 10, flex: 1, justifyContent: 'center' }}>
                                                                                                                                                <Text style={[styles.reportText, { fontSize: getFontSize(12), color: themeColors?.card_text_color }]}>{value?.name}</Text>
                                                                                                                                            </View>
                                                                                                                                        </View>
                                                                                                                                    )
                                                                                                                                })
                                                                                                                            }

                                                                                                                        </View>

                                                                                                                    </View>
                                                                                                                }
                                                                                                                {
                                                                                                                    0 < chart?.tagchart?.length ?
                                                                                                                        <InsightsTransactionContainer
                                                                                                                            image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                                            color={themeColors?.card_list_bg}
                                                                                                                            iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                                            iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                                            amount={loginfo?.currency + parseFloat(trasactionDetails?.tagdetails?.totalamount ? trasactionDetails?.tagdetails?.totalamount : 0).toFixed(2)}
                                                                                                                            transaction={'# ' + trasactionDetails?.tagdetails?.totaltag}
                                                                                                                            count={trasactionDetails?.tagdetails?.totaltag}
                                                                                                                            onClick={() => navigateScreen(value)}
                                                                                                                            label={'Tags'} /> : <View style={{ padding: 10 }}>
                                                                                                                            <NoRecord />
                                                                                                                        </View>
                                                                                                                }


                                                                                                            </View> : <View style={{ justifyContent: 'center', alignItems: "center", margin: 20 }}>
                                                                                                                <Text style={[styles?.reportTitle, { textAlign: 'center', lineHeight: 22, fontSize: getFontSize(12) }]}>You haven’t added any tags. Please set them in the statement.</Text>

                                                                                                                {/* <Pressable
                                                                                                                        onPress={() => props?.navigation.navigate('BankStatement')}
                                                                                                                        style={[styles?.btnbg, { marginTop: 20 }]}>
                                                                                                                        <Text style={styles.btnText}>Add Tags</Text>
                                                                                                                    </Pressable> */}

                                                                                                            </View>
                                                                                                        }



                                                                                                    </View> :
                                                                                                    value.id === '65d83000f8499e1fb802862d' ?
                                                                                                        <View style={{ marginTop: 10 }}>


                                                                                                            {

                                                                                                                <View style={{ alignItems: 'center' }}>

                                                                                                                    <Text style={[styles.insightValue, { color: themeColors?.card_text_color }]}>{trasactionDetails?.budgetdetails?.date}</Text>
                                                                                                                </View>
                                                                                                            }
                                                                                                            {
                                                                                                                selectedBar &&
                                                                                                                <View style={[styles.tooltip,]}>
                                                                                                                    <Text style={{ fontSize: getFontSize(14), color: themeColors?.white }}>{`${selectedBar.label} ${selectedBar.type}:${loginfo?.currency}${selectedBar.value}`}</Text>
                                                                                                                </View>
                                                                                                            }

                                                                                                            <>

                                                                                                                <View>
                                                                                                                    {

                                                                                                                        <View style={{ marginTop: 20 }}>

                                                                                                                            <BarChart
                                                                                                                                width={width * 1}
                                                                                                                                height={height * 0.25}
                                                                                                                                hideRules
                                                                                                                                data={chart?.budgetchart}
                                                                                                                                onPress={(bar, index) => handlebarPress(bar, index, chart?.budgetchart, 'varience')}
                                                                                                                                yAxisTextStyle={styles.YaxisLabelTextStyle}
                                                                                                                                yAxisColor={'#C3C3C3'}
                                                                                                                                yAxisThickness={2}
                                                                                                                                xAxisColor={'#C3C3C3'}
                                                                                                                                xAxisThickness={2}
                                                                                                                                xAxisLabelTextStyle={styles.XaxisLabelTextStyle}
                                                                                                                                barBorderTopLeftRadius={5}
                                                                                                                                barBorderTopRightRadius={5}
                                                                                                                                barWidth={40}
                                                                                                                            />
                                                                                                                        </View>
                                                                                                                    }



                                                                                                                    <View style={{ flexDirection: 'row', marginTop: 30, marginBottom: 10 }}>
                                                                                                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                                                                <View style={[styles.insightBarColordiff, { backgroundColor: themeColors?.chartincome, borderRadius: 20 }]}></View>
                                                                                                                                <View style={{ justifyContent: 'center', marginStart: 5 }}>
                                                                                                                                    <Text style={styles.insightLabel}>Budget</Text>
                                                                                                                                </View>
                                                                                                                            </View>
                                                                                                                        </View>
                                                                                                                        <View style={{ flexDirection: 'row', flex: 1, marginStart: 20 }}>
                                                                                                                            <View style={[styles.insightBarColordiff, { backgroundColor: themeColors?.chartexpenses, borderRadius: 20 }]}></View>
                                                                                                                            <View style={{ justifyContent: 'center', marginStart: 5 }}>
                                                                                                                                <Text style={styles.insightLabel}>Actual</Text>
                                                                                                                            </View>
                                                                                                                        </View>

                                                                                                                    </View>



                                                                                                                    <InsightsTransactionContainer
                                                                                                                        image={menu['674821a6b2253a1fd8a5b525'].image}
                                                                                                                        color={themeColors?.card_list_bg}
                                                                                                                        iconsfamily={menu['674821a6b2253a1fd8a5b525'].iconfamily}
                                                                                                                        iconname={menu['674821a6b2253a1fd8a5b525'].appicon}
                                                                                                                        amount={loginfo?.currency + (trasactionDetails?.budgetdetails?.actual)}
                                                                                                                        transaction={loginfo?.currency + (trasactionDetails?.budgetdetails?.budget)}
                                                                                                                        onClick={() => navigateScreen(value)}
                                                                                                                        // labelamt={loginfo?.currency + Math.abs(0, 'budget') - (0, 'actual')}
                                                                                                                        label={'Variance'} />
                                                                                                                </View>


                                                                                                            </>

                                                                                                        </View>
                                                                                                        :
                                                                                                        null


                                                                                        }




                                                                                    </View>
                                                                                )

                                                                            } else {
                                                                                null
                                                                            }

                                                                        })
                                                                    }


                                                                </ScrollView> :
                                                                <NoRecord />
                                                        }

                                                    </>

                                                }

                                            </View> : <View style={{ flex: 1 }}>
                                                <ScrollView
                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                >
                                                    <ConnectBank screen={'insights'}
                                                        onload={(data) => {

                                                        }}
                                                        onChange={(data) => {
                                                            bankConnect(data)
                                                        }} />

                                                </ScrollView>
                                            </View>
                                    }
                                </View>




                        }




                    </View>
            }

        </GradientBackground>

    )
}







export default Insights