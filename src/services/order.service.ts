import { apiClient } from "@/lib/api-client";

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  billing_address: any;
  payment_status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

export interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders");
  },

  async getById(id: string): Promise<OrderWithItems> {
    return apiClient.get<OrderWithItems>(`/orders/${id}`);
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}/status`, { status });
  },
};

