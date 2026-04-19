import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const SECTION_1 = `At Edyone LMS, we offer a comprehensive suite of services designed to streamline school management and enhance the learning experience for students, teachers, and administrators. The platform opens with a personalized Home Dashboard that centralizes updates and quick access to features. Our Standard module organizes users by class levels, while dedicated Student and Teacher portals provide tailored experiences for learning and teaching. Important updates are shared through the Announcement system, and academic planning is simplified with dynamic Time Tables and Arrangement features. Schools can manage tuition efficiently using our integrated Fee Management module, assign and track tasks with the Homework feature, and ensure accurate Attendance tracking. The Syllabus and Calendar modules help users stay aligned with academic goals and schedules, while Rules & Regulations provide easy access to school policies. Our Content section enables seamless sharing of digital learning materials, and detailed Performance and Analytics tools help monitor academic progress. Students can participate in interactive assessments using the Quiz feature, while the Library module manages book inventories digitally.`;

const SECTION_2 = `By accessing or using Edyone LMS, you agree to comply with and be bound by these Terms & Conditions. We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes your acceptance of the new terms. All content, features, and functionality are owned by Edyone and are protected by applicable intellectual property laws. Unauthorized use, reproduction, or distribution of any part of the platform is strictly prohibited.`;

const ContactRow = ({
  icon,
  iconSet,
  iconBg,
  label,
  onPress,
}: {
  icon: string;
  iconSet: string;
  iconBg: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={s.contactRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[s.contactIcon, { backgroundColor: iconBg }]}>
      <VectorIcon iconSet={iconSet} iconName={icon} size={20} color="#fff" />
    </View>
    <Text style={s.contactLabel}>{label}</Text>
    <View style={s.contactArrow}>
      <VectorIcon
        iconSet="Ionicons"
        iconName="chevron-forward"
        size={16}
        color={theme.colors.textMuted}
      />
    </View>
  </TouchableOpacity>
);

const SectionBlock = ({ title, body }: { title: string; body: string }) => (
  <View style={s.section}>
    <View style={s.sectionTitleRow}>
      <View style={s.sectionBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
    <Text style={s.sectionBody}>{body}</Text>
  </View>
);

const TermsConditionsScreen = () => (
  <View style={s.root}>
    <Header title="Terms  & Condition" />

    <ScrollView
      contentContainerStyle={s.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={s.logoWrap}>
        <View style={s.logoBox}>
          <Image
            source={{ uri: 'logo' }}
            style={{ width: 90, height: 90, borderRadius: 20 }}
          />
        </View>
      </View>

      {/* Hero text */}
      <Text style={s.heroTitle}>Terms & Conditions</Text>
      <Text style={s.heroSub}>
        Please read these terms carefully before using our services.
      </Text>

      {/* Divider */}
      <View style={s.divider} />

      {/* Sections */}
      <SectionBlock title="Section 1" body={SECTION_1} />
      <SectionBlock title="Section 2" body={SECTION_2} />

      {/* Contact */}
      <View style={s.sectionTitleRow}>
        <View style={s.sectionBar} />
        <Text style={s.sectionTitle}>Contact</Text>
      </View>

      <View style={s.contactCard}>
        <ContactRow
          icon="phone"
          iconSet="Feather"
          iconBg="#A78BFA"
          label="8864985914"
          onPress={() => Linking.openURL('tel:8864985914')}
        />
        <View style={s.contactDivider} />
        <ContactRow
          icon="mail"
          iconSet="Feather"
          iconBg="#3B82F6"
          label="support@edyonelms.in"
          onPress={() => Linking.openURL('mailto:support@edyonelms.in')}
        />
      </View>

      {/* Last updated */}
      <View style={s.footer}>
        <VectorIcon
          iconSet="Ionicons"
          iconName="time-outline"
          size={15}
          color={theme.colors.primary}
        />
        <Text style={s.footerText}>Last updated: 2026-03-14 20:21:11</Text>
      </View>
    </ScrollView>
  </View>
);

export default TermsConditionsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },

  // Logo
  logoWrap: { alignItems: 'center', marginTop: 24, marginBottom: 20 },
  logoBox: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  // Hero
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 32,
    marginBottom: 20,
  },

  // Divider
  divider: {
    height: 1.5,
    marginHorizontal: 40,
    borderRadius: 99,
    backgroundColor: theme.colors.primaryLight,
    marginBottom: 24,
  },

  // Section
  section: { marginBottom: 24 },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionBar: {
    width: 4,
    height: 22,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  sectionBody: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    textAlign: 'justify',
    paddingHorizontal: 20,
  },

  // Contact card
  contactCard: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  contactIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  contactArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
});
