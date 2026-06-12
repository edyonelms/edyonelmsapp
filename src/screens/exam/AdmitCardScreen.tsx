import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import {
  EXAMS,
  Exam,
  SEATING_DATA,
  STATUS_CONFIG,
  STUDENT_INFO,
  TYPE_ICON,
} from './examData';
import ExamDropdown from './ExamDropdown';

const pdfName = (exam: Exam) =>
  `Admit_Card_${exam.name.replace(/\s+/g, '_')}_${exam.academicYear}.pdf`;

const AdmitCardScreen = ({ navigation }: any) => {
  const [exam, setExam] = useState<Exam>(EXAMS[0]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const schedule = SEATING_DATA[exam.id] ?? [];
  const status = STATUS_CONFIG[exam.status];

  const chooseExam = (e: Exam) => {
    setExam(e);
    setGenerated(false);
    setGenerating(false);
  };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1100);
  };

  const onDownload = () =>
    Alert.alert('Downloaded', `${pdfName(exam)} has been saved to Downloads.`);
  const onPrint = () =>
    Alert.alert('Print', `${pdfName(exam)} has been sent to the printer.`);

  return (
    <View style={s.root}>
      <Header title="Admit Card" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
      >
        <ExamDropdown selected={exam} onSelect={chooseExam} />

        {/* ── Selected exam card (announcement style) ── */}
        <View style={s.card}>
          <View style={[s.accent, { backgroundColor: status.accent }]} />
          <View style={s.cardInner}>
            <View style={s.topRow}>
              <View style={s.iconBox}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={TYPE_ICON[exam.type]}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={s.meta}>
                <Text style={s.title} numberOfLines={1}>
                  {exam.name}
                </Text>
                <View style={s.metaRow}>
                  <View style={s.tagPill}>
                    <Text style={s.tagText}>{exam.type}</Text>
                  </View>
                  <View style={[s.tagPill, { backgroundColor: status.bg }]}>
                    <Text style={[s.tagText, { color: status.color }]}>
                      {exam.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={s.detailRow}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="calendar-outline"
                size={14}
                color={theme.colors.textMuted}
              />
              <Text style={s.detailText}>{exam.dateRange}</Text>
            </View>
            <View style={s.detailRow}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="location-outline"
                size={14}
                color={theme.colors.textMuted}
              />
              <Text style={s.detailText}>{exam.venue}</Text>
            </View>
          </View>
        </View>

        {/* ── Generate / Preview ── */}
        {!generated ? (
          <View style={s.generateBox}>
            <View style={s.generateIconRing}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="card-outline"
                size={34}
                color={theme.colors.primary}
              />
            </View>
            <Text style={s.generateTitle}>Admit card not generated</Text>
            <Text style={s.generateSubtitle}>
              Generate the admit card for {exam.name} ({exam.academicYear}) to
              preview, download or print it.
            </Text>
            <TouchableOpacity
              style={[s.generateBtn, generating && { opacity: 0.7 }]}
              onPress={generate}
              disabled={generating}
              activeOpacity={0.85}
            >
              {generating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="document-text-outline"
                  size={16}
                  color="#fff"
                />
              )}
              <Text style={s.generateBtnText}>
                {generating ? 'Generating…' : 'Generate Admit Card'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* PDF toolbar */}
            <View style={s.pdfBar}>
              <View style={s.pdfBadge}>
                <Text style={s.pdfBadgeText}>PDF</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.pdfName} numberOfLines={1}>
                  {pdfName(exam)}
                </Text>
                <Text style={s.pdfMeta}>1 page · 215 KB</Text>
              </View>
              <VectorIcon
                iconSet="Ionicons"
                iconName="eye-outline"
                size={18}
                color={theme.colors.textMuted}
              />
            </View>

            {/* ── Paper preview ── */}
            <View style={s.paper}>
              <Text style={s.paperSchool}>EDYONE PUBLIC SCHOOL</Text>
              <Text style={s.paperAddress}>
                42, MG Road, Aligarh, Uttar Pradesh – 202001
              </Text>
              <View style={s.paperTitlePill}>
                <Text style={s.paperTitleText}>
                  ADMIT CARD — {exam.name.toUpperCase()} ({exam.academicYear})
                </Text>
              </View>

              {/* Student row */}
              <View style={s.studentRow}>
                <Image source={{ uri: STUDENT_INFO.photo }} style={s.studentPhoto} />
                <View style={s.studentGrid}>
                  {[
                    ['Name', STUDENT_INFO.name],
                    ['Class', STUDENT_INFO.className],
                    ['Roll No', STUDENT_INFO.rollNo],
                    ['Admission No', STUDENT_INFO.admissionNo],
                  ].map(([label, value]) => (
                    <View key={label} style={s.studentField}>
                      <Text style={s.studentLabel}>{label}</Text>
                      <Text style={s.studentValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Schedule table */}
              <View style={s.table}>
                <View style={[s.tr, s.trHead]}>
                  <Text style={[s.th, { flex: 1.6 }]}>Subject</Text>
                  <Text style={[s.th, { flex: 1.1 }]}>Date</Text>
                  <Text style={[s.th, { flex: 1.4 }]}>Time</Text>
                  <Text style={[s.th, { flex: 0.7 }]}>Room</Text>
                  <Text style={[s.th, { flex: 0.6 }]}>Seat</Text>
                </View>
                {schedule.map((row, i) => (
                  <View
                    key={row.subjectCode}
                    style={[s.tr, i % 2 === 1 && s.trAlt]}
                  >
                    <Text style={[s.td, { flex: 1.6, fontWeight: '700' }]}>
                      {row.subject}
                    </Text>
                    <Text style={[s.td, { flex: 1.1 }]}>{row.date}</Text>
                    <Text style={[s.td, { flex: 1.4 }]}>{row.time}</Text>
                    <Text style={[s.td, { flex: 0.7 }]}>{row.roomNo}</Text>
                    <Text style={[s.td, { flex: 0.6 }]}>{row.seatNo}</Text>
                  </View>
                ))}
              </View>

              {/* Signatures */}
              <View style={s.signRow}>
                <View style={s.signBox}>
                  <View style={s.signLine} />
                  <Text style={s.signLabel}>Class Teacher</Text>
                </View>
                <View style={s.signBox}>
                  <View style={s.signLine} />
                  <Text style={s.signLabel}>Principal</Text>
                </View>
              </View>

              <Text style={s.paperNote}>
                Note: Carry this admit card on all exam days. Report 30 minutes
                before the exam starts.
              </Text>
            </View>

            {/* ── Actions ── */}
            <View style={s.actionRow}>
              <TouchableOpacity
                style={s.actionPrimary}
                onPress={onDownload}
                activeOpacity={0.85}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="download-outline"
                  size={17}
                  color="#fff"
                />
                <Text style={s.actionPrimaryText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.actionGhost}
                onPress={onPrint}
                activeOpacity={0.85}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="print-outline"
                  size={17}
                  color={theme.colors.primary}
                />
                <Text style={s.actionGhostText}>Print</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AdmitCardScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },

  // Exam card (announcement style)
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
  cardInner: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagPill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
    backgroundColor: theme.colors.primaryLight,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: theme.colors.primary },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },

  // Generate box
  generateBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  generateIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  generateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  generateSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  generateBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // PDF toolbar
  pdfBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  pdfBadge: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  pdfName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  pdfMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 1 },

  // Paper preview
  paper: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  paperSchool: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  paperAddress: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  paperTitlePill: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 10,
  },
  paperTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.6,
  },
  studentRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    alignItems: 'center',
  },
  studentPhoto: {
    width: 64,
    height: 76,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  studentGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  studentField: { width: '50%', paddingVertical: 3 },
  studentLabel: { fontSize: 9, color: theme.colors.textMuted, fontWeight: '600' },
  studentValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  // Table
  table: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    gap: 4,
  },
  trHead: { backgroundColor: theme.colors.primaryLight },
  trAlt: { backgroundColor: theme.colors.background },
  th: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  td: { fontSize: 10, color: theme.colors.textPrimary },

  // Signatures
  signRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
    paddingHorizontal: 6,
  },
  signBox: { alignItems: 'center', width: 100 },
  signLine: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.textSecondary,
    marginBottom: 4,
  },
  signLabel: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  paperNote: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginTop: 12,
    lineHeight: 13,
  },

  // Actions
  actionRow: { flexDirection: 'row', gap: 12 },
  actionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 13,
  },
  actionPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  actionGhost: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    paddingVertical: 13,
  },
  actionGhostText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
