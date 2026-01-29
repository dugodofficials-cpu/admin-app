import { apiClient } from './client';
import { ShippingZone, CreateShippingZoneDto, UpdateShippingZoneDto, ShippingZoneFilters, ShippingZoneListResponse } from '@/components/shipping-zones/types';

export const getShippingZones = async (filters?: ShippingZoneFilters): Promise<ShippingZoneListResponse> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters?.country) params.append('country', filters.country);
  if (filters?.region) params.append('region', filters.region);

  const queryString = params.toString();
  const url = queryString ? `/shipping/zones?${queryString}` : '/shipping/zones';

  return apiClient(url);
};

export const getShippingZoneById = async (id: string): Promise<{ data: ShippingZone }> => {
  return apiClient(`/shipping-zones/${id}`);
};

export const createShippingZone = async (data: CreateShippingZoneDto): Promise<{ data: ShippingZone }> => {
  return apiClient('/shipping/zones', {
    method: 'POST',
    body: data,
  });
};

export const updateShippingZone = async (id: string, data: UpdateShippingZoneDto): Promise<{ data: ShippingZone }> => {
  return apiClient(`/shipping/zones/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteShippingZone = async (id: string): Promise<void> => {
  return apiClient(`/shipping/zones/${id}`, {
    method: 'DELETE',
  });
};
