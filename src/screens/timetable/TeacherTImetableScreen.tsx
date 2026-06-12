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
import { DAYS, TEACHER_TIMETABLE } from './timetableData';
import type { Day, TeacherPeriod } from './timetableData';

// ─── Period Row ───────────────────────────────────────────────────────────────
const PeriodRow = ({
  period,
  isLast,
}: {
  period: TeacherPeriod;
  isLast: boolean;
}) => {
  const isFree = period.type === 'free';

  return (
    <View style={[s.periodRow, !isLast && s.rowBorder]}>
      <View style={[s.periodIcon, { backgroundColor: period.bg }]}>
        <Text style={s.periodEmoji}>{period.icon}</Text>
      </View>

      <View style={s.periodInfo}>
        <Text style={s.periodSubject}>{period.subject}</Text>
        {isFree ? (
          <Text style={s.periodMeta}>Free Period</Text>
        ) : (
          <View style={s.metaRow}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="people-outline"
              size={11}
              color={theme.colors.textMuted}
            />
            <Text style={s.periodMeta}>
              Class {period.class} – {period.section}
            </Text>
            <Text style={s.metaDot}>·</Text>
            <VectorIcon
              iconSet="Ionicons"
              iconName="location-outline"
              size={11}
              color={theme.colors.textMuted}
            />
            <Text style={s.periodMeta}>{period.room}</Text>
          </View>
        )}
      </View>

      <View style={[s.timeBadge, { backgroundColor: period.color + '18' }]}>
        <Text style={[s.timeBadgeText, { color: period.color }]}>
          {period.time}
        </Text>
        <Text style={[s.timeBadgeSub, { color: period.color }]}>
          {period.endTime}
        </Text>
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TeacherTImetableScreen = ({ navigation }: any) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  }) as Day;
  const defaultDay: Day = DAYS.includes(today as Day)
    ? (today as Day)
    : 'Monday';
  const [selectedDay, setSelectedDay] = useState<Day>(defaultDay);

  const periods = TEACHER_TIMETABLE[selectedDay];
  const classPeriods = periods.filter(p => p.type === 'class').length;

  return (
    <View style={s.root}>
      <Header title="Timetable" onBackPress={() => navigation.goBack()} />

      {/* ── Day selector ── */}
      <View style={s.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {DAYS.map(day => {
            const active = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[s.filterBtn, active && s.filterBtnActive]}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.8}
              >
                <Text style={[s.filterText, active && s.filterTextActive]}>
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Single day card ── */}
        <View style={s.card}>
          <View style={[s.accentBar, { backgroundColor: theme.colors.primary }]} />
          <View style={s.cardInner}>
            <View style={s.cardTop}>
              <View style={s.iconWrap}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="school-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{selectedDay}</Text>
                <Text style={s.cardSubtitle}>
                  {classPeriods} class{classPeriods !== 1 ? 'es' : ''} to teach
                  · {periods.length} periods
                </Text>
              </View>
            </View>

            <View style={s.divider} />

            {periods.length === 0 ? (
              <View style={s.empty}>
                <Text style={{ fontSize: 40 }}>🎉</Text>
                <Text style={s.emptyTitle}>No Classes Today!</Text>
                <Text style={s.emptySub}>Enjoy your free day.</Text>
              </View>
            ) : (
              periods.map((period, i) => (
                <PeriodRow
                  key={period.id}
                  period={period}
                  isLast={i === periods.length - 1}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TeacherTImetableScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingBottom: 32 },

  // Day selector (exam-style filter chips)
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: 8,
    alignItems: 'center',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterTextActive: { color: '#fff' },

  // Card (transport template)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 12,
  },

  // Period row
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  periodIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodEmoji: { fontSize: 18 },
  periodInfo: { flex: 1, gap: 3 },
  periodSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  metaDot: { fontSize: 12, color: theme.colors.textMuted },
  periodMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  timeBadge: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 76,
  },
  timeBadgeText: { fontSize: 11, fontWeight: '800' },
  timeBadgeSub: { fontSize: 10, fontWeight: '600', opacity: 0.7, marginTop: 1 },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  emptySub: { fontSize: 13, color: theme.colors.textMuted },
});
