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
const PeriodCard = ({ period }: { period: TeacherPeriod }) => {
  const isFree = period.type === 'free';

  return (
    <View style={[s.card, { borderLeftColor: period.color }]}>
      {/* Time row */}
      <View style={s.cardTimeRow}>
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
        {isFree ? (
          <View style={s.freeBadge}>
            <Text style={s.freeBadgeText}>Free Period</Text>
          </View>
        ) : (
          <View
            style={[s.classBadge, { backgroundColor: period.color + '18' }]}
          >
            <Text style={[s.classBadgeText, { color: period.color }]}>
              Class {period.class} · {period.section}
            </Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={s.cardBody}>
        <View style={[s.iconBox, { backgroundColor: period.bg }]}>
          <Text style={s.iconEmoji}>{period.icon}</Text>
        </View>

        <View style={s.cardInfo}>
          <Text style={s.subjectText}>{period.subject}</Text>
          {!isFree && (
            <View style={s.metaGrid}>
              <View style={s.metaItem}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="people-outline"
                  size={12}
                  color={theme.colors.textMuted}
                />
                <Text style={s.metaText}>
                  Class {period.class} – Section {period.section}
                </Text>
              </View>
              <View style={s.metaItem}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="location-outline"
                  size={12}
                  color={theme.colors.textMuted}
                />
                <Text style={s.metaText}>{period.room}</Text>
              </View>
            </View>
          )}
        </View>
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
  const totalClasses = Object.values(TEACHER_TIMETABLE).reduce(
    (s, ps) => s + ps.filter(p => p.type === 'class').length,
    0,
  );

  return (
    <View style={s.root}>
      <Header title="Timetable" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Weekly summary banner ── */}
        {/* <View style={s.banner}>
          <View style={s.bannerRow}>
            <View style={s.bannerStat}>
              <Text style={s.bannerStatVal}>{totalClasses}</Text>
              <Text style={s.bannerStatLbl}>Weekly Classes</Text>
            </View>
            <View style={s.bannerDivider} />
            <View style={s.bannerStat}>
              <Text style={s.bannerStatVal}>{DAYS.length}</Text>
              <Text style={s.bannerStatLbl}>Working Days</Text>
            </View>
            <View style={s.bannerDivider} />
            <View style={s.bannerStat}>
              <Text style={s.bannerStatVal}>{classPeriods}</Text>
              <Text style={s.bannerStatLbl}>Today</Text>
            </View>
          </View>
        </View> */}

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
            <Text style={s.dayHeaderSub}>
              {classPeriods} class{classPeriods !== 1 ? 'es' : ''} to teach
            </Text>
          </View>
          <View style={s.dayHeaderBadge}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="school-outline"
              size={14}
              color={NAVY}
            />
            <Text style={s.dayHeaderBadgeText}>{periods.length} periods</Text>
          </View>
        </View>

        {/* ── Periods ── */}
        {periods.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>🎉</Text>
            <Text style={s.emptyTitle}>No Classes Today!</Text>
            <Text style={s.emptySub}>Enjoy your free day.</Text>
          </View>
        ) : (
          <View style={s.periodsList}>
            {periods.map((period, i) => (
              <View key={period.id}>
                {/* Connector line between cards */}
                {i > 0 && (
                  <View style={s.connector}>
                    <View style={s.connectorLine} />
                    <View style={s.connectorDot} />
                    <View style={s.connectorLine} />
                  </View>
                )}
                <PeriodCard period={period} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TeacherTImetableScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4FF' },
  scroll: { padding: 16, paddingBottom: 32 },

  // Banner
  banner: {
    backgroundColor: NAVY,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: NAVY,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  bannerBlob: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40,
    right: -30,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  bannerStat: { flex: 1, alignItems: 'center' },
  bannerStatVal: { fontSize: 24, fontWeight: '900', color: '#fff' },
  bannerStatLbl: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    marginTop: 2,
  },
  bannerDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

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

  // Periods list
  periodsList: { gap: 0 },

  // Connector
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    paddingHorizontal: 20,
  },
  connectorLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  connectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  classBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  classBadgeText: { fontSize: 11, fontWeight: '700' },
  freeBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: { fontSize: 11, fontWeight: '700', color: '#8B5CF6' },

  cardBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 24 },
  cardInfo: { flex: 1, gap: 6 },
  subjectText: { fontSize: 16, fontWeight: '900', color: NAVY },
  metaGrid: { gap: 3 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  emptySub: { fontSize: 13, color: theme.colors.textMuted },
});
