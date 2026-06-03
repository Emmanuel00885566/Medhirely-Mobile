import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateProfileScreen from '../screens/verification/CreateProfileScreen';
import UploadCredentialsScreen from '../screens/verification/UploadCredentialsScreen';
import PendingVerificationScreen from '../screens/verification/PendingVerificationScreen';

export type VerificationStackParamList = {
  CreateProfile: undefined;
  UploadCredentials: undefined;
  PendingVerification: undefined;
};

const Stack = createNativeStackNavigator<VerificationStackParamList>();

const VerificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      <Stack.Screen name="UploadCredentials" component={UploadCredentialsScreen} />
      <Stack.Screen name="PendingVerification" component={PendingVerificationScreen} />
    </Stack.Navigator>
  );
};

export default VerificationStack;