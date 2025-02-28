import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
        info: "bg-info text-info-foreground shadow-sm hover:bg-info/90",
        warning: "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90",
        danger: "bg-danger text-danger-foreground shadow-sm hover:bg-danger/90",
      },
      size: {
        xs: "h-7 rounded-md px-2.5 py-1 text-xs",
        sm: "h-8 rounded-md px-3 py-1.5 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-5 py-2.5 text-base",
        xl: "h-12 rounded-md px-6 py-3 text-base",
        icon: "h-9 w-9 p-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    // For asChild buttons, if we're loading, we need to wrap in a div to show the loading spinner
    if (asChild && isLoading) {
      return (
        <div className={cn(buttonVariants({ variant, size, className }), "relative")}>
          <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          <div className="invisible">
            <Slot ref={ref} {...props}>
              {children}
            </Slot>
          </div>
        </div>
      );
    }

    // Regular asChild case
    if (asChild) {
      return (
        <Slot 
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }
    
    // Regular button case
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
