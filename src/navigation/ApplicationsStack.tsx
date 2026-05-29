import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApplicationsScreen from '../screens/applications/ApplicationsScreen';
import UpcomingShiftDetailScreen from '../screens/applications/UpcomingShiftDetailScreen';
import ShiftSummaryScreen from '../screens/applications/ShiftSummaryScreen';

export type ApplicationsStackParamList = {
  ApplicationsList: undefined;
  UpcomingShiftDetail: { applicationId: string };
  ShiftSummary: { applicationId: string };
};

const Stack = createNativeStackNavigator<ApplicationsStackParamList>();

const ApplicationsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ApplicationsList" component={ApplicationsScreen} />
      <Stack.Screen name="UpcomingShiftDetail" component={UpcomingShiftDetailScreen} />
      <Stack.Screen name="ShiftSummary" component={ShiftSummaryScreen} />
    </Stack.Navigator>
  );
};

export default ApplicationsStack;