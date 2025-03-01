import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  fluid?: boolean;
  children: React.ReactNode;
  premium?: boolean;
  glass?: boolean;
}

export function Container({
  size = "lg",
  fluid = false,
  premium = false,
  glass = false,
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
        "mx-auto px-4 md:px-6 relative",
        !fluid && sizeClasses[size],
        premium && "card-premium p-6 rounded-xl",
        glass && "glass p-6 rounded-xl backdrop-blur-lg",
        premium && glass && "obsidian-reflection",
        className
      )}
      {...props}
    >
      {(premium || glass) && (
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
} 