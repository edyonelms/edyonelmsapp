import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { STATUS_META } from './queryTypes';
import type { Query } from './queryTypes';

interface Props {
  item: Query;
}

const QueryCard = ({ item }: Props) => {
  const meta = STATUS_META[item.status];
  const timeLabel = item.daysAgo === 0 ? 'Today' : `${item.daysAgo}d ago`;
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <View style={s.card}>
      {/* Accent bar */}
      <View style={[s.accentBar, { backgroundColor: meta.color }]} />

      <View style={s.cardInner}>
        {/* Top row: icon + subject/time + status badge */}
        <View style={s.cardTop}>
          <View style={[s.iconWrap, { backgroundColor: meta.bg }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chatbubble-ellipses-outline"
              size={18}
              color={meta.color}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle} numberOfLines={1}>
              {item.subject}
            </Text>
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
          <View style={[s.badge, { backgroundColor: meta.bg }]}>
            <View style={[s.badgeDot, { backgroundColor: meta.color }]} />
            <Text style={[s.badgeText, { color: meta.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Message preview */}
        <Text style={s.message} numberOfLines={2}>
          {item.message}
        </Text>

        {/* Attachment */}
        {item.attachmentName && (
          <View style={s.attachRow}>
            <VectorIcon
              iconSet="Feather"
              iconName="paperclip"
              size={11}
              color={theme.colors.primary}
            />
            <Text style={s.attachText}>{item.attachmentName}</Text>
          </View>
        )}
      </View>

      {/* Admin reply toggle (exam-card actions template) */}
      {!!item.admin_reply && (
        <>
          <View style={s.actionsRow}>
            <TouchableOpacity
              style={s.actionBtn}
              onPress={() => setReplyOpen(v => !v)}
              activeOpacity={0.7}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="chatbox-ellipses-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text style={s.actionText}>
                {replyOpen ? 'Hide Reply' : 'View Reply'}
              </Text>
              <VectorIcon
                iconSet="Ionicons"
                iconName={replyOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          {replyOpen && (
            <View style={s.replyBox}>
              <View style={s.replyHeader}>
                <View style={[s.replyDot, { backgroundColor: meta.color }]} />
                <Text style={s.replyTitle}>School's Reply</Text>
              </View>
              <Text style={s.replyText}>{item.admin_reply}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default QueryCard;

const s = StyleSheet.create({
  // Card (shared template)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md, gap: 8 },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },

  // Status badge (shared template)
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

  message: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
  },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  attachText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Reply toggle (exam-card actions template)
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  replyBox: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: 6,
  },
  replyHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  replyDot: { width: 7, height: 7, borderRadius: 4 },
  replyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  replyText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    paddingLeft: 14,
  },
});
