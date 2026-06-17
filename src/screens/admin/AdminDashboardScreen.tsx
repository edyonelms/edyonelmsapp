import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import { theme } from '../../utils/theme';
import { AdminDashboard, getAdminDashboard } from '../../api/adminApi';
import { AdminUser, getStoredUser, logout } from '../../api/authApi';

const inr = (n: number) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

// Phase 1+ modules — visible now as the shell, wired in later phases.
const MODULES: { key: string; label: string; icon: string; color: string }[] = [
  { key: 'students', label: 'Students', icon: 'people', color: '#6366F1' },
  { key: 'attendance', label: 'Attendance', icon: 'checkbox', color: '#22C55E' },
  { key: 'fees', label: 'Fees', icon: 'cash', color: '#0EA5E9' },
  { key: 'announcements', label: 'Announcements', icon: 'megaphone', color: '#F59E0B' },
  { key: 'exams', label: 'Exams', icon: 'document-text', color: '#EC4899' },
  { key: 'admissions', label: 'Admissions', icon: 'person-add', color: '#8B5CF6' },
  { key: 'timetable', label: 'Timetable', icon: 'calendar', color: '#14B8A6' },
  { key: 'more', label: 'More', icon: 'grid', color: '#64748B' },
];

const AdminDashboardScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, d] = await Promise.all([
        getStoredUser() as Promise<AdminUser | null>,
        getAdminDashboard().catch(() => null),
      ]);
      setUser(u);
      setStats(d);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { refreshing, onRefresh } = useRefresh(load);

  const onLogout = () => {
    Alert.alert('Logout', 'Sign out of the admin account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'SelectUser' }] });
        },
      },
    ]);
  };

  const openModule = (label: string) =>
    Alert.alert(label, 'This module is coming soon to the admin app.');

  const statCards = [
    { label: 'Students', value: String(stats?.students ?? '—'), icon: 'people', color: '#6366F1' },
    { label: 'Teachers', value: String(stats?.teachers ?? '—'), icon: 'school', color: '#EC4899' },
    { label: 'Fees (Month)', value: stats ? inr(stats.fees_collected_this_month) : '—', icon: 'trending-up', color: '#22C55E' },
    { label: 'Fees (Total)', value: stats ? inr(stats.fees_collected_total) : '—', icon: 'cash', color: '#0EA5E9' },
  ];

  return (
    <View style={s.root}>
      {/* Top bar */}
      <View style={s.topbar}>
        <View style={{ flex: 1 }}>
          <Text style={s.hello}>Welcome back</Text>
          <Text style={s.name} numberOfLines={1}>{user?.name ?? 'Admin'}</Text>
          {!!user?.organization?.name && <Text style={s.org} numberOfLines={1}>{user.organization.name}</Text>}
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <VectorIcon iconSet="Ionicons" iconName="log-out-outline" size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={s.loader}><ActivityIndicator size="large" color={theme.colors.primary} /></View>
      ) : (
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Stats */}
          <View style={s.statGrid}>
            {statCards.map(c => (
              <View key={c.label} style={[s.statCard, { backgroundColor: c.color + '12' }]}>
                <View style={[s.statIcon, { backgroundColor: c.color + '22' }]}>
                  <VectorIcon iconSet="Ionicons" iconName={c.icon} size={20} color={c.color} />
                </View>
                <Text style={[s.statVal, { color: c.color }]} numberOfLines={1}>{c.value}</Text>
                <Text style={s.statLbl}>{c.label}</Text>
              </View>
            ))}
          </View>

          {/* Modules */}
          <Text style={s.section}>Manage</Text>
          <View style={s.modGrid}>
            {MODULES.map(m => (
              <TouchableOpacity key={m.key} style={s.modCard} activeOpacity={0.8} onPress={() => openModule(m.label)}>
                <View style={[s.modIcon, { backgroundColor: m.color + '18' }]}>
                  <VectorIcon iconSet="Ionicons" iconName={m.icon} size={24} color={m.color} />
                </View>
                <Text style={s.modLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.note}>More admin tools are rolling out soon.</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default AdminDashboardScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  hello: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '900', color: theme.colors.textPrimary, marginTop: 1 },
  org: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 1 },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.danger + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 16, paddingBottom: 40 },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', borderRadius: 18, padding: 16, gap: 8 },
  statIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statVal: { fontSize: 20, fontWeight: '900' },
  statLbl: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' },

  section: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginTop: 24, marginBottom: 14 },
  modGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  modCard: {
    width: '22%',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  modIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.textPrimary, textAlign: 'center' },

  note: { fontSize: 12, color: theme.colors.textMuted, textAlign: 'center', marginTop: 28 },
});
