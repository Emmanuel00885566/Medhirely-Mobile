import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export const navigateToNotifications = () => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Shifts', {
      screen: 'Notifications',
    });
  }
};