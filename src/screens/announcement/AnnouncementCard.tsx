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
          <View style={[s.iconBox, { backgroundColor: tag.bgColor }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="megaphone"
              size={20}
              color={tag.color}
            />
          </View>

          <View style={s.meta}>
            <View style={s.titleRow}>
              <Text style={s.title} numberOfLines={1}>
                {item.title}
              </Text>
              {item.isNew && (
                <View style={s.newPill}>
                  <Text style={s.newPillText}>New</Text>
                </View>
              )}
            </View>
            <View style={s.metaRow}>
              <View style={[s.tagPill, { backgroundColor: tag.bgColor }]}>
                <Text style={[s.tagText, { color: tag.color }]}>
                  {item.tag}
                </Text>
              </View>
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

          <VectorIcon
            iconSet="Ionicons"
            iconName="chevron-forward"
            size={16}
            color={theme.colors.textMuted}
          />
        </View>

        {/* Body preview */}
        {!!item.content && (
          <Text style={s.body} numberOfLines={1}>
            {item.content}
          </Text>
        )}

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
    </TouchableOpacity>
  );
};

export default AnnouncementCard;

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
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
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  newPill: {
    backgroundColor: '#DCFCE7',
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.success,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagPill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  tagText: { fontSize: 10, fontWeight: '700' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },
  body: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: 10,
  },
  attachRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
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
});
