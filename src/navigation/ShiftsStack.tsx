import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShiftsScreen from '../screens/shifts/ShiftsScreen';
import ShiftDetailScreen from '../screens/shifts/ShiftDetailScreen';
import ConfirmApplicationScreen from '../screens/shifts/ConfirmApplicationScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen'

export type ShiftsStackParamList = {
  ShiftsFeed: undefined;
  ShiftDetail: { shiftId: string; shiftData?: string };
  ConfirmApplication: { shiftId: string; shiftData?: string };
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<ShiftsStackParamList>();

const ShiftsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShiftsFeed" component={ShiftsScreen} />
      <Stack.Screen name="ShiftDetail" component={ShiftDetailScreen} />
      <Stack.Screen name="ConfirmApplication" component={ConfirmApplicationScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen}/>
    </Stack.Navigator>
  );
};

export default ShiftsStack;