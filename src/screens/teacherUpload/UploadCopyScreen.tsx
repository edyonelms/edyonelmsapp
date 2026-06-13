import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import SelectionWizard from './SelectionWizard';
import SelectionCard from './SelectionCard';
import {
  emptySelection,
  isComplete,
  Selection,
  STUDENTS,
  UploadEntry,
  UploadStudent,
} from './uploadData';

interface UploadedCopy {
  fileName: string;
  uri: string;
}

const UploadCopyScreen = ({ navigation }: any) => {
  const [selection, setSelection] = useState<Selection>(emptySelection());
  const [uploads, setUploads] = useState<Record<string, UploadedCopy>>({});

  const ready = isComplete(selection);
  const uploadedCount = Object.keys(uploads).length;

  const onSelect = (next: Selection) => {
    setSelection(next);
    setUploads({}); // fresh context → start over
  };

  const pickCopy = (student: UploadStudent) => {
    launchImageLibrary({ mediaType: 'mixed', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset) return;
      setUploads(prev => ({
        ...prev,
        [student.id]: {
          fileName:
            asset.fileName ??
            `${student.name.split(' ')[0]}_copy.${
              (asset.type ?? 'image/jpeg').split('/')[1]
            }`,
          uri: asset.uri ?? '',
        },
      }));
    });
  };

  const removeCopy = (id: string) =>
    setUploads(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleManageSave = (entries: UploadEntry[]) => {
    const map: Record<string, UploadedCopy> = {};
    entries.forEach(e => {
      if (e.fileName) map[e.studentId] = { fileName: e.fileName, uri: e.uri ?? '' };
    });
    setUploads(map);
  };

  const handleSubmit = () => {
    if (uploadedCount === 0) {
      Alert.alert('Nothing to submit', 'Upload at least one copy first.');
      return;
    }
    const entries: UploadEntry[] = STUDENTS.filter(st => uploads[st.id]).map(
      st => ({
        studentId: st.id,
        rollNo: st.rollNo,
        name: st.name,
        fileName: uploads[st.id].fileName,
        uri: uploads[st.id].uri,
      }),
    );
    navigation.navigate('ManageEntries', {
      mode: 'copy',
      selection,
      maxMarks: selection.exam?.totalMarks ?? 100,
      entries,
      onSave: handleManageSave,
    });
  };

  const renderStudent = ({ item }: { item: UploadStudent }) => {
    const copy = uploads[item.id];
    return (
      <View style={s.row}>
        <View style={s.rowLeft}>
          <Text style={s.rollNo}>{item.rollNo}</Text>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <Text style={s.studentName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        {copy ? (
          <View style={s.uploadedPill}>
            <VectorIcon
              iconSet="Ionicons"
              iconName="document-text"
              size={13}
              color={theme.colors.success}
            />
            <Text style={s.uploadedText} numberOfLines={1}>
              {copy.fileName}
            </Text>
            <TouchableOpacity
              onPress={() => removeCopy(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="close-circle"
                size={16}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={s.uploadBtn}
            activeOpacity={0.8}
            onPress={() => pickCopy(item)}
          >
            <VectorIcon
              iconSet="Ionicons"
              iconName="cloud-upload-outline"
              size={15}
              color={theme.colors.primary}
            />
            <Text style={s.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={s.safeArea}>
      <Header title="Upload Copy" onBackPress={() => navigation.goBack()} />

      <FlatList
        data={ready ? STUDENTS : []}
        keyExtractor={i => i.id}
        renderItem={renderStudent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <>
            <SelectionWizard value={selection} onChange={onSelect} />

            {ready ? (
              <>
                <View style={s.cardWrap}>
                  <SelectionCard selection={selection} />
                </View>

                <View style={s.summaryRow}>
                  <View style={s.summaryChip}>
                    <VectorIcon
                      iconSet="Ionicons"
                      iconName="checkmark-circle"
                      size={14}
                      color={theme.colors.success}
                    />
                    <Text style={s.summaryText}>
                      {uploadedCount} of {STUDENTS.length} uploaded
                    </Text>
                  </View>
                </View>

                <View style={s.listHeader}>
                  <Text style={s.listHeaderText}>Student</Text>
                  <Text style={s.listHeaderText}>Copy</Text>
                </View>
              </>
            ) : (
              <View style={s.promptBox}>
                <View style={s.promptIconRing}>
                  <VectorIcon
                    iconSet="Ionicons"
                    iconName="funnel-outline"
                    size={30}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={s.promptTitle}>Select to begin</Text>
                <Text style={s.promptSub}>
                  Choose Exam, Class and Subject to load the student list
                </Text>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          ready ? (
            <TouchableOpacity
              style={s.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName="arrow-forward-circle"
                size={18}
                color="#fff"
              />
              <Text style={s.submitText}>Submit & Manage</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

export default UploadCopyScreen;

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.lg, paddingTop: 14, paddingBottom: 30 },

  cardWrap: { marginTop: theme.spacing.md },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  summaryText: { fontSize: 12, fontWeight: '700', color: theme.colors.success },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 4,
  },
  listHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rollNo: { fontSize: 12, color: theme.colors.textMuted, width: 22 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: theme.colors.primary },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flex: 1,
  },

  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  uploadBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary },

  uploadedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: 150,
    backgroundColor: '#DCFCE7',
    borderRadius: theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  uploadedText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.success,
    flexShrink: 1,
  },

  promptBox: { alignItems: 'center', paddingTop: 50, paddingHorizontal: 30 },
  promptIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  promptSub: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.lg,
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
