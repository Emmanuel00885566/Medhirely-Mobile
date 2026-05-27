import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import VerificationStack from './VerificationStack';
import { colors } from '../theme/colors';

const AppNavigator = () => {
  const { isAuthenticated, isLoading, isVerified, hasSeenOnboarding } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* 
        3 STATES:
        1. Not logged in → Auth Stack (Splash, Onboarding, Login, Signup)
        2. Logged in but not verified → Verification Stack
        3. Logged in and verified → Main App
      */}
      {!isAuthenticated && <AuthStack />}
      {isAuthenticated && !isVerified && <VerificationStack />}
      {isAuthenticated && isVerified && <MainTabs />}
    </NavigationContainer>
  );
};

export default AppNavigator;