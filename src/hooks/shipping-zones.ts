import {
  CreateShippingZoneDto,
  ShippingZoneFilters,
  UpdateShippingZoneDto,
} from '@/components/shipping-zones/types';
import {
  createShippingZone,
  deleteShippingZone,
  getShippingZoneById,
  getShippingZones,
  updateShippingZone,
} from '@/lib/api/shipping-zones';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

export const useShippingZones = (filters?: ShippingZoneFilters) => {
  return useQuery({
    queryKey: ['shipping-zones', filters],
    queryFn: async () => {
      try {
        return await getShippingZones(filters);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch shipping zones', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useShippingZoneById = (id: string) => {
  return useQuery({
    queryKey: ['shipping-zone', id],
    queryFn: async () => {
      try {
        return await getShippingZoneById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch shipping zone', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateShippingZone = (redirectUrl?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShippingZoneDto) => createShippingZone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      enqueueSnackbar('Shipping zone created successfully', { variant: 'success' });
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to create shipping zone', { variant: 'error' });
    },
  });
};

export const useUpdateShippingZone = (redirectUrl?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShippingZoneDto }) =>
      updateShippingZone(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-zone', variables.id] });
      enqueueSnackbar('Shipping zone updated successfully', { variant: 'success' });
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to update shipping zone', {
        variant: 'error',
      });
    },
  });
};

export const useDeleteShippingZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShippingZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-zones'] });
      enqueueSnackbar('Shipping zone deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to delete shipping zone', { variant: 'error' });
    },
  });
};
