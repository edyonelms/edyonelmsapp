import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { updatePassword } from '../../api/authApi';

const showToast = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('Success', msg);
  }
};

const checks = (p: string) => ({
  length: p.length >= 8 && p.length <= 16,
  capital: /[A-Z]/.test(p),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
});

const RuleRow = ({
  pass,
  label,
  rule,
}: {
  pass: string;
  label: string;
  rule: keyof ReturnType<typeof checks>;
}) => {
  const met = pass.length > 0 && checks(pass)[rule];
  return (
    <View style={styles.ruleRow}>
      <View style={[styles.ruleDot, met && styles.ruleDotMet]} />
      <Text style={[styles.ruleText, met && styles.ruleTextMet]}>{label}</Text>
    </View>
  );
};

const ChangePasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const c = checks(newPass);
  const passwordsMatch = confirm.length > 0 && newPass === confirm;

  const handleChange = async () => {
    if (!current) {
      setError('Enter your current password.');
      return;
    }
    if (!c.length || !c.capital || !c.special) {
      setError('New password does not meet all requirements.');
      return;
    }
    if (newPass !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      console.log('[ChangePassword] ➡️ Request: POST /update-password');
      const res = await updatePassword(current, newPass, confirm);
      console.log(
        '[ChangePassword] ✅ Response:',
        JSON.stringify(res, null, 2),
      );
      showToast(res.message || 'Password changed successfully!');
      navigation.goBack();
    } catch (err: any) {
      console.log(
        '[ChangePassword] ❌ Error:',
        JSON.stringify(err?.response?.data, null, 2),
      );
      setError(
        err?.response?.data?.message ??
          err?.message ??
          'Failed to change password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Change Password" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Update Password</Text>
          <Text style={styles.desc}>
            Enter your current password and choose a new one.
          </Text>

          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current password"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={current}
            onChangeText={setCurrent}
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={newPass}
            onChangeText={setNewPass}
          />

          <View style={styles.rulesBox}>
            <RuleRow pass={newPass} label="8 to 16 characters" rule="length" />
            <RuleRow
              pass={newPass}
              label="At least one capital letter"
              rule="capital"
            />
            <RuleRow
              pass={newPass}
              label="At least one special character"
              rule="special"
            />
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {confirm.length > 0 && (
            <View style={styles.ruleRow}>
              <View
                style={[styles.ruleDot, passwordsMatch && styles.ruleDotMet]}
              />
              <Text
                style={[styles.ruleText, passwordsMatch && styles.ruleTextMet]}
              >
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleChange}
            activeOpacity={0.7}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.white },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  desc: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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
  rulesBox: {
    marginBottom: theme.spacing.md,
    gap: 6,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ruleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },
  ruleDotMet: {
    backgroundColor: theme.colors.success,
  },
  ruleText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  ruleTextMet: {
    color: theme.colors.success,
  },
  error: {
    fontSize: 12,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  buttonText: { color: theme.colors.white, fontWeight: '600' },
});
