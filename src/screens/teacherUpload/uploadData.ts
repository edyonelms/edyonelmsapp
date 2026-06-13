// ─── Selectors ───────────────────────────────────────────────────────────────
export interface OptionItem {
  id: string;
  label: string;
}

export interface ExamOption extends OptionItem {
  totalMarks: number;
}

export const EXAM_OPTIONS: ExamOption[] = [
  { id: '1', label: 'IA 1 (2026-2027)', totalMarks: 100 },
  { id: '2', label: 'Mid Term (2026-2027)', totalMarks: 100 },
  { id: '3', label: 'IA 2 (2025-2026)', totalMarks: 50 },
  { id: '4', label: 'Final Term (2025-2026)', totalMarks: 100 },
];

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

// ─── Selection across the stepped dropdown ───────────────────────────────────
export interface Selection {
  exam: ExamOption | null;
  cls: OptionItem | null;
  subject: OptionItem | null;
}

export const emptySelection = (): Selection => ({
  exam: null,
  cls: null,
  subject: null,
});

export const isComplete = (s: Selection): boolean =>
  !!(s.exam && s.cls && s.subject);

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

// ─── Submitted entries (shared by upload + manage screens) ───────────────────
export interface UploadEntry {
  studentId: string;
  rollNo: string;
  name: string;
  fileName?: string; // copy mode
  uri?: string; // copy mode
  marks?: number; // marks mode
}
