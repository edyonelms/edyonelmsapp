import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import moment from 'moment';
import Header from '../../components/Header';
import { theme } from '../../utils/theme';
import { chunkWeeks, computeStats } from './attendanceTypes';
import AttendanceCalendar from './AttendanceCalendar';
import AttendanceStats from './AttendanceStats';
import MonthYearPicker from '../calendar/MonthYearPicker';

const AttendanceScreen = () => {
  const today = moment().format('YYYY-MM-DD');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(today);
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

  const stats = useMemo(
    () => computeStats(currentMonth.format('YYYY-MM')),
    [currentMonth],
  );

  return (
    <View style={s.root}>
      <Header title="Attendance" />

      <AttendanceCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        today={today}
        weeks={weeks}
        onPrevMonth={() => setCurrentMonth(m => m.clone().subtract(1, 'month'))}
        onNextMonth={() => setCurrentMonth(m => m.clone().add(1, 'month'))}
        onPickerOpen={() => setPickerVisible(true)}
        onDayPress={setSelectedDate}
      />

      {/* White bottom sheet */}
      <View style={s.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <AttendanceStats {...stats} />
        </ScrollView>
      </View>

      <MonthYearPicker
        visible={pickerVisible}
        current={currentMonth}
        onClose={() => setPickerVisible(false)}
        onSelect={m => {
          setCurrentMonth(m);
          setSelectedDate(m.format('YYYY-MM-DD'));
        }}
      />
    </View>
  );
};

export default AttendanceScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.textPrimary },
  sheet: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    marginTop: -22,
  },
});
