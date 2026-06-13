import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import SelectionCard from './SelectionCard';
import { Selection, UploadEntry } from './uploadData';
import { upsertMark, upsertExamCopy, marksErrorMessage } from '../../api/marksApi';

type Mode = 'copy' | 'marks';

interface Params {
  mode: Mode;
  selection: Selection;
  maxMarks: number;
  entries: UploadEntry[];
  onSave: (entries: UploadEntry[]) => void;
}

const ManageEntriesScreen = ({ navigation, route }: any) => {
  const { mode, selection, maxMarks, entries: initial, onSave }: Params =
    route.params;

  const [entries, setEntries] = useState<UploadEntry[]>(initial);
  const [editing, setEditing] = useState<UploadEntry | null>(null);
  const [draftMarks, setDraftMarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!entries.length) return;
    if (!selection.exam || !selection.cls || !selection.subject) {
      Alert.alert('Incomplete selection', 'Please pick exam, class and subject again.');
      return;
    }
    const base = {
      exam_id: selection.exam.examId,
      standard_id: selection.cls.standardId,
      section_id: selection.cls.sectionId,
      subject_id: selection.subject.subjectId,
    };

    setSubmitting(true);
    let ok = 0;
    const failed: string[] = [];

    for (const e of entries) {
      try {
        if (mode === 'marks') {
          await upsertMark({
            ...base,
            student_detail_id: e.studentDetailId,
            marks_obtained: e.marks ?? 0,
            max_marks: maxMarks,
          });
        } else {
          if (!e.uri) {
            failed.push(`${e.name} (no file)`);
            continue;
          }
          await upsertExamCopy(
            { ...base, student_detail_id: e.studentDetailId },
            { uri: e.uri, name: e.fileName ?? 'copy.pdf', type: e.fileType },
          );
        }
        ok++;
      } catch (err: any) {
        failed.push(`${e.name} — ${marksErrorMessage(err)}`);
      }
    }

    setSubmitting(false);
    const noun = mode === 'marks' ? 'marks' : 'copies';
    if (failed.length === 0) {
      Alert.alert('Saved', `${ok} ${noun} saved successfully.`, [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert(
        ok > 0 ? 'Partly saved' : 'Save failed',
        `${ok} saved, ${failed.length} failed:\n\n${failed.slice(0, 6).join('\n')}`,
      );
    }
  };

  const sync = (next: UploadEntry[]) => {
    setEntries(next);
    onSave?.(next);
  };

  const handleDelete = (entry: UploadEntry) => {
    Alert.alert(
      'Delete Entry',
      `Remove ${mode === 'copy' ? 'copy' : 'marks'} for ${entry.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            sync(entries.filter(e => e.studentId !== entry.studentId)),
        },
      ],
    );
  };

  const reUploadCopy = (entry: UploadEntry) => {
    launchImageLibrary({ mediaType: 'mixed', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset) return;
      sync(
        entries.map(e =>
          e.studentId === entry.studentId
            ? {
                ...e,
                fileName:
                  asset.fileName ??
                  `${e.name.split(' ')[0]}_copy.${
                    (asset.type ?? 'image/jpeg').split('/')[1]
                  }`,
                uri: asset.uri ?? '',
              }
            : e,
        ),
      );
    });
  };

  const openMarksEditor = (entry: UploadEntry) => {
    setEditing(entry);
    setDraftMarks(entry.marks != null ? String(entry.marks) : '');
  };

  const saveMarks = () => {
    if (!editing) return;
    const digits = draftMarks.replace(/[^0-9]/g, '');
    const val = digits === '' ? 0 : Math.min(parseInt(digits, 10), maxMarks);
    sync(
      entries.map(e =>
        e.studentId === editing.studentId ? { ...e, marks: val } : e,
      ),
    );
    setEditing(null);
  };

  const renderRow = ({ item }: { item: UploadEntry }) => (
    <View style={s.row}>
      <View style={s.avatar}>
        <Text style={s.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={s.sub} numberOfLines={1}>
          {mode === 'copy' ? (
            <>
              <VectorIcon
                iconSet="Ionicons"
                iconName="document-text-outline"
                size={11}
                color={theme.colors.textMuted}
              />{' '}
              {item.fileName}
            </>
          ) : (
            `Roll ${item.rollNo}`
          )}
        </Text>
      </View>

      {mode === 'marks' && (
        <View style={s.marksBox}>
          <Text style={s.marksValue}>{item.marks ?? 0}</Text>
          <Text style={s.marksMax}>/{maxMarks}</Text>
        </View>
      )}

      <TouchableOpacity
        style={s.iconBtn}
        activeOpacity={0.7}
        onPress={() =>
          mode === 'copy' ? reUploadCopy(item) : openMarksEditor(item)
        }
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName="create-outline"
          size={18}
          color={theme.colors.secondary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={s.iconBtn}
        activeOpacity={0.7}
        onPress={() => handleDelete(item)}
      >
        <VectorIcon
          iconSet="Ionicons"
          iconName="trash-outline"
          size={18}
          color={theme.colors.danger}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={s.root}>
      <Header
        title={mode === 'copy' ? 'Manage Copies' : 'Manage Marks'}
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={entries}
        keyExtractor={e => e.studentId}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <>
            <SelectionCard selection={selection} />
            <View style={s.countRow}>
              <Text style={s.countText}>
                {entries.length}{' '}
                {mode === 'copy' ? 'uploaded copies' : 'marks entered'}
              </Text>
              <Text style={s.countHint}>Tap edit or delete per student</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <View style={s.emptyIconRing}>
              <VectorIcon
                iconSet="Ionicons"
                iconName={mode === 'copy' ? 'documents-outline' : 'create-outline'}
                size={34}
                color={theme.colors.primary}
              />
            </View>
            <Text style={s.emptyTitle}>No entries</Text>
            <Text style={s.emptySub}>
              Go back and {mode === 'copy' ? 'upload copies' : 'enter marks'}{' '}
              first
            </Text>
          </View>
        }
        ListFooterComponent={
          entries.length > 0 ? (
            <TouchableOpacity
              style={[s.confirmBtn, submitting && s.confirmBtnDisabled]}
              activeOpacity={0.85}
              disabled={submitting}
              onPress={handleConfirm}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <VectorIcon iconSet="Ionicons" iconName="cloud-upload-outline" size={18} color="#fff" />
              )}
              <Text style={s.confirmText}>
                {submitting
                  ? 'Saving…'
                  : `Confirm & Save ${entries.length} ${mode === 'copy' ? 'Copies' : 'Marks'}`}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Marks editor modal */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={s.overlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Edit Marks</Text>
            <Text style={s.modalSub}>{editing?.name}</Text>
            <View style={s.inputRow}>
              <TextInput
                style={s.input}
                keyboardType="number-pad"
                maxLength={4}
                autoFocus
                value={draftMarks}
                placeholder="0"
                placeholderTextColor={theme.colors.textMuted}
                onChangeText={t => setDraftMarks(t.replace(/[^0-9]/g, ''))}
              />
              <Text style={s.inputMax}>/ {maxMarks}</Text>
            </View>
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtn, s.modalBtnGhost]}
                activeOpacity={0.85}
                onPress={() => setEditing(null)}
              >
                <Text style={s.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBtn, s.modalBtnPrimary]}
                activeOpacity={0.9}
                onPress={saveMarks}
              >
                <Text style={s.modalBtnPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageEntriesScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.lg, paddingTop: 14, paddingBottom: 30 },

  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  countText: { fontSize: 13, fontWeight: '800', color: theme.colors.textPrimary },
  countHint: { fontSize: 11, color: theme.colors.textMuted },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: theme.colors.primary },
  name: { fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary },
  sub: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },

  marksBox: { flexDirection: 'row', alignItems: 'baseline', marginRight: 4 },
  marksValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  marksMax: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.lg,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyIconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  emptySub: { fontSize: 13, color: theme.colors.textMuted },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  modalSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  inputMax: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnGhost: { backgroundColor: '#F1F5F9' },
  modalBtnGhostText: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
  modalBtnPrimary: { backgroundColor: theme.colors.primary },
  modalBtnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
