import React, { useEffect, useState } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { getTermsConditions } from '../../api/authApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Section      { head: string; desc: string; }
interface FileItem     { title: string; file_path: string; file_type: string; }
interface AdditionalInfo { key: string; value: string; }

interface TermsData {
  platform_logo: string;
  platform_name: string;
  company_name: string;
  company_cin: string;
  last_updated: string;
  metadata: {
    sections: Section[];
    files: FileItem[];
    additional_info: AdditionalInfo[];
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionBlock = ({ title, body }: { title: string; body: string }) => (
  <View style={s.section}>
    <View style={s.sectionTitleRow}>
      <View style={s.sectionBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    <Text style={s.sectionBody}>{body}</Text>
  </View>
);

const ContactRow = ({ icon, iconBg, label, onPress }: { icon: string; iconBg: string; label: string; onPress?: () => void }) => (
  <TouchableOpacity style={s.contactRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={[s.contactIcon, { backgroundColor: iconBg }]}>
      <VectorIcon iconSet="Feather" iconName={icon} size={18} color="#fff" />
    </View>
    <Text style={s.contactLabel}>{label}</Text>
    {!!onPress && (
      <View style={s.contactArrow}>
        <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={16} color={theme.colors.textMuted} />
      </View>
    )}
  </TouchableOpacity>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const TermsConditionsScreen = () => {
  const [data, setData]     = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTermsConditions();
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load terms.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="Terms & Conditions" />
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
        <Header title="Terms & Conditions" />
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

  const { metadata, platform_logo, platform_name, company_name, company_cin, last_updated } = data;

  // Format date
  const formattedDate = last_updated
    ? new Date(last_updated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';

  // Detect contact type for icon
  const getContactIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('email') || k.includes('mail')) return { icon: 'mail', bg: '#3B82F6', action: (v: string) => Linking.openURL(`mailto:${v}`) };
    if (k.includes('phone') || k.includes('mobile')) return { icon: 'phone', bg: '#A78BFA', action: (v: string) => Linking.openURL(`tel:${v}`) };
    return { icon: 'info', bg: '#10B981', action: undefined };
  };

  return (
    <View style={s.root}>
      <Header title="Terms & Conditions" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Logo ── */}
        <View style={s.logoWrap}>
          <View style={s.logoBox}>
            <Image source={{ uri: platform_logo || 'logo' }} style={s.logoImg} />
          </View>
        </View>

        {/* ── Hero ── */}
        <Text style={s.heroTitle}>{platform_name}</Text>
        <Text style={s.heroCompany}>{company_name}</Text>
        {!!company_cin && <Text style={s.heroCin}>CIN: {company_cin}</Text>}
        <Text style={s.heroSub}>Please read these terms carefully before using our services.</Text>
        <View style={s.divider} />

        {/* ── Sections ── */}
        {metadata.sections.map((sec, i) => (
          <SectionBlock key={i} title={sec.head} body={sec.desc} />
        ))}

        {/* ── Files ── */}
        {metadata.files.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitleRow}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>Documents</Text>
            </View>
            <View style={s.contactCard}>
              {metadata.files.map((file, i) => (
                <View key={i}>
                  {i > 0 && <View style={s.contactDivider} />}
                  <TouchableOpacity
                    style={s.contactRow}
                    onPress={() => Linking.openURL(file.file_path)}
                    activeOpacity={0.7}>
                    <View style={[s.contactIcon, { backgroundColor: '#EF4444' }]}>
                      <VectorIcon iconSet="Feather" iconName="file-text" size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.contactLabel}>{file.title}</Text>
                      <Text style={s.fileType}>{file.file_type.toUpperCase()}</Text>
                    </View>
                    <View style={s.contactArrow}>
                      <VectorIcon iconSet="Ionicons" iconName="download-outline" size={16} color={theme.colors.primary} />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Additional Info / Contact ── */}
        {metadata.additional_info.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionTitleRow}>
              <View style={s.sectionBar} />
              <Text style={s.sectionTitle}>Contact</Text>
            </View>
            <View style={s.contactCard}>
              {metadata.additional_info.map((item, i) => {
                const cfg = getContactIcon(item.key);
                return (
                  <View key={i}>
                    {i > 0 && <View style={s.contactDivider} />}
                    <ContactRow
                      icon={cfg.icon}
                      iconBg={cfg.bg}
                      label={item.value}
                      onPress={cfg.action ? () => cfg.action!(item.value) : undefined}
                    />
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

export default TermsConditionsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 },
  errorText: { fontSize: 14, color: theme.colors.danger, textAlign: 'center' },
  retryBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: theme.radius.full, marginTop: 8 },
  retryText: { color: '#fff', fontWeight: '700' },

  logoWrap: { alignItems: 'center', marginTop: 24, marginBottom: 20 },
  logoBox: {
    width: 110, height: 110, borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.colors.primary, shadowOpacity: 0.15,
    shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  logoImg: { width: 90, height: 90, borderRadius: 20, resizeMode: 'contain' },

  heroTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  heroCompany: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  heroCin: { fontSize: 11, color: theme.colors.textMuted, textAlign: 'center', marginTop: 2, marginBottom: 6 },
  heroSub: { fontSize: 14, color: theme.colors.primary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 32, marginTop: 6, marginBottom: 20 },

  divider: { height: 1.5, marginHorizontal: 40, borderRadius: 99, backgroundColor: theme.colors.primaryLight, marginBottom: 24 },

  section: { marginBottom: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, paddingHorizontal: 20 },
  sectionBar: { width: 4, height: 22, borderRadius: 4, backgroundColor: theme.colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.textPrimary },
  sectionBody: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 24, textAlign: 'justify', paddingHorizontal: 20 },

  contactCard: {
    marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  contactIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  contactArrow: { width: 28, height: 28, borderRadius: 8, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' },
  contactDivider: { height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 },
  fileType: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600', marginTop: 2 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingBottom: 8, marginTop: 8 },
  footerText: { fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary },
});
