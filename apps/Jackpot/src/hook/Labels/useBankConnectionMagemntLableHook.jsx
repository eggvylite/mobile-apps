import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import appLog from '../../constants/logger';

const selectWorkflowLabels = (state) =>
    state.workflowLabel?.workflowLabels;

const WAGE_CONTENT_LABEL_ID = '6a911fd5e3bf3f7791236f3d';
const BANK_CONTENT_LABEL_ID = '6a911e5de3bf3f7791236efc';
const WAGEPROCESSING_LABEL_ID = '6aa2372cb3908fbd34410fbb'

export default function useBankConnectionLabelFlow(settingKey) {
    const workflowLabels = useSelector(selectWorkflowLabels) || [];

    const bankAccountDataLabel = useMemo(() => {
        return workflowLabels.find(
            (item) => item?.id === BANK_CONTENT_LABEL_ID
        );
    }, [workflowLabels]);

    const wageConnectionLabelData = useMemo(() => {
        return workflowLabels.find(
            (item) => item?.id === WAGE_CONTENT_LABEL_ID
        );
    }, [workflowLabels]);


    const wageProcessingLabels = useMemo(() => {
        return workflowLabels.find(
            (item) => item?.id === WAGEPROCESSING_LABEL_ID
        );
    }, [workflowLabels])




    return {
        bankAccountDataLabel,
        wageConnectionLabelData,
        wageProcessingLabels
    };
}