import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

// ── Palettes ──────────────────────────────────────────────────────────────────
// Brand colours (primary / primaryLight / secondary / danger / success / white)
// are intentionally kept identical across modes: a few screens capture
// `theme.colors.primary` at module load, and white is used as on-primary text.
const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  primary: '#4F46E5',
  primaryLight: '#E0E7FF',
  secondary: '#0EA5E9',

  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  white: '#FFFFFF',

  border: '#E2E8F0',
  statusBar: '#E2E8F0',
  shadow: '#0F172A',
  iconActive: '#4F46E5',
  iconInactive: '#94A3B8',

  danger: '#EF4444',
  success: '#22C55E',
};

const darkColors: typeof lightColors = {
  background: '#0B1120',
  surface: '#1B2436',
  card: '#1B2436',

  primary: '#4F46E5',
  primaryLight: '#E0E7FF',
  secondary: '#0EA5E9',

  textPrimary: '#E6EAF2',
  textSecondary: '#9AA6BC',
  textMuted: '#6E7A92',
  white: '#FFFFFF',

  border: '#2A3650',
  statusBar: '#0B1120',
  shadow: '#000000',
  iconActive: '#4F46E5',
  iconInactive: '#6E7A92',

  danger: '#F87171',
  success: '#4ADE80',
};

// ── Live theme singleton ─────────────────────────────────────────────────────
// `colors` is mutated in place on mode change; every screen rebuilds its styles
// through the registered factories below, so existing `theme.colors.*` reads
// (inline and in StyleSheet) reflect the active mode after a re-render.
export const theme = {
  colors: { ...lightColors },
  spacing: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  radius: { sm: 10, md: 14, lg: 18, full: 999 },
  mode: 'light' as ThemeMode,
};

// Initialise synchronously from the system scheme so a system-dark phone paints
// dark from the very first frame (an explicit saved override is applied async).
const _sys = Appearance.getColorScheme();
if (_sys === 'dark') {
  Object.assign(theme.colors, darkColors);
  theme.mode = 'dark';
}

// ── Theme-change subscription (drives per-screen StyleSheet factories) ─────────
type Listener = () => void;
const listeners: Listener[] = [];

export const onThemeChange = (cb: Listener): (() => void) => {
  listeners.push(cb);
  return () => {
    const i = listeners.indexOf(cb);
    if (i >= 0) listeners.splice(i, 1);
  };
};

export const applyThemeMode = (mode: ThemeMode): void => {
  Object.assign(theme.colors, mode === 'dark' ? darkColors : lightColors);
  theme.mode = mode;
  listeners.forEach(l => {
    try {
      l();
    } catch {
      // a screen's style factory should never break the toggle
    }
  });
};

// ── React context / provider ─────────────────────────────────────────────────
const STORAGE_KEY = 'theme_mode';

interface ThemeCtxValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  mode: theme.mode,
  isDark: theme.mode === 'dark',
  setMode: () => {},
  toggle: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(theme.mode);

  // Load the saved override (if any) once on startup.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if ((saved === 'dark' || saved === 'light') && saved !== theme.mode) {
          applyThemeMode(saved);
          setModeState(saved);
        }
      } catch {
        // ignore — fall back to the system-derived default
      }
    })();
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    applyThemeMode(m);
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setMode(theme.mode === 'dark' ? 'light' : 'dark');
  }, [setMode]);

  const value = useMemo<ThemeCtxValue>(
    () => ({ mode, isDark: mode === 'dark', setMode, toggle }),
    [mode, setMode, toggle],
  );

  return React.createElement(ThemeCtx.Provider, { value }, children);
};

export const useThemeMode = (): ThemeCtxValue => useContext(ThemeCtx);
