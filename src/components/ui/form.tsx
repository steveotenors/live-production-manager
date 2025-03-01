import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2.5 relative", className)} {...props} />
));
FormField.displayName = "FormField";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, required, children, ...props }, ref) => (
  <Label ref={ref} className={cn("text-sm font-medium tracking-tight text-foreground opacity-90", className)} {...props}>
    {children}
    {required && <span className="ml-1 text-primary font-bold">*</span>}
  </Label>
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-1.5", className)} {...props} />
));
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground mt-1.5 opacity-70", className)}
    {...props}
  />
));
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs font-medium text-destructive mt-1.5 animate-slide-in-bottom", className)}
    {...props}
  />
));
FormMessage.displayName = "FormMessage";

export { FormField, FormLabel, FormControl, FormDescription, FormMessage }; 