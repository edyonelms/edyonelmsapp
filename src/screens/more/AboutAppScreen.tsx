import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Header';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh, useFocusLoad } from '../../hooks/useRefresh';
import { getAboutApp } from '../../api/authApi';
import { theme } from '../../utils/theme';
import {
  DocHero,
  DocCard,
  DocBody,
  DocRow,
  DocPeople,
  DocNoData,
  DocLoading,
  DocError,
  docStyles,
} from './docUi';

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

const ACCENT = theme.colors.primary;
const TITLE = 'About App';

const contactCfg = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('email') || t.includes('mail')) return { icon: 'mail', bg: '#6C63FF', action: (v: string) => Linking.openURL(`mailto:${v}`) };
  if (t.includes('mobile') || t.includes('phone')) return { icon: 'phone', bg: '#CE7DED', action: (v: string) => Linking.openURL(`tel:${v}`) };
  return { icon: 'map-pin', bg: '#8E54E9', action: undefined as undefined | ((v: string) => void) };
};

const socialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('face')) return 'logo-facebook';
  if (p.includes('insta')) return 'logo-instagram';
  if (p.includes('you')) return 'logo-youtube';
  if (p.includes('twit') || p === 'x') return 'logo-twitter';
  if (p.includes('linked')) return 'logo-linkedin';
  if (p.includes('whats')) return 'logo-whatsapp';
  return 'globe-outline';
};

const AboutAppScreen = () => {
  const [info, setInfo]       = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      setInfo(await getAboutApp());
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load app info.');
    } finally {
      setLoading(false);
    }
  };

  const { refreshing, onRefresh } = useRefresh(fetchData);
  useFocusLoad(fetchData);

  if (loading) return <DocLoading title={TITLE} />;
  if (error || !info) return <DocError title={TITLE} message={error || 'Something went wrong.'} onRetry={fetchData} />;

  const content = info.content ?? [];
  const contacts = info.contact_details ?? [];
  const team = info.core_team ?? [];
  const socials = info.social_media ?? [];
  const hasAnyBody =
    content.length > 0 || contacts.length > 0 || team.length > 0 || socials.length > 0;

  return (
    <View style={docStyles.root}>
      <Header title={TITLE} />
      <ScrollView
        contentContainerStyle={docStyles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <DocHero
          accent={ACCENT}
          logoUrl={info.logo}
          title={info.heading}
          subtitle={info.sub_heading}
        />

        {!hasAnyBody && (
          <DocNoData
            accent={ACCENT}
            icon="information-circle-outline"
            title="No information yet"
            subtitle="The app info hasn’t been added yet. Pull down to refresh."
          />
        )}

        {content.map((item, i) => (
          <DocCard key={i} accent={ACCENT} label={item.title}>
            <DocBody>{item.description}</DocBody>
          </DocCard>
        ))}

        {contacts.length > 0 && (
          <DocCard accent={ACCENT} label="Contact Details">
            {contacts.map((item, i) => {
              const cfg = contactCfg(item.type);
              return (
                <DocRow
                  key={i}
                  iconBg={cfg.bg}
                  icon={cfg.icon}
                  title={item.value}
                  sub={item.type.toUpperCase()}
                  trailingIcon={cfg.action ? 'chevron-forward' : undefined}
                  onPress={cfg.action ? () => cfg.action!(item.value) : undefined}
                  isLast={i === contacts.length - 1}
                />
              );
            })}
          </DocCard>
        )}

        {team.length > 0 && (
          <DocCard accent={ACCENT} label="Core Team">
            <DocPeople accent={ACCENT} people={team} />
          </DocCard>
        )}

        {socials.length > 0 && (
          <DocCard accent={ACCENT} label="Follow Us">
            {socials.map((item, i) => (
              <DocRow
                key={i}
                iconSet="Ionicons"
                iconBg={ACCENT}
                icon={socialIcon(item.platform)}
                title={item.platform}
                trailingIcon="open-outline"
                trailingColor={ACCENT}
                onPress={() => Linking.openURL(item.url)}
                isLast={i === socials.length - 1}
              />
            ))}
          </DocCard>
        )}

        {hasAnyBody && <Text style={cs.copyright}>© 2026 · All rights reserved</Text>}
      </ScrollView>
    </View>
  );
};

export default AboutAppScreen;

const cs = StyleSheet.create({
  copyright: { textAlign: 'center', fontSize: 12, color: theme.colors.textMuted, marginTop: 4 },
});
