import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  premium?: boolean;
  label?: string;
}

export function LoadingSpinner({
  className,
  size = "md",
  premium = true,
  label,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3", 
        premium && "opacity-90",
        className
      )}
      {...props}
    >
      <div className={cn(
        premium ? "relative" : ""
      )}>
        {premium && (
          <div className={cn(
            "absolute inset-0 animate-ping rounded-full opacity-30 bg-primary/20",
            sizeClasses[size]
          )} />
        )}
        <Loader2
          className={cn(
            "animate-spin",
            premium ? "text-primary drop-shadow-md" : "text-foreground",
            sizeClasses[size]
          )}
        />
      </div>
      
      {label && (
        <p className={cn(
          "text-xs animate-pulse text-center",
          premium ? "text-primary/80" : "text-muted-foreground"
        )}>
          {label}
        </p>
      )}
    </div>
  );
} 