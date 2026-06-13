import React, { useEffect, useState } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
import {
  ActivityIndicator,
  Dimensions,
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
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh, useFocusLoad } from '../../hooks/useRefresh';
import { getAboutApp } from '../../api/authApi';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContentItem  { title: string; description: string; }
interface ContactItem  { type: string; value: string; }
interface SocialItem   { platform: string; url: string; icon: string; }
interface TeamMember   { id: number; name: string; designation: string; photo_url: string | null; }

interface AboutData {
  heading: string;
  sub_heading: string;
  logo: string;
  content: ContentItem[];
  contact_details: ContactItem[];
  address: string;
  core_team: TeamMember[];
  social_media: SocialItem[];
}

// ─── Contact icon map ─────────────────────────────────────────────────────────
const contactIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('email') || t.includes('mail')) return { icon: 'mail-outline',     color: '#6C63FF', action: (v: string) => Linking.openURL(`mailto:${v}`) };
  if (t.includes('mobile') || t.includes('phone')) return { icon: 'call-outline',   color: '#CE7DED', action: (v: string) => Linking.openURL(`tel:${v}`) };
  return { icon: 'location-outline', color: '#8E54E9', action: undefined };
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const AboutAppScreen = () => {
  const [info, setInfo]       = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAboutApp();
      setInfo(data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load app info.');
    } finally {
      setLoading(false);
    }
  };

  const { refreshing, onRefresh } = useRefresh(fetchData);

  useFocusLoad(fetchData);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="About App" />
        <View style={s.center}>
          <ScreenSkeleton variant="doc" />
          <Text style={s.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !info) {
    return (
      <View style={s.root}>
        <Header title="About App" />
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

  return (
    <View style={s.root}>
      <Header title="About App" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.logoWrap}>
            <Image source={{ uri: info.logo }} style={s.logo} />
          </View>
          <Text style={s.heroTitle}>{info.heading}</Text>
          <Text style={s.heroSub}>{info.sub_heading}</Text>
          <View style={s.divider} />
        </View>

        {/* ── Content Sections ── */}
        {info.content.map((item, i) => (
          <View key={i}>
            <View style={s.section}>
              <View style={s.sectionTitleRow}>
                <View style={s.bar} />
                <Text style={s.sectionTitle}>{item.title}</Text>
              </View>
              <Text style={s.sectionText}>{item.description}</Text>
            </View>
            {i < info.content.length - 1 && <View style={s.sectionDivider} />}
          </View>
        ))}

        <View style={s.sectionDivider} />

        {/* ── Contact Details ── */}
        <View style={s.card}>
          <View style={s.sectionTitleRow}>
            <View style={s.bar} />
            <Text style={s.sectionTitle}>Contact Details</Text>
          </View>
          {info.contact_details.map((item, i) => {
            const cfg = contactIcon(item.type);
            return (
              <TouchableOpacity
                key={i}
                style={[s.cardItem, i === info.contact_details.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => cfg.action?.(item.value)}
                activeOpacity={cfg.action ? 0.7 : 1}>
                <View style={[s.contactIcon, { backgroundColor: cfg.color }]}>
                  <VectorIcon iconSet="Ionicons" iconName={cfg.icon} size={18} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.contactType}>{item.type.toUpperCase()}</Text>
                  <Text style={s.contactValue}>{item.value}</Text>
                </View>
                {!!cfg.action && (
                  <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={16} color="#B0B0B0" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Core Team ── */}
        <View style={s.card}>
          <View style={s.sectionTitleRow}>
            <View style={s.bar} />
            <Text style={s.sectionTitle}>Core Team</Text>
          </View>
          {info.core_team.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 8 }}>
              {info.core_team.map(member => (
                <View key={member.id} style={s.teamCard}>
                  {member.photo_url
                    ? <Image source={{ uri: member.photo_url }} style={s.teamAvatar} />
                    : (
                      <View style={s.teamAvatarFallback}>
                        <Text style={s.teamInitial}>{member.name.charAt(0)}</Text>
                      </View>
                    )
                  }
                  <Text style={s.teamName} numberOfLines={2}>{member.name}</Text>
                  <Text style={s.teamDesig} numberOfLines={1}>{member.designation}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={s.emptyTeam}>
              <VectorIcon iconSet="Ionicons" iconName="people-outline" size={40} color="#C8B6FF" />
              <Text style={s.emptyTeamText}>Team info not available.</Text>
            </View>
          )}
        </View>

        {/* ── Social Media ── */}
        {info.social_media.length > 0 && (
          <View style={s.card}>
            <View style={s.sectionTitleRow}>
              <View style={s.bar} />
              <Text style={s.sectionTitle}>Follow Us</Text>
            </View>
            {info.social_media.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[s.cardItem, i === info.social_media.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => Linking.openURL(item.url)}
                activeOpacity={0.8}>
                {item.icon
                  ? <Image source={{ uri: item.icon }} style={s.socialIcon} />
                  : (
                    <View style={[s.contactIcon, { backgroundColor: '#6C63FF' }]}>
                      <VectorIcon iconSet="Ionicons" iconName="globe-outline" size={18} color="#fff" />
                    </View>
                  )
                }
                <Text style={[s.contactValue, { flex: 1, marginLeft: 12, textTransform: 'capitalize' }]}>{item.platform}</Text>
                <TouchableOpacity style={s.followBtn} onPress={() => Linking.openURL(item.url)}>
                  <Text style={s.followText}>Visit</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerLine} />
          <Text style={s.footerText}>© 2026 · All rights reserved</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default AboutAppScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 20 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  loadingText: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 },
  errorText: { fontSize: 14, color: theme.colors.danger, textAlign: 'center' },
  retryBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: theme.radius.full, marginTop: 8 },
  retryText: { color: '#fff', fontWeight: '700' },

  // Hero
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 30 },
  logoWrap: {
    width: 100, height: 100, borderRadius: 30, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#E6DDFE', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8, shadowRadius: 20, elevation: 10,
    marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0',
  },
  logo: { width: 90, height: 90, borderRadius: 22, resizeMode: 'contain' },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 6 },
  heroSub: { fontSize: 14, color: '#8B8BAE', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  divider: { width: width * 0.7, height: 2, backgroundColor: '#DCD4FB', opacity: 0.6, marginBottom: 28 },

  // Section
  section: { paddingHorizontal: 20, marginBottom: 4 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  bar: { width: 4, height: 20, backgroundColor: '#5B7FFF', borderRadius: 4, marginRight: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#000' },
  sectionText: { fontSize: 14, color: '#1E1E1E', lineHeight: 24, textAlign: 'justify' },
  sectionDivider: { height: 1, backgroundColor: '#eee', marginHorizontal: 20, marginVertical: 16 },

  // Card
  card: {
    backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16,
    padding: 16, marginTop: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  cardItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 12 },

  // Contact
  contactIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  contactType: { fontSize: 10, color: '#7C3AED', fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  contactValue: { fontSize: 14, color: '#1A1A1A' },

  // Team
  teamCard: { width: 110, alignItems: 'center', gap: 6 },
  teamAvatar: { width: 64, height: 64, borderRadius: 32, resizeMode: 'cover' },
  teamAvatarFallback: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  teamInitial: { fontSize: 22, fontWeight: '800', color: '#7C3AED' },
  teamName: { fontSize: 12, fontWeight: '700', color: theme.colors.textPrimary, textAlign: 'center' },
  teamDesig: { fontSize: 11, color: theme.colors.textMuted, textAlign: 'center' },
  emptyTeam: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  emptyTeamText: { color: '#B0AFC6' },

  // Social
  socialIcon: { width: 44, height: 44, borderRadius: 12, resizeMode: 'contain' },
  followBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#6C63FF' },
  followText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Footer
  footer: { alignItems: 'center', marginTop: 30 },
  footerLine: { width: 200, height: 2, borderRadius: 2, backgroundColor: '#6C63FF' },
  footerText: { fontSize: 12, color: '#A0A0A0', marginTop: 12 },
});
