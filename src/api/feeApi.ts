import apiClient from './apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
export type FeeType = 'academic' | 'transport';
export type PaymentState = 'PENDING' | 'COMPLETED' | 'FAILED';

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
