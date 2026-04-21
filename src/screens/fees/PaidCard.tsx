import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { fmt } from './feesData';
import FeeRow from './FeeRow';
import { shared } from './feesStyles';

interface Props {
  item: { installment: string; dueDate: string; penalty: number; paidOn: string; subtotal: number };
}

const PaidCard = ({ item }: Props) => (
  <View style={s.card}>
    <View style={s.strip} />
    <View style={s.inner}>
      <View style={s.badgeRow}>
        <View style={s.badge}>
          <VectorIcon iconSet="Ionicons" iconName="checkmark-circle" size={13} color="#10B981" />
          <Text style={s.badgeText}>Paid</Text>
        </View>
        <Text style={s.paidChip}>Paid on {item.paidOn}</Text>
      </View>

      <Text style={s.installmentTitle}>{item.installment}</Text>

      <View style={s.amountRow}>
        <Text style={s.amountLabel}>Amount Paid</Text>
        <Text style={s.amountValue}>{`₹ ${item.subtotal.toFixed(2)}`}</Text>
      </View>

      <View style={s.detailsBox}>
        <FeeRow label="Due Date"  value={item.dueDate}           color="#10B981" />
        <FeeRow label="Penalties" value={String(item.penalty)}   color="#10B981" />
        <FeeRow label="Subtotal"  value={`₹ ${item.subtotal.toFixed(2)}`} />
      </View>

      <TouchableOpacity style={s.receiptBtn} activeOpacity={0.8}>
        <VectorIcon iconSet="Feather" iconName="download" size={15} color="#10B981" />
        <Text style={s.receiptBtnText}>Download Receipt</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default PaidCard;

const s = StyleSheet.create({
  card: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden',
    shadowColor: '#10B981', shadowOpacity: 0.1,
    shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  strip: { height: 5, backgroundColor: '#10B981' },
  inner: { padding: 18 },

  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  paidChip: { fontSize: 11, fontWeight: '700', color: '#10B981', backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },

  installmentTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B', marginBottom: 12 },

  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: 14, padding: 14, marginBottom: 12 },
  amountLabel: { fontSize: 13, color: '#10B981', fontWeight: '600' },
  amountValue: { fontSize: 22, fontWeight: '900', color: '#10B981' },

  detailsBox: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, marginBottom: 14 },

  receiptBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#10B981', borderRadius: 999, paddingVertical: 13,
  },
  receiptBtnText: { fontSize: 14, fontWeight: '700', color: '#10B981' },
});
