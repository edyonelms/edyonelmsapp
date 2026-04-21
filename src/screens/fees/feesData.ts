export const PURPLE = '#7C3AED';
export const PINK = '#EC4899';

export const CATEGORIES = [
  'Overall',
  'Academic',
  'Transport',
  'Penalty',
  'Activity',
  'Additionally',
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface BreakupRow {
  label: string;
  value: string;
  color?: string;
}
export interface UpcomingItem {
  installment: string;
  dueDate: string;
  penalty: number;
  subtotal: number;
}
export interface PaidItem {
  installment: string;
  dueDate: string;
  penalty: number;
  paidOn: string;
  subtotal: number;
}

export interface FeeCategory {
  paid: number;
  total: number;
  color: string;
  icon: string;
  breakup: BreakupRow[];
  upcoming: UpcomingItem[];
  paidFees: PaidItem[];
}

export const FEE_DATA: Record<Exclude<Category, 'Overall'>, FeeCategory> = {
  Academic: {
    paid: 41000,
    total: 50000,
    color: '#6366F1',
    icon: 'school-outline',
    breakup: [
      { label: 'Tuition Fee', value: '₹ 2,000' },
      { label: 'Discount Applied', value: '- ₹ 200', color: '#10B981' },
      { label: 'Promo Code', value: 'EXTRA10', color: '#10B981' },
      { label: 'Subtotal', value: '₹ 1,800' },
      { label: 'GST 18%', value: '₹ 324.00' },
    ],
    upcoming: [
      {
        installment: '1st Installment',
        dueDate: '31/03/2025',
        penalty: 500,
        subtotal: 15500,
      },
      {
        installment: '2nd Installment',
        dueDate: '30/06/2025',
        penalty: 0,
        subtotal: 9000,
      },
    ],
    paidFees: [
      {
        installment: '1st Installment',
        dueDate: '31/05/2025',
        penalty: 500,
        paidOn: '28/05/2025',
        subtotal: 789.45,
      },
    ],
  },
  Transport: {
    paid: 8000,
    total: 12000,
    color: '#0EA5E9',
    icon: 'bus-outline',
    breakup: [
      { label: 'Bus Fee', value: '₹ 4,000' },
      { label: 'Fuel Surcharge', value: '₹ 200' },
      { label: 'Subtotal', value: '₹ 4,200' },
      { label: 'GST 5%', value: '₹ 210.00' },
    ],
    upcoming: [
      {
        installment: '2nd Installment',
        dueDate: '15/07/2025',
        penalty: 200,
        subtotal: 4410,
      },
    ],
    paidFees: [
      {
        installment: '1st Installment',
        dueDate: '15/01/2025',
        penalty: 0,
        paidOn: '10/01/2025',
        subtotal: 4200,
      },
    ],
  },
  Penalty: {
    paid: 600,
    total: 1100,
    color: '#EF4444',
    icon: 'warning-outline',
    breakup: [
      { label: 'Late Fee', value: '₹ 500' },
      { label: 'Library Fine', value: '₹ 100' },
      { label: 'Subtotal', value: '₹ 600' },
    ],
    upcoming: [
      {
        installment: 'Pending Fine',
        dueDate: '01/08/2025',
        penalty: 500,
        subtotal: 500,
      },
    ],
    paidFees: [
      {
        installment: 'Late Fee',
        dueDate: '10/03/2025',
        penalty: 100,
        paidOn: '08/03/2025',
        subtotal: 600,
      },
    ],
  },
  Activity: {
    paid: 2000,
    total: 3500,
    color: '#10B981',
    icon: 'football-outline',
    breakup: [
      { label: 'Sports Fee', value: '₹ 1,000' },
      { label: 'Arts & Craft', value: '₹ 500' },
      { label: 'Subtotal', value: '₹ 1,500' },
      { label: 'GST 12%', value: '₹ 180.00' },
    ],
    upcoming: [
      {
        installment: '2nd Installment',
        dueDate: '20/08/2025',
        penalty: 0,
        subtotal: 1680,
      },
    ],
    paidFees: [
      {
        installment: '1st Installment',
        dueDate: '20/02/2025',
        penalty: 0,
        paidOn: '18/02/2025',
        subtotal: 2000,
      },
    ],
  },
  Additionally: {
    paid: 1200,
    total: 2500,
    color: '#F59E0B',
    icon: 'add-circle-outline',
    breakup: [
      { label: 'Lab Fee', value: '₹ 800' },
      { label: 'Stationery', value: '₹ 400' },
      { label: 'Subtotal', value: '₹ 1,200' },
      { label: 'GST 12%', value: '₹ 144.00' },
    ],
    upcoming: [
      {
        installment: 'Term 2 Fee',
        dueDate: '10/09/2025',
        penalty: 0,
        subtotal: 1344,
      },
    ],
    paidFees: [
      {
        installment: 'Term 1 Fee',
        dueDate: '10/01/2025',
        penalty: 0,
        paidOn: '08/01/2025',
        subtotal: 1200,
      },
    ],
  },
};

export const fmt = (n: number) => `₹ ${n.toLocaleString('en-IN')}`;

export const calcBreakupTotal = (breakup: BreakupRow[]) => {
  const sub = breakup.find(r => r.label === 'Subtotal');
  const gst = breakup.find(r => r.label.startsWith('GST'));
  const subVal = sub ? parseFloat(sub.value.replace(/[₹, ]/g, '')) : 0;
  const gstVal = gst ? parseFloat(gst.value.replace(/[₹, ]/g, '')) : 0;
  return (subVal + gstVal).toFixed(2);
};
