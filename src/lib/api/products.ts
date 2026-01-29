import { apiClient } from './client';

export enum ProductType {
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL',
  BUNDLE = 'BUNDLE',
  EBOOK = 'EBOOK',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: string;
}

export interface DigitalDeliveryInfo {
  accessKey: string;
  fileSize: number;
  downloadUrl: string;
  expiryDays: number;
  maxDownloads: number;
}

export interface EbookDeliveryInfo {
  downloadUrl?: string;
  bookCoverArt?: string;
  accessKey?: string;
  expiryDays?: number;
  maxDownloads?: number;
}

export interface BundleItem {
  productId: string;
  quantity: number;
  title: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ProductType;
  status?: ProductStatus;
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  exclude?: string;
  includeBundleItems?: boolean;
}

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface Product {
  _id: string;
  name: string;
  album: string;
  albumId: { id: string; title: string, description: string, imageUrl: string } | null;
  albumPrice: number;
  color: string;
  description: string;
  sku: string;
  price: number;
  type: ProductType;
  status: ProductStatus;
  categories: string[];
  tags: string[];
  images: string[];
  sizes: ProductSize[];
  order: number;
  dimensions?: ProductDimensions;
  stockQuantity?: number;
  lowStockThreshold?: number;

  digitalDeliveryInfo?: DigitalDeliveryInfo;
  ebookDeliveryInfo?: EbookDeliveryInfo;

  bundleItems?: BundleItem[];
  bundlePrice?: number;
  isCustomizable?: boolean;
  minItems?: number;
  maxItems?: number;
  bundleTier?: string;

  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  trackList?: string;
  duration?: string;
  buttonText?: string;
  albumImage?: string;
}

export interface ProductById {
  data: Product;
  message: string;
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedDigitalProducts {
  data: {
    album: string;
    albumPrice: number;
    totalTracks: number;
    coverImage: string;
    products: Product[];
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedAlbumProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProductDto {
  name: string;

  order: number;

  album: string;

  albumPrice: number;

  duration: string;

  description: string;

  sku: string;

  price: number;

  type: ProductType;

  status: ProductStatus;

  categories: string[];

  tags?: string[];

  images: string[];

  dimensions?: ProductDimensions;

  sizes?: string[];

  color: string;

  stockQuantity?: number;

  lowStockThreshold?: number;

  digitalDeliveryInfo?: DigitalDeliveryInfo;

  bundleItems?: BundleItem[];
  bundlePrice?: number;
  isCustomizable?: boolean;
  minItems?: number;
  maxItems?: number;
  bundleTier?: string;
  isActive?: boolean;
}

export const getDigitalAlbums = async (
  params: ProductsQueryParams = {}
): Promise<PaginatedDigitalProducts> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  return apiClient<PaginatedDigitalProducts>(`products/digital/albums?${queryParams.toString()}`);
};

export const getProducts = async (
  params: ProductsQueryParams = {}
): Promise<PaginatedProducts> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  if (params.exclude) {
    queryParams.append('exclude', params.exclude);
  }

  return apiClient<PaginatedProducts>(`products?${queryParams.toString()}`);
};


export const getProductsByAlbum = (albumName: string) => {
  return apiClient<PaginatedAlbumProducts>(`/products/album/${albumName}`);
};

export const getProductById = (id: string): Promise<ProductById> => {
  return apiClient<ProductById>(`/products/${id}`);
};

export const createProduct = (data: CreateProductDto) => {
  return apiClient<ProductById>(`/products`, {
    headers: {
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
    },
    method: 'POST',
    body: data,
  });
};

export const updateProduct = (id: string, data: Partial<CreateProductDto>) => {
  return apiClient<ProductById>(`/products/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const deleteProduct = (id: string) => {
  return apiClient<ProductById>(`/products/${id}`, {
    method: 'DELETE'
  });
};

export interface AlbumCover {
  id: string;
  imageUrl: string;
  description: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlbumCoverResponse {
  data: AlbumCover[];
  message: string;

}

export const uploadAlbumCover = (data: FormData) => {
  return apiClient<AlbumCover>(`/album-cover`, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    body: data,
  });
};

export const getAlbumCovers = () => {
  return apiClient<AlbumCoverResponse>(`/album-cover`);
};

export const deleteAlbumCover = (id: string) => {
  return apiClient<AlbumCoverResponse>(`/album-cover/${id}`, {
    method: 'DELETE',
  });
};

export const updateAlbumCover = (id: string, data: Partial<AlbumCover>) => {
  return apiClient<AlbumCoverResponse>(`/album-cover/${id}`, {
    method: 'PUT',
    body: data,
  });
};