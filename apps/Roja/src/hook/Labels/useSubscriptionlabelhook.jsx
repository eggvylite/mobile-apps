import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";
import appLog from "../../constants/logger";


const selectByScreen = (state) => state.appscreenlabels.byScreen;

export default function useSubscriptionLabelsHook() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.SUBSCRIPTION);
        const labels = record?.labels || [];


        const subscription_details = {
            subscriptionCardTitle: labels[0]?.message ?? "You have full access to all features",
            cashlimit: labels[1]?.message ?? "Cash Limits",
            mimimum: labels[2]?.message ?? "Minimum",
            lowest: labels[3]?.message ?? "Lowest amount you can withdraw",
            maximum: labels[4]?.message ?? "Maximum",
            highest: labels[5]?.message ?? "Highest amount you can withdraw",
            details: labels[6]?.message ?? "Subscription Details",
            subid: labels[7]?.message ?? "Subscription ID",
            frequency: labels[8]?.message ?? "Frequency",
            status: labels[9]?.message ?? "Status",
            nextpayment: labels[10]?.message ?? "Next Payment",
            subscribedon: labels[11]?.message ?? "Subscribed On",
            biilperiod: labels[12]?.message ?? "Billing Period",
            include: labels[13]?.message ?? "What's Included",
            managesubscribtion: labels[14]?.message ?? "Manage Your Subscription",
            history: labels[15]?.message ?? "Subscription History",

        }

        const cancelsubscription = {
            control_cancel_subscribtion: labels[16]?.message ?? "You're in control. Cancel your subscription anytime",
            cancelany: labels[17]?.message ?? "Cancel anytime. No hidden fees",
            cancelbtn: labels[18]?.message ?? "Cancel Subscription",
            unsubscribe: labels[19]?.message ?? "This subscription has unsubscribed!",
            canceltitle: labels[20]?.message ?? "Cancel Subscribtion",
            cancelsubstitle: labels[21]?.message ?? "We'r sorry to see you go, Please tell us why",
            textinputlabel: labels[22]?.message ?? "Anything else you'd like to share?",
            continue: labels[23]?.message ?? "Continue",
            cancel: labels[24]?.message ?? "Cancel",
            confirmtitle: labels[25]?.message ?? "Confirm Cancellation",
            confirmdesc: labels[26]?.message ?? "Choose how you would like to cancel your subscription",
            warningtitle: labels[27]?.message ?? "Warning!",
            warningdesc: labels[28]?.message ?? "You will lose access to all premium features and cash advance benfits",
            canceloption: labels[29]?.message ?? "Choose Cancellation Option",
            immediatltytitle: labels[30]?.message ?? "Cancel Immediately",
            immediatlydesc: labels[31]?.message ?? "Cancel now and lose access Immediately",
            billendtitle: labels[32]?.message ?? "Cancel at End of Billing Period",
            billenddesc: labels[33]?.message ?? "Keep access until the end of current billing cycle. No further payments will be taken",
            lossaccess:labels[34]?.message ?? "You'll lose access to",
            reasoncancel:labels[35]?.message ?? "Reason for Cancellation",
            back:labels[36]?.message ?? "Back",
            confirmcancel:labels[37]?.message ?? "Confirm Cancel",
            imdeiatealerdes:labels[38]?.message ?? "Your Subscription was cancelled, yo have proceed to login  to check your account",
            scheduled:labels[39]?.message ?? "Cancellation Scheduled",

        }


        return {
            subscription_details,
            cancelsubscription
        };
    }, [byScreen]);
}