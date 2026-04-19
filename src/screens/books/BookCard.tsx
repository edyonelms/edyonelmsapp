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
import { SUBJECT_COLORS } from './bookData';
import type { Book } from './bookData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16 padding each side + 16 gap
const IMAGE_HEIGHT = 150;

interface Props {
  item: Book;
  onViewPress: (book: Book) => void;
}

const BookCard = ({ item, onViewPress }: Props) => {
  const meta = SUBJECT_COLORS[item.subject] ?? SUBJECT_COLORS.All;

  return (
    <View style={[s.card, { width: CARD_WIDTH }]}>
      {/* Fixed height image */}
      <View style={s.imageWrap}>
        <Image
          source={{ uri: item.imageUri }}
          style={s.image}
          resizeMode="cover"
        />
        <View style={s.imageOverlay} />
        {/* Subject badge */}
        <View style={[s.subjectBadge, { backgroundColor: meta.color }]}>
          <Text style={s.subjectBadgeText}>{item.subject}</Text>
        </View>
        {/* Pages badge */}
        <View style={s.pagesBadge}>
          <VectorIcon
            iconSet="Feather"
            iconName="file-text"
            size={9}
            color="#fff"
          />
          <Text style={s.pagesBadgeText}>{item.pages}p</Text>
        </View>
      </View>

      {/* Fixed height body */}
      <View style={s.cardBody}>
        <Text style={s.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={s.sizeRow}>
          <VectorIcon
            iconSet="Feather"
            iconName="hard-drive"
            size={11}
            color={theme.colors.textMuted}
          />
          <Text style={s.sizeText}>{item.size}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onViewPress(item)}
          style={[s.viewBtn, { backgroundColor: meta.color }]}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName="book-outline"
            size={13}
            color="#fff"
          />
          <Text style={s.viewBtnText}>View Book</Text>
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
  },
  subjectBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  pagesBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#00000055',
    borderRadius: theme.radius.full,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  pagesBadgeText: { fontSize: 9, color: '#fff', fontWeight: '600' },

  cardBody: { padding: 10, height: 110, justifyContent: 'space-between' },
  bookTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  sizeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sizeText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '500' },
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
