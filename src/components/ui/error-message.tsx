import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export function ErrorMessage({ 
  title = 'An error occurred', 
  message, 
  onRetry,
  fullPage = false 
}: ErrorMessageProps) {
  const content = (
    <div className="flex flex-col items-center text-center p-6">
      <AlertCircle className="h-8 w-8 text-destructive mb-3" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive/20">
          <CardContent className="pt-6">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return content;
} 