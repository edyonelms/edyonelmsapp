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

const FEES = [
  { period: 'March', amount: '₹ 1,000', status: 'Paid' },
  { period: 'April', amount: '₹ 1,000', status: 'Paid' },
  { period: 'May', amount: '₹ 1,000', status: 'Paid' },
  { period: 'June', amount: '–', status: 'No Transport' },
  { period: 'July', amount: '₹ 1,000', status: 'Pending' },
  { period: 'August', amount: '–', status: '–' },
  { period: 'September', amount: '–', status: '–' },
  { period: 'October', amount: '–', status: '–' },
  { period: 'November', amount: '–', status: '–' },
  { period: 'December', amount: '–', status: '–' },
  { period: 'January', amount: '–', status: '–' },
  { period: 'February', amount: '–', status: '–' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Paid: { color: '#16A34A', bg: '#DCFCE7' },
  Pending: { color: '#D97706', bg: '#FEF3C7' },
  'No Transport': { color: '#6B7280', bg: '#F3F4F6' },
};

// ─── Label / value row ────────────────────────────────────────────────────────
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue}>{value}</Text>
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
        {/* ── School & Bus Card ── */}
        <View style={s.card}>
          <View style={[s.accentBar, { backgroundColor: theme.colors.primary }]} />
          <View style={s.cardInner}>
            <View style={s.cardTop}>
              <View style={s.iconWrap}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="bus-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>Jafari</Text>
                <Text style={s.cardSubtitle}>School Transport</Text>
              </View>
              <View style={s.fareBadge}>
                <Text style={s.fareBadgeText}>₹ 1000/pm</Text>
              </View>
            </View>

            <View style={s.pillsRow}>
              <View style={s.pill}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="log-in-outline"
                  size={12}
                  color={theme.colors.primary}
                />
                <Text style={s.pillText}>Arrival 08:00 AM</Text>
              </View>
              <View style={s.pill}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="log-out-outline"
                  size={12}
                  color={theme.colors.primary}
                />
                <Text style={s.pillText}>Departure 02:00 PM</Text>
              </View>
            </View>

            <View style={s.divider} />

            <InfoRow label="Vehicle Number" value="UP81 XX XXXX" />
            <InfoRow label="Capacity" value="40 Seats" />
            <InfoRow label="Arrival Time" value="08:00 AM" />
            <InfoRow label="Departure Time" value="02:00 PM" />

            {/* Driver Details accordion */}
            <TouchableOpacity
              style={s.driverHeader}
              onPress={() => setDriverExpanded(v => !v)}
              activeOpacity={0.8}
            >
              <View style={s.driverHeaderLeft}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="person-outline"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text style={s.driverHeaderText}>Driver Details</Text>
              </View>
              <VectorIcon
                iconSet="Ionicons"
                iconName={driverExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>

            {driverExpanded && (
              <View style={s.driverBody}>
                <View style={s.driverTop}>
                  <View style={s.driverAvatar}>
                    <Text style={s.driverInitial}>R</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.driverName}>Ramesh Kumar</Text>
                    <Text style={s.driverEmail}>driver@school.com</Text>
                  </View>
                </View>
                <View style={s.driverPhoneRow}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="call-outline"
                    size={13}
                    color={theme.colors.primary}
                  />
                  <Text style={s.driverPhone}>+91 98765 43210</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Transport Fees Card ── */}
        <View style={s.card}>
          <View style={[s.accentBar, { backgroundColor: '#16A34A' }]} />
          <View style={s.cardInner}>
            <View style={s.cardTop}>
              <View style={s.iconWrap}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="wallet-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>Transport Fees</Text>
                <Text style={s.cardSubtitle}>Monthly payments</Text>
              </View>
            </View>

            {/* Table header */}
            <View style={[s.tableRow, s.tableHead]}>
              <Text style={[s.tableHeadText, { flex: 1.4 }]}>Month</Text>
              <Text style={[s.tableHeadText, { flex: 1, textAlign: 'center' }]}>
                Amount
              </Text>
              <Text style={[s.tableHeadText, { flex: 1.6, textAlign: 'right' }]}>
                Status
              </Text>
            </View>

            {FEES.map((row, i) => {
              const sc = STATUS_CONFIG[row.status];
              return (
                <View
                  key={i}
                  style={[s.tableRow, i < FEES.length - 1 && s.tableRowBorder]}
                >
                  <Text style={[s.tableCellText, { flex: 1.4 }]}>{row.period}</Text>
                  <Text
                    style={[
                      s.tableCellText,
                      { flex: 1, textAlign: 'center' },
                    ]}
                  >
                    {row.amount}
                  </Text>
                  <View style={{ flex: 1.6, alignItems: 'flex-end' }}>
                    {sc ? (
                      <View style={[s.badge, { backgroundColor: sc.bg }]}>
                        <View style={[s.badgeDot, { backgroundColor: sc.color }]} />
                        <Text style={[s.badgeText, { color: sc.color }]}>
                          {row.status}
                        </Text>
                      </View>
                    ) : (
                      <Text style={s.tableCellText}>–</Text>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Footer totals */}
            <View style={s.tableFooter}>
              <View style={s.footerItem}>
                <Text style={s.footerLabel}>Total Paid</Text>
                <Text style={[s.footerValue, { color: '#16A34A' }]}>
                  ₹ 3,000
                </Text>
              </View>
              <View style={s.footerDivider} />
              <View style={s.footerItem}>
                <Text style={s.footerLabel}>Total Due</Text>
                <Text style={[s.footerValue, { color: theme.colors.danger }]}>
                  ₹ 8,000
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
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingBottom: 36, gap: 14 },

  // Card (exam style)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md, gap: 10 },

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

  // Pills (exam style)
  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },

  // Driver accordion
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  driverHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  driverHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  driverBody: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: 12,
    gap: 10,
  },
  driverTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  driverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitial: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  driverEmail: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  driverPhoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driverPhone: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },

  // Info rows
  divider: { height: 1, backgroundColor: theme.colors.border },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Fare badge
  fareBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  fareBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },

  // Table
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableHead: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingVertical: 8,
    marginBottom: 2,
  },
  tableHeadText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    paddingHorizontal: 4,
  },
  tableCellText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    paddingHorizontal: 4,
  },

  // Status badge (exam style)
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  // Footer
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  footerValue: { fontSize: 14, fontWeight: '900' },
  footerDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
});
