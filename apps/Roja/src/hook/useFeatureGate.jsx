import { useSelector } from 'react-redux';
import { resolveFeatureFlow } from './useSubscriptionGate';
import appLog from '../constants/logger';


const selectAccounts = (state) => state.customer?.cusDetails;
const selectActiveSubscription = (state) => state.customer?.cusDetails?.subscription;
const selectWorkflowCms = (state) => state.workflowLabel?.workflow;
const selectWorkflowlables = (state) => state.workflowLabel?.workflowLabels;

export default function useFeatureFlow(settingKey) {
    const accounts = useSelector(selectAccounts);
    const activeSubscription = useSelector(selectActiveSubscription);
    const workflowCms = useSelector(selectWorkflowCms);
    const { storedata } = useSelector((state) => state.auth);
    const { subscription, allsubscription, subloading, suberror } = useSelector(
        (state) => state.subscription
    );

    const isSubscribed = activeSubscription === 'Yes';
    const isBankConnected = storedata?.request_status === 'Yes';
    const wageVerificationStatus = accounts?.wages === 'Yes';
    const wagescount = accounts?.wagescount;
    const workflowLabels = useSelector(selectWorkflowlables) || [];
    const activatlable = Array.isArray(workflowLabels) ? workflowLabels : [];

    const chirpConnect = storedata?.chirp === 'Yes';

    const hasWorkflowId = Boolean(settingKey?.ID);
    const workflow = hasWorkflowId ? workflowCms?.[settingKey.ID] : undefined;
    const activeFeature = !settingKey?.SUBID
        ? true
        : Boolean(subscription?.plan_features?.includes(settingKey.SUBID));


    const { state, title } = resolveFeatureFlow({
        workflow,
        hasWorkflowId,
        isBankConnected,
        isSubscribed,
        wageVerificationStatus,
        chirpConnect,
        activeFeature,
        wagescount,
        activatlable,
        settingKey
    });

    return {
        state,
        title,
        workflow,
        isBankConnected,
        isSubscribed,
        wageVerificationStatus,
        chirpConnect,
        activeFeature,
        subloading,
        suberror,
        allsubscription,
        wagescount,
        activatlable,

    };
}