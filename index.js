/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';
import { notificationStore } from './src/notifications';

// Handle taps/dismisses while the app is in the background or quit.
// (Required by Notifee — without it background events log a warning.)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const id = detail.notification?.id;
  if (id && type === EventType.PRESS) {
    await notificationStore.hydrate();
    await notificationStore.markRead(id);
  }
});

AppRegistry.registerComponent(appName, () => App);
