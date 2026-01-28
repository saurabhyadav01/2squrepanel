/**
 * API Client
 * 
 * Centralized HTTP client for making requests to the backend API.
 * Handles authentication tokens, error handling, and response parsing.
 * Automatically includes JWT tokens from localStorage for authenticated requests.
 */

// Get API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Debug: Log the API base URL (only in development mode)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔗 API Base URL:", API_BASE_URL);
}

/**
 * ApiClient Class
 * 
 * Wraps the Fetch API with additional features:
 * - Automatic JWT token management
 * - Consistent error handling
 * - Response data normalization
 * - Network error detection
 */
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  /**
   * Initialize API client with base URL
   * 
   * @param baseURL - Base URL for all API requests
   */
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Debug: Log the base URL being used (development only)
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log("🔗 ApiClient initialized with baseURL:", this.baseURL);
    }
    // Load authentication token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  /**
   * Set or clear authentication token
   * 
   * @param token - JWT token string or null to clear
   * 
   * Updates the token used for authenticated requests and persists
   * it to localStorage for future page loads.
   */
  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    } else if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  /**
   * Internal method to make HTTP requests
   * 
   * @param endpoint - API endpoint path (e.g., "/products")
   * @param options - Fetch API options (method, body, headers, etc.)
   * @returns Promise resolving to response data
   * @throws Error if request fails or network error occurs
   * 
   * Handles:
   * - Adding Authorization header with JWT token
   * - Parsing JSON responses
   * - Normalizing response format (handles { data: [...] } or direct arrays)
   * - Converting HTTP errors to Error objects
   * - Detecting network connectivity issues
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    // Add JWT token to Authorization header if available
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle HTTP error status codes
      if (!response.ok) {
        // Try to parse error response, fallback to status text
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Handle case where API returns { data: [...] } or direct array/object
      // Normalize response format for consistent handling
      if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
        return data.data as T;
      }
      
      return data;
    } catch (error: any) {
      // Handle network errors (server unreachable, CORS issues, etc.)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Unable to connect to the server at ${this.baseURL}. Please check if the backend is running.`);
      }
      throw error;
    }
  }

  /**
   * GET request
   * 
   * @param endpoint - API endpoint path
   * @returns Promise resolving to response data
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body data (will be JSON stringified)
   * @returns Promise resolving to response data
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   * 
   * @param endpoint - API endpoint path
   * @param data - Request body data (will be JSON stringified)
   * @returns Promise resolving to response data
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   * 
   * @param endpoint - API endpoint path
   * @returns Promise resolving to response data
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance for use throughout the application
export const apiClient = new ApiClient(API_BASE_URL);

