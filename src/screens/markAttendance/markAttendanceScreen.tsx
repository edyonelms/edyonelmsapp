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
import {
  AttendanceStatus,
  CLASSES,
  Student,
  STATUS_CONFIG,
  getCounts,
  getDefaultStudents,
  getTodayLabel,
} from './markAttendanceData';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
import Header from '../../components/Header';

const MarkAttendanceScreen = () => {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [classDropdown, setClassDropdown] = useState(false);
  const [students, setStudents] = useState<Student[]>(getDefaultStudents());
  const [submitted, setSubmitted] = useState(false);

  const setStatus = (id: string, status: AttendanceStatus) =>
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));

  const markAll = (status: AttendanceStatus) =>
    setStudents(prev => prev.map(s => ({ ...s, status })));

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const counts = getCounts(students);

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rollNo}>{item.rollNo}</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <View style={styles.statusBtns}>
        {(['present', 'absent', 'leave'] as AttendanceStatus[]).map(s => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(item.id, s)}
            style={[
              styles.statusBtn,
              {
                backgroundColor:
                  item.status === s
                    ? STATUS_CONFIG[s].bg
                    : theme.colors.background,
                borderColor:
                  item.status === s
                    ? STATUS_CONFIG[s].color
                    : theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.statusBtnText,
                {
                  color:
                    item.status === s
                      ? STATUS_CONFIG[s].color
                      : theme.colors.textMuted,
                },
              ]}
            >
              {STATUS_CONFIG[s].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Mark Attendance" />

      <FlatList
        data={students}
        keyExtractor={i => i.id}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Top row: date + class selector */}
            <View style={styles.topRow}>
              <View style={styles.dateBox}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="calendar-outline"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text style={styles.dateText}>{getTodayLabel()}</Text>
              </View>

              <TouchableOpacity
                style={styles.classSelector}
                onPress={() => setClassDropdown(v => !v)}
                activeOpacity={0.8}
              >
                <Text style={styles.classSelectorText}>
                  {selectedClass.label}
                </Text>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={classDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Dropdown */}
            {classDropdown && (
              <View style={styles.dropdown}>
                {CLASSES.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.dropdownItem,
                      c.id === selectedClass.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedClass(c);
                      setClassDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        c.id === selectedClass.id && styles.dropdownTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                    {c.id === selectedClass.id && (
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="checkmark"
                        size={14}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Summary chips */}
            <View style={styles.summaryRow}>
              {(['present', 'absent', 'leave'] as AttendanceStatus[]).map(s => (
                <View
                  key={s}
                  style={[
                    styles.chip,
                    { backgroundColor: STATUS_CONFIG[s].bg },
                  ]}
                >
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName={STATUS_CONFIG[s].icon}
                    size={14}
                    color={STATUS_CONFIG[s].color}
                  />
                  <Text
                    style={[styles.chipText, { color: STATUS_CONFIG[s].color }]}
                  >
                    {STATUS_CONFIG[s].label} {counts[s]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Mark all */}
            <View style={styles.markAllRow}>
              <Text style={styles.markAllLabel}>Mark All:</Text>
              {(['present', 'absent', 'leave'] as AttendanceStatus[]).map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.markAllBtn,
                    {
                      backgroundColor: STATUS_CONFIG[s].bg,
                      borderColor: STATUS_CONFIG[s].color,
                    },
                  ]}
                  onPress={() => markAll(s)}
                >
                  <Text
                    style={[
                      styles.markAllBtnText,
                      { color: STATUS_CONFIG[s].color },
                    ]}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* List column headers */}
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Student</Text>
              <Text style={styles.listHeaderText}>P / A / L</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={[styles.submitBtn, submitted && styles.submitBtnDone]}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName={submitted ? 'checkmark-done' : 'send'}
              size={18}
              color="#fff"
            />
            <Text style={styles.submitText}>
              {submitted ? 'Attendance Submitted!' : 'Submit Attendance'}
            </Text>
          </TouchableOpacity>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default MarkAttendanceScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.lg, paddingBottom: 30 },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  dateText: { fontSize: 12, color: theme.colors.primary, fontWeight: '600' },

  classSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: theme.colors.primaryLight,
  },
  classSelectorText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  dropdown: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemActive: { backgroundColor: theme.colors.primaryLight },
  dropdownText: { fontSize: 14, color: theme.colors.textSecondary },
  dropdownTextActive: { color: theme.colors.primary, fontWeight: '600' },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: theme.spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  chipText: { fontSize: 12, fontWeight: '700' },

  markAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  markAllLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  markAllBtnText: { fontSize: 12, fontWeight: '600' },

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

  statusBtns: { flexDirection: 'row', gap: 6 },
  statusBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statusBtnText: { fontSize: 12, fontWeight: '700' },

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
