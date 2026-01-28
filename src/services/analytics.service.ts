import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: any[];
  topProducts: any[];
}

export interface RevenueData {
  month: string;
  revenue: number | string;
}

export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>("/analytics/dashboard");
  },

  async getRevenue(startDate?: string, endDate?: string): Promise<RevenueData[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const query = params.toString();
    return apiClient.get<RevenueData[]>(`/analytics/revenue${query ? `?${query}` : ""}`);
  },

  async getSalesReport(startDate?: string, endDate?: string): Promise<SalesReport> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const query = params.toString();
    return apiClient.get<SalesReport>(`/analytics/sales${query ? `?${query}` : ""}`);
  },
};

