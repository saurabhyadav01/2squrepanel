"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { couponService } from "@/services/coupon.service";
import { Plus, Trash2, Copy, Edit } from "lucide-react";
import { toast } from "sonner";

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
    minPurchase: "",
    maxDiscount: "",
    isActive: true,
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => couponService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => couponService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setNewCoupon({
        code: "",
        discount: "",
        type: "percentage",
        validFrom: "",
        validUntil: "",
        usageLimit: "",
      });
      setIsAdding(false);
      toast.success("Coupon created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create coupon");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setEditingId(null);
      setNewCoupon({
        code: "",
        discount: "",
        type: "percentage",
        validFrom: "",
        validUntil: "",
        usageLimit: "",
        minPurchase: "",
        maxDiscount: "",
        isActive: true,
      });
      toast.success("Coupon updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update coupon");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete coupon");
    },
  });

  const handleAdd = () => {
    if (!newCoupon.code || !newCoupon.discount) {
      toast.error("Code and discount are required");
      return;
    }
    if (!newCoupon.validFrom || !newCoupon.validUntil) {
      toast.error("Valid from and until dates are required");
      return;
    }

    const couponData = {
      code: newCoupon.code,
      discountType: newCoupon.type,
      discountValue: parseFloat(newCoupon.discount),
      minPurchaseAmount: newCoupon.minPurchase ? parseFloat(newCoupon.minPurchase) : undefined,
      maxDiscountAmount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : undefined,
      usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : undefined,
      validFrom: new Date(newCoupon.validFrom).toISOString(),
      validUntil: new Date(newCoupon.validUntil).toISOString(),
      isActive: newCoupon.isActive,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: couponData });
    } else {
      createMutation.mutate(couponData);
    }
  };

  const handleEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setNewCoupon({
      code: coupon.code,
      discount: coupon.discount_value.toString(),
      type: coupon.discount_type,
      validFrom: new Date(coupon.valid_from).toISOString().split('T')[0],
      validUntil: new Date(coupon.valid_until).toISOString().split('T')[0],
      usageLimit: coupon.usage_limit?.toString() || "",
      minPurchase: coupon.min_purchase_amount?.toString() || "",
      maxDiscount: coupon.max_discount_amount?.toString() || "",
      isActive: coupon.is_active,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewCoupon({
      code: "",
      discount: "",
      type: "percentage",
      validFrom: "",
      validUntil: "",
      usageLimit: "",
      minPurchase: "",
      maxDiscount: "",
      isActive: true,
    });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coupons & Discounts</h1>
          <p className="text-muted-foreground">Create and manage discount codes</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2" size={20} />
          Create Coupon
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="mb-6 border-2">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Coupon" : "New Coupon"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="WELCOME10"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount Value *</Label>
                <Input
                  id="discount"
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="type">Discount Type</Label>
                <select
                  id="type"
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as "percentage" | "fixed" })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <Label htmlFor="minPurchase">Min Purchase Amount</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  value={newCoupon.minPurchase}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="maxDiscount">Max Discount Amount</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={newCoupon.maxDiscount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={newCoupon.validFrom}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="couponActive"
                checked={newCoupon.isActive}
                onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="couponActive">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleAdd}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
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
          {coupons?.map((coupon) => (
            <Card key={coupon.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{coupon.code}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(coupon.code)}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}%`
                      : `$${coupon.discount_value}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Used: {coupon.used_count} / {coupon.usage_limit || "∞"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valid: {new Date(coupon.valid_from).toLocaleDateString()} -{" "}
                    {new Date(coupon.valid_until).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(coupon)}
                  >
                    <Edit className="mr-2" size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (confirm("Delete this coupon?")) {
                        deleteMutation.mutate(coupon.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="mr-2" size={16} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {coupons?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No coupons found</p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2" size={20} />
            Create Your First Coupon
          </Button>
        </div>
      )}
    </div>
  );
}

