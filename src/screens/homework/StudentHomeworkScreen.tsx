import React, { useRef, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { Homework, HOMEWORK_STORE } from './homeworkData';

const PRIMARY = theme.colors.primary;

// Last 15 days ending today — today sits at the far right of the strip
const buildDays = (): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  for (let i = -14; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const toKey = (d: Date) => d.toISOString().slice(0, 10);

const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Homework card ────────────────────────────────────────────────────────────
const HWCard = ({
  hw,
  isCompleted,
  expanded,
  onToggleExpand,
  onToggleComplete,
}: {
  hw: Homework;
  isCompleted: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}) => (
  <View style={[s.hwCard, isCompleted && s.hwCardDone]}>
    {/* Left accent */}
    <View style={[s.hwAccent, { backgroundColor: isCompleted ? '#22C55E' : hw.subjectColor }]} />

    <View style={s.hwBody}>
      {/* Subject + teacher row */}
      <View style={s.hwTopRow}>
        <View style={[s.subjectBadge, { backgroundColor: hw.subjectColor + '20' }]}>
          <Text style={s.subjectIcon}>{hw.subjectIcon}</Text>
          <Text style={[s.subjectName, { color: hw.subjectColor }]}>{hw.subjectName}</Text>
        </View>
        <View style={s.teacherRow}>
          <VectorIcon iconSet="Ionicons" iconName="person-outline" size={13} color={theme.colors.textMuted} />
          <Text style={s.teacherName}>{hw.teacherName}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={[s.hwTitle, isCompleted && s.hwTitleDone]}>{hw.title}</Text>

      {/* View Homework dropdown */}
      <TouchableOpacity style={s.viewToggle} onPress={onToggleExpand} activeOpacity={0.7}>
        <Text style={s.viewToggleText}>{expanded ? 'Hide Homework' : 'View Homework'}</Text>
        <VectorIcon
          iconSet="Ionicons"
          iconName={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={PRIMARY}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={s.descBox}>
          <Text style={s.descText}>{hw.description}</Text>
        </View>
      )}

      {/* Mark as complete */}
      <TouchableOpacity
        style={[s.completeBtn, isCompleted && s.completeBtnDone]}
        onPress={onToggleComplete}
        activeOpacity={0.8}
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={16}
          color={isCompleted ? '#fff' : '#16A34A'}
        />
        <Text style={[s.completeBtnText, isCompleted && s.completeBtnTextDone]}>
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const StudentHomeworkScreen = ({ navigation }: any) => {
  const days = buildDays();
  const todayKey = toKey(new Date());
  const stripRef = useRef<ScrollView>(null);
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const homeworks: Homework[] = HOMEWORK_STORE.filter(h => h.dueDate === selectedKey);
  const pending   = homeworks.filter(h => !completedIds.includes(h.id));
  const completed = homeworks.filter(h => completedIds.includes(h.id));

  const toggleComplete = (id: string) =>
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );

  const selectedDate = new Date(selectedKey + 'T00:00:00');
  const listTitle =
    selectedKey === todayKey
      ? "Today's Homework"
      : `Homework · ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`;

  return (
    <SafeAreaView style={s.root}>
      <Header title="Homework" onBackPress={() => navigation.goBack()} />

      {/* ── Date strip (last 15 days, today at the end) ── */}
      <View style={s.dateStripWrap}>
        <View style={s.stripHeader}>
          <Text style={s.monthLabel}>
            {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <Text style={s.stripHint}>Last 15 days</Text>
        </View>
        <ScrollView
          ref={stripRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.dateStrip}
          onContentSizeChange={() => stripRef.current?.scrollToEnd({ animated: false })}
        >
          {days.map(d => {
            const key     = toKey(d);
            const active  = key === selectedKey;
            const isToday = key === todayKey;
            const hasHW   = HOMEWORK_STORE.some(h => h.dueDate === key);
            return (
              <TouchableOpacity
                key={key}
                style={[s.dateCell, active && s.dateCellActive]}
                onPress={() => setSelectedKey(key)}
                activeOpacity={0.8}
              >
                <Text style={[s.dateDayName, active && s.dateDayNameActive]}>
                  {isToday ? 'Today' : DAY_NAMES[d.getDay()]}
                </Text>
                <Text style={[s.dateNum, active && s.dateNumActive]}>
                  {d.getDate()}
                </Text>
                <Text style={[s.dateMonth, active && s.dateMonthActive]}>
                  {MONTH_NAMES[d.getMonth()]}
                </Text>
                {hasHW && <View style={[s.hwDot, active && s.hwDotActive]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Homework list ── */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.listHeader}>
          <Text style={s.listTitle}>{listTitle}</Text>
          <View style={s.countBadge}>
            <Text style={s.countText}>{homeworks.length} task{homeworks.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {homeworks.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon iconSet="Ionicons" iconName="checkmark-circle-outline" size={52} color={theme.colors.textMuted} />
            <Text style={s.emptyTitle}>No homework!</Text>
            <Text style={s.emptySubtitle}>Nothing assigned for this date.</Text>
          </View>
        ) : (
          <>
            {pending.map(hw => (
              <HWCard
                key={hw.id}
                hw={hw}
                isCompleted={false}
                expanded={expandedId === hw.id}
                onToggleExpand={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                onToggleComplete={() => toggleComplete(hw.id)}
              />
            ))}

            {pending.length === 0 && completed.length > 0 && (
              <View style={s.allDone}>
                <Text style={s.allDoneEmoji}>🎉</Text>
                <Text style={s.allDoneText}>All homework completed!</Text>
              </View>
            )}

            {completed.length > 0 && (
              <>
                <View style={s.completedHeader}>
                  <VectorIcon iconSet="Ionicons" iconName="checkmark-done-outline" size={16} color="#16A34A" />
                  <Text style={s.completedTitle}>Completed</Text>
                  <View style={s.completedBadge}>
                    <Text style={s.completedBadgeText}>{completed.length}</Text>
                  </View>
                </View>
                {completed.map(hw => (
                  <HWCard
                    key={hw.id}
                    hw={hw}
                    isCompleted
                    expanded={expandedId === hw.id}
                    onToggleExpand={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                    onToggleComplete={() => toggleComplete(hw.id)}
                  />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentHomeworkScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  // Date strip
  dateStripWrap: {
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    paddingTop: 10, paddingBottom: 14,
  },
  stripHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 10,
  },
  monthLabel: { fontSize: 13, fontWeight: '800', color: theme.colors.textSecondary },
  stripHint:  { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted },
  dateStrip: { paddingHorizontal: 12, gap: 8 },
  dateCell: {
    width: 56, alignItems: 'center', paddingVertical: 10, borderRadius: 16,
    backgroundColor: '#F1F5F9', gap: 2,
    borderWidth: 1, borderColor: 'transparent',
  },
  dateCellActive: {
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY, shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  dateDayName: { fontSize: 10, fontWeight: '700', color: theme.colors.textMuted, textTransform: 'uppercase' },
  dateDayNameActive: { color: 'rgba(255,255,255,0.85)' },
  dateNum: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  dateNumActive: { color: '#fff' },
  dateMonth: { fontSize: 10, fontWeight: '600', color: theme.colors.textMuted },
  dateMonthActive: { color: 'rgba(255,255,255,0.85)' },
  hwDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: PRIMARY, marginTop: 2 },
  hwDotActive: { backgroundColor: '#fff' },

  // List
  scroll: { padding: 16 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  listTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  countBadge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  countText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // HW card
  hwCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  hwCardDone: { opacity: 0.85 },
  hwAccent: { width: 5 },
  hwBody: { flex: 1, padding: 14 },
  hwTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  subjectBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  subjectIcon: { fontSize: 13 },
  subjectName: { fontSize: 12, fontWeight: '800' },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherName: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },
  hwTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 10 },
  hwTitleDone: { textDecorationLine: 'line-through', color: theme.colors.textSecondary },

  // View Homework dropdown
  viewToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 9, borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    marginBottom: 8,
  },
  viewToggleText: { fontSize: 12, fontWeight: '700', color: PRIMARY },
  descBox: {
    backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  descText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 },

  // Complete button
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 9, borderRadius: 10,
    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
  },
  completeBtnDone: { backgroundColor: '#22C55E', borderColor: '#22C55E' },
  completeBtnText: { fontSize: 12, fontWeight: '700', color: '#16A34A' },
  completeBtnTextDone: { color: '#fff' },

  // Completed section
  completedHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, marginBottom: 12,
  },
  completedTitle: { fontSize: 15, fontWeight: '900', color: '#16A34A' },
  completedBadge: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999,
  },
  completedBadgeText: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  allDone: { alignItems: 'center', paddingVertical: 18, gap: 4 },
  allDoneEmoji: { fontSize: 30 },
  allDoneText: { fontSize: 14, fontWeight: '700', color: '#16A34A' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },
});
