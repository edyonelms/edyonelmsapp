import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { SUBJECTS } from './subjectsData';
import type { Subject } from './subjectsData';

// ─── Subject card (shared card template) ─────────────────────────────────────
const SubjectCard = ({ item, onPress }: { item: Subject; onPress: () => void }) => {
  const totalTopics = item.chapters.reduce((sum, c) => sum + c.topics.length, 0);
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.accentBar, { backgroundColor: item.color }]} />
      <View style={s.cardInner}>
        <View style={s.cardTop}>
          <View style={[s.iconWrap, { backgroundColor: item.color + '20' }]}>
            <Text style={s.iconEmoji}>{item.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>{item.name}</Text>
            <Text style={s.cardSubtitle} numberOfLines={1}>
              {item.teacher}
            </Text>
          </View>
          <View style={s.chevronWrap}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="chevron-forward"
              size={16}
              color={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={s.pillsRow}>
          <View style={[s.pill, { backgroundColor: item.color + '15' }]}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="book-outline"
              size={12}
              color={item.color}
            />
            <Text style={[s.pillText, { color: item.color }]}>
              {item.chapters.length} Chapter{item.chapters.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={s.pill}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="document-text-outline"
              size={12}
              color={theme.colors.primary}
            />
            <Text style={s.pillText}>
              {totalTopics} Topic{totalTopics !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SubjectsScreen = ({ navigation }: any) => {
  return (
    <View style={s.root}>
      <Header title="Subjects" />

      <FlatList
        data={SUBJECTS}
        keyExtractor={i => i.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={s.sectionTitle}>All Subjects</Text>
            <Text style={s.sectionDesc}>
              Tap a subject to explore its chapters and topics.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <SubjectCard
            item={item}
            onPress={() => navigation.navigate('SubjectDetails', { subjectId: item.id })}
          />
        )}
      />
    </View>
  );
};

export default SubjectsScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.lg, paddingBottom: 32 },

  // Section title
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  sectionDesc:  { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginBottom: 16 },

  // Card (shared template)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 14,
  },
  accentBar: { height: 4, width: '100%' },
  cardInner: { padding: theme.spacing.md, gap: 10 },

  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 20 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pills (shared template)
  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
});
