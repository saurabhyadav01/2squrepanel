import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input, InputProps } from "./input";

export interface InputGroupProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  className?: string;
  labelClassName?: string;
  children?: React.ReactNode;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      label,
      htmlFor,
      required,
      optional,
      error,
      helperText,
      errorText,
      className,
      labelClassName,
      children,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label
            htmlFor={htmlFor}
            required={required}
            optional={optional}
            className={labelClassName}
          >
            {label}
          </Label>
        )}
        {React.isValidElement(children) && error
          ? React.cloneElement(children as React.ReactElement<InputProps>, {
              error: true,
              helperText: errorText || helperText,
            })
          : children}
        {helperText && !error && !React.isValidElement(children) && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {errorText && error && !React.isValidElement(children) && (
          <p className="text-sm text-destructive">{errorText}</p>
        )}
      </div>
    );
  }
);
InputGroup.displayName = "InputGroup";

export { InputGroup };

