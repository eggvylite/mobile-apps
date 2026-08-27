import React from 'react';
import { Text, StyleSheet } from 'react-native';
import useCountdownTimer from '../../hook/useCountdownTimer';

const CountdownTimer = ({ expiryTime, style }) => {
    const { days, hours, minutes, seconds } = useCountdownTimer(expiryTime);

    const displayTimer = days > 0
        ? `${days}d : ${hours}h : ${minutes}m : ${seconds}s`
        : `${hours}h : ${minutes}m : ${seconds}s`;

    return (
        <Text style={[styles.timerValue, style]}>
            {displayTimer}
        </Text>
    );
};

const styles = StyleSheet.create({
    timerValue: {
        fontWeight: '600',
        fontSize: 16,
        color: '#AF5626',
    },
});

export default React.memo(CountdownTimer);
