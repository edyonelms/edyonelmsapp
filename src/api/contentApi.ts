import apiClient from './apiClient';

// ─── Envelope helpers ──────────────────────────────────────────────────────────
const unwrap = (data: any) => data?.data ?? data;

// ─── Types (UI-facing) ─────────────────────────────────────────────────────────
export interface SyllabusTopic {
  id: number;
  name: string;
  content?: string | null;
  order: number;
}

export interface SyllabusChapter {
  id: number;
  name: string;
  description?: string | null;
  subjectId?: number;
  order: number;
  topics: SyllabusTopic[];
}

// A concrete (class + section + subject) combination a teacher can manage.
export interface TeacherCombo {
  key: string;
  subjectId: number;
  subjectName: string;
  subjectCode?: string | null;
  standardId: number;
  standardName: string | null;
  sectionId: number;
  sectionName: string | null;
  label: string;
}

export interface StudentSubject {
  id: number;
  name: string;
  image?: string | null;
}

// ─── Mappers ───────────────────────────────────────────────────────────────────
const mapTopic = (t: any): SyllabusTopic => ({
  id: t.id,
  name: t.topic_name ?? t.name ?? '',
  content: t.topic_content ?? null,
  order: Number(t.order ?? 0),
});

const mapChapter = (c: any): SyllabusChapter => ({
  id: c.id,
  name: c.name ?? '',
  description: c.description ?? null,
  subjectId: c.subject_id,
  order: Number(c.order ?? 0),
  topics: Array.isArray(c.topics) ? c.topics.map(mapTopic) : [],
});

// ─── Subjects ──────────────────────────────────────────────────────────────────

// GET /subject — subjects for the logged-in STUDENT (their class + section).
export const getStudentSubjects = async (): Promise<StudentSubject[]> => {
  const { data } = await apiClient.get('/subject/');
  const list = unwrap(data);
  return Array.isArray(list)
    ? list.map((s: any) => ({ id: s.id, name: s.name ?? 'Subject', image: s.image ?? null }))
    : [];
};

// GET /teacher/subject — flatten the grouped response into (class,section,subject) combos.
export const getTeacherSubjects = async (): Promise<TeacherCombo[]> => {
  const { data } = await apiClient.get('/teacher/subject');
  const grouped = unwrap(data)?.subjects ?? {};

  // `subjects` is an object keyed by standard name, each value an array of rows.
  const rows: any[] = Object.values(grouped).flat() as any[];

  const combos = rows
    .filter(r => r && r.subject_id && r.standard_id && r.section_id)
    .map((r: any): TeacherCombo => {
      const cls = [r.standard_name, r.section_name].filter(Boolean).join(' ');
      return {
        key: `${r.standard_id}-${r.section_id}-${r.subject_id}`,
        subjectId: r.subject_id,
        subjectName: r.subject_name ?? 'Subject',
        subjectCode: r.subject_code ?? null,
        standardId: r.standard_id,
        standardName: r.standard_name ?? null,
        sectionId: r.section_id,
        sectionName: r.section_name ?? null,
        label: cls ? `${r.subject_name} · ${cls}` : r.subject_name,
      };
    });

  // De-duplicate identical class+section+subject combos.
  const seen = new Set<string>();
  return combos.filter(c => (seen.has(c.key) ? false : (seen.add(c.key), true)));
};

// ─── Chapters + topics (read) ──────────────────────────────────────────────────
export interface ChapterFilter {
  standard_id?: number;
  section_id?: number;
  subject_id?: number;
}

// POST /content/get — chapters (with topics). Students are auto-scoped server-side
// to their own class, so they only need to pass subject_id.
export const getChapters = async (filter: ChapterFilter): Promise<SyllabusChapter[]> => {
  const { data } = await apiClient.post('/content/get', { ...filter, per_page: 200 });
  const d = unwrap(data);
  const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
  return list.map(mapChapter);
};

// ─── Chapter CRUD (teacher) ────────────────────────────────────────────────────
export interface NewChapter {
  standard_id: number;
  section_id: number;
  subject_id: number;
  name: string;
  description?: string;
  order?: number;
}

export const createChapter = async (payload: NewChapter): Promise<SyllabusChapter> => {
  const { data } = await apiClient.post('/content/chapter', payload);
  return mapChapter(unwrap(data));
};

export const updateChapter = async (
  chapterId: number,
  payload: { name?: string; description?: string; order?: number },
): Promise<SyllabusChapter> => {
  const { data } = await apiClient.post(`/content/chapter/${chapterId}`, payload);
  return mapChapter(unwrap(data));
};

export const deleteChapter = async (chapterId: number): Promise<void> => {
  await apiClient.delete(`/content/chapter-delete/${chapterId}`);
};

// ─── Topic CRUD (teacher) ──────────────────────────────────────────────────────
export const createTopic = async (
  chapterId: number,
  topicName: string,
  order?: number,
): Promise<SyllabusTopic> => {
  const { data } = await apiClient.post('/content/topic', {
    chapter_id: chapterId,
    topic_name: topicName,
    order,
  });
  return mapTopic(unwrap(data));
};

export const updateTopic = async (
  topicId: number,
  topicName: string,
  order?: number,
): Promise<SyllabusTopic> => {
  const { data } = await apiClient.post(`/content/topic/${topicId}`, {
    topic_name: topicName,
    order,
  });
  return mapTopic(unwrap(data));
};

export const deleteTopic = async (topicId: number): Promise<void> => {
  await apiClient.delete(`/content/topic-delete/${topicId}`);
};

// ─── Error → friendly message ──────────────────────────────────────────────────
export const contentErrorMessage = (e: any): string => {
  const status = e?.response?.status;
  const serverMsg = e?.response?.data?.message;
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return serverMsg || 'You are not allowed to do this.';
  if (status === 404) return serverMsg || 'Not found.';
  if (status === 422) return serverMsg || 'Please check the details and try again.';
  if (e?.message === 'Network Error' || !e?.response) {
    return 'No internet connection. Check your network and try again.';
  }
  if (status >= 500) return serverMsg || 'The server ran into a problem. Please try again.';
  return serverMsg || 'Something went wrong. Please try again.';
};

// Deterministic colour + emoji for a subject (the API has no styling fields),
// so the existing subject-card design keeps working with live data.
const SUBJECT_PALETTE = [
  { color: '#6366F1', icon: '📘' },
  { color: '#0EA5E9', icon: '📐' },
  { color: '#10B981', icon: '🧪' },
  { color: '#22C55E', icon: '🌿' },
  { color: '#F59E0B', icon: '📖' },
  { color: '#EF4444', icon: '🏛️' },
  { color: '#8B5CF6', icon: '🌍' },
  { color: '#EC4899', icon: '💻' },
  { color: '#D97706', icon: '📜' },
];

export const subjectStyle = (key: string | number): { color: string; icon: string } => {
  const str = String(key);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return SUBJECT_PALETTE[hash % SUBJECT_PALETTE.length];
};
