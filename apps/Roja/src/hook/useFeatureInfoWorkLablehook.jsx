import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { resolveFeatureFlow } from './useSubscriptionGate';
import { WORKFLOW_SCREEN_LABEL_IDS } from '../constants/workflowConstents';

const selectAccounts = (state) => state.customer?.cusDetails;
const selectActiveSubscription = (state) =>
  state.customer?.cusDetails?.subscription;
const selectWorkflowCms = (state) => state.workflowLabel?.workflow;
const selectWorkflowLabels = (state) =>
  state.workflowLabel?.workflowInfoLable;
const selectAuthStoreData = (state) => state.auth?.storedata;

const findLabel = (labels, id) => {
  if (!Array.isArray(labels) || !id) return null;
  return labels.find((item) => item?.id === id) ?? null;
};

export default function useFeatureWorkInfoLabel(settingKey) {
  const accounts = useSelector(selectAccounts);
  const activeSubscription = useSelector(selectActiveSubscription);
  const workflowCms = useSelector(selectWorkflowCms);
  const workflowLabels = useSelector(selectWorkflowLabels);
  const storedata = useSelector(selectAuthStoreData);

  const hasWorkflowId = Boolean(settingKey?.ID);

  const flags = useMemo(
    () => ({
      isSubscribed: activeSubscription === 'Yes',
      isBankConnected: storedata?.request_status === 'Yes',
      wageVerificationStatus: accounts?.wages === 'Yes',
      wagesCount: accounts?.wagescount,
      chirpConnect: storedata?.chirp === 'Yes',
    }),
    [activeSubscription, storedata, accounts]
  );

  const { isSubscribed, isBankConnected, wageVerificationStatus, wagesCount } =
    flags;

  const workflow = useMemo(
    () => (hasWorkflowId ? workflowCms?.[settingKey.ID] : undefined),
    [hasWorkflowId, workflowCms, settingKey]
  );

  const featureLabel = useMemo(() => {
    if (!wageVerificationStatus) {
      if (wagesCount === 0) {
        return findLabel(workflowLabels, WORKFLOW_SCREEN_LABEL_IDS.WAGE_VERIFY);
      }
      if (wagesCount === 1) {
        return findLabel(
          workflowLabels,
          WORKFLOW_SCREEN_LABEL_IDS.WAGE_REVIEWING
        );
      }
      return null;
    }

    if (!isSubscribed) {
      return findLabel(
        workflowLabels,
        WORKFLOW_SCREEN_LABEL_IDS.FEATURE_UNAVAILABLE
      );
    }

    if (!isBankConnected) {
      return findLabel(workflowLabels, WORKFLOW_SCREEN_LABEL_IDS.CONNECT_BANK);
    }

    return null;
  }, [workflowLabels, wageVerificationStatus, wagesCount, isSubscribed, isBankConnected]);

  return {
    ...flags,
    workflow,
    featureLabel,
  };
}