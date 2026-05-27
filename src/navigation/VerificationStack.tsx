import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UploadCredentialsScreen from '../screens/verification/UploadCredentialsScreen';
import PendingVerificationScreen from '../screens/verification/PendingVerificationScreen';

export type VerificationStackParamList = {
  UploadCredentials: undefined;
  PendingVerification: undefined;
};

const Stack = createNativeStackNavigator<VerificationStackParamList>();

const VerificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UploadCredentials" component={UploadCredentialsScreen} />
      <Stack.Screen name="PendingVerification" component={PendingVerificationScreen} />
    </Stack.Navigator>
  );
};

export default VerificationStack;