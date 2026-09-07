import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import timezone from 'moment-timezone';
import CommonFunction from '../utill/CommonFunction';
import { themeColors } from '../template_basic/Common';


export const useDashboardUtils = () => {
    const { storedata } = useSelector((state) => state.auth);


    const formatTime = useCallback((date) => {
        if (!date || !storedata?.zone) return '';
        return timezone(date).tz(storedata.zone).format('hh:mm A');
    }, [storedata?.zone]);


    const formatDate = useCallback((date) => {
        if (!date || !storedata?.format) return '';
        return moment(date).format(storedata.format);
    }, [storedata?.format]);

    const formatMonthYear = useCallback((date) => {
        if (!date) return '';
        return moment(new Date(date)).format('MMM-YYYY');
    }, []);


    const formatFullDate = useCallback((date) => {
        if (!date) return '';
        const d = new Date(date);
        return `On ${d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
    }, []);


    const calculateDaysAgo = useCallback((date) => {
        if (!date) return 0;
        const now = new Date();
        const due = new Date(date);
        const differenceInTime = now - due;
        return Math.floor(differenceInTime / (1000 * 3600 * 24));
    }, []);


    const getDueDateColor = useCallback((date) => {
        const countdays = calculateDaysAgo(date);
        if (countdays === 0) {
            return themeColors?.danger;
        } else if (countdays > 0) {
            return themeColors?.warning;
        } else {
            return themeColors?.text_primary || '#000';
        }
    }, [calculateDaysAgo, themeColors]);


    const getTransactionTypeColor = useCallback((type) => {
        return type === 'CREDIT' ? themeColors.success : themeColors.danger;
    }, [themeColors]);


    const formatAmount = useCallback((amount) => {
        return CommonFunction.formatamount(amount);
    }, []);

    const calculateNextRefreshTime = useCallback((time, refreshHours) => {
        if (!time) return null;
        const date = new Date(time);
        date.setHours(date.getHours() + (refreshHours || 0));
        const zone = storedata.zone;
        if (!zone) return date;
        const df = timezone(date).tz(zone);
        return new Date(df.format());
    }, [storedata.zone]);

    return {
        formatTime,
        formatDate,
        formatMonthYear,
        formatFullDate,
        calculateDaysAgo,
        getDueDateColor,
        getTransactionTypeColor,
        formatAmount,
        calculateNextRefreshTime,
        themeColors,
        storedata,
    };
};




export const getDate = (date = new Date()) => {
  return {
    begin: moment(date).startOf('month').format('YYYY-MM-DD'),
    end: moment(date).endOf('month').format('YYYY-MM-DD'),
  };
};