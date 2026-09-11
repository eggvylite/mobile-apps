import { useMemo } from "react";
import { useSelector } from "react-redux";
import CommonFunction from "../utill/CommonFunction";

export default function useCommonCurrencyFormat(amount) {
    const { storedata } = useSelector((state) => state.auth);

    const formattedAmount = useMemo(() => {
        const currency = storedata?.currency ?? "";
        const formatted = CommonFunction.formatamount(Math.abs(amount));

        return amount < 0
            ? `-${currency}${formatted}`
            : `${currency}${formatted}`;
    }, [amount, storedata?.currency]);

    return formattedAmount;
}