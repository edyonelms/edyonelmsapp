import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { updatePassword } from '../../api/authApi';

// Mirrors the backend update-password validation rules so the checklist
// and the API accept exactly the same passwords.
const passwordRules: { label: string; test: (p: string) => boolean }[] = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'One lowercase letter (a-z)', test: p => /[a-z]/.test(p) },
  { label: 'One uppercase letter (A-Z)', test: p => /[A-Z]/.test(p) },
  { label: 'One number (0-9)', test: p => /[0-9]/.test(p) },
  {
    label: 'One special character (@ $ ! % * # ? &)',
    test: p => /[@$!%*#?&]/.test(p),
  },
];

const PasswordField = ({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
}) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordWrap}>
        <TextInput
          style={[
            styles.input,
            styles.inputWithIcon,
            (focused || !!value) && styles.inputActive,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={!show}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShow(v => !v)}>
          <VectorIcon
            iconSet="Ionicons"
            iconName={show ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const ChangePasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = async () => {
    if (!current) {
      setError('Enter your current password.');
      return;
    }
    const unmet = passwordRules.find(r => !r.test(newPass));
    if (unmet) {
      setError(`Password needs: ${unmet.label.toLowerCase()}.`);
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
      setSuccessMsg(res.message || 'Your password has been changed.');
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

          <PasswordField
            label="Current Password"
            placeholder="Enter current password"
            value={current}
            onChangeText={t => {
              setCurrent(t);
              setError('');
            }}
          />

          <PasswordField
            label="New Password"
            placeholder="Enter new password"
            value={newPass}
            onChangeText={t => {
              setNewPass(t);
              setError('');
            }}
          />

          <PasswordField
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirm}
            onChangeText={t => {
              setConfirm(t);
              setError('');
            }}
          />

          <View style={styles.ruleList}>
            {passwordRules.map(rule => {
              const met = rule.test(newPass);
              return (
                <View key={rule.label} style={styles.ruleRow}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName={met ? 'checkmark-circle' : 'ellipse-outline'}
                    size={15}
                    color={met ? theme.colors.success : theme.colors.textMuted}
                  />
                  <Text style={[styles.ruleText, met && styles.ruleTextMet]}>
                    {rule.label}
                  </Text>
                </View>
              );
            })}
            {!!confirm && (
              <View style={styles.ruleRow}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={
                    newPass === confirm ? 'checkmark-circle' : 'close-circle'
                  }
                  size={15}
                  color={
                    newPass === confirm
                      ? theme.colors.success
                      : theme.colors.danger
                  }
                />
                <Text
                  style={[
                    styles.ruleText,
                    newPass === confirm
                      ? styles.ruleTextMet
                      : styles.ruleTextFail,
                  ]}
                >
                  Passwords match
                </Text>
              </View>
            )}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              (loading || !current || !newPass || !confirm) &&
                styles.buttonDisabled,
            ]}
            onPress={handleChange}
            activeOpacity={0.7}
            disabled={loading || !current || !newPass || !confirm}
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

      {/* Success acknowledgement */}
      <Modal
        transparent
        visible={!!successMsg}
        animationType="fade"
        onRequestClose={() => navigation.goBack()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-circle"
                size={40}
                color={theme.colors.success}
              />
            </View>
            <Text style={styles.modalTitle}>Password Changed</Text>
            <Text style={styles.modalDesc}>{successMsg}</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              activeOpacity={0.9}
              onPress={() => {
                setSuccessMsg('');
                navigation.goBack();
              }}
            >
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: theme.colors.textPrimary,
  },
  inputActive: {
    borderColor: '#5B7FFF',
  },
  passwordWrap: {
    marginBottom: theme.spacing.md,
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  ruleList: {
    marginBottom: theme.spacing.md,
    gap: 5,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ruleText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  ruleTextMet: {
    color: theme.colors.success,
  },
  ruleTextFail: {
    color: theme.colors.danger,
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
  buttonDisabled: { backgroundColor: '#B0B0B0' },
  buttonText: { color: theme.colors.white, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  modalDesc: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBtn: {
    marginTop: theme.spacing.xl,
    alignSelf: 'stretch',
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
