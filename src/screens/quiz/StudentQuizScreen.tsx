import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { QUIZ_SUBJECTS, Subject, Quiz, Question } from './quizData';
import { theme } from '../../utils/theme';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import VectorIcon from '../../components/VectorIcon';

const PRIMARY = theme.colors.primary;

// ─── Types ───────────────────────────────────────────────────────────────────
interface AttemptRecord {
  quizId: string;
  correct: number;
  total: number;
  skipped: number;
}

type Screen = 'home' | 'quiz' | 'result';

// ─── Main ─────────────────────────────────────────────────────────────────────
const StudentQuizScreen = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    QUIZ_SUBJECTS[0],
  );
  const [subDropOpen, setSubDropOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);

  // ── helpers ──
  const getAttempt = (quizId: string) =>
    attempts.find(a => a.quizId === quizId);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQIndex(0);
    setAnswers({});
    setScreen('quiz');
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const skipQuestion = () => {
    setAnswers(prev => ({ ...prev, [activeQuiz!.questions[qIndex].id]: null }));
    nextQuestion();
  };

  const nextQuestion = () => {
    if (qIndex < activeQuiz!.questions.length - 1) {
      setQIndex(i => i + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const qs = activeQuiz!.questions;
    let correct = 0;
    let skipped = 0;
    qs.forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined || ans === null) skipped++;
      else if (ans === q.correctId) correct++;
    });
    const record: AttemptRecord = {
      quizId: activeQuiz!.id,
      correct,
      total: qs.length,
      skipped,
    };
    setAttempts(prev => {
      const filtered = prev.filter(a => a.quizId !== activeQuiz!.id);
      return [...filtered, record];
    });
    setScreen('result');
  };

  // ── all quizzes for selected subject ──
  const allTopicQuizzes: {
    topicName: string;
    chapterName: string;
    quiz: Quiz;
  }[] = [];
  selectedSubject.chapters.forEach(ch =>
    ch.topics.forEach(tp =>
      tp.quizzes.forEach(qz =>
        allTopicQuizzes.push({
          topicName: tp.name,
          chapterName: ch.name,
          quiz: qz,
        }),
      ),
    ),
  );

  // TODO: wire to the quiz API loader once integrated.
  const { refreshing, onRefresh } = useRefresh(() => {});

  // ─── Screens ──────────────────────────────────────────────────────────────
  if (screen === 'quiz' && activeQuiz) {
    return (
      <QuizScreen
        quiz={activeQuiz}
        qIndex={qIndex}
        answers={answers}
        onSelect={selectAnswer}
        onSkip={skipQuestion}
        onNext={nextQuestion}
        onFinish={finishQuiz}
      />
    );
  }

  if (screen === 'result' && activeQuiz) {
    const rec = getAttempt(activeQuiz.id)!;
    return (
      <ResultScreen
        quiz={activeQuiz}
        record={rec}
        answers={answers}
        onRetry={() => startQuiz(activeQuiz)}
        onHome={() => setScreen('home')}
      />
    );
  }

  // ─── Home ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.root}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Subject Dropdown */}
        <View style={[s.dropWrap, subDropOpen && { zIndex: 99 }]}>
          <TouchableOpacity
            style={s.dropBtn}
            onPress={() => setSubDropOpen(o => !o)}
            activeOpacity={0.8}
          >
            <View style={s.dropLeft}>
              <Text style={s.dropIcon}>{selectedSubject.icon}</Text>
              <Text style={s.dropSelected}>{selectedSubject.name}</Text>
            </View>
            <VectorIcon
              iconSet="Ionicons"
              iconName={subDropOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={PRIMARY}
            />
          </TouchableOpacity>
          {subDropOpen && (
            <View style={s.dropList}>
              {QUIZ_SUBJECTS.map(sub => (
                <TouchableOpacity
                  key={sub.id}
                  style={[
                    s.dropItem,
                    sub.id === selectedSubject.id && s.dropItemActive,
                  ]}
                  onPress={() => {
                    setSelectedSubject(sub);
                    setSubDropOpen(false);
                  }}
                >
                  <Text style={s.dropIcon}>{sub.icon}</Text>
                  <Text
                    style={[
                      s.dropItemText,
                      sub.id === selectedSubject.id && s.dropItemTextActive,
                    ]}
                  >
                    {sub.name}
                  </Text>
                  {sub.id === selectedSubject.id && (
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="checkmark-circle"
                      size={16}
                      color={PRIMARY}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Stats summary */}
        <StatsBar
          attempts={attempts}
          quizzes={allTopicQuizzes.map(t => t.quiz)}
        />

        {/* Quiz list grouped by topic */}
        {allTopicQuizzes.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="help-circle-outline"
              size={48}
              color={theme.colors.textMuted}
            />
            <Text style={s.emptyText}>No quizzes available</Text>
          </View>
        ) : (
          allTopicQuizzes.map(({ topicName, chapterName, quiz }) => {
            const attempt = getAttempt(quiz.id);
            const pct = attempt
              ? Math.round((attempt.correct / attempt.total) * 100)
              : null;
            return (
              <View key={quiz.id} style={s.quizCard}>
                <View style={s.quizCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.quizTitle}>{quiz.title}</Text>
                    <Text style={s.quizMeta}>
                      {chapterName} · {topicName}
                    </Text>
                    <View style={s.quizMetaRow}>
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="help-circle-outline"
                        size={13}
                        color={theme.colors.textMuted}
                      />
                      <Text style={s.quizMetaText}>
                        {quiz.questions.length} questions
                      </Text>
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="time-outline"
                        size={13}
                        color={theme.colors.textMuted}
                      />
                      <Text style={s.quizMetaText}>{quiz.duration} min</Text>
                    </View>
                  </View>
                  {attempt && (
                    <View
                      style={[
                        s.scoreBadge,
                        { backgroundColor: pct! >= 60 ? '#D1FAE5' : '#FEE2E2' },
                      ]}
                    >
                      <Text
                        style={[
                          s.scorePct,
                          {
                            color:
                              pct! >= 60
                                ? theme.colors.success
                                : theme.colors.danger,
                          },
                        ]}
                      >
                        {pct}%
                      </Text>
                      <Text
                        style={[
                          s.scoreLabel,
                          {
                            color:
                              pct! >= 60
                                ? theme.colors.success
                                : theme.colors.danger,
                          },
                        ]}
                      >
                        {attempt.correct}/{attempt.total}
                      </Text>
                    </View>
                  )}
                </View>

                {attempt && (
                  <View style={s.attemptRow}>
                    <Chip
                      icon="checkmark-circle"
                      color={theme.colors.success}
                      label={`${attempt.correct} Correct`}
                    />
                    <Chip
                      icon="close-circle"
                      color={theme.colors.danger}
                      label={`${
                        attempt.total - attempt.correct - attempt.skipped
                      } Wrong`}
                    />
                    <Chip
                      icon="play-skip-forward"
                      color={theme.colors.textMuted}
                      label={`${attempt.skipped} Skipped`}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={s.startBtn}
                  onPress={() => startQuiz(quiz)}
                  activeOpacity={0.85}
                >
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName={attempt ? 'refresh' : 'play'}
                    size={15}
                    color="#fff"
                  />
                  <Text style={s.startBtnText}>
                    {attempt ? 'Retry Quiz' : 'Start Quiz'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = ({
  attempts,
  quizzes,
}: {
  attempts: AttemptRecord[];
  quizzes: Quiz[];
}) => {
  const attempted = attempts.length;
  const skipped = attempts.reduce((s, a) => s + a.skipped, 0);
  const totalQ = attempts.reduce((s, a) => s + a.total, 0);
  const correct = attempts.reduce((s, a) => s + a.correct, 0);
  const overallPct = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;

  return (
    <View style={s.statsBar}>
      <StatItem
        label="Attempted"
        value={`${attempted}/${quizzes.length}`}
        color={PRIMARY}
      />
      <StatItem
        label="Skipped Qs"
        value={String(skipped)}
        color={theme.colors.textMuted}
      />
      <StatItem
        label="Overall"
        value={totalQ > 0 ? `${overallPct}%` : '—'}
        color={overallPct >= 60 ? theme.colors.success : theme.colors.danger}
      />
    </View>
  );
};

const StatItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <View style={s.statItem}>
    <Text style={[s.statValue, { color }]}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const Chip = ({
  icon,
  color,
  label,
}: {
  icon: string;
  color: string;
  label: string;
}) => (
  <View style={s.chip}>
    <VectorIcon iconSet="Ionicons" iconName={icon} size={12} color={color} />
    <Text style={[s.chipText, { color }]}>{label}</Text>
  </View>
);

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
interface QuizScreenProps {
  quiz: Quiz;
  qIndex: number;
  answers: Record<string, string | null>;
  onSelect: (qId: string, optId: string) => void;
  onSkip: () => void;
  onNext: () => void;
  onFinish: () => void;
}
const QuizScreen = ({
  quiz,
  qIndex,
  answers,
  onSelect,
  onSkip,
  onNext,
  onFinish,
}: QuizScreenProps) => {
  const q: Question = quiz.questions[qIndex];
  const selected = answers[q.id];
  const isLast = qIndex === quiz.questions.length - 1;
  const progress = (qIndex + 1) / quiz.questions.length;

  return (
    <SafeAreaView style={s.root}>
      <View style={s.quizHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.quizHeaderTitle}>{quiz.title}</Text>
          <Text style={s.quizHeaderSub}>
            Question {qIndex + 1} of {quiz.questions.length}
          </Text>
        </View>
        <View
          style={[s.scoreBadge, { backgroundColor: theme.colors.primaryLight }]}
        >
          <Text style={[s.scorePct, { color: PRIMARY }]}>
            {qIndex + 1}/{quiz.questions.length}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.questionCard}>
          <Text style={s.questionText}>{q.question}</Text>
        </View>

        {q.options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[s.optionBtn, selected === opt.id && s.optionBtnActive]}
            onPress={() => onSelect(q.id, opt.id)}
            activeOpacity={0.8}
          >
            <View
              style={[
                s.optionCircle,
                selected === opt.id && s.optionCircleActive,
              ]}
            >
              {selected === opt.id && <View style={s.optionDot} />}
            </View>
            <Text
              style={[s.optionText, selected === opt.id && s.optionTextActive]}
            >
              {opt.text}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={s.quizActions}>
          <TouchableOpacity
            style={s.skipBtn}
            onPress={onSkip}
            activeOpacity={0.8}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="play-skip-forward"
              size={15}
              color={theme.colors.textSecondary}
            />
            <Text style={s.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.nextBtn, !selected && s.nextBtnDisabled]}
            onPress={isLast ? onFinish : onNext}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <Text style={s.nextText}>{isLast ? 'Finish' : 'Next'}</Text>
            <VectorIcon
              iconSet="Ionicons"
              iconName={isLast ? 'checkmark' : 'arrow-forward'}
              size={15}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Result Screen ────────────────────────────────────────────────────────────
interface ResultScreenProps {
  quiz: Quiz;
  record: AttemptRecord;
  answers: Record<string, string | null>;
  onRetry: () => void;
  onHome: () => void;
}
const ResultScreen = ({
  quiz,
  record,
  answers,
  onRetry,
  onHome,
}: ResultScreenProps) => {
  const pct = Math.round((record.correct / record.total) * 100);
  const wrong = record.total - record.correct - record.skipped;
  const passed = pct >= 60;

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Score card */}
        <View
          style={[
            s.resultCard,
            {
              borderColor: passed ? theme.colors.success : theme.colors.danger,
            },
          ]}
        >
          <Text style={s.resultEmoji}>{passed ? '🎉' : '😔'}</Text>
          <Text style={s.resultTitle}>
            {passed ? 'Well Done!' : 'Keep Practicing!'}
          </Text>
          <Text
            style={[
              s.resultPct,
              { color: passed ? theme.colors.success : theme.colors.danger },
            ]}
          >
            {pct}%
          </Text>
          <Text style={s.resultScore}>
            {record.correct} out of {record.total} correct
          </Text>

          <View style={s.resultChips}>
            <ResultChip
              label="Correct"
              value={record.correct}
              color={theme.colors.success}
              bg="#D1FAE5"
            />
            <ResultChip
              label="Wrong"
              value={wrong}
              color={theme.colors.danger}
              bg="#FEE2E2"
            />
            <ResultChip
              label="Skipped"
              value={record.skipped}
              color={theme.colors.textMuted}
              bg={theme.colors.border}
            />
          </View>
        </View>

        {/* Answer review */}
        <Text style={s.reviewTitle}>Answer Review</Text>
        {quiz.questions.map((q, i) => {
          const ans = answers[q.id];
          const isSkipped = ans === null || ans === undefined;
          const isCorrect = ans === q.correctId;
          return (
            <View key={q.id} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <Text style={s.reviewQ}>
                  Q{i + 1}. {q.question}
                </Text>
                <View
                  style={[
                    s.reviewBadge,
                    {
                      backgroundColor: isSkipped
                        ? theme.colors.border
                        : isCorrect
                        ? '#D1FAE5'
                        : '#FEE2E2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.reviewBadgeText,
                      {
                        color: isSkipped
                          ? theme.colors.textMuted
                          : isCorrect
                          ? theme.colors.success
                          : theme.colors.danger,
                      },
                    ]}
                  >
                    {isSkipped
                      ? 'Skipped'
                      : isCorrect
                      ? '✓ Correct'
                      : '✗ Wrong'}
                  </Text>
                </View>
              </View>
              {!isSkipped && !isCorrect && (
                <Text style={s.correctAns}>
                  Correct: {q.options.find(o => o.id === q.correctId)?.text}
                </Text>
              )}
            </View>
          );
        })}

        <View style={s.resultActions}>
          <TouchableOpacity
            style={s.retryBtn}
            onPress={onRetry}
            activeOpacity={0.85}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="refresh"
              size={16}
              color={PRIMARY}
            />
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.homeBtn}
            onPress={onHome}
            activeOpacity={0.85}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="home"
              size={16}
              color="#fff"
            />
            <Text style={s.homeText}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const ResultChip = ({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) => (
  <View style={[s.resultChip, { backgroundColor: bg }]}>
    <Text style={[s.resultChipVal, { color }]}>{value}</Text>
    <Text style={[s.resultChipLabel, { color }]}>{label}</Text>
  </View>
);

export default StudentQuizScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  dropIcon: { fontSize: 18 },
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

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    padding: 14,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18, fontWeight: '900' },
  statLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },

  // Quiz card
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  quizCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  quizMeta: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 },
  quizMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quizMetaText: { fontSize: 12, color: theme.colors.textMuted, marginRight: 6 },
  scoreBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 56,
  },
  scorePct: { fontSize: 16, fontWeight: '900' },
  scoreLabel: { fontSize: 11, fontWeight: '700' },
  attemptRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: { fontSize: 11, fontWeight: '700' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 10,
  },
  startBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },

  // Quiz screen
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  quizHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  quizHeaderSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  progressBg: { height: 4, backgroundColor: theme.colors.border },
  progressFill: { height: 4, backgroundColor: PRIMARY, borderRadius: 2 },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  optionBtnActive: {
    borderColor: PRIMARY,
    backgroundColor: theme.colors.primaryLight,
  },
  optionCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCircleActive: { borderColor: PRIMARY },
  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  optionTextActive: { color: PRIMARY, fontWeight: '700' },
  quizActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  skipBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  nextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: PRIMARY,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // Result screen
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  resultEmoji: { fontSize: 48, marginBottom: 8 },
  resultTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  resultPct: { fontSize: 48, fontWeight: '900', marginBottom: 4 },
  resultScore: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultChips: { flexDirection: 'row', gap: 10 },
  resultChip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  resultChipVal: { fontSize: 20, fontWeight: '900' },
  resultChipLabel: { fontSize: 11, fontWeight: '700' },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  reviewQ: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  reviewBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  reviewBadgeText: { fontSize: 11, fontWeight: '700' },
  correctAns: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '600',
    marginTop: 6,
  },
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  retryText: { fontSize: 14, fontWeight: '800', color: PRIMARY },
  homeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
  },
  homeText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
