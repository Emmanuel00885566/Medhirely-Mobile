import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShiftsScreen from '../screens/shifts/ShiftsScreen';
import ShiftDetailScreen from '../screens/shifts/ShiftDetailScreen';
import ConfirmApplicationScreen from '../screens/shifts/ConfirmApplicationScreen';

export type ShiftsStackParamList = {
  ShiftsFeed: undefined;
  ShiftDetail: { shiftId: string };
  ConfirmApplication: { shiftId: string };
};

const Stack = createNativeStackNavigator<ShiftsStackParamList>();

const ShiftsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShiftsFeed" component={ShiftsScreen} />
      <Stack.Screen name="ShiftDetail" component={ShiftDetailScreen} />
      <Stack.Screen name="ConfirmApplication" component={ConfirmApplicationScreen} />
    </Stack.Navigator>
  );
};

export default ShiftsStack;