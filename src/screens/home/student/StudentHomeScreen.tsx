import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../../../components/TopBar';
import VectorIcon from '../../../components/VectorIcon';
import { theme } from '../../../utils/theme';
import { computeStats } from '../../attendance/attendanceTypes';
import { EXAMS } from '../../exam/examData';
import { HOMEWORK_STORE } from '../../homework/homeworkData';
import moment from 'moment';

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: 'Attendance',
    icon: 'calendar-outline',
    color: '#16A34A',
    bg: '#DCFCE7',
    route: 'Attendance',
  },
  {
    label: 'Exams',
    icon: 'document-text-outline',
    color: '#4F46E5',
    bg: '#E0E7FF',
    route: 'Exams',
  },
  {
    label: 'Fees',
    icon: 'card-outline',
    color: '#D97706',
    bg: '#FEF3C7',
    route: 'Fees',
  },
  {
    label: 'Homework',
    icon: 'book-outline',
    color: '#7C3AED',
    bg: '#EDE9FE',
    route: 'Homework',
  },
  {
    label: 'Timetable',
    icon: 'time-outline',
    color: '#0EA5E9',
    bg: '#E0F2FE',
    route: 'Timetable',
  },
  {
    label: 'Syllabus',
    icon: 'layers-outline',
    color: '#DC2626',
    bg: '#FEE2E2',
    route: 'Syllabus',
  },
  {
    label: 'Results',
    icon: 'stats-chart-outline',
    color: '#16A34A',
    bg: '#DCFCE7',
    route: 'Performance',
  },
  {
    label: 'More',
    icon: 'grid-outline',
    color: '#64748B',
    bg: '#F1F5F9',
    route: 'More',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const StudentHomeScreen = () => {
  const navigation = useNavigation<any>();
  const stats = computeStats(moment().format('YYYY-MM'));

  const upcomingExams = EXAMS.filter(
    e => e.status === 'Published' || e.status === 'Upcoming',
  ).slice(0, 3);
  const recentHW = HOMEWORK_STORE.slice(0, 3);
  const attendancePct = parseFloat(stats.presentPct);

  return (
    <View style={s.root}>
      <TopBar
        onAvatarPress={() => navigation.navigate('StudentProfile')}
        onBellPress={() =>
          navigation.navigate('Notifications', { role: 'student' })
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Greeting Banner ── */}
        <View style={s.banner}>
          <View style={s.bannerContent}>
            <View style={{ flex: 1 }}>
              <Text style={s.greeting}>{getGreeting()} 👋</Text>
              <Text style={s.studentName}>Rahul Sharma</Text>
              <Text style={s.bannerSub}>Class 9A · Roll No. 24</Text>
            </View>
            <View style={s.avatarCircle}>
              <Text style={s.avatarText}>RS</Text>
            </View>
          </View>

          {/* Attendance pill inside banner */}
          <View style={s.attendancePill}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="checkmark-circle"
              size={14}
              color="#fff"
            />
            <Text style={s.attendancePillText}>
              Attendance: {stats.presentPct}%
            </Text>
            <View style={s.attendanceBar}>
              <View
                style={[
                  s.attendanceBarFill,
                  { width: `${Math.min(attendancePct, 100)}%` as any },
                ]}
              />
            </View>
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          {[
            {
              label: 'Present',
              value: String(stats.presentDays),
              color: theme.colors.success,
              bg: '#DCFCE7',
              icon: 'checkmark-circle-outline',
            },
            {
              label: 'Absent',
              value: String(stats.absentDays),
              color: theme.colors.danger,
              bg: '#FEE2E2',
              icon: 'close-circle-outline',
            },
            {
              label: 'Leave',
              value: String(stats.leaveDays),
              color: '#D97706',
              bg: '#FEF3C7',
              icon: 'time-outline',
            },
            {
              label: 'Homework',
              value: String(HOMEWORK_STORE.length),
              color: '#7C3AED',
              bg: '#EDE9FE',
              icon: 'book-outline',
            },
          ].map(item => (
            <View
              key={item.label}
              style={[s.statCard, { backgroundColor: item.bg }]}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName={item.icon}
                size={18}
                color={item.color}
              />
              <Text style={[s.statValue, { color: item.color }]}>
                {item.value}
              </Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Upcoming Exams ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Upcoming Exams</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Exams')}
              activeOpacity={0.7}
            >
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingExams.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyText}>No upcoming exams</Text>
            </View>
          ) : (
            upcomingExams.map(exam => {
              const sc =
                exam.status === 'Published'
                  ? { color: '#16A34A', bg: '#DCFCE7' }
                  : { color: '#D97706', bg: '#FEF3C7' };
              return (
                <TouchableOpacity
                  key={exam.id}
                  style={s.examCard}
                  onPress={() => navigation.navigate('ExamDetail', { exam })}
                  activeOpacity={0.85}
                >
                  <View style={[s.examAccent, { backgroundColor: sc.color }]} />
                  <View style={s.examBody}>
                    <View style={s.examTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.examName}>{exam.name}</Text>
                        <Text style={s.examType}>
                          {exam.type} · {exam.academicYear}
                        </Text>
                      </View>
                      <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                        <View
                          style={[s.statusDot, { backgroundColor: sc.color }]}
                        />
                        <Text style={[s.statusText, { color: sc.color }]}>
                          {exam.status}
                        </Text>
                      </View>
                    </View>
                    <View style={s.examDateRow}>
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="time-outline"
                        size={13}
                        color={theme.colors.textMuted}
                      />
                      <Text style={s.examDate}>{exam.dateRange}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ── Recent Homework ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Recent Homework</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Homework')}
              activeOpacity={0.7}
            >
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentHW.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyText}>No homework assigned</Text>
            </View>
          ) : (
            recentHW.map(hw => (
              <View key={hw.id} style={s.hwCard}>
                <View
                  style={[s.hwAccent, { backgroundColor: hw.subjectColor }]}
                />
                <View style={s.hwBody}>
                  <View style={s.hwTop}>
                    <View
                      style={[
                        s.hwSubjectBadge,
                        { backgroundColor: hw.subjectColor + '20' },
                      ]}
                    >
                      <Text style={s.hwSubjectIcon}>{hw.subjectIcon}</Text>
                      <Text
                        style={[s.hwSubjectName, { color: hw.subjectColor }]}
                      >
                        {hw.subjectName}
                      </Text>
                    </View>
                    <View
                      style={[
                        s.dueBadge,
                        { backgroundColor: hw.subjectColor + '20' },
                      ]}
                    >
                      <VectorIcon
                        iconSet="Ionicons"
                        iconName="calendar-outline"
                        size={11}
                        color={hw.subjectColor}
                      />
                      <Text style={[s.dueText, { color: hw.subjectColor }]}>
                        {hw.dueDate}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.hwTitle} numberOfLines={1}>
                    {hw.title}
                  </Text>
                  <Text style={s.hwDesc} numberOfLines={2}>
                    {hw.description}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* ── Notice Board ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Notice Board</Text>
          {[
            {
              title: 'School Closed on 26 Apr',
              time: '2 hrs ago',
              icon: 'megaphone-outline',
              color: '#0EA5E9',
              bg: '#E0F2FE',
            },
            {
              title: 'Annual Sports Day — 5 May 2026',
              time: '2 days ago',
              icon: 'trophy-outline',
              color: '#D97706',
              bg: '#FEF3C7',
            },
            {
              title: 'Fee Payment Due: 30 Apr 2026',
              time: '3 days ago',
              icon: 'card-outline',
              color: '#DC2626',
              bg: '#FEE2E2',
            },
          ].map((n, i) => (
            <View key={i} style={s.noticeCard}>
              <View style={[s.noticeIcon, { backgroundColor: n.bg }]}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={n.icon}
                  size={18}
                  color={n.color}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.noticeTitle}>{n.title}</Text>
                <Text style={s.noticeTime}>{n.time}</Text>
              </View>
              <VectorIcon
                iconSet="Ionicons"
                iconName="chevron-forward"
                size={16}
                color={theme.colors.textMuted}
              />
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default StudentHomeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingBottom: 20 },

  // Banner
  banner: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    overflow: 'hidden',
    elevation: 4,
  },
  bannerBlob1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -30,
  },
  bannerBlob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -30,
    left: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  studentName: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 2 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  attendancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  attendancePillText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  attendanceBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  attendanceBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  // Section
  section: { marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  seeAll: { fontSize: 13, fontWeight: '600', color: theme.colors.primary },

  // Quick actions
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem: { width: '22%', alignItems: 'center', gap: 6 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  // Exam card
  examCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 1,
  },
  examAccent: { width: 4 },
  examBody: { flex: 1, padding: 12, gap: 6 },
  examTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  examName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  examType: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  examDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  examDate: { fontSize: 12, color: theme.colors.textSecondary },

  // HW card
  hwCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  hwAccent: { width: 4 },
  hwBody: { flex: 1, padding: 12, gap: 6 },
  hwTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hwSubjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  hwSubjectIcon: { fontSize: 12 },
  hwSubjectName: { fontSize: 11, fontWeight: '700' },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  dueText: { fontSize: 11, fontWeight: '700' },
  hwTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  hwDesc: { fontSize: 12, color: theme.colors.textSecondary, lineHeight: 17 },

  // Notice
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginBottom: 8,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  noticeTime: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },

  // Empty
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: theme.colors.textMuted },
});
