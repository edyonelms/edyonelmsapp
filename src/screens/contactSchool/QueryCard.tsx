import React from 'react';
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

  return (
    <View style={s.card}>
      <View style={[s.accent, { backgroundColor: meta.color }]} />

      <View style={s.inner}>
        {/* Top row */}
        <View style={s.topRow}>
          <View style={[s.iconBox, { backgroundColor: meta.bg }]}>
            <VectorIcon iconSet="Ionicons" iconName="chatbubble-ellipses" size={18} color={meta.color} />
          </View>
          <View style={s.meta}>
            <Text style={s.subject} numberOfLines={1}>{item.subject}</Text>
            <View style={s.timeRow}>
              <VectorIcon iconSet="Feather" iconName="clock" size={11} color={theme.colors.textMuted} />
              <Text style={s.timeText}>{timeLabel}</Text>
            </View>
          </View>
          <View style={[s.statusBadge, { backgroundColor: meta.bg }]}>
            <Text style={[s.statusText, { color: meta.color }]}>{item.status}</Text>
          </View>
        </View>

        {/* Message preview */}
        <Text style={s.message} numberOfLines={2}>{item.message}</Text>

        {/* Attachment */}
        {item.attachmentName && (
          <View style={s.attachRow}>
            <VectorIcon iconSet="Feather" iconName="paperclip" size={11} color={theme.colors.textMuted} />
            <Text style={s.attachText}>{item.attachmentName}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default QueryCard;

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
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  iconBox: {
    width: 38, height: 38, borderRadius: theme.radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  meta: { flex: 1 },
  subject: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 3 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
  statusBadge: { borderRadius: theme.radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: '700' },
  message: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginBottom: 6 },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  attachText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
});
