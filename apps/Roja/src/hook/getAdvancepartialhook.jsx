import { useMemo } from "react";
import { useSelector } from "react-redux";
import { WORKFLOW_CONSTANT } from "../constants/workflowConstents";

const selectWorkflowCms = (state) => state.workflowLabel?.workflow;
const selectAdvanceHistory = (state) => state.advancehistory?.advhistory;
const selectSubscription = (state) => state.subscription?.subscription;

export const usegetAdvancepartialFlow = (amount = 0) => {
    const workflowCms = useSelector(selectWorkflowCms);
    const advhistory = useSelector(selectAdvanceHistory);
    const subscription = useSelector(selectSubscription);

    const workflow = workflowCms?.[WORKFLOW_CONSTANT.GETADVANCEPARTIAL.ID];
    const showWorkflowPartialRepayment = workflowCms?.[WORKFLOW_CONSTANT.ADVANCELIMIT.ID];
    const workflowAdvanceLimit = workflowCms?.[WORKFLOW_CONSTANT.ADVANCELIMIT.ID];
    const workflowAdvanceMinimumLimit = workflowCms?.[WORKFLOW_CONSTANT.MINIMUMADVANCELIMIT.ID];

    const showPartialAmount = workflow === "Partial Advance";
    const showPartialRepayment = showWorkflowPartialRepayment === "Partial Advance";
    const advanceAmountMinimumLimit = workflowAdvanceMinimumLimit ?? 1;

    const advancePendingCount = useMemo(
        () => advhistory?.filter((item) => item?.paid_status === "Pending").length ?? 0,
        [advhistory]
    );

    const instantFundFee = useMemo(() => {
        const amountValue = Number(amount);

        if (!Number.isFinite(amountValue) || amountValue < 0) {
            return 0;
        }

        const feeRanges = subscription?.instant_fund_fee;

        if (!Array.isArray(feeRanges) || feeRanges.length === 0) {
            return 0;
        }

        const matchedRange = feeRanges.find((range) => {
            const start = Number(range?.unit_start);
            const end =
                range?.unit_end === "-" ||
                    range?.unit_end === null ||
                    range?.unit_end === undefined ||
                    range?.unit_end === ""
                    ? Infinity
                    : Number(range?.unit_end);

            return Number.isFinite(start) && amountValue >= start && amountValue <= end;
        });

        return matchedRange ? Number(matchedRange?.instant_fund_fee) || 0 : 0;
    }, [amount, subscription?.instant_fund_fee]);

    const isAdvanceLimitExceeded = useMemo(
        () => (workflowAdvanceLimit?.amount ?? 0) > advancePendingCount,
        [advancePendingCount, workflowAdvanceLimit?.amount]
    );

    return {
        workflow,
        showPartialAmount,
        advanceAmountMinimumLimit,
        advancePendingCount,
        isAdvanceLimitExceeded,
        instantFundFee,
        showPartialRepayment
    };
};