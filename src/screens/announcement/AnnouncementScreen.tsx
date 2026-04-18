import React, { useState, useMemo } from 'react';
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
import { ANNOUNCEMENTS, FILTERS } from './announcementData';
import type { FilterKey, Announcement } from './announcementData';
import AnnouncementCard from './AnnouncementCard';

const AnnouncementScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('15 Days');

  const filtered = useMemo(() => {
    const f = FILTERS.find(f => f.label === activeFilter)!;
    if (f.days === 0) return ANNOUNCEMENTS.filter(d => d.daysAgo === 0);
    return ANNOUNCEMENTS.filter(d => d.daysAgo <= f.days);
  }, [activeFilter]);

  const handleCardPress = (item: Announcement) => {
    navigation.navigate('ViewAnnouncement', { item });
  };

  return (
    <View style={s.root}>
      <Header title="Announcement" onBackPress={() => navigation.goBack()} />

      {/* Filter chips */}
      <View style={s.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersRow}
        >
          {FILTERS.map(f => {
            const active = activeFilter === f.label;
            return (
              <TouchableOpacity
                key={f.label}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f.label)}
                style={[s.chip, active && s.chipActive]}
              >
                {active && (
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="checkmark-circle"
                    size={13}
                    color="#fff"
                  />
                )}
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
      >
        {filtered.length === 0 ? (
          <View style={s.emptyBox}>
            <View style={s.emptyIconRing}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="megaphone-outline"
                size={36}
                color={theme.colors.primary}
              />
            </View>
            <Text style={s.emptyTitle}>No announcements</Text>
            <Text style={s.emptySubtitle}>Nothing posted in this period</Text>
          </View>
        ) : (
          filtered.map(item => (
            <AnnouncementCard
              key={item.id}
              item={item}
              onPress={handleCardPress}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default AnnouncementScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  filtersWrapper: { paddingVertical: 12 },
  filtersRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: { color: theme.colors.white },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 4,
    gap: 14,
  },

  emptyBox: { alignItems: 'center', paddingTop: 60 },
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
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },
});
