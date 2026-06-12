import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorIcon from './VectorIcon';
import { theme } from '../utils/theme';
import { Biometrics, isPromptInProgress } from '../utils/biometrics';

const GRADIENT = [theme.colors.primary, '#7C3AED'];

/**
 * Wraps the app and shows a full-screen lock when biometric unlock is
 * enabled. Locks on cold start and whenever the app returns from the
 * background, exactly like WhatsApp's fingerprint lock.
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

  return (
    <View style={s.flex}>
      {children}
      {locked && (
        <View style={s.overlay}>
          {/* Decorative shapes */}
          <View style={s.decoTop} />
          <View style={s.decoTopSmall} />
          <View style={s.decoBottom} />

          {/* Brand */}
          <View style={s.brandArea}>
            <View style={s.logoCard}>
              <Image source={{ uri: 'logo' }} style={s.logo} />
            </View>
            <Text style={s.appName}>Edyone LMS</Text>
            <View style={s.securePill}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="shield-checkmark"
                size={12}
                color={theme.colors.primary}
              />
              <Text style={s.securePillText}>App Locked</Text>
            </View>
          </View>

          {/* Unlock area */}
          <View style={s.unlockArea}>
            <TouchableOpacity activeOpacity={0.8} onPress={promptUnlock}>
              <View style={s.lockRingOuter}>
                <View style={s.lockRing}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="finger-print"
                    size={42}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <Text style={s.lockedSub}>
              Use your fingerprint, face or device PIN{'\n'}to open the app
            </Text>

            <TouchableOpacity onPress={promptUnlock} activeOpacity={0.85}>
              <LinearGradient
                colors={GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.unlockBtn}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="lock-open-outline"
                  size={16}
                  color="#fff"
                />
                <Text style={s.unlockBtnText}>Unlock</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="shield-checkmark-outline"
              size={13}
              color={theme.colors.textMuted}
            />
            <Text style={s.footerText}>Protected by biometric unlock</Text>
          </View>
        </View>
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
    backgroundColor: '#fff',
    zIndex: 999,
    elevation: 999,
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Decorative circles
  decoTop: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.colors.primaryLight,
    opacity: 0.55,
    top: -90,
    right: -70,
  },
  decoTopSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primaryLight,
    opacity: 0.4,
    top: 70,
    left: -35,
  },
  decoBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: theme.colors.primaryLight,
    opacity: 0.35,
    bottom: -130,
    left: -80,
  },

  // Brand
  brandArea: { alignItems: 'center', marginTop: 90 },
  logoCard: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },
  logo: {
    width: 116,
    height: 116,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 16,
    letterSpacing: 0.3,
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  securePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.4,
  },

  // Unlock area
  unlockArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  lockRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  lockedSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 18,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.radius.full,
    paddingHorizontal: 42,
    paddingVertical: 13,
    marginTop: 22,
  },
  unlockBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 26,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});
