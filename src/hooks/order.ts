import { GetOrdersQueryDto, Order, OrderDetailResponse, OrderResponse, OrderStatus } from '@/components/orders/types';
import {
  createOrder as createOrderApi,
  getOrder as getOrderApi,
  getOrderDetail as getOrderDetailApi,
  getOrderStatistics as getOrderStatisticsApi,
  getUserOrders as getUserOrdersApi,
  OrderStatistics,
  resendOrderConfirmation,
  updateDeliveryStatus as updateDeliveryStatusApi,
  UpdateDeliveryStatusDto,
  updateOrder as updateOrderApi,
  UpdateOrderDto
} from '@/lib/api/order';
import { ProductType } from '@/lib/api/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar, useSnackbar } from 'notistack';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<Order, Error, Partial<Order>>({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create order', {
        variant: 'error',
      });
    },
  });
};

export const useGetOrder = (params: GetOrdersQueryDto) => {
  return useQuery<OrderResponse, Error>({
    queryKey: ['order', params],
    queryFn: async () => {
      try {
        return await getOrderApi(params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch orders', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useGetUserOrders = (userId: string, params: {
  page?: number;
  limit?: number;
  type?: ProductType;
}) => {
  return useQuery<Order[], Error>({
    queryKey: ['userOrders', userId, params],
    queryFn: async () => {
      try {
        return await getUserOrdersApi(userId, params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch user orders', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useGetOrderDetail = (orderId: string) => {
  return useQuery<OrderDetailResponse, Error>({
    queryKey: ['orderDetail', orderId],
    queryFn: async () => {
      try {
        return await getOrderDetailApi(orderId);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch order details', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useUpdateOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<OrderDetailResponse, Error, UpdateOrderDto>({
    mutationFn: (data) => updateOrderApi(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetail', orderId] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      enqueueSnackbar('Order updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update order', { variant: 'error' });
    },
  });
};

export const useResendOrderConfirmation = (orderId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<OrderDetailResponse, Error, void>({
    mutationFn: () => resendOrderConfirmation(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetail', orderId] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      enqueueSnackbar('Order confirmation resent successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to resend order confirmation', { variant: 'error' });
    },
  });
};

export const useUpdateDeliveryStatus = (orderId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<OrderDetailResponse, Error, UpdateDeliveryStatusDto>({
    mutationFn: (data) => updateDeliveryStatusApi(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderDetail', orderId] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      enqueueSnackbar('Delivery status updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update delivery status', { variant: 'error' });
    },
  });
};

export const useOrderStatistics = () => {
  return useQuery<OrderStatistics, Error>({
    queryKey: ['orderStatistics'],
    queryFn: async () => {
      try {
        return await getOrderStatisticsApi();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch order statistics', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useDeleteOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<OrderDetailResponse, Error, void>({
    mutationFn: () => updateOrderApi(orderId, { status: 'DELETED' as OrderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['orderStatistics'] });
      enqueueSnackbar('Order deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete order', { variant: 'error' });
    },
  });
};