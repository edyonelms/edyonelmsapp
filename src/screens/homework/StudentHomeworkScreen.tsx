import React, { useRef, useState } from 'react';
import {
  Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { Homework, HOMEWORK_STORE } from './homeworkData';

const PRIMARY = theme.colors.primary;

// Last 15 days ending today — today sits at the far right of the strip
const buildDays = (): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  for (let i = -14; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const toKey = (d: Date) => d.toISOString().slice(0, 10);

const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Homework card (exam-card template) ───────────────────────────────────────
const HWCard = ({
  hw,
  isCompleted,
  expanded,
  onToggleExpand,
  onToggleComplete,
}: {
  hw: Homework;
  isCompleted: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}) => (
  <View style={s.card}>
    {/* Accent bar */}
    <View style={[s.accentBar, { backgroundColor: isCompleted ? '#22C55E' : hw.subjectColor }]} />

    <View style={s.cardInner}>
      {/* Top row: icon + title/desc + status badge */}
      <View style={s.cardTop}>
        <View style={[s.iconWrap, { backgroundColor: hw.subjectColor + '20' }]}>
          <Text style={s.iconEmoji}>{hw.subjectIcon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.hwName, isCompleted && s.hwNameDone]} numberOfLines={1}>
            {hw.title}
          </Text>
          <Text style={s.hwSubtitle} numberOfLines={1}>
            {hw.description}
          </Text>
        </View>
        <View style={[s.badge, { backgroundColor: isCompleted ? '#DCFCE7' : '#FEF3C7' }]}>
          <View style={[s.badgeDot, { backgroundColor: isCompleted ? '#16A34A' : '#D97706' }]} />
          <Text style={[s.badgeText, { color: isCompleted ? '#16A34A' : '#D97706' }]}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Info pills row: subject + teacher */}
      <View style={s.pillsRow}>
        <View style={[s.pill, { backgroundColor: hw.subjectColor + '15' }]}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="book-outline"
            size={12}
            color={hw.subjectColor}
          />
          <Text style={[s.pillText, { color: hw.subjectColor }]}>{hw.subjectName}</Text>
        </View>
        <View style={s.pill}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="person-outline"
            size={12}
            color={PRIMARY}
          />
          <Text style={s.pillText}>{hw.teacherName}</Text>
        </View>
      </View>
    </View>

    {/* Bottom action row — exam-card toggle template */}
    <View style={s.actionsRow}>
      <TouchableOpacity style={s.actionBtn} onPress={onToggleExpand} activeOpacity={0.7}>
        <Text style={s.actionText}>
          {expanded ? 'Hide Homework' : 'View Homework'}
        </Text>
        <VectorIcon
          iconSet="Ionicons"
          iconName={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={PRIMARY}
        />
      </TouchableOpacity>
      <View style={s.actionDivider} />
      {isCompleted ? (
        <View style={s.actionBtn}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="checkmark-circle"
            size={14}
            color="#16A34A"
          />
          <Text style={[s.actionText, { color: '#16A34A' }]}>Completed</Text>
        </View>
      ) : (
        <TouchableOpacity style={s.actionBtn} onPress={onToggleComplete} activeOpacity={0.7}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="checkmark-circle-outline"
            size={14}
            color="#16A34A"
          />
          <Text style={[s.actionText, { color: '#16A34A' }]}>Mark as Complete</Text>
        </TouchableOpacity>
      )}
    </View>

    {/* Description expanded */}
    {expanded && (
      <View style={s.descBox}>
        <View style={s.descHeader}>
          <View style={[s.subjectDot, { backgroundColor: hw.subjectColor }]} />
          <Text style={s.descTitle}>Description</Text>
        </View>
        <Text style={s.descText}>{hw.description}</Text>
      </View>
    )}
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const StudentHomeworkScreen = ({ navigation }: any) => {
  const days = buildDays();
  const todayKey = toKey(new Date());
  const stripRef = useRef<ScrollView>(null);
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmHw, setConfirmHw] = useState<Homework | null>(null);

  const homeworks: Homework[] = HOMEWORK_STORE.filter(h => h.dueDate === selectedKey);
  const pending   = homeworks.filter(h => !completedIds.includes(h.id));
  const completed = homeworks.filter(h => completedIds.includes(h.id));

  // One-way: once confirmed complete, it cannot be reversed.
  const confirmComplete = () => {
    if (confirmHw) setCompletedIds(prev => [...prev, confirmHw.id]);
    setConfirmHw(null);
  };

  const selectedDate = new Date(selectedKey + 'T00:00:00');
  const listTitle =
    selectedKey === todayKey
      ? "Today's Homework"
      : `Homework · ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]}`;

  return (
    <SafeAreaView style={s.root}>
      <Header title="Homework" onBackPress={() => navigation.goBack()} />

      {/* ── Date strip (last 15 days, today at the end) ── */}
      <View style={s.dateStripWrap}>
        <View style={s.stripHeader}>
          <Text style={s.monthLabel}>
            {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <Text style={s.stripHint}>Last 15 days</Text>
        </View>
        <ScrollView
          ref={stripRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.dateStrip}
          onContentSizeChange={() => stripRef.current?.scrollToEnd({ animated: false })}
        >
          {days.map(d => {
            const key     = toKey(d);
            const active  = key === selectedKey;
            const isToday = key === todayKey;
            const hasHW   = HOMEWORK_STORE.some(h => h.dueDate === key);
            return (
              <TouchableOpacity
                key={key}
                style={[s.dateCell, active && s.dateCellActive]}
                onPress={() => setSelectedKey(key)}
                activeOpacity={0.8}
              >
                <Text style={[s.dateDayName, active && s.dateDayNameActive]}>
                  {isToday ? 'Today' : DAY_NAMES[d.getDay()]}
                </Text>
                <Text style={[s.dateNum, active && s.dateNumActive]}>
                  {d.getDate()}
                </Text>
                <Text style={[s.dateMonth, active && s.dateMonthActive]}>
                  {MONTH_NAMES[d.getMonth()]}
                </Text>
                {hasHW && <View style={[s.hwDot, active && s.hwDotActive]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Homework list ── */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.listHeader}>
          <Text style={s.listTitle}>{listTitle}</Text>
          <View style={s.countBadge}>
            <Text style={s.countText}>{homeworks.length} task{homeworks.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {homeworks.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon iconSet="Ionicons" iconName="checkmark-circle-outline" size={52} color={theme.colors.textMuted} />
            <Text style={s.emptyTitle}>No homework!</Text>
            <Text style={s.emptySubtitle}>Nothing assigned for this date.</Text>
          </View>
        ) : (
          <>
            {pending.map(hw => (
              <HWCard
                key={hw.id}
                hw={hw}
                isCompleted={false}
                expanded={expandedId === hw.id}
                onToggleExpand={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                onToggleComplete={() => setConfirmHw(hw)}
              />
            ))}

            {pending.length === 0 && completed.length > 0 && (
              <View style={s.allDone}>
                <Text style={s.allDoneEmoji}>🎉</Text>
                <Text style={s.allDoneText}>All homework completed!</Text>
              </View>
            )}

            {completed.length > 0 && (
              <>
                <View style={s.completedHeader}>
                  <VectorIcon iconSet="Ionicons" iconName="checkmark-done-outline" size={16} color="#16A34A" />
                  <Text style={s.completedTitle}>Completed</Text>
                  <View style={s.completedBadge}>
                    <Text style={s.completedBadgeText}>{completed.length}</Text>
                  </View>
                </View>
                {completed.map(hw => (
                  <HWCard
                    key={hw.id}
                    hw={hw}
                    isCompleted
                    expanded={expandedId === hw.id}
                    onToggleExpand={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                    onToggleComplete={() => {}}
                  />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Mark-as-complete confirmation ── */}
      <Modal
        transparent
        visible={!!confirmHw}
        animationType="fade"
        onRequestClose={() => setConfirmHw(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.modalIconWrap}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-circle-outline"
                size={28}
                color="#16A34A"
              />
            </View>

            <Text style={s.modalTitle}>Mark as Complete?</Text>
            <Text style={s.modalDesc}>
              "{confirmHw?.title}" will be moved to Completed. This cannot be
              undone.
            </Text>

            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtn, s.modalBtnGhost]}
                activeOpacity={0.85}
                onPress={() => setConfirmHw(null)}
              >
                <Text style={[s.modalBtnText, s.modalBtnGhostText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.modalBtn, s.modalBtnConfirm]}
                activeOpacity={0.9}
                onPress={confirmComplete}
              >
                <Text style={[s.modalBtnText, s.modalBtnConfirmText]}>
                  Yes, Complete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StudentHomeworkScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  // Date strip
  dateStripWrap: {
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    paddingTop: 10, paddingBottom: 14,
  },
  stripHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 10,
  },
  monthLabel: { fontSize: 13, fontWeight: '800', color: theme.colors.textSecondary },
  stripHint:  { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted },
  dateStrip: { paddingHorizontal: 12, gap: 8 },
  dateCell: {
    width: 56, alignItems: 'center', paddingVertical: 10, borderRadius: 16,
    backgroundColor: '#F1F5F9', gap: 2,
    borderWidth: 1, borderColor: 'transparent',
  },
  dateCellActive: {
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY, shadowOpacity: 0.35, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  dateDayName: { fontSize: 10, fontWeight: '700', color: theme.colors.textMuted, textTransform: 'uppercase' },
  dateDayNameActive: { color: 'rgba(255,255,255,0.85)' },
  dateNum: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  dateNumActive: { color: '#fff' },
  dateMonth: { fontSize: 10, fontWeight: '600', color: theme.colors.textMuted },
  dateMonthActive: { color: 'rgba(255,255,255,0.85)' },
  hwDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: PRIMARY, marginTop: 2 },
  hwDotActive: { backgroundColor: '#fff' },

  // List
  scroll: { padding: theme.spacing.lg },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  listTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  countBadge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  countText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Card — exam template
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    shadowColor: '#000000',
    elevation: 3,
    marginBottom: 14,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md, gap: 10 },

  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 20 },
  hwName: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary },
  hwNameDone: { textDecorationLine: 'line-through', color: theme.colors.textSecondary },
  hwSubtitle: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },

  // Bottom actions — exam toggle template
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
  actionDivider: { width: 1, backgroundColor: theme.colors.border },
  actionText: { fontSize: 13, fontWeight: '600', color: theme.colors.primary },

  // Description expanded — exam syllabus-box template
  descBox: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: 6,
  },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  subjectDot: { width: 7, height: 7, borderRadius: 4 },
  descTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  descText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 20, paddingLeft: 14 },

  // Completed section
  completedHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, marginBottom: 12,
  },
  completedTitle: { fontSize: 15, fontWeight: '900', color: '#16A34A' },
  completedBadge: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999,
  },
  completedBadgeText: { fontSize: 11, fontWeight: '800', color: '#16A34A' },
  allDone: { alignItems: 'center', paddingVertical: 18, gap: 4 },
  allDoneEmoji: { fontSize: 30 },
  allDoneText: { fontSize: 14, fontWeight: '700', color: '#16A34A' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '900', color: theme.colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },

  // Confirmation modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalIconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  modalDesc: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalBtnGhost: {
    backgroundColor: '#F1F5F9',
  },
  modalBtnGhostText: {
    color: theme.colors.textPrimary,
  },
  modalBtnConfirm: {
    backgroundColor: '#16A34A',
  },
  modalBtnConfirmText: {
    color: theme.colors.white,
  },
});
