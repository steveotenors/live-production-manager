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
}

export function PageHeader({ 
  heading, 
  description, 
  backHref, 
  backLabel = 'Back', 
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "space-y-1",
        className
      )}
      {...props}
    >
      {backHref && (
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="h-8 pl-0 mb-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <Link href={backHref}>
            <ArrowLeft className="mr-1 h-4 w-4" /> {backLabel}
          </Link>
        </Button>
      )}
      
      <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {children && (
        <div className="flex items-center gap-2 pt-2">
          {children}
        </div>
      )}
    </div>
  );
} 