import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { TAG_META } from './announcementData';
import type { Announcement } from './announcementData';
import AttachmentPreviewModal from './AttachmentPreviewModal';
import type { PreviewType } from './AttachmentPreviewModal';

const ViewAnnouncementScreen = ({ navigation, route }: any) => {
  const item: Announcement = route.params?.item;
  const tag = TAG_META[item.tag];
  const timeLabel = item.daysAgo === 0 ? 'Today' : `${item.daysAgo}d ago`;
  const [previewType, setPreviewType] = useState<PreviewType>(null);

  return (
    <View style={s.root}>
      <Header
        title="View Announcement"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Top banner card ── */}
        <View style={[s.bannerCard, { backgroundColor: tag.color }]}>
          {/* Decorative circles */}
          <View style={s.circle1} />
          <View style={s.circle2} />

          {/* Icon */}
          <View style={s.iconWrap}>
            <View style={s.iconBox}>
              <VectorIcon
                iconSet="Ionicons"
                iconName="megaphone"
                size={30}
                color={tag.color}
              />
            </View>
          </View>

          {/* Title */}
          <Text style={s.bannerTitle}>{item.title}</Text>

          {/* Chips row */}
          <View style={s.chipsRow}>
            <View style={s.infoPill}>
              <VectorIcon
                iconSet="Feather"
                iconName="clock"
                size={11}
                color={tag.color}
              />
              <Text style={[s.infoPillText, { color: tag.color }]}>
                {timeLabel}
              </Text>
            </View>
            <View style={s.infoPill}>
              <VectorIcon
                iconSet="Feather"
                iconName="tag"
                size={11}
                color={tag.color}
              />
              <Text style={[s.infoPillText, { color: tag.color }]}>
                {item.tag}
              </Text>
            </View>
            {item.isNew && (
              <View style={[s.infoPill, { backgroundColor: '#DCFCE7' }]}>
                <View style={s.newDot} />
                <Text style={[s.infoPillText, { color: theme.colors.success }]}>
                  New
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Description card ── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={[s.cardBar, { backgroundColor: tag.color }]} />
            <Text style={s.cardTitle}>Description</Text>
          </View>
          <Text style={s.bodyText}>{item.body}</Text>
        </View>

        {/* ── Attachments ── */}
        {(item.hasImage || item.hasPdf) && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.cardBar, { backgroundColor: tag.color }]} />
              <Text style={s.cardTitle}>Attachments</Text>
            </View>

            <View style={s.attachList}>
              {item.hasImage && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPreviewType('image')}
                  style={[s.attachBtn, { backgroundColor: tag.color }]}
                >
                  <View style={s.attachLeft}>
                    <View style={s.attachIconBox}>
                      <VectorIcon iconSet="Feather" iconName="image" size={20} color="#fff" />
                    </View>
                    <View>
                      <Text style={s.attachTitle}>View Image</Text>
                      <Text style={s.attachSub}>Tap to view full image</Text>
                    </View>
                  </View>
                  <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              )}

              {item.hasPdf && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setPreviewType('pdf')}
                  style={[s.attachBtn, { backgroundColor: tag.color }]}
                >
                  <View style={s.attachLeft}>
                    <View style={s.attachIconBox}>
                      <VectorIcon iconSet="Feather" iconName="file-text" size={20} color="#fff" />
                    </View>
                    <View>
                      <Text style={s.attachTitle}>View PDF</Text>
                      <Text style={s.attachSub}>Tap to read PDF document</Text>
                    </View>
                  </View>
                  <VectorIcon iconSet="Ionicons" iconName="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <AttachmentPreviewModal
        visible={previewType !== null}
        type={previewType}
        accentColor={tag.color}
        onClose={() => setPreviewType(null)}
      />
    </View>
  );
};

export default ViewAnnouncementScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },

  // Banner card
  bannerCard: {
    borderRadius: theme.radius.lg,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },
  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffffff15',
    top: -60,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff10',
    bottom: -30,
    left: -20,
  },
  iconWrap: { marginBottom: 14 },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  infoPillText: { fontSize: 12, fontWeight: '700' },
  newDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },

  // Content card
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 18,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardBar: { width: 4, height: 20, borderRadius: 2 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  bodyText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 26,
    textAlign: 'justify',
  },

  // Attachments
  attachList: { gap: 12 },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  attachLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  attachIconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: '#ffffff25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  attachSub: { fontSize: 12, color: '#ffffffcc', fontWeight: '500' },
});
