import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingProps {
  message?: string;
  fullPage?: boolean;
}

export function Loading({ 
  message = 'Loading...', 
  fullPage = false 
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6">
      <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return content;
} 