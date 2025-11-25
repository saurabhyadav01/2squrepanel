"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  X,
  Tag,
  Warehouse,
  CreditCard,
  LogOut,
  FolderTree,
} from "lucide-react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "@/index.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Create QueryClient inside component to avoid SSR issues
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Package, label: "Products", href: "/products" },
    { icon: FolderTree, label: "Categories", href: "/categories" },
    { icon: Warehouse, label: "Inventory", href: "/inventory" },
    { icon: ShoppingCart, label: "Orders", href: "/orders" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: CreditCard, label: "Payments", href: "/payments" },
    { icon: Tag, label: "Coupons", href: "/coupons" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (pathname === "/login") {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <TooltipProvider>
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <div className="flex h-screen bg-background">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 bg-card border-r border-border shadow-sm`}>
                  <div className="p-4 flex items-center justify-between border-b border-border">
                    <Link
                      href="/"
                      className={`font-bold text-xl hover:opacity-80 transition-opacity ${sidebarOpen ? "block" : "hidden"}`}
                    >
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        2Square Panel
                      </span>
                    </Link>
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  </div>
                  <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={20} />
                          {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                      );
                    })}
                    <div className="pt-4 mt-4 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 transition-colors w-full text-left text-destructive hover:text-destructive"
                      >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                      </button>
                    </div>
                  </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Header */}
                  <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {menuItems.find(item => item.href === pathname)?.label || "Dashboard"}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <ThemeToggle />
                    </div>
                  </header>
                  
                  {/* Content */}
                  <main className="flex-1 overflow-auto bg-muted/20">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
