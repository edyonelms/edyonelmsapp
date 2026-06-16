import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh, useFocusLoad } from '../../hooks/useRefresh';
import { theme, onThemeChange } from '../../utils/theme';
import {
  AcademicFees,
  FeeDashboard,
  FeePenalties,
  Installment,
  InstallmentStatus,
  PaymentRow,
  getAcademicFees,
  getFeeDashboard,
  getFeePenalties,
} from '../../api/feeApi';
import { TransportRoute, getMyTransport } from '../../api/transportApi';
import PayFeeButton from './PayFeeButton';

const PURPLE = '#7C3AED';
const PINK = '#EC4899';

const TABS = ['Dashboard', 'Academic', 'Transport', 'Penalties'] as const;
type Tab = (typeof TABS)[number];

const TAB_META: Record<Tab, { icon: string; color: string }> = {
  Dashboard: { icon: 'grid-outline', color: PURPLE },
  Academic: { icon: 'school-outline', color: '#6366F1' },
  Transport: { icon: 'bus-outline', color: '#0EA5E9' },
  Penalties: { icon: 'alert-circle-outline', color: '#EF4444' },
};

const inr = (n: number) =>
  `₹ ${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const STATUS_COLOR: Record<InstallmentStatus, string> = {
  paid: theme.colors.success,
  partial: '#F59E0B',
  due: theme.colors.primary,
  overdue: theme.colors.danger,
};

// ─── Small shared bits ──────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={s.sectionTitle}>{children}</Text>
);

const ProgressBar = ({ pct, color }: { pct: number; color: string }) => (
  <View style={s.track}>
    <View style={[s.fill, { width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: color }]} />
  </View>
);

const KeyVal = ({
  label,
  value,
  color,
  bold,
}: {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}) => (
  <View style={s.kv}>
    <Text style={s.kvLabel}>{label}</Text>
    <Text style={[s.kvValue, bold && s.kvValueBold, !!color && { color }]}>{value}</Text>
  </View>
);

const EmptyState = ({ icon, text }: { icon: string; text: string }) => (
  <View style={s.empty}>
    <VectorIcon iconSet="Ionicons" iconName={icon} size={40} color={theme.colors.textMuted} />
    <Text style={s.emptyText}>{text}</Text>
  </View>
);

// ─── Dashboard tab ──────────────────────────────────────────────────────────
const InstallmentCard = ({ item, onPaid }: { item: Installment; onPaid: () => void }) => {
  const color = STATUS_COLOR[item.status];
  const isPaid = item.status === 'paid';

  return (
    <View style={[s.card, { borderTopColor: color, borderTopWidth: 4 }]}>
      <View style={s.cardHeadRow}>
        <Text style={s.cardTitle}>{item.label}</Text>
        <View style={[s.badge, { backgroundColor: color + '1A' }]}>
          <Text style={[s.badgeText, { color }]}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={[s.amountBox, { backgroundColor: color + '12' }]}>
        <Text style={s.amountLabel}>{isPaid ? 'Amount' : 'Payable now'}</Text>
        <Text style={[s.amountValue, { color }]}>{inr(isPaid ? item.amount : item.payable)}</Text>
      </View>

      <KeyVal label="Installment" value={inr(item.amount)} />
      {item.paid > 0 && !isPaid && <KeyVal label="Already paid" value={inr(item.paid)} color={theme.colors.success} />}
      {item.penalty > 0 && (
        <KeyVal label={`Penalty (${item.days_overdue}d overdue)`} value={inr(item.penalty)} color={theme.colors.danger} />
      )}
      {item.due_date && <KeyVal label="Due date" value={item.due_date} color={item.status === 'overdue' ? theme.colors.danger : undefined} />}

      {!isPaid && item.payable > 0 && (
        <PayFeeButton
          amount={item.payable}
          feeType="academic"
          style={[s.payBtn, { backgroundColor: color }]}
          textStyle={s.payBtnText}
          onPaid={onPaid}
        />
      )}
    </View>
  );
};

const PaymentItem = ({ p }: { p: PaymentRow }) => (
  <View style={s.payRow}>
    <View style={[s.payRowIcon, { backgroundColor: theme.colors.success + '18' }]}>
      <VectorIcon iconSet="Ionicons" iconName="checkmark-circle" size={20} color={theme.colors.success} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={s.payRowTitle} numberOfLines={1}>
        {p.receipt_number}
      </Text>
      <Text style={s.payRowSub}>
        {p.fee_type === 'transport' ? 'Transport' : 'Academic'} · {p.payment_mode} · {p.payment_date ?? '-'}
      </Text>
    </View>
    <Text style={s.payRowAmt}>{inr(p.amount)}</Text>
  </View>
);

const DashboardTab = ({ data, onPaid }: { data: FeeDashboard | null; onPaid: () => void }) => {
  if (!data) return <EmptyState icon="document-text-outline" text="No fee data available yet." />;

  const sm = data.summary;

  return (
    <>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroEyebrow}>Total Fees</Text>
        <Text style={s.heroAmount}>{inr(sm.total_due)}</Text>
        <View style={s.heroStatsRow}>
          <View style={s.heroStat}>
            <Text style={[s.heroStatVal, { color: '#4ADE80' }]}>{inr(sm.total_paid)}</Text>
            <Text style={s.heroStatLbl}>Paid</Text>
          </View>
          <View style={s.heroDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatVal, { color: '#FCA5A5' }]}>{inr(sm.remaining)}</Text>
            <Text style={s.heroStatLbl}>Remaining</Text>
          </View>
          <View style={s.heroDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatVal, { color: '#A5B4FC' }]}>{sm.cleared_percent}%</Text>
            <Text style={s.heroStatLbl}>Cleared</Text>
          </View>
        </View>
        <View style={s.heroTrack}>
          <View style={[s.heroFill, { width: `${sm.cleared_percent}%` }]} />
        </View>
      </View>

      {/* Quick stats */}
      <View style={s.quickRow}>
        <View style={[s.quickCard, { backgroundColor: theme.colors.danger + '12' }]}>
          <Text style={[s.quickVal, { color: theme.colors.danger }]}>{inr(sm.total_penalties)}</Text>
          <Text style={s.quickLbl}>Penalties</Text>
        </View>
        <View style={[s.quickCard, { backgroundColor: theme.colors.success + '12' }]}>
          <Text style={[s.quickVal, { color: theme.colors.success }]}>{inr(sm.concession)}</Text>
          <Text style={s.quickLbl}>Concession</Text>
        </View>
        <View style={[s.quickCard, { backgroundColor: PURPLE + '12' }]}>
          <Text style={[s.quickVal, { color: PURPLE }]}>{inr(sm.total_waived)}</Text>
          <Text style={s.quickLbl}>Waived</Text>
        </View>
      </View>

      {/* Upcoming installments */}
      <SectionTitle>Upcoming & Due Installments</SectionTitle>
      {data.upcoming.length === 0 ? (
        <Text style={s.muted}>No installment schedule configured.</Text>
      ) : (
        data.upcoming.map(item => <InstallmentCard key={item.serial} item={item} onPaid={onPaid} />)
      )}

      {/* Recent payments */}
      <SectionTitle>Recent Payments</SectionTitle>
      {data.recent_payments.length === 0 ? (
        <Text style={s.muted}>No payments recorded yet.</Text>
      ) : (
        <View style={s.listCard}>
          {data.recent_payments.map(p => (
            <PaymentItem key={p.id} p={p} />
          ))}
        </View>
      )}
    </>
  );
};

// ─── Academic tab ───────────────────────────────────────────────────────────
const AcademicTab = ({ data, onPaid }: { data: AcademicFees | null; onPaid: () => void }) => {
  if (!data) return <EmptyState icon="school-outline" text="No academic fee structure found." />;

  const t = data.totals;
  const pct = t.net_due > 0 ? Math.round((t.paid / t.net_due) * 100) : 0;
  const color = TAB_META.Academic.color;

  return (
    <>
      <View style={[s.card, { borderTopColor: color, borderTopWidth: 4 }]}>
        <Text style={s.cardTitle}>Academic Fees{data.academic_year ? ` · ${data.academic_year}` : ''}</Text>
        <View style={s.bigAmtRow}>
          <Text style={[s.bigAmt, { color: theme.colors.textPrimary }]}>{inr(t.paid)}</Text>
          <Text style={s.bigAmtSlash}> / {inr(t.net_due)}</Text>
        </View>
        <ProgressBar pct={pct} color={color} />
        <Text style={[s.subLabel, { color }]}>{pct}% cleared</Text>

        <View style={s.divider} />
        <KeyVal label="Structure total" value={inr(t.structure_total)} />
        {t.concession > 0 && <KeyVal label="Concession" value={`- ${inr(t.concession)}`} color={theme.colors.success} />}
        <KeyVal label="Net payable" value={inr(t.net_due)} bold />
        <KeyVal label="Remaining" value={inr(t.remaining)} color={theme.colors.danger} bold />

        {t.remaining > 0 && (
          <PayFeeButton
            amount={t.remaining}
            feeType="academic"
            style={[s.payBtn, { backgroundColor: color }]}
            textStyle={s.payBtnText}
            onPaid={onPaid}
          />
        )}
      </View>

      <SectionTitle>Fee Structure</SectionTitle>
      <View style={s.listCard}>
        {data.structures.length === 0 ? (
          <Text style={s.muted}>No fee items configured for your class.</Text>
        ) : (
          data.structures.map(item => (
            <View key={item.id} style={s.feeLine}>
              <Text style={s.feeLineName}>{item.fee_name}</Text>
              <Text style={s.feeLineAmt}>{inr(item.amount)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Penalty policy */}
      <SectionTitle>School Penalty Policy</SectionTitle>
      <View style={[s.card, { borderTopColor: theme.colors.danger, borderTopWidth: 4 }]}>
        <View style={s.penaltyHeadRow}>
          <VectorIcon iconSet="Ionicons" iconName="alert-circle" size={18} color={theme.colors.danger} />
          <Text style={s.penaltyHeadText}>Late fee applies after the due date</Text>
        </View>
        <KeyVal label="Penalty per day" value={inr(data.penalty.per_day)} color={theme.colors.danger} />
        <KeyVal label="Due day of month" value={String(data.penalty.due_day_of_month)} />
        <KeyVal label="Billing cycle" value={data.penalty.cycle_type} />
        <KeyVal label="Penalty charged so far" value={inr(data.penalty.charged)} color={theme.colors.danger} bold />
      </View>
    </>
  );
};

// ─── Transport tab ──────────────────────────────────────────────────────────
const MONTH_STATUS_COLOR: Record<string, string> = {
  paid: theme.colors.success,
  partial: '#F59E0B',
  pending: theme.colors.danger,
  no_transport: theme.colors.textMuted,
};

const TransportTab = ({ data, onPaid }: { data: TransportRoute | null; onPaid: () => void }) => {
  if (!data) return <EmptyState icon="bus-outline" text="No transport route assigned to you." />;

  const fees = data.fees;
  const color = TAB_META.Transport.color;

  return (
    <>
      <View style={[s.card, { borderTopColor: color, borderTopWidth: 4 }]}>
        <Text style={s.cardTitle}>{data.route_name}</Text>
        <Text style={s.routeSub}>
          {data.pickup_location ?? '-'} → {data.drop_location ?? '-'}
        </Text>
        {!!data.pickup_time && <Text style={s.routeSub}>Pickup: {data.pickup_time}</Text>}
        <View style={s.divider} />
        <KeyVal label="Monthly fee" value={inr(data.monthly_fee)} />
        {data.driver?.name && <KeyVal label="Driver" value={data.driver.name} />}
        {!!data.vehicle_no && <KeyVal label="Vehicle" value={data.vehicle_no} />}
      </View>

      {fees && (
        <>
          <View style={[s.card, { borderTopColor: color, borderTopWidth: 4 }]}>
            <Text style={s.cardTitle}>Transport Fee Summary</Text>
            <View style={s.bigAmtRow}>
              <Text style={[s.bigAmt, { color: theme.colors.textPrimary }]}>{inr(fees.total_paid)}</Text>
              <Text style={s.bigAmtSlash}> / {inr(fees.annual_fee)}</Text>
            </View>
            <ProgressBar pct={fees.annual_fee > 0 ? (fees.total_paid / fees.annual_fee) * 100 : 0} color={color} />
            <View style={s.divider} />
            <KeyVal label="Billable months" value={String(fees.months_count)} />
            <KeyVal label="Total due" value={inr(fees.total_due)} color={theme.colors.danger} bold />

            {fees.total_due > 0 && (
              <PayFeeButton
                amount={fees.total_due}
                feeType="transport"
                style={[s.payBtn, { backgroundColor: color }]}
                textStyle={s.payBtnText}
                onPaid={onPaid}
              />
            )}
          </View>

          <SectionTitle>12-Month Status</SectionTitle>
          <View style={s.monthGrid}>
            {fees.schedule.map(m => {
              const c = MONTH_STATUS_COLOR[m.status] ?? theme.colors.textMuted;
              return (
                <View key={m.key} style={[s.monthCell, { borderColor: c + '40', backgroundColor: c + '0F' }]}>
                  <Text style={s.monthName}>{m.month.slice(0, 3)}</Text>
                  <View style={[s.monthDot, { backgroundColor: c }]} />
                  <Text style={[s.monthStatus, { color: c }]}>
                    {m.status === 'no_transport' ? '—' : m.status}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </>
  );
};

// ─── Penalties tab ──────────────────────────────────────────────────────────
const PenaltiesTab = ({ data }: { data: FeePenalties | null }) => {
  if (!data || data.count === 0) {
    return <EmptyState icon="happy-outline" text="No penalties charged. Great job staying on time!" />;
  }

  return (
    <>
      <View style={[s.card, { borderTopColor: theme.colors.danger, borderTopWidth: 4 }]}>
        <Text style={s.cardTitle}>Total Penalties</Text>
        <Text style={[s.bigAmt, { color: theme.colors.danger }]}>{inr(data.total_penalty)}</Text>
        <Text style={s.subLabel}>Across {data.count} payment(s) · {inr(data.penalty_per_day)}/day rate</Text>
      </View>

      <SectionTitle>Penalty Details</SectionTitle>
      {data.items.map(item => (
        <View key={item.payment_id} style={[s.card, { borderLeftColor: theme.colors.danger, borderLeftWidth: 4 }]}>
          <View style={s.cardHeadRow}>
            <Text style={s.cardTitle}>{inr(item.penalty_amount)} penalty</Text>
            <View style={[s.badge, { backgroundColor: theme.colors.danger + '1A' }]}>
              <Text style={[s.badgeText, { color: theme.colors.danger }]}>
                {item.fee_type === 'transport' ? 'TRANSPORT' : 'ACADEMIC'}
              </Text>
            </View>
          </View>
          <Text style={s.penaltyOn}>Charged on payment {item.receipt_number}</Text>
          <View style={s.divider} />
          <KeyVal label="Base amount" value={inr(item.base_amount)} />
          <KeyVal label="Penalty" value={inr(item.penalty_amount)} color={theme.colors.danger} bold />
          <KeyVal label="Mode" value={item.payment_mode} />
          {!!item.payment_date && <KeyVal label="Date" value={item.payment_date} />}
        </View>
      ))}
    </>
  );
};

// ─── Main Screen ────────────────────────────────────────────────────────────
const FeesScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<Tab>('Dashboard');
  const [dashboard, setDashboard] = useState<FeeDashboard | null>(null);
  const [academic, setAcademic] = useState<AcademicFees | null>(null);
  const [penalties, setPenalties] = useState<FeePenalties | null>(null);
  const [transport, setTransport] = useState<TransportRoute | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, a, p, t] = await Promise.all([
        getFeeDashboard().catch(() => null),
        getAcademicFees().catch(() => null),
        getFeePenalties().catch(() => null),
        getMyTransport().catch(() => null), // 404 when no transport assigned
      ]);
      setDashboard(d);
      setAcademic(a);
      setPenalties(p);
      setTransport(t);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusLoad(load);
  const { refreshing, onRefresh } = useRefresh(load);

  return (
    <View style={s.root}>
      <Header title="Fees" onBackPress={() => navigation.goBack()} />

      {/* Tab bar */}
      <View style={s.tabBarWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabBar}>
          {TABS.map(t => {
            const active = tab === t;
            const color = TAB_META[t].color;
            return (
              <TouchableOpacity
                key={t}
                activeOpacity={0.8}
                onPress={() => setTab(t)}
                style={[
                  s.tabPill,
                  active ? { backgroundColor: color } : { backgroundColor: color + '14', borderColor: color + '30', borderWidth: 1 },
                ]}
              >
                <VectorIcon iconSet="Ionicons" iconName={TAB_META[t].icon} size={13} color={active ? '#fff' : color} />
                <Text style={[s.tabPillText, { color: active ? '#fff' : color }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {tab === 'Dashboard' && <DashboardTab data={dashboard} onPaid={load} />}
          {tab === 'Academic' && <AcademicTab data={academic} onPaid={load} />}
          {tab === 'Transport' && <TransportTab data={transport} onPaid={load} />}
          {tab === 'Penalties' && <PenaltiesTab data={penalties} />}
        </ScrollView>
      )}
    </View>
  );
};

export default FeesScreen;

// ─── Styles ─────────────────────────────────────────────────────────────────
const __mk_s = () =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { paddingBottom: 40, paddingTop: 8 },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    // Tabs
    tabBarWrap: { backgroundColor: theme.colors.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    tabBar: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
    tabPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
    tabPillText: { fontSize: 12, fontWeight: '700' },

    sectionTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, marginHorizontal: 16, marginTop: 10, marginBottom: 10 },
    muted: { fontSize: 13, color: theme.colors.textMuted, marginHorizontal: 18, marginBottom: 12 },

    // Hero
    hero: {
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 16,
      backgroundColor: '#1E1B4B',
      borderRadius: 24,
      padding: 22,
      shadowColor: PURPLE,
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    heroEyebrow: { fontSize: 12, color: '#A5B4FC', fontWeight: '600', marginBottom: 4 },
    heroAmount: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 16 },
    heroStatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    heroStat: { flex: 1, alignItems: 'center' },
    heroStatVal: { fontSize: 13, fontWeight: '800', marginBottom: 2 },
    heroStatLbl: { fontSize: 10, color: '#C7D2FE', fontWeight: '600' },
    heroDivider: { width: 1, height: 30, backgroundColor: '#ffffff18' },
    heroTrack: { height: 6, borderRadius: 4, backgroundColor: '#ffffff18', overflow: 'hidden' },
    heroFill: { height: '100%', borderRadius: 4, backgroundColor: '#818CF8' },

    // Quick stats
    quickRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 8 },
    quickCard: { flex: 1, borderRadius: 16, padding: 12, alignItems: 'center', gap: 4 },
    quickVal: { fontSize: 15, fontWeight: '900' },
    quickLbl: { fontSize: 10, fontWeight: '600', color: theme.colors.textSecondary },

    // Card
    card: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    cardHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
    badgeText: { fontSize: 10, fontWeight: '800' },

    bigAmtRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6 },
    bigAmt: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
    bigAmtSlash: { fontSize: 15, fontWeight: '600', color: theme.colors.textMuted, marginBottom: 3 },
    subLabel: { fontSize: 11, fontWeight: '700', marginTop: 4, color: theme.colors.textMuted },

    track: { height: 8, borderRadius: 5, backgroundColor: theme.colors.border, overflow: 'hidden', marginTop: 8 },
    fill: { height: '100%', borderRadius: 5 },

    divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 10 },

    // Key-value rows
    kv: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    kvLabel: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '500' },
    kvValue: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
    kvValueBold: { fontSize: 15, fontWeight: '900' },

    // Amount box
    amountBox: { borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    amountLabel: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
    amountValue: { fontSize: 20, fontWeight: '900' },

    // Pay button
    payBtn: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 999,
      paddingVertical: 14,
      shadowColor: PINK,
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    payBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.4 },

    // List card / payment rows
    listCard: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.colors.card,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 4,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    payRowIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    payRowTitle: { fontSize: 13, fontWeight: '800', color: theme.colors.textPrimary },
    payRowSub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2, textTransform: 'capitalize' },
    payRowAmt: { fontSize: 14, fontWeight: '900', color: theme.colors.textPrimary },

    feeLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    feeLineName: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary },
    feeLineAmt: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary },

    // Penalty
    penaltyHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    penaltyHeadText: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 },
    penaltyOn: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' },

    // Transport
    routeSub: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
    monthGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 12, gap: 8 },
    monthCell: { width: '22%', borderRadius: 14, borderWidth: 1, paddingVertical: 10, alignItems: 'center', gap: 5, marginBottom: 2 },
    monthName: { fontSize: 12, fontWeight: '800', color: theme.colors.textPrimary },
    monthDot: { width: 8, height: 8, borderRadius: 4 },
    monthStatus: { fontSize: 9, fontWeight: '700', textTransform: 'capitalize' },

    // Empty
    empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
    emptyText: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center', marginHorizontal: 40 },
  });

// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => {
  s = __mk_s();
});
