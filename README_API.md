# Admin Panel API Integration Guide

This document describes the API integration for the 2Square admin panel.

## Setup

1. Set the API URL in `.env.local` (optional, defaults to production API):
```env
NEXT_PUBLIC_API_URL=http://93.127.172.171:5000/api
```

2. Make sure the backend server is running on port 5000.

3. Login with an admin account (role must be "admin").

## API Services

### Authentication (`src/services/auth.service.ts`)
- `login(data)` - Login admin user
- `getCurrentUser()` - Get current authenticated user
- `logout()` - Logout user

### Products (`src/services/product.service.ts`)
- `getAll(filters?)` - Get all products
- `getById(id)` - Get product by ID
- `create(data)` - Create new product
- `update(id, data)` - Update product
- `delete(id)` - Delete product

### Orders (`src/services/order.service.ts`)
- `getAll()` - Get all orders
- `getById(id)` - Get order by ID
- `updateStatus(id, status)` - Update order status

### Users (`src/services/user.service.ts`)
- `getAll()` - Get all users
- `getById(id)` - Get user by ID

## Pages

- `/login` - Admin login page
- `/` - Dashboard
- `/products` - Product management
- `/products/new` - Create product
- `/products/[id]` - Edit product
- `/orders` - Order management
- `/users` - User management

## Authentication

The API client automatically includes the JWT token from localStorage. Only users with the "admin" role can access the admin panel.

