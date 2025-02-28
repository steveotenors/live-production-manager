import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  fluid?: boolean;
  children: React.ReactNode;
}

export function Container({
  size = "lg",
  fluid = false,
  className,
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 md:px-6",
        !fluid && sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 