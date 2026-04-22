import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { Homework, HOMEWORK_STORE } from './homeworkData';

const PRIMARY = theme.colors.primary;

// Build a 14-day window centred on today
const buildDays = (): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  for (let i = -3; i <= 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const toKey = (d: Date) => d.toISOString().slice(0, 10);

const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StudentHomeworkScreen = ({ navigation }: any) => {
  const days = buildDays();
  const todayKey = toKey(new Date());
  const [selectedKey, setSelectedKey] = useState(todayKey);

  const homeworks: Homework[] = HOMEWORK_STORE.filter(h => h.dueDate === selectedKey);

  const selectedDate = new Date(selectedKey + 'T00:00:00');

  return (
    <SafeAreaView style={s.root}>
      <Header title="Homework" onBackPress={() => navigation.goBack()} />

      {/* ── Date strip ── */}
      <View style={s.dateStripWrap}>
        <Text style={s.monthLabel}>
          {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.dateStrip}
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
                  {DAY_NAMES[d.getDay()]}
                </Text>
                <Text style={[s.dateNum, active && s.dateNumActive]}>
                  {d.getDate()}
                </Text>
                {isToday && !active && <View style={s.todayDot} />}
                {hasHW && <View style={[s.hwDot, active && s.hwDotActive]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Homework list ── */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.listHeader}>
          <Text style={s.listTitle}>
            {selectedKey === todayKey ? "Today's Homework" : `Homework · ${selectedKey}`}
          </Text>
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
          homeworks.map(hw => (
            <View key={hw.id} style={s.hwCard}>
              {/* Left accent */}
              <View style={[s.hwAccent, { backgroundColor: hw.subjectColor }]} />

              <View style={s.hwBody}>
                {/* Subject + time row */}
                <View style={s.hwTopRow}>
                  <View style={[s.subjectBadge, { backgroundColor: hw.subjectColor + '20' }]}>
                    <Text style={s.subjectIcon}>{hw.subjectIcon}</Text>
                    <Text style={[s.subjectName, { color: hw.subjectColor }]}>{hw.subjectName}</Text>
                  </View>
                  <View style={s.timeBadge}>
                    <VectorIcon iconSet="Ionicons" iconName="time-outline" size={12} color={theme.colors.textMuted} />
                    <Text style={s.timeText}>{hw.createdAt}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={s.hwTitle}>{hw.title}</Text>

                {/* Description */}
                <Text style={s.hwDesc}>{hw.description}</Text>

                {/* Teacher + due */}
                <View style={s.hwFooter}>
                  <View style={s.teacherRow}>
                    <VectorIcon iconSet="Ionicons" iconName="person-outline" size={13} color={theme.colors.textMuted} />
                    <Text style={s.teacherName}>{hw.teacherName}</Text>
                  </View>
                  <View style={s.dueBadge}>
                    <VectorIcon iconSet="Ionicons" iconName="calendar-outline" size={12} color={hw.subjectColor} />
                    <Text style={[s.dueText, { color: hw.subjectColor }]}>Due {hw.dueDate}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
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
    paddingTop: 10, paddingBottom: 12,
  },
  monthLabel: {
    fontSize: 13, fontWeight: '800', color: theme.colors.textSecondary,
    paddingHorizontal: 16, marginBottom: 8,
  },
  dateStrip: { paddingHorizontal: 12, gap: 6 },
  dateCell: {
    width: 52, alignItems: 'center', paddingVertical: 8, borderRadius: 14,
    backgroundColor: '#F1F5F9', gap: 2,
  },
  dateCellActive: { backgroundColor: PRIMARY },
  dateDayName: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted },
  dateDayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dateNum: { fontSize: 17, fontWeight: '900', color: theme.colors.textPrimary },
  dateNumActive: { color: '#fff' },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: PRIMARY },
  hwDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: theme.colors.textMuted },
  hwDotActive: { backgroundColor: 'rgba(255,255,255,0.7)' },

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
  hwAccent: { width: 5 },
  hwBody: { flex: 1, padding: 14 },
  hwTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  subjectBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  subjectIcon: { fontSize: 13 },
  subjectName: { fontSize: 12, fontWeight: '800' },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  hwTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 5 },
  hwDesc: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginBottom: 10 },
  hwFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  teacherName: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '600' },
  dueBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dueText: { fontSize: 12, fontWeight: '700' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },
});
