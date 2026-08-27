import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDate } from '../screens/main/dashboard/hooks/useDashboardUtils';
import { getavgMonthlydailybalance } from '../constants/content';
import { apiformatDate } from '../utill/Utills';
import { setSelectedAccount } from '../redux/slices/accountSlice';


const changeformat = (date) => moment(new Date(date)).format('YYYY-MM-DD');

export const useTransactionData = () => {
    const dispatch = useDispatch();
    const { records } = useSelector((state) => state.statement);
    const { accountdata, defaccount } = useSelector((state) => state.account);
    const { dashboard } = useSelector((state) => state.menuicons);

    const [date, setDate] = useState(new Date());
    const [defbankid, setDefbankid] = useState('');
    const [accId, setaccId] = useState('');
    const [availBal, setAvailBal] = useState('');
    const [recentTransation, setRecentTransation] = useState([]);
    useEffect(() => {
        if (accountdata && defaccount?.length > 0) {
            const defaccid = defaccount.find((obj) => obj.account_default === 'Yes') || defaccount[0];
            if (defaccid) {
                setDefbankid(defaccid.bank_id);
                setaccId(defaccid.guid);
                setAvailBal(defaccid.balance);
            }
        }
    }, [accountdata, defaccount]);

    useEffect(() => {
        if (records && accId && defbankid) {
            const ch = records.filter((item) => {
                const txDate = changeformat(item.transacted_at);
                const matchAccount = item.account_guid === accId && item.bank_id === defbankid;

                return matchAccount;
            });

            setRecentTransation(ch);
        }
    }, [date, accId, defbankid, records]);

    return {
        date,
        setDate,
        accId,
        defbankid,
        availBal,
        recentTransation,
    };
};