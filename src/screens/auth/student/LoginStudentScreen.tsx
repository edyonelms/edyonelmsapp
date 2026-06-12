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
} from 'react-native';
import React, { useRef, useState } from 'react';
import { theme } from '../../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import VectorIcon from '../../../components/VectorIcon';
import { studentLogin } from '../../../api/authApi';

const LoginStudentScreen = () => {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [admissionNo, setAdmissionNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Edge-to-edge Android ignores adjustResize, so scroll the form above the
  // keyboard ourselves once the keyboard animation has started.
  const scrollFormIntoView = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleLogin = async () => {
    if (!admissionNo.trim()) {
      setError('Please enter your admission number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      console.log('[StudentLogin] ➡️ Request:', {
        url: 'POST /user/login',
        admission_number: admissionNo.trim(),
        password,
      });

      const res = await studentLogin(admissionNo.trim(), password);

      console.log('[StudentLogin] Success:', JSON.stringify(res, null, 2));
      navigation.replace('DrawerRoot', { userRole: 'student' });
    } catch (err: any) {
      console.log('[StudentLogin] Error status:', err?.response?.status);
      console.log(
        '[StudentLogin] Error data:',
        JSON.stringify(err?.response?.data, null, 2),
      );
      console.log('[StudentLogin] Error message:', err?.message);

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

          <Text style={styles.title}>Student Login</Text>
          <Text style={styles.subtitle}>
            Enter your admission number and password to access your dashboard
          </Text>

          <View style={styles.formCard}>
            {/* Admission Number */}
            <Text style={styles.label}>Admission Number</Text>
            <TextInput
              placeholder="e.g. 2026DMO650015"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={admissionNo}
              onChangeText={t => {
                setAdmissionNo(t);
                setError('');
              }}
              onFocus={scrollFormIntoView}
              autoCapitalize="none"
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passWrap}>
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
                onFocus={scrollFormIntoView}
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

            {/* Error */}
            {!!error && (
              <View style={styles.errorBox}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="alert-circle-outline"
                  size={14}
                  color={theme.colors.danger}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginStudentScreen;

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
    marginBottom: 50,
  },
  logo: { width: 150, height: 150, resizeMode: 'contain' },
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
    paddingHorizontal: 20,
    marginBottom: theme.spacing.lg,
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3F3',
    borderWidth: 1,
    borderColor: '#F6C7C7',
    borderRadius: theme.radius.sm,
    padding: 10,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: theme.colors.white, fontWeight: '600', fontSize: 16 },
});
