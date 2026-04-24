import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { EXAMS, FILTERS, STATUS_CONFIG, TYPE_ICON, Exam, ExamStatus } from './examData';

const ExamsScreen = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState<ExamStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = EXAMS.filter(e => {
    const matchFilter = activeFilter === 'All' || e.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.academicYear.includes(q);
    return matchFilter && matchSearch;
  });

  const renderExam = ({ item }: { item: Exam }) => {
    const sc = STATUS_CONFIG[item.status];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ExamDetail', { exam: item })}
        activeOpacity={0.85}>
        <View style={[styles.accentBar, { backgroundColor: sc.accent }]} />
        <View style={styles.cardInner}>
          <View style={styles.cardTop}>
            <View style={styles.iconWrap}>
              <VectorIcon iconSet="Ionicons" iconName={TYPE_ICON[item.type]} size={20} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.examName}>{item.name}</Text>
              <Text style={styles.examSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: sc.bg }]}>
              <View style={[styles.badgeDot, { backgroundColor: sc.color }]} />
              <Text style={[styles.badgeText, { color: sc.color }]}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <VectorIcon iconSet="Ionicons" iconName="calendar-outline" size={12} color={theme.colors.primary} />
              <Text style={styles.pillText}>{item.academicYear}</Text>
            </View>
            <View style={styles.pill}>
              <VectorIcon iconSet="Ionicons" iconName="layers-outline" size={12} color={theme.colors.primary} />
              <Text style={styles.pillText}>{item.type}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.dateRow}>
              <VectorIcon iconSet="Ionicons" iconName="time-outline" size={13} color={theme.colors.textMuted} />
              <Text style={styles.dateText}>{item.dateRange}</Text>
            </View>
            <View style={styles.viewDetail}>
              <Text style={styles.viewDetailText}>View Details</Text>
              <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={13} color={theme.colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeArea}>
      <Header title="Exams" />

      <View style={styles.searchWrapper}>
        <VectorIcon iconSet="Ionicons" iconName="search-outline" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exams..."
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
            <VectorIcon iconSet="Ionicons" iconName="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}>
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderExam}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No exams found.</Text>}
      />
    </View>
  );
};

export default ExamsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.textPrimary, padding: 0 },

  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    gap: 8,
    alignItems: 'center',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  filterBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  filterTextActive: { color: '#fff' },

  list: { padding: theme.spacing.lg, gap: 14 },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md, gap: 10 },

  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconWrap: {
    width: 40, height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  examName: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary },
  examSubtitle: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  pillsRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: theme.radius.full,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dateText: { fontSize: 12, color: theme.colors.textSecondary },
  viewDetail: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewDetailText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },

  empty: { textAlign: 'center', color: theme.colors.textMuted, marginTop: 40 },
});
