"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { settingsService } from "@/services/settings.service";
import { Save, Store, Mail, Shield, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [storeSettings, setStoreSettings] = useState({
    name: "2Square",
    email: "admin@2square.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    zipCode: "10001",
    country: "United States",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@2square.com",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeKey: "",
    paypalClientId: "",
    currency: "INR",
  });

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const store = await settingsService.get("store");
        const email = await settingsService.get("email");
        const payment = await settingsService.get("payment");
        
        if (store) setStoreSettings(store);
        if (email) setEmailSettings(email);
        if (payment) setPaymentSettings(payment);
      } catch (error) {
        // Settings not found, use defaults
      }
    };
    loadSettings();
  }, []);

  const saveStoreMutation = useMutation({
    mutationFn: () => settingsService.set("store", storeSettings, "Store information"),
    onSuccess: () => {
      toast.success("Store settings saved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const saveEmailMutation = useMutation({
    mutationFn: () => settingsService.set("email", emailSettings, "Email configuration"),
    onSuccess: () => {
      toast.success("Email settings saved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const savePaymentMutation = useMutation({
    mutationFn: () => settingsService.set("payment", paymentSettings, "Payment configuration"),
    onSuccess: () => {
      toast.success("Payment settings saved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const handleSave = (section: string) => {
    if (section === "Store") {
      saveStoreMutation.mutate();
    } else if (section === "Email") {
      saveEmailMutation.mutate();
    } else if (section === "Payment") {
      savePaymentMutation.mutate();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store size={20} />
              <CardTitle>Store Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeSettings.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Phone</Label>
                <Input
                  id="storePhone"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storeAddress">Address</Label>
                <Input
                  id="storeAddress"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storeCity">City</Label>
                <Input
                  id="storeCity"
                  value={storeSettings.city}
                  onChange={(e) => setStoreSettings({ ...storeSettings, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="storeZip">Zip Code</Label>
                <Input
                  id="storeZip"
                  value={storeSettings.zipCode}
                  onChange={(e) => setStoreSettings({ ...storeSettings, zipCode: e.target.value })}
                />
              </div>
            </div>
            <Button 
              onClick={() => handleSave("Store")}
              disabled={saveStoreMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {saveStoreMutation.isPending ? "Saving..." : "Save Store Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail size={20} />
              <CardTitle>Email Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                />
              </div>
            </div>
            <Button 
              onClick={() => handleSave("Email")}
              disabled={saveEmailMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {saveEmailMutation.isPending ? "Saving..." : "Save Email Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard size={20} />
              <CardTitle>Payment Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stripeKey">Stripe Secret Key</Label>
                <Input
                  id="stripeKey"
                  type="password"
                  value={paymentSettings.stripeKey}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeKey: e.target.value })}
                  placeholder="sk_test_..."
                />
              </div>
              <div>
                <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                <Input
                  id="paypalClientId"
                  value={paymentSettings.paypalClientId}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalClientId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="currency">Default Currency</Label>
                <select
                  id="currency"
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
            <Button 
              onClick={() => handleSave("Payment")}
              disabled={savePaymentMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {savePaymentMutation.isPending ? "Saving..." : "Save Payment Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

