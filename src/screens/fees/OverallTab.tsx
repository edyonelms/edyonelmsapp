import React from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { FEE_DATA, fmt, PURPLE } from './feesData';


const CAT_META: Record<
  string,
  { icon: string; iconSet: string; color: string; bg: string }
> = {
  Academic: {
    icon: 'school-outline',
    iconSet: 'Ionicons',
    color: '#6366F1',
    bg: '#EEF2FF',
  },
  Transport: {
    icon: 'bus-outline',
    iconSet: 'Ionicons',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  Penalty: {
    icon: 'warning-outline',
    iconSet: 'Ionicons',
    color: '#EF4444',
    bg: '#FEE2E2',
  },
  Activity: {
    icon: 'football-outline',
    iconSet: 'Ionicons',
    color: '#10B981',
    bg: '#D1FAE5',
  },
};

const OverallTab = () => {
  const cats = Object.entries(FEE_DATA);
  const totalPaid = cats.reduce((s, [, c]) => s + c.paid, 0);
  const totalDue = cats.reduce((s, [, c]) => s + c.total, 0);
  const totalPct = Math.round((totalPaid / totalDue) * 100);

  return (
    <View style={s.container}>
      {/* ── Hero summary card ── */}
      <View style={s.heroCard}>
        {/* bg blobs */}
        <View style={s.blob1} />
        <View style={s.blob2} />

        <Text style={s.heroLabel}>Total Fees</Text>
        <Text style={s.heroAmount}>{fmt(totalDue)}</Text>

        <View style={s.heroRow}>
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>Paid</Text>
            <Text style={[s.heroStatValue, { color: '#4ADE80' }]}>
              {fmt(totalPaid)}
            </Text>
          </View>
          <View style={s.heroDivider} />
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>Due</Text>
            <Text style={[s.heroStatValue, { color: '#FCA5A5' }]}>
              {fmt(totalDue - totalPaid)}
            </Text>
          </View>
          <View style={s.heroDivider} />
          <View style={s.heroStat}>
            <Text style={s.heroStatLabel}>Paid %</Text>
            <Text style={[s.heroStatValue, { color: '#A5B4FC' }]}>
              {totalPct}%
            </Text>
          </View>
        </View>

        {/* Segmented bar */}
        <View style={s.segTrack}>
          <View style={[s.segFill, { width: `${totalPct}%` }]} />
        </View>
      </View>

      {/* ── Category breakdown ── */}
      <Text style={s.sectionTitle}>Category Breakdown</Text>

      {cats.map(([name, data]) => {
        const meta = CAT_META[name];
        const pct = Math.round((data.paid / data.total) * 100);
        return (
          <View key={name} style={s.catCard}>
            <View style={s.catLeft}>
              <View style={[s.catIcon, { backgroundColor: meta.bg }]}>
                <VectorIcon
                  iconSet={meta.iconSet}
                  iconName={meta.icon}
                  size={20}
                  color={meta.color}
                />
              </View>
              <View style={s.catInfo}>
                <Text style={s.catName}>{name}</Text>
                <View style={s.catBarTrack}>
                  <View
                    style={[
                      s.catBarFill,
                      { width: `${pct}%`, backgroundColor: meta.color },
                    ]}
                  />
                </View>
                <Text style={s.catSub}>
                  <Text style={{ color: meta.color, fontWeight: '700' }}>
                    {fmt(data.paid)}
                  </Text>
                  {' / '}
                  {fmt(data.total)}
                </Text>
              </View>
            </View>
            <View style={[s.pctBadge, { backgroundColor: meta.bg }]}>
              <Text style={[s.pctText, { color: meta.color }]}>{pct}%</Text>
            </View>
          </View>
        );
      })}

      {/* ── Quick stats row ── */}
      <Text style={s.sectionTitle}>Quick Stats</Text>
      <View style={s.statsRow}>
        {[
          {
            label: 'Categories',
            value: String(cats.length),
            icon: 'layers-outline',
            color: PURPLE,
            bg: '#F5F3FF',
          },
          {
            label: 'Upcoming',
            value: String(cats.reduce((s, [, c]) => s + c.upcoming.length, 0)),
            icon: 'time-outline',
            color: '#F59E0B',
            bg: '#FFFBEB',
          },
          {
            label: 'Paid',
            value: String(cats.reduce((s, [, c]) => s + c.paidFees.length, 0)),
            icon: 'checkmark-circle',
            color: '#10B981',
            bg: '#F0FDF4',
          },
        ].map(item => (
          <View
            key={item.label}
            style={[s.statCard, { backgroundColor: item.bg }]}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName={item.icon}
              size={20}
              color={item.color}
            />
            <Text style={[s.statValue, { color: item.color }]}>
              {item.value}
            </Text>
            <Text style={s.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default OverallTab;

const s = StyleSheet.create({
  container: { paddingBottom: 32 },

  // Hero
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    shadowColor: PURPLE,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  blob1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4F46E520',
    top: -40,
    right: -40,
  },
  blob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#818CF815',
    bottom: -20,
    left: 20,
  },
  heroLabel: {
    fontSize: 13,
    color: '#A5B4FC',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 18,
    letterSpacing: -1,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 3,
  },
  heroStatValue: { fontSize: 14, fontWeight: '800' },
  heroDivider: { width: 1, height: 32, backgroundColor: '#ffffff18' },
  segTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: '#ffffff18',
    overflow: 'hidden',
  },
  segFill: { height: '100%', borderRadius: 4, backgroundColor: '#818CF8' },

  // Section title
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 10,
  },

  // Category card
  catCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catInfo: { flex: 1, gap: 5 },
  catName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  catBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  catBarFill: { height: '100%', borderRadius: 3 },
  catSub: { fontSize: 11, color: '#64748B' },
  pctBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pctText: { fontSize: 13, fontWeight: '800' },

  // Quick stats
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 5,
  },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#64748B' },
});
