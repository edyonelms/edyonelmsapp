import React, { useEffect, useState } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { getPrivacyPolicy } from '../../api/authApi';

interface Section { head: string; desc: string; }
interface PrivacyData {
  metadata:     { sections: Section[] };
  last_updated: string;
}

const PrivacyPolicyScreen = () => {
  const [data, setData]       = useState<PrivacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPrivacyPolicy();
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load privacy policy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="Privacy Policy" />
        <View style={s.center}>
          <ScreenSkeleton variant="doc" />
          <Text style={s.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={s.root}>
        <Header title="Privacy Policy" />
        <View style={s.center}>
          <VectorIcon iconSet="Ionicons" iconName="alert-circle-outline" size={48} color={theme.colors.danger} />
          <Text style={s.errorText}>{error || 'Something went wrong.'}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchData}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formattedDate = data.last_updated
    ? new Date(data.last_updated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  return (
    <View style={s.root}>
      <Header title="Privacy Policy" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.heroIconWrap}>
            <VectorIcon iconSet="Ionicons" iconName="lock-closed-outline" size={36} color={theme.colors.primary} />
          </View>
          <Text style={s.heroTitle}>Privacy Policy</Text>
          <Text style={s.heroSub}>Your privacy matters to us. Please read our policy carefully.</Text>
          <View style={s.divider} />
        </View>

        {/* ── Sections ── */}
        {data.metadata.sections.length === 0 ? (
          <View style={s.emptyBox}>
            <VectorIcon iconSet="Ionicons" iconName="document-outline" size={40} color={theme.colors.textMuted} />
            <Text style={s.emptyText}>No content available.</Text>
          </View>
        ) : (
          data.metadata.sections.map((sec, i) => (
            <View key={i} style={s.section}>
              <View style={s.sectionTitleRow}>
                <View style={s.sectionBar} />
                <Text style={s.sectionTitle}>{sec.head}</Text>
              </View>
              <Text style={s.sectionBody}>{sec.desc}</Text>
              {i < data.metadata.sections.length - 1 && <View style={s.sectionDivider} />}
            </View>
          ))
        )}

        {/* ── Footer ── */}
        {!!formattedDate && (
          <View style={s.footer}>
            <VectorIcon iconSet="Ionicons" iconName="time-outline" size={15} color={theme.colors.primary} />
            <Text style={s.footerText}>Last updated: {formattedDate}</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 },
  errorText: { fontSize: 14, color: theme.colors.danger, textAlign: 'center' },
  retryBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: theme.radius.full, marginTop: 8 },
  retryText: { color: '#fff', fontWeight: '700' },

  hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 4 },
  heroIconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: theme.colors.primary, shadowOpacity: 0.15,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 6 },
  heroSub: { fontSize: 14, color: theme.colors.primary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 32, marginBottom: 20 },
  divider: { height: 1.5, width: '60%', borderRadius: 99, backgroundColor: theme.colors.primaryLight, marginBottom: 20 },

  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionBar: { width: 4, height: 22, borderRadius: 4, backgroundColor: theme.colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.textPrimary },
  sectionBody: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 24, textAlign: 'justify' },
  sectionDivider: { height: 1, backgroundColor: theme.colors.border, marginTop: 16, marginBottom: 16 },

  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: theme.colors.textMuted },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 },
  footerText: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary },
});
