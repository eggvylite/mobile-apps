import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../RootNavigation';
import { animationScreen } from '../../constants/content';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { CommonScreens } from './CommonRoute';
import Offers from '../screens/main/offers/Offers';


const Stack = createNativeStackNavigator();

function OffersRoute({ route }) {
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

      <Stack.Screen
        name="Offers"
        component={Offers}
        // Pass parent route params to the screen
        initialParams={route.params}
        options={{
          animation: 'none',
        }}
      />

      {CommonScreens.map((screen) => (
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