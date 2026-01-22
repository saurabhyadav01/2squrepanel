const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://93.127.172.171:5000/api";

// Debug: Log the API base URL (only in development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔗 API Base URL:", API_BASE_URL);
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Debug: Log the base URL being used
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log("🔗 ApiClient initialized with baseURL:", this.baseURL);
    }
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    } else if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Handle case where API returns { data: [...] } or direct array
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as T;
      }
      
      return data;
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Unable to connect to the server at ${this.baseURL}. Please check if the backend is running.`);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

