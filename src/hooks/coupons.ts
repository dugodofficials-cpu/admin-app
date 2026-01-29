import { UpdateCouponInput } from '@/components/coupons/types';
import { createCoupon, deleteCoupon, getCouponById, getCoupons, updateCoupon } from "@/lib/api/coupons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from 'notistack';

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      try {
        return await getCoupons();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch coupons', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ["coupons", id],
    queryFn: async () => {
      try {
        return await getCouponById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch coupon', { variant: 'error' });
        throw error;
      }
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      enqueueSnackbar('Coupon created successfully', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Failed to create coupon', {
        variant: 'error',
      });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCouponInput) => updateCoupon(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupons", variables._id] });
      enqueueSnackbar('Coupon updated successfully', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Failed to update coupon', {
        variant: 'error',
      });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      enqueueSnackbar('Coupon deleted successfully', {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete coupon', {
        variant: 'error',
      });
    },
  });
} 