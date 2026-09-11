import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../constants/workflowConstents";
import { appName } from "../service/environment";
import appLog from "../constants/logger";

const selectByScreen = (state) => state.appscreenlabels.byScreen;

export default function useGoalLabelsHook() {
    const byScreen = useSelector(selectByScreen);

    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.GOAL);
        const labels = record?.labels || [];

        const title = labels[0]?.message ?? "Goals";
        const totalProgressLabel = labels[1]?.message ?? "Total Progress";
        const completeLabel = labels[2]?.message ?? "Complete";
        const activeGoalsLabel = labels[3]?.message ?? "Active Goals";
        const completedLabel = labels[4]?.message ?? "Completed";
        const totalSavedLabel = labels[5]?.message ?? "Total Saved";
        const byGoalTabLabel = labels[6]?.message ?? "By Goal";
        const byAccountTabLabel = labels[7]?.message ?? "By Account";
        const goalNameLabel = labels[8]?.message ?? "Goal Name";
        const goalTypeLabel = labels[9]?.message ?? "Goal Type";
        const goalStatusLabel = labels[10]?.message ?? "Status";
        const goalCurrentLabel = labels[11]?.message ?? "Current";
        const goalTargetLabel = labels[12]?.message ?? "Target";
        const goalRemainingLabel = labels[13]?.message ?? "Remaining";
        const goalProgressPercentageLabel = labels[14]?.message ?? "Progress Percentage";
        const goalTargetDateLabel = labels[15]?.message ?? "Target Date";
        const emptyStateTitle = labels[16]?.message ?? "No Goals Yet";
        const emptyStateDescription = labels[17]?.message ?? "Create your first financial goal to start tracking your progress";
        const emptyStateCtaLabel = labels[18]?.message ?? "Create Goal";
        const createGoalHeaderLabel = labels[19]?.message ?? "Create Goal";
        const targetNameFieldLabel = labels[20]?.message ?? "Target Name";
        const targetAmountFieldLabel = labels[21]?.message ?? "Target Amount";
        const goalTimelineSectionLabel = labels[22]?.message ?? "Goal Timeline";
        const timelineSetOptionLabel = labels[23]?.message ?? "Set";
        const timelineSetOptionDescription = labels[24]?.message ?? "I need this money by a specific date";
        const timelineDontSetOptionLabel = labels[25]?.message ?? "Don't Set";
        const timelineDontSetOptionDescription = labels[26]?.message ?? "I'll save regularly and see when I reach it";
        const startByFieldLabel = labels[27]?.message ?? "Start By";
        const endByFieldLabel = labels[28]?.message ?? "End By";
        const monthlySavingsFieldLabel = labels[29]?.message ?? "Monthly Savings";
        const linkAccountSectionLabel = labels[30]?.message ?? "Link Account";
        const accountSelectorLabel = labels[31]?.message ?? "Select an account";
        const accountSelectorDescription = labels[32]?.message ?? "Choose where to save your money";
        const createGoalCtaLabel = labels[33]?.message ?? "Create Goal";
        const goalDetailsModalHeader = labels[34]?.message ?? "Goal Details";
        const progressRingLabel = labels[35]?.message ?? "Complete";
        const statCurrentLabel = labels[36]?.message ?? "Current";
        const statTargetLabel = labels[37]?.message ?? "Target";
        const statRemainingLabel = labels[38]?.message ?? "Remaining";
        const infoTargetDateLabel = labels[39]?.message ?? "Target Date";
        const infoMonthlySavingsLabel = labels[40]?.message ?? "Monthly Savings";
        const infoCurrentSavingsLabel = labels[41]?.message ?? "Current Savings";
        const infoSpentAmountLabel = labels[42]?.message ?? "Spent Amount";
        const editButtonLabel = labels[43]?.message ?? "Edit";
        const addButtonLabel = labels[44]?.message ?? "Add";
        const addMoneyModalHeader = labels[45]?.message ?? "Add Money to Goal";
        const fromAccountLabel = labels[46]?.message ?? "From Account";
        const currentContributionLabel = labels[47]?.message ?? "Current Contribution";
        const afterContributionLabel = labels[48]?.message ?? "After Contribution";
        const confirmContributionCtaLabel = labels[49]?.message ?? "Confirm Contribution";
        const withdrawModalHeader = labels[50]?.message ?? "Withdraw from goal";
        const withdrawFromAccountLabel = labels[51]?.message ?? "From Account";
        const withdrawUsageSectionLabel = labels[52]?.message ?? "How do you want to use this money?";
        const SpendCustomAmountDescription = labels[53]?.message ?? "Spend from your available balance. The total amount saved will not be affected.";
        const deletegoalContent = labels[54]?.message ?? "Are you sure you want to delete this goal?";
        const recentActivityLabel = labels[55]?.message ?? "Recent Activity";
        const byaccountBalance = labels[56]?.message ?? "Balance";
        const byaccountEmptyHead = labels[57]?.message ?? "No Goals Yet";
        const byaccountEmptyDescription = labels[58]?.message ?? "Create your first financial goal to start tracking your progress";
         const SpendCustomAmountTitle = labels[59]?.message ?? "Spend a Custom Amount";
        const withdrawCustomAmountTitle = labels[60]?.message ?? "Withdraw for Another Purpose";
        const withdrawCustomAmountDescription = labels[61]?.message ?? "Your overall goal progress and amount saved will be reduced.";


        return {
            title,
            totalProgressLabel,
            completeLabel,
            activeGoalsLabel,
            completedLabel,
            totalSavedLabel,
            byGoalTabLabel,
            byAccountTabLabel,
            goalNameLabel,
            goalTypeLabel,
            goalStatusLabel,
            goalCurrentLabel,
            goalTargetLabel,
            goalRemainingLabel,
            goalProgressPercentageLabel,
            goalTargetDateLabel,
            emptyStateTitle,
            emptyStateDescription,
            emptyStateCtaLabel,
            createGoalHeaderLabel,
            targetNameFieldLabel,
            targetAmountFieldLabel,
            goalTimelineSectionLabel,
            timelineSetOptionLabel,
            timelineSetOptionDescription,
            timelineDontSetOptionLabel,
            timelineDontSetOptionDescription,
            startByFieldLabel,
            endByFieldLabel,
            monthlySavingsFieldLabel,
            linkAccountSectionLabel,
            accountSelectorLabel,
            accountSelectorDescription,
            createGoalCtaLabel,
            goalDetailsModalHeader,
            progressRingLabel,
            statCurrentLabel,
            statTargetLabel,
            statRemainingLabel,
            infoTargetDateLabel,
            infoMonthlySavingsLabel,
            infoCurrentSavingsLabel,
            infoSpentAmountLabel,
            editButtonLabel,
            addButtonLabel,
            addMoneyModalHeader,
            fromAccountLabel,
            currentContributionLabel,
            afterContributionLabel,
            confirmContributionCtaLabel,
            withdrawModalHeader,
            withdrawFromAccountLabel,
            withdrawUsageSectionLabel,
            withdrawCustomAmountDescription,
            deletegoalContent,
            recentActivityLabel,
            byaccountBalance,
            byaccountEmptyHead,
            byaccountEmptyDescription,
            SpendCustomAmountDescription,
            withdrawCustomAmountTitle,
            SpendCustomAmountTitle
        };
    }, [byScreen]);
}