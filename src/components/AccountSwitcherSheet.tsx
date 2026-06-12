import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import VectorIcon from './VectorIcon';
import { theme } from '../utils/theme';
import {
  activateAccount,
  bootstrapCurrent,
  getActiveAccountId,
  listAccounts,
  removeAccount,
  upsertAccount,
  type AccountType,
  type StoredAccount,
} from '../utils/accountStore';
import {
  addAccount,
  fetchCurrentSnapshot,
  revokeAccountToken,
} from '../api/switchAccountApi';

type Mode = 'list' | 'add';

interface Props {
  visible: boolean;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('') || '?';

const subline = (a: StoredAccount): string => {
  if (a.user_type === 'student') {
    const cls = a.class_info?.class_display;
    const org = a.organization?.name;
    return [cls, org].filter(Boolean).join(' · ') || 'Student';
  }
  const org = a.organization?.name;
  return ['Teacher', org].filter(Boolean).join(' · ');
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ uri, name, size = 44 }: { uri?: string | null; name: string; size?: number }) => {
  const [broken, setBroken] = useState(false);
  if (uri && !broken) {
    return (
      <Image
        source={{ uri }}
        onError={() => setBroken(true)}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.surface }}
      />
    );
  }
  return (
    <View style={[av.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[av.fallbackText, { fontSize: size * 0.36 }]}>{initialsOf(name)}</Text>
    </View>
  );
};

// ─── Sheet ────────────────────────────────────────────────────────────────────
const AccountSwitcherSheet = ({ visible, onClose }: Props) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [mode, setMode]           = useState<Mode>('list');
  const [accounts, setAccounts]   = useState<StoredAccount[]>([]);
  const [activeId, setActiveId]   = useState<number | null>(null);
  const [busyId, setBusyId]       = useState<number | null>(null);
  const [bootstrapping, setBoot]  = useState(false);

  // Add-account form state
  const [role, setRole]           = useState<AccountType>('student');
  const [identifier, setIdent]    = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [adding, setAdding]       = useState(false);
  const [addError, setAddError]   = useState('');

  const refresh = useCallback(async () => {
    const [list, id] = await Promise.all([listAccounts(), getActiveAccountId()]);
    setAccounts(list);
    setActiveId(id);
    return { list, id };
  }, []);

  // First-time bootstrap: if the active session isn't yet in the local list,
  // pull /switch-account/me and seed it.
  const bootstrap = useCallback(async () => {
    const { list, id } = await refresh();
    if (id != null && list.some(a => a.user_id === id)) return;
    setBoot(true);
    try {
      const snap = await fetchCurrentSnapshot();
      if (snap) {
        await bootstrapCurrent({
          user_id:     snap.user_id,
          user_type:   snap.user_type,
          name:        snap.name,
          email:       snap.email,
          image:       snap.image,
          organization: snap.organization,
          class_info:  snap.class_info,
        });
        await refresh();
      }
    } catch (e: any) {
      console.log('[AccountSwitcher] bootstrap failed:', e?.response?.status ?? e?.message);
    } finally {
      setBoot(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!visible) return;
    setMode('list');
    setAddError('');
    bootstrap();
  }, [visible, bootstrap]);

  const sorted = useMemo(() => {
    if (!accounts.length) return [];
    const copy = [...accounts];
    copy.sort((a, b) => {
      if (a.user_id === activeId) return -1;
      if (b.user_id === activeId) return 1;
      return b.added_at - a.added_at;
    });
    return copy;
  }, [accounts, activeId]);

  // ─── Switch ────────────────────────────────────────────────────────────────
  const onSwitch = async (acct: StoredAccount) => {
    if (acct.user_id === activeId) return;
    setBusyId(acct.user_id);
    try {
      await activateAccount(acct.user_id);
      onClose();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'DrawerRoot', params: { userRole: acct.user_type } }],
        }),
      );
    } finally {
      setBusyId(null);
    }
  };

  // ─── Remove ────────────────────────────────────────────────────────────────
  const onRemove = (acct: StoredAccount) => {
    Alert.alert(
      'Remove account?',
      `${acct.name} will be signed out on this device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setBusyId(acct.user_id);
            try {
              await revokeAccountToken(acct.token); // best-effort
              const remaining = await removeAccount(acct.user_id);
              setAccounts(remaining);

              if (acct.user_id === activeId) {
                // Active one was removed — promote another or go to login.
                const next = remaining[0];
                if (next) {
                  await activateAccount(next.user_id);
                  setActiveId(next.user_id);
                  onClose();
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'DrawerRoot', params: { userRole: next.user_type } }],
                    }),
                  );
                } else {
                  onClose();
                  navigation.dispatch(
                    CommonActions.reset({ index: 0, routes: [{ name: 'SelectUser' }] }),
                  );
                }
              }
            } finally {
              setBusyId(null);
            }
          },
        },
      ],
    );
  };

  // ─── Add account ───────────────────────────────────────────────────────────
  const resetAddForm = () => {
    setIdent('');
    setPassword('');
    setShowPass(false);
    setAddError('');
  };

  const onSubmitAdd = async () => {
    const id = identifier.trim();
    if (!id) {
      setAddError(role === 'teacher' ? 'Please enter your email.' : 'Please enter your admission number.');
      return;
    }
    if (!password) {
      setAddError('Please enter your password.');
      return;
    }
    setAddError('');
    setAdding(true);
    try {
      const { account, token } = await addAccount({ identifier: id, password, login_type: role });

      // Don't allow adding the same account twice — just refresh its token.
      await upsertAccount({
        user_id:      account.user_id,
        user_type:    account.user_type,
        name:         account.name,
        email:        account.email,
        image:        account.image,
        organization: account.organization,
        class_info:   account.class_info,
        token,
        added_at:     Date.now(),
      });

      resetAddForm();
      setMode('list');
      await refresh();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        'Could not add the account. Please check your credentials.';
      setAddError(msg);
    } finally {
      setAdding(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        {/* Tap outside to close */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView behavior="padding">
          <View style={[s.sheet, { paddingBottom: 16 + insets.bottom }]}>
            <View style={s.handle} />

              {/* Header */}
              <View style={s.header}>
                {mode === 'add' ? (
                  <TouchableOpacity onPress={() => { resetAddForm(); setMode('list'); }} hitSlop={10}>
                    <VectorIcon iconSet="Ionicons" iconName="chevron-back" size={22} color={theme.colors.textPrimary} />
                  </TouchableOpacity>
                ) : <View style={{ width: 22 }} />}
                <Text style={s.title}>{mode === 'add' ? 'Add account' : 'Switch accounts'}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={10}>
                  <VectorIcon iconSet="Ionicons" iconName="close" size={22} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {mode === 'list' ? (
                <ListBody
                  bootstrapping={bootstrapping}
                  accounts={sorted}
                  activeId={activeId}
                  busyId={busyId}
                  onSwitch={onSwitch}
                  onRemove={onRemove}
                  onAdd={() => { resetAddForm(); setMode('add'); }}
                />
              ) : (
                <AddBody
                  role={role}
                  onChangeRole={r => { setRole(r); setAddError(''); }}
                  identifier={identifier}
                  setIdentifier={t => { setIdent(t); setAddError(''); }}
                  password={password}
                  setPassword={t => { setPassword(t); setAddError(''); }}
                  showPass={showPass}
                  toggleShowPass={() => setShowPass(v => !v)}
                  error={addError}
                  loading={adding}
                  onSubmit={onSubmitAdd}
                />
              )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AccountSwitcherSheet;

// ─── List body ────────────────────────────────────────────────────────────────
interface ListBodyProps {
  bootstrapping: boolean;
  accounts:      StoredAccount[];
  activeId:      number | null;
  busyId:        number | null;
  onSwitch:      (a: StoredAccount) => void;
  onRemove:      (a: StoredAccount) => void;
  onAdd:         () => void;
}

const ListBody = ({ bootstrapping, accounts, activeId, busyId, onSwitch, onRemove, onAdd }: ListBodyProps) => {
  if (bootstrapping && accounts.length === 0) {
    return (
      <View style={s.loadingBox}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.listContent}>
      {accounts.map(acct => {
        const isActive = acct.user_id === activeId;
        const isBusy   = acct.user_id === busyId;
        return (
          <TouchableOpacity
            key={acct.user_id}
            activeOpacity={0.85}
            onPress={() => onSwitch(acct)}
            disabled={isActive || isBusy}
            style={[s.row, isActive && s.rowActive]}
          >
            <Avatar uri={acct.image} name={acct.name} />
            <View style={s.rowMain}>
              <Text style={s.rowName} numberOfLines={1}>{acct.name}</Text>
              <Text style={s.rowSub} numberOfLines={1}>{subline(acct)}</Text>
            </View>

            {isBusy ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : isActive ? (
              <View style={s.checkBadge}>
                <VectorIcon iconSet="Ionicons" iconName="checkmark" size={14} color="#fff" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => onRemove(acct)}
                hitSlop={10}
                style={s.removeBtn}
              >
                <VectorIcon iconSet="Ionicons" iconName="close" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity activeOpacity={0.85} onPress={onAdd} style={s.addRow}>
        <View style={s.addPlus}>
          <VectorIcon iconSet="Ionicons" iconName="add" size={22} color={theme.colors.primary} />
        </View>
        <Text style={s.addText}>Add account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ─── Add body ─────────────────────────────────────────────────────────────────
interface AddBodyProps {
  role:           AccountType;
  onChangeRole:   (r: AccountType) => void;
  identifier:     string;
  setIdentifier:  (t: string) => void;
  password:       string;
  setPassword:    (t: string) => void;
  showPass:       boolean;
  toggleShowPass: () => void;
  error:          string;
  loading:        boolean;
  onSubmit:       () => void;
}

const AddBody = (p: AddBodyProps) => (
  <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.addContent} showsVerticalScrollIndicator={false}>
    {/* Role tabs */}
    <View style={s.tabRow}>
      {(['student', 'teacher'] as AccountType[]).map(r => {
        const active = r === p.role;
        return (
          <TouchableOpacity
            key={r}
            activeOpacity={0.85}
            onPress={() => p.onChangeRole(r)}
            style={[s.tab, active && s.tabActive]}
          >
            <Text style={[s.tabText, active && s.tabTextActive]}>
              {r === 'student' ? 'Student' : 'Teacher'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {/* Identifier */}
    <Text style={s.label}>
      {p.role === 'teacher' ? 'Email' : 'Admission Number'}
    </Text>
    <TextInput
      placeholder={p.role === 'teacher' ? 'teacher@school.com' : 'e.g. 2026DMO650015'}
      placeholderTextColor={theme.colors.textMuted}
      value={p.identifier}
      onChangeText={p.setIdentifier}
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType={p.role === 'teacher' ? 'email-address' : 'default'}
      style={s.input}
    />

    {/* Password */}
    <Text style={s.label}>Password</Text>
    <View style={s.passWrap}>
      <TextInput
        placeholder="Enter password"
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={!p.showPass}
        value={p.password}
        onChangeText={p.setPassword}
        style={s.passInput}
      />
      <TouchableOpacity onPress={p.toggleShowPass} hitSlop={10}>
        <VectorIcon
          iconSet="Ionicons"
          iconName={p.showPass ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>
    </View>

    {/* Error */}
    {!!p.error && (
      <View style={s.errorBox}>
        <VectorIcon iconSet="Ionicons" iconName="alert-circle-outline" size={14} color={theme.colors.danger} />
        <Text style={s.errorText}>{p.error}</Text>
      </View>
    )}

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={p.onSubmit}
      disabled={p.loading}
      style={[s.saveBtn, p.loading && { opacity: 0.6 }]}
    >
      {p.loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={s.saveBtnText}>Save account</Text>}
    </TouchableOpacity>

    <Text style={s.hint}>
      Your current account stays signed in. You can switch any time from here.
    </Text>
  </ScrollView>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const av = StyleSheet.create({
  fallback: {
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: { color: theme.colors.primary, fontWeight: '800' },
});

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get('window').height * 0.85,
  },
  handle: {
    alignSelf: 'center',
    width: 44, height: 5, borderRadius: 3,
    backgroundColor: '#E2E8F0',
    marginTop: 10, marginBottom: 4,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  title: { fontSize: 17, fontWeight: '800', color: theme.colors.textPrimary },

  loadingBox: { paddingVertical: 48, alignItems: 'center' },

  // ─── List ──
  listContent: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 4,
  },
  rowActive: { backgroundColor: '#EEF2FF' },
  rowMain: { flex: 1, marginLeft: 12 },
  rowName: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
  rowSub:  { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },

  checkBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },

  addRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 10,
    marginTop: 6,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  addPlus: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  addText: { marginLeft: 12, fontSize: 15, fontWeight: '700', color: theme.colors.primary },

  // ─── Add form ──
  addContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#F1F5F9',
    borderRadius: 12, padding: 4, marginBottom: 18,
  },
  tab: {
    flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8,
  },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1 },
  tabText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.textPrimary },

  label: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11,
    fontSize: 14, color: theme.colors.textPrimary,
    marginBottom: 14,
  },
  passWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 10, paddingHorizontal: 12,
    marginBottom: 12,
  },
  passInput: { flex: 1, paddingVertical: 11, fontSize: 14, color: theme.colors.textPrimary },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF3F3', borderWidth: 1, borderColor: '#F6C7C7',
    borderRadius: 8, padding: 9, marginBottom: 10,
  },
  errorText: { flex: 1, fontSize: 12, color: theme.colors.danger, fontWeight: '500' },

  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  hint: { fontSize: 11, color: theme.colors.textMuted, textAlign: 'center', marginTop: 14 },
});
