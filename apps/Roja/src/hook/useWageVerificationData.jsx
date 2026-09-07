import { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import useWageStatus, { WageStatus } from './wageStatushook';
import useDefultBankDetailsHook from './useDefultBankDetailsHook';
// import useDefultBankDetailsHook from '../screens/main/connect_bank_account/hooks/useDefultBankDetailsHook';
import { WORKFLOW_CONSTANT } from '../constants/workflowConstents';
import { useTransactionData } from './useTransactionData';
import CommonFunction from '../utill/CommonFunction';
import api from '../service/api';
// import { useUpdateAuthField } from './userSessionUpdatehook';
import { fetchAuth } from '../redux/slices/authSlice';
import { fetchCustomer } from '../redux/slices/customerSlice';
import { useDashboardUtils } from './useDashboardUtils';
import useBankConnectionLabelFlow from './Labels/useBankConnectionMagemntLableHook';

export const STATUS_COLORS = {
    completed: '#2FA948',
    'in-progress': '#F57C00',
    pending: '#BDBDBD',
};

const selectWorkflowCms = (state) => state.workflowLabel?.workflow;

const useWageVerificationData = () => {
    const dispatch = useDispatch();
    const { themedata } = useSelector((state) => state.appcolor);
    const { storedata } = useSelector((state) => state.auth);
    const { bankdata } = useSelector((state) => state.bank);
    const { recentTransation } = useTransactionData();
    const { formatDate, formatTime } = useDashboardUtils();

    const workflowCms = useSelector(selectWorkflowCms);
    const workflow = workflowCms?.[WORKFLOW_CONSTANT.BANKCONNECTINGCOUNT.ID];
    const wageStatus = useWageStatus();
    const { defaultBankName, defaultBankAccountType } = useDefultBankDetailsHook();

    const currency = storedata?.currency || '$';

    const connectedRecord = useMemo(() => {
        return bankdata?.records?.find((item) => item?.chirp_request_status === 'Yes');
    }, [bankdata]);

        const { bankAccountDataLabel, wageConnectionLabelData } = useBankConnectionLabelFlow()



    const DEFAULT_STEPS = useMemo(() => [
        {
            id: 'bank',
            title: 'Bank Connected',
            subtitle: `${defaultBankName} ${defaultBankAccountType}`.trim() || 'Chase checking ****0987',
            status: 'completed',
            icon: 'check-circle',
            date: connectedRecord?.createdAt ? formatDate(connectedRecord.createdAt): '',
        },
        {
            id: 'analyzed',
            title: 'Transaction Analyzed',
            subtitle: '90 days of activity reviewed',
            status: 'completed',
            icon: 'check-circle',
            date: connectedRecord?.createdAt ? formatDate(connectedRecord.createdAt) : '',
        },
        {
            id: 'income',
            title: 'Income Verified',
            subtitle: 'Reviewing selected transactions',
            status: wageStatus === WageStatus.PROCESSING ? 'in-progress' : (wageStatus === WageStatus.VERIFIED ? 'completed' : 'pending'),
            icon: wageStatus === WageStatus.PROCESSING ? 'clock' : (wageStatus === WageStatus.VERIFIED ? 'check-circle' : 'hourglass-half'),
            date: wageStatus === WageStatus.PROCESSING ? 'In progress' : (wageStatus === WageStatus.VERIFIED ? 'Verified' : 'Pending'),
        },
        {
            id: 'eligibility',
            title: 'Eligibility Decision',
            subtitle: 'Awaiting verification completion',
            status: wageStatus === WageStatus.VERIFIED ? 'completed' : 'pending',
            icon: wageStatus === WageStatus.VERIFIED ? 'check-circle' : 'hourglass-half',
            date: wageStatus === WageStatus.VERIFIED ? 'Approved' : 'Pending',
        },
    ], [defaultBankName, defaultBankAccountType, connectedRecord, wageStatus]);

    const expiryTime = useMemo(() => {
        const settingtimedays = Number(workflow) || 2;
        const bankConnectDate = connectedRecord?.createdAt;
        return bankConnectDate ? moment(bankConnectDate).add(settingtimedays, 'days') : null;
    }, [connectedRecord, workflow]);

    const incomeTransactions = useMemo(() => {
        return (recentTransation || [])
            .filter(item => item?.type?.toUpperCase() === 'CREDIT')
            .map(item => ({
                id: item._id,
                date: item.transacted_at,
                category: item?.category,
                description: item.description,
                amount: currency + CommonFunction.formatamount(item.amount),
                is_direct_deposit: item?.is_direct_deposit,
                is_income: item?.is_income,
            }));
    }, [recentTransation, currency]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitWageVerification = useCallback(async (transactionIds, isPaydayConfirmed) => {
        setIsSubmitting(true);

        try {
            const res = await api.post(`customer/verifywage/${storedata?.id}`, {
                transactionIds,
                is_payday_confirmed: isPaydayConfirmed,
            });

            dispatch(fetchAuth());
              dispatch(fetchCustomer() )
            CommonFunction.message(res?.data?.message ?? '')
            return { success: true, message: res?.data?.message };
        } catch (error) {

            dispatch(fetchAuth());

            return {
                success: false,
                message: error?.response?.data?.message ?? 'Failed to submit verification. Please try again.'
            };
        } finally {
            setIsSubmitting(false);
        }
    }, [dispatch]);

    return {

        wageStatus,
        WageStatus,
        defaultBankName,
        defaultBankAccountType,
        expiryTime,
        DEFAULT_STEPS,
        STATUS_COLORS,
        incomeTransactions,
        submitWageVerification,
        isSubmitting
    };
};

export default useWageVerificationData;
