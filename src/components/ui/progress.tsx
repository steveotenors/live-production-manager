"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showValue?: boolean
  variant?: "default" | "success" | "info" | "warning" | "danger"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showValue = false, variant = "default", ...props }, ref) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100)
    
    const variantClasses = {
      default: "bg-primary",
      success: "bg-success",
      info: "bg-info",
      warning: "bg-warning",
      danger: "bg-danger",
    }

    return (
      <div className="relative" {...props}>
        <div
          ref={ref}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-muted",
            className
          )}
        >
          <div
            className={cn(
              "h-full w-full flex-1 transition-all",
              variantClasses[variant]
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
        
        {showValue && (
          <div className="absolute right-0 top-0 -mt-6 text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress } 