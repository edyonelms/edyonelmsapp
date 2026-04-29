import React, { useEffect, useState } from 'react';
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
import { getSchoolInfo } from '../../api/authApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ManagementMember {
  id: number;
  name: string;
  designation: string;
  photo_url: string | null;
  sort_order: number;
}

interface SchoolInfo {
  about_school: string;
  website_info: string;
  website_url: string;
  usm_vision: string;
  usm_mission: string;
  usm_values: string;
  usm_goals: string;
  school_mobile: string;
  school_email: string;
  school_address: string;
  management_team: ManagementMember[];
  documents: any[];
  organization: { logo_url: string; name: string };
}

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ title, content }: { title: string; content: string }) => {
  if (!content?.trim()) return null;
  return (
    <View style={s.section}>
      <View style={s.sectionTitleRow}>
        <View style={s.bar} />
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      <Text style={s.sectionText}>{content}</Text>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const SchoolInfoScreen = () => {
  const [info, setInfo] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getSchoolInfo();
        setInfo(data);
      } catch (e: any) {
        console.log('[SchoolInfo] ❌ Error:', e?.response?.data ?? e?.message);
        setError(e?.response?.data?.message ?? 'Failed to load school info.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={s.root}>
        <Header title="School Info" />
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={s.loadingText}>Loading school info...</Text>
        </View>
      </View>
    );
  }

  if (error || !info) {
    return (
      <View style={s.root}>
        <Header title="School Info" />
        <View style={s.center}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="alert-circle-outline"
            size={48}
            color={theme.colors.danger}
          />
          <Text style={s.errorText}>{error || 'Something went wrong.'}</Text>
          <TouchableOpacity
            style={s.retryBtn}
            onPress={() => {
              setLoading(true);
              setError('');
            }}
          >
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <Header title="School Info" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Logo + Name ── */}
        <View style={s.logoSection}>
          <View style={s.logoWrap}>
            <Image
              source={{ uri: info.organization?.logo_url }}
              style={s.logo}
              defaultSource={{ uri: 'logo' }}
            />
          </View>
          <Text style={s.schoolName}>{info.organization?.name}</Text>
        </View>

        {/* ── Info Sections ── */}
        <Section title="About School" content={info.about_school} />
        <Section title="Our Vision" content={info.usm_vision} />
        <Section title="Our Mission" content={info.usm_mission} />
        <Section title="Our Values" content={info.usm_values} />
        <Section title="Our Goals" content={info.usm_goals} />
        <Section title="Website Info" content={info.website_info} />

        {/* ── Visit Website ── */}
        {!!info.website_url && (
          <TouchableOpacity
            style={s.websiteBtn}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(info.website_url)}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="globe-outline"
              size={18}
              color="#fff"
            />
            <Text style={s.websiteBtnText}>Visit Website</Text>
          </TouchableOpacity>
        )}

        {/* ── Management Team ── */}
        {info.management_team?.length > 0 && (
          <View style={s.mgmtSection}>
            <View style={s.sectionTitleRow}>
              <View style={s.bar} />
              <Text style={s.sectionTitle}>School Management</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.mgmtScroll}
            >
              {info.management_team.map(member => (
                <View key={member.id} style={s.mgmtCard}>
                  <View style={s.mgmtAccent} />
                  <View style={s.mgmtAvatarWrap}>
                    {member.photo_url ? (
                      <Image
                        source={{ uri: member.photo_url }}
                        style={s.mgmtAvatar}
                      />
                    ) : (
                      <View style={s.mgmtAvatarFallback}>
                        <Text style={s.mgmtAvatarInitial}>
                          {member.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.mgmtName} numberOfLines={2}>
                    {member.name}
                  </Text>
                  <View style={s.mgmtChip}>
                    <Text style={s.mgmtChipText} numberOfLines={1}>
                      {member.designation}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Documents ── */}
        {info.documents?.length > 0 && (
          <View style={s.listSection}>
            <View style={s.sectionTitleRow}>
              <View style={s.bar} />
              <Text style={s.sectionTitle}>School Documents</Text>
            </View>
            {info.documents.map((doc: any, i: number) => (
              <TouchableOpacity key={i} style={s.listItem}>
                <View style={s.listIcon}>
                  <VectorIcon
                    iconSet="Feather"
                    iconName="file-text"
                    size={18}
                    color="#fff"
                  />
                </View>
                <Text style={s.listItemText}>
                  {doc.name ?? `Document ${i + 1}`}
                </Text>
                <View style={s.chevronWrap}>
                  <VectorIcon
                    iconSet="Feather"
                    iconName="chevron-right"
                    size={16}
                    color="#A78BFA"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Contact ── */}
        <View style={s.listSection}>
          <View style={s.sectionTitleRow}>
            <View style={s.bar} />
            <Text style={s.sectionTitle}>Contact Information</Text>
          </View>

          {!!info.school_mobile && (
            <TouchableOpacity
              style={s.listItem}
              onPress={() => Linking.openURL(`tel:${info.school_mobile}`)}
            >
              <View style={[s.listIcon, { backgroundColor: '#CE7DED' }]}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="phone-call"
                  size={18}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.listLabel}>PHONE</Text>
                <Text style={s.listValue}>{info.school_mobile}</Text>
              </View>
              <View style={s.chevronWrap}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="chevron-right"
                  size={16}
                  color="#A78BFA"
                />
              </View>
            </TouchableOpacity>
          )}

          {!!info.school_email && (
            <TouchableOpacity
              style={s.listItem}
              onPress={() => Linking.openURL(`mailto:${info.school_email}`)}
            >
              <View style={[s.listIcon, { backgroundColor: '#3A7CF8' }]}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="mail"
                  size={18}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.listLabel}>EMAIL</Text>
                <Text style={s.listValue}>{info.school_email}</Text>
              </View>
              <View style={s.chevronWrap}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="chevron-right"
                  size={16}
                  color="#A78BFA"
                />
              </View>
            </TouchableOpacity>
          )}

          {!!info.school_address && (
            <View style={s.listItem}>
              <View style={[s.listIcon, { backgroundColor: '#8E54E9' }]}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="map-pin"
                  size={18}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.listLabel}>ADDRESS</Text>
                <Text style={s.listValue}>{info.school_address}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default SchoolInfoScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.white },
  scroll: { paddingBottom: 20 },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  errorText: { fontSize: 14, color: theme.colors.danger, textAlign: 'center' },
  retryBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
  },
  retryText: { color: '#fff', fontWeight: '700' },

  // Logo
  logoSection: { alignItems: 'center', paddingVertical: 28 },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E6DDFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 12,
  },
  logo: { width: 90, height: 90, borderRadius: 24, resizeMode: 'contain' },
  schoolName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },

  // Section
  section: { paddingHorizontal: 20, marginBottom: 4 },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 16,
  },
  bar: {
    width: 4,
    height: 20,
    backgroundColor: '#5B7FFF',
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  sectionText: {
    fontSize: 14,
    color: '#1E1E1E',
    lineHeight: 24,
    textAlign: 'justify',
  },

  // Website button
  websiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  websiteBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  // Management
  mgmtSection: { marginTop: 8, paddingHorizontal: 20},
  mgmtScroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 8 },
  mgmtCard: {
    width: 130,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingBottom: 16,
    shadowColor: '#E6DDFE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  mgmtAccent: {
    width: '50%',
    height: 4,
    backgroundColor: '#7C3AED',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 14,
    alignSelf: 'center',
  },
  mgmtAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#7C3AED',
    overflow: 'hidden',
    marginBottom: 10,
  },
  mgmtAvatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  mgmtAvatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mgmtAvatarInitial: { fontSize: 22, fontWeight: '800', color: '#7C3AED' },
  mgmtName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  mgmtChip: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mgmtChipText: { fontSize: 11, color: '#7C3AED', fontWeight: '600' },

  // List
  listSection: { marginTop: 8, paddingHorizontal: 20 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  listIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6B60F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: { flex: 1, fontSize: 15, color: '#1A1A1A', fontWeight: '600' },
  listLabel: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  listValue: { fontSize: 14, color: '#1A1A1A', fontWeight: '400' },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
