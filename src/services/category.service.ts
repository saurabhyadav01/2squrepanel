import { apiClient } from "@/lib/api-client";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories");
  },

  async getById(id: string): Promise<Category> {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async create(data: CreateCategoryData): Promise<Category> {
    return apiClient.post<Category>("/categories", data);
  },

  async update(id: string, data: Partial<CreateCategoryData>): Promise<Category> {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/categories/${id}`);
  },
};

