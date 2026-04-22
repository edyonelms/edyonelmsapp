import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { DAYS, STUDENT_TIMETABLE } from './timetableData';
import type { Day, StudentPeriod } from './timetableData';

const NAVY = '#1B2A4A';

// ─── Day Pill ─────────────────────────────────────────────────────────────────
const DayPill = ({
  day,
  active,
  onPress,
}: {
  day: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[s.dayPill, active && s.dayPillActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[s.dayPillText, active && s.dayPillTextActive]}>
      {day.slice(0, 3)}
    </Text>
  </TouchableOpacity>
);

// ─── Period Card ──────────────────────────────────────────────────────────────
const PeriodCard = ({
  period,
  index,
}: {
  period: StudentPeriod;
  index: number;
}) => {
  const isBreak = period.type === 'break';
  const isFree = period.type === 'free';

  if (isBreak) {
    return (
      <View style={s.breakRow}>
        <View style={s.breakLine} />
        <View style={s.breakPill}>
          <Text style={s.breakEmoji}>{period.icon}</Text>
          <Text style={s.breakText}>{period.subject}</Text>
          <Text style={s.breakTime}>
            {period.time} – {period.endTime}
          </Text>
        </View>
        <View style={s.breakLine} />
      </View>
    );
  }

  return (
    <View style={s.periodWrap}>
      {/* Timeline dot & line */}
      <View style={s.timeline}>
        <View style={[s.timelineDot, { backgroundColor: period.color }]} />
        {index <
          STUDENT_TIMETABLE[Object.keys(STUDENT_TIMETABLE)[0] as Day].length -
            1 && (
          <View
            style={[s.timelineLine, { backgroundColor: period.color + '30' }]}
          />
        )}
      </View>

      {/* Card */}
      <View style={[s.periodCard, { borderLeftColor: period.color }]}>
        {/* Time badge */}
        <View style={s.periodTimeRow}>
          <View style={[s.timeBadge, { backgroundColor: period.color + '18' }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="time-outline"
              size={11}
              color={period.color}
            />
            <Text style={[s.timeBadgeText, { color: period.color }]}>
              {period.time} – {period.endTime}
            </Text>
          </View>
          {isFree && (
            <View style={s.freeBadge}>
              <Text style={s.freeBadgeText}>Free</Text>
            </View>
          )}
        </View>

        <View style={s.periodBody}>
          {/* Icon */}
          <View style={[s.periodIconBox, { backgroundColor: period.bg }]}>
            <Text style={s.periodEmoji}>{period.icon}</Text>
          </View>

          {/* Info */}
          <View style={s.periodInfo}>
            <Text style={s.periodSubject}>{period.subject}</Text>
            {!isFree && (
              <>
                <View style={s.periodMetaRow}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="person-outline"
                    size={12}
                    color={theme.colors.textMuted}
                  />
                  <Text style={s.periodMeta}>{period.teacher}</Text>
                </View>
                <View style={s.periodMetaRow}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="location-outline"
                    size={12}
                    color={theme.colors.textMuted}
                  />
                  <Text style={s.periodMeta}>{period.room}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const StudentTimetableScreen = ({ navigation }: any) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  }) as Day;
  const defaultDay: Day = DAYS.includes(today as Day)
    ? (today as Day)
    : 'Monday';
  const [selectedDay, setSelectedDay] = useState<Day>(defaultDay);

  const periods = STUDENT_TIMETABLE[selectedDay];
  const classPeriods = periods.filter(p => p.type === 'class').length;

  return (
    <View style={s.root}>
      <Header title="Timetable" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Day selector ── */}
        <View style={s.daySelector}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.daySelectorInner}
          >
            {DAYS.map(day => (
              <DayPill
                key={day}
                day={day}
                active={selectedDay === day}
                onPress={() => setSelectedDay(day)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Day header ── */}
        <View style={s.dayHeader}>
          <View>
            <Text style={s.dayHeaderTitle}>{selectedDay}</Text>
            <Text style={s.dayHeaderSub}>{classPeriods} classes today</Text>
          </View>
          <View style={s.dayHeaderBadge}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="calendar-outline"
              size={14}
              color={NAVY}
            />
            <Text style={s.dayHeaderBadgeText}>{periods.length} periods</Text>
          </View>
        </View>

        {/* ── Periods ── */}
        <View style={s.periodsWrap}>
          {periods.map((period, i) => (
            <PeriodCard key={period.id} period={period} index={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentTimetableScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4FF' },
  scroll: { padding: 16, paddingBottom: 32 },

  // Day selector
  daySelector: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  daySelectorInner: { paddingHorizontal: 10, paddingVertical: 10, gap: 8 },
  dayPill: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
  },
  dayPillActive: { backgroundColor: NAVY },
  dayPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  dayPillTextActive: { color: '#fff' },

  // Day header
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayHeaderTitle: { fontSize: 20, fontWeight: '900', color: NAVY },
  dayHeaderSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  dayHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayHeaderBadgeText: { fontSize: 12, fontWeight: '700', color: NAVY },

  // Periods
  periodsWrap: { gap: 0 },

  // Timeline
  periodWrap: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  timeline: { alignItems: 'center', width: 16, paddingTop: 18 },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 4,
    borderRadius: 1,
    minHeight: 20,
  },

  // Period card
  periodCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  periodTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeText: { fontSize: 11, fontWeight: '700' },
  freeBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  freeBadgeText: { fontSize: 10, fontWeight: '700', color: '#8B5CF6' },

  periodBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  periodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodEmoji: { fontSize: 22 },
  periodInfo: { flex: 1, gap: 3 },
  periodSubject: { fontSize: 15, fontWeight: '800', color: NAVY },
  periodMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  periodMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  // Break
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  breakLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  breakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  breakEmoji: { fontSize: 13 },
  breakText: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted },
  breakTime: { fontSize: 10, color: theme.colors.textMuted },
});
