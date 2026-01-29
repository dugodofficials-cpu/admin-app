import { Coupon, CreateCouponInput, UpdateCouponInput } from "@/components/coupons/types";
import { apiClient } from "./client";

export async function getCoupons() {
  return apiClient<{ data: Coupon[] }>("coupons");
}

export async function getCouponById(id: string) {
  return apiClient<Coupon>(`coupons/${id}`);
}

export async function createCoupon(data: CreateCouponInput) {
  return apiClient<Coupon>("coupons", {
    method: "POST",
    body: data,
  });
}

export async function updateCoupon({ _id, ...data }: UpdateCouponInput) {
  return apiClient<Coupon>(`coupons/${_id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteCoupon(id: string) {
  return apiClient<void>(`coupons/${id}`, {
    method: "DELETE",
  });
} 