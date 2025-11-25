"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/services/product.service";
import { Plus, Edit, Trash2, Grid, List, Package, Filter, Download, MoreVertical, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getProductImageUrl } from "@/lib/image-utils";
import { formatInr } from "@/lib/priceUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewMode = "grid" | "list";
type FilterStatus = "all" | "active" | "inactive" | "low-stock";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", { search }],
    queryFn: () => {
      const filters: { search?: string } = {};
      if (search) {
        filters.search = search;
      }
      return productService.getAll(filters);
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      setSelectedProducts([]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => productService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete products");
    },
  });

  // Get unique categories
  const categories = Array.from(new Set(products?.map((p: any) => p.category).filter(Boolean) || []));

  // Filter products
  const filteredProducts = products?.filter((product: any) => {
    if (statusFilter === "active" && !product.is_active) return false;
    if (statusFilter === "inactive" && product.is_active) return false;
    if (statusFilter === "low-stock" && product.stock_quantity >= 10) return false;
    if (categoryFilter !== "all" && product.category !== categoryFilter) return false;
    return true;
  }) || [];

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p: any) => p.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      bulkDeleteMutation.mutate(selectedProducts);
    }
  };

  const handleExport = () => {
    // Mock export functionality
    toast.info("Export functionality coming soon!");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Link href="/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2" size={20} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters and Actions Bar */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchInput
                placeholder="Search products by name, SKU, or category..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            {categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* View Mode Toggle */}
            <div className="flex gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""} selected
                </span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProducts([])}>
                  Clear
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2" size={16} />
                  Export
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending}>
                  <Trash2 className="mr-2" size={16} />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-destructive font-semibold mb-2">Error loading products</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : "Failed to fetch products. Please check your connection and try again."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Package size={16} />
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </div>
              {filteredProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Select all</span>
                </div>
              )}
            </div>
          )}
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product: any) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                      className="bg-background/90 backdrop-blur-sm"
                    />
                  </div>

                  <CardHeader className="pb-3">
                    <div className="aspect-square w-full bg-muted rounded-lg mb-4 overflow-hidden relative">
                      <img
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      {product.compare_at_price && (
                        <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                          Sale
                        </Badge>
                      )}
                      <Badge className={`absolute top-2 left-2 ${
                        product.is_active 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
                    {product.category && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.category}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{formatInr(product.price || 0)}</p>
                        {product.compare_at_price && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatInr(product.compare_at_price || 0)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Stock: <span className={`font-semibold ${
                            product.stock_quantity > 10 
                              ? "text-green-600 dark:text-green-400" 
                              : product.stock_quantity > 0 
                              ? "text-yellow-600 dark:text-yellow-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {product.stock_quantity}
                          </span>
                        </span>
                        {product.sku && (
                          <span className="text-muted-foreground text-xs">
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="mr-2" size={16} />
                          Edit
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}`} className="flex items-center">
                              <Eye className="mr-2" size={16} />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this product?")) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2" size={16} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product: any) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="flex gap-6 p-6">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </div>
                    <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                          {product.category && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {product.category}
                            </p>
                          )}
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <Badge className={`${
                          product.is_active 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }`}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xl font-bold">{formatInr(product.price || 0)}</p>
                            {product.compare_at_price && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatInr(product.compare_at_price || 0)}
                              </p>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Stock: </span>
                            <span className={`font-semibold ${
                              product.stock_quantity > 10 
                                ? "text-green-600 dark:text-green-400" 
                                : product.stock_quantity > 0 
                                ? "text-yellow-600 dark:text-yellow-400" 
                                : "text-red-600 dark:text-red-400"
                            }`}>
                              {product.stock_quantity}
                            </span>
                          </div>
                          {product.sku && (
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="outline">
                              <Edit className="mr-2" size={16} />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this product?")) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && !isLoading && !error && (
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground mb-4 text-lg font-semibold">No products found</p>
            {search && (
              <p className="text-sm text-muted-foreground mb-4">
                No products match your search "{search}"
              </p>
            )}
            <Link href="/products/new">
              <Button>
                <Plus className="mr-2" size={20} />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
