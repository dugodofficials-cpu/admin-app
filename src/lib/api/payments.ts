import { apiClient } from './client';
import { PaymentStatus } from '@/components/orders/types';

export type CryptoPayment = {
  _id: string;
  order?: {
    _id: string;
    orderNumber?: string;
    total?: number;
  } | null;
  user?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  txid?: string;
  initiatedAt?: string;
  createdAt?: string;
  notes?: string;
  paymentDetails?: {
    provider?: string;
    transactionId?: string;
    walletType?: string;
    cryptoCurrency?: string;
    cryptoAddress?: string;
  };
  metadata?: Record<string, unknown>;
};

export type GetProcessingCryptoPaymentsResponse = {
  data: CryptoPayment[];
  message: string;
};

export const getProcessingCryptoPayments = async (): Promise<GetProcessingCryptoPaymentsResponse> => {
  return apiClient<GetProcessingCryptoPaymentsResponse>('payments/admin/crypto/processing', {
    method: 'GET',
  });
};

export type ReviewCryptoPaymentDto = {
  status: PaymentStatus.COMPLETED | PaymentStatus.FAILED;
  notes?: string;
};

export type ReviewCryptoPaymentResponse = {
  data: CryptoPayment;
  message: string;
};

export const reviewCryptoPayment = async (paymentId: string, dto: ReviewCryptoPaymentDto): Promise<ReviewCryptoPaymentResponse> => {
  return apiClient<ReviewCryptoPaymentResponse>(`payments/admin/crypto/${paymentId}/review`, {
    method: 'PATCH',
    body: dto,
  });
};
