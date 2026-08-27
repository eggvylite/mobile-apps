import { useMemo } from "react";
import { useSelector } from "react-redux";
import useDashboardAccount from "./useDashboardAccount";


export default function useDefultBankDetailsHook() {
  const {
    accId,
    setaccId,
    defbankid,
    availBal,
    accountArr,
  } = useDashboardAccount();

  const { bankdata } = useSelector((state) => state.bank);

  const connectedRecord = useMemo(() => {
    return bankdata?.records?.find(
      (item) => item?.chirp_request_status === "Yes"
    );
  }, [bankdata]);

  const defaultBank = useMemo(() => {
    return accountArr?.find((item) => item.guid === accId) || null;
  }, [accountArr, accId]);

  const defaultBankAccountType = defaultBank?.type ?? "";
  const defaultBankName = connectedRecord?.bank_name ?? "";

  return {
    accId,
    setaccId,
    defbankid,
    availBal,
    accountArr,
    defaultBank,
    defaultBankName,
    defaultBankAccountType,
  };
}