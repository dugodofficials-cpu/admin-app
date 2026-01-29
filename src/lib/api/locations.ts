import { apiClient } from './client';
import {
  Country,
  State,
  CreateCountryDto,
  UpdateCountryDto,
  CreateStateDto,
  UpdateStateDto,
  LocationFilters,
  LocationListResponse
} from '@/components/locations/types';

export const getCountries = async (filters?: LocationFilters): Promise<LocationListResponse<Country>> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

  const queryString = params.toString();
  const url = queryString ? `/countries?${queryString}` : '/countries';

  return apiClient(url);
};

export const getCountryById = async (id: string): Promise<{ data: Country }> => {
  return apiClient(`/countries/${id}`);
};

export const createCountry = async (data: CreateCountryDto): Promise<{ data: Country }> => {
  return apiClient('/countries', {
    method: 'POST',
    body: data,
  });
};

export const updateCountry = async (id: string, data: UpdateCountryDto): Promise<{ data: Country }> => {
  return apiClient(`/countries/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteCountry = async (id: string): Promise<void> => {
  return apiClient(`/countries/${id}`, {
    method: 'DELETE',
  });
};

export const getStates = async (filters?: LocationFilters): Promise<LocationListResponse<State>> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters?.countryId) params.append('countryId', filters.countryId);

  const queryString = params.toString();
  const url = queryString ? `/states?${queryString}` : '/states';

  return apiClient(url);
};

export const getStateById = async (id: string): Promise<{ data: State }> => {
  return apiClient(`/states/${id}`);
};

export const createState = async (data: CreateStateDto): Promise<{ data: State }> => {
  return apiClient('/states', {
    method: 'POST',
    body: data,
  });
};

export const updateState = async (id: string, data: UpdateStateDto): Promise<{ data: State }> => {
  return apiClient(`/states/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteState = async (id: string): Promise<void> => {
  return apiClient(`/states/${id}`, {
    method: 'DELETE',
  });
};
