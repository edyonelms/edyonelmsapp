import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { calcBreakupTotal, PURPLE } from './feesData';
import type { BreakupRow } from './feesData';
import FeeRow from './FeeRow';

interface Props { breakup: BreakupRow[] }

const FeeBreakupCard = ({ breakup }: Props) => (
  <View style={s.card}>
    <View style={s.header}>
      <View style={s.iconBox}>
        <VectorIcon iconSet="Ionicons" iconName="receipt-outline" size={16} color={PURPLE} />
      </View>
      <Text style={s.title}>Price Details</Text>
    </View>

    <View style={s.body}>
      {breakup.map((r, i) => (
        <FeeRow key={i} label={r.label} value={r.value} color={r.color} />
      ))}
    </View>

    <View style={s.totalRow}>
      <Text style={s.totalLabel}>Total Amount</Text>
      <Text style={s.totalValue}>₹ {calcBreakupTotal(breakup)}</Text>
    </View>
  </View>
);

export default FeeBreakupCard;

const s = StyleSheet.create({
  card: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#fff', borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  iconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  body: { padding: 16, paddingBottom: 4 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    margin: 12, marginTop: 4, backgroundColor: '#F5F3FF',
    borderRadius: 14, padding: 14,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  totalValue: { fontSize: 18, fontWeight: '900', color: PURPLE },
});
