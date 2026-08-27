import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Insights from '../screens/main/bottomMenu/Insights';
import { animationScreen } from '../../constants/content';
import { CommonScreens } from './CommonRoute';


const Stack = createNativeStackNavigator();

function InsightsRoute() {

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.getParent()?.addListener('tabPress', () => {
            navigation.popToTop();
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <Stack.Navigator screenOptions={{
            animation: animationScreen.default,
            headerShown: false,
            gestureEnabled: false,
        }}>
            <Stack.Screen name="Insights" component={Insights} options={{
                animation: 'none',
            }} />

            {CommonScreens.map(screen => (
                <Stack.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                />
            ))}

        </Stack.Navigator>
    )
}

export default InsightsRoute