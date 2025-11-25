"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { productService } from "@/services/product.service";
import { Search, AlertTriangle, Package } from "lucide-react";
import { useState } from "react";

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
  });

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockProducts = filteredProducts?.filter((p) => p.stock_quantity < 10) || [];
  const outOfStockProducts = filteredProducts?.filter((p) => p.stock_quantity === 0) || [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">Monitor and manage product stock levels</p>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {outOfStockProducts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-600" size={24} />
                <div>
                  <p className="font-semibold text-red-900">Out of Stock</p>
                  <p className="text-sm text-red-700">{outOfStockProducts.length} products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {lowStockProducts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-600" size={24} />
                <div>
                  <p className="font-semibold text-yellow-900">Low Stock</p>
                  <p className="text-sm text-yellow-700">{lowStockProducts.length} products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-4">
          {filteredProducts?.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        product.stock_quantity === 0
                          ? "text-red-600"
                          : product.stock_quantity < 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {product.stock_quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">in stock</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
}

