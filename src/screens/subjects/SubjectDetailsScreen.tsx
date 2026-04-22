import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { SUBJECTS } from './subjectsData';
import type { Chapter } from './subjectsData';
import Header from '../../components/Header';

// ─── Chapter Card ─────────────────────────────────────────────────────────────
const ChapterCard = ({
  chapter,
  index,
  color,
  bg,
}: {
  chapter: Chapter;
  index: number;
  color: string;
  bg: string;
}) => {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <View
      style={[
        s.chapterCard,
        expanded && { borderColor: color + '40', borderWidth: 1.5 },
      ]}
    >
      <TouchableOpacity
        style={s.chapterHeader}
        onPress={() => setExpanded(v => !v)}
        activeOpacity={0.8}
      >
        <View style={s.chapterLeft}>
          {/* Index badge */}
          <View style={[s.chapterBadge, { backgroundColor: color }]}>
            <Text style={s.chapterBadgeText}>{index + 1}</Text>
          </View>
          <View style={s.chapterInfo}>
            <Text style={s.chapterName}>{chapter.name}</Text>
            <Text style={s.chapterMeta}>
              {chapter.topics.length} topic
              {chapter.topics.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <View
          style={[s.expandBtn, expanded && { backgroundColor: color + '18' }]}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={expanded ? color : theme.colors.textMuted}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.topicsWrap}>
          {chapter.topics.length === 0 ? (
            <View style={s.noTopics}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="document-outline"
                size={16}
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
                <View style={[s.topicDot, { backgroundColor: color }]} />
                <View
                  style={[s.topicIndexBadge, { backgroundColor: color + '18' }]}
                >
                  <Text style={[s.topicIndexText, { color }]}>{ti + 1}</Text>
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
const SubjectDetailsScreen = ({ navigation, route }: any) => {
  const subjectId = route?.params?.subjectId ?? '1';
  const subject = SUBJECTS.find(s => s.id === subjectId) ?? SUBJECTS[0];

  const totalTopics = subject.chapters.reduce((s, c) => s + c.topics.length, 0);

  return (
    <View style={s.root}>
      {/* ── Custom Header ── */}
      <Header title={subject.name} showBack={true} />
      <View style={[s.header, { backgroundColor: subject.color }]}>
        {/* <View style={s.headerBlob1} /> */}
        {/* <View style={s.headerBlob2} /> */}

        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.8}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-back"
            size={22}
            color="#fff"
          />
        </TouchableOpacity> */}

        <View style={s.headerBody}>
          <Text style={s.headerEmoji}>{subject.icon}</Text>
          <Text style={s.headerTitle}>{subject.name}</Text>
          <Text style={s.headerTeacher}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="person-outline"
              size={12}
              color="rgba(255,255,255,0.8)"
            />
            {'  '}
            {subject.teacher}
          </Text>
        </View>

        {/* Stats strip */}
        <View style={s.headerStats}>
          <View style={s.headerStat}>
            <Text style={s.headerStatVal}>{subject.chapters.length}</Text>
            <Text style={s.headerStatLbl}>Chapters</Text>
          </View>
          <View style={s.headerStatDivider} />
          <View style={s.headerStat}>
            <Text style={s.headerStatVal}>{totalTopics}</Text>
            <Text style={s.headerStatLbl}>Topics</Text>
          </View>
          <View style={s.headerStatDivider} />
          <View style={s.headerStat}>
            <Text style={s.headerStatVal}>
              {subject.chapters.filter(c => c.topics.length > 0).length}
            </Text>
            <Text style={s.headerStatLbl}>Active</Text>
          </View>
        </View>
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Chapters</Text>
          <View style={[s.sectionBadge, { backgroundColor: subject.color }]}>
            <Text style={s.sectionBadgeText}>{subject.chapters.length}</Text>
          </View>
        </View>

        {subject.chapters.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>{subject.icon}</Text>
            <Text style={s.emptyTitle}>No Chapters Yet</Text>
            <Text style={s.emptySubText}>
              Your teacher hasn't added any chapters for {subject.name} yet.
            </Text>
          </View>
        ) : (
          subject.chapters.map((chapter, i) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={i}
              color={subject.color}
              bg={subject.bg}
            />
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default SubjectDetailsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    paddingTop: 52,
    paddingBottom: 24,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  headerBlob1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -40,
  },
  headerBlob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: 0,
    left: -20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerBody: { alignItems: 'center', marginBottom: 20 },
  headerEmoji: { fontSize: 44, marginBottom: 8 },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerTeacher: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginTop: 4,
  },

  // Stats strip
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  headerStat: { flex: 1, alignItems: 'center' },
  headerStatVal: { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerStatLbl: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  // Section
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  sectionBadge: {
    paddingHorizontal: 10,
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
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  chapterBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterBadgeText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  chapterInfo: { flex: 1 },
  chapterName: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  chapterMeta: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  expandBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
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
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topicDot: { width: 6, height: 6, borderRadius: 3 },
  topicIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIndexText: { fontSize: 10, fontWeight: '800' },
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
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 10 },
  emptyEmoji: { fontSize: 52 },
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
