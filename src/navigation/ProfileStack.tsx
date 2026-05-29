import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ManageCredentialsScreen from '../screens/profile/ManageCredentialsScreen';
import ReviewsReceivedScreen from '../screens/profile/ReviewsReceivedScreen';

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ManageCredentials: undefined;
  ReviewsReceived: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ManageCredentials" component={ManageCredentialsScreen} />
      <Stack.Screen name="ReviewsReceived" component={ReviewsReceivedScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;