import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme, onThemeChange } from '../../utils/theme';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import { ContentItem, TYPE_META } from './contentData';
import AttachmentPreviewModal from '../announcement/AttachmentPreviewModal';

const isHttpUrl = (v?: string) => !!v && /^https?:\/\//i.test(v);

const ViewContentScreen = ({ navigation, route }: any) => {
  const topicName: string = route.params?.topicName ?? '';
  const chapterName: string = route.params?.chapterName ?? '';
  const subjectName: string = route.params?.subjectName ?? '';
  const subjectIcon: string = route.params?.subjectIcon ?? '';
  const subjectColor: string =
    route.params?.subjectColor ?? theme.colors.primary;
  const items: ContentItem[] = route.params?.items ?? [];

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const textItems = items.filter(i => i.type === 'text');
  const urlItems = items.filter(i => i.type === 'url');
  const fileItems = items.filter(i => i.type === 'pdf' || i.type === 'image');

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'Unable to open the link on this device.');
    }
  };

  const openFile = (item: ContentItem) => {
    if (item.type === 'image') {
      setPreviewUrl(isHttpUrl(item.value) ? item.value : '');
    } else if (isHttpUrl(item.value)) {
      openLink(item.value);
    } else {
      Alert.alert('PDF', 'This PDF is not available for preview yet.');
    }
  };

  // TODO: wire to the content-detail API loader once integrated.
  const { refreshing, onRefresh } = useRefresh(() => {});

  return (
    <View style={s.root}>
      <Header title="Study Content" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ── Single detail card ── */}
        <View style={s.card}>
          {/* Top accent strip */}
          <View style={[s.accentStrip, { backgroundColor: subjectColor }]} />

          <View style={s.cardInner}>
            {/* Meta row: subject + resources count */}
            <View style={s.metaRow}>
              <View
                style={[s.tagPill, { backgroundColor: subjectColor + '15' }]}
              >
                {!!subjectIcon && (
                  <Text style={s.tagPillEmoji}>{subjectIcon}</Text>
                )}
                <Text style={[s.tagPillText, { color: subjectColor }]}>
                  {subjectName}
                </Text>
              </View>
              <View style={s.metaSpacer} />
              <View style={s.timeRow}>
                <VectorIcon
                  iconSet="Feather"
                  iconName="layers"
                  size={12}
                  color={theme.colors.textMuted}
                />
                <Text style={s.timeText}>
                  {items.length} resource{items.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text style={s.title}>{topicName}</Text>
            {!!chapterName && (
              <Text style={s.chapterText}>Chapter · {chapterName}</Text>
            )}

            <View style={s.divider} />

            {items.length === 0 ? (
              <View style={s.empty}>
                <VectorIcon
                  iconSet="Ionicons"
                  iconName="folder-open-outline"
                  size={44}
                  color={theme.colors.textMuted}
                />
                <Text style={s.emptyTitle}>No content yet</Text>
                <Text style={s.emptySubText}>
                  Your teacher hasn't added any study content for this topic
                  yet.
                </Text>
              </View>
            ) : (
              <>
                {/* ── Text content ── */}
                {textItems.length > 0 && (
                  <>
                    <Text style={s.sectionLabel}>Description</Text>
                    {textItems.map((item, i) => (
                      <View
                        key={item.id}
                        style={[
                          s.textBlock,
                          i < textItems.length - 1 && { marginBottom: 14 },
                        ]}
                      >
                        <Text style={s.textBlockTitle}>{item.title}</Text>
                        <Text style={s.bodyText}>{item.value}</Text>
                      </View>
                    ))}
                  </>
                )}

                {/* ── Links ── */}
                {urlItems.length > 0 && (
                  <>
                    {textItems.length > 0 && <View style={s.divider} />}
                    <Text style={s.sectionLabel}>Links</Text>
                    <View style={s.attachList}>
                      {urlItems.map(item => {
                        const meta = TYPE_META[item.type];
                        return (
                          <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.85}
                            onPress={() => openLink(item.value)}
                            style={[
                              s.attachBtn,
                              { borderColor: meta.color + '40' },
                            ]}
                          >
                            <View
                              style={[
                                s.attachIconBox,
                                { backgroundColor: meta.bg },
                              ]}
                            >
                              <VectorIcon
                                iconSet="Ionicons"
                                iconName="link-outline"
                                size={18}
                                color={meta.color}
                              />
                            </View>
                            <View style={s.attachTextBox}>
                              <Text style={s.attachTitle}>{item.title}</Text>
                              <Text style={s.attachSub} numberOfLines={1}>
                                {item.value}
                              </Text>
                            </View>
                            <VectorIcon
                              iconSet="Feather"
                              iconName="external-link"
                              size={16}
                              color={theme.colors.textMuted}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}

                {/* ── Attachments (pdf / image) ── */}
                {fileItems.length > 0 && (
                  <>
                    {(textItems.length > 0 || urlItems.length > 0) && (
                      <View style={s.divider} />
                    )}
                    <Text style={s.sectionLabel}>Attachments</Text>
                    <View style={s.attachList}>
                      {fileItems.map(item => {
                        const meta = TYPE_META[item.type];
                        return (
                          <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.85}
                            onPress={() => openFile(item)}
                            style={[
                              s.attachBtn,
                              { borderColor: meta.color + '40' },
                            ]}
                          >
                            <View
                              style={[
                                s.attachIconBox,
                                { backgroundColor: meta.bg },
                              ]}
                            >
                              <VectorIcon
                                iconSet="Feather"
                                iconName={
                                  item.type === 'image' ? 'image' : 'file-text'
                                }
                                size={18}
                                color={meta.color}
                              />
                            </View>
                            <View style={s.attachTextBox}>
                              <Text style={s.attachTitle}>{item.title}</Text>
                              <Text style={s.attachSub} numberOfLines={1}>
                                {item.type === 'image'
                                  ? 'Tap to view full image'
                                  : `${item.value} · Tap to open`}
                              </Text>
                            </View>
                            <VectorIcon
                              iconSet="Ionicons"
                              iconName={
                                item.type === 'image'
                                  ? 'chevron-forward'
                                  : 'open-outline'
                              }
                              size={16}
                              color={theme.colors.textMuted}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <AttachmentPreviewModal
        visible={previewUrl !== null}
        accentColor={subjectColor}
        imageUrl={previewUrl || undefined}
        onClose={() => setPreviewUrl(null)}
      />
    </View>
  );
};

export default ViewContentScreen;

const __mk_s = () => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16, paddingBottom: 40 },

  // Single card (announcement style)
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  accentStrip: { height: 5 },
  cardInner: { padding: 18 },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  metaSpacer: { flex: 1 },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: theme.radius.full,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  tagPillText: { fontSize: 12, fontWeight: '700' },
  tagPillEmoji: { fontSize: 11 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    lineHeight: 28,
    marginBottom: 4,
  },
  chapterText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },

  // Text blocks
  textBlock: { gap: 4 },
  textBlockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  bodyText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 25,
  },

  // Attachment buttons (announcement style)
  attachList: { gap: 10 },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.card,
  },
  attachIconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachTextBox: { flex: 1 },
  attachTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 1,
  },
  attachSub: { fontSize: 12, color: theme.colors.textMuted },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textSecondary,
  },
  emptySubText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
