import { useMemo } from "react";
import { useSelector } from "react-redux";
import appLog from "../../constants/logger";

const selectWorkflowlables = (state) => state.workflowLabel?.workflowLabels;

export default function useWorkFlowLabelsManagement(settingKey) {
    const workflowLabels = useSelector(selectWorkflowlables) || [];
    const WDACONTENT_IDS = {
        mainHeaderContent: "6a92a98679863b15eb4f4259",
        featureHowItWorks: "6a92af319278291f5df36348",
        whatIsEWAContent: "6a92af469278291f5df36349",
        useOfEWAFeatureContent: "6a92af1b9278291f5df36347",
    };


    const findLabel = (labels, id) => {
        if (!Array.isArray(labels) || !id) return null;
        return labels.find(item => item?.id === id);
    };
    const mainHeaderContent = useMemo(() => {
        return findLabel(workflowLabels, WDACONTENT_IDS.mainHeaderContent)
    }, [workflowLabels])

    const featureHowItWorks = useMemo(() => {
        return findLabel(workflowLabels, WDACONTENT_IDS.useOfEWAFeatureContent)
    }, [workflowLabels])



    const whatIsEWAContent = useMemo(() => {
        return findLabel(workflowLabels, WDACONTENT_IDS.featureHowItWorks)
    }, [workflowLabels])
    const useOfEWAFeatureContent = useMemo(() => {
        return findLabel(workflowLabels, WDACONTENT_IDS.whatIsEWAContent)
    }, [workflowLabels])


    return {
        mainHeaderContent,
        featureHowItWorks,
        whatIsEWAContent,
        useOfEWAFeatureContent
    }

}