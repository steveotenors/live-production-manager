import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  heading: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
  className?: string;
  premium?: boolean;
  glassBorder?: boolean;
}

export function PageHeader({ 
  heading, 
  description, 
  backHref, 
  backLabel = 'Back', 
  children,
  className,
  premium = true,
  glassBorder = false,
  ...props
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "space-y-2 pb-4",
        glassBorder && "border-b border-primary/10",
        premium && "mb-6",
        className
      )}
      {...props}
    >
      {backHref && (
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="h-8 pl-0 mb-2 hover:bg-transparent text-primary/80 hover:text-primary transition-colors"
        >
          <Link href={backHref}>
            <ArrowLeft className="mr-1 h-4 w-4" /> {backLabel}
          </Link>
        </Button>
      )}
      
      <h1 className={cn(
        "text-3xl font-bold tracking-tight slide-in-bottom",
        premium && "gradient-text text-4xl"
      )}>
        {heading}
      </h1>
      
      {description && (
        <p className="text-sm text-muted-foreground slide-in-bottom opacity-80" style={{animationDelay: '50ms'}}>
          {description}
        </p>
      )}
      
      {children && (
        <div className="flex items-center gap-3 pt-3 slide-in-bottom" style={{animationDelay: '100ms'}}>
          {children}
        </div>
      )}
    </div>
  );
} 