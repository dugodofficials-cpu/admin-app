export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  minimumPurchase?: number;
  maximumDiscount?: number;
  usageLimit?: number;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {
  _id: string;
}