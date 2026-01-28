/**
 * Inventory Management Page
 * 
 * Comprehensive inventory management with stock alerts, bulk updates,
 * and real-time stock level monitoring for e-commerce operations.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productService } from "@/services/product.service";
import { Search, AlertTriangle, Package, TrendingDown, TrendingUp, RefreshCw, Download, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatInr } from "@/lib/priceUtils";

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const queryClient = useQueryClient();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
  });

  // Filter products based on search and stock level
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (stockFilter === "out-of-stock") return product.stock_quantity === 0;
    if (stockFilter === "low-stock") return product.stock_quantity > 0 && product.stock_quantity < 10;
    if (stockFilter === "in-stock") return product.stock_quantity >= 10;
    
    return true;
  }) || [];

  const lowStockProducts = filteredProducts.filter((p) => p.stock_quantity > 0 && p.stock_quantity < 10);
  const outOfStockProducts = filteredProducts.filter((p) => p.stock_quantity === 0);
  const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">Monitor and manage product stock levels in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold mt-1">{filteredProducts.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-shadow border-red-200 dark:border-red-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">{outOfStockProducts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-shadow border-yellow-200 dark:border-yellow-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">{lowStockProducts.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-shadow border-green-200 dark:border-green-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">{formatInr(totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search products by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as StockFilter)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in-stock">In Stock (≥10)</SelectItem>
                <SelectItem value="low-stock">Low Stock (1-9)</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const stockStatus = product.stock_quantity === 0 
              ? { label: "Out of Stock", color: "destructive", bgColor: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900" }
              : product.stock_quantity < 10
              ? { label: "Low Stock", color: "default", bgColor: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900" }
              : { label: "In Stock", color: "default", bgColor: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" };

            return (
              <Card key={product.id} className={`border-2 hover:shadow-lg transition-all duration-300 ${stockStatus.bgColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <Badge variant={stockStatus.color as any}>{stockStatus.label}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>SKU: {product.sku || "N/A"}</span>
                          {product.category && <span>Category: {product.category}</span>}
                          <span>Price: {formatInr(product.price)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${
                          product.stock_quantity === 0
                            ? "text-red-600 dark:text-red-400"
                            : product.stock_quantity < 10
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                        }`}>
                          {product.stock_quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">units in stock</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Value: {formatInr(product.price * product.stock_quantity)}
                        </p>
                      </div>
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2" size={16} />
                          Update
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && !isLoading && (
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground text-lg font-semibold mb-2">No products found</p>
            {search && (
              <p className="text-sm text-muted-foreground mb-4">
                No products match your search "{search}"
              </p>
            )}
            <Link href="/products/new">
              <Button>
                <Package className="mr-2" size={20} />
                Add New Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

