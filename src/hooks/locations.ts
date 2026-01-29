import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  getStates,
  getStateById,
  createState,
  updateState,
  deleteState,
} from '@/lib/api/locations';
import { LocationFilters, CreateCountryDto, UpdateCountryDto, CreateStateDto, UpdateStateDto } from '@/components/locations/types';
import { enqueueSnackbar } from 'notistack';

export const useCountries = (filters?: LocationFilters) => {
  return useQuery({
    queryKey: ['countries', filters],
    queryFn: async () => {
      try {
        return await getCountries(filters);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch countries', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useCountryById = (id: string) => {
  return useQuery({
    queryKey: ['country', id],
    queryFn: async () => {
      try {
        return await getCountryById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch country', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateCountry = (redirectUrl?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCountryDto) => createCountry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      enqueueSnackbar('Country created successfully', { variant: 'success' });
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to create country', { variant: 'error' });
    },
  });
};

export const useUpdateCountry = (redirectUrl?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCountryDto }) =>
      updateCountry(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['country', variables.id] });
      enqueueSnackbar('Country updated successfully', { variant: 'success' });
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to update country', {
        variant: 'error',
      });
    },
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCountry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      enqueueSnackbar('Country deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to delete country', { variant: 'error' });
    },
  });
};

export const useStates = (filters?: LocationFilters) => {
  return useQuery({
    queryKey: ['states', filters],
    queryFn: async () => {
      try {
        return await getStates(filters);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch states', { variant: 'error' });
        throw error;
      }
    },
  });
};

export const useStateById = (id: string) => {
  return useQuery({
    queryKey: ['state', id],
    queryFn: async () => {
      try {
        return await getStateById(id);
      } catch (error) {
        enqueueSnackbar((error as Error).message || 'Failed to fetch state', { variant: 'error' });
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useCreateState = (redirectUrl?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStateDto) => createState(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
      enqueueSnackbar('State created successfully', { variant: 'success' });
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to create state', { variant: 'error' });
    },
  });
};

export const useUpdateState = (redirectUrl?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStateDto }) =>
      updateState(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
      queryClient.invalidateQueries({ queryKey: ['state', variables.id] });
      enqueueSnackbar('State updated successfully', { variant: 'success' });
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to update state', {
        variant: 'error',
      });
    },
  });
};

export const useDeleteState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteState(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states'] });
      enqueueSnackbar('State deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error?.message || 'Failed to delete state', { variant: 'error' });
    },
  });
};
