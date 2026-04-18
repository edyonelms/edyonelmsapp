import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { TYPE_META, FILTERS } from './calendarTypes';
import type { CalEvent, FilterType } from './calendarTypes';

interface Props {
  events: CalEvent[];
  selectedDate: string;
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  eventCount: number;
}

const EventTimeline = ({
  events,
  selectedDate,
  activeFilter,
  onFilterChange,
  eventCount,
}: Props) => {
  return (
    <View style={s.container}>
      {/* Filter chips */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 16,
          paddingTop: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
          Filter events
        </Text>
      </View>
      <View style={s.filtersRow}>
        {FILTERS.map(f => {
          const active = activeFilter === f;
          const meta = f !== 'All' ? TYPE_META[f] : null;
          return (
            <TouchableOpacity
              key={f}
              activeOpacity={0.8}
              onPress={() => onFilterChange(f)}
              style={[
                s.chip,
                active && {
                  backgroundColor: meta?.color ?? theme.colors.primary,
                },
              ]}
            >
              {f !== 'All' && (
                <VectorIcon
                  iconSet={meta!.iconSet as any}
                  iconName={meta!.icon}
                  size={11}
                  color={active ? theme.colors.white : meta!.color}
                />
              )}
              <Text
                style={[
                  s.chipText,
                  active && s.chipTextActive,
                  !active && meta && { color: meta.color },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Date label + count */}
      <View style={s.dateRow}>
        <View style={s.dateDot} />
        <Text style={s.dateText}>{selectedDate}</Text>
        <View
          style={[
            s.countBadge,
            {
              backgroundColor:
                eventCount > 0 ? theme.colors.primary : theme.colors.border,
            },
          ]}
        >
          <Text
            style={[
              s.countText,
              {
                color:
                  eventCount > 0 ? theme.colors.white : theme.colors.textMuted,
              },
            ]}
          >
            {eventCount}
          </Text>
        </View>
      </View>

      {/* Timeline or empty */}
      {events.length === 0 ? (
        <View style={s.emptyBox}>
          <View style={s.emptyIconRing}>
            <VectorIcon
              iconSet="FontAwesome6"
              iconName="calendar-xmark"
              size={36}
              color={theme.colors.primary}
            />
          </View>
          <Text style={s.emptyTitle}>Nothing here</Text>
          <Text style={s.emptySubtitle}>No events scheduled for this date</Text>
        </View>
      ) : (
        <View style={s.timeline}>
          {events.map((event, idx) => {
            const meta = TYPE_META[event.type];
            const isLast = idx === events.length - 1;
            return (
              <View key={event.id} style={s.timelineRow}>
                <View style={s.timelineLeft}>
                  <View
                    style={[s.timelineDot, { backgroundColor: meta.color }]}
                  >
                    <VectorIcon
                      iconSet={meta.iconSet as any}
                      iconName={meta.icon}
                      size={10}
                      color={theme.colors.white}
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        s.timelineLine,
                        { backgroundColor: meta.color + '40' },
                      ]}
                    />
                  )}
                </View>
                <View style={[s.eventCard, { borderLeftColor: meta.color }]}>
                  <View style={s.cardTop}>
                    <Text style={s.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <View style={[s.typeBadge, { backgroundColor: meta.bg }]}>
                      <Text style={[s.typeBadgeText, { color: meta.color }]}>
                        {event.type}
                      </Text>
                    </View>
                  </View>
                  {event.time && (
                    <View style={s.timeRow}>
                      <VectorIcon
                        iconSet="Feather"
                        iconName="clock"
                        size={11}
                        color={theme.colors.textMuted}
                      />
                      <Text style={s.timeText}>{event.time}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default EventTimeline;

const s = StyleSheet.create({
  container: { flex: 1 },

  // Filters
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: { color: theme.colors.white },

  // Date row
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 11, fontWeight: '800' },

  // Empty
  emptyBox: { alignItems: 'center', paddingTop: 30 },
  emptyIconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  // Timeline
  timeline: { paddingHorizontal: 20, paddingBottom: 40 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineLeft: { alignItems: 'center', width: 28 },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineLine: { width: 2, flex: 1, marginVertical: 4, borderRadius: 1 },
  eventCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eventTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  typeBadge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timeText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },
});
