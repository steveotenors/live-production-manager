import { cn } from "@/lib/utils";
import React from "react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="rounded-full bg-muted p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <div className="h-6 w-6 text-muted-foreground">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
} 