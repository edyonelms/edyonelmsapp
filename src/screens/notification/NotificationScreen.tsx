import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'student' | 'teacher';

type StudentCategory =
  | 'All'
  | 'Exam'
  | 'Attendance'
  | 'Fee'
  | 'Announcement'
  | 'Homework';
type TeacherCategory =
  | 'All'
  | 'Exam'
  | 'Attendance'
  | 'Announcement'
  | 'Homework'
  | 'Leave';
type NotifCategory = StudentCategory | TeacherCategory;

interface Notification {
  id: string;
  category: Exclude<NotifCategory, 'All'>;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  role: Role | 'both';
}

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  Exclude<NotifCategory, 'All'>,
  { icon: string; color: string; bg: string }
> = {
  Exam: { icon: 'document-text-outline', color: '#4F46E5', bg: '#E0E7FF' },
  Attendance: { icon: 'calendar-outline', color: '#16A34A', bg: '#DCFCE7' },
  Fee: { icon: 'card-outline', color: '#D97706', bg: '#FEF3C7' },
  Announcement: { icon: 'megaphone-outline', color: '#0EA5E9', bg: '#E0F2FE' },
  Homework: { icon: 'book-outline', color: '#7C3AED', bg: '#EDE9FE' },
  Leave: { icon: 'person-remove-outline', color: '#DC2626', bg: '#FEE2E2' },
};

const STUDENT_FILTERS: StudentCategory[] = [
  'All',
  'Exam',
  'Attendance',
  'Fee',
  'Announcement',
  'Homework',
];
const TEACHER_FILTERS: TeacherCategory[] = [
  'All',
  'Exam',
  'Attendance',
  'Announcement',
  'Homework',
  'Leave',
];

// ─── Notifications Data ───────────────────────────────────────────────────────
const ALL_NOTIFICATIONS: Notification[] = [
  // ── Student notifications ──
  {
    id: 's1',
    role: 'student',
    category: 'Exam',
    isRead: false,
    title: 'IA 1 Exam Schedule Released',
    body: 'The timetable for IA 1 (Unit Test) has been published. Exams start from 03 Feb 2026.',
    time: 'Just now',
  },
  {
    id: 's2',
    role: 'student',
    category: 'Attendance',
    isRead: false,
    title: 'Attendance Marked — Present',
    body: 'Your attendance for today (24 Apr 2026) has been marked as Present.',
    time: '10 min ago',
  },
  {
    id: 's3',
    role: 'student',
    category: 'Fee',
    isRead: false,
    title: 'Fee Payment Reminder',
    body: 'Your quarterly fee of ₹12,500 is due on 30 Apr 2026. Please pay on time.',
    time: '1 hr ago',
  },
  {
    id: 's4',
    role: 'student',
    category: 'Homework',
    isRead: true,
    title: 'New Homework Assigned',
    body: 'Mathematics homework on Chapter 5 — Triangles has been assigned. Due: 27 Apr 2026.',
    time: '3 hrs ago',
  },
  {
    id: 's5',
    role: 'student',
    category: 'Exam',
    isRead: true,
    title: 'Mid Term Result Published',
    body: 'Your Mid Term result has been published. Log in to view your marks and grade.',
    time: 'Yesterday',
  },
  {
    id: 's6',
    role: 'student',
    category: 'Attendance',
    isRead: true,
    title: 'Low Attendance Warning',
    body: 'Your attendance has dropped below 75%. Please ensure regular attendance.',
    time: 'Yesterday',
  },
  {
    id: 's7',
    role: 'student',
    category: 'Fee',
    isRead: true,
    title: 'Fee Payment Successful',
    body: 'Your fee payment of ₹12,500 for Q1 2026 has been received successfully.',
    time: '3 days ago',
  },
  {
    id: 's8',
    role: 'student',
    category: 'Homework',
    isRead: true,
    title: 'Homework Graded',
    body: 'Your Science homework has been graded. You scored 18/20. Check the feedback.',
    time: '4 days ago',
  },

  // ── Teacher notifications ──
  {
    id: 't1',
    role: 'teacher',
    category: 'Attendance',
    isRead: false,
    title: 'Attendance Not Marked',
    body: 'You have not marked attendance for Class 8C today. Please update it before 2:00 PM.',
    time: 'Just now',
  },
  {
    id: 't2',
    role: 'teacher',
    category: 'Homework',
    isRead: false,
    title: 'Homework Submission Pending',
    body: '12 students from Class 9A have not submitted the Mathematics homework due today.',
    time: '30 min ago',
  },
  {
    id: 't3',
    role: 'teacher',
    category: 'Leave',
    isRead: false,
    title: 'Leave Request — Rohan Mehta',
    body: 'Student Rohan Mehta (Class 8C) has applied for leave on 26–27 Apr 2026. Action required.',
    time: '1 hr ago',
  },
  {
    id: 't4',
    role: 'teacher',
    category: 'Exam',
    isRead: true,
    title: 'IA 1 Paper Submission Deadline',
    body: 'Please submit the IA 1 question paper for Mathematics by 28 Apr 2026.',
    time: '2 hrs ago',
  },
  {
    id: 't5',
    role: 'teacher',
    category: 'Leave',
    isRead: true,
    title: 'Leave Approved — Priya Patel',
    body: 'Leave request for Priya Patel (Class 7B) on 25 Apr 2026 has been approved.',
    time: 'Yesterday',
  },
  {
    id: 't6',
    role: 'teacher',
    category: 'Exam',
    isRead: true,
    title: 'Result Entry Open',
    body: 'Mid Term result entry portal is now open. Please enter marks by 30 Apr 2026.',
    time: 'Yesterday',
  },
  {
    id: 't7',
    role: 'teacher',
    category: 'Homework',
    isRead: true,
    title: 'Homework Review Reminder',
    body: 'Science homework for Class 9A submitted 3 days ago is pending your review.',
    time: '2 days ago',
  },

  // ── Shared (both roles) ──
  {
    id: 'b1',
    role: 'both',
    category: 'Announcement',
    isRead: false,
    title: 'School Closed on 26 Apr',
    body: 'School will remain closed on 26th April 2026 on account of a public holiday.',
    time: '2 hrs ago',
  },
  {
    id: 'b2',
    role: 'both',
    category: 'Announcement',
    isRead: true,
    title: 'Annual Sports Day — 5 May 2026',
    body: 'Annual Sports Day will be held on 5th May 2026. All are requested to participate.',
    time: '2 days ago',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
const NotificationScreen = () => {
  const route = useRoute<any>();
  const role: Role = route.params?.role ?? 'student';

  const roleNotifs = ALL_NOTIFICATIONS.filter(
    n => n.role === role || n.role === 'both',
  );
  const filters = role === 'student' ? STUDENT_FILTERS : TEACHER_FILTERS;

  const [notifications, setNotifications] =
    useState<Notification[]>(roleNotifs);
  const [activeFilter, setActiveFilter] = useState<NotifCategory>('All');

  const filtered = notifications.filter(
    n => activeFilter === 'All' || n.category === activeFilter,
  );
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const markRead = (id: string) =>
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n)),
    );
  const dismiss = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const renderItem = ({ item }: { item: Notification }) => {
    const cfg = CATEGORY_CONFIG[item.category];
    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.cardUnread]}
        onPress={() => markRead(item.id)}
        activeOpacity={0.8}
      >
        {!item.isRead && <View style={styles.unreadDot} />}

        <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
          <VectorIcon
            iconSet="Ionicons"
            iconName={cfg.icon}
            size={20}
            color={cfg.color}
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <View style={[styles.categoryChip, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.categoryText, { color: cfg.color }]}>
                {item.category}
              </Text>
            </View>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardBody} numberOfLines={2}>
            {item.body}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => dismiss(item.id)}
          style={styles.dismissBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="close"
            size={16}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeArea}>
      <Header title="Notifications" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarTitle}>
            {unreadCount > 0 ? `${unreadCount} Unread` : 'All caught up!'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      {/* <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                activeFilter === f && styles.filterBtnActive,
              ]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              {f !== 'All' && (
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={
                    CATEGORY_CONFIG[f as Exclude<NotifCategory, 'All'>].icon
                  }
                  size={13}
                  color={
                    activeFilter === f ? '#fff' : theme.colors.textSecondary
                  }
                />
              )}
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconRing}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="notifications-off-outline"
                size={36}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up for this category
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.white },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topBarTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unreadBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  markAllText: { fontSize: 13, fontWeight: '600', color: theme.colors.primary },

  filterWrapper: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: 8,
    alignItems: 'center',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterTextActive: { color: '#fff' },

  list: { padding: theme.spacing.lg, gap: 10, paddingBottom: 30 },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  cardUnread: {
    borderColor: theme.colors.primary + '40',
    backgroundColor: theme.colors.primaryLight + '60',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardContent: { flex: 1, gap: 4 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  categoryText: { fontSize: 10, fontWeight: '700' },
  timeText: { fontSize: 11, color: theme.colors.textMuted },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardBody: { fontSize: 12, color: theme.colors.textSecondary, lineHeight: 17 },
  dismissBtn: { paddingTop: 2 },

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
