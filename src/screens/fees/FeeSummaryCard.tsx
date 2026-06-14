import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { fmt, PURPLE } from './feesData';
import { theme, onThemeChange } from '../../utils/theme';

interface Props { paid: number; total: number; category: string }

const FeeSummaryCard = ({ paid, total, category }: Props) => {
  const pct = Math.round((paid / total) * 100);
  const due = total - paid;

  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View>
          <Text style={s.catLabel}>{category} Fees</Text>
          <Text style={s.amount}>
            {paid.toLocaleString('en-IN')}
            <Text style={s.slash}> / </Text>
            <Text style={s.total}>{total.toLocaleString('en-IN')}</Text>
          </Text>
          <Text style={s.subLabel}>Paid / Total</Text>
        </View>
        <View style={s.pctCircle}>
          <Text style={s.pctNum}>{pct}%</Text>
          <Text style={s.pctSub}>Paid</Text>
        </View>
      </View>

      {/* Segmented bar */}
      <View style={s.track}>
        <View style={[s.fill, { width: `${pct}%` }]} />
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        <View style={s.stat}>
          <VectorIcon iconSet="Ionicons" iconName="checkmark-circle" size={14} color="#10B981" />
          <Text style={s.statLabel}>Paid</Text>
          <Text style={[s.statValue, { color: '#10B981' }]}>{fmt(paid)}</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.stat}>
          <VectorIcon iconSet="Ionicons" iconName="alert-circle" size={14} color="#EF4444" />
          <Text style={s.statLabel}>Due</Text>
          <Text style={[s.statValue, { color: '#EF4444' }]}>{fmt(due)}</Text>
        </View>
      </View>
    </View>
  );
};

export default FeeSummaryCard;

const __mk_s = () => StyleSheet.create({
  card: {
    marginHorizontal: 16, marginTop: 10, marginBottom: 20,
    backgroundColor: theme.colors.card, borderRadius: 24, padding: 20,
    shadowColor: PURPLE, shadowOpacity: 0.1, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  catLabel: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  amount: { fontSize: 26, fontWeight: '900', color: theme.colors.textPrimary, letterSpacing: -0.5 },
  slash:  { color: '#CBD5E1', fontWeight: '400' },
  total:  { fontSize: 18, fontWeight: '600', color: theme.colors.textMuted },
  subLabel: { fontSize: 11, color: PURPLE, fontWeight: '700', marginTop: 2 },

  pctCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: PURPLE + '30',
  },
  pctNum: { fontSize: 16, fontWeight: '900', color: PURPLE },
  pctSub: { fontSize: 9,  fontWeight: '600', color: theme.colors.textMuted },

  track: { height: 8, borderRadius: 6, backgroundColor: '#EDE9FE', overflow: 'hidden', marginBottom: 16 },
  fill:  { height: '100%', borderRadius: 6, backgroundColor: PURPLE },

  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statDivider: { width: 1, height: 36, backgroundColor: '#E2E8F0' },
  statLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  statValue: { fontSize: 13, fontWeight: '800' },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
