import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { WEEK_LABELS, STATUS_META, ATTENDANCE_DATA } from './attendanceTypes';
import type { AttendanceStatus } from './attendanceTypes';

const { width } = Dimensions.get('window');
export const CELL_SIZE = Math.floor((width - 32) / 7);

interface Props {
  currentMonth: moment.Moment;
  selectedDate: string;
  today: string;
  weeks: (string | null)[][];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPickerOpen: () => void;
  onDayPress: (day: string) => void;
}

const DOT_COLOR: Record<AttendanceStatus, string> = {
  present: '#4ADE80',
  absent: '#F87171',
  leave: '#FBBF24',
  holiday: '#A5B4FC',
};

const AttendanceCalendar = ({
  currentMonth,
  selectedDate,
  today,
  weeks,
  onPrevMonth,
  onNextMonth,
  onPickerOpen,
  onDayPress,
}: Props) => {
  const monthKey = currentMonth.format('YYYY-MM');
  const data = ATTENDANCE_DATA[monthKey] ?? {};

  return (
    <View style={s.header}>
      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity
          onPress={onPickerOpen}
          style={s.monthPill}
          activeOpacity={0.8}
        >
          <Text style={s.monthPillText}>
            {currentMonth.format('MMMM YYYY')}
          </Text>
          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-down"
            size={14}
            color="#C7D2FE"
          />
        </TouchableOpacity>
        <View style={s.navPair}>
          <TouchableOpacity onPress={onPrevMonth} style={s.navBtn}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chevron-back"
              size={15}
              color="#C7D2FE"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNextMonth} style={s.navBtn}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chevron-forward"
              size={15}
              color="#C7D2FE"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Legend */}
      <View style={s.legend}>
        {(['present', 'absent', 'leave', 'holiday'] as AttendanceStatus[]).map(
          k => (
            <View key={k} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: DOT_COLOR[k] }]} />
              <Text style={s.legendText}>{STATUS_META[k].label}</Text>
            </View>
          ),
        )}
      </View>

      {/* Week labels */}
      <View style={s.weekRow}>
        {WEEK_LABELS.map((l, i) => (
          <View key={i} style={s.cell}>
            <Text
              style={[
                s.weekLabel,
                i === 5 && s.satLabel,
                i === 6 && s.sunLabel,
              ]}
            >
              {l}
            </Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={s.weekRow}>
          {week.map((day, di) => {
            if (!day) return <View key={`e${wi}${di}`} style={s.cell} />;
            const dayNum = moment(day).date();
            const status = data[dayNum] as AttendanceStatus | undefined;
            const isSelected = day === selectedDate;
            const isToday = day === today;
            const dow = moment(day).day(); // 0=Sun

            return (
              <TouchableOpacity
                key={day}
                activeOpacity={0.75}
                onPress={() => onDayPress(day)}
                style={s.cell}
              >
                <View
                  style={[
                    s.dayInner,
                    isSelected && s.daySelected,
                    isToday && !isSelected && s.dayToday,
                    status &&
                      !isSelected && {
                        backgroundColor: DOT_COLOR[status] + '28',
                      },
                  ]}
                >
                  <Text
                    style={[
                      s.dayNum,
                      isSelected && s.dayNumSelected,
                      isToday && !isSelected && s.dayNumToday,
                      dow === 0 && !isSelected && s.sunNum,
                      dow === 6 && !isSelected && s.satNum,
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {status && (
                    <View
                      style={[
                        s.statusDot,
                        { backgroundColor: DOT_COLOR[status] },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <View style={{ height: 32 }} />
    </View>
  );
};

export default AttendanceCalendar;

const s = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingTop: 14,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff18',
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  monthPillText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  navPair: {
    flexDirection: 'row',
    gap: 6,
  },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    backgroundColor: '#ffffff18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: { fontSize: 11, color: '#A5B4FC', fontWeight: '600' },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  cell: { width: CELL_SIZE, alignItems: 'center', paddingVertical: 2 },
  weekLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A5B4FC',
    paddingVertical: 4,
  },
  satLabel: { color: '#FCD34D' },
  sunLabel: { color: '#FCA5A5' },
  dayInner: {
    width: CELL_SIZE - 8,
    height: CELL_SIZE - 8,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: theme.colors.primary + '90',
  },
  dayToday: {
    borderWidth: 1.5,
    borderColor: '#A5B4FC',
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E0E7FF',
  },
  dayNumSelected: {
    color: '#fff',
    fontWeight: '800',
  },
  dayNumToday: {
    color: '#A5B4FC',
    fontWeight: '800',
  },
  satNum: {
    color: '#FCD34D',
  },
  sunNum: {
    color: '#FCA5A5',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    position: 'absolute',
    bottom: 3,
  },
});
