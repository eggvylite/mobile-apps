import React, { useEffect, useState, useContext } from 'react';
import { Text, View, TouchableOpacity, Platform, AppState, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { animationScreen } from '../../constants/content';
import Splash from '../screens/auth/Splash'
import Intro from '../screens/auth/Intro';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import LocationPicker from '../screens/auth/LocationPicker';
import VerifyEmail from '../screens/auth/VerifyEmail';
import CreatePIN from '../screens/auth/CreatePIN';
import LoginPIN from '../screens/auth/LoginPIN';
import VerifyOTP from '../screens/auth/VerifyOTP';
import Main from '../screens/main/Main';
import ForgotOTP from '../screens/auth/ForgotOTP';
import SwitchDevice from '../screens/auth/SwitchDevice';
import Switchlogout from '../screens/auth/Switchlogout';
import WebScreen from '../../WebScreen';
import ConnectBank from '../screens/main/connect_bank_account/ConnectBank';
import NotificationDestailsScreen from '../widgets/NotificationDestailsScreen';
import OfferDetailsScreen from '../screens/main/Offers/OfferDetailsScreen';
import OfferSummaryScreen from '../screens/main/Offers/OfferSummaryScreen';
import AdvanceSuccess from '../screens/main/advance/AdvanceSuccess';


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
            <Stack.Screen name="LocationPicker" component={LocationPicker} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
            <Stack.Screen name="ForgotOTP" component={ForgotOTP} />
            <Stack.Screen name="CreatePIN" component={CreatePIN} />
            <Stack.Screen name="LoginPIN" component={LoginPIN} />
            <Stack.Screen name="SwitchDevice" component={SwitchDevice} />
            <Stack.Screen name="Switchlogout" component={Switchlogout} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="WebScreen" component={WebScreen} />
            <Stack.Screen  name='NotificationDestailsScreen'  component={NotificationDestailsScreen}/>
            <Stack.Screen  name='OfferDetailsScreen'  component={OfferDetailsScreen}/>
            <Stack.Screen  name='OfferSummaryScreen'  component={OfferSummaryScreen}/>
            <Stack.Screen name='AdvanceSuccess' component={AdvanceSuccess} />


        </Stack.Navigator>
    )

}

export default Route