import React from 'react';
import {
  Dimensions,
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

const { width } = Dimensions.get('window');
const COLS     = 3;
const GAP      = 10;
const CARD_W   = (width - 32 - GAP * (COLS - 1)) / COLS;

const SubjectCard = ({ item, onPress }: { item: Subject; onPress: () => void }) => (
  <TouchableOpacity style={[s.card, { backgroundColor: item.bg }]} onPress={onPress} activeOpacity={0.8}>
    {/* Top accent line */}
    <View style={[s.cardAccent, { backgroundColor: item.color }]} />

    {/* Icon */}
    <View style={[s.iconWrap, { backgroundColor: item.color + '22' }]}>
      <Text style={s.iconEmoji}>{item.icon}</Text>
    </View>

    {/* Name */}
    <Text style={[s.cardName, { color: item.color }]} numberOfLines={2}>{item.name}</Text>

    {/* Stats */}
    <View style={s.cardStats}>
      <VectorIcon iconSet="Ionicons" iconName="book-outline" size={10} color={item.color} />
      <Text style={[s.cardStatText, { color: item.color }]}>{item.chapters.length} ch</Text>
    </View>
  </TouchableOpacity>
);

const SubjectsScreen = ({ navigation }: any) => {
  return (
    <View style={s.root}>
      <Header title="Subjects" />

      <FlatList
        data={SUBJECTS}
        keyExtractor={i => i.id}
        numColumns={COLS}
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
        columnWrapperStyle={s.row}
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
  list: { padding: 16, paddingBottom: 32 },
  row:  { gap: GAP, marginBottom: GAP },

  // Section title
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  sectionDesc:  { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginBottom: 24 },

  // Card
  card: {
    width: CARD_W,
    borderRadius: 16, overflow: 'hidden',
    alignItems: 'center', paddingBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  cardAccent: { width: '100%', height: 4, marginBottom: 12 },
  iconWrap: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  iconEmoji: { fontSize: 24 },
  cardName:  { fontSize: 12, fontWeight: '800', textAlign: 'center', paddingHorizontal: 6, marginBottom: 6, lineHeight: 16 },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardStatText: { fontSize: 10, fontWeight: '700' },
});
