import { apiClient } from "@/lib/api-client";

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Authentication Service
 * 
 * Handles authentication operations including login, logout, and
 * retrieving current user information from the backend API.
 */
export const authService = {
  /**
   * Login user with email and password
   * 
   * @param data - Login credentials (email and password)
   * @returns Authentication response with user data and JWT token
   * @throws Error if login fails (invalid credentials, network error, etc.)
   * 
   * Automatically stores the JWT token in localStorage for subsequent requests.
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", data);
      // Store token for authenticated requests
      if (response && response.token) {
        apiClient.setToken(response.token);
      }
      return response;
    } catch (error: any) {
      // Re-throw with more context if needed
      throw new Error(error.message || "Login failed. Please check your credentials.");
    }
  },

  /**
   * Get current authenticated user's information
   * 
   * @returns Current user object
   * @throws Error if not authenticated or user not found
   * 
   * Requires valid JWT token in localStorage.
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>("/auth/me");
    } catch (error: any) {
      // Clear token if request fails (token might be invalid)
      if (error.message?.includes("401") || error.message?.includes("Invalid")) {
        this.logout();
      }
      throw error;
    }
  },

  /**
   * Logout current user
   * 
   * Clears the JWT token from localStorage and API client.
   */
  logout() {
    apiClient.setToken(null);
    // Clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },
};

