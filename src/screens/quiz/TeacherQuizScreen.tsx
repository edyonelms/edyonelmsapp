import React, { useMemo, useState } from 'react';
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
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import { theme, onThemeChange } from '../../utils/theme';
import type { Chapter, Question, Quiz, Subject } from './quizData';
import { QUIZ_SUBJECTS } from './quizData';

const PRIMARY = theme.colors.primary;
const OPTION_IDS = ['a', 'b', 'c', 'd'] as const;
const makeId = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}`;

const cloneSubjects = (): Subject[] =>
  QUIZ_SUBJECTS.map(s => ({
    ...s,
    chapters: s.chapters.map(c => ({
      ...c,
      topics: c.topics.map(t => ({
        ...t,
        quizzes: t.quizzes.map(q => ({
          ...q,
          questions: q.questions.map(qu => ({
            ...qu,
            options: qu.options.map(o => ({ ...o })),
          })),
        })),
      })),
    })),
  }));

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

// ─── Quiz Create Modal ────────────────────────────────────────────────────────
const QuizModal = ({
  visible,
  chapterName,
  topicName,
  onClose,
  onSave,
}: {
  visible: boolean;
  chapterName: string;
  topicName: string;
  onClose: () => void;
  onSave: (quiz: Omit<Quiz, 'id'>) => void;
}) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [duration, setDuration] = useState('10');
  const [questionText, setQuestionText] = useState('');
  const [optionTexts, setOptionTexts] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [draftQuestions, setDraftQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');

  const reset = () => {
    setQuizTitle('');
    setDuration('10');
    setQuestionText('');
    setOptionTexts(['', '', '', '']);
    setCorrectIdx(0);
    setDraftQuestions([]);
    setError('');
  };

  const addQuestion = () => {
    if (!questionText.trim()) {
      setError('Enter a question.');
      return;
    }
    if (optionTexts.some(o => !o.trim())) {
      setError('Fill all 4 options.');
      return;
    }
    setDraftQuestions(prev => [
      ...prev,
      {
        id: makeId('qu'),
        question: questionText.trim(),
        options: optionTexts.map((t, i) => ({
          id: OPTION_IDS[i],
          text: t.trim(),
        })),
        correctId: OPTION_IDS[correctIdx],
      },
    ]);
    setQuestionText('');
    setOptionTexts(['', '', '', '']);
    setCorrectIdx(0);
    setError('');
  };

  const save = () => {
    if (!quizTitle.trim()) {
      setError('Enter a quiz title.');
      return;
    }
    const dur = parseInt(duration, 10);
    if (isNaN(dur) || dur <= 0) {
      setError('Enter a valid duration.');
      return;
    }
    if (!draftQuestions.length) {
      setError('Add at least one question.');
      return;
    }
    onSave({
      title: quizTitle.trim(),
      topicId: '',
      topicName,
      duration: dur,
      questions: draftQuestions,
    });
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        reset();
        onClose();
      }}
    >
      <TouchableOpacity
        style={s.overlay}
        activeOpacity={1}
        onPress={() => {
          reset();
          onClose();
        }}
      >
        <TouchableOpacity activeOpacity={1} style={s.sheet}>
          <View style={s.handle} />
          <View style={s.modalTitleRow}>
            <View
              style={[
                s.modalIconBox,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="help-circle-outline"
                size={18}
                color={PRIMARY}
              />
            </View>
            <View>
              <Text style={s.modalTitle}>Add Quiz</Text>
              <Text style={s.modalSub}>
                {chapterName} › {topicName}
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {!!error && (
              <View style={s.errorBox}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="alert-circle-outline"
                  size={14}
                  color={theme.colors.danger}
                />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <Text style={s.inputLabel}>Quiz Title</Text>
            <TextInput
              style={s.modalInput}
              value={quizTitle}
              onChangeText={setQuizTitle}
              placeholder="e.g. Newton's Laws Practice"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={s.inputLabel}>Duration (minutes)</Text>
            <TextInput
              style={s.modalInput}
              value={duration}
              onChangeText={setDuration}
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.textMuted}
            />

            <View style={s.divider} />
            <Text style={s.inputLabel}>Question</Text>
            <TextInput
              style={[
                s.modalInput,
                { minHeight: 72, textAlignVertical: 'top' },
              ]}
              value={questionText}
              onChangeText={setQuestionText}
              placeholder="Type your question here"
              placeholderTextColor={theme.colors.textMuted}
              multiline
            />

            <Text style={s.inputLabel}>
              Options (tap circle = correct answer)
            </Text>
            {optionTexts.map((opt, i) => (
              <View key={OPTION_IDS[i]} style={s.optionRow}>
                <TouchableOpacity
                  style={[s.correctDot, correctIdx === i && s.correctDotActive]}
                  onPress={() => setCorrectIdx(i)}
                >
                  {correctIdx === i ? (
                    <View style={s.correctDotInner} />
                  ) : (
                    <Text style={s.optionLetter}>{OPTION_IDS[i]}</Text>
                  )}
                </TouchableOpacity>
                <TextInput
                  style={s.optionInput}
                  value={opt}
                  onChangeText={v =>
                    setOptionTexts(prev =>
                      prev.map((p, pi) => (pi === i ? v : p)),
                    )
                  }
                  placeholder={`Option ${i + 1}`}
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            ))}

            <TouchableOpacity
              style={s.addQBtn}
              onPress={addQuestion}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="add-circle-outline"
                size={16}
                color={PRIMARY}
              />
              <Text style={s.addQText}>Add Question</Text>
            </TouchableOpacity>

            {draftQuestions.length > 0 && (
              <View style={s.draftCard}>
                <Text style={s.draftTitle}>
                  Draft Questions ({draftQuestions.length})
                </Text>
                {draftQuestions.map((q, i) => (
                  <View key={q.id} style={s.draftItem}>
                    <Text style={s.draftQ} numberOfLines={2}>
                      {i + 1}. {q.question}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setDraftQuestions(prev =>
                          prev.filter(x => x.id !== q.id),
                        )
                      }
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
              </View>
            )}

            <View style={s.modalActions}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => {
                  reset();
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.saveBtn}
                onPress={save}
                activeOpacity={0.85}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="save-outline"
                  size={16}
                  color="#fff"
                />
                <Text style={s.saveText}>Save Quiz</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Chapter Card ─────────────────────────────────────────────────────────────
const ChapterCard = ({
  chapter,
  chapterIndex,
  onAddQuiz,
}: {
  chapter: Chapter;
  chapterIndex: number;
  onAddQuiz: (topicId: string) => void;
}) => {
  const [expanded, setExpanded] = useState(chapterIndex === 0);
  const totalQuizzes = chapter.topics.reduce(
    (sum, t) => sum + t.quizzes.length,
    0,
  );

  return (
    <View style={s.chapterCard}>
      <TouchableOpacity
        style={s.chapterHeader}
        onPress={() => setExpanded(v => !v)}
        activeOpacity={0.8}
      >
        <View style={s.chapterLeft}>
          <View style={s.chapterBadge}>
            <Text style={s.chapterBadgeText}>{chapterIndex + 1}</Text>
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
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{totalQuizzes} quizzes</Text>
          </View>
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
          {!chapter.topics.length && (
            <Text style={s.noTopicsText}>No topics in this chapter.</Text>
          )}
          {chapter.topics.map((topic, ti) => (
            <View key={topic.id} style={s.topicRow}>
              <View style={s.topicLeft}>
                <View style={s.topicBadge}>
                  <Text style={s.topicBadgeText}>{ti + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.topicName}>{topic.name}</Text>
                  {topic.quizzes.length > 0 && (
                    <View style={s.quizPillWrap}>
                      {topic.quizzes.map(q => (
                        <View key={q.id} style={s.quizPill}>
                          <VectorIcon
                            iconSet="Ionicons"
                            iconName="help-circle-outline"
                            size={11}
                            color={PRIMARY}
                          />
                          <Text style={s.quizPillText} numberOfLines={1}>
                            {q.title}
                          </Text>
                          <Text style={s.quizPillMeta}>
                            {q.questions.length}Q · {q.duration}m
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={s.addQuizBtn}
                onPress={() => onAddQuiz(topic.id)}
                activeOpacity={0.8}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="add"
                  size={14}
                  color={PRIMARY}
                />
                <Text style={s.addQuizText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TeacherQuizScreen = ({ navigation }: any) => {
  const [subjects, setSubjects] = useState<Subject[]>(cloneSubjects);
  const [selectedSubId, setSelectedSubId] = useState(
    QUIZ_SUBJECTS[0]?.id ?? '',
  );
  const [modalTopicId, setModalTopicId] = useState<string | null>(null);

  const selectedSub = useMemo(
    () => subjects.find(s => s.id === selectedSubId) ?? subjects[0],
    [selectedSubId, subjects],
  );

  const modalContext = useMemo(() => {
    if (!modalTopicId || !selectedSub) return null;
    for (const chapter of selectedSub.chapters) {
      const topic = chapter.topics.find(t => t.id === modalTopicId);
      if (topic) return { chapter, topic };
    }
    return null;
  }, [modalTopicId, selectedSub]);

  const handleSaveQuiz = (quiz: Omit<Quiz, 'id'>) => {
    if (!modalContext) return;
    const newQuiz: Quiz = {
      ...quiz,
      id: makeId('q'),
      topicId: modalContext.topic.id,
    };
    setSubjects(prev =>
      prev.map(sub =>
        sub.id !== selectedSub.id
          ? sub
          : {
              ...sub,
              chapters: sub.chapters.map(ch =>
                ch.id !== modalContext.chapter.id
                  ? ch
                  : {
                      ...ch,
                      topics: ch.topics.map(t =>
                        t.id !== modalContext.topic.id
                          ? t
                          : { ...t, quizzes: [...t.quizzes, newQuiz] },
                      ),
                    },
              ),
            },
      ),
    );
  };

  // TODO: wire to the quiz API loader once integrated.
  const { refreshing, onRefresh } = useRefresh(() => {});

  return (
    <View style={s.root}>
      <Header title="Quiz Management" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SubjectDropdown
          subjects={subjects}
          selected={selectedSub}
          onSelect={sub => setSelectedSubId(sub.id)}
        />

        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Chapters & Quizzes</Text>
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>
              {selectedSub?.chapters.length ?? 0} chapters
            </Text>
          </View>
        </View>

        {!selectedSub?.chapters.length ? (
          <View style={s.empty}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="help-circle-outline"
              size={48}
              color={theme.colors.textMuted}
            />
            <Text style={s.emptyText}>No chapters yet</Text>
          </View>
        ) : (
          selectedSub.chapters.map((chapter, i) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              chapterIndex={i}
              onAddQuiz={topicId => setModalTopicId(topicId)}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <QuizModal
        visible={!!modalTopicId}
        chapterName={modalContext?.chapter.name ?? ''}
        topicName={modalContext?.topic.name ?? ''}
        onClose={() => setModalTopicId(null)}
        onSave={handleSaveQuiz}
      />
    </View>
  );
};

export default TeacherQuizScreen;

const __mk_s = () => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16 },

  // Dropdown
  dropWrap: { marginBottom: 20, zIndex: 99 },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
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
  dropIcon: { fontSize: 18 },
  dropSelected: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dropList: {
    backgroundColor: theme.colors.card,
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

  // Section header
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  countBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countBadgeText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Chapter card
  chapterCard: {
    backgroundColor: theme.colors.card,
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
  chapterBadge: {
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  chapterName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  chapterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  topicBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  topicBadgeText: { fontSize: 10, fontWeight: '800', color: PRIMARY },
  topicName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  addQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 8,
  },
  addQuizText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Quiz pills
  quizPillWrap: { marginTop: 6, gap: 4 },
  quizPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  quizPillText: { flex: 1, fontSize: 11, fontWeight: '700', color: PRIMARY },
  quizPillMeta: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: '600',
    opacity: 0.7,
  },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
    maxHeight: '90%',
  },
  handle: {
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
    marginBottom: 16,
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
    marginTop: 4,
  },
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
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  correctDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#B7C4FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7FF',
    marginRight: 8,
  },
  correctDotActive: {
    borderColor: PRIMARY,
    backgroundColor: theme.colors.primaryLight,
  },
  correctDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },
  optionLetter: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.card,
  },
  addQBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  addQText: { fontSize: 13, fontWeight: '700', color: PRIMARY },
  draftCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#FAFBFF',
    marginBottom: 12,
  },
  draftTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  draftItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  draftQ: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3F3',
    borderWidth: 1,
    borderColor: '#F6C7C7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: '600',
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
  },
  saveText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
