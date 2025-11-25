"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { couponService } from "@/services/coupon.service";
import { Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    validFrom: "",
    validUntil: "",
    usageLimit: "",
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

    createMutation.mutate({
      code: newCoupon.code,
      discountType: newCoupon.type,
      discountValue: parseFloat(newCoupon.discount),
      usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : undefined,
      validFrom: new Date(newCoupon.validFrom).toISOString(),
      validUntil: new Date(newCoupon.validUntil).toISOString(),
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

      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Coupon</CardTitle>
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
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount *</Label>
                <Input
                  id="discount"
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="validFrom">Valid From</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={newCoupon.validFrom}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd}>Create</Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
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
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => {
                    if (confirm("Delete this coupon?")) {
                      deleteMutation.mutate(coupon.id);
                    }
                  }}
                >
                  <Trash2 className="mr-2" size={16} />
                  Delete
                </Button>
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

