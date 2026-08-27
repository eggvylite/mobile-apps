import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

const useUserSettings = () => {
    const { storedata } = useSelector((state) => state.auth);

    const formatDate = useCallback(
        (date) => {
            if (!date || !storedata?.format) return '';

            return moment(date).format(storedata.format);
        },
        [storedata],
    );

    const formatTime = useCallback(
        (date) => {
            if (!date || !storedata?.zone) return '';

            return moment.tz(date, storedata.zone).format('hh:mm A');
        },
        [storedata],
    );

    return {
        formatDate,
        formatTime,
    };
};

export default useUserSettings;