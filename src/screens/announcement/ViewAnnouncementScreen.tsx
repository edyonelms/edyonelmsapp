import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import { TAG_META } from './announcementData';
import type { Announcement } from './announcementData';
import AttachmentPreviewModal from './AttachmentPreviewModal';
import type { PreviewType } from './AttachmentPreviewModal';
import apiClient from '../../api/apiClient';

const ViewAnnouncementScreen = ({ navigation, route }: any) => {
  const initialItem: Announcement = route.params?.item;
  const [item, setItem] = useState<Announcement>(initialItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<PreviewType>(null);
  
  const tag = TAG_META[item?.tag || 'All'];
  const timeLabel = item?.daysAgo === 0 ? 'Today' : `${item?.daysAgo || 0}d ago`;

  // Fetch full announcement details by ID
  const fetchAnnouncementDetails = async () => {
    if (!item?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `/announcement/${item.id}`;
      console.log('[ViewAnnouncement] Fetching from URL:', apiClient.defaults.baseURL + url);
      
      const response = await apiClient.get(url);
      console.log('[ViewAnnouncement] Full response:', JSON.stringify(response.data, null, 2));
      
      // Extract the announcement data from response
      const announcementData = response.data?.data || response.data;
      console.log('[ViewAnnouncement] Announcement data:', announcementData);
      
      if (announcementData && announcementData.id) {
        // Update the item with full details from API
        const updatedItem = {
          ...item,
          title: announcementData.announcement_name || item.title,
          content: announcementData.announcement_content || item.content,
          date: announcementData.created_at || item.date,
          imageUrl: announcementData.announcement_image || item.imageUrl,
          pdfUrl: announcementData.announcement_pdf || item.pdfUrl,
          creatorName: announcementData.creator_name || item.creatorName,
          creatorEmail: announcementData.creator_email || item.creatorEmail,
        };
        console.log('[ViewAnnouncement] Updated item:', updatedItem);
        setItem(updatedItem);
      }
    } catch (err: any) {
      console.error('[ViewAnnouncement] Error fetching details:', err?.response?.data || err.message);
      // Don't show error to user, just use the passed item
      if (err?.response?.status === 403) {
        console.log('[ViewAnnouncement] Access forbidden, using passed item data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item?.id) {
      fetchAnnouncementDetails();
    }
  }, [item?.id]);

  if (!item) {
    return (
      <View style={s.root}>
        <Header title="View Announcement" onBackPress={() => navigation.goBack()} />
        <View style={s.centeredBox}>
          <Text style={s.errorText}>Announcement not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <Header
        title="View Announcement"
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={s.centeredBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
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
            {/* FIXED: Changed from item.body to item.content */}
            <Text style={s.bodyText}>{item.content || 'No description available'}</Text>
          </View>

          {/* ── Attachments ── */}
          {(item.hasImage || item.hasPdf) && (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.cardBar, { backgroundColor: tag.color }]} />
                <Text style={s.cardTitle}>Attachments</Text>
              </View>

              <View style={s.attachList}>
                {item.hasImage && item.imageUrl && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setPreviewType('image')}
                    style={[s.attachBtn, { backgroundColor: tag.color }]}
                  >
                    <View style={s.attachLeft}>
                      <View style={s.attachIconBox}>
                        <VectorIcon
                          iconSet="Feather"
                          iconName="image"
                          size={20}
                          color="#fff"
                        />
                      </View>
                      <View>
                        <Text style={s.attachTitle}>View Image</Text>
                        <Text style={s.attachSub}>Tap to view full image</Text>
                      </View>
                    </View>
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="chevron-forward"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}

                {item.hasPdf && item.pdfUrl && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setPreviewType('pdf')}
                    style={[s.attachBtn, { backgroundColor: tag.color }]}
                  >
                    <View style={s.attachLeft}>
                      <View style={s.attachIconBox}>
                        <VectorIcon
                          iconSet="Feather"
                          iconName="file-text"
                          size={20}
                          color="#fff"
                        />
                      </View>
                      <View>
                        <Text style={s.attachTitle}>View PDF</Text>
                        <Text style={s.attachSub}>Tap to read PDF document</Text>
                      </View>
                    </View>
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="chevron-forward"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* ── Creator Info (if available) ── */}
          {item.creatorName && (
            <View style={s.card}>
              <View style={s.cardHeader}>
                <View style={[s.cardBar, { backgroundColor: tag.color }]} />
                <Text style={s.cardTitle}>Posted By</Text>
              </View>
              <Text style={s.creatorName}>{item.creatorName}</Text>
              {item.creatorEmail && (
                <Text style={s.creatorEmail}>{item.creatorEmail}</Text>
              )}
            </View>
          )}
        </ScrollView>
      )}

      <AttachmentPreviewModal
        visible={previewType !== null}
        type={previewType}
        accentColor={tag.color}
        imageUrl={item.imageUrl}
        pdfUrl={item.pdfUrl}
        onClose={() => setPreviewType(null)}
      />
    </View>
  );
};

export default ViewAnnouncementScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },
  centeredBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

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
  creatorName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  creatorEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
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