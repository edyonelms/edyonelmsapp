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
  label, value, last,
}: {
  label: string; value: string; last?: boolean;
}) => (
  <View style={[s.infoRow, !last && s.infoRowBorder]}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue} numberOfLines={2}>{value || '—'}</Text>
  </View>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({
  title, children,
}: {
  title: string; children: React.ReactNode;
}) => (
  <View style={s.sectionBlock}>
    <View style={s.sectionHeader}>
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

  const { personal_info: p, family_info: f, address_info: a, academic_info: ac } = profile;

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
          <View style={s.roleBadge}>
            <Text style={s.roleBadgeText}>Student · {ac.standard_name ?? 'N/A'}</Text>
          </View>
        </View>

        <View style={s.sectionsContainer}>

          {/* ── Personal Info ── */}
          <SectionCard title="Personal Information">
            <InfoRow label="Full Name"   value={p.full_name} />
            <InfoRow label="Email"       value={p.email} />
            <InfoRow label="Mobile"      value={p.mobile_number} />
            <InfoRow label="DOB"         value={p.dob} />
            <InfoRow label="Gender"      value={p.gender} />
            {!!p.religion && <InfoRow label="Religion" value={p.religion} />}
            {!!p.aadhar_no && <InfoRow label="Aadhar No" value={p.aadhar_no} last />}
          </SectionCard>

          {/* ── Family Info ── */}
          <SectionCard title="Family Information">
            <InfoRow label="Father Name" value={f.father_name} />
            <InfoRow label="Mother Name" value={f.mother_name} last />
          </SectionCard>

          {/* ── Address ── */}
          <SectionCard title="Address">
            <InfoRow label="Local Address"     value={a.local_address} />
            <InfoRow label="Permanent Address" value={a.permanent_address} />
            {!!a.city && <InfoRow label="City" value={a.city} />}
            <InfoRow label="State"             value={a.state} />
            <InfoRow label="Pincode"           value={a.pincode} last />
          </SectionCard>

          {/* ── Academic Info ── */}
          <SectionCard title="Academic Information">
            <InfoRow label="Admission No"      value={ac.admission_no} />
            <InfoRow label="Date of Admission" value={ac.date_of_admission} />
            <InfoRow label="Roll No"           value={ac.roll_no} />
            <InfoRow label="Class"             value={ac.standard_name} />
            <InfoRow label="Section"           value={ac.section_name ?? 'N/A'} />
            <InfoRow label="Board"             value={ac.board} last />
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
  roleBadge: { backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  roleBadgeText: { fontSize: 12, fontWeight: '700', color: '#92400E' },

  // Sections
  sectionsContainer: { paddingHorizontal: 16, paddingBottom: 40, marginTop: 8 },
  sectionBlock: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },

  card: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 10 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoLabel: { flex: 1, fontSize: 13, color: '#64748B', fontWeight: '500' },
  infoValue: { fontSize: 13, color: '#1E293B', fontWeight: '700', textAlign: 'right', maxWidth: width * 0.45 },
});
