# Notifications

In-app notifications with a custom sound, a persistent inbox and an unread badge.
Built on [Notifee](https://notifee.app). Push (FCM) is Phase 2 — see the checklist
at the bottom.

## What's wired (Phase 1 — done)

| Piece | File |
| --- | --- |
| Notification catalog (every "kind" + templates) | `src/notifications/catalog.ts` |
| Persistent inbox store + hooks | `src/notifications/store.ts` |
| Notifee channel / permission / display (custom sound) | `src/notifications/service.ts` |
| Public `notify()` trigger | `src/notifications/index.ts` |
| Inbox screen (real data) | `src/screens/notification/NotificationScreen.tsx` |
| Unread badge on the bell | `src/components/TopBar.tsx` |
| One-time init | `App.tsx` (`initNotifications`) |
| Background tap handler | `index.js` (`notifee.onBackgroundEvent`) |
| Custom sound | `android/app/src/main/res/raw/notification_tone.wav` |
| Android 13+ permission | `AndroidManifest.xml` (`POST_NOTIFICATIONS`) |

## How to raise a notification

From anywhere (a screen, an API callback, a push handler):

```ts
import { notify } from '../notifications';

// Uses the catalog's default title/body for the type:
notify({ type: 'homework_assigned', data: { subject: 'Mathematics' } });

// Or fully custom:
notify({
  type: 'general',
  title: 'Welcome 🎉',
  body: 'Your account is ready.',
  data: { screen: 'Dashboard' },
});
```

`notify()` will:
1. add the item to the inbox (persisted, survives restarts),
2. bump the unread badge on the bell,
3. show a heads-up banner with `notification_tone.wav` (unless `silent: true`).

## Adding a new notification "kind"

1. Add a `type` + entry in `src/notifications/catalog.ts` (category + default
   title/body templates).
2. Call `notify({ type: '<your_type>', data: {...} })` from wherever the event
   happens. **Tell me which event → which type, and I'll wire the call.**

## Changing the sound

Replace `android/app/src/main/res/raw/notification_tone.wav` (filename must stay
lowercase letters/digits/underscore). For iOS, add the same file to the Xcode
bundle. The references are `SOUND_ANDROID` / `SOUND_IOS` in
`src/notifications/service.ts`.

> After any native change (sound, this library) do a **clean rebuild** —
> Metro reload is not enough.

---

## Phase 2 — Push notifications (app closed/background) — TODO

Needs your Firebase project. Steps:

1. **Create a Firebase project** and add the Android app with package
   `com.edyoneapp`; download **`google-services.json`** → place in
   `android/app/`. For iOS add **`GoogleService-Info.plist`** to the Xcode project.
2. Install: `npm i @react-native-firebase/app @react-native-firebase/messaging`
3. Android gradle:
   - `android/build.gradle` → `classpath 'com.google.gms:google-services:4.4.2'`
   - `android/app/build.gradle` → `apply plugin: 'com.google.gms.google-services'`
4. Register the device token with the backend and forward messages into the
   existing `notify()` so behaviour is identical to in-app. (Code is ready to drop
   in — the architecture already funnels everything through `notify()`.)
5. **Backend:** store device tokens + a "send notification" endpoint that pushes
   via FCM. (`SendNotificationController` already exists in the API repo and can be
   extended.)

Once you hand over `google-services.json` + confirm the backend, Phase 2 is a
small wire-up.
