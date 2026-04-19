export type QueryStatus = 'Pending' | 'Resolved' | 'In Progress';

export interface Query {
  id: string;
  subject: string;
  message: string;
  status: QueryStatus;
  daysAgo: number;
  attachmentName?: string;
}

export const STATUS_META: Record<QueryStatus, { color: string; bg: string }> = {
  Pending:     { color: '#F59E0B', bg: '#FEF3C7' },
  'In Progress': { color: '#0EA5E9', bg: '#E0F2FE' },
  Resolved:    { color: '#10B981', bg: '#D1FAE5' },
};

export const MOCK_QUERIES: Query[] = [
  {
    id: '1',
    subject: 'Fee Receipt Issue',
    message: 'I have not received the fee receipt for the last month payment. Please look into this matter.',
    status: 'Resolved',
    daysAgo: 5,
    attachmentName: 'receipt.jpg',
  },
  {
    id: '2',
    subject: 'Library Book Request',
    message: 'I would like to request access to additional reference books for the upcoming exams.',
    status: 'In Progress',
    daysAgo: 10,
  },
  {
    id: '3',
    subject: 'Transport Route Change',
    message: 'Requesting a change in the bus route due to road construction near my area.',
    status: 'Pending',
    daysAgo: 18,
    attachmentName: 'map.pdf',
  },
];
