import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
export type FeeType = 'academic' | 'transport';
export type PaymentState = 'PENDING' | 'COMPLETED' | 'FAILED';
export type InstallmentStatus = 'paid' | 'partial' | 'due' | 'overdue';

export interface FeeSummary {
  total_due: number;
  total_paid: number;
  remaining: number;
  academic_due: number;
  academic_paid: number;
  transport_due: number;
  transport_paid: number;
  total_penalties: number;
  total_waived: number;
  concession: number;
  cleared_percent: number;
}

export interface Installment {
  serial: number;
  label: string;
  due_date: string | null;
  amount: number;
  paid: number;
  outstanding: number;
  penalty: number;
  days_overdue: number;
  payable: number;
  status: InstallmentStatus;
}

export interface PaymentRow {
  id: number;
  receipt_number: string;
  fee_type: FeeType;
  amount: number;
  penalty_amount: number;
  waiver_amount?: number;
  payment_mode: string;
  payment_date: string | null;
  class?: string;
  remark?: string | null;
}

export interface FeeDashboard {
  summary: FeeSummary;
  upcoming: Installment[];
  recent_payments: PaymentRow[];
  counts: { overdue_installments: number; total_installments: number };
}

export interface AcademicFeeItem {
  id: number;
  fee_name: string;
  amount: number;
  academic_year: string | null;
}

export interface AcademicFees {
  academic_year: string | null;
  structures: AcademicFeeItem[];
  totals: {
    structure_total: number;
    concession: number;
    net_due: number;
    paid: number;
    remaining: number;
  };
  penalty: {
    per_day: number;
    due_day_of_month: number;
    cycle_type: string;
    charged: number;
  };
}

export interface PenaltyItem {
  payment_id: number;
  receipt_number: string;
  fee_type: FeeType;
  base_amount: number;
  penalty_amount: number;
  payment_mode: string;
  payment_date: string | null;
  class?: string;
  remark?: string | null;
}

export interface FeePenalties {
  penalty_per_day: number;
  total_penalty: number;
  count: number;
  items: PenaltyItem[];
}

// GET /fees/dashboard — overview + upcoming installments + recent payments
export const getFeeDashboard = async (): Promise<FeeDashboard> => {
  const { data } = await apiClient.get('/fees/dashboard');
  return data?.data ?? data;
};

// GET /fees/academic — academic structure + penalty policy
export const getAcademicFees = async (): Promise<AcademicFees> => {
  const { data } = await apiClient.get('/fees/academic');
  return data?.data ?? data;
};

// GET /fees/penalties — penalties charged + which payment each is on
export const getFeePenalties = async (): Promise<FeePenalties> => {
  const { data } = await apiClient.get('/fees/penalties');
  return data?.data ?? data;
};

export interface InitiatePaymentResponse {
  merchant_order_id: string;
  redirect_url: string;
  state: PaymentState;
  amount: number;
}

export interface PaymentStatusResponse {
  merchant_order_id: string;
  state: PaymentState;
  amount: number;
  fee_type: FeeType;
  paid: boolean;
  receipt_number: string | null;
}

// POST /fees/pay — start an online PhonePe payment; returns a checkout URL.
export const initiateFeePayment = async (
  amount: number,
  feeType: FeeType = 'academic',
): Promise<InitiatePaymentResponse> => {
  const { data } = await apiClient.post('/fees/pay', {
    amount,
    fee_type: feeType,
  });
  return data?.data ?? data;
};

// GET /fees/pay/{merchantOrderId}/status — poll the latest payment state.
export const getFeePaymentStatus = async (
  merchantOrderId: string,
): Promise<PaymentStatusResponse> => {
  const { data } = await apiClient.get(
    `/fees/pay/${encodeURIComponent(merchantOrderId)}/status`,
  );
  return data?.data ?? data;
};
