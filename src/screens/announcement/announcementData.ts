import { theme } from '../../utils/theme';

export type FilterKey = 'Today' | '7 Days' | '15 Days' | '30 Days';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  daysAgo: number;
  isNew: boolean;
  tag: 'All' | 'Teacher' | 'Student' | 'Admin';
  hasImage?: boolean;
  hasPdf?: boolean;
}

export const TAG_META: Record<
  Announcement['tag'],
  { color: string; bg: string }
> = {
  All: { color: theme.colors.primary, bg: theme.colors.primaryLight },
  Teacher: { color: '#8B5CF6', bg: '#EDE9FE' },
  Student: { color: '#0EA5E9', bg: '#E0F2FE' },
  Admin: { color: '#F59E0B', bg: '#FEF3C7' },
};

export const FILTERS: { label: FilterKey; days: number }[] = [
  { label: 'Today', days: 0 },
  { label: '7 Days', days: 7 },
  { label: '15 Days', days: 15 },
  { label: '30 Days', days: 30 },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'All Students',
    body: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    daysAgo: 0,
    isNew: true,
    tag: 'All',
    hasImage: true,
    hasPdf: true,
  },
  {
    id: '2',
    title: 'Teacher Notice',
    body: 'Staff meeting scheduled for tomorrow at 10 AM in the conference hall. All teachers must attend without fail. Please bring your attendance registers and lesson plans for review. The principal will address important updates regarding the upcoming examination schedule and new academic policies.',
    daysAgo: 2,
    isNew: true,
    tag: 'Teacher',
    hasImage: false,
    hasPdf: true,
  },
  {
    id: '3',
    title: 'Exam Schedule',
    body: 'Mid-term examinations will begin from next Monday. Students are advised to check the timetable on the portal. The exams will be held in the main examination hall. Students must carry their hall tickets and valid ID cards. No electronic devices are permitted inside the examination hall.',
    daysAgo: 6,
    isNew: false,
    tag: 'Student',
    hasImage: true,
    hasPdf: false,
  },
  {
    id: '4',
    title: 'Holiday Notice',
    body: 'School will remain closed on account of the national holiday. Classes will resume the following day as per the regular schedule. All pending assignments must be submitted on the day of resumption.',
    daysAgo: 10,
    isNew: false,
    tag: 'All',
    hasImage: false,
    hasPdf: false,
  },
  {
    id: '5',
    title: 'Admin Update',
    body: 'Fee submission deadline has been extended to the end of this month. Please submit at the earliest to avoid late fees. Payments can be made online through the school portal or at the accounts office between 9 AM and 2 PM on working days.',
    daysAgo: 13,
    isNew: false,
    tag: 'Admin',
    hasImage: false,
    hasPdf: true,
  },
  {
    id: '6',
    title: 'Sports Day',
    body: 'Annual sports day will be held on the 25th. All students are encouraged to participate in at least one event. Registration forms are available at the sports office. Last date for registration is the 20th of this month.',
    daysAgo: 22,
    isNew: false,
    tag: 'Student',
    hasImage: true,
    hasPdf: false,
  },
];
