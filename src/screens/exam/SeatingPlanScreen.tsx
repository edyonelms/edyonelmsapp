import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { EXAMS, Exam } from './examData';

// ─── Seating Data ─────────────────────────────────────────────────────────────
interface SubjectSeat {
  subject: string;
  subjectCode: string;
  date: string;
  time: string;
  roomNo: string;
  seatNo: string;
}

const SEATING_DATA: Record<string, SubjectSeat[]> = {
  '1': [
    {
      subject: 'Mathematics',
      subjectCode: 'MTH301',
      date: '03/02/2026',
      time: '10:00AM - 12:00PM',
      roomNo: 'A101',
      seatNo: '24',
    },
    {
      subject: 'Science',
      subjectCode: 'SCI302',
      date: '05/02/2026',
      time: '10:00AM - 12:00PM',
      roomNo: 'B002',
      seatNo: '49',
    },
    {
      subject: 'English',
      subjectCode: 'ENG303',
      date: '07/02/2026',
      time: '11:40AM - 1:10PM',
      roomNo: 'A103',
      seatNo: '12',
    },
  ],
  '2': [
    {
      subject: 'Mathematics',
      subjectCode: 'MTH301',
      date: '10/03/2026',
      time: '10:00AM - 12:00PM',
      roomNo: 'C201',
      seatNo: '31',
    },
    {
      subject: 'Science',
      subjectCode: 'SCI302',
      date: '12/03/2026',
      time: '10:00AM - 12:00PM',
      roomNo: 'C202',
      seatNo: '08',
    },
    {
      subject: 'Social Science',
      subjectCode: 'SST304',
      date: '14/03/2026',
      time: '11:40AM - 1:10PM',
      roomNo: 'B005',
      seatNo: '17',
    },
  ],
  '3': [
    {
      subject: 'Mathematics',
      subjectCode: 'MTH301',
      date: '05/11/2025',
      time: '10:00AM - 12:00PM',
      roomNo: 'A101',
      seatNo: '24',
    },
    {
      subject: 'Science',
      subjectCode: 'SCI302',
      date: '07/11/2025',
      time: '10:00AM - 12:00PM',
      roomNo: 'A102',
      seatNo: '36',
    },
  ],
  '4': [
    {
      subject: 'Mathematics',
      subjectCode: 'MTH301',
      date: '01/03/2026',
      time: '10:00AM - 12:00PM',
      roomNo: 'D301',
      seatNo: '55',
    },
    {
      subject: 'Science',
      subjectCode: 'SCI302',
      date: '03/03/2026',
      time: '10:00AM - 12:00PM',
      roomNo: 'D302',
      seatNo: '22',
    },
    {
      subject: 'English',
      subjectCode: 'ENG303',
      date: '05/03/2026',
      time: '11:40AM - 1:10PM',
      roomNo: 'D303',
      seatNo: '41',
    },
    {
      subject: 'Social Science',
      subjectCode: 'SST304',
      date: '07/03/2026',
      time: '11:40AM - 1:10PM',
      roomNo: 'D304',
      seatNo: '09',
    },
  ],
};

// ─── Seat Card ────────────────────────────────────────────────────────────────
const SeatCard = ({
  item,
  examName,
}: {
  item: SubjectSeat;
  examName: string;
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.card}>
      {/* Date & Time chips */}
      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="calendar-outline"
            size={13}
            color={theme.colors.secondary}
          />
          <Text style={styles.chipText}>Date: {item.date}</Text>
        </View>
        <View style={styles.chip}>
          <VectorIcon
            iconSet="Ionicons"
            iconName="time-outline"
            size={13}
            color={theme.colors.secondary}
          />
          <Text style={styles.chipText}>Time: {item.time}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Exam name row with toggle */}
      <TouchableOpacity
        style={styles.examNameRow}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.8}
      >
        <Text
          style={styles.examNameText}
          numberOfLines={expanded ? undefined : 2}
        >
          {examName} — {item.subject}
        </Text>
        <VectorIcon
          iconSet="Ionicons"
          iconName={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.secondary}
        />
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.divider} />

          {/* Subject */}
          <View style={styles.subjectSection}>
            <Text style={styles.fieldLabel}>Subject</Text>
            <Text style={styles.subjectValue}>
              {item.subject} — {item.subjectCode}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Room & Seat */}
          <View style={styles.roomSeatRow}>
            <View style={styles.roomSeatItem}>
              <Text style={styles.fieldLabel}>Room No</Text>
              <View style={styles.roomSeatBox}>
                <Text style={styles.roomSeatValue}>{item.roomNo}</Text>
              </View>
            </View>
            <View style={styles.roomSeatDivider} />
            <View style={styles.roomSeatItem}>
              <Text style={styles.fieldLabel}>Seat No</Text>
              <View style={styles.roomSeatBox}>
                <Text style={styles.roomSeatValue}>{item.seatNo}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const SeatingPlanScreen = () => {
  const [selectedExam, setSelectedExam] = useState<Exam>(EXAMS[0]);
  const [dropOpen, setDropOpen] = useState(false);

  const seats = SEATING_DATA[selectedExam.id] ?? [];

  return (
    <View style={styles.safeArea}>
      <Header title="Seating Plan" />

      <FlatList
        data={seats}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Exam Selector */}
            <View style={[styles.dropWrap, dropOpen && { zIndex: 99 }]}>
              <TouchableOpacity
                style={styles.dropBtn}
                onPress={() => setDropOpen(o => !o)}
                activeOpacity={0.8}
              >
                <View style={styles.dropLeft}>
                  <View style={styles.dropIconWrap}>
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="document-text-outline"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View>
                    <Text style={styles.dropLabel}>Selected Exam</Text>
                    <Text style={styles.dropSelected}>
                      {selectedExam.name} — {selectedExam.academicYear}
                    </Text>
                  </View>
                </View>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName={dropOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>

              {dropOpen && (
                <View style={styles.dropList}>
                  {EXAMS.map(exam => (
                    <TouchableOpacity
                      key={exam.id}
                      style={[
                        styles.dropItem,
                        exam.id === selectedExam.id && styles.dropItemActive,
                      ]}
                      onPress={() => {
                        setSelectedExam(exam);
                        setDropOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.dropItemTitle,
                            exam.id === selectedExam.id &&
                              styles.dropItemTitleActive,
                          ]}
                        >
                          {exam.name}
                        </Text>
                        <Text style={styles.dropItemSub}>
                          {exam.type} · {exam.academicYear}
                        </Text>
                      </View>
                      {exam.id === selectedExam.id && (
                        <VectorIcon
                          iconSet="Ionicons"
                          iconName="checkmark-circle"
                          size={18}
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Info banner */}
            <View style={styles.infoBanner}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="information-circle-outline"
                size={16}
                color={theme.colors.secondary}
              />
              <Text style={styles.infoBannerText}>
                {seats.length} subject{seats.length !== 1 ? 's' : ''} ·{' '}
                {selectedExam.dateRange}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <SeatCard item={item} examName={selectedExam.name} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconRing}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="grid-outline"
                size={36}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.emptyTitle}>No seating plan</Text>
            <Text style={styles.emptySubtitle}>
              Not available for this exam yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default SeatingPlanScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.lg, gap: 14, paddingBottom: 30 },

  // Dropdown
  dropWrap: { marginBottom: 12, zIndex: 99 },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 2,
  },
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dropIconWrap: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropLabel: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
  dropSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  dropList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 4,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  dropItemActive: { backgroundColor: theme.colors.primaryLight },
  dropItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  dropItemTitleActive: { color: theme.colors.primary, fontWeight: '700' },
  dropItemSub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },

  // Info banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F2FE',
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondary,
  },

  // Card
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    padding: theme.spacing.md,
    paddingBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: theme.colors.secondary },

  divider: { height: 1, backgroundColor: theme.colors.border },

  examNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    gap: 10,
  },
  examNameText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },

  subjectSection: { padding: theme.spacing.md, gap: 4 },
  fieldLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  subjectValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  roomSeatRow: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: 12,
  },
  roomSeatItem: { flex: 1, gap: 8 },
  roomSeatDivider: { width: 1, backgroundColor: theme.colors.border },
  roomSeatBox: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roomSeatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },

  // Empty
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
