import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import { theme, onThemeChange } from '../../utils/theme';
import {
  CATEGORIES,
  FEE_DATA,
  fmt,
  calcBreakupTotal,
  PURPLE,
  PINK,
} from './feesData';
import type { Category } from './feesData';

const { width } = Dimensions.get('window');
const CARD_W = width - 32;

// ─── Shared Row ───────────────────────────────────────────────────────────────
const Row = ({
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
  <View style={s.row}>
    <Text style={[s.rowLabel, bold && s.rowLabelBold]}>{label}</Text>
    <Text style={[s.rowValue, bold && s.rowValueBold, !!color && { color }]}>
      {value}
    </Text>
  </View>
);

// ─── Overall Tab ──────────────────────────────────────────────────────────────
const OverallTab = () => {
  const entries = (
    Object.entries(FEE_DATA) as [
      Exclude<Category, 'Overall'>,
      (typeof FEE_DATA)[keyof typeof FEE_DATA],
    ][]
  ).filter(([key]) => key !== 'Penalty');
  const totalPaid = entries.reduce((sum, [, d]) => sum + d.paid, 0);
  const totalTotal = entries.reduce((sum, [, d]) => sum + d.total, 0);
  const totalPct = Math.round((totalPaid / totalTotal) * 100);

  const data = {
    paid: 41000,
    total: 50000,
    color: '#6366F1',
    icon: 'school-outline',
    breakup: [
      {
        label: 'Tuition Fee',
        value: '₹ 2,000',
      },
      {
        label: 'Discount Applied',
        value: '- ₹ 200',
        color: '#10B981',
      },
      {
        label: 'Promo Code',
        value: 'EXTRA10',
        color: '#10B981',
      },
      {
        label: 'Subtotal',
        value: '₹ 1,800',
      },
      {
        label: 'GST 18%',
        value: '₹ 324.00',
      },
    ],
    upcoming: [
      {
        installment: '1st Installment',
        dueDate: '31/03/2025',
        penalty: 500,
        subtotal: 15500,
      },
      {
        installment: '2nd Installment',
        dueDate: '30/06/2025',
        penalty: 0,
        subtotal: 9000,
      },
    ],
    paidFees: [
      {
        installment: '1st Installment',
        dueDate: '31/05/2025',
        penalty: 500,
        paidOn: '28/05/2025',
        subtotal: 789.45,
      },
    ],
  };

  return (
    <>
      {/* ── Dark hero card ── */}
      <View style={s.heroCard}>
        {/* <View style={s.heroBlob1} /> */}
        {/* <View style={s.heroBlob2} /> */}
        <Text style={s.heroEyebrow}>Total Fees Overview</Text>
        <Text style={s.heroAmount}>{fmt(totalTotal)}</Text>
        <View style={s.heroStatsRow}>
          <View style={s.heroStat}>
            <Text style={s.heroStatVal}>{fmt(totalPaid)}</Text>
            <Text style={s.heroStatLbl}>Paid</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatVal, { color: '#FCA5A5' }]}>
              {fmt(totalTotal - totalPaid)}
            </Text>
            <Text style={s.heroStatLbl}>Due</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={[s.heroStatVal, { color: '#A5B4FC' }]}>
              {totalPct}%
            </Text>
            <Text style={s.heroStatLbl}>Cleared</Text>
          </View>
        </View>
        <View style={s.heroTrack}>
          <View style={[s.heroFill, { width: `${totalPct}%` }]} />
        </View>
      </View>

      {/* ── Category cards ── */}
      <Text style={s.sectionTitle}>Category Breakdown</Text>
      <View
        style={{
          paddingTop: 6,
          marginHorizontal: 16,
          marginBottom: 10,
          backgroundColor: theme.colors.card,
          borderRadius: 18,
          alignItems: 'center',
          gap: 12,
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          elevation: 2,
        }}
      >
        {entries.map(([name, data]) => {
          const pct = Math.round((data.paid / data.total) * 100);
          return (
            <View key={name} style={s.catCard}>
              {/* <View
                style={[s.catIconBox, { backgroundColor: data.color + '18' }]}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={data.icon}
                  size={22}
                  color={data.color}
                />
              </View> */}
              <View style={s.catBody}>
                <View style={s.catTopRow}>
                  <Text style={s.catName}>{name}</Text>
                  <Text style={[s.catPct, { color: data.color }]}>{pct}%</Text>
                </View>
                <View style={s.catTrack}>
                  <View
                    style={[
                      s.catFill,
                      { width: `${pct}%`, backgroundColor: data.color },
                    ]}
                  />
                </View>
                <View style={s.catBottomRow}>
                  <Text style={[s.catPaid, { color: data.color }]}>
                    {fmt(data.paid)} paid
                  </Text>
                  <Text style={s.catTotal}>{fmt(data.total)} total</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── Upcoming ── */}
      <Text style={s.sectionTitle}>Upcoming Dues</Text>
      <FlatList
        data={data.upcoming}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View
            style={[
              s.upcomingCard,
              { width: CARD_W, borderTopColor: '#F59E0B' },
            ]}
          >
            <View style={s.upcomingHeader}>
              <View style={s.upcomingBadge}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="time-outline"
                  size={12}
                  color="#F59E0B"
                />
                <Text style={s.upcomingBadgeText}>Upcoming</Text>
              </View>
              <View style={s.dueDateChip}>
                <Text style={s.dueDateText}>Due {item.dueDate}</Text>
              </View>
            </View>
            <Text style={s.upcomingTitle}>{item.installment}</Text>
            <View style={[s.amountBox, { backgroundColor: data.color + '12' }]}>
              <Text style={s.amountBoxLabel}>Amount</Text>
              <Text style={[s.amountBoxValue, { color: data.color }]}>
                {fmt(item.subtotal - item.penalty)}
              </Text>
            </View>
            <View style={s.upcomingDetails}>
              <Row label="Penalties" value={fmt(item.penalty)} />
              <Row label="Subtotal" value={fmt(item.subtotal)} />
            </View>
            <View style={s.penaltyNote}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="alert-circle-outline"
                size={12}
                color="#EF4444"
              />
              <Text style={s.penaltyNoteText}>
                *₹100/day penalty for late payments
              </Text>
            </View>
            <View style={s.divider} />
            <Row label="Total Amount" value={fmt(item.subtotal)} bold />
            <TouchableOpacity
              style={[s.payBtn, { backgroundColor: data.color }]}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="flash"
                size={16}
                color="#fff"
              />
              <Text style={s.payBtnText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* ── Paid Fees ── */}
      <Text style={s.sectionTitle}>Paid fees</Text>
      {data.paidFees.map((item, i) => (
        <View key={i} style={[s.paidCard, { borderTopColor: '#10B981' }]}>
          <View style={s.paidHeader}>
            <View style={s.paidBadge}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-circle"
                size={13}
                color="#10B981"
              />
              <Text style={s.paidBadgeText}>Paid</Text>
            </View>
            <View style={s.paidOnChip}>
              <Text style={s.paidOnText}>Paid on {item.paidOn}</Text>
            </View>
          </View>
          <Text style={s.paidTitle}>{item.installment}</Text>
          <View style={s.paidAmountBox}>
            <Text style={s.paidAmountLabel}>Amount Paid</Text>
            <Text style={s.paidAmountValue}>{`₹ ${item.subtotal.toFixed(
              2,
            )}`}</Text>
          </View>
          <View style={s.paidDetails}>
            <Row label="Due Date" value={item.dueDate} color="#10B981" />
            <Row
              label="Penalties"
              value={String(item.penalty)}
              color="#10B981"
            />
            <Row label="Subtotal" value={`₹ ${item.subtotal.toFixed(2)}`} />
          </View>
          <TouchableOpacity style={s.receiptBtn} activeOpacity={0.8}>
            <VectorIcon
              iconSet="Feather"
              iconName="download"
              size={15}
              color="#10B981"
            />
            <Text style={s.receiptBtnText}>Download Receipt</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

// ─── Category Tab ─────────────────────────────────────────────────────────────
const CategoryTab = ({ cat }: { cat: Exclude<Category, 'Overall'> }) => {
  const data = FEE_DATA[cat];
  const pct = Math.round((data.paid / data.total) * 100);
  const [slideIdx, setSlideIdx] = useState(0);

  return (
    <>
      {/* ── Summary card ── */}
      <View style={[s.summaryCard, { borderTopColor: data.color }]}>
        <View style={s.summaryTop}>
          <View>
            <Text style={s.summaryEyebrow}>{cat} Fees</Text>
            <Text style={s.summaryBig}>
              {data.paid.toLocaleString('en-IN')}
              <Text style={s.summarySlash}> / </Text>
              <Text style={s.summaryTotal}>
                {data.total.toLocaleString('en-IN')}
              </Text>
            </Text>
            <Text style={[s.summarySubLabel, { color: data.color }]}>
              Paid / Total
            </Text>
          </View>
          <View style={[s.pctRing, { borderColor: data.color + '40' }]}>
            <Text style={[s.pctRingNum, { color: data.color }]}>{pct}%</Text>
            <Text style={s.pctRingSub}>Paid</Text>
          </View>
        </View>
        <View style={s.summaryTrack}>
          <View
            style={[
              s.summaryFill,
              { width: `${pct}%`, backgroundColor: data.color },
            ]}
          />
        </View>
        <View style={s.summaryFooter}>
          <View style={s.summaryFooterItem}>
            <View style={[s.footerDot, { backgroundColor: data.color }]} />
            <Text style={s.footerLbl}>Paid </Text>
            <Text style={[s.footerVal, { color: data.color }]}>
              {fmt(data.paid)}
            </Text>
          </View>
          <View style={s.summaryFooterItem}>
            <View style={[s.footerDot, { backgroundColor: '#EF4444' }]} />
            <Text style={s.footerLbl}>Due </Text>
            <Text style={[s.footerVal, { color: '#EF4444' }]}>
              {fmt(data.total - data.paid)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Fee Breakup ── */}
      <Text style={s.sectionTitle}>Fee Breakup</Text>
      <View style={s.card}>
        <View style={s.cardTitleRow}>
          <View style={[s.cardTitleDot, { backgroundColor: data.color }]} />
          <Text style={s.cardTitleText}>Price Details</Text>
        </View>
        {data.breakup.map((r, i) => (
          <Row key={i} label={r.label} value={r.value} color={r.color} />
        ))}
        <View style={s.divider} />
        <Row
          label="Total Amount"
          value={`₹ ${calcBreakupTotal(data.breakup)}`}
          bold
        />
      </View>

      {/* ── Upcoming Dues ── */}
      <Text style={s.sectionTitle}>Upcoming Dues</Text>
      <FlatList
        data={data.upcoming}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={e =>
          setSlideIdx(Math.round(e.nativeEvent.contentOffset.x / CARD_W))
        }
        renderItem={({ item }) => (
          <View
            style={[
              s.upcomingCard,
              { width: CARD_W, borderTopColor: '#F59E0B' },
            ]}
          >
            <View style={s.upcomingHeader}>
              <View style={s.upcomingBadge}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="time-outline"
                  size={12}
                  color="#F59E0B"
                />
                <Text style={s.upcomingBadgeText}>Upcoming</Text>
              </View>
              <View style={s.dueDateChip}>
                <Text style={s.dueDateText}>Due {item.dueDate}</Text>
              </View>
            </View>
            <Text style={s.upcomingTitle}>{item.installment}</Text>
            <View style={[s.amountBox, { backgroundColor: data.color + '12' }]}>
              <Text style={s.amountBoxLabel}>Amount</Text>
              <Text style={[s.amountBoxValue, { color: data.color }]}>
                {fmt(item.subtotal - item.penalty)}
              </Text>
            </View>
            <View style={s.upcomingDetails}>
              <Row label="Penalties" value={fmt(item.penalty)} />
              <Row label="Subtotal" value={fmt(item.subtotal)} />
            </View>
            <View style={s.penaltyNote}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="alert-circle-outline"
                size={12}
                color="#EF4444"
              />
              <Text style={s.penaltyNoteText}>
                *₹100/day penalty for late payments
              </Text>
            </View>
            <View style={s.divider} />
            <Row label="Total Amount" value={fmt(item.subtotal)} bold />
            <TouchableOpacity
              style={[s.payBtn, { backgroundColor: data.color }]}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="flash"
                size={16}
                color="#fff"
              />
              <Text style={s.payBtnText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {data.upcoming.length > 1 && (
        <View style={s.dots}>
          {data.upcoming.map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i === slideIdx && { width: 18, backgroundColor: data.color },
              ]}
            />
          ))}
        </View>
      )}

      {/* ── Paid Fees ── */}
      <Text style={s.sectionTitle}>Paid Fees</Text>
      {data.paidFees.map((item, i) => (
        <View key={i} style={[s.paidCard, { borderTopColor: '#10B981' }]}>
          <View style={s.paidHeader}>
            <View style={s.paidBadge}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-circle"
                size={13}
                color="#10B981"
              />
              <Text style={s.paidBadgeText}>Paid</Text>
            </View>
            <View style={s.paidOnChip}>
              <Text style={s.paidOnText}>Paid on {item.paidOn}</Text>
            </View>
          </View>
          <Text style={s.paidTitle}>{item.installment}</Text>
          <View style={s.paidAmountBox}>
            <Text style={s.paidAmountLabel}>Amount Paid</Text>
            <Text style={s.paidAmountValue}>{`₹ ${item.subtotal.toFixed(
              2,
            )}`}</Text>
          </View>
          <View style={s.paidDetails}>
            <Row label="Due Date" value={item.dueDate} color="#10B981" />
            <Row
              label="Penalties"
              value={String(item.penalty)}
              color="#10B981"
            />
            <Row label="Subtotal" value={`₹ ${item.subtotal.toFixed(2)}`} />
          </View>
          <TouchableOpacity style={s.receiptBtn} activeOpacity={0.8}>
            <VectorIcon
              iconSet="Feather"
              iconName="download"
              size={15}
              color="#10B981"
            />
            <Text style={s.receiptBtnText}>Download Receipt</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const FeesScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<Category>('Overall');
  const tabScrollRef = useRef<ScrollView>(null);

  // TODO: wire to the fees API loader once integrated.
  const { refreshing, onRefresh } = useRefresh(() => {});

  return (
    <View style={s.root}>
      <Header title="Fee" onBackPress={() => navigation.goBack()} />

      {/* ── Tab Bar ── */}
      <View style={s.tabBarWrap}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabBar}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeTab === cat;
            const color =
              cat === 'Overall'
                ? PURPLE
                : FEE_DATA[cat as Exclude<Category, 'Overall'>]?.color ??
                  PURPLE;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveTab(cat)}
                activeOpacity={0.8}
                style={[
                  s.tabPill,
                  isActive
                    ? { backgroundColor: color }
                    : {
                        backgroundColor: color + '14',
                        borderColor: color + '30',
                        borderWidth: 1,
                      },
                ]}
              >
                {cat !== 'Overall' && (
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName={
                      FEE_DATA[cat as Exclude<Category, 'Overall'>].icon
                    }
                    size={13}
                    color={isActive ? '#fff' : color}
                  />
                )}
                <Text
                  style={[s.tabPillText, { color: isActive ? '#fff' : color }]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'Overall' ? (
          <OverallTab />
        ) : (
          <CategoryTab cat={activeTab as Exclude<Category, 'Overall'>} />
        )}
      </ScrollView>
    </View>
  );
};

export default FeesScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const __mk_s = () => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingBottom: 40 },

  // Tab bar
  tabBarWrap: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabBar: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabPillText: { fontSize: 12, fontWeight: '700' },

  // Section title
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
  },

  // ── Overall hero ──
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: '#1E1B4B',
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    shadowColor: PURPLE,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  heroBlob1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#4F46E522',
    top: -50,
    right: -40,
  },
  heroBlob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#818CF815',
    bottom: -20,
    left: 10,
  },
  heroEyebrow: {
    fontSize: 12,
    color: '#A5B4FC',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4ADE80',
    marginBottom: 2,
  },
  heroStatLbl: { fontSize: 10, color: theme.colors.textMuted, fontWeight: '600' },
  heroStatDivider: { width: 1, height: 30, backgroundColor: '#ffffff18' },
  heroTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: '#ffffff18',
    overflow: 'hidden',
  },
  heroFill: { height: '100%', borderRadius: 4, backgroundColor: '#818CF8' },

  // Category breakdown card
  catCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    paddingVertical: 6,
    // padding: 14,
    flexDirection: 'row',
    // alignItems: 'center',
    // gap: 12,
  },
  catIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catBody: { flex: 1 },
  catTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catName: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary },
  catPct: { fontSize: 13, fontWeight: '800' },
  catTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 5,
  },
  catFill: { height: '100%', borderRadius: 4 },
  catBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  catPaid: { fontSize: 11, fontWeight: '700' },
  catTotal: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },

  // Quick stats
  quickRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  quickCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  quickVal: { fontSize: 22, fontWeight: '900' },
  quickLbl: { fontSize: 10, fontWeight: '600', color: theme.colors.textSecondary },

  // ── Summary card ──
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 18,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  summaryEyebrow: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryBig: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  summarySlash: { color: '#CBD5E1', fontWeight: '400', fontSize: 20 },
  summaryTotal: { fontSize: 18, fontWeight: '600', color: theme.colors.textMuted },
  summarySubLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  pctRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  pctRingNum: { fontSize: 15, fontWeight: '900' },
  pctRingSub: { fontSize: 9, color: theme.colors.textMuted, fontWeight: '600' },
  summaryTrack: {
    height: 8,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  summaryFill: { height: '100%', borderRadius: 5 },
  summaryFooter: { flexDirection: 'row', gap: 20 },
  summaryFooterItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerDot: { width: 7, height: 7, borderRadius: 4 },
  footerLbl: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },
  footerVal: { fontSize: 12, fontWeight: '800' },

  // Shared card
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitleDot: { width: 4, height: 18, borderRadius: 3 },
  cardTitleText: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 10 },

  // Row
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: { fontSize: 13, color: theme.colors.textMuted, fontWeight: '500' },
  rowLabelBold: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  rowValue: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  rowValueBold: { fontSize: 16, fontWeight: '900', color: theme.colors.textPrimary },

  // Upcoming card
  upcomingCard: {
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 18,
    borderTopWidth: 4,
    shadowColor: '#F59E0B',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  upcomingBadgeText: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  dueDateChip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dueDateText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
  upcomingTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  amountBox: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountBoxLabel: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
  amountBoxValue: { fontSize: 22, fontWeight: '900' },
  upcomingDetails: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  penaltyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 4,
  },
  penaltyNoteText: {
    fontSize: 11,
    color: '#EF4444',
    fontStyle: 'italic',
    flex: 1,
  },
  payBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
    paddingVertical: 14,
    shadowColor: PINK,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  // Dots
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    marginTop: 8,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#E2E8F0' },

  // Paid card
  paidCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: 18,
    borderTopWidth: 4,
    shadowColor: '#10B981',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  paidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  paidBadgeText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  paidOnChip: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  paidOnText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  paidTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  paidAmountBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paidAmountLabel: { fontSize: 13, color: '#10B981', fontWeight: '600' },
  paidAmountValue: { fontSize: 22, fontWeight: '900', color: '#10B981' },
  paidDetails: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 999,
    paddingVertical: 12,
  },
  receiptBtnText: { fontSize: 14, fontWeight: '700', color: '#10B981' },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
