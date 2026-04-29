/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { NotificationService } from './src/services/notification.service';

// Background/Quit state notification handler — must be registered before AppRegistry
messaging().setBackgroundMessageHandler(async remoteMessage => {
  NotificationService.handleNavigation(remoteMessage);
});

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(appName, () => App);
