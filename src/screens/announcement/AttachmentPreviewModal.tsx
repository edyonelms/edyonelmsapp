import React from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

export type PreviewType = 'image' | 'pdf' | null;

interface Props {
  visible: boolean;
  type: PreviewType;
  accentColor: string;
  imageUri?: string;
  pdfUri?: string;
  onClose: () => void;
}

const AttachmentPreviewModal = ({
  visible,
  type,
  accentColor,
  imageUri,
  onClose,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        {/* Header bar */}
        <View style={s.topBar}>
          <TouchableOpacity
            onPress={onClose}
            style={s.closeBtn}
            activeOpacity={0.8}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="close"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={s.topTitle}>
            {type === 'image' ? 'Image Preview' : 'PDF Preview'}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Content */}
        <View style={s.content}>
          {type === 'image' ? (
            <View style={s.imageContainer}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={s.image}
                  resizeMode="contain"
                />
              ) : (
                <View style={s.PreviewContainer}>
                  <PlaceholderBox
                    icon="image-outline"
                    label="No image available"
                    color={accentColor}
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={s.PreviewContainer}>
              {/* PDF placeholder — replace with react-native-pdf if available */}
              <PlaceholderBox
                icon="document-text-outline"
                label="PDF Viewer"
                color={accentColor}
              />
            </View>
          )}
        </View>

        {/* Bottom action */}
        <View style={s.bottomBar}>
          <TouchableOpacity
            onPress={onClose}
            style={[s.doneBtn, { backgroundColor: accentColor }]}
            activeOpacity={0.85}
          >
            <Text style={s.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Placeholder ──────────────────────────────────────────────────────────────
const PlaceholderBox = ({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  color: string;
}) => (
  <View style={p.box}>
    <View
      style={[
        p.iconRing,
        { backgroundColor: color + '20', borderColor: color + '40' },
      ]}
    >
      <VectorIcon
        iconSet="Ionicons"
        iconName={icon as any}
        size={48}
        color={color}
      />
    </View>
    <Text style={p.label}>{label}</Text>
  </View>
);

export default AttachmentPreviewModal;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000EE',
    justifyContent: 'space-between',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: width - 32,
    height: height * 0.6,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  PreviewContainer: {
    width: width - 32,
    height: height * 0.6,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Bottom
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
  doneBtn: {
    borderRadius: theme.radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

const p = StyleSheet.create({
  box: { alignItems: 'center', gap: 16, paddingHorizontal: 24 },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  sublabel: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
