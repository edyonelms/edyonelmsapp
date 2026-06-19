import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VectorIcon from './VectorIcon';
import { theme } from '../utils/theme';

// A small, self-contained illustration for the auth screens. Each screen passes
// a `variant` and gets a scene that matches its job — login, the email/reset
// step, the OTP step, or the new-password step. The art is composed from plain
// Views + the bundled vector icons (no react-native-svg / native rebuild), so
// it stays crisp at any density and ships with the JS bundle.
export type AuthIllustrationVariant = 'login' | 'reset' | 'otp' | 'password';

const C = {
  primary: theme.colors.primary,
  light: theme.colors.primaryLight,
  secondary: theme.colors.secondary,
  success: theme.colors.success,
  white: theme.colors.white,
  border: theme.colors.border,
  muted: theme.colors.textMuted,
};

type VariantConfig = {
  mainIcon: string;
  accentIcon: string;
  accentBg: string;
  showDigits?: boolean;
};

const VARIANTS: Record<AuthIllustrationVariant, VariantConfig> = {
  login: { mainIcon: 'log-in-outline', accentIcon: 'shield-checkmark', accentBg: C.success },
  reset: { mainIcon: 'lock-closed-outline', accentIcon: 'refresh', accentBg: C.primary },
  otp: { mainIcon: 'mail-unread-outline', accentIcon: 'shield-checkmark', accentBg: C.secondary, showDigits: true },
  password: { mainIcon: 'key-outline', accentIcon: 'checkmark', accentBg: C.success },
};

const AuthIllustration = ({
  variant,
  digits = ['•', '•', '•', '•'],
}: {
  variant: AuthIllustrationVariant;
  digits?: string[];
}) => {
  const cfg = VARIANTS[variant];

  return (
    <View style={styles.stage} pointerEvents="none">
      {/* Soft layered backdrop */}
      <View style={styles.ring} />
      <View style={styles.halo} />

      {/* Tiny floating accent dots for a little life */}
      <View style={[styles.dot, styles.dotA]} />
      <View style={[styles.dot, styles.dotB]} />

      {/* Center tile with the main glyph */}
      <View style={styles.tile}>
        <VectorIcon iconSet="Ionicons" iconName={cfg.mainIcon} size={34} color={C.primary} />
      </View>

      {/* Variant accent badge */}
      <View style={[styles.badge, { backgroundColor: cfg.accentBg }]}>
        <VectorIcon iconSet="Ionicons" iconName={cfg.accentIcon} size={16} color={C.white} />
      </View>

      {/* OTP screens get a little "code" card to tell the story */}
      {cfg.showDigits && (
        <View style={styles.codeCard}>
          {digits.slice(0, 4).map((d, i) => (
            <View key={i} style={styles.codeBox}>
              <Text style={styles.codeText}>{d}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default AuthIllustration;

const styles = StyleSheet.create({
  stage: {
    width: 200,
    height: 168,
    alignSelf: 'center',
  },
  ring: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1.5,
    borderColor: C.primary + '22',
    borderStyle: 'dashed',
    left: 25,
    top: 9,
  },
  halo: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: C.light,
    left: 38,
    top: 22,
  },
  tile: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    left: 64,
    top: 48,
    borderWidth: 1,
    borderColor: C.border,
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  badge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    left: 124,
    top: 38,
    borderWidth: 2,
    borderColor: C.white,
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  dotA: {
    width: 8,
    height: 8,
    backgroundColor: C.secondary,
    left: 52,
    top: 44,
  },
  dotB: {
    width: 6,
    height: 6,
    backgroundColor: C.success,
    left: 150,
    top: 118,
  },
  codeCard: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 6,
    left: 46,
    top: 126,
    backgroundColor: C.white,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: C.border,
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  codeBox: {
    width: 18,
    height: 22,
    borderRadius: 6,
    backgroundColor: C.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
    color: C.primary,
  },
});
