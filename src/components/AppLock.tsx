import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Biometrics, isPromptInProgress } from '../utils/biometrics';
import { theme } from '../utils/theme';

/**
 * Wraps the app and dims the dashboard while the system biometric prompt is
 * showing. No lock UI of its own — the dashboard underneath drops to ~10%
 * visibility and the OS biometric sheet does all the work, exactly like
 * banking / WhatsApp.
 *
 * Locks on cold start and whenever the app returns from the background; if
 * the user dismisses the sheet without authenticating, they can tap the
 * dim overlay to re-trigger it.
 */
const AppLock = ({ children }: { children: React.ReactNode }) => {
  const [locked, setLocked] = useState(false);
  // True while the system biometric sheet is open. The sheet (or the
  // device-credential fallback screen) can briefly background the app on
  // some devices, which must not re-trigger the lock.
  const promptActive = useRef(false);

  const promptUnlock = useCallback(async () => {
    if (promptActive.current) return;
    promptActive.current = true;
    try {
      const { available } = await Biometrics.check();
      if (!available) {
        // Nothing left to authenticate with (biometrics removed and no
        // device PIN). Fail open instead of locking the user out forever.
        setLocked(false);
        return;
      }
      const success = await Biometrics.authenticate('Unlock Edyone LMS');
      if (success) setLocked(false);
    } finally {
      promptActive.current = false;
    }
  }, []);

  // Cold start: lock + prompt if the feature is on
  useEffect(() => {
    let cancelled = false;
    Biometrics.isEnabled().then(enabled => {
      if (cancelled || !enabled) return;
      setLocked(true);
      promptUnlock();
    });
    return () => {
      cancelled = true;
    };
  }, [promptUnlock]);

  // Re-lock when the app goes to background
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (
        state === 'background' &&
        !promptActive.current &&
        !isPromptInProgress()
      ) {
        Biometrics.isEnabled().then(enabled => {
          if (enabled) setLocked(true);
        });
      }
    });
    return () => sub.remove();
  }, []);

  // Re-fire the prompt when we come back to the foreground while still locked
  // (covers the case where the user dismissed the sheet by going home).
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active' && locked && !promptActive.current) {
        promptUnlock();
      }
    });
    return () => sub.remove();
  }, [locked, promptUnlock]);

  return (
    <View style={s.flex}>
      {children}
      {locked && (
        // Dim layer: dashboard underneath shows at ~10% visibility (90%
        // opaque white). Tapping anywhere re-fires the biometric prompt
        // in case the user dismissed it.
        <TouchableOpacity
          activeOpacity={1}
          onPress={promptUnlock}
          style={s.overlay}
        />
      )}
    </View>
  );
};

export default AppLock;

const s = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.white,
    opacity: 0.9,
    zIndex: 999,
    elevation: 999,
  },
});
