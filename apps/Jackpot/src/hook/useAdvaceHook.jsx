import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import appLog from "../constants/logger";
import moment from "moment";

export default function useAdvanceHooks() {
  const { advhistory } = useSelector((state) => state.advancehistory);
  const { subscription } = useSelector((state) => state.subscription);
  const { totalBill, activeSub } = useSelector((state) => state.advance);
  const { storedata } = useSelector((state) => state.auth);
  const { cusloading, cuserror, cusDetails } = useSelector((state) => state.customer);

  const [showAdvanceCard, setShowAdvanceCard] = useState(false);

  const maxAdvanceAmount = (activeSub?.plan_cash_upto - totalBill).toFixed(2);
  const customerCashAdvanceLimit = activeSub?.plan_cash_upto ?? 0
  const appCurrency = storedata?.currency ?? '$'
  const rePaymentDate = moment();
  const payment_frequency = cusDetails?.payment_frequency ?? ''
  const payRollDay = cusDetails?.payrolldate ?? ''



  const repaymentDate = moment(cusDetails?.upcomingpayrolldate);


  const remainingDays = useMemo(() => {
    const currentDate = moment();
    const currentRiningDay = repaymentDate.diff(currentDate, 'days');
    return 0 < currentRiningDay ? currentRiningDay : 0;
  }, [repaymentDate]);


  useEffect(() => {
    setShowAdvanceCard(totalBill >= activeSub?.plan_cash_upto);
  }, [totalBill, activeSub]);




  const pendingPaymentList = useMemo(
    () =>
      advhistory
        ?.filter(
          (item) => item?.paid_status === "Pending" || item?.paid_status === "Partial"
        )
        ?.reverse() ?? [],
    [advhistory]
  );


  const successPaymentList = useMemo(
    () => advhistory?.filter((item) => item?.paid_status === "Success" || item?.paid_status === "Partial") ?? [],
    [advhistory]
  );



  return {
    advhistory,
    subscription,
    totalBill,
    activeSub,
    storedata,
    maxAdvanceAmount,
    showAdvanceCard,
    customerCashAdvanceLimit,
    appCurrency,
    pendingPaymentList,
    successPaymentList,
    remainingDays,
    repaymentDate,
    payment_frequency,
    payRollDay
  };
}