import { ExamType, TYPE_ICON } from '../exam/examData';

export { TYPE_ICON };
export type { ExamType };

export const EXAM_TYPES: ExamType[] = [
  'Unit Test',
  'Mid Term',
  'Final Term',
  'Pre-Board',
];

// ─── Editable exam used by the teacher upload screens ────────────────────────
export interface UploadExam {
  id: string;
  name: string;
  type: ExamType;
  academicYear: string;
  totalMarks: number;
  dateRange: string;
}

export const SEED_EXAMS: UploadExam[] = [
  {
    id: '1',
    name: 'IA 1',
    type: 'Unit Test',
    academicYear: '2026-2027',
    totalMarks: 100,
    dateRange: '03 Feb - 26 Feb 2026',
  },
  {
    id: '2',
    name: 'Mid Term',
    type: 'Mid Term',
    academicYear: '2026-2027',
    totalMarks: 100,
    dateRange: '10 Mar - 20 Mar 2026',
  },
  {
    id: '3',
    name: 'IA 2',
    type: 'Unit Test',
    academicYear: '2025-2026',
    totalMarks: 50,
    dateRange: '05 Nov - 15 Nov 2025',
  },
  {
    id: '4',
    name: 'Final Term',
    type: 'Final Term',
    academicYear: '2025-2026',
    totalMarks: 100,
    dateRange: '01 Mar - 20 Mar 2026',
  },
];

// ─── Class / subject selectors ───────────────────────────────────────────────
export interface OptionItem {
  id: string;
  label: string;
}

export const CLASSES: OptionItem[] = [
  { id: '1', label: 'Class 6A' },
  { id: '2', label: 'Class 7B' },
  { id: '3', label: 'Class 8C' },
  { id: '4', label: 'Class 9A' },
  { id: '5', label: 'Class 10B' },
];

export const SUBJECTS: OptionItem[] = [
  { id: 'MTH', label: 'Mathematics' },
  { id: 'SCI', label: 'Science' },
  { id: 'ENG', label: 'English' },
  { id: 'SST', label: 'Social Science' },
  { id: 'HIN', label: 'Hindi' },
];

// ─── Students ────────────────────────────────────────────────────────────────
export interface UploadStudent {
  id: string;
  rollNo: string;
  name: string;
}

export const STUDENTS: UploadStudent[] = [
  { id: '1', rollNo: '01', name: 'Aarav Sharma' },
  { id: '2', rollNo: '02', name: 'Priya Patel' },
  { id: '3', rollNo: '03', name: 'Rohan Mehta' },
  { id: '4', rollNo: '04', name: 'Sneha Verma' },
  { id: '5', rollNo: '05', name: 'Karan Singh' },
  { id: '6', rollNo: '06', name: 'Ananya Gupta' },
  { id: '7', rollNo: '07', name: 'Dev Joshi' },
  { id: '8', rollNo: '08', name: 'Riya Nair' },
  { id: '9', rollNo: '09', name: 'Arjun Rao' },
  { id: '10', rollNo: '10', name: 'Meera Iyer' },
  { id: '11', rollNo: '11', name: 'Vivek Tiwari' },
  { id: '12', rollNo: '12', name: 'Pooja Desai' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const ACADEMIC_YEARS = ['2026-2027', '2025-2026', '2024-2025'];

export const makeId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
