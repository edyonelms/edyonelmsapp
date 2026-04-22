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
  const totalChapters = SUBJECTS.reduce((s, sub) => s + sub.chapters.length, 0);
  const totalTopics   = SUBJECTS.reduce((s, sub) => sub.chapters.reduce((cs, c) => cs + c.topics.length, s), 0);

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
            {/* Summary banner */}
            <View style={s.banner}>
              {/* <View style={s.bannerBlob} /> */}
              <View style={s.bannerContent}>
                <View style={s.bannerStat}>
                  <Text style={s.bannerStatVal}>{SUBJECTS.length}</Text>
                  <Text style={s.bannerStatLbl}>Subjects</Text>
                </View>
                <View style={s.bannerDivider} />
                <View style={s.bannerStat}>
                  <Text style={s.bannerStatVal}>{totalChapters}</Text>
                  <Text style={s.bannerStatLbl}>Chapters</Text>
                </View>
                <View style={s.bannerDivider} />
                <View style={s.bannerStat}>
                  <Text style={s.bannerStatVal}>{totalTopics}</Text>
                  <Text style={s.bannerStatLbl}>Topics</Text>
                </View>
              </View>
            </View>

            <Text style={s.sectionTitle}>All Subjects</Text>
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

  // Banner
  banner: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20, padding: 20, marginBottom: 20,
    overflow: 'hidden',
    shadowColor: theme.colors.primary, shadowOpacity: 0.25,
    shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 6,
  },
  bannerBlob: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)', top: -40, right: -30,
  },
  bannerContent: { flexDirection: 'row', alignItems: 'center' },
  bannerStat:    { flex: 1, alignItems: 'center' },
  bannerStatVal: { fontSize: 26, fontWeight: '900', color: '#fff' },
  bannerStatLbl: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginTop: 2 },
  bannerDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.25)' },

  // Section title
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12 },

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
