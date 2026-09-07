import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";

const selectByScreen = (state) => state.labels.record;

export default function usInsightsLabels() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.INSIGHT);
        const labels = record?.labels || [];
        const insightCat = labels[24]?.message ?? "Insights Categories"
        const insightFilter = {
            overview: labels[0]?.message ?? "Overview",
            cashflow: labels[1]?.message ?? "Cash Flow",
            spending: labels[2]?.message ?? "Spending",
            patterns: labels[3]?.message ?? "Patterns",
            debt: labels[4]?.message ?? "Debt & Loans",
            transaction: labels[5]?.message ?? "Transactions",
            income: labels[6]?.message ?? "Income",
        }
        const overView = {
            excellent: labels[7]?.message ?? "Excellent Financial Health",
            good: labels[8]?.message ?? "Good Financial Health",
            fair: labels[9]?.message ?? "Fair Financial Health",
            help: labels[10]?.message ?? "Needs Help Financial Health", // 
            balance: labels[11]?.message ?? "Balance",
            saving: labels[12]?.message ?? "Saving",
            moneyIn: labels[13]?.message ?? "Money In",
            moneyOut: labels[14]?.message ?? "Money Out",
            netFlow: labels[15]?.message ?? "Net Flow",
            curBalance: labels[16]?.message ?? "Current Balance",
            monthIncome: labels[17]?.message ?? "Monthly Income",
            dailAvgBal: labels[18]?.message ?? "Daily Avg Spend",
            transfer: labels[19]?.message ?? "Transfers",
            alert: labels[20]?.message ?? "Alerts",
            moenyTips: labels[21]?.message ?? "Money Tips",
            transaction: labels[22]?.message ?? "transactions",
            poor: labels[23]?.message ?? "Poor Financial Health",
        }
        const cashFlow = {
            avgMonthNet: labels[25]?.message ?? "Avg Monthly Net",
            totalmoneyIn: labels[26]?.message ?? "Total Money In",
            totalmoneyOut: labels[27]?.message ?? "Total Money Out",
            surplus: labels[28]?.message ?? "Surplus Months",
            monthbymonth: labels[29]?.message ?? "Month-by-Month Detail",
            month: labels[30]?.message ?? "Month",
            in: labels[31]?.message ?? "In",
            out: labels[32]?.message ?? "Out",
            net: labels[33]?.message ?? "Net",
            status: labels[34]?.message ?? "Status",
            accounts: labels[35]?.message ?? "Accounts",
        }
        const incomeFlow = {
            monthlyIncome: labels[36]?.message ?? "Monthly Income",
            payrollDeposit: labels[37]?.message ?? "Payroll Deposits",
            nextPayday: labels[38]?.message ?? "Next Payday",
            dayAway: labels[39]?.message ?? "Days Away",
            incomeSource: labels[40]?.message ?? "Income Sources",
            monthIncomevsSpend: labels[41]?.message ?? "Monthly Income vs Spending",

        }
        const spending = {
            spendbyCat: labels[42]?.message ?? "Spending by Category",
            monthAvg: labels[43]?.message ?? "month avg",
            mo: labels[44]?.message ?? "mo",
            topMerchant: labels[45]?.message ?? "Top Merchants",
            weeklySpendTrend: labels[46]?.message ?? "Weekly Spending Tren",
        }

        const pattern = {
            spendbydayweek: labels[47]?.message ?? "Spending by Day of Week",
            highspend: labels[48]?.message ?? "is your highest-spend day",
            total_avg: labels[49]?.message ?? "total, avg",
            txn: labels[50]?.message ?? "txn",
            weekend_weekday_spend: labels[51]?.message ?? "Weekend vs Weekday Spending",
            weekend: labels[52]?.message ?? "Weekend",
            weekday: labels[53]?.message ?? "Weekday",
            atm_bank_fee: labels[54]?.message ?? "ATM & Bank Fees",
            transaction: labels[55]?.message ?? "transactions",
            this_period: labels[56]?.message ?? "this period",
            atm_withdraw: labels[57]?.message ?? "ATM Withdrawals",
            bank_fees: labels[58]?.message ?? "Bank Fees Paid",
        }

        const debtloan = {
            cashAdvance: labels[59]?.message ?? "Cash Advance Apps",
            noCashapp: labels[60]?.message ?? "No cash advance app activity detected.",
            payDayLoan: labels[61]?.message ?? "Payday Loan Activity",
            noPayday: labels[62]?.message ?? "No payday loan activity detected",
            p2pTransfer: labels[63]?.message ?? "P2P Transfer Activity",
            transaferVolume: labels[64]?.message ?? "Transfer Volume",
            totaldebits: labels[65]?.message ?? "% of Total Debits",
            netBalance: labels[66]?.message ?? "Net Balance",
        }

        const transaction={
           alltrans: labels[67]?.message ?? "Recent Transactions",
            incometrans: labels[68]?.message ?? "Income Transactions",
             payrolltrans: labels[69]?.message ?? "Payroll Transactions",
             flagtrans:labels[70]?.message ?? "Flagged Transactions",
             norecord:labels[71]?.message ?? "No transactions found",
             all:labels[72]?.message ?? "All",
             income:labels[73]?.message ?? "Income",
             payroll:labels[74]?.message ?? "Payroll",
             flag:labels[75]?.message ?? "Flagged",
        }


        return {
            insightCat,
            insightFilter,
            overView,
            cashFlow,
            incomeFlow,
            spending,
            pattern,
            debtloan,
            transaction
        };
    }, [byScreen]);
}