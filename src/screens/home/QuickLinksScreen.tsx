import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

type Role = 'student' | 'teacher';

interface QuickLink {
  label: string;
  icon: string;
  color: string;
  bg: string;
  route: string;
  roles: Role[];
}

interface Category {
  title: string;
  icon: string;
  accent: string;
  accentBg: string;
  links: QuickLink[];
}

const CATEGORIES: Category[] = [
  {
    title: 'Academics',
    icon: 'school-outline',
    accent: '#4F46E5',
    accentBg: '#E0E7FF',
    links: [
      { label: 'Subjects',     icon: 'library-outline',       color: '#4F46E5', bg: '#E0E7FF', route: 'Subjects',         roles: ['student', 'teacher'] },
      { label: 'Syllabus',     icon: 'layers-outline',        color: '#DC2626', bg: '#FEE2E2', route: 'Syllabus',         roles: ['student', 'teacher'] },
      { label: 'Timetable',    icon: 'time-outline',          color: '#0EA5E9', bg: '#E0F2FE', route: 'Timetable',        roles: ['student', 'teacher'] },
      { label: 'Content',      icon: 'folder-open-outline',   color: '#D97706', bg: '#FEF3C7', route: 'Content',          roles: ['student', 'teacher'] },
      { label: 'Homework',     icon: 'book-outline',          color: '#7C3AED', bg: '#EDE9FE', route: 'Homework',         roles: ['student', 'teacher'] },
      { label: 'Quiz',         icon: 'help-circle-outline',   color: '#0EA5E9', bg: '#DBEAFE', route: 'Quiz',             roles: ['student', 'teacher'] },
    ],
  },
  {
    title: 'Exams & Results',
    icon: 'document-text-outline',
    accent: '#7C3AED',
    accentBg: '#EDE9FE',
    links: [
      { label: 'Exams',        icon: 'document-text-outline', color: '#4F46E5', bg: '#E0E7FF', route: 'Exams',            roles: ['student', 'teacher'] },
      { label: 'Admit Card',   icon: 'card-outline',          color: '#16A34A', bg: '#DCFCE7', route: 'AdmitCardScreen',  roles: ['student'] },
      { label: 'Seating Plan', icon: 'grid-outline',          color: '#D97706', bg: '#FEF3C7', route: 'SeatingPlanScreen',roles: ['student'] },
      { label: 'Exam Copy',    icon: 'copy-outline',          color: '#0EA5E9', bg: '#E0F2FE', route: 'ExamCopyScreen',   roles: ['student'] },
      { label: 'Report Card',  icon: 'ribbon-outline',        color: '#DC2626', bg: '#FEE2E2', route: 'ReportCardScreen', roles: ['student'] },
      { label: 'Performance',  icon: 'trending-up-outline',   color: '#16A34A', bg: '#DCFCE7', route: 'PerformanceScreen',roles: ['student'] },
    ],
  },
  {
    title: 'Attendance',
    icon: 'calendar-outline',
    accent: '#16A34A',
    accentBg: '#DCFCE7',
    links: [
      { label: 'Attendance',   icon: 'calendar-outline',      color: '#16A34A', bg: '#DCFCE7', route: 'Attendance',       roles: ['student', 'teacher'] },
      { label: 'Mark Attend.', icon: 'checkbox-outline',      color: '#4F46E5', bg: '#E0E7FF', route: 'MarkAttendance',   roles: ['teacher'] },
    ],
  },
  {
    title: 'Finance',
    icon: 'wallet-outline',
    accent: '#D97706',
    accentBg: '#FEF3C7',
    links: [
      { label: 'Fees',         icon: 'card-outline',          color: '#D97706', bg: '#FEF3C7', route: 'Fees',             roles: ['student'] },
    ],
  },
  {
    title: 'Communication',
    icon: 'chatbubbles-outline',
    accent: '#0EA5E9',
    accentBg: '#E0F2FE',
    links: [
      { label: 'Chats',        icon: 'chatbubbles-outline',   color: '#4F46E5', bg: '#E0E7FF', route: 'Chats',            roles: ['student', 'teacher'] },
      { label: 'Announcement', icon: 'megaphone-outline',     color: '#0EA5E9', bg: '#E0F2FE', route: 'Announcement',     roles: ['student', 'teacher'] },
      { label: 'Contact',      icon: 'call-outline',          color: '#16A34A', bg: '#DCFCE7', route: 'ContactSchool',    roles: ['student', 'teacher'] },
      { label: 'Notifications',icon: 'notifications-outline', color: '#DC2626', bg: '#FEE2E2', route: 'Notifications',    roles: ['student', 'teacher'] },
    ],
  },
  {
    title: 'Resources',
    icon: 'bookmarks-outline',
    accent: '#7C3AED',
    accentBg: '#EDE9FE',
    links: [
      { label: 'Books',        icon: 'bookmarks-outline',     color: '#7C3AED', bg: '#EDE9FE', route: 'Book',             roles: ['student', 'teacher'] },
      { label: 'Instructor',   icon: 'person-outline',        color: '#0EA5E9', bg: '#E0F2FE', route: 'Instructor',       roles: ['student'] },
      { label: 'Transport',    icon: 'bus-outline',           color: '#16A34A', bg: '#DCFCE7', route: 'Transport',        roles: ['student'] },
      { label: 'Calendar',     icon: 'calendar-outline',      color: '#D97706', bg: '#FEF3C7', route: 'Calendar',         roles: ['student', 'teacher'] },
    ],
  },
  {
    title: 'Account',
    icon: 'person-circle-outline',
    accent: '#64748B',
    accentBg: '#F1F5F9',
    links: [
      { label: 'Settings',     icon: 'settings-outline',      color: '#64748B', bg: '#F1F5F9', route: 'Settings',         roles: ['student', 'teacher'] },
      { label: 'ID Card',      icon: 'id-card-outline',       color: '#4F46E5', bg: '#E0E7FF', route: 'IDCard',           roles: ['student', 'teacher'] },
      { label: 'More',         icon: 'apps-outline',          color: '#64748B', bg: '#F1F5F9', route: 'More',             roles: ['student', 'teacher'] },
    ],
  },
];

const ITEM_SIZE = (width - 40 - 48) / 4; // 4 cols, padding 20 each side, 3 gaps of 16

const QuickLinksScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const role: Role = route?.params?.userRole === 'teacher' ? 'teacher' : 'student';
  const [search, setSearch] = useState('');

  const q = search.toLowerCase().trim();

  const allLinks = CATEGORIES.flatMap(c => c.links).filter(l => l.roles.includes(role));
  const searchResults = q ? allLinks.filter(l => l.label.toLowerCase().includes(q)) : [];

  const navigate = (r: string) =>
    navigation.navigate(r, r === 'Notifications' ? { role } : undefined);

  const LinkItem = ({ item }: { item: QuickLink }) => (
    <TouchableOpacity style={s.item} onPress={() => navigate(item.route)} activeOpacity={0.75}>
      <View style={[s.itemIconWrap, { backgroundColor: item.bg }]}>
        <View style={[s.itemIconInner, { backgroundColor: item.color + '22' }]}>
          <VectorIcon iconSet="Ionicons" iconName={item.icon} size={22} color={item.color} />
        </View>
      </View>
      <Text style={s.itemLabel} numberOfLines={2}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* ── Hero Header ── */}
      <View style={s.hero}>


        <View style={s.heroTop}>
          <View>
            <Text style={s.heroLabel}>EDYONE LMS</Text>
            <Text style={s.heroTitle}>Quick Links</Text>
            <Text style={s.heroSub}>
              {role === 'teacher' ? '👨‍🏫 Teacher Portal' : '🎓 Student Portal'} · All features
            </Text>
          </View>
          <View style={s.heroBadge}>
            <VectorIcon iconSet="Ionicons" iconName="flash" size={22} color="#fff" />
          </View>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <VectorIcon iconSet="Ionicons" iconName="search-outline" size={17} color={theme.colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search anything..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <VectorIcon iconSet="Ionicons" iconName="close-circle" size={17} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Search Results ── */}
        {q.length > 0 ? (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={[s.sectionPill, { backgroundColor: theme.colors.primaryLight }]}>
                <VectorIcon iconSet="Ionicons" iconName="search-outline" size={12} color={theme.colors.primary} />
                <Text style={[s.sectionPillText, { color: theme.colors.primary }]}>Search</Text>
              </View>
              <Text style={s.sectionTitle}>"{search}"</Text>
            </View>
            {searchResults.length === 0 ? (
              <View style={s.emptyBox}>
                <View style={s.emptyIconWrap}>
                  <VectorIcon iconSet="Ionicons" iconName="search-outline" size={30} color={theme.colors.textMuted} />
                </View>
                <Text style={s.emptyTitle}>No results</Text>
                <Text style={s.emptySubtitle}>Try a different keyword</Text>
              </View>
            ) : (
              <View style={s.grid}>
                {searchResults.map(item => <LinkItem key={item.route} item={item} />)}
              </View>
            )}
          </View>
        ) : (
          CATEGORIES.map(cat => {
            const links = cat.links.filter(l => l.roles.includes(role));
            if (links.length === 0) return null;
            return (
              <View key={cat.title} style={s.section}>
                {/* Section header */}
                <View style={s.sectionHead}>
                  <View style={[s.sectionPill, { backgroundColor: cat.accentBg }]}>
                    <VectorIcon iconSet="Ionicons" iconName={cat.icon} size={12} color={cat.accent} />
                    <Text style={[s.sectionPillText, { color: cat.accent }]}>{cat.title}</Text>
                  </View>
                  <View style={[s.sectionLine, { backgroundColor: cat.accent + '30' }]} />
                </View>

                {/* Card */}
                <View style={[s.catCard, { borderTopColor: cat.accent }]}>
                  <View style={s.grid}>
                    {links.map(item => <LinkItem key={item.route} item={item} />)}
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default QuickLinksScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F1F5F9' },

  // Hero
  hero: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  heroLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(165,180,252,0.8)', letterSpacing: 2, marginBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  heroBadge: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)',
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
  },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.textPrimary, padding: 0 },

  // Scroll
  scroll: { paddingHorizontal: 16, paddingTop: 18, gap: 4 },

  // Section
  section: { marginBottom: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
  },
  sectionPillText: { fontSize: 12, fontWeight: '800' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  sectionLine: { flex: 1, height: 1.5, borderRadius: 1 },

  // Category card
  catCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderTopWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Grid
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: 14, gap: 6,
  },

  // Item
  item: {
    width: ITEM_SIZE,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 7,
  },
  itemIconWrap: {
    width: 54, height: 54,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  itemIconInner: {
    width: 44, height: 44,
    borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 10.5, fontWeight: '700',
    color: theme.colors.textSecondary,
    textAlign: 'center', lineHeight: 14,
  },

  // Empty
  emptyBox: {
    alignItems: 'center', paddingVertical: 36,
    backgroundColor: '#fff', borderRadius: 18,
    gap: 6,
  },
  emptyIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: theme.colors.background,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary },
  emptySubtitle: { fontSize: 12, color: theme.colors.textMuted },
});
