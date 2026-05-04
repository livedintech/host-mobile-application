/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async _remoteMessage => {});

notifee.onBackgroundEvent(async () => {});

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

AppRegistry.registerComponent(appName, () => App);
