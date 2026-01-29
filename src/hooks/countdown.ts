import {
  CountdownQueryParams,
  CreateCountdownData,
} from '@/components/countdown/types';
import { countdownApi } from '@/lib/api/countdown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

export const countdownKeys = {
  all: ['countdowns'] as const,
  active: ['activeCountdown'] as const,
  lists: () => [...countdownKeys.all, 'list'] as const,
  list: (params?: CountdownQueryParams) => [...countdownKeys.lists(), params] as const,
  details: () => [...countdownKeys.all, 'detail'] as const,
  detail: (id: string) => [...countdownKeys.details(), id] as const,
};

export const useCountdowns = (params?: CountdownQueryParams) => {
  return useQuery({
    queryKey: countdownKeys.list(params),
    queryFn: async () => {
      try {
        return await countdownApi.getCountdowns(params);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch countdowns', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useActiveCountdown = () => {
  return useQuery({
    queryKey: countdownKeys.active,
    queryFn: async () => {
      try {
        return await countdownApi.getActiveCountdown();
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch active countdown', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useCountdown = (id: string) => {
  return useQuery({
    queryKey: countdownKeys.detail(id),
    queryFn: async () => {
      try {
        return await countdownApi.getCountdown(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch countdown', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateCountdown = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCountdownData) => countdownApi.createCountdown(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countdownKeys.lists() });
      queryClient.invalidateQueries({ queryKey: countdownKeys.active });
      enqueueSnackbar('Countdown created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to create countdown', { variant: 'error' });
    },
  });
};

export const useUpdateCountdown = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCountdownData }) =>
      countdownApi.updateCountdown(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: countdownKeys.lists() });
      queryClient.invalidateQueries({ queryKey: countdownKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: countdownKeys.active });
      enqueueSnackbar('Countdown updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to update countdown', { variant: 'error' });
    },
  });
};

export const useDeleteCountdown = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => countdownApi.deleteCountdown(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countdownKeys.lists() });
      queryClient.invalidateQueries({ queryKey: countdownKeys.active });
      enqueueSnackbar('Countdown deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to delete countdown', { variant: 'error' });
    },
  });
};

