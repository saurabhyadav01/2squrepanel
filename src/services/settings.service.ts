import { apiClient } from "@/lib/api-client";

export interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const settingsService = {
  async getAll(): Promise<Setting[]> {
    return apiClient.get<Setting[]>("/settings");
  },

  async get(key: string): Promise<any> {
    const result = await apiClient.get<{ key: string; value: any }>(`/settings/${key}`);
    return result.value;
  },

  async set(key: string, value: any, description?: string): Promise<Setting> {
    return apiClient.put<Setting>(`/settings/${key}`, { value, description });
  },

  async delete(key: string): Promise<void> {
    return apiClient.delete(`/settings/${key}`);
  },
};

