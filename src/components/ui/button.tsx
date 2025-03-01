import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black font-medium shadow hover:bg-primary/90 shadow-md hover:shadow-xl hover:shadow-primary/20 obsidian-finish",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 obsidian-finish",
        outline:
          "border border-primary/30 bg-black/60 backdrop-blur-sm text-primary shadow-sm hover:bg-black/80 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 obsidian-reflection",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80 hover:shadow-lg hover:shadow-secondary/20 obsidian-finish",
        ghost: "hover:bg-black/40 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90",
        success: "bg-success text-success-foreground shadow-md hover:bg-success/90 hover:shadow-lg hover:shadow-success/20 obsidian-finish",
        info: "bg-info text-info-foreground shadow-md hover:bg-info/90 hover:shadow-lg hover:shadow-info/20 obsidian-finish",
        warning: "bg-warning text-black shadow-md hover:bg-warning/90 hover:shadow-lg hover:shadow-warning/20 obsidian-finish",
        danger: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 obsidian-finish",
        premium: "bg-gradient-to-r from-primary via-primary/90 to-primary border border-primary/20 text-black font-semibold shadow-md hover:shadow-xl hover:shadow-primary/30 hover:border-primary/40 obsidian-finish",
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
