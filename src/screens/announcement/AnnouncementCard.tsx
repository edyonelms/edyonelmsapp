import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { TAG_META } from './announcementData';
import type { Announcement } from './announcementData';

interface Props {
  item: Announcement;
  onPress: (item: Announcement) => void;
}

const AnnouncementCard = ({ item, onPress }: Props) => {
  const tag = TAG_META[item.tag];
  const timeLabel = item.daysAgo === 0 ? 'Today' : `${item.daysAgo}d ago`;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      style={s.card}
    >
      {/* Left accent bar */}
      <View style={[s.accent, { backgroundColor: tag.color }]} />

      <View style={s.inner}>
        {/* Top row */}
        <View style={s.topRow}>
          <View style={[s.iconBox, { backgroundColor: tag.bg }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="megaphone"
              size={20}
              color={tag.color}
            />
          </View>

          <View style={s.meta}>
            <Text style={s.title}>{item.title}</Text>
            <View style={s.timeRow}>
              <VectorIcon
                iconSet="Feather"
                iconName="clock"
                size={11}
                color={theme.colors.textMuted}
              />
              <Text style={s.timeText}>{timeLabel}</Text>
            </View>
          </View>
        </View>

        {/* Body preview - FIXED: changed from item.body to item.content */}
        <Text style={s.body} numberOfLines={2}>
          {item.content}
        </Text>

        {/* Attachments hint */}
        {(item.hasImage || item.hasPdf) && (
          <View style={s.attachRow}>
            {item.hasImage && (
              <View style={s.attachChip}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="image"
                  size={11}
                  color={tag.color}
                />
                <Text style={[s.attachText, { color: tag.color }]}>Image</Text>
              </View>
            )}
            {item.hasPdf && (
              <View style={s.attachChip}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="file-text"
                  size={11}
                  color={tag.color}
                />
                <Text style={[s.attachText, { color: tag.color }]}>PDF</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Chevron */}
      <View style={s.chevronBox}>
        <VectorIcon
          iconSet="Ionicons"
          iconName="chevron-forward"
          size={16}
          color={theme.colors.textMuted}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AnnouncementCard;

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  accent: { width: 4, alignSelf: 'stretch' },
  inner: { flex: 1, padding: 14 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },
  rightCol: { alignItems: 'center', gap: 6, flexDirection: 'row' },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  tagPill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { fontSize: 10, fontWeight: '700' },
  body: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 20 },
  attachRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  attachChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  attachText: { fontSize: 11, fontWeight: '600' },
  chevronBox: { paddingRight: 12 },
});