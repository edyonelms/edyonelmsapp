import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
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
import { Chip, ChartCard, Donut, MiniBars, StackedBar } from '../../../components/Charts';

const { width } = Dimensions.get('window');

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  return { text: 'Good Evening', emoji: '🌙' };
};

const TODAY_CLASSES = [
  { subject: 'Mathematics', class: 'Class 9A',  time: '08:00', room: 'R-101', done: true  },
  { subject: 'Mathematics', class: 'Class 8B',  time: '09:00', room: 'R-203', done: true  },
  { subject: 'Mathematics', class: 'Class 10A', time: '11:00', room: 'R-105', done: false },
  { subject: 'Mathematics', class: 'Class 7C',  time: '14:00', room: 'R-302', done: false },
];


const NOTICES = [
  { title: 'Staff Meeting — 25 Apr 2026',  time: '1 hr ago',  icon: 'people-outline',   color: '#4F46E5', bg: '#E0E7FF' },
  { title: 'IA 1 Paper Submission Due',    time: '2 hrs ago', icon: 'document-outline', color: '#DC2626', bg: '#FEE2E2' },
  { title: 'School Closed on 26 Apr',      time: '3 hrs ago', icon: 'megaphone-outline', color: '#0EA5E9', bg: '#E0F2FE' },
];

const CLASS_ATT = [
  { class: '9A', present: 38, total: 42 },
  { class: '8B', present: 34, total: 38 },
  { class: '10A', present: 40, total: 45 },
  { class: '7C', present: 30, total: 36 },
];

const TeacherHomeScreen = () => {
  const navigation = useNavigation<any>();
  const greeting = getGreeting();
  const upcomingExams = EXAMS.filter(e => e.status === 'Published' || e.status === 'Upcoming').slice(0, 2);
  const pendingHW = HOMEWORK_STORE.slice(0, 3);
  const doneClasses = TODAY_CLASSES.filter(c => c.done).length;
  const totalStudents = CLASS_ATT.reduce((s, c) => s + c.total, 0);
  const totalPresent = CLASS_ATT.reduce((s, c) => s + c.present, 0);
  const overallAtt = Math.round((totalPresent / totalStudents) * 100);

  return (
    <View style={s.root}>
      <TopBar
        onAvatarPress={() => navigation.navigate('TeacherProfile')}
        onBellPress={() => navigation.navigate('Notifications', { role: 'teacher' })}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.heroLeft}>
            <Text style={s.heroGreeting}>{greeting.emoji} {greeting.text}</Text>
            <Text style={s.heroName}>Mr. Arjun Verma</Text>
            <View style={s.heroBadge}>
              <VectorIcon iconSet="Ionicons" iconName="ribbon-outline" size={11} color="#fff" />
              <Text style={s.heroBadgeText}>Mathematics · Senior Teacher</Text>
            </View>
          </View>
          <View style={s.heroRight}>
            <View style={s.heroAvatar}>
              <Text style={s.heroAvatarText}>AV</Text>
            </View>
            <View style={s.heroAvatarRing} />
          </View>
        </View>

        {/* ── Quick chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          <Chip icon="people" label="Students" value={String(totalStudents)} color="#0EA5E9" bg="#E0F2FE" />
          <Chip icon="calendar" label="Attd" value={`${overallAtt}%`} color="#16A34A" bg="#DCFCE7" />
          <Chip icon="school" label="Classes" value={`${doneClasses}/${TODAY_CLASSES.length}`} color="#4F46E5" bg="#E0E7FF" />
          <Chip icon="book" label="Homework" value={String(HOMEWORK_STORE.length)} color="#7C3AED" bg="#EDE9FE" />
          <Chip icon="document-text" label="Exams" value={String(upcomingExams.length)} color="#D97706" bg="#FEF3C7" />
        </ScrollView>

        {/* ── Stats Scroll ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.statsScroll}>
          {[
            { label: 'Classes',  value: TODAY_CLASSES.length, color: '#4F46E5', bg: '#E0E7FF', icon: 'school',          sub: 'today' },
            { label: 'Done',     value: doneClasses,          color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark-circle', sub: 'classes' },
            { label: 'Students', value: 148,                  color: '#0EA5E9', bg: '#E0F2FE', icon: 'people',           sub: 'total' },
            { label: 'Homework', value: HOMEWORK_STORE.length, color: '#7C3AED', bg: '#EDE9FE', icon: 'book',            sub: 'assigned' },
            { label: 'Exams',    value: upcomingExams.length, color: '#D97706', bg: '#FEF3C7', icon: 'document-text',    sub: 'upcoming' },
          ].map(st => (
            <View key={st.label} style={[s.statCard, { backgroundColor: st.bg }]}>
              <View style={[s.statIconWrap, { backgroundColor: st.color + '22' }]}>
                <VectorIcon iconSet="Ionicons" iconName={st.icon} size={20} color={st.color} />
              </View>
              <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
              <Text style={[s.statSub, { color: st.color + 'AA' }]}>{st.sub}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Today's Classes Timeline ── */}
        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Today's Classes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Timetable')} activeOpacity={0.7}>
              <Text style={s.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <View style={s.timeline}>
            {TODAY_CLASSES.map((cls, i) => (
              <View key={i} style={s.timelineRow}>
                {/* Time column */}
                <View style={s.timelineLeft}>
                  <Text style={[s.timelineTime, cls.done && s.timelineDone]}>{cls.time}</Text>
                  {i < TODAY_CLASSES.length - 1 && <View style={[s.timelineLine, cls.done && s.timelineLineDone]} />}
                </View>
                {/* Dot */}
                <View style={[s.timelineDot, cls.done ? s.timelineDotDone : s.timelineDotPending]}>
                  {cls.done && <VectorIcon iconSet="Ionicons" iconName="checkmark" size={10} color="#fff" />}
                </View>
                {/* Card */}
                <View style={[s.timelineCard, cls.done && s.timelineCardDone]}>
                  <View style={s.timelineCardLeft}>
                    <Text style={[s.timelineSubject, cls.done && { color: theme.colors.textMuted }]}>{cls.subject}</Text>
                    <Text style={s.timelineMeta}>{cls.class} · Room {cls.room}</Text>
                  </View>
                  {!cls.done && (
                    <View style={s.upcomingBadge}>
                      <Text style={s.upcomingBadgeText}>Upcoming</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Assigned Homework ── */}
        {pendingHW.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Assigned Homework</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Homework')} activeOpacity={0.7}>
                <Text style={s.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>
            {pendingHW.map(hw => (
              <View key={hw.id} style={s.hwCard}>
                <View style={[s.hwStripe, { backgroundColor: hw.subjectColor }]} />
                <View style={[s.hwIconWrap, { backgroundColor: hw.subjectColor + '18' }]}>
                  <Text style={s.hwEmoji}>{hw.subjectIcon}</Text>
                </View>
                <View style={s.hwContent}>
                  <Text style={s.hwTitle} numberOfLines={1}>{hw.title}</Text>
                  <Text style={s.hwSubject}>{hw.subjectName}</Text>
                </View>
                <View style={[s.hwDueBadge, { backgroundColor: hw.subjectColor + '18' }]}>
                  <Text style={[s.hwDueText, { color: hw.subjectColor }]}>{hw.dueDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Upcoming Exams ── */}
        {upcomingExams.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Upcoming Exams</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Exams')} activeOpacity={0.7}>
                <Text style={s.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>
            {upcomingExams.map(exam => {
              const sc = exam.status === 'Published' ? { color: '#16A34A', bg: '#DCFCE7' } : { color: '#D97706', bg: '#FEF3C7' };
              return (
                <View key={exam.id} style={s.examCard}>
                  <View style={[s.examAccent, { backgroundColor: sc.color }]} />
                  <View style={s.examBody}>
                    <View style={s.examRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.examName}>{exam.name}</Text>
                        <Text style={s.examType}>{exam.type} · {exam.academicYear}</Text>
                      </View>
                      <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                        <View style={[s.statusDot, { backgroundColor: sc.color }]} />
                        <Text style={[s.statusText, { color: sc.color }]}>{exam.status}</Text>
                      </View>
                    </View>
                    <View style={s.examDateRow}>
                      <VectorIcon iconSet="Ionicons" iconName="calendar-outline" size={12} color={theme.colors.textMuted} />
                      <Text style={s.examDate}>{exam.dateRange}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Class Attendance ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Class Attendance</Text>
          <ChartCard
            icon="bar-chart-outline"
            iconBg="#DCFCE7"
            iconColor="#16A34A"
            title="Today's Overview"
            right={
              <TouchableOpacity onPress={() => navigation.navigate('Analytics', { userRole: 'teacher' })} activeOpacity={0.7}>
                <Text style={s.seeAll}>Details →</Text>
              </TouchableOpacity>
            }
          >
            <View style={s.attRow}>
              <Donut size={104} stroke={12} pct={overallAtt} color="#16A34A" label={`${overallAtt}%`} sub="present" />
              <View style={{ flex: 1 }}>
                <StackedBar
                  segments={[
                    { label: 'Present', value: totalPresent, color: '#16A34A' },
                    { label: 'Absent', value: totalStudents - totalPresent, color: '#DC2626' },
                  ]}
                />
              </View>
            </View>
            <View style={s.cardDivider} />
            <Text style={s.miniHead}>Attendance % by Class</Text>
            <MiniBars
              data={CLASS_ATT.map(c => ({
                label: c.class,
                value: Math.round((c.present / c.total) * 100),
              }))}
              maxVal={100}
              color="#16A34A"
              height={110}
            />
          </ChartCard>
        </View>

        {/* ── Notice Board ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Notice Board</Text>
          <View style={s.noticeList}>
            {NOTICES.map((n, i) => (
              <TouchableOpacity key={i} style={s.noticeCard} activeOpacity={0.8}>
                <View style={[s.noticeIconWrap, { backgroundColor: n.bg }]}>
                  <VectorIcon iconSet="Ionicons" iconName={n.icon} size={18} color={n.color} />
                </View>
                <View style={s.noticeContent}>
                  <Text style={s.noticeTitle}>{n.title}</Text>
                  <Text style={s.noticeTime}>{n.time}</Text>
                </View>
                <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default TeacherHomeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { paddingBottom: 20 },

  // Hero
  hero: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: theme.spacing.lg, marginTop: theme.spacing.md,
    backgroundColor: '#1E293B',
    borderRadius: theme.radius.lg, padding: theme.spacing.lg,
    elevation: 4,
  },
  heroLeft: { flex: 1, gap: 6 },
  heroGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  heroName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full,
  },
  heroBadgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },
  heroRight: { alignItems: 'center', justifyContent: 'center' },
  heroAvatar: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  heroAvatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroAvatarRing: {
    position: 'absolute', width: 64, height: 64, borderRadius: 32,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },

  // Quick chips
  chipsRow: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, gap: 8 },

  // Class attendance card
  attRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardDivider: { height: 1, backgroundColor: theme.colors.border },
  miniHead: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },

  // Stats
  statsScroll: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, gap: 10 },
  statCard: { width: 90, borderRadius: theme.radius.md, padding: 12, alignItems: 'center', gap: 4, elevation: 1 },
  statIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary },
  statSub: { fontSize: 9, fontWeight: '600' },

  // Section
  section: { marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.lg },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 10 },
  seeAll: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },

  // Timeline
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  timelineLeft: { width: 44, alignItems: 'center', paddingTop: 12 },
  timelineTime: { fontSize: 11, fontWeight: '700', color: theme.colors.textPrimary },
  timelineDone: { color: theme.colors.textMuted },
  timelineLine: { width: 2, flex: 1, backgroundColor: theme.colors.primary, marginTop: 4, minHeight: 24, opacity: 0.3 },
  timelineLineDone: { backgroundColor: theme.colors.success, opacity: 0.4 },
  timelineDot: { width: 20, height: 20, borderRadius: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  timelineDotDone: { backgroundColor: theme.colors.success },
  timelineDotPending: { backgroundColor: theme.colors.primary },
  timelineCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.border,
    padding: 10, marginBottom: 8,
  },
  timelineCardDone: { backgroundColor: theme.colors.background, borderColor: theme.colors.border },
  timelineCardLeft: { flex: 1 },
  timelineSubject: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  timelineMeta: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  upcomingBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.radius.full,
  },
  upcomingBadgeText: { fontSize: 10, fontWeight: '700', color: theme.colors.primary },

  // Quick actions
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  qaItem: { width: '22%', alignItems: 'center', gap: 6 },
  qaIcon: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  qaLabel: { fontSize: 10.5, fontWeight: '700', color: theme.colors.textSecondary, textAlign: 'center' },

  // HW
  hwCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    overflow: 'hidden', marginBottom: 8, padding: 10, elevation: 1,
  },
  hwStripe: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 2 },
  hwIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  hwEmoji: { fontSize: 18 },
  hwContent: { flex: 1 },
  hwTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  hwSubject: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  hwDueBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.full },
  hwDueText: { fontSize: 10, fontWeight: '700' },

  // Exam
  examCard: {
    flexDirection: 'row', backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    overflow: 'hidden', marginBottom: 8, elevation: 1,
  },
  examAccent: { width: 4 },
  examBody: { flex: 1, padding: 12, gap: 6 },
  examRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  examName: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  examType: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.radius.full },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  examDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  examDate: { fontSize: 12, color: theme.colors.textSecondary },

  // Notice
  noticeList: { gap: 8 },
  noticeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    padding: 12, elevation: 1,
  },
  noticeIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary },
  noticeTime: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
});
