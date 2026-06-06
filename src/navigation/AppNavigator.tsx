import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
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
    {!isAuthenticated ? (
      <AuthStack />
    ) : (
      <MainTabs />
    )}
  </NavigationContainer>
);
};

export default AppNavigator;