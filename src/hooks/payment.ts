import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { getProcessingCryptoPayments, reviewCryptoPayment, ReviewCryptoPaymentDto } from '@/lib/api/payments';

export const useProcessingCryptoPayments = () => {
  return useQuery({
    queryKey: ['processingCryptoPayments'],
    queryFn: async () => {
      try {
        return await getProcessingCryptoPayments();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch crypto payments', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useReviewCryptoPayment = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ paymentId, dto }: { paymentId: string; dto: ReviewCryptoPaymentDto }) => reviewCryptoPayment(paymentId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processingCryptoPayments'] });
      enqueueSnackbar('Crypto payment updated', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to update crypto payment', { variant: 'error' });
    },
  });
};
