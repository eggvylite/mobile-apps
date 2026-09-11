import { useMemo } from "react";
import { useSelector } from "react-redux";
import { COMMONSCREENLABELSIDS } from "../../constants/workflowConstents";

const selectByScreen = (state) => state.labels.record;


export default function useBudgetLablehook() {
    const byScreen = useSelector(selectByScreen);


    return useMemo(() => {
        const record = byScreen?.find((r) => r._id === COMMONSCREENLABELSIDS.BUDGET);
        const labels = record?.labels || [];

        const title = labels[0]?.message ?? "Budget";
        const budget = {
            addtransaction: labels[1]?.message ?? "Add Transaction",
            monthlysummary: labels[2]?.message ?? "Monthly Summary",
            setbudget: labels[3]?.message ?? "Set Budget",
            overallplannedbudget: labels[4]?.message ?? "Planned Budget",
            overallactualspend: labels[5]?.message ?? "Actual Spending",
            overallleftospend: labels[6]?.message ?? "Left to Spend",
            overallprogress: labels[7]?.message ?? "Overall Progress",
            categories: labels[8]?.message ?? "Categories",
            add: labels[9]?.message ?? "Add",
            addgrp: labels[10]?.message ?? "Add Group",
            addcat: labels[11]?.message ?? "Add Category",
            grpoverview: labels[12]?.message ?? "Overview",
            editgrp: labels[13]?.message ?? "Edit Group",
            delgrp: labels[14]?.message ?? "Delete Group",
            grpplannedbudget: labels[15]?.message ?? "Planned Budget",
            grpactualspend: labels[16]?.message ?? "Actual Spending",
            grplefttospend: labels[17]?.message ?? "Left to Spend",
            spend: labels[18]?.message ?? "Spend",
            nobudgetset: labels[19]?.message ?? "No Budget Set",
            nocategoryyset: labels[20]?.message ?? "No categories yet",
            tabplusaddcat: labels[21]?.message ?? "Tap the + button above to add your first category",
            translinkgroupdel: labels[22]?.message ?? "This group in the category is used in existing transactions. Would you like to move it to ‘Uncategorized’ or delete it?",
            grpdle: labels[23]?.message ?? "Are you sure you want to delete this group?",
            move: labels[24]?.message ?? "Move",
            delete: labels[25]?.message ?? "Delete",
            yes: labels[26]?.message ?? "yes",
            no: labels[27]?.message ?? "No",
            select_cat_add_edit_budget: labels[28]?.message ?? "Select a category to set or edit budget",
            searchcategories:labels[29]?.message ?? "Search categories...",
            nosearchmatch:labels[30]?.message ?? "No categories match",
            createcategoryfirst:labels[31]?.message ?? "Create your first category to start budgeting",
            clearsearch: labels[32]?.message ?? "Clear Search"
        }



        return {
            budget
        };
    }, [byScreen]);
}