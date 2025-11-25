"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import { productService } from "@/services/product.service";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import { formatInr } from "@/lib/priceUtils";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/AnimatedNumber";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getAll(),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
  });

  // Calculate stats
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalUsers = users?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const lowStockProducts = products?.filter((p) => p.stock_quantity < 10).length || 0;
  const completedOrders = orders?.filter((o) => o.status === "delivered").length || 0;
  
  // Calculate revenue growth (mock data for now)
  const revenueGrowth = 12.5;
  const orderGrowth = 8.3;
  const userGrowth = 15.2;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const revenueData = last7Days.map((day, index) => ({
    name: day,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 20) + 5,
  }));

  const orderStatusData = [
    { name: "Delivered", value: completedOrders, color: "#00C49F" },
    { name: "Pending", value: pendingOrders, color: "#FFBB28" },
    { name: "Processing", value: orders?.filter((o) => o.status === "processing").length || 0, color: "#0088FE" },
    { name: "Cancelled", value: orders?.filter((o) => o.status === "cancelled").length || 0, color: "#FF8042" },
  ].filter(item => item.value > 0);

  // Recent orders
  const recentOrders = orders?.slice(0, 5) || [];
  
  // Top products by stock
  const topProducts = products?.slice(0, 5).map((p: any) => ({
    name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
    stock: p.stock_quantity,
    sales: Math.floor(Math.random() * 50) + 10, // Mock sales data
  })) || [];

  const isLoading = productsLoading || ordersLoading || usersLoading;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slide-up">
            Dashboard
          </h1>
          <p className="text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
            <Activity className="mr-2" size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 animate-stagger-1 group hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {isLoading ? (
                    <span className="inline-block w-24 h-8 bg-muted rounded animate-pulse"></span>
                  ) : (
                    <AnimatedNumber value={totalRevenue} duration={1500} decimals={0} prefix="₹" />
                  )}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpRight className="text-green-500 animate-pulse-slow" size={14} />
                  <span className="text-green-500 font-semibold">+{revenueGrowth}%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300 animate-float">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-secondary/50 bg-gradient-to-br from-card to-card/50 animate-stagger-2 group hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-muted rounded animate-pulse"></span>
                  ) : (
                    <AnimatedNumber value={totalOrders} duration={1500} />
                  )}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpRight className="text-green-500 animate-pulse-slow" size={14} />
                  <span className="text-green-500 font-semibold">+{orderGrowth}%</span>
                  <span className="text-muted-foreground ml-1">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{pendingOrders}</span> pending
                  </span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: "0.2s" }}>
                <ShoppingCart className="h-8 w-8 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-accent/50 bg-gradient-to-br from-card to-card/50 animate-stagger-3 group hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-muted rounded animate-pulse"></span>
                  ) : (
                    <AnimatedNumber value={totalProducts} duration={1500} />
                  )}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {lowStockProducts > 0 ? (
                    <>
                      <AlertCircle className="text-orange-500 animate-pulse" size={14} />
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">{lowStockProducts}</span>
                      <span className="text-muted-foreground ml-1">low stock</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">All products in stock</span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: "0.4s" }}>
                <Package className="h-8 w-8 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 bg-gradient-to-br from-card to-card/50 animate-stagger-4 group hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-muted rounded animate-pulse"></span>
                  ) : (
                    <AnimatedNumber value={totalUsers} duration={1500} />
                  )}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <ArrowUpRight className="text-green-500 animate-pulse-slow" size={14} />
                  <span className="text-green-500 font-semibold">+{userGrowth}%</span>
                  <span className="text-muted-foreground ml-1">Active customers</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: "0.6s" }}>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-primary animate-pulse-slow" size={20} />
              Revenue & Orders (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  animationDuration={300}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                  name="Revenue"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorOrders)"
                  name="Orders"
                  animationBegin={200}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-primary animate-pulse-slow" size={20} />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    animationDuration={300}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground animate-fade-in">
                No order data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-2 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="text-primary animate-pulse-slow" size={20} />
                Recent Orders
              </CardTitle>
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                  View All
                  <ArrowUpRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading orders...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-md animate-fade-in"
                      style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                          <Sparkles className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatInr(parseFloat(order.total_amount))} • {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-110 ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-primary animate-pulse-slow" size={20} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/products/new">
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-sm animate-fade-in" style={{ animationDelay: "0.9s" }}>
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Package size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Add New Product</p>
                    <p className="text-xs text-muted-foreground">Create a new product listing</p>
                  </div>
                </div>
              </Link>
              <Link href="/orders">
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-secondary/5 hover:border-secondary/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-sm animate-fade-in" style={{ animationDelay: "1s" }}>
                  <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                    <ShoppingCart size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">View All Orders</p>
                    <p className="text-xs text-muted-foreground">Manage customer orders</p>
                  </div>
                </div>
              </Link>
              <Link href="/analytics">
                <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/5 hover:border-accent/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-sm animate-fade-in" style={{ animationDelay: "1.1s" }}>
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <BarChart3 size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">View Analytics</p>
                    <p className="text-xs text-muted-foreground">See detailed reports</p>
                  </div>
                </div>
              </Link>
              {lowStockProducts > 0 && (
                <Link href="/inventory">
                  <div className="flex items-center gap-3 p-4 border border-orange-200 dark:border-orange-900 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-sm animate-fade-in" style={{ animationDelay: "1.2s" }}>
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:scale-110 transition-all duration-300">
                      <AlertCircle size={20} className="text-orange-600 dark:text-orange-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-orange-600 dark:text-orange-400">
                        {lowStockProducts} Low Stock Items
                      </p>
                      <p className="text-xs text-muted-foreground">Review inventory</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
