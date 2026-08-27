/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { CrashlyticsService } from '@/services/crashlytics.service';
import { NotificationService } from '@/services/notification.service';

CrashlyticsService.init();

messaging().setBackgroundMessageHandler(async _remoteMessage => {});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS && detail.notification?.data) {
    NotificationService.handleNavigation(
      {
        data: detail.notification.data as Record<string, string>,
      } as FirebaseMessagingTypes.RemoteMessage,
      500,
    );
  }
});

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(appName, () => App);
