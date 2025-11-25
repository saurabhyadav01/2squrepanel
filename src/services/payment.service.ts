import { apiClient } from "@/lib/api-client";

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_intent_id: string | null;
  status: string;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    return apiClient.get<Payment[]>("/admin/payments");
  },

  async getById(id: string): Promise<Payment> {
    return apiClient.get<Payment>(`/admin/payments/${id}`);
  },

  async getByOrder(orderId: string): Promise<Payment[]> {
    return apiClient.get<Payment[]>(`/admin/payments/order/${orderId}`);
  },
};

