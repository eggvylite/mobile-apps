import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";
import appLog from "../../constants/logger";


const selectByScreen = (state) => state.appscreenlabels.byScreen;

export default function useGeneralLabelsHook() {
    const byScreen = useSelector(selectByScreen);

    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.GENERAL);
        const labels = record?.labels || [];
        const subscriptionbages = labels[0]?.message ?? "from your earned wages";
        const subscriptionInformation = labels[1]?.message ?? "Your available amount may change based on your eligibility and account activity.";
        const connectNewBankAlertPromt = labels[2]?.message ?? "Connecting a new bank account will remove your current bank connection. You'll need to reconnect it if you want to use it again.";
        const connectBankPromtTitle = labels[3]?.message ?? "Connect Bank Account?";
        const deleteBankPromtAlertPromt = labels[4]?.message ?? "Are you sure you want to disconnect this bank account? You won’t be able to use this account for transactions until you reconnect it.";
        const deleteConnectBankPromtTitle = labels[5]?.message ?? "Disconnect Bank Account?";
        const subScriptionCancelAlertDescription = labels[6]?.message ?? " Are you sure you want to cancel? You’ll lose subscription benefits and future advance eligibility.";
        const subScriptionCancelAlertTitle = labels[7]?.message ?? "Cancel Subscription?";
        const subscriptionAdvanceAlertDescription = labels[8]?.message ?? "You have a payment that is still pending. Please review it and complete the payment to keep your account up to date.";
        const subscriptionAdvanceAlertTitle = labels[9]?.message ?? "Cancel Subscription?";
         const wageProgress = labels[10]?.message ?? "Wage verification is currently in progress. You’ll be notified through your preferred communication channel once it’s complete.";
         const manageBankConnection = labels[11]?.message ?? "Manage Bank Connection";
          const manageBankConnectionDescription = labels[12]?.message ?? "Manage your connected bank accounts";


         return {
            subscriptionbages,
            subscriptionInformation,
            connectNewBankAlertPromt,
            connectBankPromtTitle,
            deleteBankPromtAlertPromt,
            deleteConnectBankPromtTitle,
            subScriptionCancelAlertDescription,
            subScriptionCancelAlertTitle,
            subscriptionAdvanceAlertDescription,
            subscriptionAdvanceAlertTitle,
            wageProgress,
            manageBankConnection,
            manageBankConnectionDescription
        };
    }, [byScreen]);
}