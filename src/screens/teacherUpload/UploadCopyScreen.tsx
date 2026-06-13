import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
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

interface UploadedCopy {
  name: string;
  uri: string;
}

const UploadCopyScreen = ({ navigation }: any) => {
  const [exams, setExams] = useState<UploadExam[]>(SEED_EXAMS);
  const [selectedExam, setSelectedExam] = useState<UploadExam | null>(
    SEED_EXAMS[0],
  );
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [uploads, setUploads] = useState<Record<string, UploadedCopy>>({});
  const [submitted, setSubmitted] = useState(false);

  const uploadedCount = Object.keys(uploads).length;

  const pickCopy = (student: UploadStudent) => {
    launchImageLibrary({ mediaType: 'mixed', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset) return;
      setUploads(prev => ({
        ...prev,
        [student.id]: {
          name:
            asset.fileName ??
            `${student.name.split(' ')[0]}_copy.${
              (asset.type ?? 'image/jpeg').split('/')[1]
            }`,
          uri: asset.uri ?? '',
        },
      }));
    });
  };

  const removeCopy = (id: string) =>
    setUploads(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const renderStudent = ({ item }: { item: UploadStudent }) => {
    const copy = uploads[item.id];
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

        {copy ? (
          <View style={s.uploadedPill}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="document-text"
              size={13}
              color={theme.colors.success}
            />
            <Text style={s.uploadedText} numberOfLines={1}>
              {copy.name}
            </Text>
            <TouchableOpacity
              onPress={() => removeCopy(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="close-circle"
                size={16}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={s.uploadBtn}
            activeOpacity={0.8}
            onPress={() => pickCopy(item)}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="cloud-upload-outline"
              size={15}
              color={theme.colors.primary}
            />
            <Text style={s.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={s.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Upload Copy" onBackPress={() => navigation.goBack()} />

      <FlatList
        data={STUDENTS}
        keyExtractor={i => i.id}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
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
                  iconName="checkmark-circle"
                  size={14}
                  color={theme.colors.success}
                />
                <Text style={s.summaryText}>
                  {uploadedCount} of {STUDENTS.length} uploaded
                </Text>
              </View>
              <Text style={s.summaryHint}>{selectedSubject.label}</Text>
            </View>

            {/* List header */}
            <View style={s.listHeader}>
              <Text style={s.listHeaderText}>Student</Text>
              <Text style={s.listHeaderText}>Copy</Text>
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
              {submitted ? 'Copies Submitted!' : 'Submit Copies'}
            </Text>
          </TouchableOpacity>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default UploadCopyScreen;

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.lg, paddingTop: 14, paddingBottom: 30 },

  selectorRow: { flexDirection: 'row', gap: 10, marginTop: theme.spacing.md },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  summaryText: { fontSize: 12, fontWeight: '700', color: theme.colors.success },
  summaryHint: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
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

  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  uploadBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },

  uploadedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: 150,
    backgroundColor: '#DCFCE7',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  uploadedText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.success,
    flexShrink: 1,
  },

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
