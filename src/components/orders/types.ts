export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

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

export enum Carriers {
  DHL = 'DHL',
  SPEEDAF = 'SPEEDAF',
  GIG = 'GIG',
  CUSTOM = 'CUSTOM',
}

export interface ShippingDetails {
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  deliveryStatus: DeliveryStatus;
  trackingNumber?: string;
  carrier?: Carriers;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryNotes?: string;
}

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
  total: number;
  selectedOptions?: string[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingDetails: ShippingDetails;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface OrderDetailResponse {
  data: Order;
  message: string;
}

export interface GetOrdersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
