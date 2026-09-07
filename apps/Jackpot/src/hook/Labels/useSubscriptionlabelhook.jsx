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

        const subscriptionCardTitle = labels[0]?.message ?? "You have full access to all features";
        const unsubscribeContent = labels[1]?.message ?? "This subscription has unsubscribed!";
        const maximum = labels[2]?.message ?? "Highest amount you can withdraw";
        const minimum = labels[3]?.message ?? "Lowest amount you can withdraw";
        const subscriptionDetails = labels[4]?.message ?? "Subscription Details";
        const subscriptionId = labels[5]?.message ?? "Subscription ID";
        const status = labels[6]?.message ?? "Status";
        const nextPayment = labels[7]?.message ?? "Next Payment";
        const subscribedOn = labels[8]?.message ?? "Subscribed On";
        const billingPeriod = labels[9]?.message ?? "Billing Period";
        const featuresHead = labels[10]?.message ?? "What's Included";
        const manageYourSubscription = labels[11]?.message ?? "Manage Your Subscription";
        const inControlCancelAnytime = labels[12]?.message ?? "You're in control. Cancel your subscription anytime";
        const cancelAnytimeNoHiddenFees = labels[13]?.message ?? "Cancel anytime. No hidden fees";
        const subscriptionHistory = labels[14]?.message ?? "Subscription History";
        const frequency = labels[15]?.message ?? "Frequency";


        return {
            frequency,
            subscriptionCardTitle,
            unsubscribeContent,
            maximum,
            minimum,
            subscriptionDetails,
            subscriptionId,
            status,
            nextPayment,
            subscribedOn,
            billingPeriod,
            featuresHead,
            manageYourSubscription,
            inControlCancelAnytime,
            cancelAnytimeNoHiddenFees,
            subscriptionHistory
        };
    }, [byScreen]);
}