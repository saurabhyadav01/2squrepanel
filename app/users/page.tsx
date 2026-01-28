/**
 * Users Management Page
 * 
 * Customer and user management interface with search, filtering,
 * and user account management features for e-commerce operations.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";
import { Search, User, Mail, Calendar, Phone, Shield, UserCheck, UserX, Download, Filter } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

type RoleFilter = "all" | "admin" | "customer";
type StatusFilter = "all" | "active" | "inactive";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
  });

  const usersArray = Array.isArray(users) ? users : [];

  const filteredUsers = usersArray.filter((user) => {
    const matchesSearch = 
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "inactive" && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: usersArray.length,
    admins: usersArray.filter(u => u.role === "admin").length,
    customers: usersArray.filter(u => u.role === "customer").length,
    active: usersArray.filter(u => u.is_active).length,
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Users & Customers
          </h1>
          <p className="text-muted-foreground">Manage customer accounts and user permissions</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2" size={16} />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold mt-1">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold mt-1">{stats.customers}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
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
                placeholder="Search users by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Shield className="mr-2" size={16} />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="border-2 hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <User className="text-primary" size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-lg truncate">
                        {user.firstName || ""} {user.lastName || ""}
                        {!user.firstName && !user.lastName && "No Name"}
                      </h3>
                      <div className="flex gap-1 flex-shrink-0">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                          {user.role === "admin" ? <Shield size={12} className="mr-1" /> : null}
                          {user.role}
                        </Badge>
                        {user.is_active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
                            <UserCheck size={12} className="mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                            <UserX size={12} className="mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={14} className="flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone size={14} className="flex-shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} className="flex-shrink-0" />
                        <span>Joined {format(new Date(user.created_at), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && !isLoading && (
        <Card className="border-2">
          <CardContent className="py-12 text-center">
            <User className="mx-auto mb-4 text-muted-foreground" size={64} />
            <p className="text-muted-foreground text-lg font-semibold mb-2">No users found</p>
            {search && (
              <p className="text-sm text-muted-foreground mb-4">
                No users match your search "{search}"
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

