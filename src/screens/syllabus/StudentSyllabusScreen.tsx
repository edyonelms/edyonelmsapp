import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Topic {
  id: string;
  name: string;
}
interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}
interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Physics',
    chapters: [
      {
        id: 'c1',
        name: 'Motion & Laws',
        topics: [
          { id: 't1', name: 'Introduction to Motion' },
          { id: 't2', name: "Newton's Laws" },
          { id: 't3', name: 'Friction' },
        ],
      },
      {
        id: 'c2',
        name: 'Work & Energy',
        topics: [
          { id: 't1', name: 'Work Done' },
          { id: 't2', name: 'Kinetic Energy' },
          { id: 't3', name: 'Potential Energy' },
        ],
      },
      {
        id: 'c3',
        name: 'Gravitation',
        topics: [
          { id: 't1', name: "Newton's Law of Gravitation" },
          { id: 't2', name: 'Free Fall' },
        ],
      },
      {
        id: 'c4',
        name: 'Sound',
        topics: [
          { id: 't1', name: 'Nature of Sound' },
          { id: 't2', name: 'Speed of Sound' },
        ],
      },
      { id: 'c5', name: 'Light', topics: [] },
    ],
  },
  {
    id: '2',
    name: 'Mathematics',
    chapters: [
      {
        id: 'c1',
        name: 'Real Numbers',
        topics: [
          { id: 't1', name: "Euclid's Division Lemma" },
          { id: 't2', name: 'Fundamental Theorem' },
        ],
      },
      {
        id: 'c2',
        name: 'Polynomials',
        topics: [
          { id: 't1', name: 'Zeroes of Polynomial' },
          { id: 't2', name: 'Division Algorithm' },
        ],
      },
      {
        id: 'c3',
        name: 'Linear Equations',
        topics: [
          { id: 't1', name: 'Graphical Method' },
          { id: 't2', name: 'Substitution Method' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Chemistry',
    chapters: [
      {
        id: 'c1',
        name: 'Matter',
        topics: [
          { id: 't1', name: 'States of Matter' },
          { id: 't2', name: 'Evaporation' },
        ],
      },
      {
        id: 'c2',
        name: 'Atoms & Molecules',
        topics: [{ id: 't1', name: 'Laws of Chemical Combination' }],
      },
    ],
  },
  {
    id: '4',
    name: 'Biology',
    chapters: [
      {
        id: 'c1',
        name: 'Cell',
        topics: [
          { id: 't1', name: 'Cell Theory' },
          { id: 't2', name: 'Cell Organelles' },
        ],
      },
      {
        id: 'c2',
        name: 'Tissues',
        topics: [
          { id: 't1', name: 'Plant Tissues' },
          { id: 't2', name: 'Animal Tissues' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'English',
    chapters: [
      {
        id: 'c1',
        name: 'Prose',
        topics: [{ id: 't1', name: 'The Fun They Had' }],
      },
      {
        id: 'c2',
        name: 'Poetry',
        topics: [{ id: 't1', name: 'The Road Not Taken' }],
      },
    ],
  },
  {
    id: '6',
    name: 'History',
    chapters: [
      {
        id: 'c1',
        name: 'French Revolution',
        topics: [
          { id: 't1', name: 'Causes' },
          { id: 't2', name: 'Events' },
        ],
      },
    ],
  },
];

const PRIMARY = theme.colors.primary;

// ─── Subject Dropdown ─────────────────────────────────────────────────────────
const SubjectDropdown = ({
  subjects,
  selected,
  onSelect,
}: {
  subjects: Subject[];
  selected: Subject;
  onSelect: (s: Subject) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.dropWrap}>
      <TouchableOpacity
        style={s.dropBtn}
        onPress={() => setOpen(v => !v)}
        activeOpacity={0.8}
      >
        <View style={s.dropLeft}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="library-outline"
            size={18}
            color={PRIMARY}
          />
          <Text style={s.dropSelected}>{selected.name}</Text>
        </View>
        <VectorIcon
          iconSet="Ionicons"
          iconName={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={PRIMARY}
        />
      </TouchableOpacity>

      {open && (
        <View style={s.dropList}>
          {subjects.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[s.dropItem, sub.id === selected.id && s.dropItemActive]}
              onPress={() => {
                onSelect(sub);
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  s.dropItemText,
                  sub.id === selected.id && s.dropItemTextActive,
                ]}
              >
                {sub.name}
              </Text>
              {sub.id === selected.id && (
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="checkmark"
                  size={16}
                  color={PRIMARY}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Chapter Card ─────────────────────────────────────────────────────────────
const ChapterCard = ({
  chapter,
  chapterIndex,
}: {
  chapter: Chapter;
  chapterIndex: number;
}) => {
  const [expanded, setExpanded] = useState(chapterIndex === 0);

  return (
    <View style={s.chapterCard}>
      <TouchableOpacity
        style={s.chapterHeader}
        onPress={() => setExpanded(v => !v)}
        activeOpacity={0.8}
      >
        <View style={s.chapterLeft}>
          <View style={s.chapterIndexBadge}>
            <Text style={s.chapterIndexText}>{chapterIndex + 1}</Text>
          </View>
          <View>
            <Text style={s.chapterName}>{chapter.name}</Text>
            <Text style={s.chapterTopicCount}>
              {chapter.topics.length} topic
              {chapter.topics.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <VectorIcon
          iconSet="Ionicons"
          iconName={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={s.topicsWrap}>
          {chapter.topics.length === 0 ? (
            <View style={s.noTopics}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="document-outline"
                size={20}
                color={theme.colors.textMuted}
              />
              <Text style={s.noTopicsText}>No topics added yet</Text>
            </View>
          ) : (
            chapter.topics.map((topic, ti) => (
              <View
                key={topic.id}
                style={[
                  s.topicRow,
                  ti === chapter.topics.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={s.topicIndexBadge}>
                  <Text style={s.topicIndexText}>{ti + 1}</Text>
                </View>
                <Text style={s.topicName}>{topic.name}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const StudentSyllabusScreen = ({ navigation }: any) => {
  const [selectedSubId, setSelectedSubId] = useState(SUBJECTS[0].id);
  const selectedSub = SUBJECTS.find(s => s.id === selectedSubId)!;
  const totalTopics = selectedSub.chapters.reduce(
    (sum, c) => sum + c.topics.length,
    0,
  );

  return (
    <View style={s.root}>
      <Header title="Syllabus" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Subject Dropdown */}
        <SubjectDropdown
          subjects={SUBJECTS}
          selected={selectedSub}
          onSelect={sub => setSelectedSubId(sub.id)}
        />

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statValue}>{selectedSub.chapters.length}</Text>
            <Text style={s.statLabel}>Chapters</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statCard}>
            <Text style={s.statValue}>{totalTopics}</Text>
            <Text style={s.statLabel}>Topics</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statCard}>
            <Text style={s.statValue}>{selectedSub.name}</Text>
            <Text style={s.statLabel}>Subject</Text>
          </View>
        </View>

        {/* Section title */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Chapters & Topics</Text>
          <View style={s.sectionBadge}>
            <Text style={s.sectionBadgeText}>
              {selectedSub.chapters.length}
            </Text>
          </View>
        </View>

        {/* Chapter list */}
        {selectedSub.chapters.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="book-outline"
              size={52}
              color={theme.colors.textMuted}
            />
            <Text style={s.emptyTitle}>No Chapters Yet</Text>
            <Text style={s.emptySubText}>
              Your teacher hasn't added any chapters for {selectedSub.name} yet.
            </Text>
          </View>
        ) : (
          selectedSub.chapters.map((chapter, i) => (
            <ChapterCard key={chapter.id} chapter={chapter} chapterIndex={i} />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default StudentSyllabusScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 16 },

  // Dropdown
  dropWrap: { marginBottom: 16, zIndex: 99 },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryLight,
    shadowColor: PRIMARY,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropSelected: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dropList: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    overflow: 'hidden',
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropItemActive: { backgroundColor: theme.colors.primaryLight },
  dropItemText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  dropItemTextActive: { color: PRIMARY, fontWeight: '700' },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statCard: { flex: 1, alignItems: 'center', gap: 3 },
  statValue: { fontSize: 18, fontWeight: '900', color: PRIMARY },
  statLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  statDivider: { width: 1, height: 32, backgroundColor: theme.colors.border },

  // Section title
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  sectionBadge: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  sectionBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  // Chapter card
  chapterCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    overflow: 'hidden',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  chapterIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIndexText: { fontSize: 13, fontWeight: '900', color: '#fff' },
  chapterName: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  chapterTopicCount: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },

  // Topics
  topicsWrap: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topicIndexBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIndexText: { fontSize: 11, fontWeight: '800', color: PRIMARY },
  topicName: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },

  // No topics
  noTopics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  noTopicsText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 48, gap: 10 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
  emptySubText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
