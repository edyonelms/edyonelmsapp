import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');
const CARD_W = (width - 52) / 2;

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  icon: string;
  iconSet: string;
  emoji?: string;
  count: number;
  total: number;
  sub: string;
  bg: string;
  color: string;
}

const StatCard = ({
  label,
  icon,
  iconSet,
  emoji,
  count,
  total,
  sub,
  bg,
  color,
}: StatCardProps) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const barW = CARD_W - 28;

  return (
    <View style={[s.card, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={s.cardHeader}>
        <View style={[s.iconBox, { backgroundColor: color + '20' }]}>
          {emoji ? (
            <Text style={s.emoji}>{emoji}</Text>
          ) : (
            <VectorIcon
              iconSet={iconSet}
              iconName={icon}
              size={15}
              color={color}
            />
          )}
        </View>
        <Text style={[s.cardLabel, { color }]}>{label}</Text>
      </View>

      {/* Count */}
      <Text style={[s.cardCount, { color: theme.colors.textPrimary }]}>
        {count}
        <Text style={s.cardDays}> Days</Text>
      </Text>

      {/* Progress bar */}
      <View style={[s.barTrack, { width: barW }]}>
        <View
          style={[s.barFill, { width: `${pct}%`, backgroundColor: color }]}
        />
      </View>

      {/* Sub badge */}
      <View style={[s.subBadge, { backgroundColor: color + '18' }]}>
        <Text style={[s.subText, { color }]}>{sub}</Text>
      </View>
    </View>
  );
};

// ─── Attendance Overview Bar ─────────────────────────────────────────────────
const OverviewBar = ({
  presentDays,
  absentDays,
  leaveDays,
  workDays,
}: {
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  workDays: number;
}) => {
  const pPct = workDays > 0 ? (presentDays / workDays) * 100 : 0;
  const aPct = workDays > 0 ? (absentDays / workDays) * 100 : 0;
  const lPct = workDays > 0 ? (leaveDays / workDays) * 100 : 0;

  return (
    <View style={s.overviewCard}>
      <View style={s.overviewTop}>
        <Text style={s.overviewTitle}>Monthly Overview</Text>
        <Text style={s.overviewSub}>{workDays} Working Days</Text>
      </View>

      <View style={s.segBar}>
        {pPct > 0 && (
          <View style={[s.seg, { flex: pPct, backgroundColor: '#16A34A' }]} />
        )}
        {aPct > 0 && (
          <View style={[s.seg, { flex: aPct, backgroundColor: '#DC2626' }]} />
        )}
        {lPct > 0 && (
          <View style={[s.seg, { flex: lPct, backgroundColor: '#D97706' }]} />
        )}
        {100 - pPct - aPct - lPct > 0 && (
          <View
            style={[
              s.seg,
              { flex: 100 - pPct - aPct - lPct, backgroundColor: '#E2E8F0' },
            ]}
          />
        )}
      </View>

      <View style={s.legendRow}>
        {[
          { label: 'Present', color: '#16A34A', val: presentDays },
          { label: 'Absent', color: '#DC2626', val: absentDays },
          { label: 'Leave', color: '#D97706', val: leaveDays },
        ].map(item => (
          <View key={item.label} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: item.color }]} />
            <Text style={s.legendLabel}>{item.label}</Text>
            <Text style={[s.legendVal, { color: item.color }]}>
              {item.val}d
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────
interface Props {
  workDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  totalDays: number;
  presentPct: string;
  absentPct: string;
}

const AttendanceStats = ({
  workDays,
  presentDays,
  absentDays,
  leaveDays,
  totalDays,
  presentPct,
  absentPct,
}: Props) => (
  <View style={s.container}>
    <Text style={s.sectionTitle}>Attendance</Text>

    {/* Top banner */}
    <View style={s.banner}>
      <View>
        <Text style={s.bannerLabel}>This Month</Text>
        <Text style={s.bannerCount}>
          {totalDays}
          <Text style={s.bannerSub}> total days</Text>
        </Text>
      </View>
      <View
        style={[s.bannerBadge, { backgroundColor: theme.colors.primaryLight }]}
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName="calendar-outline"
          size={13}
          color={theme.colors.primary}
        />
        <Text style={s.bannerBadgeText}>{workDays} Work Days</Text>
      </View>
    </View>

    {/* Overview bar */}
    <OverviewBar
      presentDays={presentDays}
      absentDays={absentDays}
      leaveDays={leaveDays}
      workDays={workDays}
    />

    <Text style={s.sectionTitle}>Summary</Text>

    {/* 2×2 cards */}
    <View style={s.grid}>
      <StatCard
        label="Work Days"
        icon="briefcase-outline"
        iconSet="Ionicons"
        count={workDays}
        total={totalDays}
        sub={`${workDays} Days`}
        bg="#EFF6FF"
        color="#3B82F6"
      />
      <StatCard
        label="Leave"
        icon=""
        iconSet=""
        emoji="🌴"
        count={leaveDays}
        total={workDays}
        sub={`${leaveDays} Days`}
        bg="#FFFBEB"
        color="#D97706"
      />
      <StatCard
        label="Present"
        icon="checkmark-circle"
        iconSet="Ionicons"
        count={presentDays}
        total={workDays}
        sub={`${presentPct}%`}
        bg="#F0FDF4"
        color="#16A34A"
      />
      <StatCard
        label="Absent"
        icon="close-circle"
        iconSet="Ionicons"
        count={absentDays}
        total={workDays}
        sub={`${absentPct}%`}
        bg="#FFF1F2"
        color="#DC2626"
      />
    </View>
  </View>
);

export default AttendanceStats;

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36, paddingTop: 0 },

  // Banner
  banner: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bannerLabel: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    marginBottom: 2,
  },
  bannerCount: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  bannerSub: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  bannerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Overview bar card
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  overviewSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  segBar: {
    height: 10,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 14,
  },
  seg: { height: '100%' },
  legendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  legendVal: { fontSize: 11, fontWeight: '800' },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  // Stat card
  card: {
    width: CARD_W,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 15 },
  cardLabel: { fontSize: 11, fontWeight: '700' },
  cardCount: { fontSize: 24, fontWeight: '900', marginBottom: 10 },
  cardDays: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },

  // Progress bar inside card
  barTrack: {
    height: 5,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginBottom: 10,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },

  subBadge: {
    alignSelf: 'flex-start',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  subText: { fontSize: 11, fontWeight: '700' },
});
