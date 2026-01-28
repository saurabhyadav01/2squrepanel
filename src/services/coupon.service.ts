import { apiClient } from "@/lib/api-client";

export interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCouponData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil: string;
  isActive?: boolean;
}

export const couponService = {
  async getAll(): Promise<Coupon[]> {
    return apiClient.get<Coupon[]>("/coupons");
  },

  async getById(id: string): Promise<Coupon> {
    return apiClient.get<Coupon>(`/coupons/${id}`);
  },

  async create(data: CreateCouponData): Promise<Coupon> {
    return apiClient.post<Coupon>("/coupons", data);
  },

  async update(id: string, data: Partial<CreateCouponData>): Promise<Coupon> {
    return apiClient.put<Coupon>(`/coupons/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/coupons/${id}`);
  },

  async validate(code: string, orderAmount: number) {
    return apiClient.post<{
      valid: boolean;
      discount: number;
      message?: string;
    }>("/coupons/validate", { code, orderAmount });
  },
};

