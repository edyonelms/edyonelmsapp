import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { theme } from '../../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../../../components/VectorIcon';
import { teacherLogin } from '../../../api/authApi';

const LoginTeacherScreen = () => {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Error popup: slide up from the bottom, auto-dismiss after a few seconds.
  const errorAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!error) {
      errorAnim.setValue(0);
      return;
    }
    Animated.timing(errorAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(() => {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setError(''));
    }, 4000);
    return () => clearTimeout(timer);
  }, [error, errorAnim]);

  // Edge-to-edge Android ignores adjustResize, so scroll the form above the
  // keyboard ourselves once the keyboard animation has started. Scroll only
  // up to the subtitle so the view shows description → Continue button.
  const subtitleYRef = useRef(0);
  const scrollFormIntoView = () => {
    setTimeout(
      () =>
        scrollRef.current?.scrollTo({
          y: Math.max(subtitleYRef.current - theme.spacing.sm, 0),
          animated: true,
        }),
      150,
    );
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      console.log('[TeacherLogin] Request:', {
        url: 'POST /teacher/login',
        email: email.trim(),
        password,
      });

      const res = await teacherLogin(email.trim(), password);

      console.log('[TeacherLogin] Success:', JSON.stringify(res, null, 2));
      navigation.replace('DrawerRoot', { userRole: 'teacher' });
    } catch (err: any) {
      console.log('[TeacherLogin] Error status:', err?.response?.status);
      console.log(
        '[TeacherLogin] Error data:',
        JSON.stringify(err?.response?.data, null, 2),
      );
      console.log('[TeacherLogin] Error message:', err?.message);

      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <VectorIcon
            iconName="arrow-left"
            iconSet="FontAwesome6"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconBadge}>
            <Image source={{ uri: 'logo' }} style={styles.logo} />
          </View>

          <Text style={styles.title}>Teacher Login</Text>
          <Text
            style={styles.subtitle}
            onLayout={e => {
              subtitleYRef.current = e.nativeEvent.layout.y;
            }}
          >
            Enter your email address and password to access your dashboard
          </Text>

          <View style={styles.formCard}>
            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="teacher@school.com"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                (emailFocused || !!email) && styles.inputActive,
              ]}
              value={email}
              onChangeText={t => {
                setEmail(t);
                setError('');
              }}
              onFocus={() => {
                setEmailFocused(true);
                scrollFormIntoView();
              }}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passWrap,
                (passwordFocused || !!password) && styles.inputActive,
              ]}
            >
              <TextInput
                placeholder="Enter password"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.passInput}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={t => {
                  setPassword(t);
                  setError('');
                }}
                onFocus={() => {
                  setPasswordFocused(true);
                  scrollFormIntoView();
                }}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPass(v => !v)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.8}
            >
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                (loading || !email.trim() || !password.trim()) &&
                  styles.buttonDisabled,
              ]}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Error popup pinned to the bottom of the screen */}
        {!!error && (
          <Animated.View
            style={[
              styles.errorToast,
              {
                opacity: errorAnim,
                transform: [
                  {
                    translateY: errorAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="alert-circle-outline"
              size={18}
              color={theme.colors.white}
            />
            <Text style={styles.errorToastText}>{error}</Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginTeacherScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.white },
  backBtn: {
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  backText: { color: theme.colors.primary, fontSize: 16 },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  logo: { width: 140, height: 140, resizeMode: 'contain' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: 32,
  },
  formCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  inputActive: {
    borderColor: '#5B7FFF',
  },
  passWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  passInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  forgot: {
    color: theme.colors.primary,
    textAlign: 'right',
    marginBottom: theme.spacing.lg,
    fontWeight: '500',
  },
  errorToast: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    elevation: 6,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  errorToastText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.white,
    fontWeight: '500',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#B0B0B0' },
  buttonText: { color: theme.colors.white, fontWeight: '600', fontSize: 16 },
});
