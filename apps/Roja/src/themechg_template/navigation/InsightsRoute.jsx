import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { navigationRef } from '../../RootNavigation';
import Insights from '../screens/main/bottomMenu/Insights';
import { animationScreen } from '../../constants/content';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { CommonScreens } from './CommonRoute';
import IncomeVsExp from '../screens/main/insights/Transaction/IncomeVsExp';
import ATM from '../screens/main/insights/Transaction/Atm';
import Nsf from '../screens/main/insights/Transaction/Nsf';
import Repayment from '../screens/main/insights/Transaction/Repayment';
import FeeAnalysis from '../screens/main/insights/Transaction/FeeAnalysis';
import LoanPayment from '../screens/main/insights/Transaction/LoanPayment';
import BudgetVariance from '../screens/main/insights/Categories/BudgetVariance';
import SpendingCategories from '../screens/main/insights/Categories/SpendingCategories';


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
      animation: animationScreen.default,
      headerShown: false,
      gestureEnabled: false,
    }}>
      <Stack.Screen name="Insights" component={Insights} options={{
        animation: 'none',
      }} />
      <Stack.Screen name="IncomeVsExp" component={IncomeVsExp} />
      <Stack.Screen name="Atm" component={ATM} />
      <Stack.Screen name="Nsf" component={Nsf} />
      <Stack.Screen name="Repayment" component={Repayment} />
      <Stack.Screen name="FeeAnalysis" component={FeeAnalysis} />
      <Stack.Screen name="LoanPayment" component={LoanPayment} />
      <Stack.Screen name="BudgetVariance" component={BudgetVariance} />
      <Stack.Screen name="SpendingCategories" component={SpendingCategories} />
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