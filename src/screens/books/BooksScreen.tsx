import React, { useState, useMemo } from 'react';
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
import AttachmentPreviewModal from '../announcement/AttachmentPreviewModal';
import BookCard from './BookCard';
import { BOOKS, SUBJECTS, SUBJECT_COLORS } from './bookData';
import type { Book } from './bookData';

const BooksScreen = ({ navigation }: any) => {
  const [activeSubject, setActiveSubject] = useState('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filtered = useMemo(() =>
    activeSubject === 'All' ? BOOKS : BOOKS.filter(b => b.subject === activeSubject),
    [activeSubject],
  );

  const selectedMeta = selectedBook
    ? SUBJECT_COLORS[selectedBook.subject] ?? SUBJECT_COLORS.All
    : null;

  return (
    <View style={s.root}>
      <Header title="Books" onBackPress={() => navigation.goBack()} />

      {/* Filter chips */}
      <View style={s.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersRow}
        >
          {SUBJECTS.map(subj => {
            const active = activeSubject === subj;
            const meta = SUBJECT_COLORS[subj];
            return (
              <TouchableOpacity
                key={subj}
                activeOpacity={0.8}
                onPress={() => setActiveSubject(subj)}
                style={[s.chip, active && { backgroundColor: meta.color, borderColor: meta.color }]}
              >
                {active && <View style={s.chipDot} />}
                <Text style={[s.chipText, active && s.chipTextActive, !active && { color: meta.color }]}>
                  {subj}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Book grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={s.row}
        contentContainerStyle={s.listContent}
        renderItem={({ item }) => (
          <BookCard item={item} onViewPress={setSelectedBook} />
        )}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <View style={s.emptyIconRing}>
              <VectorIcon iconSet="Ionicons" iconName="book-outline" size={36} color={theme.colors.primary} />
            </View>
            <Text style={s.emptyTitle}>No books found</Text>
            <Text style={s.emptySubtitle}>No books available for this subject</Text>
          </View>
        }
      />

      {/* Preview modal */}
      <AttachmentPreviewModal
        visible={selectedBook !== null}
        type="pdf"
        accentColor={selectedMeta?.color ?? theme.colors.primary}
        imageUri={selectedBook?.imageUri}
        onClose={() => setSelectedBook(null)}
      />
    </View>
  );
};

export default BooksScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  filtersWrapper: { paddingVertical: 12 },
  filtersRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: theme.radius.full, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: theme.colors.white, borderWidth: 1.5, borderColor: theme.colors.border,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  chipText: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  chipTextActive: { color: '#fff' },

  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: 16 },

  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyIconRing: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: theme.colors.textMuted },
});
