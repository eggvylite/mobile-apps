import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";

const selectByScreen = (state) => state.labels.record;


export default function useDashboardLablehook() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.DASHBOARD);
        const labels = record?.labels || [];

        const title = labels[0]?.message ?? "Dashboard";


        const sub_advance_labels = {
            befor_sub: labels[1]?.message ?? "Your Approved Cash Advance Limit",
            befor_sub_cta: labels[2]?.message ?? "Subscription Now",
            sub_approved: labels[3]?.message ?? "Your Approved Cash",
            sub_avl_limit: labels[4]?.message ?? "Advance Limit",
            adv_button: labels[5]?.message ?? "Get Advance",
            current_outstatnding: labels[6]?.message ?? "Current Outstanding",
            balance: labels[7]?.message ?? "Balance",
            pay_button: labels[8]?.message ?? "Pay Now",
            outstanding: labels[9]?.message ?? "Outstanding",
            total_advance: labels[10]?.message ?? "Total Advance",
            total_drawn: labels[11]?.message ?? "Total Drawn",
            remaing: labels[12]?.message ?? "Remaining",
            details: labels[14]?.message ?? "Details",
            get_advance: labels[15]?.message ?? "Get Advance",
            limit_used: labels[16]?.message ?? "Limit Used"

        }

        const screen_label = {
            title: labels[0]?.message ?? "Dashboard",
            reminder: labels[17]?.message ?? "Reminders",
        }

        const accoounts = {
            bank_accounts: labels[13]?.message ?? "Bank Accounts",
            account: labels[18]?.message ?? "Account",
            accounts: labels[19]?.message ?? "Accounts",
            account_summery: labels[20]?.message ?? "Account Summary",
            avb_balance: labels[21]?.message ?? "Available Balance",
            bank: labels[22]?.message ?? "Bank",
            account_type: labels[23]?.message ?? "Account Type",
            routingnumber: labels[24]?.message ?? "Routing Number",
            avgdailybalance: labels[25]?.message ?? "Average Daily Balance",
            avgmonthlybalance: labels[26]?.message ?? "Average Monthly Balance",
            moneyin: labels[27]?.message ?? "Money In",
            moneyout: labels[28]?.message ?? "Money Out",
            accountbalance: labels[29]?.message ?? "Account Balance",
            accountholdername: labels[30]?.message ?? "Account Holder",
            view: labels[31]?.message ?? "View",
            account_activity: labels[32]?.message ?? "Account Activity Overview",
            xacount: labels[33]?.message ?? "XXXXXX",
        }

        const transaction = {
            recent_transaction: labels[34]?.message ?? "Recent Transactions",
            view_all: labels[35]?.message ?? "View All",
        }
        const marketlabels = {
            beyond_cash_benefits: labels[36]?.message ?? "Save on entertainment, travel, and more",
            pickforyou: labels[37]?.message ?? "The picks that fit you",
            petcare: labels[38]?.message ?? "Virtual Pet Care Service",
            recommended: labels[39]?.message ?? "Recommended",
        }

        const creditreport={
            credittile: labels[40]?.message ?? "Credit Score",
            nextrefresh: labels[41]?.message ?? "Next Refresh",
            yourscore: labels[42]?.message ?? "Your Score is",
            creditreportsummery: labels[43]?.message ?? "Credit Report Summary",
            ficoscore: labels[44]?.message ?? "FICO Score",
            totalloanamount: labels[45]?.message ?? "Total Loan Amount",
            totaldebit: labels[46]?.message ?? "Total Debit",
            accounts: labels[47]?.message ?? "Accounts",
            inquiries: labels[48]?.message ?? "Inquiries",
            utilization: labels[49]?.message ?? "Utilization",
            bureaus: labels[50]?.message ?? "Bureaus",
            basedon: labels[51]?.message ?? "Based on US FICO® Score model",
            tappill: labels[52]?.message ?? "↻ Tap pill above to refresh with new data",
            poor: labels[53]?.message ?? "Poor",
            fair: labels[54]?.message ?? "Fair",
            good: labels[55]?.message ?? "Good",
            verygood: labels[56]?.message ?? "Very Good",
            excellent: labels[57]?.message ?? "Excellent",
            creditfrom: labels[58]?.message ?? "300",
            creditto: labels[59]?.message ?? "850",
            refreshalert: labels[60]?.message ?? "Refresh Credit Report",
            refreshalertmsg: labels[61]?.message ?? "This will pull a new US credit report from all 3 bureaus (Equifax, Experian, TransUnion).",
            refreshtextcancel: labels[62]?.message ?? "Cancel",
            refreshtextrefresh: labels[63]?.message ?? "Refresh",
        }

        return {
            sub_advance_labels, screen_label, accoounts, transaction, marketlabels, creditreport
        };
    }, [byScreen]);
}