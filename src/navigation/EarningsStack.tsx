import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import TransactionDetailScreen from '../screens/earnings/TransactionDetailScreen';

export type EarningsStackParamList = {
  EarningsDashboard: undefined;
  TransactionDetail: { transactionId: string };
};

const Stack = createNativeStackNavigator<EarningsStackParamList>();

const EarningsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EarningsDashboard" component={EarningsScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    </Stack.Navigator>
  );
};

export default EarningsStack;