import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ManageCredentialsScreen from '../screens/profile/ManageCredentialsScreen';
import ReviewsReceivedScreen from '../screens/profile/ReviewsReceivedScreen';
import TermsConditionsScreen from '../screens/profile/TermsConditionsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import WorkerOnboardingGuideScreen from '../screens/profile/WorkerOnboardingGuideScreen';
import VerificationPolicyScreen from '../screens/profile/VerificationPolicyScreen';
import PaymentDisputeGuideScreen from '../screens/profile/PaymentDisputeGuideScreen';


export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ManageCredentials: undefined;
  ReviewsReceived: undefined;
  TermsConditions: undefined;
  HelpSupport: undefined;
  WorkerOnboardingGuide: undefined;
  VerificationPolicy: undefined;
  PaymentDisputeGuide: undefined;
};


const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ManageCredentials" component={ManageCredentialsScreen} />
      <Stack.Screen name="ReviewsReceived" component={ReviewsReceivedScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="WorkerOnboardingGuide" component={WorkerOnboardingGuideScreen} />
      <Stack.Screen name="VerificationPolicy" component={VerificationPolicyScreen} />
      <Stack.Screen name="PaymentDisputeGuide" component={PaymentDisputeGuideScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;