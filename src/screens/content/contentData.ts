import { SUBJECTS } from '../subjects/subjectsData';

export type ContentType = 'text' | 'url' | 'pdf' | 'image';

export interface ContentItem {
  id: string;
  chapterId: string;
  subjectId: string;
  type: ContentType;
  title: string;
  value: string; // text body | url string | file name
  addedAt: string;
}

export { SUBJECTS };

export const CONTENT_STORE: ContentItem[] = [
  {
    id: 'ci1', chapterId: 'c1', subjectId: '1', type: 'text',
    title: "Newton's Laws Overview",
    value: "Newton's three laws of motion describe the relationship between a body and the forces acting upon it.",
    addedAt: '10:00 AM',
  },
  {
    id: 'ci2', chapterId: 'c1', subjectId: '1', type: 'url',
    title: 'Khan Academy – Newton\'s Laws',
    value: 'https://www.khanacademy.org/science/physics',
    addedAt: '10:05 AM',
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
