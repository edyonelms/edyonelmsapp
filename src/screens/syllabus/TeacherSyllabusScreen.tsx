import React, { useState } from 'react';
import {
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
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Physics',
    chapters: [
      {
        id: 'c1',
        name: 'Chapter 1',
        topics: [
          { id: 't1', name: 'Motion' },
          { id: 't2', name: 'Force & Laws' },
        ],
      },
      { id: 'c2', name: 'Chapter 2', topics: [] },
      { id: 'c3', name: 'Chapter 3', topics: [] },
      { id: 'c4', name: 'Chapter 4', topics: [] },
      { id: 'c5', name: 'Chapter 5', topics: [] },
    ],
  },
  {
    id: '2',
    name: 'Mathematics',
    chapters: [
      {
        id: 'c1',
        name: 'Chapter 1',
        topics: [{ id: 't1', name: 'Real Numbers' }],
      },
      {
        id: 'c2',
        name: 'Chapter 2',
        topics: [
          { id: 't1', name: 'Polynomials' },
          { id: 't2', name: 'Zeroes' },
        ],
      },
      { id: 'c3', name: 'Chapter 3', topics: [] },
    ],
  },
  {
    id: '3',
    name: 'Chemistry',
    chapters: [{ id: 'c1', name: 'Chapter 1', topics: [] }],
  },
  { id: '4', name: 'Biology', chapters: [] },
  { id: '5', name: 'English', chapters: [] },
  { id: '6', name: 'History', chapters: [] },
];

const PRIMARY = theme.colors.primary;
const uid = () => Math.random().toString(36).slice(2);

// ─── Insert at index helper ───────────────────────────────────────────────────
function insertAt<T>(arr: T[], item: T, idx: number): T[] {
  const clamped = Math.max(0, Math.min(idx, arr.length));
  const copy = [...arr];
  copy.splice(clamped, 0, item);
  return copy;
}

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

// ─── Index hint label ─────────────────────────────────────────────────────────
const IndexHint = ({ label }: { label: string }) => (
  <View style={s.indexHintRow}>
    <VectorIcon
      iconSet="Ionicons"
      iconName="information-circle-outline"
      size={13}
      color={theme.colors.textMuted}
    />
    <Text style={s.indexHintText}>{label}</Text>
  </View>
);

// ─── Add Topic Modal ──────────────────────────────────────────────────────────
const AddTopicModal = ({
  visible,
  chapterName,
  totalTopics,
  onClose,
  onAdd,
}: {
  visible: boolean;
  chapterName: string;
  totalTopics: number;
  onClose: () => void;
  onAdd: (name: string, index: number) => void;
}) => {
  const [name, setName] = useState('');
  const [idx, setIdx] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    const parsed = parseInt(idx, 10);
    // user enters 1-based → convert to 0-based; default = append at end
    const insertIndex =
      !isNaN(parsed) && parsed >= 1 ? parsed - 1 : totalTopics;
    onAdd(name.trim(), insertIndex);
    setName('');
    setIdx('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={s.modalSheet}>
          <View style={s.modalHandle} />

          <View style={s.modalTitleRow}>
            <View
              style={[
                s.modalIconBox,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="list-outline"
                size={18}
                color={PRIMARY}
              />
            </View>
            <View>
              <Text style={s.modalTitle}>Add Topic</Text>
              <Text style={s.modalSub}>in {chapterName}</Text>
            </View>
          </View>

          {/* Topic name */}
          <Text style={s.inputLabel}>Topic Name</Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. Newton's Laws of Motion"
            placeholderTextColor={theme.colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          {/* Index */}
          <Text style={s.inputLabel}>
            Position (Index)
            <Text style={s.inputLabelOptional}> · optional</Text>
          </Text>
          <TextInput
            style={s.modalInput}
            placeholder={`1 – ${totalTopics + 1}  (leave blank to add at end)`}
            placeholderTextColor={theme.colors.textMuted}
            value={idx}
            onChangeText={setIdx}
            keyboardType="number-pad"
          />
          <IndexHint
            label={`Current topics: ${totalTopics}. Enter 1 to insert at top, ${
              totalTopics + 1
            } to append at end.`}
          />

          <View style={s.modalActions}>
            <TouchableOpacity
              style={s.modalCancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.modalAddBtn}
              onPress={submit}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="add-circle-outline"
                size={16}
                color="#fff"
              />
              <Text style={s.modalAddText}>Add Topic</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Add Chapter Modal ────────────────────────────────────────────────────────
const AddChapterModal = ({
  visible,
  totalChapters,
  onClose,
  onAdd,
}: {
  visible: boolean;
  totalChapters: number;
  onClose: () => void;
  onAdd: (name: string, index: number) => void;
}) => {
  const [name, setName] = useState('');
  const [idx, setIdx] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    const parsed = parseInt(idx, 10);
    const insertIndex =
      !isNaN(parsed) && parsed >= 1 ? parsed - 1 : totalChapters;
    onAdd(name.trim(), insertIndex);
    setName('');
    setIdx('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={s.modalSheet}>
          <View style={s.modalHandle} />

          <View style={s.modalTitleRow}>
            <View style={[s.modalIconBox, { backgroundColor: '#FEF3C7' }]}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="book-outline"
                size={18}
                color="#D97706"
              />
            </View>
            <View>
              <Text style={s.modalTitle}>Add New Chapter</Text>
              <Text style={s.modalSub}>Choose name & position</Text>
            </View>
          </View>

          {/* Chapter name */}
          <Text style={s.inputLabel}>Chapter Name</Text>
          <TextInput
            style={s.modalInput}
            placeholder="e.g. Thermodynamics"
            placeholderTextColor={theme.colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          {/* Index */}
          <Text style={s.inputLabel}>
            Position (Index)
            <Text style={s.inputLabelOptional}> · optional</Text>
          </Text>
          <TextInput
            style={s.modalInput}
            placeholder={`1 – ${
              totalChapters + 1
            }  (leave blank to add at end)`}
            placeholderTextColor={theme.colors.textMuted}
            value={idx}
            onChangeText={setIdx}
            keyboardType="number-pad"
          />
          <IndexHint
            label={`Current chapters: ${totalChapters}. Enter 1 to insert at top, ${
              totalChapters + 1
            } to append at end.`}
          />

          <View style={s.modalActions}>
            <TouchableOpacity
              style={s.modalCancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.modalAddBtn, { backgroundColor: '#D97706' }]}
              onPress={submit}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="add-circle-outline"
                size={16}
                color="#fff"
              />
              <Text style={s.modalAddText}>Add Chapter</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Chapter Card ─────────────────────────────────────────────────────────────
const ChapterCard = ({
  chapter,
  chapterIndex,
  onAddTopic,
  onDeleteChapter,
  onDeleteTopic,
}: {
  chapter: Chapter;
  chapterIndex: number;
  onAddTopic: () => void;
  onDeleteChapter: () => void;
  onDeleteTopic: (topicId: string) => void;
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
          {/* Chapter index badge */}
          <View style={s.chapterIndexBadge}>
            <Text style={s.chapterIndexText}>{chapterIndex + 1}</Text>
          </View>
          <VectorIcon
            iconSet="Ionicons"
            iconName="book-outline"
            size={18}
            color={PRIMARY}
          />
          <Text style={s.chapterName}>{chapter.name}</Text>
        </View>
        <View style={s.chapterRight}>
          <View style={s.topicCountBadge}>
            <Text style={s.topicCountText}>{chapter.topics.length} topics</Text>
          </View>
          <TouchableOpacity
            onPress={onDeleteChapter}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="trash-outline"
              size={17}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
          <VectorIcon
            iconSet="Ionicons"
            iconName={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={theme.colors.textMuted}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.topicsWrap}>
          {chapter.topics.length === 0 && (
            <Text style={s.noTopicsText}>No topics yet. Add one below.</Text>
          )}
          {chapter.topics.map((topic, ti) => (
            <View key={topic.id} style={s.topicRow}>
              <View style={s.topicIndexBadge}>
                <Text style={s.topicIndexText}>{ti + 1}</Text>
              </View>
              <Text style={s.topicName}>{topic.name}</Text>
              <TouchableOpacity
                onPress={() => onDeleteTopic(topic.id)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="close-circle-outline"
                  size={17}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={s.addTopicBtn}
            onPress={onAddTopic}
            activeOpacity={0.8}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="add"
              size={17}
              color={PRIMARY}
            />
            <Text style={s.addTopicText}>Add Topic</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TeacherSyllabusScreen = ({ navigation }: any) => {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedSubId, setSelectedSubId] = useState(INITIAL_SUBJECTS[0].id);
  const [addTopicFor, setAddTopicFor] = useState<Chapter | null>(null);
  const [addChapterVis, setAddChapterVis] = useState(false);

  const selectedSub = subjects.find(s => s.id === selectedSubId)!;

  const updateSubject = (updated: Subject) =>
    setSubjects(prev => prev.map(s => (s.id === updated.id ? updated : s)));

  // Add topic at specific index
  const handleAddTopic = (topicName: string, insertIndex: number) => {
    if (!addTopicFor) return;
    updateSubject({
      ...selectedSub,
      chapters: selectedSub.chapters.map(c =>
        c.id === addTopicFor.id
          ? {
              ...c,
              topics: insertAt(
                c.topics,
                { id: uid(), name: topicName },
                insertIndex,
              ),
            }
          : c,
      ),
    });
  };

  // Add chapter at specific index
  const handleAddChapter = (name: string, insertIndex: number) => {
    updateSubject({
      ...selectedSub,
      chapters: insertAt(
        selectedSub.chapters,
        { id: uid(), name, topics: [] },
        insertIndex,
      ),
    });
  };

  const handleDeleteTopic = (chapterId: string, topicId: string) =>
    updateSubject({
      ...selectedSub,
      chapters: selectedSub.chapters.map(c =>
        c.id === chapterId
          ? { ...c, topics: c.topics.filter(t => t.id !== topicId) }
          : c,
      ),
    });

  const handleDeleteChapter = (chapterId: string) =>
    updateSubject({
      ...selectedSub,
      chapters: selectedSub.chapters.filter(c => c.id !== chapterId),
    });

  return (
    <View style={s.root}>
      <Header title="Syllabus" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SubjectDropdown
          subjects={subjects}
          selected={selectedSub}
          onSelect={sub => setSelectedSubId(sub.id)}
        />

        <View style={s.chapterCountRow}>
          <Text style={s.chapterCountTitle}>Your Chapters</Text>
          <View style={s.chapterCountBadge}>
            <Text style={s.chapterCountBadgeText}>
              {selectedSub.chapters.length} chapters
            </Text>
          </View>
        </View>

        {selectedSub.chapters.map((chapter, i) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            chapterIndex={i}
            onAddTopic={() => setAddTopicFor(chapter)}
            onDeleteChapter={() => handleDeleteChapter(chapter.id)}
            onDeleteTopic={topicId => handleDeleteTopic(chapter.id, topicId)}
          />
        ))}

        {selectedSub.chapters.length === 0 && (
          <View style={s.empty}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="book-outline"
              size={48}
              color={theme.colors.textMuted}
            />
            <Text style={s.emptyText}>No chapters yet</Text>
            <Text style={s.emptySubText}>
              Tap "+ Add New Chapter" to get started
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => setAddChapterVis(true)}
        activeOpacity={0.85}
      >
        <VectorIcon iconSet="Ionicons" iconName="add" size={20} color="#fff" />
        <Text style={s.fabText}>Add New Chapter</Text>
      </TouchableOpacity>

      <AddTopicModal
        visible={!!addTopicFor}
        chapterName={addTopicFor?.name ?? ''}
        totalTopics={addTopicFor?.topics.length ?? 0}
        onClose={() => setAddTopicFor(null)}
        onAdd={handleAddTopic}
      />
      <AddChapterModal
        visible={addChapterVis}
        totalChapters={selectedSub.chapters.length}
        onClose={() => setAddChapterVis(false)}
        onAdd={handleAddChapter}
      />
    </View>
  );
};

export default TeacherSyllabusScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 16 },

  // Dropdown
  dropWrap: { marginBottom: 20, zIndex: 99 },
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

  // Chapter count
  chapterCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chapterCountTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  chapterCountBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chapterCountBadgeText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Chapter card
  chapterCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
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
    paddingVertical: 13,
  },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  chapterIndexBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterIndexText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  chapterName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  chapterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topicCountBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topicCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },

  // Topics
  topicsWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  noTopicsText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    paddingVertical: 10,
    fontStyle: 'italic',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
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
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  addTopicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderStyle: 'dashed',
    borderRadius: 10,
  },
  addTopicText: { fontSize: 13, fontWeight: '700', color: PRIMARY },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 999,
    shadowColor: PRIMARY,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  fabText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  emptySubText: { fontSize: 13, color: theme.colors.textMuted },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
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
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  modalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  modalSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
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
    marginBottom: 8,
  },
  indexHintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 20,
  },
  indexHintText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    flex: 1,
    lineHeight: 16,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
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
