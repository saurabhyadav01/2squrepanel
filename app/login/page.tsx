"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(formData);

      // Check if user is admin
      if (response && response.user && response.user.role === "admin") {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Access denied. Admin access required.");
        authService.logout();
      }
    } catch (error: any) {
      // Handle different error types
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-accent/5 blur-[80px] animate-float" />

        {/* Floating Bubbles */}
        <div className="absolute top-[100%] left-[10%] w-24 h-24 rounded-full bg-primary/10 blur-[2px] animate-bubble" style={{ animationDelay: "0s" }} />
        <div className="absolute top-[100%] left-[30%] w-16 h-16 rounded-full bg-secondary/10 blur-[1px] animate-bubble" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[100%] left-[60%] w-32 h-32 rounded-full bg-accent/10 blur-[3px] animate-bubble" style={{ animationDelay: "4s" }} />
        <div className="absolute top-[100%] left-[80%] w-20 h-20 rounded-full bg-primary/5 blur-[1px] animate-bubble" style={{ animationDelay: "6s" }} />
        <div className="absolute top-[100%] left-[45%] w-12 h-12 rounded-full bg-secondary/5 blur-[1px] animate-bubble" style={{ animationDelay: "8s" }} />
      </div>

      <div className="absolute top-4 right-4 z-10 animate-fade-in">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border-2 shadow-2xl relative z-10 backdrop-blur-md bg-card/80 animate-scale-in">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-2 animate-float shadow-lg shadow-primary/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: "0.1s" }}>
            2 Square Collection
          </CardTitle>
          <CardDescription className="text-base animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11 transition-all duration-300 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11 transition-all duration-300 focus:scale-[1.01]"
              />
            </div>
            <div className="pt-2 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Decorative footer */}
      <div className="absolute bottom-6 text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <p>© 2024 2 Square Collection. All rights reserved.</p>
      </div>
    </div>
  );
}

