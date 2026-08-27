import { parse } from 'date-fns';
import dayjs from "dayjs";
import moment from 'moment';
import { appName } from '../service/environment';
export const content = {
    loginTitle: "Access your account with just a few steps",
    signupTitle: "Your journey begins here - Sign Up",
    fieldrequire: 'This field is required',
    secret: "9BA569F84818BE66",
    norecord: "No Record Found",
    differentaccountmsg: 'Are you sure you want to sign in with different account?',
    deletecategory: "Are you sure you want to delete this category?",
    manual: 'Manual',
    primaryfolder: 'uploads',
    secondaryfolder: '',
    appName: appName,
    registerPrivacyContent: `By submitting, you agree to receive messages from ${appName}. Msg & Data rates may apply. Messages will be used for MFA authentication and account notices, frequency will vary with use. Reply STOP to opt-out or HELP for help`
}


export const animationScreen = {
    default: 'default',
    fade: 'fade',
    fade_from_bottom: 'fade_from_bottom',
    flip: 'flip',
    ios_from_left: 'ios_from_left',
    ios_from_right: 'ios_from_right',
    none: 'none',
    simple_push: 'simple_push',
    slide_from_bottom: 'slide_from_bottom',
    slide_from_left: 'slide_from_left',
    slide_from_right: 'slide_from_right'
}

export const deftransactionimg = require('../../assets/images/transaction-icon.jpg')

export function splitWeeklyReport(transactions, month, year, themeColors) {

    const filtered = transactions.filter(tx => {
        const d = new Date(tx.transacted_at);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    const totalWeeks = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
    const report = Array.from({ length: totalWeeks }, (_, i) => ({
        label: `Week ${i + 1}`,
        credit: 0,
        debit: 0,
    }));


    filtered.forEach(tx => {
        const d = new Date(tx.transacted_at);
        const offset = d.getDate() + firstDayOfWeek - 1;
        const weekIndex = Math.min(totalWeeks - 1, Math.floor(offset / 7));


        if (tx.type.toUpperCase() === 'CREDIT') {
            report[weekIndex].credit += tx.amount;
        } else if (tx.type.toUpperCase() === 'DEBIT') {
            report[weekIndex].debit += tx.amount;
        }
    });


    const barData = [];
    report.forEach(week => {
        barData.push(
            {
                value: week.credit,
                label: week.label,
                type: 'Income',
                spacing: 0,
                frontColor: themeColors?.chartincome,
            },
            {
                value: week.debit,
                label: '',
                type: 'Expense',
                frontColor: themeColors?.chartexpenses,
            }
        );
    });



    return barData;
}

export const goalColor = [
    "#4A90E2", "#FF6B6B", "#7ED321", "#FF69B4", "#9B59B6", "#F39C12"
];


export const getUniqueGoalName = (name, goalList) => {
    if (!name) return name;

    const existingNames = goalList.map(item => item.name);

    if (!existingNames.includes(name)) {
        return name;
    }

    let counter = 1;
    let newName = `${name} ${counter}`;

    while (existingNames.includes(newName)) {
        counter++;
        newName = `${name} ${counter}`;
    }

    return newName;
}


export function generateReports(transactions) {
    const weeklyReport = {};
    const monthlyReport = {};
    if (0 < transactions?.length) {
        transactions.forEach(tx => {

            const date = dayjs(tx.transacted_at);
            var txtype = tx.type.toLowerCase()

            const monthKey = date.format("YYYY-MM");
            if (!monthlyReport[monthKey]) {
                monthlyReport[monthKey] = { credit: 0, debit: 0, total: 0 };
            }
            monthlyReport[monthKey][txtype] += tx.amount;
            monthlyReport[monthKey].total += (txtype === "credit" ? tx.amount : -tx.amount);
        });
    }
    return { weeklyReport, monthlyReport };
}

export function fillMonthlyBudgetsFromFirst(history, fdate) {
    if (!fdate) return [];

    const sorted = [...(history || [])].sort(
        (a, b) => new Date(a.Month + "-01") - new Date(b.Month + "-01")
    );

    const res = [];
    let loop = new Date(fdate);
    loop = new Date(loop.getFullYear(), loop.getMonth(), 1);

    let lastBudget = 0;
    let lastSetDate = null;
    let lastUpdateDate = null;
    let started = false;

    // const monthadd = moment(date).add(2,'month')
    const currentDate = new Date().toISOString();

    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);





    while (loop <= currentMonthStart) {

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

export const getBudgetchart = (transactions, themeColors) => {
    const debitTxs = transactions.filter(tx => tx.type.toLowerCase() === 'debit');
    const seen = new Set();
    const categories = [];
    const debitAmounts = [];
    debitTxs.forEach(tx => {
        if (!seen.has(tx.category)) {
            seen.add(tx.category);
            categories.push(tx.category);
            debitAmounts.push(tx.amount);
        }
    });
    const resultbar = getBarData(categories, [], debitAmounts, 'budget', themeColors)
    return resultbar;
}


const getBarData = (labels, income, expense, type, themeColors) => {
    const barData = [];
    for (let i = 0; i < labels.length; i++) {
        const obj1 = {
            value: parseFloat(income[i] ? income[i] : 0),
            label: labels[i],
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


export const getavgMonthlydailybalance = (transacion) => {
    var monavg = 0;
    var dayavg = 0;
    var sameday = 0;
    var same = 0;
    var samedate = '';
    var samemonth = 0;
    var samem = 0;
    var samemon = '';
    var daybal = 0;
    var monbal = 0;
    transacion.forEach((tran) => {
        var day = moment(tran.transacted_at).format('YYYY-MM-DD');
        var month = moment(tran.transacted_at).format('YYYY-MM');
        if (day === samedate) {
            same += 1;
            daybal += tran.curbalance;
        }
        else {
            if (same > 0) {
                dayavg += daybal / same;
                sameday += 1;
            }
            same = 1;
            samedate = day;
            daybal = tran.curbalance;
        }
        if (month === samemon) {
            samem += 1;
            monbal += tran.curbalance;
        }
        else {
            if (samem > 0) {
                monavg += monbal / samem;
                samemonth += 1;
            }
            samem = 1;
            samemon = month;
            monbal = tran.curbalance;
        }
    })
    if (same > 0) {
        dayavg += daybal / same;
        sameday += 1;
    }
    if (samem > 0) {
        monavg += monbal / samem;
        samemonth += 1;
    }
    if (sameday > 0)
        dayavg = dayavg / sameday;
    if (samemonth > 0)
        monavg = monavg / samemonth;
    var obj = {}
    obj = {
        monavg: monavg,
        dayavg: dayavg
    }
    return obj
}


export const weekdata = [
    { value: "1", label: 'First' },
    { value: "2", label: 'Second' },
    { value: "3", label: 'Third' },
    { value: "4", label: 'Fourth' },
    { value: "5", label: 'Last' },
]

export const payDays = [
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

export const payDayarrange = [
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


export const calculateNextOccurrences = (freq, startDt, weeklyWeekday, endDt, dayofType, yearMonth, monthDt, occurance, monthWeekday) => {
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


export const months = [
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

export const paymentFrequencyOptions = [
    { label: 'Every week', value: 'Every week' },
    { label: 'Every month', value: 'Every month' },
    { label: 'Every year', value: 'Every year' },
];

export const payDayFrequncy = [
    { label: "Bi-Weekly", value: "bi-weekly" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "Monthly" }
]

export const repaymentOptions = [
    { label: "On Pay day", value: "0" },
    { label: "Next day of the pay day", value: "1" },
    { label: "2nd Day of the pay day", value: "2" },
    { label: "3rd Day of the pay day", value: "3" },

]

export const weekdays = [
    { value: "Sunday", label: 'Sunday' },
    { value: "Monday", label: 'Monday' },
    { value: "Tuesday", label: 'Tuesday' },
    { value: "Wednesday", label: 'Wednesday' },
    { value: "Thursday", label: 'Thursday' },
    { value: "Friday", label: 'Friday' },
    { value: "Saturday", label: 'Saturday' },
];

export const firstalertmodel = [
    { label: '7 Days Before', value: '7' },
    { label: '6 Days Before', value: '6' }

]



export const secondalertmodel = [
    { label: '5 Days Before', value: '5' },
    { label: '4 Days Before', value: '4' },
    { label: '3 Days Before', value: '3' }

]

export const thirdalertmodel = [
    { label: '2 Days Before', value: '2' },
    { label: '1 Day Before', value: '1' }



]



export function getTransactionsForMonth(transactions, month, themeColors) {
    const getmonth = parseInt(moment(month).format('MM'), 10);
    const getyear = parseInt(moment(month).format('YYYY'), 10);

    const transaction = transactions.filter(tx => {
        const txDate = new Date(tx.transacted_at);
        return (
            txDate.getFullYear() === getyear &&
            (txDate.getMonth() + 1) === getmonth
        );
    });

    const incomeandexpence = splitWeeklyReport(transaction, Number(getmonth), Number(getyear), themeColors);
    const dataarrey = calculateCreditDebit(transaction)
    return { incomeandexpence, dataarrey }

}

export function calculateCreditDebit(transactions) {
    const totals = transactions.reduce(
        (acc, tx) => {
            const key = tx.type.toUpperCase();
            if (key === 'CREDIT') {
                acc.credit.amount += tx.amount;
                acc.credit.count += 1;
            } else if (key === 'DEBIT') {
                acc.debit.amount += tx.amount;
                acc.debit.count += 1;
            }
            return acc;
        },
        { credit: { amount: 0, count: 0 }, debit: { amount: 0, count: 0 } }
    );


    const summaryArray = [
        { type: 'Income', totalAmount: totals.credit.amount, totalCount: totals.credit.count },
        { type: 'Expense', totalAmount: totals.debit.amount, totalCount: totals.debit.count }
    ];


    return 0 < summaryArray.length ? summaryArray : []

}

