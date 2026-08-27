import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { animationScreen } from '../../constants/content';
import { CommonScreens } from './CommonRoute';
import Goal from '../screens/main/bottomMenu/Goal';
import CreateGoalStep1 from '../screens/main/goal/CreateGoalStep1';
import CreateGoalStep2 from '../screens/main/goal/CreateGoalStep2';

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
       <Stack.Screen name="CreateGoalStep1" component={CreateGoalStep1} options={{
      }} />
       <Stack.Screen name="CreateGoalStep2" component={CreateGoalStep2} options={{
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

export default GoalRoute