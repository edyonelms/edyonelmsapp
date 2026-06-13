import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import ExamManagerCard from './ExamManagerCard';
import SelectDropdown from './SelectDropdown';
import {
  CLASSES,
  SEED_EXAMS,
  STUDENTS,
  SUBJECTS,
  UploadExam,
  UploadStudent,
} from './uploadData';

const UploadMarksScreen = ({ navigation }: any) => {
  const [exams, setExams] = useState<UploadExam[]>(SEED_EXAMS);
  const [selectedExam, setSelectedExam] = useState<UploadExam | null>(
    SEED_EXAMS[0],
  );
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const maxMarks = selectedExam?.totalMarks ?? 100;

  const setMark = (id: string, raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits === '') {
      setMarks(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const clamped = Math.min(parseInt(digits, 10), maxMarks);
    setMarks(prev => ({ ...prev, [id]: String(clamped) }));
  };

  const { enteredCount, average } = useMemo(() => {
    const vals = Object.values(marks)
      .map(v => parseInt(v, 10))
      .filter(n => !isNaN(n));
    const sum = vals.reduce((a, b) => a + b, 0);
    return {
      enteredCount: vals.length,
      average: vals.length ? Math.round(sum / vals.length) : 0,
    };
  }, [marks]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const renderStudent = ({ item }: { item: UploadStudent }) => {
    const value = marks[item.id] ?? '';
    return (
      <View style={s.row}>
        <View style={s.rowLeft}>
          <Text style={s.rollNo}>{item.rollNo}</Text>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <Text style={s.studentName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <TextInput
          style={[s.marksInput, value !== '' && s.marksInputFilled]}
          placeholder="--"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="number-pad"
          maxLength={4}
          value={value}
          onChangeText={t => setMark(item.id, t)}
        />

        <Text style={s.totalCell}>
          <Text style={s.totalValue}>{value || 0}</Text>
          <Text style={s.totalMax}>/{maxMarks}</Text>
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={s.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Upload Marks" onBackPress={() => navigation.goBack()} />

      <FlatList
        data={STUDENTS}
        keyExtractor={i => i.id}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <>
            <ExamManagerCard
              exams={exams}
              selected={selectedExam}
              onSelect={setSelectedExam}
              onChangeExams={setExams}
            />

            {/* Class + Subject */}
            <View style={s.selectorRow}>
              <SelectDropdown
                icon="people-outline"
                label="Class"
                options={CLASSES}
                selected={selectedClass}
                onSelect={setSelectedClass}
              />
              <SelectDropdown
                icon="book-outline"
                label="Subject"
                options={SUBJECTS}
                selected={selectedSubject}
                onSelect={setSelectedSubject}
              />
            </View>

            {/* Summary */}
            <View style={s.summaryRow}>
              <View style={s.summaryChip}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="create"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text style={s.summaryText}>
                  {enteredCount} of {STUDENTS.length} entered
                </Text>
              </View>
              <View style={[s.summaryChip, s.summaryChipAlt]}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="stats-chart"
                  size={14}
                  color={theme.colors.secondary}
                />
                <Text style={[s.summaryText, { color: theme.colors.secondary }]}>
                  Avg {average}/{maxMarks}
                </Text>
              </View>
            </View>

            {/* List header */}
            <View style={s.listHeader}>
              <Text style={[s.listHeaderText, { flex: 1 }]}>Student</Text>
              <Text style={[s.listHeaderText, s.colMarks]}>Marks</Text>
              <Text style={[s.listHeaderText, s.colTotal]}>Total</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={[s.submitBtn, submitted && s.submitBtnDone]}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName={submitted ? 'checkmark-done' : 'send'}
              size={18}
              color="#fff"
            />
            <Text style={s.submitText}>
              {submitted ? 'Marks Submitted!' : 'Submit Marks'}
            </Text>
          </TouchableOpacity>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default UploadMarksScreen;

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.lg, paddingTop: 14, paddingBottom: 30 },

  selectorRow: { flexDirection: 'row', gap: 10, marginTop: theme.spacing.md },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  summaryChipAlt: { backgroundColor: '#E0F2FE' },
  summaryText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 4,
  },
  listHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  colMarks: { width: 64, textAlign: 'center' },
  colTotal: { width: 64, textAlign: 'right' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rollNo: { fontSize: 12, color: theme.colors.textMuted, width: 22 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: theme.colors.primary },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flex: 1,
  },

  marksInput: {
    width: 56,
    height: 38,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingVertical: 0,
    marginRight: 8,
  },
  marksInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },

  totalCell: { width: 64, textAlign: 'right' },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  totalMax: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.lg,
  },
  submitBtnDone: { backgroundColor: theme.colors.success },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
