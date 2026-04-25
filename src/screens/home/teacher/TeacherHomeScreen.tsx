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
import { HOMEWORK_STORE } from '../../homework/homeworkData';
import { EXAMS } from '../../exam/examData';

// ─── Today's Classes ──────────────────────────────────────────────────────────
const TODAY_CLASSES = [
  {
    subject: 'Mathematics',
    class: 'Class 9A',
    time: '08:00 - 08:45',
    room: 'R-101',
    icon: '📐',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    subject: 'Mathematics',
    class: 'Class 8B',
    time: '09:00 - 09:45',
    room: 'R-203',
    icon: '📐',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    subject: 'Mathematics',
    class: 'Class 10A',
    time: '11:00 - 11:45',
    room: 'R-105',
    icon: '📐',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    subject: 'Mathematics',
    class: 'Class 7C',
    time: '02:00 - 02:45',
    room: 'R-302',
    icon: '📐',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const TeacherHomeScreen = () => {
  const navigation = useNavigation<any>();

  const upcomingExams = EXAMS.filter(
    e => e.status === 'Published' || e.status === 'Upcoming',
  ).slice(0, 2);

  const pendingHW = HOMEWORK_STORE.slice(0, 3);

  return (
    <View style={s.root}>
      <TopBar
        userName="Mr. Arjun Verma"
        onAvatarPress={() => navigation.navigate('TeacherProfile')}
        onBellPress={() =>
          navigation.navigate('Notifications', { role: 'teacher' })
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Greeting Banner ── */}
        <View style={s.banner}>
          <View style={s.bannerRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.greeting}>{getGreeting()} 👋</Text>
              <Text style={s.teacherName}>Mr. Arjun Verma</Text>
              <Text style={s.bannerSub}>Mathematics · Senior Teacher</Text>
            </View>
            <View style={s.avatarCircle}>
              <Text style={s.avatarText}>AV</Text>
            </View>
          </View>

          {/* Today summary pills */}
          <View style={s.pillsRow}>
            <View style={s.pill}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="calendar-outline"
                size={13}
                color="#fff"
              />
              <Text style={s.pillText}>
                {TODAY_CLASSES.length} Classes Today
              </Text>
            </View>
            <View style={s.pill}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="people-outline"
                size={13}
                color="#fff"
              />
              <Text style={s.pillText}>4 Classes</Text>
            </View>
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View style={s.statsRow}>
          {[
            {
              label: 'Classes',
              value: String(TODAY_CLASSES.length),
              color: '#4F46E5',
              bg: '#E0E7FF',
              icon: 'school-outline',
            },
            {
              label: 'Students',
              value: '148',
              color: '#16A34A',
              bg: '#DCFCE7',
              icon: 'people-outline',
            },
            {
              label: 'Homework',
              value: String(HOMEWORK_STORE.length),
              color: '#7C3AED',
              bg: '#EDE9FE',
              icon: 'book-outline',
            },
            {
              label: 'Exams',
              value: String(upcomingExams.length),
              color: '#D97706',
              bg: '#FEF3C7',
              icon: 'document-text-outline',
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

        {/* ── Today's Classes ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Today's Classes</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Timetable')}
              activeOpacity={0.7}
            >
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {TODAY_CLASSES.map((cls, i) => (
            <View key={i} style={s.classCard}>
              <View style={[s.classIconWrap, { backgroundColor: cls.bg }]}>
                <Text style={s.classEmoji}>{cls.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.classSubject}>{cls.subject}</Text>
                <Text style={s.classMeta}>
                  {cls.class} · Room {cls.room}
                </Text>
              </View>
              <View style={[s.timeBadge, { backgroundColor: cls.bg }]}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="time-outline"
                  size={11}
                  color={cls.color}
                />
                <Text style={[s.timeText, { color: cls.color }]}>
                  {cls.time}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Pending Homework ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Assigned Homework</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Homework')}
              activeOpacity={0.7}
            >
              <Text style={s.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {pendingHW.length === 0 ? (
            <View style={s.emptyCard}>
              <Text style={s.emptyText}>No homework assigned</Text>
            </View>
          ) : (
            pendingHW.map(hw => (
              <View key={hw.id} style={s.hwCard}>
                <View
                  style={[s.hwAccent, { backgroundColor: hw.subjectColor }]}
                />
                <View style={s.hwBody}>
                  <View style={s.hwTop}>
                    <View
                      style={[
                        s.hwBadge,
                        { backgroundColor: hw.subjectColor + '20' },
                      ]}
                    >
                      <Text style={s.hwIcon}>{hw.subjectIcon}</Text>
                      <Text style={[s.hwSubject, { color: hw.subjectColor }]}>
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
                <View key={exam.id} style={s.examCard}>
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
                </View>
              );
            })
          )}
        </View>

        {/* ── Notice Board ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Notice Board</Text>
          {[
            {
              title: 'Staff Meeting — 25 Apr 2026',
              time: '1 hr ago',
              icon: 'people-outline',
              color: '#4F46E5',
              bg: '#E0E7FF',
            },
            {
              title: 'IA 1 Paper Submission Due',
              time: '2 hrs ago',
              icon: 'document-outline',
              color: '#DC2626',
              bg: '#FEE2E2',
            },
            {
              title: 'School Closed on 26 Apr',
              time: '3 hrs ago',
              icon: 'megaphone-outline',
              color: '#0EA5E9',
              bg: '#E0F2FE',
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

export default TeacherHomeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingBottom: 20 },

  // Banner
  banner: {
    backgroundColor: '#1E293B',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    overflow: 'hidden',
    elevation: 4,
  },
  bannerBlob1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(79,70,229,0.15)',
    top: -60,
    right: -40,
  },
  bannerBlob2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79,70,229,0.1)',
    bottom: -40,
    left: 10,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  teacherName: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 2 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pillText: { fontSize: 12, fontWeight: '700', color: '#fff' },

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

  // Class card
  classCard: {
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
  classIconWrap: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classEmoji: { fontSize: 20 },
  classSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  classMeta: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  timeText: { fontSize: 11, fontWeight: '700' },

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
  hwBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
  },
  hwIcon: { fontSize: 12 },
  hwSubject: { fontSize: 11, fontWeight: '700' },
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
