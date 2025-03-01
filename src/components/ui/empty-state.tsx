import { cn } from "@/lib/utils";
import React from "react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  premium?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  premium = true,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-12 text-center relative",
        premium && "glass rounded-xl border border-primary/10 obsidian-reflection p-8",
        premium && "slide-in-bottom shadow-lg",
        className
      )}
      {...props}
    >
      {premium && <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none rounded-xl"></div>}
      <div className="relative z-10">
        {icon && (
          <div className={cn(
            "rounded-full p-5 w-16 h-16 mx-auto mb-6 flex items-center justify-center",
            premium 
              ? "bg-black/50 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/5 obsidian-finish" 
              : "bg-muted"
          )}>
            <div className={cn(
              "h-7 w-7",
              premium ? "text-primary" : "text-muted-foreground"
            )}>
              {icon}
            </div>
          </div>
        )}
        <h3 className={cn(
          "text-xl font-semibold mb-2", 
          premium && "gradient-text"
        )}>
          {title}
        </h3>
        {description && (
          <p className={cn(
            "text-muted-foreground mb-5",
            premium && "text-foreground/70"
          )}>
            {description}
          </p>
        )}
        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
} 