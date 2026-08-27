import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { dropdownacc } from "../utill/Utills";



const useDashboardAccount = () => {
  const { accountdata, defaccount } = useSelector((state) => state.account);
  const [defbankid, setDefbankid] = useState("");
  const [accId, setaccId] = useState("");
  const [availBal, setAvailBal] = useState("");
  const [accountArr, setAccountarr] = useState([]);

  useEffect(() => {
    if (0 < defaccount?.length) {
      const acc = dropdownacc(defaccount);
      setAccountarr(acc);
    }
  }, [defaccount]);

  useEffect(() => {
    if (accountdata) {
      if (0 < defaccount?.length) {
        var defaccid = defaccount.find((obj) => obj.account_default === "Yes") || defaccount[0];
        if (defaccid) {
            setDefbankid(defaccid.bank_id);
            setaccId(defaccid.guid);
            setAvailBal(defaccid.balance);
        }
      }
    }
  }, [accountdata, defaccount]);

  return {
    accId,
    setaccId,
    defbankid,
    setDefbankid,
    availBal,
    setAvailBal,
    accountArr,
  };
};

export default useDashboardAccount;
