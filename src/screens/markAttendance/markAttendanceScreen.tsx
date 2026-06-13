import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AttendanceRecord,
  AttendanceStatus,
  CLASS_TEACHER_OF,
  CLASSES,
  ClassItem,
  DateItem,
  EDIT_WINDOW_DAYS,
  Student,
  STATUS_CONFIG,
  STATUS_ORDER,
  canEdit,
  daysSince,
  formatLong,
  getCounts,
  getDefaultStudents,
  getRecentDates,
  getRecord,
  saveRecord,
} from './markAttendanceData';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
import Header from '../../components/Header';

type Step = 'setup' | 'mark' | 'summary';
type Filter = 'all' | AttendanceStatus;

const RECENT_DATES = getRecentDates(7);

// ── Per-student P / A / L toggle ──
const StatusButtons = ({
  status,
  onChange,
  disabled,
}: {
  status: AttendanceStatus;
  onChange: (s: AttendanceStatus) => void;
  disabled?: boolean;
}) => (
  <View style={styles.statusBtns}>
    {STATUS_ORDER.map(st => {
      const active = status === st;
      const cfg = STATUS_CONFIG[st];
      return (
        <TouchableOpacity
          key={st}
          disabled={disabled}
          onPress={() => onChange(st)}
          activeOpacity={0.8}
          style={[
            styles.statusBtn,
            {
              backgroundColor: active ? cfg.bg : theme.colors.background,
              borderColor: active ? cfg.color : theme.colors.border,
              opacity: disabled && !active ? 0.4 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.statusBtnText,
              { color: active ? cfg.color : theme.colors.textMuted },
            ]}
          >
            {cfg.short}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const MarkAttendanceScreen = () => {
  const isClassTeacher = !!CLASS_TEACHER_OF;

  const [step, setStep] = useState<Step>('setup');
  const [selectedDate, setSelectedDate] = useState<string>(
    RECENT_DATES[RECENT_DATES.length - 1].iso,
  );
  const [selectedClass, setSelectedClass] = useState<ClassItem>(
    CLASS_TEACHER_OF ?? CLASSES[0],
  );
  const [classDropdown, setClassDropdown] = useState(false);
  const [students, setStudents] = useState<Student[]>(getDefaultStudents());
  const [filter, setFilter] = useState<Filter>('all');
  const [submitted, setSubmitted] = useState(false);

  const dateScrollRef = useRef<ScrollView>(null);

  const editable = canEdit(selectedDate);
  const counts = getCounts(students);

  const editNote = useMemo(() => {
    if (!editable) return `Edit window closed (after ${EDIT_WINDOW_DAYS} days)`;
    const left = EDIT_WINDOW_DAYS - daysSince(selectedDate);
    return `Editable for ${left} more day${left === 1 ? '' : 's'}`;
  }, [editable, selectedDate]);

  // ── Actions ──
  const setStatus = (id: string, status: AttendanceStatus) =>
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));

  const markAll = (status: AttendanceStatus) =>
    setStudents(prev => prev.map(s => ({ ...s, status })));

  const handleContinue = async () => {
    const record = await getRecord(selectedDate, selectedClass.id);
    if (record) {
      setStudents(
        getDefaultStudents().map(s => ({
          ...s,
          status: record.statuses[s.id] ?? 'present',
        })),
      );
      setSubmitted(true);
      setFilter('all');
      setStep('summary');
    } else {
      setStudents(getDefaultStudents());
      setSubmitted(false);
      setStep('mark');
    }
  };

  const handleSubmit = async () => {
    const statuses: Record<string, AttendanceStatus> = {};
    students.forEach(s => (statuses[s.id] = s.status));
    const record: AttendanceRecord = {
      date: selectedDate,
      classId: selectedClass.id,
      classLabel: selectedClass.label,
      statuses,
      submittedAt: new Date().toISOString(),
    };
    await saveRecord(record);
    setSubmitted(true);
    Alert.alert(
      'Attendance Submitted',
      `${selectedClass.label} · ${formatLong(selectedDate)}\nPresent ${counts.present} · Absent ${counts.absent} · Leave ${counts.leave}`,
    );
  };

  const resetToSetup = () => {
    setStep('setup');
    setSubmitted(false);
    setStudents(getDefaultStudents());
    setFilter('all');
  };

  // ── Info bar shown on mark / summary ──
  const InfoBar = () => (
    <View style={styles.infoBar}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="calendar-outline"
            size={16}
            color={theme.colors.primary}
          />
        </View>
        <View>
          <Text style={styles.infoDate}>{formatLong(selectedDate)}</Text>
          <Text style={styles.infoClass}>{selectedClass.label}</Text>
        </View>
      </View>
      <View
        style={[
          styles.editChip,
          { backgroundColor: editable ? '#DCFCE7' : '#FEE2E2' },
        ]}
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName={editable ? 'time-outline' : 'lock-closed'}
          size={11}
          color={editable ? theme.colors.success : theme.colors.danger}
        />
        <Text
          style={[
            styles.editChipText,
            { color: editable ? theme.colors.success : theme.colors.danger },
          ]}
        >
          {editNote}
        </Text>
      </View>
    </View>
  );

  // ── Step 1: Setup ──
  const renderSetup = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.setupBody}
    >
      <Text style={styles.sectionLabel}>Select Date</Text>
      <ScrollView
        ref={dateScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateStrip}
        onContentSizeChange={() =>
          dateScrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {RECENT_DATES.map((d: DateItem) => {
          const active = d.iso === selectedDate;
          const within = canEdit(d.iso);
          return (
            <TouchableOpacity
              key={d.iso}
              activeOpacity={0.85}
              onPress={() => setSelectedDate(d.iso)}
              style={[styles.dateCard, active && styles.dateCardActive]}
            >
              <Text
                style={[styles.dateWeekday, active && styles.dateTextActive]}
              >
                {d.weekday}
              </Text>
              <Text style={[styles.dateDay, active && styles.dateTextActive]}>
                {d.day}
              </Text>
              <Text
                style={[styles.dateMonth, active && styles.dateTextActive]}
              >
                {d.isToday ? 'Today' : d.month}
              </Text>
              {within && <View style={styles.dateDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionLabel}>Class & Section</Text>
      {isClassTeacher ? (
        <View style={styles.assignedCard}>
          <View style={styles.assignedIcon}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="ribbon-outline"
              size={18}
              color={theme.colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.assignedLabel}>You are the class teacher of</Text>
            <Text style={styles.assignedClass}>{CLASS_TEACHER_OF!.label}</Text>
          </View>
          <View style={styles.assignedBadge}>
            <Text style={styles.assignedBadgeText}>Assigned</Text>
          </View>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.classSelector}
            onPress={() => setClassDropdown(v => !v)}
            activeOpacity={0.85}
          >
            <View style={styles.classSelectorLeft}>
              <View style={styles.infoIcon}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="people-outline"
                  size={16}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.classSelectorText}>
                {selectedClass.label}
              </Text>
            </View>
            <VectorIcon
              iconSet="Ionicons"
              iconName={classDropdown ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
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
                      size={15}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.85}
        onPress={handleContinue}
      >
        <Text style={styles.primaryBtnText}>Load Students</Text>
        <VectorIcon
          iconSet="Ionicons"
          iconName="arrow-forward"
          size={18}
          color="#fff"
        />
      </TouchableOpacity>
    </ScrollView>
  );

  // ── Step 2: Mark ──
  const renderMark = () => (
    <FlatList
      data={students}
      keyExtractor={i => i.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rollNo}>{item.rollNo}</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={styles.studentName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <StatusButtons
            status={item.status}
            onChange={s => setStatus(item.id, s)}
          />
        </View>
      )}
      ListHeaderComponent={
        <>
          <InfoBar />
          <View style={styles.markAllRow}>
            <Text style={styles.markAllLabel}>Mark all:</Text>
            {STATUS_ORDER.map(st => (
              <TouchableOpacity
                key={st}
                style={[
                  styles.markAllBtn,
                  {
                    backgroundColor: STATUS_CONFIG[st].bg,
                    borderColor: STATUS_CONFIG[st].color,
                  },
                ]}
                onPress={() => markAll(st)}
              >
                <Text
                  style={[
                    styles.markAllBtnText,
                    { color: STATUS_CONFIG[st].color },
                  ]}
                >
                  {STATUS_CONFIG[st].full}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>Student</Text>
            <Text style={styles.listHeaderText}>P / A / L</Text>
          </View>
        </>
      }
      ListFooterComponent={
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => {
            setFilter('all');
            setStep('summary');
          }}
        >
          <Text style={styles.primaryBtnText}>Review Summary</Text>
          <VectorIcon
            iconSet="Ionicons"
            iconName="arrow-forward"
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      }
    />
  );

  // ── Step 3: Summary / review (+ edit within window) ──
  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: students.length },
    { key: 'present', label: 'Present', count: counts.present },
    { key: 'absent', label: 'Absent', count: counts.absent },
    { key: 'leave', label: 'Leave', count: counts.leave },
  ];

  const filtered =
    filter === 'all' ? students : students.filter(s => s.status === filter);

  const renderSummary = () => (
    <FlatList
      data={filtered}
      keyExtractor={i => i.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const cfg = STATUS_CONFIG[item.status];
        return (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rollNo}>{item.rollNo}</Text>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <Text style={styles.studentName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            {editable ? (
              <StatusButtons
                status={item.status}
                onChange={s => setStatus(item.id, s)}
              />
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statusBadgeText, { color: cfg.color }]}>
                  {cfg.full}
                </Text>
              </View>
            )}
          </View>
        );
      }}
      ListHeaderComponent={
        <>
          {submitted && (
            <View style={styles.successBanner}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-circle"
                size={16}
                color={theme.colors.success}
              />
              <Text style={styles.successText}>
                Attendance submitted{editable ? ' · you can still edit' : ''}
              </Text>
            </View>
          )}
          <InfoBar />

          {/* Present / Absent / Leave totals */}
          <View style={styles.statRow}>
            {STATUS_ORDER.map(st => (
              <View
                key={st}
                style={[styles.statCard, { backgroundColor: STATUS_CONFIG[st].bg }]}
              >
                <Text
                  style={[styles.statNum, { color: STATUS_CONFIG[st].color }]}
                >
                  {counts[st]}
                </Text>
                <Text
                  style={[styles.statLabel, { color: STATUS_CONFIG[st].color }]}
                >
                  {STATUS_CONFIG[st].full}
                </Text>
              </View>
            ))}
          </View>

          {/* Filter tabs */}
          <View style={styles.filterRow}>
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterTab, active && styles.filterTabActive]}
                  activeOpacity={0.8}
                  onPress={() => setFilter(f.key)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      active && styles.filterTabTextActive,
                    ]}
                  >
                    {f.label} {f.count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      }
      ListEmptyComponent={
        <Text style={styles.empty}>No students in this filter.</Text>
      }
      ListFooterComponent={
        <View style={styles.footerCol}>
          {editable ? (
            <TouchableOpacity
              style={[styles.primaryBtn, submitted && styles.primaryBtnDone]}
              activeOpacity={0.85}
              onPress={handleSubmit}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName={submitted ? 'checkmark-done' : 'send'}
                size={18}
                color="#fff"
              />
              <Text style={styles.primaryBtnText}>
                {submitted ? 'Update Attendance' : 'Submit Attendance'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.lockedBox}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="lock-closed-outline"
                size={16}
                color={theme.colors.textMuted}
              />
              <Text style={styles.lockedText}>
                This attendance can no longer be edited.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => (submitted ? resetToSetup() : setStep('mark'))}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName={submitted ? 'add-circle-outline' : 'arrow-back'}
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.secondaryBtnText}>
              {submitted ? 'Mark Another Day' : 'Back to List'}
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );

  // ── Step indicator ──
  const STEPS: { key: Step; label: string }[] = [
    { key: 'setup', label: 'Setup' },
    { key: 'mark', label: 'Mark' },
    { key: 'summary', label: 'Review' },
  ];
  const activeIndex = STEPS.findIndex(s => s.key === step);

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Mark Attendance" />

      <View style={styles.stepper}>
        {STEPS.map((stp, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <React.Fragment key={stp.key}>
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.stepCircle,
                    active && styles.stepCircleActive,
                    done && styles.stepCircleDone,
                  ]}
                >
                  {done ? (
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="checkmark"
                      size={13}
                      color="#fff"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.stepNum,
                        active && styles.stepNumActive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[styles.stepLabel, active && styles.stepLabelActive]}
                >
                  {stp.label}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View
                  style={[styles.stepLine, i < activeIndex && styles.stepLineDone]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {step === 'setup' && renderSetup()}
      {step === 'mark' && renderMark()}
      {step === 'summary' && renderSummary()}
    </KeyboardAvoidingView>
  );
};

export default MarkAttendanceScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stepNode: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  stepCircleDone: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  stepNum: { fontSize: 12, fontWeight: '800', color: theme.colors.textMuted },
  stepNumActive: { color: theme.colors.primary },
  stepLabel: { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted },
  stepLabelActive: { color: theme.colors.primary, fontWeight: '700' },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  stepLineDone: { backgroundColor: theme.colors.success },

  // Setup
  setupBody: { padding: theme.spacing.lg, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
    marginTop: 6,
  },
  dateStrip: { gap: 10, paddingBottom: 4 },
  dateCard: {
    width: 62,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    gap: 2,
  },
  dateCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dateWeekday: { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted },
  dateDay: { fontSize: 20, fontWeight: '900', color: theme.colors.textPrimary },
  dateMonth: { fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary },
  dateTextActive: { color: '#fff' },
  dateDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
    marginTop: 2,
  },

  assignedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    padding: 14,
  },
  assignedIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignedLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
  assignedClass: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 1,
  },
  assignedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  assignedBadgeText: { fontSize: 10, fontWeight: '800', color: theme.colors.success },

  classSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  classSelectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  classSelectorText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dropdown: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 6,
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
  dropdownTextActive: { color: theme.colors.primary, fontWeight: '700' },

  // Info bar
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoDate: { fontSize: 13, fontWeight: '800', color: theme.colors.textPrimary },
  infoClass: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 1 },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  editChipText: { fontSize: 10, fontWeight: '700' },

  // Lists
  list: { paddingHorizontal: theme.spacing.lg, paddingBottom: 40 },
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
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },
  markAllBtnText: { fontSize: 11, fontWeight: '700' },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 4,
  },
  listHeaderText: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },

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

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },

  // Summary
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: theme.spacing.md,
  },
  successText: { fontSize: 12, fontWeight: '700', color: theme.colors.success },

  statRow: { flexDirection: 'row', gap: 10, marginBottom: theme.spacing.md },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNum: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: theme.spacing.sm },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  filterTabTextActive: { color: '#fff' },

  empty: { textAlign: 'center', color: theme.colors.textMuted, paddingVertical: 30 },

  // Footer / buttons
  footerCol: { marginTop: theme.spacing.lg, gap: 10 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.lg,
  },
  primaryBtnDone: { backgroundColor: theme.colors.success },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  secondaryBtnText: { color: theme.colors.primary, fontWeight: '700', fontSize: 14 },

  lockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 13,
  },
  lockedText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },
});
