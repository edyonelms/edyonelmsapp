import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { fmt, PURPLE, PINK } from './feesData';
import FeeRow from './FeeRow';
import { shared } from './feesStyles';
import { theme, onThemeChange } from '../../utils/theme';

const CARD_W = Dimensions.get('window').width - 32;

interface Props {
  item: { installment: string; dueDate: string; penalty: number; subtotal: number };
}

const UpcomingCard = ({ item }: Props) => (
  <View style={[s.card, { width: CARD_W }]}>
    {/* Top accent strip */}
    <View style={s.strip} />

    <View style={s.inner}>
      <View style={s.badgeRow}>
        <View style={s.badge}>
          <VectorIcon iconSet="Ionicons" iconName="time-outline" size={12} color="#F59E0B" />
          <Text style={s.badgeText}>Upcoming</Text>
        </View>
        <Text style={s.dueChip}>Due {item.dueDate}</Text>
      </View>

      <Text style={s.installmentTitle}>{item.installment}</Text>

      <View style={s.amountRow}>
        <Text style={s.amountLabel}>Amount</Text>
        <Text style={s.amountValue}>{fmt(item.subtotal - item.penalty)}</Text>
      </View>

      <View style={s.detailsBox}>
        <FeeRow label="Penalties" value={fmt(item.penalty)} />
        <FeeRow label="Subtotal"  value={fmt(item.subtotal)} />
      </View>

      <View style={s.noteRow}>
        <VectorIcon iconSet="Ionicons" iconName="alert-circle-outline" size={13} color="#EF4444" />
        <Text style={s.noteText}>*Penalty of ₹100/ day will be added for late payments</Text>
      </View>

      <View style={shared.cardDivider} />

      <View style={s.totalRow}>
        <Text style={s.totalLabel}>Total Amount</Text>
        <Text style={s.totalValue}>{fmt(item.subtotal)}</Text>
      </View>

      <TouchableOpacity style={s.payBtn} activeOpacity={0.85}>
        <VectorIcon iconSet="Ionicons" iconName="flash" size={16} color="#fff" />
        <Text style={s.payBtnText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default UpcomingCard;

const __mk_s = () => StyleSheet.create({
  card: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: theme.colors.card, borderRadius: 24,
    overflow: 'hidden',
    shadowColor: PURPLE, shadowOpacity: 0.1,
    shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  strip: { height: 5, backgroundColor: '#F59E0B' },
  inner: { padding: 18 },

  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  dueChip: { fontSize: 11, fontWeight: '700', color: '#EF4444', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },

  installmentTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.textPrimary, marginBottom: 12 },

  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F3FF', borderRadius: 14, padding: 14, marginBottom: 12 },
  amountLabel: { fontSize: 13, color: PURPLE, fontWeight: '600' },
  amountValue: { fontSize: 22, fontWeight: '900', color: PURPLE },

  detailsBox: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 12, marginBottom: 10 },

  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  noteText: { fontSize: 11, color: '#EF4444', fontStyle: 'italic', flex: 1, lineHeight: 16 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },

  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 999, paddingVertical: 15, backgroundColor: PURPLE,
    shadowColor: PINK, shadowOpacity: 0.45, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
