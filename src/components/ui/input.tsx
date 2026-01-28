import * as React from "react";
import { Eye, EyeOff, Search, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  isLoading?: boolean;
  size?: "sm" | "default" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      isLoading,
      size = "default",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const sizeClasses = {
      sm: "h-8 px-2 text-sm",
      default: "h-10 px-3",
      lg: "h-12 px-4 text-base",
    };

    const iconPadding = {
      sm: leftIcon ? "pl-7" : rightIcon || showPasswordToggle ? "pr-7" : "",
      default: leftIcon ? "pl-9" : rightIcon || showPasswordToggle ? "pr-9" : "",
      lg: leftIcon ? "pl-11" : rightIcon || showPasswordToggle ? "pr-11" : "",
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                "absolute left-0 top-0 flex h-full items-center justify-center text-muted-foreground",
                size === "sm" ? "pl-2" : size === "lg" ? "pl-3" : "pl-2.5"
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              "flex w-full rounded-md border bg-background text-base ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm",
              // Size
              sizeClasses[size],
              // Icon padding
              iconPadding[size],
              // Error state
              error
                ? "border-destructive focus-visible:ring-destructive"
                : "border-input",
              // Loading state
              isLoading && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {(rightIcon || showPasswordToggle || isLoading) && (
            <div
              className={cn(
                "absolute right-0 top-0 flex h-full items-center justify-center",
                size === "sm" ? "pr-2" : size === "lg" ? "pr-3" : "pr-2.5"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : showPasswordToggle && isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              "mt-1.5 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// Search Input variant
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "leftIcon">>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        leftIcon={<Search className="h-4 w-4" />}
        placeholder={props.placeholder || "Search..."}
        className={className}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
