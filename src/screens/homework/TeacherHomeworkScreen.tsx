import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import { theme } from '../../utils/theme';
import {
  addHomework, Homework, HOMEWORK_STORE, HW_SUBJECTS, HWSubject,
} from './homeworkData';

const PRIMARY = theme.colors.primary;

const TeacherHomeworkScreen = ({ navigation }: any) => {
  const [selectedSub, setSelectedSub] = useState<HWSubject>(HW_SUBJECTS[0]);
  const [dropOpen, setDropOpen]       = useState(false);
  const [formOpen, setFormOpen]       = useState(false);
  const [title, setTitle]             = useState('');
  const [desc, setDesc]               = useState('');
  const [dueDate, setDueDate]         = useState('');
  const [error, setError]             = useState('');
  const [, forceUpdate]               = useState(0);

  const homeworks: Homework[] = HOMEWORK_STORE.filter(h => h.subjectId === selectedSub.id);

  const handleSave = () => {
    if (!title.trim())   { setError('Enter a title.'); return; }
    if (!desc.trim())    { setError('Enter a description.'); return; }
    if (!dueDate.trim()) { setError('Enter a due date (YYYY-MM-DD).'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) { setError('Use format YYYY-MM-DD.'); return; }

    addHomework({
      subjectId:    selectedSub.id,
      subjectName:  selectedSub.name,
      subjectIcon:  selectedSub.icon,
      subjectColor: selectedSub.color,
      teacherName:  'Mr. Teacher',
      title:        title.trim(),
      description:  desc.trim(),
      dueDate,
    });
    setTitle(''); setDesc(''); setDueDate(''); setError('');
    setFormOpen(false);
    forceUpdate(n => n + 1);
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Homework" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* ── Subject Dropdown ── */}
        <View style={[s.dropWrap, dropOpen && { zIndex: 99 }]}>
          <TouchableOpacity style={s.dropBtn} onPress={() => setDropOpen(o => !o)} activeOpacity={0.8}>
            <View style={s.dropLeft}>
              <Text style={s.dropIcon}>{selectedSub.icon}</Text>
              <Text style={s.dropSelected}>{selectedSub.name}</Text>
            </View>
            <VectorIcon iconSet="Ionicons" iconName={dropOpen ? 'chevron-up' : 'chevron-down'} size={18} color={PRIMARY} />
          </TouchableOpacity>
          {dropOpen && (
            <View style={s.dropList}>
              {HW_SUBJECTS.map(sub => (
                <TouchableOpacity
                  key={sub.id}
                  style={[s.dropItem, sub.id === selectedSub.id && s.dropItemActive]}
                  onPress={() => { setSelectedSub(sub); setDropOpen(false); setFormOpen(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={s.dropIcon}>{sub.icon}</Text>
                  <Text style={[s.dropItemText, sub.id === selectedSub.id && s.dropItemTextActive]}>{sub.name}</Text>
                  {sub.id === selectedSub.id && (
                    <VectorIcon iconSet="Ionicons" iconName="checkmark" size={16} color={PRIMARY} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Section header + Add button ── */}
        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Homework</Text>
          <TouchableOpacity
            style={[s.addBtn, formOpen && s.addBtnActive]}
            onPress={() => { setFormOpen(o => !o); setError(''); }}
            activeOpacity={0.85}
          >
            <VectorIcon iconSet="Ionicons" iconName={formOpen ? 'close' : 'add'} size={16} color={formOpen ? theme.colors.danger : '#fff'} />
            <Text style={[s.addBtnText, formOpen && { color: theme.colors.danger }]}>
              {formOpen ? 'Cancel' : 'Add Homework'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Add Homework Form ── */}
        {formOpen && (
          <View style={s.formCard}>
            <View style={s.formTitleRow}>
              <View style={[s.formIconBox, { backgroundColor: selectedSub.bg }]}>
                <Text style={{ fontSize: 18 }}>{selectedSub.icon}</Text>
              </View>
              <View>
                <Text style={s.formTitle}>New Homework</Text>
                <Text style={s.formSub}>{selectedSub.name}</Text>
              </View>
            </View>

            {!!error && (
              <View style={s.errorBox}>
                <VectorIcon iconSet="Ionicons" iconName="alert-circle-outline" size={14} color={theme.colors.danger} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <Text style={s.label}>Title</Text>
            <TextInput
              style={s.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Chapter 3 Exercise"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={s.label}>Description</Text>
            <TextInput
              style={[s.input, s.inputMulti]}
              value={desc}
              onChangeText={setDesc}
              placeholder="Describe the homework task..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              textAlignVertical="top"
            />

            <Text style={s.label}>Due Date (YYYY-MM-DD)</Text>
            <TextInput
              style={s.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder={new Date().toISOString().slice(0, 10)}
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="numbers-and-punctuation"
            />

            <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <VectorIcon iconSet="Ionicons" iconName="save-outline" size={16} color="#fff" />
              <Text style={s.saveBtnText}>Save Homework</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Homework List ── */}
        {homeworks.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon iconSet="Ionicons" iconName="document-text-outline" size={48} color={theme.colors.textMuted} />
            <Text style={s.emptyText}>No homework for {selectedSub.name}</Text>
          </View>
        ) : (
          homeworks.map(hw => (
            <View key={hw.id} style={s.hwCard}>
              <View style={[s.hwAccent, { backgroundColor: hw.subjectColor }]} />
              <View style={s.hwBody}>
                <View style={s.hwTop}>
                  <Text style={s.hwTitle}>{hw.title}</Text>
                  <View style={[s.dueBadge, { backgroundColor: selectedSub.bg }]}>
                    <VectorIcon iconSet="Ionicons" iconName="calendar-outline" size={11} color={hw.subjectColor} />
                    <Text style={[s.dueText, { color: hw.subjectColor }]}>{hw.dueDate}</Text>
                  </View>
                </View>
                <Text style={s.hwDesc} numberOfLines={2}>{hw.description}</Text>
                <View style={s.hwMeta}>
                  <VectorIcon iconSet="Ionicons" iconName="time-outline" size={12} color={theme.colors.textMuted} />
                  <Text style={s.hwMetaText}>Added {hw.createdAt}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TeacherHomeworkScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 16 },

  // Dropdown
  dropWrap: { marginBottom: 20, zIndex: 99 },
  dropBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
    borderWidth: 1.5, borderColor: theme.colors.primaryLight,
    shadowColor: PRIMARY, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropIcon: { fontSize: 18 },
  dropSelected: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
  dropList: {
    backgroundColor: '#fff', borderRadius: 14, marginTop: 4,
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5, overflow: 'hidden',
  },
  dropItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  dropItemActive: { backgroundColor: theme.colors.primaryLight },
  dropItemText: { flex: 1, fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
  dropItemTextActive: { color: PRIMARY, fontWeight: '700' },

  // Header row
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: PRIMARY, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  addBtnActive: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: theme.colors.danger },
  addBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Form card
  formCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 16,
    borderWidth: 1.5, borderColor: theme.colors.primaryLight,
    shadowColor: PRIMARY, shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  formTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  formIconBox: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  formTitle: { fontSize: 16, fontWeight: '900', color: theme.colors.textPrimary },
  formSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: theme.colors.background, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14,
    color: theme.colors.textPrimary, borderWidth: 1.5, borderColor: theme.colors.border, marginBottom: 8,
  },
  inputMulti: { minHeight: 80 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF3F3', borderWidth: 1, borderColor: '#F6C7C7',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10,
  },
  errorText: { flex: 1, fontSize: 12, color: theme.colors.danger, fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 13, marginTop: 4,
  },
  saveBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // HW card
  hwCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, marginBottom: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  hwAccent: { width: 5 },
  hwBody: { flex: 1, padding: 14 },
  hwTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 },
  hwTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, marginRight: 8 },
  dueBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  dueText: { fontSize: 11, fontWeight: '700' },
  hwDesc: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19, marginBottom: 8 },
  hwMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hwMetaText: { fontSize: 11, color: theme.colors.textMuted, fontWeight: '600' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyText: { fontSize: 15, color: theme.colors.textSecondary, fontWeight: '700' },
});
