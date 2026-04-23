import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

type ExamStatus = 'Published' | 'Upcoming' | 'Completed';
type ExamType = 'Unit Test' | 'Mid Term' | 'Final Term' | 'Pre-Board';

interface SyllabusItem {
  subject: string;
  topics: string[];
}

interface Exam {
  id: string;
  name: string;
  subtitle: string;
  academicYear: string;
  type: ExamType;
  dateRange: string;
  status: ExamStatus;
  syllabus: SyllabusItem[];
}

const EXAMS: Exam[] = [
  {
    id: '1',
    name: 'IA 1',
    subtitle: 'Marks System',
    academicYear: '2026-2027',
    type: 'Unit Test',
    dateRange: '03 Feb - 26 Feb 2026',
    status: 'Published',
    syllabus: [
      {
        subject: 'Mathematics',
        topics: ['Algebra', 'Linear Equations', 'Polynomials'],
      },
      { subject: 'Science', topics: ['Motion', 'Force & Laws', 'Gravitation'] },
      {
        subject: 'English',
        topics: ['Grammar', 'Comprehension', 'Writing Skills'],
      },
    ],
  },
  {
    id: '2',
    name: 'Mid Term',
    subtitle: 'Marks System',
    academicYear: '2026-2027',
    type: 'Mid Term',
    dateRange: '10 Mar - 20 Mar 2026',
    status: 'Upcoming',
    syllabus: [
      {
        subject: 'Mathematics',
        topics: ['Triangles', 'Coordinate Geometry', 'Statistics'],
      },
      {
        subject: 'Science',
        topics: ['Work & Energy', 'Sound', 'Structure of Atom'],
      },
      {
        subject: 'Social Science',
        topics: ['French Revolution', 'Socialism', 'Nazism'],
      },
    ],
  },
  {
    id: '3',
    name: 'IA 2',
    subtitle: 'Marks System',
    academicYear: '2025-2026',
    type: 'Unit Test',
    dateRange: '05 Nov - 15 Nov 2025',
    status: 'Completed',
    syllabus: [
      { subject: 'Mathematics', topics: ['Circles', 'Constructions', 'Areas'] },
      {
        subject: 'Science',
        topics: ['Natural Resources', 'Improvement in Food', 'Cell'],
      },
    ],
  },
  {
    id: '4',
    name: 'Final Term',
    subtitle: 'Marks System',
    academicYear: '2025-2026',
    type: 'Final Term',
    dateRange: '01 Mar - 20 Mar 2026',
    status: 'Completed',
    syllabus: [
      { subject: 'Mathematics', topics: ['Full Syllabus'] },
      { subject: 'Science', topics: ['Full Syllabus'] },
      { subject: 'English', topics: ['Full Syllabus'] },
      { subject: 'Social Science', topics: ['Full Syllabus'] },
    ],
  },
];

const STATUS_CONFIG: Record<
  ExamStatus,
  { color: string; bg: string; accent: string }
> = {
  Published: { color: '#16A34A', bg: '#DCFCE7', accent: '#16A34A' },
  Upcoming: { color: '#D97706', bg: '#FEF3C7', accent: '#D97706' },
  Completed: { color: '#64748B', bg: '#F1F5F9', accent: '#94A3B8' },
};

const TYPE_ICON: Record<ExamType, string> = {
  'Unit Test': 'document-text-outline',
  'Mid Term': 'school-outline',
  'Final Term': 'trophy-outline',
  'Pre-Board': 'ribbon-outline',
};

const FILTERS: (ExamStatus | 'All')[] = [
  'All',
  'Published',
  'Upcoming',
  'Completed',
];

const TeacherExamsScreen = () => {
  const [activeFilter, setActiveFilter] = useState<ExamStatus | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = EXAMS.filter(e => {
    const matchFilter = activeFilter === 'All' || e.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.academicYear.includes(q);
    return matchFilter && matchSearch;
  });

  const renderExam = ({ item }: { item: Exam }) => {
    const isExpanded = expandedId === item.id;
    const sc = STATUS_CONFIG[item.status];

    return (
      <View style={styles.card}>
        {/* Accent bar */}
        <View style={[styles.accentBar, { backgroundColor: sc.accent }]} />

        <View style={styles.cardInner}>
          {/* Top row: name + status badge */}
          <View style={styles.cardTop}>
            <View style={styles.iconWrap}>
              <VectorIcon
                iconSet="Ionicons"
                iconName={TYPE_ICON[item.type]}
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.examName}>{item.name}</Text>
              <Text style={styles.examSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: sc.bg }]}>
              <View style={[styles.badgeDot, { backgroundColor: sc.color }]} />
              <Text style={[styles.badgeText, { color: sc.color }]}>
                {item.status}
              </Text>
            </View>
          </View>

          {/* Info pills row */}
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="calendar-outline"
                size={12}
                color={theme.colors.primary}
              />
              <Text style={styles.pillText}>{item.academicYear}</Text>
            </View>
            <View style={styles.pill}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="layers-outline"
                size={12}
                color={theme.colors.primary}
              />
              <Text style={styles.pillText}>{item.type}</Text>
            </View>
          </View>

          {/* Date range */}
          <View style={styles.dateRow}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="time-outline"
              size={13}
              color={theme.colors.textMuted}
            />
            <Text style={styles.dateText}>{item.dateRange}</Text>
          </View>
        </View>

        {/* Syllabus toggle */}
        <TouchableOpacity
          style={styles.syllabusToggle}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.syllabusToggleText}>
            {isExpanded ? 'Hide Syllabus' : 'View Syllabus'}
          </Text>
          <VectorIcon
            iconSet="Ionicons"
            iconName={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        {/* Syllabus expanded */}
        {isExpanded && (
          <View style={styles.syllabusBox}>
            {item.syllabus.map((s, i) => (
              <View key={i} style={styles.syllabusItem}>
                <View style={styles.syllabusLeft}>
                  <View style={styles.subjectDot} />
                  <Text style={styles.syllabusSubject}>{s.subject}</Text>
                </View>
                <View style={styles.topicsWrap}>
                  {s.topics.map((t, j) => (
                    <View key={j} style={styles.topicChip}>
                      <Text style={styles.topicChipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <Header title="Exams" />

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <VectorIcon iconSet="Ionicons" iconName="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exams..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
            <VectorIcon iconSet="Ionicons" iconName="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                activeFilter === f && styles.filterBtnActive,
              ]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderExam}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No exams found.</Text>}
      />
    </View>
  );
};

export default TeacherExamsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
    padding: 0,
  },

  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: 8,
    alignItems: 'center',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterTextActive: { color: '#fff' },

  list: { padding: theme.spacing.lg, gap: 14 },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000000',
    elevation: 3,
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  cardInner: {
    padding: theme.spacing.md,
    gap: 10,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  examSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  syllabusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  syllabusToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  syllabusBox: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: 12,
  },
  syllabusItem: {
    gap: 6,
  },
  syllabusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  subjectDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  syllabusSubject: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  topicsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingLeft: 14,
  },
  topicChip: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  topicChipText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  empty: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: 40,
  },
});
