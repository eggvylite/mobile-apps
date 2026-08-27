import { useState, useEffect } from 'react';
import moment from 'moment';

export default function useCountdownTimer(targetDate) {
    const [timeData, setTimeData] = useState({
        days: '0',
        hours: '00',
        minutes: '00',
        seconds: '00',
        formatted: '0.00.00.00'
    });

    useEffect(() => {
        if (!targetDate) return;

        const expiryTime = moment(targetDate);

        const updateTimer = () => {
            const now = moment();
            const diff = moment.duration(expiryTime.diff(now));

            if (diff.asMilliseconds() <= 0) {
                setTimeData({
                    days: '0',
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                    formatted: '0.00.00.00'
                });
                return;
            }

            const d = Math.floor(diff.asDays());
            const h = diff.hours();
            const m = diff.minutes();
            const s = diff.seconds();

            const pad = (num) => num.toString().padStart(2, '0');

            setTimeData({
                days: d.toString(),
                hours: pad(h),
                minutes: pad(m),
                seconds: pad(s),
                formatted: `${d}.${pad(h)}.${pad(m)}.${pad(s)}`
            });
        };


        updateTimer();


        const interval = setInterval(updateTimer, 1000);


        return () => clearInterval(interval);
    }, [targetDate]);

    return timeData;
}
