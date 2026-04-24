export type ExamStatus = 'Published' | 'Upcoming' | 'Completed';
export type ExamType = 'Unit Test' | 'Mid Term' | 'Final Term' | 'Pre-Board';

export interface SyllabusItem {
  subject: string;
  topics: string[];
}

export interface Exam {
  id: string;
  name: string;
  subtitle: string;
  academicYear: string;
  type: ExamType;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  totalMarks: number;
  passingMarks: number;
  venue: string;
  instructions: string[];
  syllabus: SyllabusItem[];
}

export const STATUS_CONFIG: Record<
  ExamStatus,
  { color: string; bg: string; accent: string }
> = {
  Published: { color: '#16A34A', bg: '#DCFCE7', accent: '#16A34A' },
  Upcoming: { color: '#D97706', bg: '#FEF3C7', accent: '#D97706' },
  Completed: { color: '#64748B', bg: '#F1F5F9', accent: '#94A3B8' },
};

export const TYPE_ICON: Record<ExamType, string> = {
  'Unit Test': 'document-text-outline',
  'Mid Term': 'school-outline',
  'Final Term': 'trophy-outline',
  'Pre-Board': 'ribbon-outline',
};

export const FILTERS: (ExamStatus | 'All')[] = [
  'All',
  'Published',
  'Upcoming',
  'Completed',
];

export const EXAMS: Exam[] = [
  {
    id: '1',
    name: 'IA 1',
    subtitle: 'Marks System',
    academicYear: '2026-2027',
    type: 'Unit Test',
    dateRange: '03 Feb - 26 Feb 2026',
    startDate: '03 Feb 2026',
    endDate: '26 Feb 2026',
    status: 'Published',
    totalMarks: 100,
    passingMarks: 35,
    venue: 'Main Examination Hall',
    instructions: [
      'Carry your admit card on all exam days.',
      'No electronic devices allowed inside the hall.',
      'Report 30 minutes before the exam starts.',
      'Use blue or black ink pen only.',
    ],
    syllabus: [
      {
        subject: 'Mathematics',
        topics: ['Algebra', 'Linear Equations', 'Polynomials'],
      },
      { subject: 'Science', topics: ['Motion', 'Force & Laws', 'Gravitation'] },
      {
        subject: 'English',
        topics: ['Grammar', 'Comprehension', 'Writing Skills'],
      },
    ],
  },
  {
    id: '2',
    name: 'Mid Term',
    subtitle: 'Marks System',
    academicYear: '2026-2027',
    type: 'Mid Term',
    dateRange: '10 Mar - 20 Mar 2026',
    startDate: '10 Mar 2026',
    endDate: '20 Mar 2026',
    status: 'Upcoming',
    totalMarks: 100,
    passingMarks: 35,
    venue: 'Block B — Rooms 201-210',
    instructions: [
      'Carry your admit card on all exam days.',
      'No electronic devices allowed inside the hall.',
      'Report 30 minutes before the exam starts.',
      'Use blue or black ink pen only.',
    ],
    syllabus: [
      {
        subject: 'Mathematics',
        topics: ['Triangles', 'Coordinate Geometry', 'Statistics'],
      },
      {
        subject: 'Science',
        topics: ['Work & Energy', 'Sound', 'Structure of Atom'],
      },
      {
        subject: 'Social Science',
        topics: ['French Revolution', 'Socialism', 'Nazism'],
      },
    ],
  },
  {
    id: '3',
    name: 'IA 2',
    subtitle: 'Marks System',
    academicYear: '2025-2026',
    type: 'Unit Test',
    dateRange: '05 Nov - 15 Nov 2025',
    startDate: '05 Nov 2025',
    endDate: '15 Nov 2025',
    status: 'Completed',
    totalMarks: 100,
    passingMarks: 35,
    venue: 'Main Examination Hall',
    instructions: [
      'Carry your admit card on all exam days.',
      'No electronic devices allowed inside the hall.',
      'Report 30 minutes before the exam starts.',
    ],
    syllabus: [
      { subject: 'Mathematics', topics: ['Circles', 'Constructions', 'Areas'] },
      {
        subject: 'Science',
        topics: ['Natural Resources', 'Improvement in Food', 'Cell'],
      },
    ],
  },
  {
    id: '4',
    name: 'Final Term',
    subtitle: 'Marks System',
    academicYear: '2025-2026',
    type: 'Final Term',
    dateRange: '01 Mar - 20 Mar 2026',
    startDate: '01 Mar 2026',
    endDate: '20 Mar 2026',
    status: 'Completed',
    totalMarks: 100,
    passingMarks: 35,
    venue: 'All Blocks',
    instructions: [
      'Carry your admit card on all exam days.',
      'No electronic devices allowed inside the hall.',
      'Report 30 minutes before the exam starts.',
      'Use blue or black ink pen only.',
      'Rough work must be done in the answer sheet only.',
    ],
    syllabus: [
      { subject: 'Mathematics', topics: ['Full Syllabus'] },
      { subject: 'Science', topics: ['Full Syllabus'] },
      { subject: 'English', topics: ['Full Syllabus'] },
      { subject: 'Social Science', topics: ['Full Syllabus'] },
    ],
  },
];
