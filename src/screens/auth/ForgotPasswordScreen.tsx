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
  useWindowDimensions,
  Animated,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import VectorIcon from '../../components/VectorIcon';
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
  const { width: windowWidth } = useWindowDimensions();

  // Size OTP boxes from the screen width (minus screen + card padding and
  // the gaps) so the row always fits. The row container gets an exact fixed
  // width and centers itself: with the library's default full-width
  // container the row drifts left once digits fill in (its cells remount on
  // every keystroke and Yoga mis-centers the leftover space).
  const otpGap = theme.spacing.xs;
  const otpBoxWidth = Math.min(
    48,
    Math.floor((windowWidth - theme.spacing.lg * 4 - otpGap * 5) / 6),
  );
  const otpRowWidth = otpBoxWidth * 6 + otpGap * 5;

  // Edge-to-edge Android ignores adjustResize, so scroll the form above the
  // keyboard ourselves once the keyboard animation has started. Scroll only
  // up to the description so the view shows description → submit button.
  // The desc lives inside the card, so its scroll offset is cardY + descY.
  const cardYRef = useRef(0);
  const descYRef = useRef(0);
  const scrollFormIntoView = () => {
    setTimeout(
      () =>
        scrollRef.current?.scrollTo({
          y: Math.max(
            cardYRef.current + descYRef.current - theme.spacing.sm,
            0,
          ),
          animated: true,
        }),
      150,
    );
  };

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string | number>('');
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

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
    const popupTimer = setTimeout(() => {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setError(''));
    }, 4000);
    return () => clearTimeout(popupTimer);
  }, [error, errorAnim]);

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
            <Text
              style={styles.desc}
              onLayout={e => {
                descYRef.current = e.nativeEvent.layout.y;
              }}
            >
              Enter your registered email address to reset your account
              password.
            </Text>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="name@school.com"
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
            <TouchableOpacity
              style={[
                styles.button,
                (loading || !email.trim()) && styles.buttonDisabled,
              ]}
              disabled={loading || !email.trim()}
              onPress={async () => {
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
            <Text
              style={styles.desc}
              onLayout={e => {
                descYRef.current = e.nativeEvent.layout.y;
              }}
            >
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
              // RN 0.85 removed StyleSheet.absoluteFillObject, which the
              // library relies on to take its hidden TextInput out of the
              // layout flow. Without it the invisible input sits in the row
              // and widens as digits are typed, squeezing the boxes together
              // and shifting the row left. Re-apply absolute positioning.
              textInputProps={{ style: StyleSheet.absoluteFill }}
              theme={{
                containerStyle: {
                  width: otpRowWidth,
                  alignSelf: 'center',
                  marginBottom: theme.spacing.sm,
                },
                pinCodeContainerStyle: {
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.sm,
                  width: otpBoxWidth,
                  height: 50,
                  backgroundColor: theme.colors.surface,
                },
                focusedPinCodeContainerStyle: {
                  borderColor: '#5B7FFF',
                },
                filledPinCodeContainerStyle: {
                  borderColor: '#5B7FFF',
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
                    // If the user_id was lost (e.g. after a reload), request
                    // a fresh OTP through forgot-password instead of letting
                    // resend-otp fail with "user id field is required".
                    if (!userId) {
                      const res = await forgotPassword(email.trim());
                      setUserId(res.user_id);
                    } else {
                      const res = await resendOtp(email.trim(), userId);
                      if (!res.success) {
                        throw new Error(res.message);
                      }
                    }
                    console.log('[ResendOTP] ✅ OTP resent');
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
            <TouchableOpacity
              style={[
                styles.button,
                (loading || otp.length !== 6) && styles.buttonDisabled,
              ]}
              disabled={loading || otp.length !== 6}
              onPress={async () => {
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
            <Text
              style={styles.desc}
              onLayout={e => {
                descYRef.current = e.nativeEvent.layout.y;
              }}
            >
              Create a new password for your account
            </Text>

            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder="Enter new password"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                (passwordFocused || !!password) && styles.inputActive,
              ]}
              secureTextEntry
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

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor={theme.colors.textMuted}
              style={[
                styles.input,
                (confirmFocused || !!confirmPassword) && styles.inputActive,
              ]}
              secureTextEntry
              value={confirmPassword}
              onChangeText={t => {
                setConfirmPassword(t);
                setError('');
              }}
              onFocus={() => {
                setConfirmFocused(true);
                scrollFormIntoView();
              }}
              onBlur={() => setConfirmFocused(false)}
            />

            <Text style={styles.passwordHint}>
              Password should be 8 to 16 characters and include at least one
              number or symbol.
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                (loading || !password.trim() || !confirmPassword.trim()) &&
                  styles.buttonDisabled,
              ]}
              disabled={loading || !password.trim() || !confirmPassword.trim()}
              onPress={async () => {
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
          <View
            style={styles.card}
            onLayout={e => {
              cardYRef.current = e.nativeEvent.layout.y;
            }}
          >
            {renderStep()}
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
  inputActive: {
    borderColor: '#5B7FFF',
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
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: { backgroundColor: '#B0B0B0' },
  buttonText: {
    color: theme.colors.white,
    fontWeight: '600',
    fontSize: 16,
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
});
