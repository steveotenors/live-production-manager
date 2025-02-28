import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FilesPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
        <p className="text-muted-foreground mt-1">
          Manage and organize your files
        </p>
      </header>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Files</CardTitle>
          <CardDescription>
            Root directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No files yet</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Upload your first file or create a folder to get started
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button>
                Upload File
              </Button>
              <Button variant="outline">
                New Folder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 