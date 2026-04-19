import { theme } from '../../utils/theme';

export interface Book {
  id: string;
  title: string;
  subject: string;
  imageUri: string;
  pages: number;
  size: string;
}

export const SUBJECT_COLORS: Record<string, { color: string; bg: string }> = {
  All: { color: theme.colors.primary, bg: theme.colors.primaryLight },
  Hindi: { color: '#8B5CF6', bg: '#EDE9FE' },
  Maths: { color: '#0EA5E9', bg: '#E0F2FE' },
  Science: { color: '#10B981', bg: '#D1FAE5' },
  SST: { color: '#F59E0B', bg: '#FEF3C7' },
  English: { color: '#EF4444', bg: '#FEE2E2' },
};

export const SUBJECTS = [
  'All',
  ...Object.keys(SUBJECT_COLORS).filter(s => s !== 'All'),
];

export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'Hindi Book',
    subject: 'Hindi',
    imageUri:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
    pages: 240,
    size: '12 MB',
  },
  {
    id: '2',
    title: 'Mathematics Vol 1',
    subject: 'Maths',
    imageUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    pages: 320,
    size: '18 MB',
  },
  {
    id: '3',
    title: 'Kshitij Bhag 2',
    subject: 'Hindi',
    imageUri:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
    pages: 180,
    size: '9 MB',
  },
  {
    id: '4',
    title: 'Science Explorer',
    subject: 'Science',
    imageUri:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    pages: 290,
    size: '22 MB',
  },
  {
    id: '5',
    title: 'Social Studies',
    subject: 'SST',
    imageUri:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    pages: 210,
    size: '14 MB',
  },
  {
    id: '6',
    title: 'English Reader',
    subject: 'English',
    imageUri:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    pages: 160,
    size: '8 MB',
  },
  {
    id: '7',
    title: 'Physics Part 1',
    subject: 'Science',
    imageUri:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    pages: 350,
    size: '25 MB',
  },
  {
    id: '8',
    title: 'Maths Vol 2',
    subject: 'Maths',
    imageUri:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
    pages: 300,
    size: '20 MB',
  },
];
