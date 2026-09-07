import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { WORKFLOW_CONSTANT } from "../constants/workflowConstents";
import appLog from "../constants/logger";
import moment from "moment";

const selectWorkflowCms = (state) => state.workflowLabel?.workflow;
const selectAdvanceHistory = (state) => state.advancehistory?.advhistory;
const selectSubscription = (state) => state.subscription?.subscription;

export const usegetAdvancepartialFlow = (amount) => {
    const workflowCms = useSelector(selectWorkflowCms);
    const advhistory = useSelector(selectAdvanceHistory);
    const subscription = useSelector(selectSubscription);

    const workflow = workflowCms?.[WORKFLOW_CONSTANT.GETADVANCEPARTIAL.ID];
    const showWorkflowPartialRepayment = workflowCms?.[WORKFLOW_CONSTANT.ADVANCEREPAYMNET.ID];
    const workflowAdvanceLimit = workflowCms?.[WORKFLOW_CONSTANT.ADVANCELIMIT.ID];
    const workflowAdvanceMinimumLimit = workflowCms?.[WORKFLOW_CONSTANT.MINIMUMADVANCELIMIT.ID];
    const workflowManulFeature = workflowCms?.[WORKFLOW_CONSTANT.MANUALREPAYMENT.ID];



    const showPartialAmount = workflow === "Partial-Advance";
    const showPartialRepayment = showWorkflowPartialRepayment === "Partial-Repayment";
    const [showOprnManualRepaymentOption, seTshoeRepaymentOption] = useState(false)


    const advanceAmountMinimumLimit = workflowAdvanceMinimumLimit ?? 1;
    const getAdvanceLimitCount = workflowAdvanceLimit ?? 0

    const advancePendingCount = useMemo(
        () => advhistory?.filter((item) => item?.paid_status === "Pending").length ?? 0,
        [advhistory]
    );



    // advance_date

    const pendingLast30DaysCount = useMemo(() => {
        const cutoff = moment().subtract(30, "days").startOf("day");

        return advhistory?.filter(
            (item) =>
                item?.payment_status === "Success" || item?.payment_status === 'Partial' &&
                moment().startOf("day").isSameOrAfter(cutoff)
        ).length ?? 0;
    }, [advhistory]);



    useEffect(() => {
        if (workflowManulFeature === 'Turn On Default') {
            seTshoeRepaymentOption(true)
        } else {
            seTshoeRepaymentOption(false)
        }

    }, [workflowManulFeature])




    const instantFundFee = useMemo(() => {
        const amountValue = amount ? Number(amount) : (subscription?.plan_cash_upto ?? 0) - (subscription?.used_advance ?? 0)

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

        if (!matchedRange) {
            return 0;
        }

        const feeValue = Number(matchedRange?.instant_fund_fee) || 0;
        const isPercentageTier =
            matchedRange?.unit_end === "-" ||
            matchedRange?.unit_end === null ||
            matchedRange?.unit_end === undefined ||
            matchedRange?.unit_end === "";

        if (isPercentageTier) {
            return (amountValue * feeValue) / 100;
        }

        return feeValue;
    }, [amount, subscription?.instant_fund_fee]);

    const isAdvanceLimitExceeded = useMemo(
        () => (workflowAdvanceLimit) > pendingLast30DaysCount,
        [advancePendingCount, workflowAdvanceLimit?.amount]
    );




    return {
        workflow,
        showPartialAmount,
        advanceAmountMinimumLimit,
        advancePendingCount,
        isAdvanceLimitExceeded,
        instantFundFee,
        showPartialRepayment,
        showOprnManualRepaymentOption,
        getAdvanceLimitCount, pendingLast30DaysCount
    };
};