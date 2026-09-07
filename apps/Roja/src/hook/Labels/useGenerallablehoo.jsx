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
        const advanceLimitSHowMessage = labels[13]?.message ?? "You’re not eligible for another advance at this time. Please repay the previous advance before requesting a new one.";
        const dashboardSycnStatementHead = labels[14]?.message ?? "Get Statement";
        const dashboardSyncStamenDescription = labels[15]?.message ?? "Are you sure you want to get a new statement? This might take a moment to sync your recent transactions.";
        const unlockFeature = labels[16]?.message ?? "Subscribe to unlock this feature";
        const OutstandingBalancelable = labels[17]?.message ?? "Outstanding Balance";
        const OutstandingBalanceButtonlable = labels[18]?.message ?? "Repay All Outstanding";
        const showLimtlables = labels[19]?.message ?? "Limit Reached";
        const advanceLimitButton = labels[20]?.message ?? "Advance Limit Reached";
        const advanceCardUsed = labels[21]?.message ?? "Used";
        const advanceMinimumAmountPromtLable = labels[22]?.message ?? "You’re currently not eligible for an advance. A minimum limit of";
        const advanceMinimumAmountPromtLable2 = labels[23]?.message ?? "is required.";
        const AdvanceHisoryshowLableContent = labels[24]?.message ?? "Advance Received";
        const PlanScreenInstantFountLabel = labels[25]?.message ?? "View Instant Transfer Fee Details";
        const InstantFeeLabelHead = labels[26]?.message ?? "Instant fund Fee ";
        const InstantFeeLabelFrom = labels[27]?.message ?? "From ";
        const InstantFeeLabelTo = labels[28]?.message ?? "To";
        const InstantFeeLabelFee = labels[29]?.message ?? "Fee ";
        const InstantFeeLabelAbove = labels[30]?.message ?? "Above ";
        const advancesDrawn = labels[31]?.message ?? 'Advances Drawn'
        const advanceFrequencyLimt = labels[32]?.message ?? 'You have reached your advance limit for this cycle.'
        const advanceremining = labels[33]?.message ?? 'remaining'
        const advanceTypically = labels[34]?.message ?? 'Typically available within minutes '
        const advanceTypcallyavalibleminit = labels[35]?.message ?? 'Typically available in 2-3 business days'
        const advanceLimitadvanceLabel = labels[36]?.message ?? 'advance'
        const InstatFoundingHead = labels[37]?.message ?? 'Instant Funding'
        const ACHHEAD = labels[38]?.message ?? 'Standard ACH Transfer'
        const NoFeeLable = labels[39]?.message ?? 'No fee'


        return {
            NoFeeLable,
            InstatFoundingHead,
            ACHHEAD,
            advanceLimitadvanceLabel,
            advanceTypically,
            advanceTypcallyavalibleminit,
            advanceremining,
            advancesDrawn,
            advanceFrequencyLimt,
            InstantFeeLabelAbove,
            InstantFeeLabelFrom,
            InstantFeeLabelTo,
            InstantFeeLabelFee,
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
            manageBankConnectionDescription,
            advanceLimitSHowMessage,
            dashboardSycnStatementHead,
            dashboardSyncStamenDescription,
            manageBankConnectionDescription,
            unlockFeature,
            OutstandingBalancelable,
            OutstandingBalanceButtonlable,
            showLimtlables,
            advanceLimitButton,
            advanceCardUsed,
            advanceMinimumAmountPromtLable,
            advanceMinimumAmountPromtLable2,
            AdvanceHisoryshowLableContent,
            PlanScreenInstantFountLabel,
            InstantFeeLabelHead
        };
    }, [byScreen]);
}