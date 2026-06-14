import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  AttendanceStatus,
  DateItem,
  STATUS_CONFIG,
  STATUS_ORDER,
  formatLong,
  getRecentDates,
} from './markAttendanceData';
import {
  attendanceErrorMessage,
  getStudentsForAttendance,
  markHoliday,
  submitAttendance,
  type AttendanceClass,
  type AttendanceStudent,
} from '../../api/attendanceApi';
import { theme } from '../../utils/theme';
import VectorIcon from '../../components/VectorIcon';
import Header from '../../components/Header';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';

type Step = 'setup' | 'mark' | 'summary';
type Filter = 'all' | AttendanceStatus;

interface MarkStudent {
  id: number; // student_detail_id
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

// Teachers may only mark today + the previous 2 days.
const RECENT_DATES = getRecentDates(3);

// Map the server's per-student attendance into the UI's P/A/L model.
// Leave is stored on a binary backend as absent + a "Leave" remark.
const mapStatus = (a: AttendanceStudent['attendance']): AttendanceStatus => {
  const remark = (a?.remarks || '').toLowerCase();
  if (remark.includes('leave')) return 'leave';
  if (a?.status === 'absent') return 'absent';
  return 'present'; // present / not_marked default to present
};

const countByStatus = (students: MarkStudent[]) =>
  students.reduce(
    (acc, s) => {
      acc[s.status]++;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 } as Record<AttendanceStatus, number>,
  );

// ── Per-student P / A / L toggle ──
const StatusButtons = ({
  status,
  onChange,
}: {
  status: AttendanceStatus;
  onChange: (s: AttendanceStatus) => void;
}) => (
  <View style={styles.statusBtns}>
    {STATUS_ORDER.map(st => {
      const active = status === st;
      const cfg = STATUS_CONFIG[st];
      return (
        <TouchableOpacity
          key={st}
          onPress={() => onChange(st)}
          activeOpacity={0.8}
          style={[
            styles.statusBtn,
            {
              backgroundColor: active ? cfg.bg : theme.colors.background,
              borderColor: active ? cfg.color : theme.colors.border,
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
  const [step, setStep] = useState<Step>('setup');
  const [selectedDate, setSelectedDate] = useState<string>(
    RECENT_DATES[RECENT_DATES.length - 1].iso,
  );

  const [classes, setClasses] = useState<AttendanceClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<MarkStudent[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [markingHoliday, setMarkingHoliday] = useState(false);

  const counts = countByStatus(students);

  const selectedClass = useMemo(
    () => classes.find(c => c.assignment_id === selectedClassId) ?? null,
    [classes, selectedClassId],
  );

  // ── Load the teacher's classes + students for the chosen date ──
  const loadClasses = useCallback(async (date: string) => {
    setLoadingClasses(true);
    setError(null);
    try {
      const res = await getStudentsForAttendance(date);
      const list = res?.classes ?? [];
      setClasses(list);
      setSelectedClassId(prev => {
        const stillThere = list.some(c => c.assignment_id === prev);
        return stillThere ? prev : list[0]?.assignment_id ?? null;
      });
    } catch (e: any) {
      console.log('[getStudentsForAttendance] Error:', e?.response?.status, e?.message);
      setError(attendanceErrorMessage(e));
      setClasses([]);
      setSelectedClassId(null);
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  useEffect(() => {
    loadClasses(selectedDate);
  }, [selectedDate, loadClasses]);

  const { refreshing, onRefresh } = useRefresh(() => loadClasses(selectedDate));

  // ── Actions ──
  const setStatus = (id: number, status: AttendanceStatus) =>
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));

  const markAll = (status: AttendanceStatus) =>
    setStudents(prev => prev.map(s => ({ ...s, status })));

  const handleContinue = () => {
    if (!selectedClass) return;
    setStudents(
      selectedClass.students.map(st => ({
        id: st.student_id,
        rollNo: String(st.roll_no ?? ''),
        name: st.full_name,
        status: mapStatus(st.attendance),
      })),
    );
    setSubmitted(false);
    setFilter('all');
    setStep('mark');
  };

  const handleSubmit = async () => {
    if (!students.length) return;
    setSubmitting(true);
    try {
      const attendances = students.map(s => ({
        student_detail_id: s.id,
        status: s.status === 'present',
        remarks: s.status === 'leave' ? 'Leave' : null,
      }));
      await submitAttendance(selectedDate, attendances);
      setSubmitted(true);
      Alert.alert(
        'Attendance Submitted',
        `${selectedClass?.class_info.class_display ?? ''} · ${formatLong(
          selectedDate,
        )}\nPresent ${counts.present} · Absent ${counts.absent} · Leave ${counts.leave}`,
      );
    } catch (e: any) {
      Alert.alert('Submit failed', attendanceErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHoliday = () => {
    if (!selectedClass) return;
    Alert.alert(
      'Mark as Holiday',
      `Mark ${formatLong(selectedDate)} as a holiday for ${
        selectedClass.class_info.class_display
      }?\nEvery student in this class will be set to Holiday for this date.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Holiday',
          style: 'destructive',
          onPress: async () => {
            setMarkingHoliday(true);
            try {
              const res = await markHoliday(
                selectedDate,
                selectedClass.class_info.standard_id,
                selectedClass.class_info.section_id,
              );
              Alert.alert(
                'Holiday Marked',
                `${res.marked_students} student${
                  res.marked_students === 1 ? '' : 's'
                } marked as holiday for ${formatLong(selectedDate)}.`,
              );
              loadClasses(selectedDate);
            } catch (e: any) {
              Alert.alert('Failed', attendanceErrorMessage(e));
            } finally {
              setMarkingHoliday(false);
            }
          },
        },
      ],
    );
  };

  const resetToSetup = () => {
    setStep('setup');
    setSubmitted(false);
    setStudents([]);
    setFilter('all');
    loadClasses(selectedDate);
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
          <Text style={styles.infoClass}>
            {selectedClass?.class_info.class_display ?? ''}
          </Text>
        </View>
      </View>
      <View style={[styles.editChip, { backgroundColor: theme.colors.primaryLight }]}>
        <VectorIcon
          iconSet="Ionicons"
          iconName="people-outline"
          size={11}
          color={theme.colors.primary}
        />
        <Text style={[styles.editChipText, { color: theme.colors.primary }]}>
          {students.length} students
        </Text>
      </View>
    </View>
  );

  // ── Step 1: Setup ──
  const renderSetup = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.setupBody}
      refreshControl={
        <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Window note (announcement-style banner) */}
      <View style={styles.noteBar}>
        <VectorIcon
          iconSet="Ionicons"
          iconName="information-circle-outline"
          size={16}
          color={theme.colors.primary}
        />
        <Text style={styles.noteText}>
          You can mark attendance for today and the previous 2 days only.
        </Text>
      </View>

      {/* Date card */}
      <View style={styles.setupCard}>
        <View style={[styles.cardAccent, { backgroundColor: theme.colors.primary }]} />
        <View style={styles.setupCardInner}>
          <Text style={styles.setupCardTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateStrip}
          >
            {RECENT_DATES.map((d: DateItem) => {
              const active = d.iso === selectedDate;
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
                  <Text style={[styles.dateMonth, active && styles.dateTextActive]}>
                    {d.isToday ? 'Today' : d.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Class card */}
      <View style={styles.setupCard}>
        <View style={[styles.cardAccent, { backgroundColor: theme.colors.success }]} />
        <View style={styles.setupCardInner}>
          <Text style={styles.setupCardTitle}>Class & Section</Text>

          {loadingClasses ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="cloud-offline-outline"
                size={26}
                color={theme.colors.danger}
              />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => loadClasses(selectedDate)}
                activeOpacity={0.85}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : classes.length === 0 ? (
            <View style={styles.errorBox}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="people-outline"
                size={26}
                color={theme.colors.textMuted}
              />
              <Text style={styles.errorText}>
                No classes are assigned to you. Please contact the administrator.
              </Text>
            </View>
          ) : (
            <View style={styles.dropdown}>
              {classes.map(c => {
                const active = c.assignment_id === selectedClassId;
                return (
                  <TouchableOpacity
                    key={c.assignment_id}
                    style={[
                      styles.dropdownItem,
                      active && styles.dropdownItemActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedClassId(c.assignment_id)}
                  >
                    <View style={styles.classRowLeft}>
                      <View style={styles.infoIcon}>
                        <VectorIcon
                          iconSet="Ionicons"
                          iconName="people-outline"
                          size={16}
                          color={theme.colors.primary}
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.dropdownText,
                            active && styles.dropdownTextActive,
                          ]}
                        >
                          {c.class_info.class_display}
                        </Text>
                        <Text style={styles.classMeta}>
                          {c.total_students} students
                        </Text>
                      </View>
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
              })}
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={[
          styles.primaryBtn,
          (!selectedClass || loadingClasses) && styles.primaryBtnDisabled,
        ]}
        activeOpacity={0.85}
        disabled={!selectedClass || loadingClasses}
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

      <TouchableOpacity
        style={[
          styles.holidayBtn,
          (!selectedClass || markingHoliday) && styles.primaryBtnDisabled,
        ]}
        activeOpacity={0.85}
        disabled={!selectedClass || markingHoliday}
        onPress={handleMarkHoliday}
      >
        {markingHoliday ? (
          <ActivityIndicator size="small" color={STATUS_CONFIG.leave.color} />
        ) : (
          <VectorIcon
            iconSet="Ionicons"
            iconName="sunny-outline"
            size={18}
            color={STATUS_CONFIG.leave.color}
          />
        )}
        <Text style={styles.holidayBtnText}>Mark as Holiday</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ── Step 2: Mark ──
  const renderMark = () => (
    <FlatList
      data={students}
      keyExtractor={i => String(i.id)}
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
                  style={[styles.markAllBtnText, { color: STATUS_CONFIG[st].color }]}
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
      ListEmptyComponent={
        <Text style={styles.empty}>No students in this class.</Text>
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

  // ── Step 3: Summary / review ──
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
      keyExtractor={i => String(i.id)}
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
          {submitted && (
            <View style={styles.successBanner}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-circle"
                size={16}
                color={theme.colors.success}
              />
              <Text style={styles.successText}>
                Attendance submitted · you can still edit
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
                <Text style={[styles.statNum, { color: STATUS_CONFIG[st].color }]}>
                  {counts[st]}
                </Text>
                <Text style={[styles.statLabel, { color: STATUS_CONFIG[st].color }]}>
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
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              submitted && styles.primaryBtnDone,
              submitting && styles.primaryBtnDisabled,
            ]}
            activeOpacity={0.85}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <VectorIcon
                iconSet="Ionicons"
                iconName={submitted ? 'checkmark-done' : 'send'}
                size={18}
                color="#fff"
              />
            )}
            <Text style={styles.primaryBtnText}>
              {submitting
                ? 'Submitting…'
                : submitted
                ? 'Update Attendance'
                : 'Submit Attendance'}
            </Text>
          </TouchableOpacity>

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
                    <Text style={[styles.stepNum, active && styles.stepNumActive]}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
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

  // Announcement-style note banner
  noteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: theme.spacing.md,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Accent-bar cards (attendance template)
  setupCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    elevation: 1,
  },
  cardAccent: { height: 4, width: '100%' },
  setupCardInner: { padding: theme.spacing.md },
  setupCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
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

  centerBox: { paddingVertical: 30, alignItems: 'center' },
  errorBox: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryBtn: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 2,
  },
  retryText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },

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
  classRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  classMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 1 },
  dropdownText: { fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary },
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
  primaryBtnDisabled: { opacity: 0.5 },
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

  holidayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: STATUS_CONFIG.leave.color,
    backgroundColor: STATUS_CONFIG.leave.bg,
  },
  holidayBtnText: {
    color: STATUS_CONFIG.leave.color,
    fontWeight: '700',
    fontSize: 14,
  },
});
