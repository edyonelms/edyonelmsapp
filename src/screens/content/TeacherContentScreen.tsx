import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Header from '../../components/Header';
import VectorIcon from '../../components/VectorIcon';
import AppRefreshControl from '../../components/AppRefreshControl';
import { useRefresh } from '../../hooks/useRefresh';
import { theme, onThemeChange } from '../../utils/theme';
import {
  addContent, ContentItem, CONTENT_STORE, ContentType,
  SUBJECTS, TYPE_META,
} from './contentData';
import type { Subject, Chapter } from '../subjects/subjectsData';

const PRIMARY = theme.colors.primary;
const TYPES: ContentType[] = ['text', 'url', 'pdf', 'image'];

// ─── Subject Dropdown ─────────────────────────────────────────────────────────
const SubjectDropdown = ({
  selected, onSelect,
}: { selected: Subject; onSelect: (s: Subject) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[s.dropWrap, open && { zIndex: 99 }]}>
      <TouchableOpacity style={s.dropBtn} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <View style={s.dropLeft}>
          <Text style={s.dropIcon}>{selected.icon}</Text>
          <Text style={s.dropSelected}>{selected.name}</Text>
        </View>
        <VectorIcon iconSet="Ionicons" iconName={open ? 'chevron-up' : 'chevron-down'} size={18} color={PRIMARY} />
      </TouchableOpacity>
      {open && (
        <View style={s.dropList}>
          {SUBJECTS.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[s.dropItem, sub.id === selected.id && s.dropItemActive]}
              onPress={() => { onSelect(sub); setOpen(false); }}
              activeOpacity={0.7}
            >
              <Text style={s.dropIcon}>{sub.icon}</Text>
              <Text style={[s.dropItemText, sub.id === selected.id && s.dropItemTextActive]}>{sub.name}</Text>
              {sub.id === selected.id && <VectorIcon iconSet="Ionicons" iconName="checkmark" size={16} color={PRIMARY} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Add Content Panel ────────────────────────────────────────────────────────
const AddContentPanel = ({
  subjectId, chapterId, onSaved,
}: { subjectId: string; chapterId: string; onSaved: () => void }) => {
  const [type, setType]   = useState<ContentType>('text');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const meta = TYPE_META[type];

  const handleSave = () => {
    if (!title.trim()) { setError('Enter a title.'); return; }
    if (!value.trim()) { setError(`Enter ${meta.label} content.`); return; }
    addContent({ subjectId, chapterId, type, title: title.trim(), value: value.trim() });
    setTitle(''); setValue(''); setError('');
    onSaved();
  };

  return (
    <View style={s.panel}>
      {/* Type selector */}
      <View style={s.typeRow}>
        {TYPES.map(t => {
          const m = TYPE_META[t];
          const active = t === type;
          return (
            <TouchableOpacity
              key={t}
              style={[s.typeBtn, active && { backgroundColor: m.color, borderColor: m.color }]}
              onPress={() => { setType(t); setValue(''); setError(''); }}
              activeOpacity={0.8}
            >
              <VectorIcon iconSet="Ionicons" iconName={m.icon} size={14} color={active ? '#fff' : theme.colors.textMuted} />
              <Text style={[s.typeBtnText, active && { color: '#fff' }]}>{m.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {!!error && (
        <View style={s.errorBox}>
          <VectorIcon iconSet="Ionicons" iconName="alert-circle-outline" size={13} color={theme.colors.danger} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}

      {/* Title */}
      <Text style={s.label}>Title</Text>
      <TextInput
        style={s.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Content title..."
        placeholderTextColor={theme.colors.textMuted}
      />

      {/* Dynamic input by type */}
      <Text style={s.label}>{meta.label} Content</Text>

      {type === 'text' && (
        <TextInput
          style={[s.input, s.inputMulti]}
          value={value}
          onChangeText={setValue}
          placeholder="Type your content here..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
          textAlignVertical="top"
        />
      )}

      {type === 'url' && (
        <TextInput
          style={s.input}
          value={value}
          onChangeText={setValue}
          placeholder="https://..."
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="url"
          autoCapitalize="none"
        />
      )}

      {(type === 'pdf' || type === 'image') && (
        <TouchableOpacity
          style={[s.filePicker, value ? { borderColor: meta.color, backgroundColor: meta.bg } : {}]}
          onPress={() => setValue(type === 'pdf' ? 'sample_document.pdf' : 'sample_image.jpg')}
          activeOpacity={0.8}
        >
          <VectorIcon
            iconSet="Ionicons"
            iconName={value ? 'checkmark-circle' : (type === 'pdf' ? 'document-outline' : 'image-outline')}
            size={22}
            color={value ? meta.color : theme.colors.textMuted}
          />
          <Text style={[s.filePickerText, value && { color: meta.color, fontWeight: '700' }]}>
            {value || (type === 'pdf' ? 'Select PDF Document' : 'Select Image')}
          </Text>
          {value && (
            <TouchableOpacity onPress={() => setValue('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <VectorIcon iconSet="Ionicons" iconName="close-circle" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}

      {/* Save button */}
      <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <VectorIcon iconSet="Ionicons" iconName="save-outline" size={16} color="#fff" />
        <Text style={s.saveBtnText}>Save Content</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Content Pill ─────────────────────────────────────────────────────────────
const ContentPill = ({ item }: { item: ContentItem }) => {
  const meta = TYPE_META[item.type];
  return (
    <View style={[s.pill, { backgroundColor: meta.bg }]}>
      <VectorIcon iconSet="Ionicons" iconName={meta.icon} size={13} color={meta.color} />
      <Text style={[s.pillText, { color: meta.color }]} numberOfLines={1}>{item.title}</Text>
      <Text style={[s.pillType, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

// ─── Chapter Card ─────────────────────────────────────────────────────────────
const ChapterCard = ({
  chapter, chapterIndex, subjectId, onStoreChange,
}: {
  chapter: Chapter; chapterIndex: number; subjectId: string; onStoreChange: () => void;
}) => {
  const [expanded, setExpanded]   = useState(chapterIndex === 0);
  const [addOpen, setAddOpen]     = useState(false);
  const [, forceUpdate]           = useState(0);

  const items = CONTENT_STORE.filter(c => c.subjectId === subjectId && c.chapterId === chapter.id);

  const handleSaved = () => {
    forceUpdate(n => n + 1);
    onStoreChange();
    setAddOpen(false);
  };

  return (
    <View style={s.chapterCard}>
      {/* Header */}
      <TouchableOpacity style={s.chapterHeader} onPress={() => setExpanded(v => !v)} activeOpacity={0.8}>
        <View style={s.chapterLeft}>
          <View style={s.chapterBadge}>
            <Text style={s.chapterBadgeText}>{chapterIndex + 1}</Text>
          </View>
          <VectorIcon iconSet="Ionicons" iconName="book-outline" size={17} color={PRIMARY} />
          <Text style={s.chapterName} numberOfLines={1}>{chapter.name}</Text>
        </View>
        <View style={s.chapterRight}>
          {items.length > 0 && (
            <View style={s.countBadge}>
              <Text style={s.countBadgeText}>{items.length}</Text>
            </View>
          )}
          <VectorIcon iconSet="Ionicons" iconName={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.textMuted} />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={s.chapterBody}>
          {/* Saved content pills */}
          {items.length > 0 && (
            <View style={s.pillsWrap}>
              {items.map(item => <ContentPill key={item.id} item={item} />)}
            </View>
          )}

          {/* Add button — hidden once 1 content exists */}
          {items.length === 0 && (
            <TouchableOpacity
              style={[s.addToggleBtn, addOpen && s.addToggleBtnActive]}
              onPress={() => setAddOpen(v => !v)}
              activeOpacity={0.85}
            >
              <VectorIcon
                iconSet="Ionicons"
                iconName={addOpen ? 'close' : 'add-circle-outline'}
                size={15}
                color={addOpen ? theme.colors.danger : PRIMARY}
              />
              <Text style={[s.addToggleBtnText, addOpen && { color: theme.colors.danger }]}>
                {addOpen ? 'Cancel' : 'Add Content'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Inline add panel */}
          {addOpen && items.length === 0 && (
            <AddContentPanel
              subjectId={subjectId}
              chapterId={chapter.id}
              onSaved={handleSaved}
            />
          )}
        </View>
      )}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const TeacherContentScreen = ({ navigation }: any) => {
  const [selectedSub, setSelectedSub] = useState<Subject>(SUBJECTS[0]);
  const [, forceUpdate] = useState(0);

  // TODO: wire to the content API loader once integrated.
  const { refreshing, onRefresh } = useRefresh(() => {});

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Content Management" onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <SubjectDropdown selected={selectedSub} onSelect={sub => setSelectedSub(sub)} />

        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Chapters</Text>
          <View style={s.countBadge}>
            <Text style={s.countBadgeText}>{selectedSub.chapters.length} chapters</Text>
          </View>
        </View>

        {selectedSub.chapters.length === 0 ? (
          <View style={s.empty}>
            <VectorIcon iconSet="Ionicons" iconName="book-outline" size={48} color={theme.colors.textMuted} />
            <Text style={s.emptyText}>No chapters yet</Text>
          </View>
        ) : (
          selectedSub.chapters.map((ch, i) => (
            <ChapterCard
              key={ch.id}
              chapter={ch}
              chapterIndex={i}
              subjectId={selectedSub.id}
              onStoreChange={() => forceUpdate(n => n + 1)}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TeacherContentScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const __mk_s = () => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 16 },

  // Dropdown
  dropWrap: { marginBottom: 20, zIndex: 99 },
  dropBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
    borderWidth: 1.5, borderColor: theme.colors.primaryLight,
    shadowColor: PRIMARY, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  dropLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dropIcon: { fontSize: 18 },
  dropSelected: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary },
  dropList: {
    backgroundColor: theme.colors.card, borderRadius: 14, marginTop: 4,
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

  // Section header
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.textPrimary },
  countBadge: { backgroundColor: theme.colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  countBadgeText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Chapter card
  chapterCard: {
    backgroundColor: theme.colors.card, borderRadius: 16, marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  chapterHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 13,
  },
  chapterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  chapterBadge: {
    width: 24, height: 24, borderRadius: 7, backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
  },
  chapterBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  chapterName: { fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary, flex: 1 },
  chapterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chapterBody: { borderTopWidth: 1, borderTopColor: theme.colors.border, padding: 14 },

  // Pills
  pillsWrap: { gap: 6, marginBottom: 10 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
  },
  pillText: { flex: 1, fontSize: 12, fontWeight: '700' },
  pillType: { fontSize: 10, fontWeight: '800', opacity: 0.7 },

  // Add toggle button
  addToggleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 10,
    paddingVertical: 9, marginBottom: 0,
  },
  addToggleBtnActive: { borderColor: theme.colors.danger, backgroundColor: '#FFF3F3' },
  addToggleBtnText: { fontSize: 13, fontWeight: '800', color: PRIMARY },

  // Add panel
  panel: {
    marginTop: 12, backgroundColor: '#FAFBFF',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: theme.colors.primaryLight,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: 8, borderRadius: 10,
    borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card,
  },
  typeBtnText: { fontSize: 11, fontWeight: '800', color: theme.colors.textMuted },
  label: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary, marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: theme.colors.card, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14,
    color: theme.colors.textPrimary, borderWidth: 1.5, borderColor: theme.colors.border, marginBottom: 8,
  },
  inputMulti: { minHeight: 90 },
  filePicker: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: theme.colors.border, borderStyle: 'dashed',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14,
    backgroundColor: theme.colors.card, marginBottom: 8,
  },
  filePickerText: { flex: 1, fontSize: 13, color: theme.colors.textMuted, fontWeight: '600' },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF3F3', borderWidth: 1, borderColor: '#F6C7C7',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 10,
  },
  errorText: { flex: 1, fontSize: 12, color: theme.colors.danger, fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 13, marginTop: 6,
  },
  saveBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 48, gap: 8 },
  emptyText: { fontSize: 16, color: theme.colors.textSecondary, fontWeight: '700' },
});


// Themed stylesheets — rebuilt on light/dark toggle.
let s = __mk_s();
onThemeChange(() => { s = __mk_s(); });
