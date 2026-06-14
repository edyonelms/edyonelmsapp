import 'react-native-gesture-handler';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  type NavigationState,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import AppLock from './src/components/AppLock';
import { ThemeProvider, useThemeMode, theme } from './src/utils/theme';

// Routes where the biometric prompt must NOT fire — splash, onboarding and
// every auth screen. Anything else is considered "inside the app" (dashboard
// and beyond), where the lock should activate.
const PUBLIC_ROUTES = new Set([
  'Splash',
  'Onboarding',
  'SelectUser',
  'TeacherLogin',
  'StudentLogin',
  'ForgotPassword',
]);

const navigationRef = createNavigationContainerRef();

const AppInner = () => {
  const { mode } = useThemeMode();
  const [inMainApp, setInMainApp] = useState(false);
  // Avoid spamming setState every navigation event when the answer hasn't
  // changed (and it changes only a handful of times per session).
  const lastValue = useRef(false);
  // Preserve the current navigation state across the theme remount so the user
  // stays on the same screen when switching light/dark.
  const navStateRef = useRef<NavigationState | undefined>(undefined);

  const recheckRoute = useCallback(() => {
    const name = navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : undefined;
    const next = !!name && !PUBLIC_ROUTES.has(name);
    if (next !== lastValue.current) {
      lastValue.current = next;
      setInMainApp(next);
    }
  }, []);

  const isDark = mode === 'dark';

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <AppLock active={inMainApp}>
        <NavigationContainer
          key={mode}
          ref={navigationRef}
          initialState={navStateRef.current}
          onReady={recheckRoute}
          onStateChange={state => {
            navStateRef.current = state;
            recheckRoute();
          }}
        >
          <AppNavigator />
        </NavigationContainer>
      </AppLock>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppInner />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
