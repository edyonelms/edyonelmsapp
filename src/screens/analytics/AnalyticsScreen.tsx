import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { computeStats } from '../attendance/attendanceTypes';
import moment from 'moment';

const { width } = Dimensions.get('window');
type Role = 'student' | 'teacher';

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data, color, maxVal }: { data: { label: string; value: number }[]; color: string; maxVal: number }) => (
  <View style={bc.wrap}>
    {data.map((d, i) => {
      const pct = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
      return (
        <View key={i} style={bc.col}>
          <Text style={bc.val}>{d.value}</Text>
          <View style={bc.barBg}>
            <View style={[bc.barFill, { height: `${pct}%` as any, backgroundColor: color }]} />
          </View>
          <Text style={bc.label}>{d.label}</Text>
        </View>
      );
    })}
  </View>
);
const bc = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 130, paddingTop: 20 },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  val: { fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary },
  barBg: { flex: 1, width: '65%', backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 4 },
  label: { fontSize: 9, fontWeight: '600', color: theme.colors.textMuted, textAlign: 'center' },
});

// ─── Progress Ring (CSS-free approximation) ───────────────────────────────────
const Ring = ({ pct, color, size = 88 }: { pct: number; color: string; size?: number }) => {
  const stroke = 8;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: stroke, borderColor: theme.colors.border }} />
      {pct > 0 && (
        <View style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: stroke, borderColor: color,
          borderRightColor: pct < 25 ? 'transparent' : color,
          borderBottomColor: pct < 50 ? 'transparent' : color,
          borderLeftColor: pct < 75 ? 'transparent' : color,
          transform: [{ rotate: '-90deg' }],
        }} />
      )}
      <Text style={{ fontSize: size * 0.19, fontWeight: '900', color }}>{pct}%</Text>
      <Text style={{ fontSize: 9, color: theme.colors.textMuted, fontWeight: '600' }}>score</Text>
    </View>
  );
};

// ─── Stat Row ─────────────────────────────────────────────────────────────────
const StatRow = ({ icon, label, value, color, bg }: { icon: string; label: string; value: string; color: string; bg: string }) => (
  <View style={sr.row}>
    <View style={[sr.icon, { backgroundColor: bg }]}>
      <VectorIcon iconSet="Ionicons" iconName={icon} size={15} color={color} />
    </View>
    <Text style={sr.label}>{label}</Text>
    <Text style={[sr.value, { color }]}>{value}</Text>
  </View>
);
const sr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  icon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 12, color: theme.colors.textSecondary, fontWeight: '500' },
  value: { fontSize: 13, fontWeight: '800' },
});

// ─── Subject Progress Bar ─────────────────────────────────────────────────────
const SubjectBar = ({ name, pct, color }: { name: string; pct: number; color: string }) => (
  <View style={sb.row}>
    <View style={[sb.dot, { backgroundColor: color }]} />
    <Text style={sb.name}>{name}</Text>
    <View style={sb.barBg}>
      <View style={[sb.barFill, { width: `${pct}%` as any, backgroundColor: color }]} />
    </View>
    <Text style={[sb.pct, { color }]}>{pct}%</Text>
  </View>
);
const sb = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { fontSize: 11, fontWeight: '600', color: theme.colors.textSecondary, width: 76 },
  barBg: { flex: 1, height: 7, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  pct: { fontSize: 11, fontWeight: '800', width: 34, textAlign: 'right' },
});

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon, iconBg, iconColor, title, children }: any) => (
  <View style={s.card}>
    <View style={s.cardTitleRow}>
      <View style={[s.cardIcon, { backgroundColor: iconBg }]}>
        <VectorIcon iconSet="Ionicons" iconName={icon} size={15} color={iconColor} />
      </View>
      <Text style={s.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// ─── Student Analytics ────────────────────────────────────────────────────────
const MONTHS = [moment().subtract(2, 'months'), moment().subtract(1, 'months'), moment()];

const SUBJECT_PERF = [
  { subject: 'Mathematics', obtained: 82, total: 100, color: '#4F46E5' },
  { subject: 'Science',     obtained: 76, total: 100, color: '#0EA5E9' },
  { subject: 'English',     obtained: 88, total: 100, color: '#D97706' },
  { subject: 'Soc. Sci.',   obtained: 71, total: 100, color: '#16A34A' },
  { subject: 'Hindi',       obtained: 79, total: 100, color: '#DC2626' },
];

const StudentAnalytics = () => {
  const [activeMonth, setActiveMonth] = useState(2);
  const stats = computeStats(MONTHS[activeMonth].format('YYYY-MM'));
  const attPct = Math.round(parseFloat(stats.presentPct));
  const attColor = attPct >= 75 ? '#16A34A' : '#DC2626';
  const grandObtained = SUBJECT_PERF.reduce((s, x) => s + x.obtained, 0);
  const grandTotal    = SUBJECT_PERF.reduce((s, x) => s + x.total, 0);
  const overallPct    = Math.round((grandObtained / grandTotal) * 100);

  return (
    <>
      {/* Overview */}
      <View style={s.row3}>
        {[
          { label: 'Attendance', value: `${attPct}%`,    icon: 'calendar',    color: attColor,   bg: attPct >= 75 ? '#DCFCE7' : '#FEE2E2' },
          { label: 'Avg Score',  value: `${overallPct}%`, icon: 'stats-chart', color: '#4F46E5', bg: '#E0E7FF' },
          { label: 'Homework',   value: '12',             icon: 'book',        color: '#7C3AED', bg: '#EDE9FE' },
        ].map(c => (
          <View key={c.label} style={[s.overviewCard, { backgroundColor: c.bg }]}>
            <VectorIcon iconSet="Ionicons" iconName={c.icon} size={20} color={c.color} />
            <Text style={[s.overviewVal, { color: c.color }]}>{c.value}</Text>
            <Text style={s.overviewLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* Attendance */}
      <SectionCard icon="calendar-outline" iconBg="#DCFCE7" iconColor="#16A34A" title="Attendance Overview">
        <View style={s.monthTabs}>
          {MONTHS.map((m, i) => (
            <TouchableOpacity key={i} style={[s.tab, activeMonth === i && s.tabActive]} onPress={() => setActiveMonth(i)}>
              <Text style={[s.tabText, activeMonth === i && s.tabTextActive]}>{m.format('MMM YY')}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.ringRow}>
          <Ring pct={attPct} color={attColor} />
          <View style={{ flex: 1 }}>
            <StatRow icon="checkmark-circle" label="Present"      value={String(stats.presentDays)} color="#16A34A" bg="#DCFCE7" />
            <StatRow icon="close-circle"     label="Absent"       value={String(stats.absentDays)}  color="#DC2626" bg="#FEE2E2" />
            <StatRow icon="time"             label="Leave"        value={String(stats.leaveDays)}   color="#D97706" bg="#FEF3C7" />
            <StatRow icon="calendar"         label="Working Days" value={String(stats.workDays)}    color="#4F46E5" bg="#E0E7FF" />
          </View>
        </View>
        <View style={s.divider} />
        <Text style={s.subTitle}>Monthly Breakdown</Text>
        <BarChart
          data={[
            { label: 'Present', value: stats.presentDays },
            { label: 'Absent',  value: stats.absentDays },
            { label: 'Leave',   value: stats.leaveDays },
            { label: 'Holiday', value: stats.totalDays - stats.workDays },
          ]}
          color="#4F46E5" maxVal={stats.totalDays}
        />
      </SectionCard>

      {/* Academic Performance */}
      <SectionCard icon="stats-chart-outline" iconBg="#E0E7FF" iconColor="#4F46E5" title="Academic Performance">
        <View style={s.ringRow}>
          <Ring pct={overallPct} color="#4F46E5" />
          <View style={{ flex: 1 }}>
            <StatRow icon="ribbon"       label="Obtained"  value={`${grandObtained}/${grandTotal}`} color="#4F46E5" bg="#E0E7FF" />
            <StatRow icon="trending-up"  label="Overall"   value={`${overallPct}%`}                 color="#16A34A" bg="#DCFCE7" />
            <StatRow icon="close-circle" label="Lost"      value={String(grandTotal - grandObtained)} color="#DC2626" bg="#FEE2E2" />
          </View>
        </View>
        <View style={s.divider} />
        <Text style={s.subTitle}>Subject-wise Marks</Text>
        <BarChart data={SUBJECT_PERF.map(sp => ({ label: sp.subject.split(' ')[0], value: sp.obtained }))} color="#4F46E5" maxVal={100} />
        <View style={s.divider} />
        <Text style={s.subTitle}>Subject Progress</Text>
        {SUBJECT_PERF.map(sp => <SubjectBar key={sp.subject} name={sp.subject} pct={Math.round((sp.obtained / sp.total) * 100)} color={sp.color} />)}
      </SectionCard>

      {/* Homework */}
      <SectionCard icon="book-outline" iconBg="#EDE9FE" iconColor="#7C3AED" title="Homework Summary">
        <View style={s.row3}>
          {[
            { label: 'Assigned',  value: '12', color: '#4F46E5', bg: '#E0E7FF' },
            { label: 'Submitted', value: '10', color: '#16A34A', bg: '#DCFCE7' },
            { label: 'Pending',   value: '2',  color: '#DC2626', bg: '#FEE2E2' },
          ].map(c => (
            <View key={c.label} style={[s.miniCard, { backgroundColor: c.bg }]}>
              <Text style={[s.miniVal, { color: c.color }]}>{c.value}</Text>
              <Text style={s.miniLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
        <View style={s.divider} />
        <BarChart data={[{ label: 'Physics', value: 3 }, { label: 'Math', value: 4 }, { label: 'Chem', value: 2 }, { label: 'Eng', value: 2 }, { label: 'Hist', value: 1 }]} color="#7C3AED" maxVal={5} />
      </SectionCard>
    </>
  );
};

// ─── Teacher Analytics ────────────────────────────────────────────────────────
const CLASS_DATA = [
  { class: 'Class 9A',  students: 42, present: 38, homework: 3, avgScore: 78 },
  { class: 'Class 8B',  students: 38, present: 34, homework: 2, avgScore: 72 },
  { class: 'Class 10A', students: 45, present: 40, homework: 4, avgScore: 81 },
  { class: 'Class 7C',  students: 36, present: 30, homework: 2, avgScore: 68 },
];

const TeacherAnalytics = () => {
  const [activeClass, setActiveClass] = useState(0);
  const cls = CLASS_DATA[activeClass];
  const attPct = Math.round((cls.present / cls.students) * 100);
  const attColor = attPct >= 75 ? '#16A34A' : '#DC2626';
  const totalStudents = CLASS_DATA.reduce((s, c) => s + c.students, 0);
  const totalPresent  = CLASS_DATA.reduce((s, c) => s + c.present, 0);
  const overallAtt    = Math.round((totalPresent / totalStudents) * 100);

  return (
    <>
      {/* Overview */}
      <View style={s.row3}>
        {[
          { label: 'Total Students', value: String(totalStudents), icon: 'people',    color: '#4F46E5', bg: '#E0E7FF' },
          { label: 'Avg Attendance', value: `${overallAtt}%`,      icon: 'calendar',  color: '#16A34A', bg: '#DCFCE7' },
          { label: 'Classes',        value: String(CLASS_DATA.length), icon: 'school', color: '#D97706', bg: '#FEF3C7' },
        ].map(c => (
          <View key={c.label} style={[s.overviewCard, { backgroundColor: c.bg }]}>
            <VectorIcon iconSet="Ionicons" iconName={c.icon} size={20} color={c.color} />
            <Text style={[s.overviewVal, { color: c.color }]}>{c.value}</Text>
            <Text style={s.overviewLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {/* Class-wise */}
      <SectionCard icon="school-outline" iconBg="#E0E7FF" iconColor="#4F46E5" title="Class-wise Analytics">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
          {CLASS_DATA.map((c, i) => (
            <TouchableOpacity key={i} style={[s.tab, activeClass === i && s.tabActive]} onPress={() => setActiveClass(i)}>
              <Text style={[s.tabText, activeClass === i && s.tabTextActive]}>{c.class}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={s.ringRow}>
          <Ring pct={attPct} color={attColor} />
          <View style={{ flex: 1 }}>
            <StatRow icon="people"           label="Total Students" value={String(cls.students)}              color="#4F46E5" bg="#E0E7FF" />
            <StatRow icon="checkmark-circle" label="Present Today"  value={String(cls.present)}               color="#16A34A" bg="#DCFCE7" />
            <StatRow icon="close-circle"     label="Absent Today"   value={String(cls.students - cls.present)} color="#DC2626" bg="#FEE2E2" />
            <StatRow icon="stats-chart"      label="Avg Score"      value={`${cls.avgScore}%`}                color="#D97706" bg="#FEF3C7" />
          </View>
        </View>
      </SectionCard>

      {/* Attendance by class */}
      <SectionCard icon="calendar-outline" iconBg="#DCFCE7" iconColor="#16A34A" title="Attendance by Class">
        <BarChart data={CLASS_DATA.map(c => ({ label: c.class.replace('Class ', ''), value: Math.round((c.present / c.students) * 100) }))} color="#16A34A" maxVal={100} />
        <View style={s.divider} />
        {CLASS_DATA.map((c, i) => {
          const pct = Math.round((c.present / c.students) * 100);
          const col = pct >= 75 ? '#16A34A' : '#DC2626';
          return <SubjectBar key={i} name={c.class} pct={pct} color={col} />;
        })}
      </SectionCard>

      {/* Homework */}
      <SectionCard icon="book-outline" iconBg="#EDE9FE" iconColor="#7C3AED" title="Homework Assigned">
        <BarChart data={CLASS_DATA.map(c => ({ label: c.class.replace('Class ', ''), value: c.homework }))} color="#7C3AED" maxVal={5} />
        <View style={s.divider} />
        <View style={s.row3}>
          {[
            { label: 'Total',   value: String(CLASS_DATA.reduce((s, c) => s + c.homework, 0)), color: '#7C3AED', bg: '#EDE9FE' },
            { label: 'Avg/Class', value: String(Math.round(CLASS_DATA.reduce((s, c) => s + c.homework, 0) / CLASS_DATA.length)), color: '#4F46E5', bg: '#E0E7FF' },
            { label: 'Pending', value: '3', color: '#D97706', bg: '#FEF3C7' },
          ].map(c => (
            <View key={c.label} style={[s.miniCard, { backgroundColor: c.bg }]}>
              <Text style={[s.miniVal, { color: c.color }]}>{c.value}</Text>
              <Text style={s.miniLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* Avg Score */}
      <SectionCard icon="trophy-outline" iconBg="#FEF3C7" iconColor="#D97706" title="Average Score by Class">
        <BarChart data={CLASS_DATA.map(c => ({ label: c.class.replace('Class ', ''), value: c.avgScore }))} color="#D97706" maxVal={100} />
        <View style={s.divider} />
        {CLASS_DATA.map((c, i) => <SubjectBar key={i} name={c.class} pct={c.avgScore} color="#D97706" />)}
      </SectionCard>
    </>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AnalyticsScreen = () => {
  const route = useRoute<any>();
  const role: Role = route?.params?.userRole === 'teacher' ? 'teacher' : 'student';

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <Header title="Analytics" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Hero */}
        <View style={s.hero}>
          <View style={[s.heroIcon, { backgroundColor: role === 'teacher' ? '#1E293B' : theme.colors.primary }]}>
            <VectorIcon iconSet="Ionicons" iconName="bar-chart" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>{role === 'teacher' ? 'Teacher Analytics' : 'Student Analytics'}</Text>
            <Text style={s.heroSub}>{role === 'teacher' ? 'Class performance & attendance overview' : 'Your academic & attendance summary'}</Text>
          </View>
          <View style={[s.roleBadge, { backgroundColor: role === 'teacher' ? '#1E293B' : theme.colors.primaryLight }]}>
            <Text style={[s.roleBadgeText, { color: role === 'teacher' ? '#fff' : theme.colors.primary }]}>
              {role === 'teacher' ? '👨🏫 Teacher' : '🎓 Student'}
            </Text>
          </View>
        </View>

        {role === 'student' ? <StudentAnalytics /> : <TeacherAnalytics />}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, gap: 14, paddingBottom: 30 },

  hero: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    padding: theme.spacing.md, elevation: 2,
  },
  heroIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary },
  heroSub: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: theme.radius.full },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },

  row3: { flexDirection: 'row', gap: 8 },
  overviewCard: { flex: 1, borderRadius: theme.radius.md, padding: 12, alignItems: 'center', gap: 5, elevation: 1 },
  overviewVal: { fontSize: 20, fontWeight: '900' },
  overviewLabel: { fontSize: 9, fontWeight: '700', color: theme.colors.textSecondary, textAlign: 'center' },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    padding: theme.spacing.md, gap: 10, elevation: 2,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: theme.colors.textPrimary },
  subTitle: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: theme.colors.border },

  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  monthTabs: { flexDirection: 'row', gap: 6 },
  tab: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: theme.radius.full, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border },
  tabActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  tabText: { fontSize: 11, fontWeight: '600', color: theme.colors.textSecondary },
  tabTextActive: { color: '#fff' },

  miniCard: { flex: 1, borderRadius: theme.radius.sm, padding: 10, alignItems: 'center', gap: 3 },
  miniVal: { fontSize: 18, fontWeight: '900' },
  miniLabel: { fontSize: 9, fontWeight: '700', color: theme.colors.textSecondary, textAlign: 'center' },
});
