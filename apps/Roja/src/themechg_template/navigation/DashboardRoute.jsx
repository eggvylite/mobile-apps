import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../RootNavigation';
import Dashboard from '../screens/main/bottomMenu/Dashboard';
import { animationScreen } from '../../constants/content';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { CommonScreens } from './CommonRoute';


const Stack = createNativeStackNavigator();

function DashboardRoute() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.getParent()?.addListener('tabPress', () => {
      navigation.popToTop();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator screenOptions={{
      animation: 'none',
      headerShown: false,
      gestureEnabled: false,
    }}>
      <Stack.Screen name="Dashboard" component={Dashboard} options={{
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

export default DashboardRoute