"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { productService } from "@/services/product.service";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    sku: "",
    stockQuantity: "",
    imageUrl: "",
    category: "",
    tags: "",
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      router.push("/products");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    
    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      sku: formData.sku || undefined,
      stockQuantity: parseInt(formData.stockQuantity) || 0,
      imageUrl: formData.imageUrl || undefined,
      category: formData.category || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      isActive: formData.isActive,
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2" size={20} />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Product
          </h1>
          <p className="text-muted-foreground">Add a new product to your e-commerce catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="compareAtPrice">Compare at Price</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Inventory & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Media & Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Product Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter a direct link to the product image
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-3 w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Electronics, Clothing, Food"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Organize products by category for easier management
                  </p>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add tags to help customers find this product
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 sticky top-6">
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="font-semibold">Product Status</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.isActive ? "Visible to customers" : "Hidden from customers"}
                    </p>
                  </div>
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Product"}
                  </Button>
                  <Link href="/products">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

