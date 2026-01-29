import { GetOrdersQueryDto, OrderResponse as ComponentOrderResponse, Order as ComponentOrder, OrderDetailResponse, PaymentStatus } from '@/components/orders/types';
import { apiClient } from './client';
import { Product, ProductType } from './products';
import { AxiosResponse } from 'axios';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingDetails {
  address: Address;
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryStatus: DeliveryStatus;
  deliveryNotes?: string;
}

export interface DigitalDeliveryDetails {
  email: string;
  downloadLinks: string[];
  accessKeys: string[];
  expiryDate?: Date;
  downloadCount: number;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
  total: number;
  selectedOptions?: string[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];

  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;

  status: OrderStatus;
  paymentStatus: string;

  shippingDetails?: ShippingDetails;
  digitalDeliveryDetails?: DigitalDeliveryDetails;

  orderedAt: Date;
  processedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;

  notes?: string;
  isGift?: boolean;
  giftMessage?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type { ComponentOrderResponse as OrderResponse };

export interface UserOrdersResponse {
  data: ComponentOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  totalCustomers: number;
  totalRefunds: number;
  totalPendingOrders: number;
}

export const getOrderStatistics = async (): Promise<OrderStatistics> => {
  const response = await apiClient<AxiosResponse<OrderStatistics>>('/orders/statistics', {
    method: 'GET',
  });
  return response.data;
};

export const createOrder = async (params: Partial<ComponentOrder>): Promise<ComponentOrder> => {
  const response = await apiClient<{ data: ComponentOrder; message: string }>(`orders`, {
    method: 'POST',
    body: params,
  });
  return response.data;
};

export const getOrder = async (params: GetOrdersQueryDto): Promise<ComponentOrderResponse> => {
  const buildQueryString = (params: GetOrdersQueryDto) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
    if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());
    if (params.minTotal) queryParams.append('minTotal', params.minTotal.toString());
    if (params.maxTotal) queryParams.append('maxTotal', params.maxTotal.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  };

  return apiClient<ComponentOrderResponse>(`orders${buildQueryString(params)}`, {
    method: 'GET',
  });
};

export const getUserOrders = async (
  userId: string,
  params: {
    page?: number;
    limit?: number;
    type?: ProductType;
  }
): Promise<ComponentOrder[]> => {
  const response = await apiClient<UserOrdersResponse>(
    `orders/user/${userId}?page=${params.page}&limit=${params.limit}&type=${params.type}`,
    {
      method: 'GET',
    }
  );
  return response.data;
};

export const getOrderDetail = async (orderId: string): Promise<OrderDetailResponse> => {
  return apiClient<OrderDetailResponse>(`orders/${orderId}`, {
    method: 'GET',
  });
};

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
}

export const updateOrder = async (orderId: string, data: UpdateOrderDto): Promise<OrderDetailResponse> => {
  return apiClient<OrderDetailResponse>(`orders/${orderId}/status`, {
    method: 'PATCH',
    body: data,
  });
};

export interface UpdateDeliveryStatusDto {
  deliveryStatus: DeliveryStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDeliveryDate?: Date;
  deliveryNotes?: string;
}

export const updateDeliveryStatus = async (orderId: string, data: UpdateDeliveryStatusDto): Promise<OrderDetailResponse> => {
  return apiClient<OrderDetailResponse>(`orders/${orderId}/delivery`, {
    method: 'PATCH',
    body: data,
  });
};

export const resendOrderConfirmation = async (orderId: string): Promise<OrderDetailResponse> => {
  return apiClient<OrderDetailResponse>(`orders/${orderId}/resend-confirmation`, {
    method: 'POST',
  });
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  return apiClient<void>(`orders/${orderId}`, {
    method: 'DELETE',
  });
};