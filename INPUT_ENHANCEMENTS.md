# Enhanced Input Component Features

## Overview
The Input component has been significantly enhanced with professional features for better UX and developer experience in the admin panel.

## New Features

### 1. **Multiple Sizes**
```tsx
<Input size="sm" placeholder="Small" />
<Input size="default" placeholder="Default" />
<Input size="lg" placeholder="Large" />
```

### 2. **Left & Right Icons**
```tsx
<Input
  leftIcon={<Mail className="h-4 w-4" />}
  placeholder="Email"
/>
<Input
  rightIcon={<span>USD</span>}
  placeholder="0.00"
/>
```

### 3. **Password Visibility Toggle**
```tsx
<Input
  type="password"
  showPasswordToggle
  placeholder="Enter password"
/>
```

### 4. **Error States**
```tsx
<Input
  error
  helperText="This field is required"
  placeholder="Invalid input"
/>
```

### 5. **Loading State**
```tsx
<Input
  isLoading
  placeholder="Loading..."
  disabled
/>
```

### 6. **Search Input Variant**
```tsx
import { SearchInput } from "@/components/ui/input";

<SearchInput placeholder="Search products..." />
```

### 7. **Helper Text**
```tsx
<Input
  helperText="Enter a valid email address"
  placeholder="Email"
/>
```

## Enhanced Label Component

### Features:
- **Required indicator**: Automatically adds asterisk
- **Optional indicator**: Shows optional text
- **Size variants**: sm, default, lg

```tsx
<Label required>Email Address</Label>
<Label optional>Phone Number</Label>
<Label size="lg">Large Label</Label>
```

## InputGroup Component

A complete form field wrapper with label, input, and helper/error text:

```tsx
import { InputGroup } from "@/components/ui/input-group";

<InputGroup
  label="Product Name"
  htmlFor="product-name"
  required
  helperText="Enter the name of your product"
>
  <Input id="product-name" placeholder="Product name" />
</InputGroup>

<InputGroup
  label="Price"
  htmlFor="price"
  required
  error
  errorText="Price must be greater than 0"
>
  <Input
    id="price"
    type="number"
    leftIcon={<DollarSign className="h-4 w-4" />}
  />
</InputGroup>
```

## Complete Example

```tsx
import { Input, SearchInput } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Mail, Lock, DollarSign } from "lucide-react";

function ProductForm() {
  return (
    <form className="space-y-4">
      <InputGroup
        label="Product Name"
        htmlFor="name"
        required
        helperText="Enter a descriptive name"
      >
        <Input id="name" placeholder="Product name" />
      </InputGroup>

      <InputGroup
        label="Email"
        htmlFor="email"
        required
        error
        errorText="Invalid email format"
      >
        <Input
          id="email"
          type="email"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
        />
      </InputGroup>

      <InputGroup
        label="Password"
        htmlFor="password"
        required
      >
        <Input
          id="password"
          type="password"
          showPasswordToggle
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="Enter password"
        />
      </InputGroup>

      <InputGroup
        label="Price"
        htmlFor="price"
        required
      >
        <Input
          id="price"
          type="number"
          leftIcon={<DollarSign className="h-4 w-4" />}
          placeholder="0.00"
        />
      </InputGroup>

      <InputGroup
        label="Search"
        htmlFor="search"
        helperText="Search for products"
      >
        <SearchInput id="search" placeholder="Search..." />
      </InputGroup>
    </form>
  );
}
```

## Props Reference

### Input Props
```typescript
interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;                    // Show error state
  helperText?: string;                // Helper text below input
  leftIcon?: React.ReactNode;          // Icon on the left
  rightIcon?: React.ReactNode;         // Icon on the right
  showPasswordToggle?: boolean;        // Show password visibility toggle
  isLoading?: boolean;                // Show loading spinner
  size?: "sm" | "default" | "lg";     // Size variant
}
```

### InputGroup Props
```typescript
interface InputGroupProps {
  label?: string;                     // Label text
  htmlFor?: string;                    // Input ID
  required?: boolean;                  // Show required indicator
  optional?: boolean;                 // Show optional indicator
  error?: boolean;                     // Error state
  helperText?: string;                 // Helper text
  errorText?: string;                  // Error message
  className?: string;                  // Container className
  labelClassName?: string;             // Label className
  children?: React.ReactNode;          // Input component
}
```

## Migration Guide

### Before:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2..." />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

### After:
```tsx
<SearchInput placeholder="Search..." />
```

## Benefits

1. **Better UX**: Password toggle, loading states, error feedback
2. **Less Code**: Built-in icons, helper text, error states
3. **Consistency**: Standardized form field patterns
4. **Accessibility**: Proper labels, error associations
5. **Type Safety**: Full TypeScript support

## See Examples

Check `src/components/ui/input-examples.tsx` for comprehensive examples of all features.

