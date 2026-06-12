import React, { useState } from 'react';
import {
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
import { ContentItem, CONTENT_STORE, SUBJECTS, TYPE_META } from './contentData';
import type { Subject } from '../subjects/subjectsData';

const PRIMARY = theme.colors.primary;

// ─── Subject Dropdown (shared template) ───────────────────────────────────────
const SubjectDropdown = ({
  selected,
  onSelect,
}: {
  selected: Subject;
  onSelect: (sub: Subject) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[s.dropWrap, open && { zIndex: 99 }]}>
      <TouchableOpacity
        style={s.dropBtn}
        onPress={() => setOpen(v => !v)}
        activeOpacity={0.8}
      >
        <View style={s.dropLeft}>
          <Text style={s.dropIcon}>{selected.icon}</Text>
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
          {SUBJECTS.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[s.dropItem, sub.id === selected.id && s.dropItemActive]}
              onPress={() => {
                onSelect(sub);
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={s.dropIcon}>{sub.icon}</Text>
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

// ─── Content item block (view only) ───────────────────────────────────────────
const ContentBlock = ({ item }: { item: ContentItem }) => {
  const meta = TYPE_META[item.type];

  const handlePress = () => {
    if (item.type === 'url') Linking.openURL(item.value).catch(() => {});
  };

  return (
    <TouchableOpacity
      style={s.contentBlock}
      onPress={item.type === 'url' ? handlePress : undefined}
      activeOpacity={item.type === 'url' ? 0.75 : 1}
    >
      <View style={[s.contentAccent, { backgroundColor: meta.color }]} />
      <View style={s.contentBody}>
        <View style={s.contentTopRow}>
          <View style={[s.typeBadge, { backgroundColor: meta.bg }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName={meta.icon}
              size={12}
              color={meta.color}
            />
            <Text style={[s.typeBadgeText, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>
          <Text style={s.contentTime}>{item.addedAt}</Text>
        </View>

        <Text style={s.contentTitle}>{item.title}</Text>

        {item.type === 'text' && (
          <Text style={s.contentText} numberOfLines={3}>
            {item.value}
          </Text>
        )}
        {item.type === 'url' && (
          <View style={s.urlRow}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="open-outline"
              size={13}
              color={meta.color}
            />
            <Text style={[s.urlText, { color: meta.color }]} numberOfLines={1}>
              {item.value}
            </Text>
          </View>
        )}
        {item.type === 'pdf' && (
          <View style={s.fileRow}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="document-outline"
              size={14}
              color={meta.color}
            />
            <Text style={[s.fileText, { color: meta.color }]}>{item.value}</Text>
          </View>
        )}
        {item.type === 'image' && (
          <View style={[s.imagePreview, { backgroundColor: meta.bg }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="image-outline"
              size={28}
              color={meta.color}
            />
            <Text style={[s.imagePreviewText, { color: meta.color }]}>
              {item.value}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const StudentContentScreen = ({ navigation }: any) => {
  const [selectedSub, setSelectedSub] = useState<Subject>(SUBJECTS[0]);
  const [expandedId, setExpandedId] = useState<string | null>(
    SUBJECTS[0].chapters[0]?.id ?? null,
  );

  const totalItems = CONTENT_STORE.filter(
    c => c.subjectId === selectedSub.id,
  ).length;

  const selectSubject = (sub: Subject) => {
    setSelectedSub(sub);
    setExpandedId(sub.chapters[0]?.id ?? null);
  };

  const itemsFor = (chapterId: string) =>
    CONTENT_STORE.filter(
      c => c.subjectId === selectedSub.id && c.chapterId === chapterId,
    );

  return (
    <View style={s.root}>
      <Header title="Study Content" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SubjectDropdown selected={selectedSub} onSelect={selectSubject} />

        {/* ── Chapters card ── */}
        <View style={s.card}>
          <View style={[s.accentBar, { backgroundColor: selectedSub.color }]} />
          <View style={s.cardInner}>
            <View style={s.cardTop}>
              <View
                style={[s.iconWrap, { backgroundColor: selectedSub.color + '20' }]}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="folder-open-outline"
                  size={20}
                  color={selectedSub.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>Chapters</Text>
                <Text style={s.cardSubtitle}>
                  {selectedSub.chapters.length} chapters · {totalItems} resource
                  {totalItems !== 1 ? 's' : ''}
                </Text>
              </View>
              <View
                style={[s.countBadge, { backgroundColor: selectedSub.color + '15' }]}
              >
                <Text style={[s.countBadgeText, { color: selectedSub.color }]}>
                  {totalItems}
                </Text>
              </View>
            </View>

            {selectedSub.chapters.length === 0 ? (
              <View style={s.empty}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="book-outline"
                  size={44}
                  color={theme.colors.textMuted}
                />
                <Text style={s.emptyTitle}>No chapters available</Text>
              </View>
            ) : (
              selectedSub.chapters.map((chapter, i) => {
                const items = itemsFor(chapter.id);
                const expanded = expandedId === chapter.id;
                return (
                  <View key={chapter.id}>
                    <TouchableOpacity
                      style={[
                        s.chapterRow,
                        !expanded &&
                          i < selectedSub.chapters.length - 1 &&
                          s.rowBorder,
                      ]}
                      onPress={() => setExpandedId(expanded ? null : chapter.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          s.chapterBadge,
                          { backgroundColor: selectedSub.color },
                        ]}
                      >
                        <Text style={s.chapterBadgeText}>{i + 1}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.chapterName} numberOfLines={1}>
                          {chapter.name}
                        </Text>
                        <Text style={s.chapterMeta}>
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                      <View
                        style={[
                          s.expandBtn,
                          expanded && {
                            backgroundColor: selectedSub.color + '18',
                          },
                        ]}
                      >
                        <VectorIcon
                          iconSet="Ionicons"
                          iconName={expanded ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color={
                            expanded ? selectedSub.color : theme.colors.textMuted
                          }
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Expanded content items */}
                    {expanded && (
                      <View
                        style={[
                          s.itemsBox,
                          i < selectedSub.chapters.length - 1 && s.rowBorder,
                        ]}
                      >
                        {items.length === 0 ? (
                          <View style={s.noItems}>
                            <VectorIcon
                              iconSet="Ionicons"
                              iconName="folder-open-outline"
                              size={24}
                              color={theme.colors.textMuted}
                            />
                            <Text style={s.noItemsText}>
                              No content added yet
                            </Text>
                          </View>
                        ) : (
                          items.map(item => (
                            <ContentBlock key={item.id} item={item} />
                          ))
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentContentScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingBottom: 32, gap: 14 },

  // Dropdown (shared template)
  dropWrap: { zIndex: 99 },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropIcon: { fontSize: 18 },
  dropSelected: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dropList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginTop: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 5,
    overflow: 'hidden',
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropItemActive: { backgroundColor: theme.colors.primaryLight },
  dropItemText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  dropItemTextActive: { color: PRIMARY, fontWeight: '700' },

  // Card (shared template)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  countBadgeText: { fontSize: 13, fontWeight: '800' },

  // Chapter rows
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  chapterBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterBadgeText: { fontSize: 14, fontWeight: '900', color: '#fff' },
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
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },

  // Expanded items box
  itemsBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: 10,
    gap: 10,
    marginBottom: 6,
  },
  noItems: { alignItems: 'center', paddingVertical: 18, gap: 6 },
  noItemsText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },

  // Content block
  contentBlock: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  contentAccent: { width: 4 },
  contentBody: { flex: 1, padding: 10, gap: 5 },
  contentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '800' },
  contentTime: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  contentTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  contentText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  urlRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  urlText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fileText: { fontSize: 12, fontWeight: '700' },
  imagePreview: {
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  imagePreviewText: { fontSize: 12, fontWeight: '700' },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
});
