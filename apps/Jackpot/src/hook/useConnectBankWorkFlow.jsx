import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WORKFLOW_CONSTANT } from "../constants/workflowConstents";

const selectWorkflowCms = (state) => state.workflowLabel?.workflow;
const selectBankAccounts = (state) => state.bank?.bankdata?.records;

export const useConnectBankWorkFlow = () => {
  const workflowCms = useSelector(selectWorkflowCms);
  const bankAccounts = useSelector(selectBankAccounts);

  const workflow = workflowCms?.[WORKFLOW_CONSTANT.CONNECTBANK.ID];
  const [showBank, setShowBank] = useState(false);


  useEffect(() => {
    const isEnabled = Boolean(workflow?.enabled);
    const requiredAmount = Number(workflow?.amount) || 0;
    const currentConnectBank = bankAccounts?.filter((item) => item?.chirp_request_status === 'Yes')
    const connectedCount = Array.isArray(currentConnectBank) ? currentConnectBank.length : 0;
    const currentConnectBankCount = connectedCount

    if (isEnabled) {
      setShowBank(currentConnectBankCount < requiredAmount+1);
    } else {
      setShowBank(!currentConnectBank?.length);
    }
  }, [workflow, bankAccounts]);

  return {
    workflow,
    showBank,
    setShowBank,
  };
};