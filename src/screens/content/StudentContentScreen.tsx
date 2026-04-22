import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Linking,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { ContentItem, CONTENT_STORE, ContentType, SUBJECTS, TYPE_META } from './contentData';
import type { Subject, Chapter } from '../subjects/subjectsData';

const PRIMARY = theme.colors.primary;

// ─── Subject Dropdown ─────────────────────────────────────────────────────────
const SubjectDropdown = ({
  selected, onSelect,
}: { selected: Subject; onSelect: (s: Subject) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[s.dropWrap, open && { zIndex: 99 }]}>
      <TouchableOpacity style={s.dropBtn} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <View style={s.dropLeft}>
          <Text style={s.dropIcon}>{selected.icon}</Text>
          <Text style={s.dropSelected}>{selected.name}</Text>
        </View>
        <VectorIcon iconSet="Ionicons" iconName={open ? 'chevron-up' : 'chevron-down'} size={18} color={PRIMARY} />
      </TouchableOpacity>
      {open && (
        <View style={s.dropList}>
          {SUBJECTS.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[s.dropItem, sub.id === selected.id && s.dropItemActive]}
              onPress={() => { onSelect(sub); setOpen(false); }}
              activeOpacity={0.7}
            >
              <Text style={s.dropIcon}>{sub.icon}</Text>
              <Text style={[s.dropItemText, sub.id === selected.id && s.dropItemTextActive]}>{sub.name}</Text>
              {sub.id === selected.id && <VectorIcon iconSet="Ionicons" iconName="checkmark" size={16} color={PRIMARY} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Content Card (view only) ─────────────────────────────────────────────────
const ContentCard = ({ item }: { item: ContentItem }) => {
  const meta = TYPE_META[item.type];

  const handlePress = () => {
    if (item.type === 'url') Linking.openURL(item.value).catch(() => {});
  };

  return (
    <TouchableOpacity
      style={s.contentCard}
      onPress={item.type === 'url' ? handlePress : undefined}
      activeOpacity={item.type === 'url' ? 0.75 : 1}
    >
      {/* Left accent */}
      <View style={[s.cardAccent, { backgroundColor: meta.color }]} />

      <View style={s.cardBody}>
        {/* Type badge + time */}
        <View style={s.cardTopRow}>
          <View style={[s.typeBadge, { backgroundColor: meta.bg }]}>
            <VectorIcon iconSet="Ionicons" iconName={meta.icon} size={12} color={meta.color} />
            <Text style={[s.typeBadgeText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={s.cardTime}>{item.addedAt}</Text>
        </View>

        {/* Title */}
        <Text style={s.cardTitle}>{item.title}</Text>

        {/* Content preview by type */}
        {item.type === 'text' && (
          <Text style={s.cardText} numberOfLines={3}>{item.value}</Text>
        )}
        {item.type === 'url' && (
          <View style={s.urlRow}>
            <VectorIcon iconSet="Ionicons" iconName="open-outline" size={13} color={meta.color} />
            <Text style={[s.urlText, { color: meta.color }]} numberOfLines={1}>{item.value}</Text>
          </View>
        )}
        {item.type === 'pdf' && (
          <View style={s.fileRow}>
            <VectorIcon iconSet="Ionicons" iconName="document-outline" size={14} color={meta.color} />
            <Text style={[s.fileText, { color: meta.color }]}>{item.value}</Text>
          </View>
        )}
        {item.type === 'image' && (
          <View style={[s.imagePreview, { backgroundColor: meta.bg }]}>
            <VectorIcon iconSet="Ionicons" iconName="image-outline" size={28} color={meta.color} />
            <Text style={[s.imagePreviewText, { color: meta.color }]}>{item.value}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Chapter Card (view only) ─────────────────────────────────────────────────
const ChapterCard = ({
  chapter, chapterIndex, subjectId,
}: { chapter: Chapter; chapterIndex: number; subjectId: string }) => {
  const [expanded, setExpanded] = useState(chapterIndex === 0);
  const items: ContentItem[] = CONTENT_STORE.filter(
    c => c.subjectId === subjectId && c.chapterId === chapter.id,
  );

  return (
    <View style={s.chapterCard}>
      <TouchableOpacity style={s.chapterHeader} onPress={() => setExpanded(v => !v)} activeOpacity={0.8}>
        <View style={s.chapterLeft}>
          <View style={s.chapterBadge}>
            <Text style={s.chapterBadgeText}>{chapterIndex + 1}</Text>
          </View>
          <VectorIcon iconSet="Ionicons" iconName="book-outline" size={17} color={PRIMARY} />
          <Text style={s.chapterName} numberOfLines={1}>{chapter.name}</Text>
        </View>
        <View style={s.chapterRight}>
          {items.length > 0 && (
            <View style={s.countBadge}>
              <Text style={s.countBadgeText}>{items.length} items</Text>
            </View>
          )}
          <VectorIcon iconSet="Ionicons" iconName={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textMuted} />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.chapterBody}>
          {items.length === 0 ? (
            <View style={s.emptyChapter}>
              <VectorIcon iconSet="Ionicons" iconName="folder-open-outline" size={28} color={theme.colors.textMuted} />
              <Text style={s.emptyChapterText}>No content added yet</Text>
            </View>
          ) : (
            items.map(item => <ContentCard key={item.id} item={item} />)
          )}
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const StudentContentScreen = ({ navigation }: any) => {
  const [selectedSub, setSelectedSub] = useState<Subject>(SUBJECTS[0]);

  const totalItems = CONTENT_STORE.filter(c => c.subjectId === selectedSub.id).length;

  return (
    <SafeAreaView style={s.root}>
      <Header title="Study Content" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <SubjectDropdown selected={selectedSub} onSelect={sub => setSelectedSub(sub)} />

        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Chapters</Text>
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{totalItems} resources</Text>
          </View>
        </View>

        {selectedSub.chapters.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon iconSet="Ionicons" iconName="book-outline" size={48} color={theme.colors.textMuted} />
            <Text style={s.emptyText}>No chapters available</Text>
          </View>
        ) : (
          selectedSub.chapters.map((ch, i) => (
            <ChapterCard
              key={ch.id}
              chapter={ch}
              chapterIndex={i}
              subjectId={selectedSub.id}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentContentScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 16 },

  // Dropdown
  dropWrap: { marginBottom: 20, zIndex: 99 },
  dropBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
    borderWidth: 1.5, borderColor: theme.colors.primaryLight,
    shadowColor: PRIMARY, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropIcon: { fontSize: 18 },
  dropSelected: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
  dropList: {
    backgroundColor: '#fff', borderRadius: 14, marginTop: 4,
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5, overflow: 'hidden',
  },
  dropItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  dropItemActive: { backgroundColor: theme.colors.primaryLight },
  dropItemText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
  dropItemTextActive: { color: PRIMARY, fontWeight: '700' },

  // Section header
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  countBadge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  countBadgeText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Chapter card
  chapterCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  chapterHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 13,
  },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  chapterBadge: {
    width: 24, height: 24, borderRadius: 7, backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  chapterBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  chapterName: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, flex: 1 },
  chapterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chapterBody: { borderTopWidth: 1, borderTopColor: theme.colors.border, padding: 12, gap: 8 },

  // Empty chapter
  emptyChapter: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  emptyChapterText: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '600' },

  // Content card
  contentCard: {
    flexDirection: 'row', backgroundColor: '#FAFBFF', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 12 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText: { fontSize: 11, fontWeight: '800' },
  cardTime: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 5 },
  cardText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  urlText: { flex: 1, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fileText: { fontSize: 12, fontWeight: '700' },
  imagePreview: {
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 4,
  },
  imagePreviewText: { fontSize: 12, fontWeight: '700' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyText: { fontSize: 16, color: theme.colors.textSecondary, fontWeight: '700' },
});
