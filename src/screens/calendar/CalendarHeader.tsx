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
import { WEEK_LABELS, TYPE_META } from './calendarTypes';
import type { FilterType } from './calendarTypes';

const { width } = Dimensions.get('window');
export const CELL_SIZE = Math.floor((width - 32) / 7);

interface Props {
  currentMonth: moment.Moment;
  selectedDate: string;
  today: string;
  weeks: (string | null)[][];
  eventDates: Record<string, Exclude<FilterType, 'All'>[]>;
  totalEvents: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPickerOpen: () => void;
  onDayPress: (day: string) => void;
}

const CalendarHeader = ({
  currentMonth,
  selectedDate,
  today,
  weeks,
  eventDates,
  totalEvents,
  onPrevMonth,
  onNextMonth,
  onPickerOpen,
  onDayPress,
}: Props) => {
  return (
    <View style={s.header}>
      <View style={s.blob1} />
      <View style={s.blob2} />
      <View style={s.blob3} />

      {/* Top bar */}
      <View style={s.topBar}>
        {/* Month pill — opens picker */}
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

        <View style={s.rightSide}>
          <Text style={s.eventCountText}>{totalEvents} events</Text>
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
            const isSelected = day === selectedDate;
            const isToday = day === today;
            const dots = eventDates[day] ?? [];
            const dow = moment(day).day();
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
                    {moment(day).date()}
                  </Text>
                </View>
                {dots.length > 0 && (
                  <View style={s.dotsRow}>
                    {dots.slice(0, 3).map((t, ti) => (
                      <View
                        key={ti}
                        style={[s.dot, { backgroundColor: TYPE_META[t].color }]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <View style={{ height: 20 }} />
    </View>
  );
};

export default CalendarHeader;

const s = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingTop: 14,
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${theme.colors.primary}20`,
    top: -60,
    right: -40,
  },
  blob2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#818CF820',
    bottom: 20,
    left: -20,
  },
  blob3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}15`,
    top: 30,
    left: width / 2 - 40,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
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
  monthPillText: { fontSize: 16, fontWeight: '800', color: theme.colors.white },
  rightSide: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventCountText: { fontSize: 11, color: '#A5B4FC', fontWeight: '600' },
  navPair: { flexDirection: 'row', gap: 6 },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    backgroundColor: '#ffffff18',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekRow: { flexDirection: 'row', marginBottom: 2 },
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
    borderRadius: theme.radius.md,
  },
  dayToday: { borderWidth: 1.5, borderColor: '#A5B4FC' },
  dayNum: { fontSize: 13, fontWeight: '600', color: '#E0E7FF' },
  dayNumSelected: { color: theme.colors.white, fontWeight: '800' },
  dayNumToday: { color: '#A5B4FC', fontWeight: '800' },
  satNum: { color: '#FCD34D' },
  sunNum: { color: '#FCA5A5' },

  dotsRow: { flexDirection: 'row', gap: 4, position: 'absolute', bottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 99 },
});
