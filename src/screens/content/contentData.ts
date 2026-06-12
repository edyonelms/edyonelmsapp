import { SUBJECTS } from '../subjects/subjectsData';

export type ContentType = 'text' | 'url' | 'pdf' | 'image';

export interface ContentItem {
  id: string;
  chapterId: string;
  subjectId: string;
  topicId?: string;
  type: ContentType;
  title: string;
  value: string; // text body | url string | file name
  addedAt: string;
}

export { SUBJECTS };

export const CONTENT_STORE: ContentItem[] = [
  {
    id: 'ci1', chapterId: 'c1', subjectId: '1', topicId: 't2', type: 'text',
    title: "Newton's Laws Overview",
    value: "Newton's three laws of motion describe the relationship between a body and the forces acting upon it.",
    addedAt: '10:00 AM',
  },
  {
    id: 'ci2', chapterId: 'c1', subjectId: '1', topicId: 't2', type: 'url',
    title: 'Khan Academy – Newton\'s Laws',
    value: 'https://www.khanacademy.org/science/physics',
    addedAt: '10:05 AM',
  },
  {
    id: 'ci3', chapterId: 'c1', subjectId: '1', topicId: 't2', type: 'pdf',
    title: "Newton's Laws Notes",
    value: 'newtons_laws_notes.pdf',
    addedAt: '10:10 AM',
  },
  {
    id: 'ci4', chapterId: 'c1', subjectId: '1', topicId: 't1', type: 'text',
    title: 'What is Motion?',
    value: 'Motion is the change in position of an object with respect to time. It is described in terms of distance, displacement, speed and velocity.',
    addedAt: '09:40 AM',
  },
  {
    id: 'ci5', chapterId: 'c2', subjectId: '1', topicId: 't1', type: 'image',
    title: 'Work & Energy Diagram',
    value: 'https://picsum.photos/seed/energy/900/600',
    addedAt: '11:20 AM',
  },
  {
    id: 'ci6', chapterId: 'c1', subjectId: '2', topicId: 't1', type: 'url',
    title: "Euclid's Division Lemma – Video",
    value: 'https://www.khanacademy.org/math',
    addedAt: '12:15 PM',
  },
];

const now = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const addContent = (item: Omit<ContentItem, 'id' | 'addedAt'>) => {
  CONTENT_STORE.push({
    ...item,
    id: `ci_${Math.random().toString(36).slice(2, 8)}`,
    addedAt: now(),
  });
};

export const TYPE_META: Record<ContentType, { label: string; icon: string; color: string; bg: string }> = {
  text:  { label: 'Text',  icon: 'document-text-outline', color: '#6366F1', bg: '#EEF2FF' },
  url:   { label: 'URL',   icon: 'link-outline',          color: '#0EA5E9', bg: '#E0F2FE' },
  pdf:   { label: 'PDF',   icon: 'document-outline',      color: '#EF4444', bg: '#FEE2E2' },
  image: { label: 'Image', icon: 'image-outline',         color: '#10B981', bg: '#D1FAE5' },
};
