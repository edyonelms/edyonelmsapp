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

const NAVY = '#1B2A4A';
const GOLD = '#8B7536';

const FEES = [
  { period: 'March – May', amount: '₹ 3,000', status: 'Paid' },
  { period: 'June – August', amount: '–', status: 'Pending' },
  { period: 'Sept – Nov', amount: '–', status: '–' },
  { period: 'Dec – Feb', amount: '–', status: '–' },
];

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({
  icon,
  label,
  color = NAVY,
}: {
  icon: string;
  label: string;
  color?: string;
}) => (
  <View style={[s.sectionHeader, { backgroundColor: color }]}>
    <VectorIcon iconSet="Ionicons" iconName={icon} size={16} color="#fff" />
    <Text style={s.sectionHeaderText}>{label}</Text>
  </View>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <View style={s.infoArrow}>
      <View style={s.arrowLine} />
      <VectorIcon
        iconSet="Ionicons"
        iconName="arrow-forward"
        size={12}
        color={NAVY}
      />
    </View>
    <Text style={s.infoValue}>{value}</Text>
  </View>
);

// ─── Plain Row (no arrow) ─────────────────────────────────────────────────────
const PlainRow = ({ label, value }: { label: string; value: string }) => (
  <View style={s.plainRow}>
    <Text style={s.plainLabel}>{label}</Text>
    <Text style={s.plainValue}>{value}</Text>
  </View>
);

const TransportScreen = ({ navigation }: any) => {
  const [driverExpanded, setDriverExpanded] = useState(false);

  return (
    <View style={s.root}>
      <Header title="Transport" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── School Card ── */}
        <View style={s.card}>
          <SectionHeader icon="school-outline" label="School" color={GOLD} />

          <View style={s.cardBody}>
            {/* School name title */}
            <View style={s.cardTitleRow}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="business-outline"
                size={22}
                color={NAVY}
              />
              <Text style={s.cardTitle}>Jafari</Text>
            </View>

            <InfoRow label="School Name" value="Jafari" />

            <View style={s.timeRow}>
              <View style={s.timeItem}>
                <Text style={s.timeLabel}>Arrival Time:</Text>
                <Text style={s.timeValue}>08:00 AM</Text>
              </View>
              <View style={s.timeItem}>
                <Text style={s.timeLabel}>Departure Time:</Text>
                <Text style={s.timeValue}>02:00 PM</Text>
              </View>
            </View>

            {/* Driver Details accordion */}
            <TouchableOpacity
              style={s.driverHeader}
              onPress={() => setDriverExpanded(v => !v)}
              activeOpacity={0.8}
            >
              <Text style={s.driverHeaderText}>Driver Details</Text>
              <VectorIcon
                iconSet="Ionicons"
                iconName={driverExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={NAVY}
              />
            </TouchableOpacity>

            {driverExpanded && (
              <View style={s.driverBody}>
                <View style={s.driverAvatarWrap}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="person-circle-outline"
                    size={40}
                    color={NAVY}
                  />
                </View>
                <View style={s.driverInfo}>
                  <View style={s.driverCol}>
                    <Text style={s.driverColTitle}>Name</Text>
                    <Text style={s.driverColValue}>Ramesh Kumar</Text>
                  </View>
                  <View style={s.driverDivider} />
                  <View style={s.driverCol}>
                    <Text style={s.driverColTitle}>Email</Text>
                    <Text style={s.driverColValue}>driver@school.com</Text>
                  </View>
                </View>
                <View style={s.driverRow}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="call-outline"
                    size={14}
                    color={NAVY}
                  />
                  <Text style={s.driverPhone}>+91 98765 43210</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Bus Card ── */}
        <View style={s.card}>
          <View style={s.cardBody}>
            <View style={s.cardTitleRow}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="bus-outline"
                size={24}
                color={NAVY}
              />
              <Text style={s.cardTitle}>Bus</Text>
            </View>

            <PlainRow label="Vehicle Number" value="UP81 XX XXXX" />
            <PlainRow label="Capacity" value="40 Seats" />
            <PlainRow label="Arrival Time" value="08:00 AM" />
            <PlainRow label="Departure Time" value="02:00 PM" />

            <View style={s.fareDivider} />

            <View style={s.fareRow}>
              <Text style={s.fareLabel}>Fair:</Text>
              <Text style={s.fareSymbol}>₹</Text>
              <Text style={s.fareAmount}>1000</Text>
              <Text style={s.fareUnit}>pm</Text>
            </View>
          </View>
        </View>

        {/* ── Transport Fees Card ── */}
        <View style={s.card}>
          <View style={s.cardBody}>
            <Text style={s.feesTitle}>Transport Fees</Text>

            {/* Table header */}
            <View style={[s.tableRow, s.tableHead]}>
              <Text style={[s.tableCell, s.tableHeadText, { flex: 2 }]}>
                Period
              </Text>
              <Text
                style={[
                  s.tableCell,
                  s.tableHeadText,
                  { flex: 1.2, textAlign: 'center' },
                ]}
              >
                Amount
              </Text>
              <Text
                style={[
                  s.tableCell,
                  s.tableHeadText,
                  { flex: 1, textAlign: 'right' },
                ]}
              >
                Status
              </Text>
            </View>

            {FEES.map((row, i) => (
              <View key={i} style={[s.tableRow, i % 2 === 0 && s.tableRowAlt]}>
                <Text style={[s.tableCell, s.tableCellText, { flex: 2 }]}>
                  {row.period}
                </Text>
                <Text
                  style={[
                    s.tableCell,
                    s.tableCellText,
                    { flex: 1.2, textAlign: 'center' },
                  ]}
                >
                  {row.amount}
                </Text>
                <View
                  style={[s.tableCell, { flex: 1, alignItems: 'flex-end' }]}
                >
                  {row.status === 'Paid' ? (
                    <View style={s.paidBadge}>
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="checkmark-circle"
                        size={12}
                        color="#16A34A"
                      />
                      <Text style={s.paidText}>Paid</Text>
                    </View>
                  ) : row.status === 'Pending' ? (
                    <View style={s.pendingBadge}>
                      <Text style={s.pendingText}>Pending</Text>
                    </View>
                  ) : (
                    <Text style={s.tableCellText}>–</Text>
                  )}
                </View>
              </View>
            ))}

            {/* Footer totals */}
            <View style={s.tableFooter}>
              <View style={s.footerItem}>
                <Text style={s.footerLabel}>Total Paid:</Text>
                <Text style={[s.footerValue, { color: '#16A34A' }]}>
                  ₹ 12,000
                </Text>
              </View>
              <View style={s.footerDivider} />
              <View style={s.footerItem}>
                <Text style={s.footerLabel}>Total Due:</Text>
                <Text style={[s.footerValue, { color: '#EF4444' }]}>
                  ₹ 18,000
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TransportScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EEF2F7' },
  scroll: { padding: 16, paddingBottom: 36 },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardBody: { padding: 16 },

  // Section header bar
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Card title row
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', color: NAVY },

  // Info row with arrow
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    width: 110,
  },
  infoArrow: { flexDirection: 'row', alignItems: 'center', marginRight: 6 },
  arrowLine: { width: 20, height: 1, backgroundColor: NAVY, marginRight: 2 },
  infoValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  // Time row
  timeRow: { flexDirection: 'column', gap: 4, marginBottom: 14 },
  timeItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeLabel: { fontSize: 13, color: theme.colors.textSecondary, width: 120 },
  timeValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  // Driver accordion
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  driverHeaderText: { fontSize: 13, fontWeight: '800', color: NAVY },
  driverBody: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  driverAvatarWrap: { alignSelf: 'flex-start' },
  driverInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  driverCol: { flex: 1 },
  driverColTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 2,
  },
  driverColValue: { fontSize: 12, color: theme.colors.textSecondary },
  driverDivider: { width: 1, height: 32, backgroundColor: theme.colors.border },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driverPhone: { fontSize: 13, fontWeight: '600', color: NAVY },

  // Plain row
  plainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  plainLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  plainValue: { fontSize: 13, fontWeight: '700', color: NAVY },

  // Fare
  fareDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  fareRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  fareLabel: { fontSize: 16, fontWeight: '700', color: NAVY },
  fareSymbol: { fontSize: 18, fontWeight: '800', color: NAVY },
  fareAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: -1,
  },
  fareUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  // Fees title
  feesTitle: { fontSize: 17, fontWeight: '900', color: NAVY, marginBottom: 14 },

  // Table
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 4,
  },
  tableRowAlt: { backgroundColor: '#F8FAFC', borderRadius: 8 },
  tableHead: { backgroundColor: '#EEF2F7', borderRadius: 8, marginBottom: 4 },
  tableCell: { paddingHorizontal: 4 },
  tableHeadText: { fontSize: 12, fontWeight: '800', color: NAVY },
  tableCellText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },

  // Status badges
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paidText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pendingText: { fontSize: 11, fontWeight: '700', color: '#D97706' },

  // Footer
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLabel: { fontSize: 12, fontWeight: '700', color: NAVY },
  footerValue: { fontSize: 14, fontWeight: '900' },
  footerDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
});
