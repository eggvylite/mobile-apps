import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../RootNavigation';
import { animationScreen } from '../../constants/content';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { CommonScreens } from './CommonRoute';
import Goal from '../screens/main/bottomMenu/Goal';
import CreateGoalformscreen from '../screens/main/goals/CreateGoalformscreen';
import CreateGoal from '../screens/main/goals/CreateGoal';
import AddFunds from '../screens/main/goals/AddFunds';
import ViewGoal from '../screens/main/goals/ViewGoal';
import Takeout from '../screens/main/goals/Takeout';
import Goalhistory from '../screens/main/goals/Goalhistory';


const Stack = createNativeStackNavigator();

function GoalRoute() {
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
      <Stack.Screen name="Goal" component={Goal} options={{
        animation: 'none',
      }} />
      <Stack.Screen name="CreateGoal" component={CreateGoal} />
      <Stack.Screen name="AddFunds" component={AddFunds} />
      <Stack.Screen name="ViewGoal" component={ViewGoal} />
      <Stack.Screen name="Takeout" component={Takeout} />
      <Stack.Screen name="Goalhistory" component={Goalhistory} />
      <Stack.Screen name="CreateGoalformscreen" component={CreateGoalformscreen} />
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

export default GoalRoute