import { apiClient } from "@/lib/api-client";

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>("/users");
  },

  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },
};

