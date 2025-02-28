"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple progress component that doesn't depend on Radix UI
const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
  }
>(({ className, value = 0, max = 100, ...props }, ref) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})

Progress.displayName = "Progress"

export { Progress } 