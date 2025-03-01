import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all hover:scale-105 active:scale-100 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-black hover:bg-primary/90 shadow-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20",
        outline: 
          "border-primary/30 bg-black/60 backdrop-blur-sm text-primary hover:border-primary/50 hover:bg-black/80",
        success:
          "border-success/30 bg-success/20 text-success hover:bg-success/30 shadow-success/10",
        info:
          "border-info/30 bg-info/20 text-info hover:bg-info/30 shadow-info/10",
        warning:
          "border-warning/30 bg-warning/20 text-warning hover:bg-warning/30 shadow-warning/10",
        danger:
          "border-destructive/30 bg-destructive/20 text-destructive hover:bg-destructive/30 shadow-destructive/10",
        premium: 
          "border-primary/40 bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:border-primary/60 shadow-primary/10",
        glass:
          "border-primary/20 bg-black/60 backdrop-blur-sm text-foreground hover:bg-black/70 hover:border-primary/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 