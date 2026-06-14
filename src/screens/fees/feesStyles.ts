import { Dimensions, StyleSheet } from 'react-native';
import { theme, onThemeChange } from '../../utils/theme';
import { PURPLE, PINK } from './feesData';

export const CARD_W = Dimensions.get('window').width - 32;

const __mk_shared = () => StyleSheet.create({
  // Card shell
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 14,
  },
  cardBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  badgeDot:  { width: 8, height: 8, borderRadius: 4 },
  cardBadgeText: { fontSize: 14, fontWeight: '800' },
  cardDivider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },

  // Row
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  rowLabel: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '500' },
  rowValue: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  rowLabelBold: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  rowValueBold: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary },

  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 10,
  },

  // Pay Now
  payBtn: {
    marginTop: 14,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: PURPLE,
    shadowColor: PINK,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // Receipt
  receiptBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingVertical: 12,
  },
  receiptBtnText: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },

  // Penalty note
  penaltyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginTop: 2 },
  penaltyNoteText: { fontSize: 11, color: '#EF4444', fontStyle: 'italic', flex: 1, lineHeight: 16 },
});


// Themed stylesheets — rebuilt on light/dark toggle.
export let shared = __mk_shared();
onThemeChange(() => { shared = __mk_shared(); });
