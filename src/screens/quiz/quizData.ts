export interface Option {
  id: string;
  text: string;
}
export interface Question {
  id: string;
  question: string;
  options: Option[];
  correctId: string;
}
export interface Quiz {
  id: string;
  title: string;
  topicId: string;
  topicName: string;
  duration: number; // minutes
  questions: Question[];
}
export interface Topic {
  id: string;
  name: string;
  quizzes: Quiz[];
}
export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}
export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
  chapters: Chapter[];
}

const uid = () => Math.random().toString(36).slice(2, 8);

export const QUIZ_SUBJECTS: Subject[] = [
  {
    id: 's1',
    name: 'Physics',
    icon: '⚛️',
    color: '#6366F1',
    bg: '#EEF2FF',
    chapters: [
      {
        id: 'c1',
        name: 'Motion & Laws',
        topics: [
          {
            id: 't1',
            name: "Newton's Laws",
            quizzes: [
              {
                id: 'q1',
                title: "Newton's Laws Quiz",
                topicId: 't1',
                topicName: "Newton's Laws",
                duration: 10,
                questions: [
                  {
                    id: 'qu1',
                    question: "Newton's first law is also called?",
                    options: [
                      { id: 'a', text: 'Law of Inertia' },
                      { id: 'b', text: 'Law of Acceleration' },
                      { id: 'c', text: 'Law of Action' },
                      { id: 'd', text: 'Law of Gravity' },
                    ],
                    correctId: 'a',
                  },
                  {
                    id: 'qu2',
                    question: "F = ma is Newton's which law?",
                    options: [
                      { id: 'a', text: 'First' },
                      { id: 'b', text: 'Second' },
                      { id: 'c', text: 'Third' },
                      { id: 'd', text: 'Fourth' },
                    ],
                    correctId: 'b',
                  },
                  {
                    id: 'qu3',
                    question:
                      'Every action has an equal and opposite reaction is?',
                    options: [
                      { id: 'a', text: 'First Law' },
                      { id: 'b', text: 'Second Law' },
                      { id: 'c', text: 'Third Law' },
                      { id: 'd', text: 'Gravity Law' },
                    ],
                    correctId: 'c',
                  },
                ],
              },
            ],
          },
          {
            id: 't2',
            name: 'Friction',
            quizzes: [
              {
                id: 'q2',
                title: 'Friction Basics',
                topicId: 't2',
                topicName: 'Friction',
                duration: 8,
                questions: [
                  {
                    id: 'qu1',
                    question: 'Friction acts in which direction?',
                    options: [
                      { id: 'a', text: 'Same as motion' },
                      { id: 'b', text: 'Opposite to motion' },
                      { id: 'c', text: 'Perpendicular' },
                      { id: 'd', text: 'No direction' },
                    ],
                    correctId: 'b',
                  },
                  {
                    id: 'qu2',
                    question: 'Which surface has more friction?',
                    options: [
                      { id: 'a', text: 'Ice' },
                      { id: 'b', text: 'Glass' },
                      { id: 'c', text: 'Rubber' },
                      { id: 'd', text: 'Water' },
                    ],
                    correctId: 'c',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'c2',
        name: 'Work & Energy',
        topics: [
          {
            id: 't3',
            name: 'Kinetic Energy',
            quizzes: [
              {
                id: 'q3',
                title: 'Kinetic Energy Quiz',
                topicId: 't3',
                topicName: 'Kinetic Energy',
                duration: 5,
                questions: [
                  {
                    id: 'qu1',
                    question: 'KE formula is?',
                    options: [
                      { id: 'a', text: 'mgh' },
                      { id: 'b', text: '½mv²' },
                      { id: 'c', text: 'mv' },
                      { id: 'd', text: 'Fd' },
                    ],
                    correctId: 'b',
                  },
                  {
                    id: 'qu2',
                    question: 'KE depends on?',
                    options: [
                      { id: 'a', text: 'Height' },
                      { id: 'b', text: 'Temperature' },
                      { id: 'c', text: 'Speed' },
                      { id: 'd', text: 'Color' },
                    ],
                    correctId: 'c',
                  },
                ],
              },
            ],
          },
          { id: 't4', name: 'Potential Energy', quizzes: [] },
        ],
      },
    ],
  },
  {
    id: 's2',
    name: 'Mathematics',
    icon: '📐',
    color: '#0EA5E9',
    bg: '#E0F2FE',
    chapters: [
      {
        id: 'c1',
        name: 'Polynomials',
        topics: [
          {
            id: 't1',
            name: 'Zeroes of Polynomial',
            quizzes: [
              {
                id: 'q4',
                title: 'Polynomial Zeroes',
                topicId: 't1',
                topicName: 'Zeroes of Polynomial',
                duration: 10,
                questions: [
                  {
                    id: 'qu1',
                    question: 'A polynomial of degree 2 has how many zeroes?',
                    options: [
                      { id: 'a', text: '1' },
                      { id: 'b', text: '2' },
                      { id: 'c', text: '3' },
                      { id: 'd', text: '0' },
                    ],
                    correctId: 'b',
                  },
                  {
                    id: 'qu2',
                    question: 'Zero of x + 3 is?',
                    options: [
                      { id: 'a', text: '3' },
                      { id: 'b', text: '-3' },
                      { id: 'c', text: '0' },
                      { id: 'd', text: '1' },
                    ],
                    correctId: 'b',
                  },
                  {
                    id: 'qu3',
                    question: 'Degree of constant polynomial is?',
                    options: [
                      { id: 'a', text: '1' },
                      { id: 'b', text: '-1' },
                      { id: 'c', text: '0' },
                      { id: 'd', text: 'Undefined' },
                    ],
                    correctId: 'c',
                  },
                ],
              },
            ],
          },
          { id: 't2', name: 'Division Algorithm', quizzes: [] },
        ],
      },
    ],
  },
  {
    id: 's3',
    name: 'Chemistry',
    icon: '🧪',
    color: '#10B981',
    bg: '#D1FAE5',
    chapters: [
      {
        id: 'c1',
        name: 'Matter',
        topics: [
          {
            id: 't1',
            name: 'States of Matter',
            quizzes: [
              {
                id: 'q5',
                title: 'States of Matter Quiz',
                topicId: 't1',
                topicName: 'States of Matter',
                duration: 7,
                questions: [
                  {
                    id: 'qu1',
                    question: 'Which state has definite volume but no shape?',
                    options: [
                      { id: 'a', text: 'Solid' },
                      { id: 'b', text: 'Liquid' },
                      { id: 'c', text: 'Gas' },
                      { id: 'd', text: 'Plasma' },
                    ],
                    correctId: 'b',
                  },
                  {
                    id: 'qu2',
                    question: 'Boiling point of water is?',
                    options: [
                      { id: 'a', text: '90°C' },
                      { id: 'b', text: '95°C' },
                      { id: 'c', text: '100°C' },
                      { id: 'd', text: '110°C' },
                    ],
                    correctId: 'c',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
