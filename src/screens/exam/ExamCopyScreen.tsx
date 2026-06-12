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
  EXAMS,
  EXAM_RESULTS,
  Exam,
  GRADE_META,
  STUDENT_INFO,
  SubjectResult,
} from './examData';
import ExamDropdown from './ExamDropdown';

// Question-wise mock split of the obtained marks for the copy preview
const QUESTION_SPLIT = [0.2, 0.2, 0.25, 0.2, 0.15];
const buildBreakdown = (r: SubjectResult) => {
  const maxes = QUESTION_SPLIT.map(w => Math.round(r.total * w));
  maxes[maxes.length - 1] += r.total - maxes.reduce((a, b) => a + b, 0);
  const ratio = r.obtained / r.total;
  const got = maxes.map(m => Math.round(m * ratio));
  got[got.length - 1] += r.obtained - got.reduce((a, b) => a + b, 0);
  return maxes.map((max, i) => ({ q: `Q${i + 1}`, max, got: got[i] }));
};

const SubjectCard = ({
  item,
  onViewCopy,
}: {
  item: SubjectResult;
  onViewCopy: (item: SubjectResult) => void;
}) => {
  const grade = GRADE_META[item.grade] ?? GRADE_META.B;
  const pct = Math.round((item.obtained / item.total) * 100);

  return (
    <View style={s.card}>
      <View style={[s.accent, { backgroundColor: grade.color }]} />
      <View style={s.cardInner}>
        {/* Top row */}
        <View style={s.topRow}>
          <View style={[s.iconBox, { backgroundColor: grade.bg }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="document-text-outline"
              size={20}
              color={grade.color}
            />
          </View>
          <View style={s.meta}>
            <Text style={s.title} numberOfLines={1}>
              {item.subject}
            </Text>
            <View style={s.metaRow}>
              <View style={s.codePill}>
                <Text style={s.codeText}>{item.code}</Text>
              </View>
              <View style={[s.gradePill, { backgroundColor: grade.bg }]}>
                <Text style={[s.gradeText, { color: grade.color }]}>
                  Grade {item.grade}
                </Text>
              </View>
            </View>
          </View>
          <View style={s.marksBox}>
            <Text style={s.marksValue}>
              {item.obtained}
              <Text style={s.marksTotal}>/{item.total}</Text>
            </Text>
            <Text style={s.marksPct}>{pct}%</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={s.progressTrack}>
          <View
            style={[
              s.progressFill,
              { width: `${pct}%`, backgroundColor: grade.color },
            ]}
          />
        </View>

        {/* View copy */}
        <TouchableOpacity
          style={s.viewBtn}
          onPress={() => onViewCopy(item)}
          activeOpacity={0.85}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="eye-outline"
            size={15}
            color={theme.colors.primary}
          />
          <Text style={s.viewBtnText}>View Copy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ExamCopyScreen = ({ navigation }: any) => {
  const [exam, setExam] = useState<Exam>(EXAMS[0]);
  const [copyOf, setCopyOf] = useState<SubjectResult | null>(null);

  const results = EXAM_RESULTS[exam.id] ?? [];

  const onDownloadCopy = (item: SubjectResult) =>
    Alert.alert(
      'Downloaded',
      `${item.subject}_Copy_${exam.name.replace(/\s+/g, '_')}.pdf has been saved to Downloads.`,
    );

  return (
    <View style={s.root}>
      <Header title="Exam Copy" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
      >
        <ExamDropdown selected={exam} onSelect={setExam} />

        {results.length > 0 && (
          <View style={s.infoBanner}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="information-circle-outline"
              size={16}
              color={theme.colors.secondary}
            />
            <Text style={s.infoBannerText}>
              {results.length} evaluated cop{results.length !== 1 ? 'ies' : 'y'}{' '}
              · {exam.name} ({exam.academicYear})
            </Text>
          </View>
        )}

        {results.length === 0 ? (
          <View style={s.emptyBox}>
            <View style={s.emptyIconRing}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="documents-outline"
                size={36}
                color={theme.colors.primary}
              />
            </View>
            <Text style={s.emptyTitle}>No copies yet</Text>
            <Text style={s.emptySubtitle}>
              Evaluated copies will appear here after the exam is checked
            </Text>
          </View>
        ) : (
          results.map(item => (
            <SubjectCard key={item.code} item={item} onViewCopy={setCopyOf} />
          ))
        )}
      </ScrollView>

      {/* ── Copy preview modal ── */}
      <Modal
        visible={!!copyOf}
        transparent
        animationType="slide"
        onRequestClose={() => setCopyOf(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            {/* Sheet header */}
            <View style={s.sheetHeader}>
              <View style={s.pdfBadge}>
                <Text style={s.pdfBadgeText}>PDF</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.sheetTitle} numberOfLines={1}>
                  {copyOf?.subject} — Evaluated Copy
                </Text>
                <Text style={s.sheetSub}>
                  {exam.name} · {exam.academicYear}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCopyOf(null)}
                style={s.closeBtn}
                activeOpacity={0.8}
              >
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="close"
                  size={20}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {copyOf && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.sheetBody}
              >
                {/* Paper */}
                <View style={s.paper}>
                  <Text style={s.paperSchool}>EDYONE PUBLIC SCHOOL</Text>
                  <Text style={s.paperHeading}>
                    EVALUATED ANSWER COPY — {copyOf.subject.toUpperCase()}
                  </Text>
                  <Text style={s.paperStudent}>
                    {STUDENT_INFO.name} · {STUDENT_INFO.className} · Roll No{' '}
                    {STUDENT_INFO.rollNo}
                  </Text>

                  {/* Question table */}
                  <View style={s.table}>
                    <View style={[s.tr, s.trHead]}>
                      <Text style={[s.th, { flex: 1.4 }]}>Question</Text>
                      <Text style={[s.th, s.thRight]}>Max</Text>
                      <Text style={[s.th, s.thRight]}>Awarded</Text>
                    </View>
                    {buildBreakdown(copyOf).map((row, i) => (
                      <View key={row.q} style={[s.tr, i % 2 === 1 && s.trAlt]}>
                        <Text style={[s.td, { flex: 1.4, fontWeight: '700' }]}>
                          {row.q}
                        </Text>
                        <Text style={[s.td, s.tdRight]}>{row.max}</Text>
                        <Text style={[s.td, s.tdRight]}>{row.got}</Text>
                      </View>
                    ))}
                    <View style={[s.tr, s.trTotal]}>
                      <Text style={[s.td, { flex: 1.4, fontWeight: '800' }]}>
                        Total
                      </Text>
                      <Text style={[s.td, s.tdRight, { fontWeight: '800' }]}>
                        {copyOf.total}
                      </Text>
                      <Text
                        style={[
                          s.td,
                          s.tdRight,
                          { fontWeight: '800', color: theme.colors.primary },
                        ]}
                      >
                        {copyOf.obtained}
                      </Text>
                    </View>
                  </View>

                  {/* Checked stamp + sign */}
                  <View style={s.stampRow}>
                    <View style={s.stamp}>
                      <Text style={s.stampText}>CHECKED</Text>
                    </View>
                    <View style={s.signBox}>
                      <View style={s.signLine} />
                      <Text style={s.signLabel}>Examiner's Sign</Text>
                    </View>
                  </View>
                </View>

                {/* Download */}
                <TouchableOpacity
                  style={s.downloadBtn}
                  onPress={() => onDownloadCopy(copyOf)}
                  activeOpacity={0.85}
                >
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="download-outline"
                    size={17}
                    color="#fff"
                  />
                  <Text style={s.downloadBtnText}>Download Copy</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExamCopyScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },

  // Info banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
  },

  // Subject card (announcement style)
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
  codePill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  gradePill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  gradeText: { fontSize: 10, fontWeight: '700' },
  marksBox: { alignItems: 'flex-end' },
  marksValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  marksTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  marksPct: { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.background,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },

  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 9,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Empty
  emptyBox: { alignItems: 'center', paddingTop: 50, paddingHorizontal: 30 },
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
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
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
    maxHeight: '88%',
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
  pdfBadge: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  sheetSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 1 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetBody: { padding: 16, gap: 14 },

  // Paper
  paper: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  paperSchool: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  paperHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.6,
    marginTop: 6,
  },
  paperStudent: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
  },

  table: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
  },
  trHead: { backgroundColor: theme.colors.primaryLight },
  trAlt: { backgroundColor: theme.colors.background },
  trTotal: {
    backgroundColor: theme.colors.primaryLight,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  th: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    flex: 1,
  },
  thRight: { textAlign: 'right' },
  td: { fontSize: 11, color: theme.colors.textPrimary, flex: 1 },
  tdRight: { textAlign: 'right' },

  stampRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingHorizontal: 4,
  },
  stamp: {
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    transform: [{ rotate: '-8deg' }],
  },
  stampText: {
    fontSize: 11,
    fontWeight: '900',
    color: theme.colors.success,
    letterSpacing: 2,
  },
  signBox: { alignItems: 'center', width: 110 },
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

  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 13,
    marginBottom: 10,
  },
  downloadBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
