import { apiClient } from './client';
import { Product } from './products';

export interface Item {
  product: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
  notes?: string;
}

export interface AddToCartParams {
  item: Item;
}

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKOUT_IN_PROGRESS = 'CHECKOUT_IN_PROGRESS',
  CONVERTED_TO_ORDER = 'CONVERTED_TO_ORDER',
  ABANDONED = 'ABANDONED',
  EXPIRED = 'EXPIRED',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  total: number;
  selectedOptions?: Record<string, string>;
  notes?: string;
  addedAt: Date;
  updatedAt?: Date;
}

export interface AppliedDiscount {
  code: string;
  type: DiscountType;
  value: number;
  description: string;
  appliedAt: Date;
  expiresAt?: Date;
  minimumPurchase?: number;
  maximumDiscount?: number;
  metadata?: Record<string, string>;
}

export interface ShippingEstimate {
  provider: string;
  method: string;
  cost: number;
  estimatedDays: number;
  isAvailable: boolean;
  restrictions?: string[];
}

export interface Cart {
  _id: string;

  items: CartItem[];
  itemCount: number;

  subtotal: number;
  tax: number;
  shippingCost: number;
  discounts: AppliedDiscount[];
  total: number;

  status: CartStatus;

  shippingEstimates?: ShippingEstimate[];
  selectedShippingMethod?: string;

  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;

  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  expiresAt?: Date;

  notes?: string;
  metadata?: Record<string, string>;

  isEmpty(): boolean;
  hasDigitalItems(): boolean;
  hasPhysicalItems(): boolean;
  requiresShipping(): boolean;
  isEligibleForDiscount(minimumPurchase: number): boolean;
  getTotalWeight(): number;
  getItemById(productId: string): CartItem | undefined;
}

export interface CartItemResponse {
  data: Cart;
  message: string;
}

export const addToCart = async (params: AddToCartParams): Promise<Cart> => {
  return apiClient<Cart>(`cart/add`, {
    method: 'POST',
    body: params,
  });
};

export const removeFromCart = async (
  productId: string,
  cartId: string,
  selectedOptions?: Record<string, string>
): Promise<Cart> => {
  return apiClient<Cart>(`cart/${cartId}/remove/${productId}`, {
    method: 'PUT',
    body: { selectedOptions },
  });
};

export const getCart = async (): Promise<CartItemResponse> => {
  return apiClient<CartItemResponse>(`cart/active`, {
    method: 'GET',
  });
};

export const updateCartStatus = async (
  cartId: string,
  status: CartStatus
): Promise<CartItemResponse> => {
  return apiClient<CartItemResponse>(`cart/${cartId}`, {
    method: 'PUT',
    body: { status },
  });
};

export const applyCouponCode = async (code: string, cartId: string): Promise<CartItemResponse> => {
  return apiClient<CartItemResponse>(`cart/${cartId}/discounts`, {
    method: 'POST',
    body: { code },
  });
};
