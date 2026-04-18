import React, { useState, useMemo } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { theme } from '../../utils/theme';
import { EVENTS, chunkWeeks } from './calendarTypes';
import type { FilterType } from './calendarTypes';
import CalendarHeader from './CalendarHeader';
import MonthYearPicker from './MonthYearPicker';
import EventTimeline from './EventTimeline';
import Header from '../../components/Header';

const CalendarScreen = ({ navigation }: any) => {
  const today = moment().format('YYYY-MM-DD');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [pickerVisible, setPickerVisible] = useState(false);

  const weeks = useMemo(() => {
    const start = currentMonth.clone().startOf('month');
    const end = currentMonth.clone().endOf('month');
    const offset = (start.day() + 6) % 7;
    const days: (string | null)[] = Array(offset).fill(null);
    for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, 'day'))
      days.push(d.format('YYYY-MM-DD'));
    while (days.length % 7 !== 0) days.push(null);
    return chunkWeeks(days);
  }, [currentMonth]);

  const eventDates = useMemo(() => {
    const map: Record<string, Exclude<FilterType, 'All'>[]> = {};
    EVENTS.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e.type);
    });
    return map;
  }, []);

  const filteredEvents = useMemo(
    () =>
      EVENTS.filter(
        e =>
          e.date === selectedDate &&
          (activeFilter === 'All' || e.type === activeFilter),
      ),
    [selectedDate, activeFilter],
  );

  const totalEvents = EVENTS.filter(e =>
    e.date.startsWith(currentMonth.format('YYYY-MM')),
  ).length;

  return (
    <View style={s.root}>
      <Header title="Calendar" />
      <CalendarHeader
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        today={today}
        weeks={weeks}
        eventDates={eventDates}
        totalEvents={totalEvents}
        onPrevMonth={() => setCurrentMonth(m => m.clone().subtract(1, 'month'))}
        onNextMonth={() => setCurrentMonth(m => m.clone().add(1, 'month'))}
        onPickerOpen={() => setPickerVisible(true)}
        onDayPress={setSelectedDate}
      />

      {/* Bottom sheet */}
      <View style={s.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <EventTimeline
            events={filteredEvents}
            selectedDate={moment(selectedDate).format('dddd, MMMM D, YYYY')}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            eventCount={filteredEvents.length}
          />
        </ScrollView>
      </View>

      <MonthYearPicker
        visible={pickerVisible}
        current={currentMonth}
        onClose={() => setPickerVisible(false)}
        onSelect={m => setCurrentMonth(m)}
      />
    </View>
  );
};

export default CalendarScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.textPrimary },
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
});
