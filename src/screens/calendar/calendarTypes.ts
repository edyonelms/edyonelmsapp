import moment from 'moment';

export type FilterType = 'All' | 'Holiday' | 'Exam' | 'Event' | 'Assignment';

export interface CalEvent {
  id: string;
  date: string;
  title: string;
  type: Exclude<FilterType, 'All'>;
  time?: string;
}

export const TYPE_META: Record<
  Exclude<FilterType, 'All'>,
  { color: string; bg: string; icon: string; iconSet: string }
> = {
  Holiday: {
    color: '#10B981',
    bg: '#D1FAE5',
    icon: 'umbrella-beach',
    iconSet: 'FontAwesome5',
  },
  Exam: {
    color: '#EF4444',
    bg: '#FEE2E2',
    icon: 'file-alt',
    iconSet: 'FontAwesome5',
  },
  Event: {
    color: '#8B5CF6',
    bg: '#EDE9FE',
    icon: 'calendar',
    iconSet: 'FontAwesome',
  },
  Assignment: {
    color: '#F59E0B',
    bg: '#FEF3C7',
    icon: 'clipboard-list',
    iconSet: 'FontAwesome5',
  },
};

export const FILTERS: FilterType[] = [
  'All',
  'Holiday',
  'Exam',
  'Event',
  'Assignment',
];
export const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const YEAR_RANGE = Array.from({ length: 20 }, (_, i) => 2020 + i);

export const EVENTS: CalEvent[] = [
  {
    id: '1',
    date: moment().format('YYYY-MM') + '-05',
    title: 'Easter Holiday',
    type: 'Holiday',
    time: 'All Day',
  },
  {
    id: '2',
    date: moment().format('YYYY-MM') + '-12',
    title: 'Math Mid-Term Exam',
    type: 'Exam',
    time: '09:00 AM',
  },
  {
    id: '3',
    date: moment().format('YYYY-MM') + '-15',
    title: 'Science Assignment Due',
    type: 'Assignment',
    time: '11:59 PM',
  },
  {
    id: '4',
    date: moment().format('YYYY-MM') + '-22',
    title: 'Annual Sports Day',
    type: 'Event',
    time: '08:00 AM',
  },
  {
    id: '5',
    date: moment().format('YYYY-MM') + '-22',
    title: 'English Exam',
    type: 'Exam',
    time: '10:00 AM',
  },
  {
    id: '6',
    date: moment().format('YYYY-MM') + '-28',
    title: 'Parent-Teacher Meet',
    type: 'Event',
    time: '03:00 PM',
  },
];

export function chunkWeeks(days: (string | null)[]): (string | null)[][] {
  const rows: (string | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
  return rows;
}
