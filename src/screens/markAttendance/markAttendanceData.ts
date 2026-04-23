export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

export interface ClassItem {
  id: string;
  label: string;
}

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  present: {
    label: 'P',
    color: '#16A34A',
    bg: '#DCFCE7',
    icon: 'checkmark-circle',
  },
  absent: { label: 'A', color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle' },
  leave: { label: 'L', color: '#D97706', bg: '#FEF3C7', icon: 'time' },
};

export const CLASSES: ClassItem[] = [
  { id: '1', label: 'Class 6A' },
  { id: '2', label: 'Class 7B' },
  { id: '3', label: 'Class 8C' },
  { id: '4', label: 'Class 9A' },
  { id: '5', label: 'Class 10B' },
];

export const STUDENTS: Omit<Student, 'status'>[] = [
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

export const getDefaultStudents = (): Student[] =>
  STUDENTS.map(s => ({ ...s, status: 'present' }));

export const getTodayLabel = (): string =>
  new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const getCounts = (
  students: Student[],
): Record<AttendanceStatus, number> =>
  students.reduce(
    (acc, s) => {
      acc[s.status]++;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 },
  );
