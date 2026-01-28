"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/category.service";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", slug: "", imageUrl: "", isActive: true });
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategory({ name: "", description: "", slug: "", imageUrl: "", isActive: true });
      setIsAdding(false);
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setNewCategory({ name: "", description: "", slug: "", imageUrl: "", isActive: true });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleAdd = () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }
    createMutation.mutate({
      name: newCategory.name,
      description: newCategory.description || undefined,
      slug: newCategory.slug || undefined,
      imageUrl: newCategory.imageUrl || undefined,
      isActive: newCategory.isActive,
    });
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description || "",
      slug: category.slug || "",
      imageUrl: category.image_url || "",
      isActive: category.is_active,
    });
  };

  const handleUpdate = () => {
    if (!newCategory.name || !editingId) {
      toast.error("Category name is required");
      return;
    }
    updateMutation.mutate({
      id: editingId,
      data: {
        name: newCategory.name,
        description: newCategory.description || undefined,
        slug: newCategory.slug || undefined,
        imageUrl: newCategory.imageUrl || undefined,
        isActive: newCategory.isActive,
      },
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewCategory({ name: "", description: "", slug: "", imageUrl: "", isActive: true });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2" size={20} />
          Add Category
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="mb-6 border-2">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Category" : "New Category"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="catName">Category Name *</Label>
              <Input
                id="catName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="catDesc">Description</Label>
              <Input
                id="catDesc"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="catSlug">Slug (URL-friendly)</Label>
              <Input
                id="catSlug"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                placeholder="category-slug"
              />
            </div>
            <div>
              <Label htmlFor="catImage">Image URL</Label>
              <Input
                id="catImage"
                value={newCategory.imageUrl}
                onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="catActive"
                checked={newCategory.isActive}
                onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="catActive">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={editingId ? handleUpdate : handleAdd} 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <p className="text-sm mb-4">
                  <span className="font-semibold">{category.product_count || 0}</span> products
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2" size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Delete this category?")) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
