import React, { useEffect, useState, useContext } from 'react';
import { Text, View, TouchableOpacity, Platform, AppState, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/auth/Splash';
import { animationScreen } from '../../constants/content';
import Intro from '../screens/auth/Intro';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import VerifyEmail from '../screens/auth/VerifyEmail';
import VerifyOTP from '../screens/auth/VerifyOTP';
import CreatePIN from '../screens/auth/CreatePIN';
import SwitchDevice from '../screens/auth/SwitchDevice';
import Switchlogout from '../screens/auth/Switchlogout';
import LoginPIN from '../screens/auth/LoginPIN';
import ForgotOTP from '../screens/auth/ForgotOTP';
import Main from '../screens/main/Main';

const Stack = createNativeStackNavigator();
function Route() {
    return (
        <Stack.Navigator
            initialRouteName='Splash'
            screenOptions={{
                animation: animationScreen.default,
                headerShown: false,
                gestureEnabled: false,

            }}>

            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
            <Stack.Screen name="CreatePIN" component={CreatePIN} />
            <Stack.Screen name="LoginPIN" component={LoginPIN} />
            <Stack.Screen name="ForgotOTP" component={ForgotOTP} />
            <Stack.Screen name="SwitchDevice" component={SwitchDevice} />
            <Stack.Screen name="Switchlogout" component={Switchlogout} />
             <Stack.Screen name="Main" component={Main} />




        </Stack.Navigator>
    )

}

export default Route