// ─────────────────────────────────────────────────────────────────────────────
//  Notifee service — channel, permissions and system/heads-up display.
//
//  The custom sound lives at:
//    Android → android/app/src/main/res/raw/notification_tone.wav  (ref: 'notification_tone')
//    iOS     → notification_tone.wav added to the app bundle        (ref: 'notification_tone.wav')
// ─────────────────────────────────────────────────────────────────────────────
import { Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
} from '@notifee/react-native';
import { notificationStore, NotificationItem } from './store';

export const CHANNEL_ID = 'edyone-default';
export const SOUND_ANDROID = 'notification_tone';       // res/raw/notification_tone.wav
export const SOUND_IOS = 'notification_tone.wav';        // bundled file

let channelReady = false;

/** Create the high-importance channel that carries our custom sound (Android). */
export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'General Notifications',
    importance: AndroidImportance.HIGH, // heads-up banner + sound
    sound: SOUND_ANDROID,
    vibration: true,
  });
  channelReady = true;
}

/** Ask the OS for notification permission (Android 13+, iOS). Safe to call repeatedly. */
export async function requestNotifPermission(): Promise<boolean> {
  try {
    const settings = await notifee.requestPermission();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch {
    return false;
  }
}

/** Show a heads-up / tray notification with the custom sound. */
export async function displaySystemNotification(item: NotificationItem): Promise<void> {
  try {
    await ensureChannel();
    await notifee.displayNotification({
      id: item.id,
      title: item.title,
      body: item.body,
      data: { id: item.id, ...(item.data ?? {}) },
      android: {
        channelId: CHANNEL_ID,
        smallIcon: 'ic_launcher', // TODO: swap for a dedicated monochrome status icon
        sound: SOUND_ANDROID,
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
      },
      ios: {
        sound: SOUND_IOS,
      },
    });
  } catch {
    // Native module missing / not configured — in-app store still updated.
  }
}

/**
 * One-time setup: hydrate the inbox, create the channel, ask permission and
 * wire tap handling so opening a notification marks it read.
 *
 * Call once from App on mount.
 */
let initialised = false;
export async function initNotifications(): Promise<void> {
  if (initialised) return;
  initialised = true;

  await notificationStore.hydrate();
  await ensureChannel();
  await requestNotifPermission();

  // Foreground taps / dismisses.
  notifee.onForegroundEvent(({ type, detail }) => {
    const id = detail.notification?.id;
    if (!id) return;
    if (type === EventType.PRESS) {
      notificationStore.markRead(id);
    }
  });
}
