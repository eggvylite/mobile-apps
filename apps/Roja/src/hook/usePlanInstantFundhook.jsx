
export const calculateInstantFundFee = (amountValue, feeRanges) => {
    if (!Number.isFinite(amountValue) || amountValue < 0) {
        return 0;
    }

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

    return isPercentageTier ? (amountValue * feeValue) / 100 : feeValue;
};