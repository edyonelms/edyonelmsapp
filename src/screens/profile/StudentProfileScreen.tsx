import React, { useEffect, useState } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
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
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
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
  title, accent, children,
}: {
  title: string; accent: string; children: React.ReactNode;
}) => (
  <View style={s.sectionBlock}>
    <View style={s.sectionHeader}>
      <View style={[s.sectionAccent, { backgroundColor: accent }]} />
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

  const { refreshing, onRefresh } = useRefresh(fetchProfile);

  useEffect(() => { fetchProfile(); }, []);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="Profile" />
        <View style={s.center}>
          <ScreenSkeleton variant="profile" />
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* ── Gradient hero ── */}
        <LinearGradient
          colors={['#E0F2FE', '#E0E7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          {/* Decorative blobs */}
          <View style={s.heroBlob1} />
          <View style={s.heroBlob2} />

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
        </LinearGradient>

        {/* ── Sections ── */}
        <View style={s.sectionsContainer}>

          {/* ── Personal Info ── */}
          <SectionCard title="Personal Information" accent="#4F46E5">
            <InfoRow label="Full Name"   value={p.full_name} />
            <InfoRow label="Email"       value={p.email} />
            <InfoRow label="Mobile"      value={p.mobile_number} />
            <InfoRow label="DOB"         value={p.dob} />
            <InfoRow label="Gender"      value={p.gender} />
            {!!p.religion && <InfoRow label="Religion" value={p.religion} />}
            {!!p.aadhar_no && <InfoRow label="Aadhar No" value={p.aadhar_no} />}
            <InfoRow label="Father Name" value={f.father_name} />
            <InfoRow label="Mother Name" value={f.mother_name} last />
          </SectionCard>

          {/* ── Academic Info ── */}
          <SectionCard title="Academic Information" accent="#10B981">
            <InfoRow label="Admission No"      value={ac.admission_no} />
            <InfoRow label="Date of Admission" value={ac.date_of_admission} />
            <InfoRow label="Roll No"           value={ac.roll_no} />
            <InfoRow label="Class"             value={ac.standard_name} />
            <InfoRow label="Section"           value={ac.section_name ?? 'N/A'} />
            <InfoRow label="Board"             value={ac.board} last />
          </SectionCard>

          {/* ── Address ── */}
          <SectionCard title="Address" accent="#0EA5E9">
            <InfoRow label="Local Address"     value={a.local_address} />
            <InfoRow label="Permanent Address" value={a.permanent_address} />
            {!!a.city && <InfoRow label="City" value={a.city} />}
            <InfoRow label="State"             value={a.state} />
            <InfoRow label="Pincode"           value={a.pincode} last />
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

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  heroBlob1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(79,70,229,0.06)', top: -60, right: -40,
  },
  heroBlob2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(14,165,233,0.06)', bottom: -30, left: -30,
  },
  avatarRing: {
    width: 92, height: 92, borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#C7D2FE',
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40, resizeMode: 'cover' },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#E0E7FF',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { fontSize: 30, fontWeight: '800', color: theme.colors.primary },
  studentName: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginTop: 12, letterSpacing: 0.2 },
  roleBadge: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#C7D2FE',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8,
  },
  roleBadgeText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },

  // Sections
  sectionsContainer: { paddingHorizontal: 16, marginTop: 22 },
  sectionBlock: { marginBottom: 22 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginLeft: 2 },
  sectionAccent: { width: 4, height: 16, borderRadius: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E1B4B' },

  card: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4,
    borderWidth: 1, borderColor: '#EEF2F7',
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 3,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F6FA' },
  infoLabel: { flex: 1, fontSize: 13, color: '#7C8AA0', fontWeight: '600' },
  infoValue: { fontSize: 13.5, color: '#1E293B', fontWeight: '700', textAlign: 'right', maxWidth: width * 0.5 },
});
