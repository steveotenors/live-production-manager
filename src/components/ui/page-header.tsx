import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  backHref, 
  backLabel = 'Back', 
  children 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {backHref && (
          <Button asChild variant="outline" size="sm">
            <Link href={backHref}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
            </Link>
          </Button>
        )}
        {children}
      </div>
    </div>
  );
} 