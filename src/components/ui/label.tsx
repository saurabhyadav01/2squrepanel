import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        required: "text-foreground after:content-['*'] after:ml-0.5 after:text-destructive",
        optional: "text-muted-foreground",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, required, optional, ...props }, ref) => {
    const labelVariant = required ? "required" : optional ? "optional" : variant;
    
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant: labelVariant, size }), className)}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label, labelVariants };

