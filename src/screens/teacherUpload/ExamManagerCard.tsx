import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import {
  ACADEMIC_YEARS,
  EXAM_TYPES,
  ExamType,
  makeId,
  TYPE_ICON,
  UploadExam,
} from './uploadData';

interface Props {
  exams: UploadExam[];
  selected: UploadExam | null;
  onSelect: (exam: UploadExam) => void;
  onChangeExams: (exams: UploadExam[]) => void;
}

type FormMode = 'list' | 'add' | 'edit';

interface Draft {
  id: string;
  name: string;
  type: ExamType;
  academicYear: string;
  totalMarks: string;
  dateRange: string;
}

const emptyDraft = (): Draft => ({
  id: '',
  name: '',
  type: EXAM_TYPES[0],
  academicYear: ACADEMIC_YEARS[0],
  totalMarks: '100',
  dateRange: '',
});

// Exam selector card + manage (add / edit / update / delete) sheet.
const ExamManagerCard = ({
  exams,
  selected,
  onSelect,
  onChangeExams,
}: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>('list');
  const [draft, setDraft] = useState<Draft>(emptyDraft());

  const openAdd = () => {
    setDraft(emptyDraft());
    setMode('add');
  };

  const openEdit = (exam: UploadExam) => {
    setDraft({
      id: exam.id,
      name: exam.name,
      type: exam.type,
      academicYear: exam.academicYear,
      totalMarks: String(exam.totalMarks),
      dateRange: exam.dateRange,
    });
    setMode('edit');
  };

  const handleDelete = (exam: UploadExam) => {
    Alert.alert('Delete Exam', `Remove "${exam.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const next = exams.filter(e => e.id !== exam.id);
          onChangeExams(next);
          if (selected?.id === exam.id && next.length) onSelect(next[0]);
        },
      },
    ]);
  };

  const handleSave = () => {
    const name = draft.name.trim();
    if (!name) {
      Alert.alert('Missing Name', 'Please enter an exam name.');
      return;
    }
    const total = parseInt(draft.totalMarks, 10);
    if (!total || total <= 0) {
      Alert.alert('Invalid Marks', 'Total marks must be a positive number.');
      return;
    }

    if (mode === 'add') {
      const exam: UploadExam = {
        id: makeId(),
        name,
        type: draft.type,
        academicYear: draft.academicYear,
        totalMarks: total,
        dateRange: draft.dateRange.trim() || 'Dates to be announced',
      };
      onChangeExams([exam, ...exams]);
      onSelect(exam);
    } else {
      const next = exams.map(e =>
        e.id === draft.id
          ? {
              ...e,
              name,
              type: draft.type,
              academicYear: draft.academicYear,
              totalMarks: total,
              dateRange: draft.dateRange.trim() || e.dateRange,
            }
          : e,
      );
      onChangeExams(next);
      const updated = next.find(e => e.id === draft.id);
      if (updated && selected?.id === draft.id) onSelect(updated);
    }
    setMode('list');
  };

  const closeManage = () => {
    setManageOpen(false);
    setMode('list');
  };

  return (
    <View style={s.wrap}>
      {/* ── Selected exam card ── */}
      <View style={s.card}>
        <View style={s.accent} />
        <TouchableOpacity
          style={s.cardMain}
          activeOpacity={0.85}
          onPress={() => setPickerOpen(o => !o)}
        >
          <View style={s.iconWrap}>
            <VectorIcon
              iconSet="Ionicons"
              iconName={selected ? TYPE_ICON[selected.type] : 'documents-outline'}
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={s.cardText}>
            <Text style={s.cardLabel}>Selected Exam</Text>
            <Text style={s.cardName} numberOfLines={1}>
              {selected ? selected.name : 'No exams — tap edit to add'}
            </Text>
            {selected && (
              <View style={s.metaRow}>
                <View style={s.metaPill}>
                  <Text style={s.metaPillText}>{selected.type}</Text>
                </View>
                <View style={s.metaPill}>
                  <Text style={s.metaPillText}>{selected.academicYear}</Text>
                </View>
                <View style={[s.metaPill, s.metaPillAccent]}>
                  <Text style={[s.metaPillText, s.metaPillTextAccent]}>
                    {selected.totalMarks} marks
                  </Text>
                </View>
              </View>
            )}
          </View>
          <VectorIcon
            iconSet="Ionicons"
            iconName={pickerOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>

        {/* Edit button */}
        <TouchableOpacity
          style={s.editBtn}
          activeOpacity={0.8}
          onPress={() => {
            setPickerOpen(false);
            setManageOpen(true);
          }}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="create-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={s.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* ── Inline picker ── */}
      {pickerOpen && (
        <View style={s.picker}>
          {exams.length === 0 ? (
            <Text style={s.pickerEmpty}>No exams yet</Text>
          ) : (
            exams.map((exam, i) => {
              const active = exam.id === selected?.id;
              return (
                <TouchableOpacity
                  key={exam.id}
                  style={[
                    s.pickerItem,
                    i === exams.length - 1 && s.pickerItemLast,
                    active && s.pickerItemActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(exam);
                    setPickerOpen(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[s.pickerName, active && s.pickerNameActive]}
                    >
                      {exam.name}
                    </Text>
                    <Text style={s.pickerSub}>
                      {exam.type} · {exam.academicYear}
                    </Text>
                  </View>
                  {active && (
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="checkmark-circle"
                      size={18}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      {/* ── Manage modal ── */}
      <Modal
        visible={manageOpen}
        transparent
        animationType="slide"
        onRequestClose={closeManage}
      >
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>
                {mode === 'list'
                  ? 'Manage Exams'
                  : mode === 'add'
                  ? 'Add New Exam'
                  : 'Edit Exam'}
              </Text>
              <TouchableOpacity
                onPress={mode === 'list' ? closeManage : () => setMode('list')}
                style={s.closeBtn}
                activeOpacity={0.8}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={mode === 'list' ? 'close' : 'arrow-back'}
                  size={20}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {mode === 'list' ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.sheetBody}
              >
                <TouchableOpacity
                  style={s.addBtn}
                  activeOpacity={0.85}
                  onPress={openAdd}
                >
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="add-circle"
                    size={18}
                    color="#fff"
                  />
                  <Text style={s.addBtnText}>Add New Exam</Text>
                </TouchableOpacity>

                {exams.map(exam => (
                  <View key={exam.id} style={s.manageRow}>
                    <View style={s.manageIcon}>
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName={TYPE_ICON[exam.type]}
                        size={18}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.manageName}>{exam.name}</Text>
                      <Text style={s.manageSub}>
                        {exam.type} · {exam.academicYear} · {exam.totalMarks}{' '}
                        marks
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={s.iconAction}
                      activeOpacity={0.7}
                      onPress={() => openEdit(exam)}
                    >
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="create-outline"
                        size={18}
                        color={theme.colors.secondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={s.iconAction}
                      activeOpacity={0.7}
                      onPress={() => handleDelete(exam)}
                    >
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="trash-outline"
                        size={18}
                        color={theme.colors.danger}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {exams.length === 0 && (
                  <Text style={s.manageEmpty}>
                    No exams yet. Tap "Add New Exam" to create one.
                  </Text>
                )}
              </ScrollView>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.sheetBody}
                keyboardShouldPersistTaps="handled"
              >
                {/* Name */}
                <Text style={s.fieldLabel}>Exam Name</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. IA 1, Mid Term"
                  placeholderTextColor={theme.colors.textMuted}
                  value={draft.name}
                  onChangeText={t => setDraft(d => ({ ...d, name: t }))}
                />

                {/* Type */}
                <Text style={s.fieldLabel}>Exam Type</Text>
                <View style={s.chipsRow}>
                  {EXAM_TYPES.map(t => {
                    const active = draft.type === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[s.chip, active && s.chipActive]}
                        activeOpacity={0.8}
                        onPress={() => setDraft(d => ({ ...d, type: t }))}
                      >
                        <Text
                          style={[s.chipText, active && s.chipTextActive]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Academic year */}
                <Text style={s.fieldLabel}>Academic Year</Text>
                <View style={s.chipsRow}>
                  {ACADEMIC_YEARS.map(y => {
                    const active = draft.academicYear === y;
                    return (
                      <TouchableOpacity
                        key={y}
                        style={[s.chip, active && s.chipActive]}
                        activeOpacity={0.8}
                        onPress={() =>
                          setDraft(d => ({ ...d, academicYear: y }))
                        }
                      >
                        <Text
                          style={[s.chipText, active && s.chipTextActive]}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Total marks */}
                <Text style={s.fieldLabel}>Total Marks</Text>
                <TextInput
                  style={s.input}
                  placeholder="100"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad"
                  value={draft.totalMarks}
                  onChangeText={t =>
                    setDraft(d => ({
                      ...d,
                      totalMarks: t.replace(/[^0-9]/g, ''),
                    }))
                  }
                />

                {/* Date range */}
                <Text style={s.fieldLabel}>Date Range</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. 03 Feb - 26 Feb 2026"
                  placeholderTextColor={theme.colors.textMuted}
                  value={draft.dateRange}
                  onChangeText={t => setDraft(d => ({ ...d, dateRange: t }))}
                />

                <TouchableOpacity
                  style={s.saveBtn}
                  activeOpacity={0.85}
                  onPress={handleSave}
                >
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="checkmark-circle"
                    size={18}
                    color="#fff"
                  />
                  <Text style={s.saveBtnText}>
                    {mode === 'add' ? 'Create Exam' : 'Update Exam'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExamManagerCard;

const s = StyleSheet.create({
  wrap: { zIndex: 99 },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accent: { height: 4, backgroundColor: theme.colors.primary },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
  cardName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 1,
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  metaPill: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metaPillAccent: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryLight,
  },
  metaPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  metaPillTextAccent: { color: theme.colors.primary },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },

  picker: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 6,
    overflow: 'hidden',
    elevation: 4,
  },
  pickerEmpty: {
    fontSize: 13,
    color: theme.colors.textMuted,
    padding: theme.spacing.md,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  pickerItemLast: { borderBottomWidth: 0 },
  pickerItemActive: { backgroundColor: theme.colors.primaryLight },
  pickerName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  pickerNameActive: { color: theme.colors.primary, fontWeight: '700' },
  pickerSub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: { padding: 16, gap: 12 },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 12,
  },
  addBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  manageIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  manageSub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  manageEmpty: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Form
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: -4,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: { color: '#fff' },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 13,
    marginTop: 6,
    marginBottom: 10,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
