/**
 * Product Service
 * 
 * Frontend service for interacting with product-related API endpoints.
 * Provides type-safe methods for CRUD operations on products.
 * All methods use the centralized apiClient for HTTP requests.
 */

import { apiClient } from "@/lib/api-client";

/**
 * Product interface matching backend response
 * Represents a product object returned from the API
 */
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

/**
 * Product filters for querying products
 * Used to filter, search, and paginate product listings
 */
export interface ProductFilters {
  category?: string;        // Filter by category name
  isActive?: boolean;      // Filter by active status
  search?: string;         // Search in name and description
  limit?: number;         // Maximum number of results
  offset?: number;        // Pagination offset
}

/**
 * Data structure for creating a new product
 * All fields except name and price are optional
 */
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

/**
 * Product Service Object
 * Contains all product-related API methods
 */
export const productService = {
  /**
   * Get all products with optional filters
   * 
   * @param filters - Optional filters for category, active status, search, pagination
   * @returns Promise resolving to array of products
   * 
   * Builds query string from filters and makes GET request to /products endpoint.
   * Supports filtering, searching, and pagination.
   */
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    // Add each filter to query string if provided
    if (filters?.category) params.append("category", filters.category);
    if (filters?.isActive !== undefined) params.append("isActive", String(filters.isActive));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.offset) params.append("offset", String(filters.offset));

    const query = params.toString();
    // Append query string to endpoint if filters are provided
    return apiClient.get<Product[]>(`/products${query ? `?${query}` : ""}`);
  },

  /**
   * Get a single product by ID
   * 
   * @param id - Product UUID
   * @returns Promise resolving to product object
   */
  async getById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Create a new product
   * 
   * @param data - Product data to create
   * @returns Promise resolving to created product object
   * 
   * Requires admin authentication. Sends POST request to /products endpoint.
   */
  async create(data: CreateProductData): Promise<Product> {
    return apiClient.post<Product>("/products", data);
  },

  /**
   * Update an existing product
   * 
   * @param id - Product UUID to update
   * @param data - Partial product data (only provided fields will be updated)
   * @returns Promise resolving to updated product object
   * 
   * Requires admin authentication. Supports partial updates.
   */
  async update(id: string, data: Partial<CreateProductData>): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  /**
   * Delete a product
   * 
   * @param id - Product UUID to delete
   * @returns Promise resolving to void
   * 
   * Requires admin authentication. Permanently removes product from database.
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/products/${id}`);
  },
};

