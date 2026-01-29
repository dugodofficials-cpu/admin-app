import { Country } from '../locations/types';

export interface ShippingZone {
  _id: string;
  name: string;
  description?: string;
  countries: Country[];
  regions?: string[];
  postalCodes?: string[];
  rate: number;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface CreateShippingZoneDto {
  name: string;
  description?: string;
  countries: string[];
  regions?: string[];
  postalCodes?: string[];
  rate: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateShippingZoneDto extends Partial<CreateShippingZoneDto> {
  id: string;
}

export interface ShippingZoneFilters {
  search?: string;
  isActive?: boolean;
  country?: string;
  region?: string;
}

export interface ShippingZoneListResponse {
  data: ShippingZone[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ShippingZoneFilters {
  search?: string;
  isActive?: boolean;
  country?: string;
  region?: string;
}

export interface ShippingZoneListResponse {
  data: ShippingZone[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
