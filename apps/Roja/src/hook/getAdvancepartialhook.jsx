import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WORKFLOW_CONSTANT } from "../constants/workflowConstents";
import appLog from "../constants/logger";

const selectWorkflowCms = (state) => state.workflowLabel?.workflow;
const selectBankAccounts = (state) => state.bank?.bankdata?.records;

export const usegetAdvancepartialFlow = () => {
    const workflowCms = useSelector(selectWorkflowCms);
    const workflow = workflowCms?.[WORKFLOW_CONSTANT.GETADVANCEPARTIAL.ID];
    const [showPartialAmount, setPartialAmount] = useState(false);



    useEffect(() => {


        if (workflow === 'Partial Advance') {
            setPartialAmount(true)
        } else {
            setPartialAmount(false)
        }
    }, [workflow]);

    return {
        workflow,
        showPartialAmount,
        setPartialAmount,
    };
};