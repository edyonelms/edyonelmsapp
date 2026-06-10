import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { subjectMetaFor } from './bookData';
import type { ApiBook } from '../../api/booksApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16 padding each side + 16 gap
const IMAGE_HEIGHT = 150;

interface Props {
  item: ApiBook;
  showClass?: boolean;       // teacher cards include class · section
  onViewPress: (book: ApiBook) => void;
}

const BookCard = ({ item, showClass, onViewPress }: Props) => {
  const subjectName = item.subject?.name ?? '—';
  const meta = subjectMetaFor(subjectName);
  const cover = item.cover_url ?? item.logo_url;
  const classLine = item.standard?.name
    ? `${item.standard.name}${item.section?.name ? ' · ' + item.section.name : ''}`
    : null;

  return (
    <View style={[s.card, { width: CARD_WIDTH }]}>
      {/* Fixed height image */}
      <View style={s.imageWrap}>
        {cover ? (
          <Image source={{ uri: cover }} style={s.image} resizeMode="cover" />
        ) : (
          <View style={[s.image, s.imagePlaceholder, { backgroundColor: meta.bg }]}>
            <VectorIcon iconSet="Ionicons" iconName="book-outline" size={42} color={meta.color} />
          </View>
        )}
        <View style={s.imageOverlay} />

        {/* Subject badge */}
        <View style={[s.subjectBadge, { backgroundColor: meta.color }]}>
          <Text style={s.subjectBadgeText} numberOfLines={1}>{subjectName}</Text>
        </View>

        {/* PDF badge */}
        {!!item.pdf_url && (
          <View style={s.pdfBadge}>
            <VectorIcon iconSet="Feather" iconName="file-text" size={9} color="#fff" />
            <Text style={s.pdfBadgeText}>PDF</Text>
          </View>
        )}
      </View>

      {/* Fixed height body */}
      <View style={s.cardBody}>
        <Text style={s.bookTitle} numberOfLines={2}>{item.title}</Text>

        {showClass && classLine ? (
          <View style={s.metaRow}>
            <VectorIcon iconSet="Feather" iconName="users" size={11} color={theme.colors.textMuted} />
            <Text style={s.metaText} numberOfLines={1}>{classLine}</Text>
          </View>
        ) : (
          <View style={s.metaRow}>
            <VectorIcon iconSet="Feather" iconName="book-open" size={11} color={theme.colors.textMuted} />
            <Text style={s.metaText} numberOfLines={1}>{subjectName}</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onViewPress(item)}
          style={[s.viewBtn, { backgroundColor: meta.color }]}
        >
          <VectorIcon iconSet="Ionicons" iconName="book-outline" size={13} color="#fff" />
          <Text style={s.viewBtnText}>{item.pdf_url ? 'Open PDF' : 'View Book'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookCard;

const s = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  imageWrap: { width: '100%', height: IMAGE_HEIGHT },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  imageOverlay: {
    // @ts-ignore
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000028',
  },
  subjectBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: '80%',
  },
  subjectBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  pdfBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EF4444',
    borderRadius: theme.radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  pdfBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },

  cardBody: { padding: 10, height: 110, justifyContent: 'space-between' },
  bookTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500', flex: 1 },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: theme.radius.md,
    paddingVertical: 9,
  },
  viewBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
