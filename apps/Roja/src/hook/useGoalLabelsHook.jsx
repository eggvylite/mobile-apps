import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../constants/workflowConstents";
import { appName } from "../service/environment";

const selectByScreen = (state) => state.appscreenlabels.byScreen;

export default function useGoalLabelsHook() {
    const byScreen = useSelector(selectByScreen);

    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.GOAL);
        const labels = record?.labels || [];
        const title = labels[0]?.message ?? "Goals";
        const createGoal = labels[30]?.message ?? "Create a Goal";
        const buttonText = labels[1]?.message ?? "Create Goal";
        const activeTab = labels[3]?.message ?? "Active";
        const completedTab = labels[4]?.message ?? "Completed";
        const emptyGoalHead = labels[16]?.message ?? "Start Your First Savings Goal";
        const emptySmallSubHead = labels[17]?.message ?? "Roja will set up a virtual savings account for you.";
        const emptySubHead = labels[18]?.message ?? `Create a dedicated savings goal with ${appName}. Add money from your linked bank accounts and track your progress as you move closer to achieving your goal.`;
        const goalByAccountTab = labels[2]?.message ?? "Goal by Account";
        const goalByTab = labels[23]?.message ?? "Goal by";

        const viewGoal = labels[11]?.message ?? "View Goal";
        const editGoal = labels[12]?.message ?? "Edit Goal";
        const addFunds = labels[14]?.message ?? "Add Funds to Goal";
        const withdraw = labels[15]?.message ?? "Withdraw from Goal";
        const deleted = labels[13]?.message ?? "Delete Goal";
        const currentSavings = labels[5]?.message ?? "Current Savings";
        const goalAmount = labels[8]?.message ?? "Goal Amount";
        const spendAmount = labels[6]?.message ?? "Spent Amount";
        const stillToSave = labels[7]?.message ?? "Still to Save";
        const endBy = labels[10]?.message ?? "End By";
        const startby = labels[9]?.message ?? "Start By";
        const deletegoalContent = labels[20]?.message ?? " Are you sure you want to delete this goal?";
        const deletegoalYesButton = labels[21]?.message ?? "Yes";
        const deletegoalNoButton = labels[22]?.message ?? "No";
        const withdrawButtomSheetSubHead = labels[24]?.message ?? "How do you want to use this money?";
        const withdrawSpendTitle = labels[25]?.message ?? "Spend a Custom Amount";
        const withdrawWithdrawTitle = labels[27]?.message ?? "Withdraw for Another Purpose";
        const withdrawSpend = labels[26]?.message ?? "Spend from your available balance. The total amount saved will not be affected.";
        const withdrawWithdraw = labels[28]?.message ?? "Withdraw for Another Purpose. Your overall goal progress and amount saved will be reduced.";
        const mothlyContribution = labels[29]?.message ?? "Monthly Contribution";
        const createSubHeader = labels[19]?.message ?? "What are you saving for?";
        const goalNameLable = labels[31]?.message ?? "Goal Name";



        return {
            title,
            buttonText,
            activeTab,
            completedTab,
            emptyGoalHead,
            emptySubHead,
            emptySmallSubHead,
            viewGoal,
            editGoal,
            addFunds,
            withdraw,
            deleted,
            currentSavings,
            goalAmount,
            spendAmount,
            stillToSave,
            endBy,
            deletegoalContent,
            deletegoalYesButton,
            deletegoalNoButton,
            withdrawButtomSheetSubHead,
            withdrawSpendTitle,
            withdrawWithdrawTitle,
            withdrawSpend,
            withdrawWithdraw,
            startby,
            mothlyContribution,
            createSubHeader,
            goalByAccountTab,
            goalByTab,
            createGoal,
            goalNameLable
        };
    }, [byScreen]);
}