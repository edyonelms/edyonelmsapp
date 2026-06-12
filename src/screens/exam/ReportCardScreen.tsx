import React, { useState } from 'react';
import {
  Alert,
  Modal,
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
  GRADE_META,
  REPORT_CARDS,
  STUDENT_INFO,
  gradeFor,
} from './examData';

const YEARS = Object.keys(REPORT_CARDS);

const fileName = (year: string) => `Report_Card_${year.replace('-', '_')}.pdf`;

const ReportCardScreen = ({ navigation }: any) => {
  const [year, setYear] = useState(YEARS[0]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const report = REPORT_CARDS[year];
  const totalObtained = report.subjects.reduce((a, r) => a + r.obtained, 0);
  const totalMax = report.subjects.reduce((a, r) => a + r.total, 0);
  const pct = Math.round((totalObtained / totalMax) * 100);
  const overallGrade = gradeFor(pct);

  const onDownload = () =>
    Alert.alert('Downloaded', `${fileName(year)} has been saved to Downloads.`);
  const onPrint = () =>
    Alert.alert('Print', `${fileName(year)} has been sent to the printer.`);

  // ── Full report paper (shared by modal preview) ──
  const reportPaper = (
    <View style={s.paper}>
      <Text style={s.paperSchool}>EDYONE PUBLIC SCHOOL</Text>
      <Text style={s.paperAddress}>
        42, MG Road, Aligarh, Uttar Pradesh – 202001
      </Text>
      <View style={s.paperTitlePill}>
        <Text style={s.paperTitleText}>
          REPORT CARD — {report.term.toUpperCase()} ({report.year})
        </Text>
      </View>

      {/* Student grid */}
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

      {/* Marks table */}
      <View style={s.table}>
        <View style={[s.tr, s.trHead]}>
          <Text style={[s.th, { flex: 1.8 }]}>Subject</Text>
          <Text style={[s.th, s.thRight]}>Max</Text>
          <Text style={[s.th, s.thRight]}>Obtained</Text>
          <Text style={[s.th, s.thRight]}>Grade</Text>
        </View>
        {report.subjects.map((row, i) => (
          <View key={row.code} style={[s.tr, i % 2 === 1 && s.trAlt]}>
            <Text style={[s.td, { flex: 1.8, fontWeight: '700' }]}>
              {row.subject}
            </Text>
            <Text style={[s.td, s.tdRight]}>{row.total}</Text>
            <Text style={[s.td, s.tdRight]}>{row.obtained}</Text>
            <Text
              style={[
                s.td,
                s.tdRight,
                { fontWeight: '800', color: GRADE_META[row.grade]?.color },
              ]}
            >
              {row.grade}
            </Text>
          </View>
        ))}
        <View style={[s.tr, s.trTotal]}>
          <Text style={[s.td, { flex: 1.8, fontWeight: '800' }]}>Total</Text>
          <Text style={[s.td, s.tdRight, { fontWeight: '800' }]}>
            {totalMax}
          </Text>
          <Text
            style={[
              s.td,
              s.tdRight,
              { fontWeight: '800', color: theme.colors.primary },
            ]}
          >
            {totalObtained}
          </Text>
          <Text
            style={[
              s.td,
              s.tdRight,
              { fontWeight: '800', color: theme.colors.primary },
            ]}
          >
            {overallGrade}
          </Text>
        </View>
      </View>

      {/* Summary boxes */}
      <View style={s.summaryRow}>
        {[
          ['Percentage', `${pct}%`],
          ['Grade', overallGrade],
          ['Rank', report.rank],
        ].map(([label, value]) => (
          <View key={label} style={s.summaryBox}>
            <Text style={s.summaryLabel}>{label.toUpperCase()}</Text>
            <Text style={s.summaryValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Attendance & remarks */}
      <View style={s.noteBlock}>
        <Text style={s.noteLabel}>ATTENDANCE</Text>
        <Text style={s.noteValue}>{report.attendance}</Text>
      </View>
      <View style={s.noteBlock}>
        <Text style={s.noteLabel}>CLASS TEACHER'S REMARKS</Text>
        <Text style={s.noteValue}>{report.remarks}</Text>
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
    </View>
  );

  return (
    <View style={s.root}>
      <Header title="Report Card" onBackPress={() => navigation.goBack()} />

      {/* Academic year chips (announcement style) */}
      <View style={s.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.chipsRow}
        >
          {YEARS.map(y => {
            const active = y === year;
            return (
              <TouchableOpacity
                key={y}
                activeOpacity={0.8}
                onPress={() => setYear(y)}
                style={[s.chip, active && s.chipActive]}
              >
                {active && (
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="checkmark-circle"
                    size={13}
                    color="#fff"
                  />
                )}
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  AY {y}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={s.chipsDivider} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
      >
        {/* Academic year details card */}
        <View style={s.card}>
          <View style={s.accentBar} />
          <View style={s.cardInner}>
            <View style={s.topRow}>
              <View style={s.iconBox}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="stats-chart-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={s.metaCol}>
                <Text style={s.cardTitle} numberOfLines={1}>
                  {report.term} · Academic Year {report.year}
                </Text>
                <View style={s.pillRow}>
                  <View style={s.pill}>
                    <Text style={s.pillText}>{STUDENT_INFO.name}</Text>
                  </View>
                  <View style={s.pill}>
                    <Text style={s.pillText}>{STUDENT_INFO.className}</Text>
                  </View>
                  <View style={s.pill}>
                    <Text style={s.pillText}>Roll {STUDENT_INFO.rollNo}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={s.statsRow}>
              {[
                ['Percentage', `${pct}%`],
                ['Grade', overallGrade],
                ['Rank', report.rank.split(' ')[0]],
              ].map(([label, value]) => (
                <View key={label} style={s.statItem}>
                  <Text style={s.statValue}>{value}</Text>
                  <Text style={s.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── WhatsApp-style document bubble ── */}
        <View style={s.bubbleWrap}>
          <TouchableOpacity
            style={s.bubble}
            activeOpacity={0.85}
            onPress={() => setPreviewOpen(true)}
          >
            {/* Mini page thumbnail */}
            <View style={s.thumb}>
              <Text style={s.thumbSchool}>EDYONE PUBLIC SCHOOL</Text>
              <Text style={s.thumbTitle}>REPORT CARD · {report.year}</Text>
              <View style={s.thumbTable}>
                {report.subjects.slice(0, 4).map(r => (
                  <View key={r.code} style={s.thumbRow}>
                    <View style={s.thumbCellWide} />
                    <View style={s.thumbCell} />
                    <View style={s.thumbCell} />
                  </View>
                ))}
              </View>
              <View style={s.thumbOverlay}>
                <View style={s.thumbEye}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="eye-outline"
                    size={14}
                    color="#fff"
                  />
                  <Text style={s.thumbEyeText}>Tap to preview</Text>
                </View>
              </View>
            </View>

            {/* File row */}
            <View style={s.fileRow}>
              <View style={s.pdfBadge}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="document-text"
                  size={18}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.fileName} numberOfLines={1}>
                  {fileName(year)}
                </Text>
                <Text style={s.fileMeta}>1 page · PDF · 248 KB</Text>
              </View>
              <TouchableOpacity
                style={s.fileDownload}
                onPress={onDownload}
                activeOpacity={0.8}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="arrow-down"
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Time + ticks (WhatsApp flavour) */}
            <View style={s.bubbleFooter}>
              <Text style={s.bubbleTime}>10:24 AM</Text>
              <VectorIcon
                iconSet="Ionicons"
                iconName="checkmark-done"
                size={14}
                color={theme.colors.secondary}
              />
            </View>
          </TouchableOpacity>
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
      </ScrollView>

      {/* ── Full preview modal ── */}
      <Modal
        visible={previewOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewOpen(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.sheetHeader}>
              <View style={s.pdfBadge}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="document-text"
                  size={18}
                  color="#fff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.sheetTitle} numberOfLines={1}>
                  {fileName(year)}
                </Text>
                <Text style={s.sheetSub}>
                  {report.term} · {report.year}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onDownload}
                style={s.sheetAction}
                activeOpacity={0.8}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="download-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPreviewOpen(false)}
                style={s.sheetAction}
                activeOpacity={0.8}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="close"
                  size={18}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.sheetBody}
            >
              {reportPaper}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReportCardScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },

  // Year chips
  chipsWrapper: { paddingTop: 12 },
  chipsRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chipsDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginTop: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: { color: theme.colors.white },

  // Details card
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
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: theme.colors.primary,
  },
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
  metaCol: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
    backgroundColor: theme.colors.primaryLight,
  },
  pillText: { fontSize: 10, fontWeight: '700', color: theme.colors.primary },
  statsRow: {
    flexDirection: 'row',
    marginTop: 14,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  statLabel: { fontSize: 10, fontWeight: '600', color: theme.colors.textMuted },

  // WhatsApp-style bubble
  bubbleWrap: { alignItems: 'flex-end' },
  bubble: {
    width: '88%',
    backgroundColor: '#E7FFDB',
    borderRadius: theme.radius.lg,
    borderTopRightRadius: 4,
    padding: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  thumb: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.sm,
    padding: 12,
    overflow: 'hidden',
    height: 120,
  },
  thumbSchool: {
    fontSize: 9,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  thumbTitle: {
    fontSize: 7,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  thumbTable: { marginTop: 8, gap: 5 },
  thumbRow: { flexDirection: 'row', gap: 5 },
  thumbCellWide: {
    flex: 2,
    height: 6,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  thumbCell: {
    flex: 1,
    height: 6,
    borderRadius: 2,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  thumbOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  thumbEye: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15,23,42,0.65)',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  thumbEyeText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: theme.radius.sm,
    padding: 8,
  },
  pdfBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  fileMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 1 },
  fileDownload: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 4,
    paddingRight: 2,
  },
  bubbleTime: { fontSize: 10, color: theme.colors.textMuted },

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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  sheetSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 1 },
  sheetAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: { padding: 16, paddingBottom: 30 },

  // Paper
  paper: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
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
  studentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  studentField: { width: '50%', paddingVertical: 3 },
  studentLabel: { fontSize: 9, color: theme.colors.textMuted, fontWeight: '600' },
  studentValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  table: {
    marginTop: 12,
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
  trTotal: {
    backgroundColor: theme.colors.primaryLight,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  th: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    flex: 1,
  },
  thRight: { textAlign: 'right' },
  td: { fontSize: 10, color: theme.colors.textPrimary, flex: 1 },
  tdRight: { textAlign: 'right' },

  summaryRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  summaryBox: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 2,
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.6,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },

  noteBlock: { marginTop: 12 },
  noteLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  noteValue: {
    fontSize: 11,
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },

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
});
