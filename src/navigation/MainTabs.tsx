import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import ShiftsStack from './ShiftsStack';
import ApplicationsStack from './ApplicationsStack';
import EarningsStack from './EarningsStack';
import ProfileStack from './ProfileStack';
import { typography } from '../theme/typography';

export type MainTabParamList = {
  Shifts: undefined;
  Applications: undefined;
  Earnings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 24,
            right: 24,
            backgroundColor: colors.white,
            borderRadius: 40,
            height: 60,
            borderTopWidth: 0,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 8,
            paddingBottom: 8,
            paddingHorizontal: 8,
            overflow: 'hidden',
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: typography.medium,
            marginBottom: 8,
          },
          tabBarIcon: ({ focused }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Shifts: focused ? 'clipboard' : 'clipboard-outline',
              Applications: focused ? 'document-text' : 'document-text-outline',
              Earnings: focused ? 'cash' : 'cash-outline',
              Profile: focused ? 'person' : 'person-outline',
            };
            return (
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
                <View style={[
                  styles.iconContainer,
                  focused && styles.iconContainerActive,
                ]}>
                  <Ionicons
                    name={icons[route.name]}
                    size={22}
                    color={focused ? colors.white : colors.textMuted}
                  />
                </View>
              </View>
            );
          },
        })}
      >
        <Tab.Screen 
  name="Shifts" 
  component={ShiftsStack}
  options={{ tabBarLabel: 'Shifts' }}
/>
<Tab.Screen 
  name="Applications" 
  component={ApplicationsStack}
  options={{ tabBarLabel: 'Applications' }}
/>
<Tab.Screen 
  name="Earnings" 
  component={EarningsStack}
  options={{ tabBarLabel: 'Earnings' }}
/>
<Tab.Screen 
  name="Profile" 
  component={ProfileStack}
  options={{ tabBarLabel: 'Profile' }}
/>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconContainerActive: {
    backgroundColor: colors.primary,
  },
});

export default MainTabs;