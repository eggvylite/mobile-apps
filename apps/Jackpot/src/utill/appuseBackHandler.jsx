import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export const appuseBackHandler = (callback) => {
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                return callback();
            };

            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => subscription.remove();
        }, [callback])
    );
};