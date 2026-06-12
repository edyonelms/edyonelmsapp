import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ScrollView, StatusBar, StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { theme } from '../../utils/theme';
import { FILTERS, chunkWeeks, groupEventsByDate, getEventTypesForDate } from './calendarTypes';
import type { FilterType, CalEvent } from './calendarTypes';
import CalendarHeader from './CalendarHeader';
import MonthYearPicker from './MonthYearPicker';
import EventTimeline from './EventTimeline';
import Header from '../../components/Header';
import { getCalendarEvents, mapApiEventToCalEvent, ApiEvent } from '../../api/calendarApi';

const CalendarScreen = ({ navigation }: any) => {
  const today = moment().format('YYYY-MM-DD');
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [pickerVisible, setPickerVisible] = useState(false);
  
  // API states
  const [allEvents, setAllEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events when month changes
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const startDate = currentMonth.clone().startOf('month').format('YYYY-MM-DD');
    const endDate = currentMonth.clone().endOf('month').format('YYYY-MM-DD');
    
    console.log('[CalendarScreen] Fetching events for month:', startDate, 'to', endDate);
    
    try {
      const apiEvents = await getCalendarEvents(startDate, endDate, undefined, 100);
      console.log('[CalendarScreen] Received events count:', apiEvents.length);
      
      const mappedEvents = apiEvents.map(mapApiEventToCalEvent);
      console.log('[CalendarScreen] Mapped events count:', mappedEvents.length);
      
      setAllEvents(mappedEvents);
    } catch (err: any) {
      console.error('[CalendarScreen] Error fetching events:', err?.message);
      setError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Group events by date for quick lookup in calendar
  const eventsByDate = useMemo(() => {
    return groupEventsByDate(allEvents);
  }, [allEvents]);

  // Get event types for each date (for calendar dots)
  const eventDates = useMemo(() => {
    const map: Record<string, Exclude<FilterType, 'All'>[]> = {};
    Object.keys(eventsByDate).forEach(date => {
      map[date] = getEventTypesForDate(eventsByDate[date]);
    });
    return map;
  }, [eventsByDate]);

  // Filter events for selected date
  const filteredEvents = useMemo(() => {
    const dayEvents = eventsByDate[selectedDate] || [];
    if (activeFilter === 'All') {
      return dayEvents;
    }
    return dayEvents.filter(e => e.type === activeFilter);
  }, [selectedDate, activeFilter, eventsByDate]);

  // Calculate total events count for current month (for header badge)
  const totalEvents = useMemo(() => {
    const monthStr = currentMonth.format('YYYY-MM');
    return allEvents.filter(e => e.date.startsWith(monthStr)).length;
  }, [allEvents, currentMonth]);

  // Generate calendar weeks
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

  return (
    <View style={s.root}>
      <Header title="Calendar" backgroundColor="#FAF9F6" />
      
      {loading ? (
        <View style={s.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={s.loaderText}>Loading events...</Text>
        </View>
      ) : error ? (
        <View style={s.loaderContainer}>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchEvents}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
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

          {/* Events sheet */}
          <View style={s.sheet}>
            <EventTimeline
              events={filteredEvents}
              selectedDate={moment(selectedDate).format('dddd, MMMM D, YYYY')}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              eventCount={filteredEvents.length}
            />
          </View>
        </ScrollView>
      )}

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
  root: { flex: 1, backgroundColor: '#FAF9F6' },
  sheet: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -20,
    paddingBottom: 24,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.white,
  },
});