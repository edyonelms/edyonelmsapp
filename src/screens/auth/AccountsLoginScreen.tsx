import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { accountsLogin } from '../../api/authApi';

const AccountsLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await accountsLogin(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'AccountsDashboard' }] });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <Header title="Accounts" onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.iconBadge}>
            <VectorIcon iconSet="Ionicons" iconName="calculator" size={44} color="#0EA5E9" />
          </View>
          <Text style={s.title}>Accounts Login</Text>
          <Text style={s.subtitle}>Sign in with your accounts email and password.</Text>

          <Text style={s.label}>Email</Text>
          <View style={s.inputRow}>
            <VectorIcon iconSet="Ionicons" iconName="mail-outline" size={18} color={theme.colors.textMuted} />
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="accounts@school.com"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={s.label}>Password</Text>
          <View style={s.inputRow}>
            <VectorIcon iconSet="Ionicons" iconName="lock-closed-outline" size={18} color={theme.colors.textMuted} />
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(v => !v)}>
              <VectorIcon iconSet="Ionicons" iconName={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {!!error && <Text style={s.error}>{error}</Text>}

          <TouchableOpacity style={[s.btn, loading && { opacity: 0.7 }]} onPress={onLogin} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Login</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AccountsLoginScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 24, paddingTop: 32 },
  iconBadge: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#0EA5E914',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '900', color: theme.colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 8, marginTop: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, color: theme.colors.textPrimary, padding: 0 },
  error: { color: theme.colors.danger, fontSize: 13, marginTop: 14, textAlign: 'center' },
  btn: {
    marginTop: 28,
    backgroundColor: '#0EA5E9',
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});
