import { LoadingSpinner } from "./loading-spinner";

export function PageLoading() {
  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
} 