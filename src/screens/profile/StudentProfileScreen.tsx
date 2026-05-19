import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { getStudentProfile } from '../../api/studentApi';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileData {
  personal_info:    Record<string, any>;
  family_info:      Record<string, any>;
  address_info:     Record<string, any>;
  academic_info:    Record<string, any>;
  transport_info:   Record<string, any>;
  organization_info: Record<string, any>;
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({
  icon, iconSet, color, label, value, last,
}: {
  icon: string; iconSet: string; color: string;
  label: string; value: string; last?: boolean;
}) => (
  <View style={[s.infoRow, !last && s.infoRowBorder]}>
    <View style={[s.infoIconBadge, { backgroundColor: color + '18' }]}>
      <VectorIcon iconSet={iconSet as any} iconName={icon} size={13} color={color} />
    </View>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue} numberOfLines={2}>{value || '—'}</Text>
  </View>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({
  title, icon, iconSet, color, children,
}: {
  title: string; icon: string; iconSet: string; color: string; children: React.ReactNode;
}) => (
  <View style={s.sectionBlock}>
    <View style={s.sectionHeader}>
      <View style={[s.sectionIconBox, { backgroundColor: color + '18' }]}>
        <VectorIcon iconSet={iconSet as any} iconName={icon} size={16} color={color} />
      </View>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    <View style={s.card}>{children}</View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const StudentProfileScreen = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStudentProfile();
      setProfile(data);
    } catch (e: any) {
      console.log('[StudentProfile] ❌', e?.response?.data ?? e?.message);
      setError(e?.response?.data?.message ?? 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="Profile" />
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={s.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={s.root}>
        <Header title="Profile" />
        <View style={s.center}>
          <VectorIcon iconSet="Ionicons" iconName="alert-circle-outline" size={48} color={theme.colors.danger} />
          <Text style={s.errorText}>{error || 'Something went wrong.'}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchProfile}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const { personal_info: p, family_info: f, address_info: a, academic_info: ac, transport_info: t, organization_info: o } = profile;

  return (
    <View style={s.root}>
      <Header title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Avatar + Name ── */}
        <View style={s.avatarWrapper}>
          <View style={s.avatarRing}>
            {p.image
              ? <Image source={{ uri: p.image }} style={s.avatarImage} />
              : (
                <View style={s.avatarCircle}>
                  <Text style={s.avatarInitial}>{p.full_name?.charAt(0) ?? 'S'}</Text>
                </View>
              )
            }
          </View>
          <Text style={s.studentName}>{p.full_name}</Text>
          <View style={s.orgRow}>
            {o.logo_url && <Image source={{ uri: o.logo_url }} style={s.orgLogo} />}
            <Text style={s.orgName}>{o.name}</Text>
          </View>
          <View style={s.roleBadge}>
            <VectorIcon iconSet="FontAwesome5" iconName="star" size={10} color="#F59E0B" />
            <Text style={s.roleBadgeText}>Student · {ac.standard_name ?? 'N/A'}</Text>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={s.statsRow}>
          {[
            { icon: 'school',    iconSet: 'MaterialIcons', label: 'Class',   value: ac.standard_name ?? '—', color: '#6366F1' },
            { icon: 'id-badge',  iconSet: 'FontAwesome5',  label: 'Roll No', value: ac.roll_no ?? '—',       color: '#0EA5E9' },
            { icon: 'book',      iconSet: 'FontAwesome5',  label: 'Board',   value: ac.board ?? '—',         color: '#10B981' },
          ].map((st, i) => (
            <View key={i} style={s.statChip}>
              <View style={[s.statIconBox, { backgroundColor: st.color + '20' }]}>
                <VectorIcon iconSet={st.iconSet as any} iconName={st.icon} size={16} color={st.color} />
              </View>
              <Text style={s.statValue} numberOfLines={1}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.sectionsContainer}>

          {/* ── Personal Info ── */}
          <SectionCard title="Personal Information" icon="person" iconSet="Ionicons" color="#6366F1">
            <InfoRow icon="user"         iconSet="FontAwesome5" color="#6366F1" label="Full Name"   value={p.full_name} />
            <InfoRow icon="envelope"     iconSet="FontAwesome5" color="#0EA5E9" label="Email"       value={p.email} />
            <InfoRow icon="phone-alt"    iconSet="FontAwesome5" color="#10B981" label="Mobile"      value={p.mobile_number} />
            <InfoRow icon="birthday-cake" iconSet="FontAwesome5" color="#F59E0B" label="DOB"        value={p.dob} />
            <InfoRow icon="venus-mars"   iconSet="FontAwesome5" color="#EC4899" label="Gender"      value={p.gender} />
            {!!p.religion && <InfoRow icon="pray" iconSet="FontAwesome5" color="#14B8A6" label="Religion" value={p.religion} />}
            {!!p.aadhar_no && <InfoRow icon="id-card" iconSet="FontAwesome5" color="#8B5CF6" label="Aadhar No" value={p.aadhar_no} last />}
          </SectionCard>

          {/* ── Family Info ── */}
          <SectionCard title="Family Information" icon="people-outline" iconSet="Ionicons" color="#8B5CF6">
            <InfoRow icon="user-tie"  iconSet="FontAwesome5" color="#6366F1" label="Father Name" value={f.father_name} />
            <InfoRow icon="user"      iconSet="FontAwesome5" color="#EC4899" label="Mother Name" value={f.mother_name} last />
          </SectionCard>

          {/* ── Address ── */}
          <SectionCard title="Address" icon="location-outline" iconSet="Ionicons" color="#0EA5E9">
            <InfoRow icon="home"           iconSet="FontAwesome5" color="#6366F1" label="Local Address"     value={a.local_address} />
            <InfoRow icon="map-marker-alt" iconSet="FontAwesome5" color="#0EA5E9" label="Permanent Address" value={a.permanent_address} />
            {!!a.city    && <InfoRow icon="city"      iconSet="FontAwesome5" color="#10B981" label="City"    value={a.city} />}
            <InfoRow icon="flag"           iconSet="FontAwesome5" color="#F59E0B" label="State"             value={a.state} />
            <InfoRow icon="mail-bulk"      iconSet="FontAwesome5" color="#EC4899" label="Pincode"           value={a.pincode} last />
          </SectionCard>

          {/* ── Academic Info ── */}
          <SectionCard title="Academic Information" icon="school-outline" iconSet="Ionicons" color="#10B981">
            <InfoRow icon="id-card"       iconSet="FontAwesome5" color="#6366F1" label="Admission No"       value={ac.admission_no} />
            <InfoRow icon="calendar-alt"  iconSet="FontAwesome5" color="#0EA5E9" label="Date of Admission"  value={ac.date_of_admission} />
            <InfoRow icon="list-ol"       iconSet="FontAwesome5" color="#10B981" label="Roll No"            value={ac.roll_no} />
            <InfoRow icon="chalkboard"    iconSet="FontAwesome5" color="#F59E0B" label="Class"              value={ac.standard_name} />
            <InfoRow icon="layer-group"   iconSet="FontAwesome5" color="#EC4899" label="Section"            value={ac.section_name ?? 'N/A'} />
            <InfoRow icon="book-open"     iconSet="FontAwesome5" color="#F97316" label="Board"              value={ac.board} last />
          </SectionCard>

          {/* ── Transport ── */}
          <SectionCard title="Transport" icon="bus-outline" iconSet="Ionicons" color="#F59E0B">
            <InfoRow
              icon="bus" iconSet="FontAwesome5" color="#F59E0B"
              label="Transportation"
              value={t.transportation_required ? 'Required' : 'Not Required'}
            />
            <InfoRow
              icon="route" iconSet="FontAwesome5" color="#0EA5E9"
              label="Active Transport"
              value={t.active_transport ?? 'Not Assigned'}
              last
            />
          </SectionCard>

        </View>
      </ScrollView>
    </View>
  );
};

export default StudentProfileScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 },
  errorText: { fontSize: 14, color: theme.colors.danger, textAlign: 'center' },
  retryBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: theme.radius.full, marginTop: 8 },
  retryText: { color: '#fff', fontWeight: '700' },

  // Avatar
  avatarWrapper: { alignItems: 'center', marginTop: 24, marginBottom: 16 },
  avatarRing: {
    width: 116, height: 116, borderRadius: 58,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 10,
  },
  avatarImage: { width: 108, height: 108, borderRadius: 54, resizeMode: 'cover' },
  avatarCircle: { width: 108, height: 108, borderRadius: 54, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 42, fontWeight: '800', color: '#fff' },
  studentName: { fontSize: 22, fontWeight: '800', color: '#1E1B4B', marginTop: 12 },
  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  orgLogo: { width: 20, height: 20, borderRadius: 4, resizeMode: 'contain' },
  orgName: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  roleBadgeText: { fontSize: 12, fontWeight: '700', color: '#92400E' },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginHorizontal: 20, marginBottom: 20 },
  statChip: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  statIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statValue: { fontSize: 12, fontWeight: '800', color: '#1E1B4B', textAlign: 'center', paddingHorizontal: 4 },
  statLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '500', marginTop: 2 },

  // Sections
  sectionsContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionBlock: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  sectionIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },

  card: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoIconBadge: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { flex: 1, fontSize: 13, color: '#64748B', fontWeight: '500' },
  infoValue: { fontSize: 13, color: '#1E293B', fontWeight: '700', textAlign: 'right', maxWidth: width * 0.45 },
});
