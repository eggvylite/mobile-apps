import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import appLog from '../constants/logger';

export const DashBordStatus = Object.freeze({
  CONNECT_BANK: 'CONNECT_BANK',
  WAGEVERIFICATION: 'WAGEVERIFICATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  SHOWALLFEATURE: 'SHOWALLFEATURE',
});

const selectChirp = (state) => state.auth?.storedata?.chirp;
const selectRequestStatus = (state) => state.auth?.storedata?.request_status;
const selectWages = (state) => state.customer?.cusDetails?.wages;
const selectActiveSubscription = (state) => state.customer?.cusDetails?.subscription;

export default function useDashBordFeatureFlow() {
  const chirp = useSelector(selectChirp);
  const wages = useSelector(selectWages);
  const requestStatus = useSelector(selectRequestStatus);
  const activeSubscription = useSelector(selectActiveSubscription);

  return useMemo(() => {
    if (chirp === 'No') return DashBordStatus.CONNECT_BANK;
    if (wages === 'No') return DashBordStatus.WAGEVERIFICATION;
    if (wages === 'Yes' && requestStatus === 'Yes' && activeSubscription === 'No') {
      return DashBordStatus.SUBSCRIPTION;
    }
    if (activeSubscription === 'Yes') return DashBordStatus.SHOWALLFEATURE;
    return DashBordStatus.CONNECT_BANK;
  }, [chirp, wages, requestStatus, activeSubscription]);
}