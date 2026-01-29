export interface Country {
  _id: string;
  name: string;
  code: string;
  phoneCode: string;
  currency: string;
  region: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
  countryName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryDto {
  name: string;
  code: string;
  phoneCode: string;
  currency: string;
  region: string[];
  isActive: boolean;
}

export interface UpdateCountryDto {
  name?: string;
  code?: string;
  phoneCode?: string;
  currency?: string;
  region?: string[];
  isActive?: boolean;
}

export interface CreateStateDto {
  name: string;
  code: string;
  countryId: string;
}

export interface UpdateStateDto extends Partial<CreateStateDto> {
  id: string;
}

export interface LocationFilters {
  search?: string;
  isActive?: boolean;
  countryId?: string;
}

export interface LocationListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
