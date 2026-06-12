import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { Exam, EXAMS } from './examData';

interface Props {
  selectedId: string;
  onSelect: (exam: Exam) => void;
}

// Announcement-style horizontal filter chips for choosing an exam
const ExamFilterChips = ({ selectedId, onSelect }: Props) => (
  <View style={s.wrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {EXAMS.map(exam => {
        const active = exam.id === selectedId;
        return (
          <TouchableOpacity
            key={exam.id}
            activeOpacity={0.8}
            onPress={() => onSelect(exam)}
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
              {exam.name} · {exam.academicYear}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
    <View style={s.divider} />
  </View>
);

export default ExamFilterChips;

const s = StyleSheet.create({
  wrapper: { paddingTop: 12 },
  row: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  divider: {
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
});
