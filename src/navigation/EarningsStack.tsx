import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import TransactionDetailScreen from '../screens/earnings/TransactionDetailScreen';
import PaymentsScreen from '../screens/earnings/PaymentsScreen';
import WithdrawEarningsScreen from '../screens/earnings/WithdrawEarningsScreen';

export type EarningsStackParamList = {
  EarningsDashboard: undefined;
  TransactionDetail: { transactionId: string };
  Payments: undefined;
  WithdrawEarnings: undefined;
};

const Stack = createNativeStackNavigator<EarningsStackParamList>();

const EarningsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EarningsDashboard" component={EarningsScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="WithdrawEarnings" component={WithdrawEarningsScreen} />
    </Stack.Navigator>
  );
};

export default EarningsStack;