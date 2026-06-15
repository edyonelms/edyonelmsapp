import React, { useCallback, useEffect, useState } from 'react';
import ScreenSkeleton from '../../components/Skeleton';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme, onThemeChange } from '../../utils/theme';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh, useFocusLoad } from '../../hooks/useRefresh';
import {
  getTeacherSubjects,
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  createTopic,
  updateTopic,
  deleteTopic,
  contentErrorMessage,
  subjectStyle,
  type TeacherCombo,
  type SyllabusChapter,
  type SyllabusTopic,
} from '../../api/contentApi';

const PRIMARY = theme.colors.primary;

// ─── Combo (class + subject) Dropdown — student template look ──────────────────
const ComboDropdown = ({
  combos,
  selected,
  onSelect,
}: {
  combos: TeacherCombo[];
  selected: TeacherCombo;
  onSelect: (c: TeacherCombo) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[s.dropWrap, open && { zIndex: 99 }]}>
      <TouchableOpacity style={s.dropBtn} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <View style={s.dropLeft}>
          <Text style={s.dropIcon}>{subjectStyle(selected.subjectId).icon}</Text>
          <Text style={s.dropSelected} numberOfLines={1}>{selected.label}</Text>
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
          <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled>
            {combos.map(c => (
              <TouchableOpacity
                key={c.key}
                style={[s.dropItem, c.key === selected.key && s.dropItemActive]}
                onPress={() => {
                  onSelect(c);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={s.dropIcon}>{subjectStyle(c.subjectId).icon}</Text>
                <Text
                  style={[s.dropItemText, c.key === selected.key && s.dropItemTextActive]}
                  numberOfLines={1}
                >
                  {c.label}
                </Text>
                {c.key === selected.key && (
                  <VectorIcon iconSet="Ionicons" iconName="checkmark" size={16} color={PRIMARY} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// ─── Name + (optional) detail modal — used for both chapter and topic ─────────
const EditModal = ({
  visible,
  title,
  subtitle,
  nameLabel,
  namePlaceholder,
  detailLabel,
  detailPlaceholder,
  initialName,
  initialDetail,
  saving,
  accent,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  detailLabel: string;
  detailPlaceholder: string;
  initialName: string;
  initialDetail: string;
  saving: boolean;
  accent: string;
  onClose: () => void;
  onSubmit: (name: string, detail: string) => void;
}) => {
  const [name, setName] = useState(initialName);
  const [detail, setDetail] = useState(initialDetail);

  // Reset fields whenever the modal is (re)opened for a different item.
  useEffect(() => {
    if (visible) {
      setName(initialName);
      setDetail(initialDetail);
    }
  }, [visible, initialName, initialDetail]);

  const submit = () => {
    if (!name.trim() || saving) return;
    onSubmit(name.trim(), detail.trim());
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={s.modalSheet}>
          <View style={s.modalHandle} />

          <View style={s.modalTitleRow}>
            <View style={[s.modalIconBox, { backgroundColor: accent + '22' }]}>
              <VectorIcon iconSet="Ionicons" iconName="create-outline" size={18} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.modalTitle}>{title}</Text>
              <Text style={s.modalSub} numberOfLines={1}>{subtitle}</Text>
            </View>
          </View>

          <Text style={s.inputLabel}>{nameLabel}</Text>
          <TextInput
            style={s.modalInput}
            placeholder={namePlaceholder}
            placeholderTextColor={theme.colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <Text style={s.inputLabel}>
            {detailLabel}
            <Text style={s.inputLabelOptional}> · optional</Text>
          </Text>
          <TextInput
            style={[s.modalInput, s.modalTextArea]}
            placeholder={detailPlaceholder}
            placeholderTextColor={theme.colors.textMuted}
            value={detail}
            onChangeText={setDetail}
            multiline
          />

          <View style={s.modalActions}>
            <TouchableOpacity style={s.modalCancelBtn} onPress={onClose} activeOpacity={0.8} disabled={saving}>
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.modalAddBtn, { backgroundColor: accent }, (!name.trim() || saving) && { opacity: 0.6 }]}
              onPress={submit}
              activeOpacity={0.85}
              disabled={!name.trim() || saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <VectorIcon iconSet="Ionicons" iconName="checkmark" size={16} color="#fff" />
                  <Text style={s.modalAddText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
type ChapterModalState = { mode: 'add' } | { mode: 'edit'; chapter: SyllabusChapter } | null;
type TopicModalState =
  | { mode: 'add'; chapter: SyllabusChapter }
  | { mode: 'edit'; chapter: SyllabusChapter; topic: SyllabusTopic }
  | null;

const TeacherSyllabusScreen = ({ navigation }: any) => {
  const [combos, setCombos] = useState<TeacherCombo[]>([]);
  const [selected, setSelected] = useState<TeacherCombo | null>(null);
  const [chapters, setChapters] = useState<SyllabusChapter[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [busyChapterId, setBusyChapterId] = useState<number | null>(null);

  const [chapterModal, setChapterModal] = useState<ChapterModalState>(null);
  const [topicModal, setTopicModal] = useState<TopicModalState>(null);
  const [saving, setSaving] = useState(false);

  // Subject theming (shared student template) + stats.
  const color = selected ? subjectStyle(selected.subjectId).color : PRIMARY;
  const icon = selected ? subjectStyle(selected.subjectId).icon : '📘';
  const totalTopics = chapters.reduce((sum, c) => sum + c.topics.length, 0);
  const activeChapters = chapters.filter(c => c.topics.length > 0).length;

  // ── Loaders ──────────────────────────────────────────────────────────────
  const loadChapters = useCallback(async (combo: TeacherCombo) => {
    setChaptersLoading(true);
    try {
      const list = await getChapters({
        standard_id: combo.standardId,
        section_id: combo.sectionId,
        subject_id: combo.subjectId,
      });
      setChapters(list);
      setExpandedId(list[0]?.id ?? null);
    } catch (e: any) {
      console.log('[getChapters] Error:', e?.response?.status, e?.message);
      setChapters([]);
    } finally {
      setChaptersLoading(false);
    }
  }, []);

  const loadCombos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getTeacherSubjects();
      setCombos(list);
      if (list.length > 0) {
        setSelected(list[0]);
        await loadChapters(list[0]);
      }
    } catch (e: any) {
      console.log('[getTeacherSubjects] Error:', e?.response?.status, e?.message);
      setError(contentErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [loadChapters]);

  const { refreshing, onRefresh } = useRefresh(loadCombos);

  useFocusLoad(loadCombos);

  const selectCombo = (c: TeacherCombo) => {
    setSelected(c);
    setChapters([]);
    setExpandedId(null);
    loadChapters(c);
  };

  // ── Mutations ────────────────────────────────────────────────────────────
  const submitChapter = async (name: string, description: string) => {
    if (!selected || !chapterModal) return;
    setSaving(true);
    try {
      if (chapterModal.mode === 'add') {
        const created = await createChapter({
          standard_id: selected.standardId,
          section_id: selected.sectionId,
          subject_id: selected.subjectId,
          name,
          description: description || undefined,
        });
        // Avoid duplicates if the backend returned an existing (idempotent) chapter.
        setChapters(prev =>
          prev.some(c => c.id === created.id) ? prev : [...prev, created],
        );
        setExpandedId(created.id);
      } else {
        const updated = await updateChapter(chapterModal.chapter.id, {
          name,
          description: description || undefined,
        });
        setChapters(prev =>
          prev.map(c =>
            c.id === updated.id ? { ...c, name: updated.name, description: updated.description } : c,
          ),
        );
      }
      setChapterModal(null);
    } catch (e: any) {
      Alert.alert('Error', contentErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteChapter = (chapter: SyllabusChapter) => {
    Alert.alert(
      'Delete Chapter',
      `Delete "${chapter.name}" and all its topics? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setBusyChapterId(chapter.id);
            try {
              await deleteChapter(chapter.id);
              setChapters(prev => prev.filter(c => c.id !== chapter.id));
            } catch (e: any) {
              Alert.alert('Error', contentErrorMessage(e));
            } finally {
              setBusyChapterId(null);
            }
          },
        },
      ],
    );
  };

  const submitTopic = async (name: string, content: string) => {
    if (!topicModal) return;
    setSaving(true);
    try {
      if (topicModal.mode === 'add') {
        const created = await createTopic(topicModal.chapter.id, name, content || undefined);
        setChapters(prev =>
          prev.map(c =>
            c.id === topicModal.chapter.id ? { ...c, topics: [...c.topics, created] } : c,
          ),
        );
      } else {
        const updated = await updateTopic(topicModal.topic.id, name, content || undefined);
        setChapters(prev =>
          prev.map(c =>
            c.id === topicModal.chapter.id
              ? { ...c, topics: c.topics.map(t => (t.id === updated.id ? updated : t)) }
              : c,
          ),
        );
      }
      setTopicModal(null);
    } catch (e: any) {
      Alert.alert('Error', contentErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteTopic = (chapter: SyllabusChapter, topic: SyllabusTopic) => {
    Alert.alert('Delete Topic', `Delete "${topic.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTopic(topic.id);
            setChapters(prev =>
              prev.map(c =>
                c.id === chapter.id ? { ...c, topics: c.topics.filter(t => t.id !== topic.id) } : c,
              ),
            );
          } catch (e: any) {
            Alert.alert('Error', contentErrorMessage(e));
          }
        },
      },
    ]);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const renderBody = () => {
    if (loading) {
      return (
        <View style={s.stateBox}>
          <ScreenSkeleton variant="list" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={s.stateBox}>
          <View style={s.errorIconRing}>
            <VectorIcon iconSet="Ionicons" iconName="cloud-offline-outline" size={32} color={theme.colors.danger} />
          </View>
          <Text style={s.emptyTitle}>Couldn’t load syllabus</Text>
          <Text style={s.emptySubText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={loadCombos} activeOpacity={0.85}>
            <VectorIcon iconSet="Ionicons" iconName="refresh" size={15} color={PRIMARY} />
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!selected) {
      return (
        <View style={s.stateBox}>
          <VectorIcon iconSet="Ionicons" iconName="library-outline" size={48} color={theme.colors.textMuted} />
          <Text style={s.emptyTitle}>No subjects assigned</Text>
          <Text style={s.emptySubText}>You don’t teach any class + subject yet.</Text>
        </View>
      );
    }

    return (
      <>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ComboDropdown combos={combos} selected={selected} onSelect={selectCombo} />

          {/* ── Subject overview card ── */}
          <View style={s.card}>
            <View style={[s.accentBar, { backgroundColor: color }]} />
            <View style={s.cardInner}>
              <View style={s.cardTop}>
                <View style={[s.iconWrap, { backgroundColor: color + '20' }]}>
                  <Text style={s.iconEmoji}>{icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle} numberOfLines={1}>{selected.label}</Text>
                  <Text style={s.cardSubtitle} numberOfLines={1}>Syllabus overview</Text>
                </View>
                <View style={[s.countBadge, { backgroundColor: color + '15' }]}>
                  <Text style={[s.countBadgeText, { color }]}>{chapters.length} ch</Text>
                </View>
              </View>

              <View style={s.tableFooter}>
                <View style={s.footerItem}>
                  <View style={[s.footerDot, { backgroundColor: color }]} />
                  <Text style={s.footerLabel}>Chapters</Text>
                  <Text style={s.footerValue}>{chapters.length}</Text>
                </View>
                <View style={s.footerDivider} />
                <View style={s.footerItem}>
                  <View style={[s.footerDot, { backgroundColor: '#0EA5E9' }]} />
                  <Text style={s.footerLabel}>Topics</Text>
                  <Text style={s.footerValue}>{totalTopics}</Text>
                </View>
                <View style={s.footerDivider} />
                <View style={s.footerItem}>
                  <View style={[s.footerDot, { backgroundColor: '#16A34A' }]} />
                  <Text style={s.footerLabel}>Active</Text>
                  <Text style={s.footerValue}>{activeChapters}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Chapters card ── */}
          <View style={s.card}>
            <View style={[s.accentBar, { backgroundColor: color }]} />
            <View style={s.cardInner}>
              <View style={s.cardTop}>
                <View style={[s.iconWrap, { backgroundColor: color + '20' }]}>
                  <VectorIcon iconSet="Ionicons" iconName="book-outline" size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>Chapters & Topics</Text>
                  <Text style={s.cardSubtitle}>
                    {chapters.length} chapters · {totalTopics} topics
                  </Text>
                </View>
                <TouchableOpacity
                  style={[s.headerAddBtn, { backgroundColor: color }]}
                  onPress={() => setChapterModal({ mode: 'add' })}
                  activeOpacity={0.85}
                >
                  <VectorIcon iconSet="Ionicons" iconName="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              {chaptersLoading ? (
                <View style={s.chaptersLoading}>
                  <ActivityIndicator size="small" color={color} />
                </View>
              ) : chapters.length === 0 ? (
                <View style={s.empty}>
                  <VectorIcon iconSet="Ionicons" iconName="book-outline" size={44} color={theme.colors.textMuted} />
                  <Text style={s.emptyTitle}>No Chapters Yet</Text>
                  <Text style={s.emptySubText}>Tap “Add New Chapter” below to get started.</Text>
                </View>
              ) : (
                chapters.map((chapter, i) => {
                  const expanded = expandedId === chapter.id;
                  const busy = busyChapterId === chapter.id;
                  return (
                    <View key={chapter.id}>
                      <TouchableOpacity
                        style={[s.chapterRow, !expanded && i < chapters.length - 1 && s.rowBorder]}
                        onPress={() => setExpandedId(expanded ? null : chapter.id)}
                        activeOpacity={0.7}
                      >
                        <View style={[s.chapterBadge, { backgroundColor: color }]}>
                          <Text style={s.chapterBadgeText}>{i + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.chapterName} numberOfLines={1}>{chapter.name}</Text>
                          <Text style={s.chapterMeta}>
                            {chapter.topics.length} topic{chapter.topics.length !== 1 ? 's' : ''}
                          </Text>
                        </View>
                        {busy ? (
                          <ActivityIndicator size="small" color={color} />
                        ) : (
                          <View style={[s.expandBtn, expanded && { backgroundColor: color + '18' }]}>
                            <VectorIcon
                              iconSet="Ionicons"
                              iconName={expanded ? 'chevron-up' : 'chevron-down'}
                              size={16}
                              color={expanded ? color : theme.colors.textMuted}
                            />
                          </View>
                        )}
                      </TouchableOpacity>

                      {expanded && (
                        <View style={[s.topicsBox, i < chapters.length - 1 && s.rowBorder]}>
                          {/* Chapter edit / delete */}
                          <View style={s.chapterActions}>
                            <TouchableOpacity
                              style={[s.chapterActionBtn, { backgroundColor: color + '18' }]}
                              onPress={() => setChapterModal({ mode: 'edit', chapter })}
                              activeOpacity={0.8}
                            >
                              <VectorIcon iconSet="Ionicons" iconName="create-outline" size={15} color={color} />
                              <Text style={[s.chapterActionText, { color }]}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[s.chapterActionBtn, s.chapterActionDanger]}
                              onPress={() => confirmDeleteChapter(chapter)}
                              activeOpacity={0.8}
                            >
                              <VectorIcon iconSet="Ionicons" iconName="trash-outline" size={15} color={theme.colors.danger} />
                              <Text style={[s.chapterActionText, { color: theme.colors.danger }]}>Delete</Text>
                            </TouchableOpacity>
                          </View>

                          {chapter.topics.length === 0 ? (
                            <View style={s.noTopics}>
                              <VectorIcon iconSet="Ionicons" iconName="document-outline" size={16} color={theme.colors.textMuted} />
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
                                <View style={[s.topicIndexBadge, { backgroundColor: color + '18' }]}>
                                  <Text style={[s.topicIndexText, { color }]}>{ti + 1}</Text>
                                </View>
                                <Text style={s.topicName} numberOfLines={2}>{topic.name}</Text>
                                <TouchableOpacity
                                  onPress={() => setTopicModal({ mode: 'edit', chapter, topic })}
                                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                  <VectorIcon iconSet="Ionicons" iconName="create-outline" size={16} color={theme.colors.textMuted} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => confirmDeleteTopic(chapter, topic)}
                                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                >
                                  <VectorIcon iconSet="Ionicons" iconName="close-circle-outline" size={17} color={theme.colors.danger} />
                                </TouchableOpacity>
                              </View>
                            ))
                          )}

                          <TouchableOpacity
                            style={[s.addTopicBtn, { borderColor: color }]}
                            onPress={() => setTopicModal({ mode: 'add', chapter })}
                            activeOpacity={0.8}
                          >
                            <VectorIcon iconSet="Ionicons" iconName="add" size={17} color={color} />
                            <Text style={[s.addTopicText, { color }]}>Add Topic</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          style={[s.fab, { backgroundColor: color, shadowColor: color }]}
          onPress={() => setChapterModal({ mode: 'add' })}
          activeOpacity={0.85}
        >
          <VectorIcon iconSet="Ionicons" iconName="add" size={20} color="#fff" />
          <Text style={s.fabText}>Add New Chapter</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={s.root}>
      <Header title="Syllabus" onBackPress={() => navigation.goBack()} />
      {renderBody()}

      {/* Chapter add / edit */}
      <EditModal
        visible={!!chapterModal}
        title={chapterModal?.mode === 'edit' ? 'Edit Chapter' : 'Add New Chapter'}
        subtitle={selected?.label ?? ''}
        nameLabel="Chapter Name"
        namePlaceholder="e.g. Thermodynamics"
        detailLabel="Description"
        detailPlaceholder="Short description of the chapter"
        initialName={chapterModal?.mode === 'edit' ? chapterModal.chapter.name : ''}
        initialDetail={chapterModal?.mode === 'edit' ? chapterModal.chapter.description ?? '' : ''}
        saving={saving}
        accent={color}
        onClose={() => !saving && setChapterModal(null)}
        onSubmit={submitChapter}
      />

      {/* Topic add / edit */}
      <EditModal
        visible={!!topicModal}
        title={topicModal?.mode === 'edit' ? 'Edit Topic' : 'Add Topic'}
        subtitle={topicModal ? `in ${topicModal.chapter.name}` : ''}
        nameLabel="Topic Name"
        namePlaceholder="e.g. Newton's Laws of Motion"
        detailLabel="Details"
        detailPlaceholder="Optional notes for this topic"
        initialName={topicModal?.mode === 'edit' ? topicModal.topic.name : ''}
        initialDetail={topicModal?.mode === 'edit' ? topicModal.topic.content ?? '' : ''}
        saving={saving}
        accent={color}
        onClose={() => !saving && setTopicModal(null)}
        onSubmit={submitTopic}
      />
    </View>
  );
};

export default TeacherSyllabusScreen;

const __mk_s = () => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingBottom: 32, gap: 14 },

  // Dropdown (shared student template)
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
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dropIcon: { fontSize: 18 },
  dropSelected: { flex: 1, fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
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
  dropItemText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
  dropItemTextActive: { color: PRIMARY, fontWeight: '700' },

  // Card (shared student template)
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
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  countBadge: { borderRadius: theme.radius.full, paddingHorizontal: 12, paddingVertical: 5 },
  countBadgeText: { fontSize: 13, fontWeight: '800' },
  headerAddBtn: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats footer (shared student template)
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  footerDot: { width: 7, height: 7, borderRadius: 4 },
  footerLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },
  footerValue: { fontSize: 13, fontWeight: '900', color: theme.colors.textPrimary },
  footerDivider: { width: 1, height: 24, backgroundColor: theme.colors.border },

  // Chapter rows (shared student template)
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  chapterBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterBadgeText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  chapterName: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary },
  chapterMeta: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500', marginTop: 2 },
  expandBtn: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },

  // Topics (expanded) — student template + teacher CRUD
  topicsBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  chapterActions: { flexDirection: 'row', gap: 8, paddingVertical: 8 },
  chapterActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  chapterActionDanger: { backgroundColor: '#FEE2E2' },
  chapterActionText: { fontSize: 12, fontWeight: '700' },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topicIndexBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  topicIndexText: { fontSize: 10, fontWeight: '800' },
  topicName: { flex: 1, fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  noTopics: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  noTopicsText: { fontSize: 12, color: theme.colors.textMuted, fontStyle: 'italic' },
  addTopicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 10,
    marginBottom: 4,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: theme.radius.sm,
  },
  addTopicText: { fontSize: 13, fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 999,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  fabText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  // States
  stateBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 10 },
  chaptersLoading: { paddingVertical: 24, alignItems: 'center' },
  errorIconRing: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  empty: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.textSecondary },
  emptySubText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: theme.radius.full,
    paddingHorizontal: 18, paddingVertical: 9, marginTop: 4,
  },
  retryText: { fontSize: 13, fontWeight: '700', color: PRIMARY },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  modalIconBox: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.textPrimary },
  modalSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 6 },
  inputLabelOptional: { fontWeight: '400', color: theme.colors.textMuted },
  modalInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.textPrimary,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  modalTextArea: { minHeight: 70, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary },
  modalAddBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
  },
  modalAddText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
