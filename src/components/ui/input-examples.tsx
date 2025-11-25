/**
 * Input Component Examples
 * 
 * This file demonstrates all the enhanced Input component features.
 * You can use these patterns in your admin panel forms.
 */

import { Input, SearchInput } from "./input";
import { InputGroup } from "./input-group";
import { Label } from "./label";
import { Mail, Lock, User, DollarSign, Search } from "lucide-react";

export function InputExamples() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Basic Input</h2>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Enter text..." />
          <Input placeholder="Disabled input" disabled />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sizes</h2>
        <div className="space-y-4 max-w-md">
          <Input size="sm" placeholder="Small input" />
          <Input size="default" placeholder="Default input" />
          <Input size="lg" placeholder="Large input" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">With Icons</h2>
        <div className="space-y-4 max-w-md">
          <Input
            leftIcon={<Mail className="h-4 w-4" />}
            placeholder="Email address"
            type="email"
          />
          <Input
            leftIcon={<User className="h-4 w-4" />}
            placeholder="Username"
          />
          <Input
            leftIcon={<DollarSign className="h-4 w-4" />}
            rightIcon={<span className="text-sm text-muted-foreground">USD</span>}
            placeholder="0.00"
            type="number"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Password Input</h2>
        <div className="space-y-4 max-w-md">
          <Input
            type="password"
            showPasswordToggle
            placeholder="Enter password"
          />
          <Input
            type="password"
            showPasswordToggle
            leftIcon={<Lock className="h-4 w-4" />}
            placeholder="Password with icon"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Search Input</h2>
        <div className="space-y-4 max-w-md">
          <SearchInput placeholder="Search products..." />
          <SearchInput placeholder="Search users..." size="lg" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Error States</h2>
        <div className="space-y-4 max-w-md">
          <Input
            error
            placeholder="Invalid input"
            helperText="This field is required"
          />
          <Input
            error
            placeholder="Email"
            type="email"
            helperText="Please enter a valid email address"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Loading State</h2>
        <div className="space-y-4 max-w-md">
          <Input
            isLoading
            placeholder="Loading..."
            disabled
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">With Label</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-required" required>
              Email Address (Required)
            </Label>
            <Input id="email-required" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" optional>
              Phone Number (Optional)
            </Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Input Group</h2>
        <div className="space-y-4 max-w-md">
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
              placeholder="0.00"
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
          </InputGroup>

          <InputGroup
            label="SKU"
            htmlFor="sku"
            optional
            helperText="Stock Keeping Unit (optional)"
          >
            <Input id="sku" placeholder="SKU-12345" />
          </InputGroup>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Form Example</h2>
        <form className="space-y-4 max-w-md">
          <InputGroup label="Email" htmlFor="form-email" required>
            <Input
              id="form-email"
              type="email"
              leftIcon={<Mail className="h-4 w-4" />}
              placeholder="you@example.com"
            />
          </InputGroup>

          <InputGroup label="Password" htmlFor="form-password" required>
            <Input
              id="form-password"
              type="password"
              showPasswordToggle
              leftIcon={<Lock className="h-4 w-4" />}
              placeholder="Enter password"
            />
          </InputGroup>

          <InputGroup
            label="Search"
            htmlFor="form-search"
            helperText="Search for products, users, or orders"
          >
            <SearchInput id="form-search" placeholder="Search..." />
          </InputGroup>
        </form>
      </div>
    </div>
  );
}

