import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { ATTENDANCE_DATA, STATUS_META, computeStats } from './attendanceTypes';
import type { AttendanceStatus } from './attendanceTypes';
import MonthYearPicker from '../calendar/MonthYearPicker';

const AttendanceScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [pickerVisible, setPickerVisible] = useState(false);

  const monthKey = currentMonth.format('YYYY-MM');
  const today = moment().format('YYYY-MM-DD');

  const days = useMemo(() => {
    const data = ATTENDANCE_DATA[monthKey] ?? {};
    const totalDays = currentMonth.daysInMonth();
    return Array.from({ length: totalDays }, (_, i) => {
      const d = i + 1;
      const m = moment(`${monthKey}-${String(d).padStart(2, '0')}`, 'YYYY-MM-DD');
      return {
        serial: d,
        date: m.format('DD MMM'),
        day: m.format('ddd'),
        isToday: m.format('YYYY-MM-DD') === today,
        status: (data[d] ?? null) as AttendanceStatus | null,
      };
    });
  }, [monthKey, currentMonth, today]);

  const stats = useMemo(() => computeStats(monthKey), [monthKey]);

  return (
    <View style={s.root}>
      <Header title="Attendance" />

      {/* ── Month selector ── */}
      <View style={s.monthBar}>
        <TouchableOpacity
          style={s.monthArrow}
          onPress={() => setCurrentMonth(m => m.clone().subtract(1, 'month'))}
          activeOpacity={0.7}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-back"
            size={18}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={s.monthLabelBtn}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.8}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="calendar-outline"
            size={15}
            color={theme.colors.primary}
          />
          <Text style={s.monthLabelText}>
            {currentMonth.format('MMMM YYYY')}
          </Text>
          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-down"
            size={14}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={s.monthArrow}
          onPress={() => setCurrentMonth(m => m.clone().add(1, 'month'))}
          activeOpacity={0.7}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-forward"
            size={18}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Single month card ── */}
        <View style={s.card}>
          <View style={[s.accentBar, { backgroundColor: theme.colors.primary }]} />
          <View style={s.cardInner}>
            <View style={s.cardTop}>
              <View style={s.iconWrap}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="clipboard-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>
                  {currentMonth.format('MMMM YYYY')}
                </Text>
                <Text style={s.cardSubtitle}>
                  {stats.workDays} working days · {stats.presentDays} present
                </Text>
              </View>
              <View style={s.pctBadge}>
                <Text style={s.pctBadgeText}>{stats.presentPct}%</Text>
              </View>
            </View>

            {/* Table header */}
            <View style={[s.tableRow, s.tableHead]}>
              <Text style={[s.tableHeadText, s.colSerial]}>#</Text>
              <Text style={[s.tableHeadText, s.colDate]}>Date</Text>
              <Text style={[s.tableHeadText, s.colDay]}>Day</Text>
              <Text style={[s.tableHeadText, s.colStatus]}>Status</Text>
            </View>

            {/* Day rows */}
            {days.map((row, i) => {
              const sc = row.status ? STATUS_META[row.status] : null;
              return (
                <View
                  key={row.serial}
                  style={[
                    s.tableRow,
                    i < days.length - 1 && s.rowBorder,
                    row.isToday && s.todayRow,
                  ]}
                >
                  <Text style={[s.serialText, s.colSerial]}>{row.serial}</Text>
                  <Text style={[s.dateText, s.colDate]}>{row.date}</Text>
                  <Text style={[s.dayText, s.colDay]}>{row.day}</Text>
                  <View style={[s.colStatusBox, s.colStatus]}>
                    {sc ? (
                      <View style={[s.badge, { backgroundColor: sc.bg }]}>
                        <View
                          style={[s.badgeDot, { backgroundColor: sc.color }]}
                        />
                        <Text style={[s.badgeText, { color: sc.color }]}>
                          {sc.label}
                        </Text>
                      </View>
                    ) : (
                      <Text style={s.noDataText}>–</Text>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Footer totals */}
            <View style={s.tableFooter}>
              <View style={s.footerItem}>
                <View
                  style={[
                    s.footerDot,
                    { backgroundColor: STATUS_META.present.color },
                  ]}
                />
                <Text style={s.footerLabel}>Present</Text>
                <Text style={s.footerValue}>{stats.presentDays}</Text>
              </View>
              <View style={s.footerDivider} />
              <View style={s.footerItem}>
                <View
                  style={[
                    s.footerDot,
                    { backgroundColor: STATUS_META.absent.color },
                  ]}
                />
                <Text style={s.footerLabel}>Absent</Text>
                <Text style={s.footerValue}>{stats.absentDays}</Text>
              </View>
              <View style={s.footerDivider} />
              <View style={s.footerItem}>
                <View
                  style={[
                    s.footerDot,
                    { backgroundColor: STATUS_META.leave.color },
                  ]}
                />
                <Text style={s.footerLabel}>Leave</Text>
                <Text style={s.footerValue}>{stats.leaveDays}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <MonthYearPicker
        visible={pickerVisible}
        current={currentMonth}
        onClose={() => setPickerVisible(false)}
        onSelect={m => setCurrentMonth(m)}
      />
    </View>
  );
};

export default AttendanceScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, paddingBottom: 32 },

  // Month selector bar
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  monthArrow: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  monthLabelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  monthLabelText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Card (timetable template)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
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
  pctBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pctBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },

  // Table
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
  },
  tableHead: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingVertical: 8,
    marginBottom: 2,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  todayRow: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.sm,
  },
  tableHeadText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  colSerial: { width: 28 },
  colDate: { flex: 1 },
  colDay: { flex: 1 },
  colStatus: { flex: 1.4, textAlign: 'right' },
  colStatusBox: { alignItems: 'flex-end' },
  serialText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dayText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  noDataText: { fontSize: 12, color: theme.colors.textMuted },

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
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Footer totals
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  footerDot: { width: 7, height: 7, borderRadius: 4 },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  footerDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
});
