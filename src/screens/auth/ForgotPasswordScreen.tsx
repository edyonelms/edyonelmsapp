import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { OtpInput } from 'react-native-otp-entry';
import {
  forgotPassword,
  verifyOtp,
  resendOtp,
  changePassword,
} from '../../api/authApi';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);

  // Edge-to-edge Android ignores adjustResize, so scroll the form above the
  // keyboard ourselves once the keyboard animation has started.
  const scrollFormIntoView = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string | number>('');
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBackPress = () => {
    if (step === 1) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  // Timer for OTP
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <View style={styles.iconBadge}>
              <Image source={{ uri: 'logo' }} style={styles.logo} />
            </View>
            <Text style={styles.heading}>Reset Password</Text>
            <Text style={styles.desc}>
              Enter your registered email address to reset your account
              password.
            </Text>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="name@school.com"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              value={email}
              onChangeText={t => {
                setEmail(t);
                setError('');
              }}
              onFocus={scrollFormIntoView}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              disabled={loading}
              onPress={async () => {
                if (!email.trim()) {
                  setError('Please enter your email.');
                  return;
                }
                setLoading(true);
                setError('');
                try {
                  console.log('[ForgotPassword] ➡️ Request:', {
                    email: email.trim(),
                  });
                  const res = await forgotPassword(email.trim());
                  console.log(
                    '[ForgotPassword] ✅ Response:',
                    JSON.stringify(res, null, 2),
                  );
                  setUserId(res.user_id);
                  setTimer(120);
                  setStep(2);
                } catch (e: any) {
                  console.log(
                    '[ForgotPassword] ❌ Error:',
                    JSON.stringify(e?.response?.data, null, 2),
                  );
                  setError(
                    e?.response?.data?.message ??
                      e?.message ??
                      'Failed to send OTP. Please try again.',
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get OTP</Text>
              )}
            </TouchableOpacity>
          </>
        );
      case 2:
        return (
          <>
            <View style={styles.iconBadge}>
              <Image source={{ uri: 'logo' }} style={styles.logo} />
            </View>
            <Text style={styles.heading}>Enter OTP</Text>
            <Text style={styles.desc}>
              Enter the 6-digit code sent to {email || 'your registered email'}.
            </Text>
            <OtpInput
              numberOfDigits={6}
              onTextChange={text => {
                setOtp(text);
                setError('');
              }}
              onFocus={scrollFormIntoView}
              focusColor={theme.colors.primary}
              theme={{
                pinCodeContainerStyle: {
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.sm,
                  width: 44,
                  height: 50,
                  backgroundColor: theme.colors.surface,
                },
                pinCodeTextStyle: {
                  color: theme.colors.textPrimary,
                  fontSize: 18,
                },
              }}
            />
            <Text style={styles.infoText}>OTP sent to your email address</Text>
            {timer > 0 ? (
              <Text style={styles.timer}>Resend OTP in {formatTime()}</Text>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    console.log('[ResendOTP] ➡️ Request:', {
                      email,
                      user_id: userId,
                    });
                    const res = await resendOtp(email, userId);
                    console.log(
                      '[ResendOTP] ✅ Response:',
                      JSON.stringify(res, null, 2),
                    );
                    setTimer(120);
                    setError('');
                  } catch (e: any) {
                    console.log(
                      '[ResendOTP] ❌ Error:',
                      JSON.stringify(e?.response?.data, null, 2),
                    );
                    setError(
                      e?.response?.data?.message ??
                        e?.message ??
                        'Failed to resend OTP.',
                    );
                  }
                }}
              >
                <Text
                  style={[styles.timer, { textDecorationLine: 'underline' }]}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              disabled={loading}
              onPress={async () => {
                if (otp.length !== 6) {
                  setError('Please enter the 6-digit OTP.');
                  return;
                }
                setLoading(true);
                setError('');
                try {
                  await verifyOtp(otp, userId);
                  setStep(3);
                } catch (e: any) {
                  setError(
                    e?.response?.data?.message ??
                      'Invalid OTP. Please try again.',
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.iconBadge}>
              <Image source={{ uri: 'logo' }} style={styles.logo} />
            </View>
            <Text style={styles.heading}>Set New Password</Text>
            <Text style={styles.desc}>
              Create a new password for your account
            </Text>

            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={t => {
                setPassword(t);
                setError('');
              }}
              onFocus={scrollFormIntoView}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={t => {
                setConfirmPassword(t);
                setError('');
              }}
              onFocus={scrollFormIntoView}
            />

            <Text style={styles.passwordHint}>
              Password should be 8 to 16 characters and include at least one
              number or symbol.
            </Text>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              disabled={loading}
              onPress={async () => {
                if (!password.trim()) {
                  setError('Please enter a new password.');
                  return;
                }
                if (password.length < 8) {
                  setError('Password must be at least 8 characters.');
                  return;
                }
                if (password !== confirmPassword) {
                  setError('Passwords do not match.');
                  return;
                }

                setLoading(true);
                setError('');
                try {
                  console.log('[ChangePassword] ➡️ Request:', {
                    user_id: userId,
                  });
                  const res = await changePassword(
                    password,
                    confirmPassword,
                    userId,
                  );
                  console.log(
                    '[ChangePassword] ✅ Response:',
                    JSON.stringify(res, null, 2),
                  );
                  navigation.replace('SelectUser');
                } catch (e: any) {
                  console.log(
                    '[ChangePassword] ❌ Error:',
                    JSON.stringify(e?.response?.data, null, 2),
                  );
                  setError(
                    e?.response?.data?.message ??
                      e?.message ??
                      'Failed to change password. Please try again.',
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.safeArea}>
        <Header
          title="Forgot Password"
          showBack={true}
          onBackPress={handleBackPress}
        />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>{renderStep()}</View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    // borderWidth: 1,
    // borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
  back: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    justifyContent: 'center',
    textAlign: 'center',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  iconBadge: {
    width: 76,
    height: 76,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 42,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  desc: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
    textAlign: 'center',
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
  passwordHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: '600',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  otpBox: {
    width: 44,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
  },

  infoText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  timer: {
    textAlign: 'center',
    marginVertical: theme.spacing.md,
    color: theme.colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
});
