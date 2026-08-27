import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { animationScreen } from '../../constants/content';
import Offers from '../screens/main/bottomMenu/Offers';
import { CommonScreens } from './CommonRoute';



const Stack = createNativeStackNavigator();

function OffersRoute({ route }) {
    const activeIndex = route?.params?.activeindex || 1

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.getParent()?.addListener('tabPress', () => {
            navigation.popToTop();
        });

        return unsubscribe;
    }, [navigation]);


    return (
        <Stack.Navigator
            initialRouteName="Offers"
            screenOptions={{
                animation: animationScreen.default,
                headerShown: false,
                gestureEnabled: false,
            }}
        >

            <Stack.Screen name="Offers" component={Offers} initialParams={{
                activeindex: activeIndex,
            }} options={{
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

export default OffersRoute