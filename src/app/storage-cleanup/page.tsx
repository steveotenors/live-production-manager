'use client';

import { useState } from 'react';
import { deleteAllFiles } from '@/lib/supabase-storage';
import { Button } from '@/components/ui/button';

export default function StorageCleanupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string }>({});

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to delete all files? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setResult({});
    
    try {
      await deleteAllFiles();
      setResult({ 
        success: true,
        message: 'All test files have been successfully deleted!' 
      });
    } catch (error) {
      console.error('Failed to delete test files:', error);
      setResult({ 
        success: false,
        message: `Error deleting files: ${error instanceof Error ? error.message : String(error)}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Storage Cleanup</h1>
      
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Delete All Files</h2>
        <p className="mb-6 text-muted-foreground">
          This will delete all files from the storage bucket. This action cannot be undone.
        </p>
        
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleCleanup}
            disabled={isLoading}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Deleting...' : 'Delete All Files'}
          </Button>
          
          {result.message && (
            <div className={`p-4 mt-4 rounded-md ${
              result.success ? 'bg-green-50 text-green-700 border border-green-200' : 
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 