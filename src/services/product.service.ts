import { apiClient } from "@/lib/api-client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock_quantity: number;
  image_url: string | null;
  images: string[] | null;
  category: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  stockQuantity?: number;
  imageUrl?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  isActive?: boolean;
}

export const productService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.isActive !== undefined) params.append("isActive", String(filters.isActive));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.offset) params.append("offset", String(filters.offset));

    const query = params.toString();
    return apiClient.get<Product[]>(`/products${query ? `?${query}` : ""}`);
  },

  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async create(data: CreateProductData): Promise<Product> {
    return apiClient.post<Product>("/products", data);
  },

  async update(id: string, data: Partial<CreateProductData>): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/products/${id}`);
  },
};

