import React, { useEffect, useState } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh, useFocusLoad } from '../../hooks/useRefresh';
import { theme } from '../../utils/theme';
import { getRulesRegulations } from '../../api/authApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Section      { head: string; desc: string; }
interface FileItem     { title: string; file_path: string; file_type: string; }
interface AdditionalInfo { key: string; value: string; }

interface RulesData {
  sections:        Section[];
  files:           FileItem[];
  additional_info: AdditionalInfo[];
  last_updated:    string;
}

// ─── Screen ───────────────────────────────────────────────────────────────────
const RulesRegulationsScreen = () => {
  const [data, setData]       = useState<RulesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRulesRegulations();
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load rules & regulations.');
    } finally {
      setLoading(false);
    }
  };

  const { refreshing, onRefresh } = useRefresh(fetchData);

  useFocusLoad(fetchData);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="Rules & Regulations" />
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
        <Header title="Rules & Regulations" />
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

  const getContactIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('email') || k.includes('mail')) return { icon: 'mail',  bg: '#3B82F6', action: (v: string) => Linking.openURL(`mailto:${v}`) };
    if (k.includes('phone') || k.includes('mobile')) return { icon: 'phone', bg: '#A78BFA', action: (v: string) => Linking.openURL(`tel:${v}`) };
    return { icon: 'info', bg: '#10B981', action: undefined };
  };

  return (
    <View style={s.root}>
      <Header title="Rules & Regulations" />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.heroIconWrap}>
            <VectorIcon iconSet="Ionicons" iconName="shield-checkmark-outline" size={36} color={theme.colors.primary} />
          </View>
          <Text style={s.heroTitle}>Rules & Regulations</Text>
          <Text style={s.heroSub}>Please read and follow all rules and regulations carefully.</Text>
          <View style={s.divider} />
        </View>

        {/* ── Sections ── */}
        {data.sections.length === 0 ? (
          <View style={s.emptyBox}>
            <VectorIcon iconSet="Ionicons" iconName="document-text-outline" size={40} color={theme.colors.textMuted} />
            <Text style={s.emptyText}>No rules & regulations available.</Text>
          </View>
        ) : (
          data.sections.map((sec, i) => (
            <View key={i} style={s.section}>
              <View style={s.sectionTitleRow}>
                <View style={s.sectionBar} />
                <Text style={s.sectionTitle}>{sec.head}</Text>
              </View>
              <Text style={s.sectionBody}>{sec.desc}</Text>
              {i < data.sections.length - 1 && <View style={s.sectionDivider} />}
            </View>
          ))
        )}

        {/* ── Files ── */}
        {data.files.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitleRow}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>Documents</Text>
            </View>
            <View style={s.card}>
              {data.files.map((file, i) => (
                <View key={i}>
                  {i > 0 && <View style={s.cardDivider} />}
                  <TouchableOpacity
                    style={s.cardRow}
                    onPress={() => Linking.openURL(file.file_path)}
                    activeOpacity={0.7}>
                    <View style={[s.cardIcon, { backgroundColor: '#EF4444' }]}>
                      <VectorIcon iconSet="Feather" iconName="file-text" size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.cardLabel}>{file.title}</Text>
                      <Text style={s.cardSub}>{file.file_type.toUpperCase()}</Text>
                    </View>
                    <View style={s.cardArrow}>
                      <VectorIcon iconSet="Ionicons" iconName="download-outline" size={16} color={theme.colors.primary} />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Additional Info ── */}
        {data.additional_info.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitleRow}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>Contact</Text>
            </View>
            <View style={s.card}>
              {data.additional_info.map((item, i) => {
                const cfg = getContactIcon(item.key);
                return (
                  <View key={i}>
                    {i > 0 && <View style={s.cardDivider} />}
                    <TouchableOpacity
                      style={s.cardRow}
                      onPress={cfg.action ? () => cfg.action!(item.value) : undefined}
                      activeOpacity={cfg.action ? 0.7 : 1}>
                      <View style={[s.cardIcon, { backgroundColor: cfg.bg }]}>
                        <VectorIcon iconSet="Feather" iconName={cfg.icon} size={18} color="#fff" />
                      </View>
                      <Text style={s.cardLabel}>{item.value}</Text>
                      {!!cfg.action && (
                        <View style={s.cardArrow}>
                          <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={16} color={theme.colors.textMuted} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
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

export default RulesRegulationsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 },
  errorText: { fontSize: 14, color: theme.colors.danger, textAlign: 'center' },
  retryBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: theme.radius.full, marginTop: 8 },
  retryText: { color: '#fff', fontWeight: '700' },

  // Hero
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

  // Section
  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionBar: { width: 4, height: 22, borderRadius: 4, backgroundColor: theme.colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.textPrimary },
  sectionBody: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 24, textAlign: 'justify' },
  sectionDivider: { height: 1, backgroundColor: theme.colors.border, marginTop: 16, marginBottom: 16 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 18,
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  cardIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  cardSub: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600', marginTop: 2 },
  cardArrow: { width: 28, height: 28, borderRadius: 8, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  cardDivider: { height: 1, backgroundColor: theme.colors.border, marginHorizontal: 14 },

  // Empty
  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: theme.colors.textMuted },

  // Footer
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 },
  footerText: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary },
});
