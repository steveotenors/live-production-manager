import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  premium?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, premium = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-black/60 backdrop-blur-sm px-3 py-1.5 text-sm shadow-sm transition-all duration-300",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground/70",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          premium && "border-primary/30 shadow-sm shadow-primary/10 focus-visible:shadow-primary/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }