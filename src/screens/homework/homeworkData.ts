export interface Homework {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectIcon: string;
  subjectColor: string;
  teacherName: string;
  title: string;
  description: string;
  dueDate: string; // 'YYYY-MM-DD'
  createdAt: string; // 'HH:MM AM/PM'
}

export interface HWSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

export const HW_SUBJECTS: HWSubject[] = [
  { id: 's1', name: 'Physics', icon: '⚛️', color: '#6366F1', bg: '#EEF2FF' },
  {
    id: 's2',
    name: 'Mathematics',
    icon: '📐',
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  { id: 's3', name: 'Chemistry', icon: '🧪', color: '#10B981', bg: '#D1FAE5' },
  { id: 's4', name: 'English', icon: '📖', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 's5', name: 'History', icon: '🏛️', color: '#EF4444', bg: '#FEE2E2' },
];

// Shared in-memory store — both screens import this array
export const HOMEWORK_STORE: Homework[] = [
  {
    id: 'hw1',
    subjectId: 's1',
    subjectName: 'Physics',
    subjectIcon: '⚛️',
    subjectColor: '#6366F1',
    teacherName: 'Mr. Sharma',
    title: "Newton's Laws Practice",
    description:
      "Solve problems 1–10 from chapter 3 on Newton's laws of motion.",
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: '09:30 AM',
  },
  {
    id: 'hw2',
    subjectId: 's2',
    subjectName: 'Mathematics',
    subjectIcon: '📐',
    subjectColor: '#0EA5E9',
    teacherName: 'Ms. Patel',
    title: 'Polynomial Zeroes',
    description:
      'Find zeroes of the given polynomials — exercise 2.2 Q1 to Q5.',
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: '11:00 AM',
  },
];

const fmt = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const addHomework = (hw: Omit<Homework, 'id' | 'createdAt'>) => {
  HOMEWORK_STORE.push({
    ...hw,
    id: `hw_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: fmt(new Date()),
  });
};
