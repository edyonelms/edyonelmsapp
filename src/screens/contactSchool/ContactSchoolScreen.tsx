import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { studentContactAdmin, teacherContactAdmin } from '../../api/contactApi';

const ContactSchoolScreen = ({ navigation }: any) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; uri: string; type?: string } | null>(null);
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>('student');

  // Load role on mount
  React.useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      const userRole = await AsyncStorage.getItem('user_role');
      if (userRole) {
        setRole(userRole);
      }
    } catch (error) {
      console.error('Error loading role:', error);
    }
  };

  const requestAndroidPermission = async (): Promise<boolean> => {
    // Android 13+ (API 33+): image picker uses system photo picker — no permission needed
    // @ts-ignore
    if (Platform.Version >= 33) return true;
    // Android 10–12: no storage permission needed for media picker
    // @ts-ignore
    if (Platform.Version >= 29) return true;
    // Android 9 and below: needs READ_EXTERNAL_STORAGE
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to attach files.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handlePickAttachment = async () => {
    if (Platform.OS === 'android') {
      const granted = await requestAndroidPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to attach files. Please enable it in Settings.',
          [{ text: 'OK' }],
        );
        return;
      }
    }
    // iOS: react-native-image-picker handles NSPhotoLibraryUsageDescription automatically
    launchImageLibrary(
      { mediaType: 'mixed', quality: 0.8 },
      response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset) {
          setAttachment({
            name: asset.fileName ?? 'attachment',
            uri: asset.uri ?? '',
            type: asset.type ?? 'image/jpeg',
          });
        }
      },
    );
  };

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Missing Subject', 'Please enter a subject for your query.');
      return;
    }
    if (!message.trim()) {
      Alert.alert('Missing Message', 'Please enter your query message.');
      return;
    }

    setLoading(true);
    try {
      console.log('[ContactSchoolScreen] Submitting as role:', role);
      
      let response;
      if (role === 'student') {
        response = await studentContactAdmin({
          subject: subject.trim(),
          message: message.trim(),
          attachment: attachment || undefined,
        });
      } else {
        response = await teacherContactAdmin({
          subject: subject.trim(),
          message: message.trim(),
          attachment: attachment || undefined,
        });
      }

      console.log('[ContactSchoolScreen] Submit success:', response);
      
      Alert.alert(
        'Query Submitted',
        'Your query has been submitted successfully. We will get back to you shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      console.error('[ContactSchoolScreen] Submit error:', err?.response?.data || err.message);
      
      let errorMessage = 'Failed to submit query. Please try again.';
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      Alert.alert('Submission Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <Header title="Contact School" onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Page intro ── */}
          <View style={s.introRow}>
            <View style={s.introIconBox}>
              <VectorIcon iconSet="Ionicons" iconName="school" size={22} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={s.introTitle}>Raise a Query</Text>
              <Text style={s.introSub}>We'll get back to you shortly</Text>
            </View>
          </View>

          {/* ── Subject ── */}
          <View style={[s.inputBox, subjectFocused && s.inputBoxFocused]}>
            <TextInput
              style={s.input}
              placeholder="Write your subject here..."
              placeholderTextColor={theme.colors.textMuted}
              value={subject}
              onChangeText={setSubject}
              onFocus={() => setSubjectFocused(true)}
              onBlur={() => setSubjectFocused(false)}
              returnKeyType="next"
            />
          </View>

          {/* ── Message ── */}
          <View style={[s.inputBox, s.messageBox, messageFocused && s.inputBoxFocused]}>
            <TextInput
              style={[s.input, s.messageInput]}
              placeholder="Enter your query here..."
              placeholderTextColor={theme.colors.textMuted}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setMessageFocused(true)}
              onBlur={() => setMessageFocused(false)}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={handlePickAttachment}
              style={s.attachBtn}
              activeOpacity={0.7}
            >
              <VectorIcon iconSet="Ionicons" iconName="attach" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* ── Attachment preview ── */}
          {attachment && (
            <View style={s.attachPreview}>
              <View style={s.attachPreviewLeft}>
                <View style={s.attachFileIcon}>
                  <VectorIcon iconSet="Feather" iconName="paperclip" size={14} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={s.attachLabel}>Attachment:</Text>
                  <Text style={s.attachName} numberOfLines={1}>{attachment.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setAttachment(null)}
                style={s.removeBtn}
                activeOpacity={0.8}
              >
                <VectorIcon iconSet="Ionicons" iconName="close-circle" size={22} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          )}

          {/* ── Submit ── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            style={s.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <VectorIcon iconSet="Ionicons" iconName="send" size={16} color="#fff" />
                <Text style={s.submitText}>Submit Query</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ContactSchoolScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16, paddingBottom: 40, gap: 14 },

  // Intro
  introRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg, padding: 14,
    shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
    marginBottom: 4,
  },
  introIconBox: {
    width: 44, height: 44, borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  introTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary },
  introSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },

  // Inputs
  inputBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5, borderColor: theme.colors.border,
    paddingHorizontal: 16, paddingVertical: 4,
    shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  inputBoxFocused: {
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.12,
  },
  messageBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 8,
  },
  input: {
    flex: 1, fontSize: 14, color: theme.colors.textPrimary,
    paddingVertical: 12, fontWeight: '500',
  },
  messageInput: { minHeight: 120 },
  attachBtn: { paddingTop: 10, paddingLeft: 8 },

  // Attachment preview
  attachPreview: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.lg, padding: 14,
    borderWidth: 1, borderColor: `${theme.colors.primary}30`,
  },
  attachPreviewLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  attachFileIcon: {
    width: 34, height: 34, borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  attachLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.primary },
  attachName: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary, maxWidth: 220 },
  removeBtn: { paddingLeft: 8 },

  // Submit
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: 16, marginTop: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  submitText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});