'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FolderPlus, 
  RefreshCw, 
  File as FileIcon, 
  Folder, 
  ChevronLeft, 
  ChevronUp, 
  MoreVertical,
  Eye,
  Download,
  Pen,
  Trash
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  FileUpload 
} from '@/components/FileUpload';
import { 
  FileList 
} from '@/components/FileList';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  createFolder, 
  listFiles, 
  deleteFile, 
  renameFile, 
  moveFile, 
  getFileUrl 
} from '@/lib/supabase-storage';

interface FileManagerProps {
  projectId: string;
  basePath?: string;
}

export default function FileManager({ projectId, basePath = '' }: FileManagerProps) {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  
  const fullPath = basePath ? (currentPath ? `${basePath}/${currentPath}` : basePath) : currentPath;
  
  // Function to load files for the current path
  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await listFiles(fullPath);
      
      if (error) {
        toast({
          title: 'Error',
          description: `Failed to load files: ${error}`,
          variant: 'destructive',
        });
        return;
      }
      
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load files whenever the path or refresh trigger changes
  useEffect(() => {
    loadFiles();
  }, [currentPath, refreshTrigger, fullPath]);
  
  // Function to navigate into a folder
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };
  
  // Function to navigate up one level
  const navigateUp = () => {
    if (!currentPath) return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
  };
  
  // Function to navigate to the root
  const navigateToRoot = () => {
    setCurrentPath('');
  };
  
  // Function to handle file selection
  const handleFileClick = async (file: any) => {
    if (file.type === 'folder') {
      navigateToFolder(file.path);
      return;
    }
    
    setSelectedFile(file);
    
    try {
      const { data, error } = await getFileUrl(file.path);
      
      if (error) {
        toast({
          title: 'Error',
          description: `Failed to get file URL: ${error}`,
          variant: 'destructive',
        });
        return;
      }
      
      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error getting file URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to get file URL',
        variant: 'destructive',
      });
    }
  };
  
  // Function to create a new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: 'Error',
        description: 'Folder name cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCreatingFolder(true);
    
    try {
      const folderPath = currentPath 
        ? `${fullPath}/${newFolderName}` 
        : `${basePath}/${newFolderName}`;
      
      const { success, error } = await createFolder(folderPath);
      
      if (!success) {
        toast({
          title: 'Error',
          description: `Failed to create folder: ${error}`,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: `Folder "${newFolderName}" created successfully`,
      });
      
      setShowNewFolderDialog(false);
      setNewFolderName('');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };
  
  // Function to handle file upload completion
  const handleUploadComplete = () => {
    setShowUploadDialog(false);
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: 'Success',
      description: 'File uploaded successfully',
    });
  };
  
  // Function to delete a file or folder
  const handleDeleteFile = async (file: any) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }
    
    try {
      const { success, error } = await deleteFile(file.path, undefined, file.type === 'folder');
      
      if (!success) {
        toast({
          title: 'Error',
          description: `Failed to delete ${file.type}: ${error}`,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Success',
        description: `${file.type === 'folder' ? 'Folder' : 'File'} deleted successfully`,
      });
      
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };
  
  // Function to get icon based on file extension
  const getFileIcon = (file: any) => {
    if (file.type === 'folder') {
      return <Folder className="h-5 w-5 text-blue-500" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon className="h-5 w-5 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FileIcon className="h-5 w-5 text-yellow-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <FileIcon className="h-5 w-5 text-pink-500" />;
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Generate breadcrumbs for navigation
  const renderBreadcrumbs = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
        <button
          onClick={navigateToRoot}
          className="hover:text-foreground"
        >
          Root
        </button>
        
        {pathParts.map((part, index) => {
          const path = pathParts.slice(0, index + 1).join('/');
          
          return (
            <div key={path} className="flex items-center">
              <span className="mx-1">/</span>
              <button
                onClick={() => navigateToFolder(path)}
                className="hover:text-foreground"
              >
                {part}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Files</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your project files and folders
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRefreshTrigger(prev => prev + 1)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowNewFolderDialog(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          
          <Button 
            size="sm"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {renderBreadcrumbs()}
          
          {currentPath && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-4"
              onClick={navigateUp}
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Up one level
            </Button>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No files yet</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                This folder is empty. Upload files or create folders to organize your content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/50 transition-colors"
                >
                  <div 
                    className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleFileClick(file)}
                  >
                    {getFileIcon(file)}
                    <div className="truncate">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type === 'folder' ? 'Folder' : 
                          `${(file.size / 1024).toFixed(1)} KB • ${new Date(file.updated).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {file.type !== 'folder' && (
                        <>
                          <DropdownMenuItem onClick={() => handleFileClick(file)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <Pen className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* File Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload a file to the current folder
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <FileUpload 
              projectId={projectId}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for the new folder
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewFolderDialog(false)}
              disabled={isCreatingFolder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || isCreatingFolder}
            >
              {isCreatingFolder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {previewUrl && (
              <div className="max-h-[70vh] overflow-auto">
                {selectedFile?.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <img src={previewUrl} alt={selectedFile?.name} className="max-w-full h-auto" />
                ) : selectedFile?.name.match(/\.(pdf)$/i) ? (
                  <iframe src={previewUrl} className="w-full h-[60vh]" />
                ) : selectedFile?.name.match(/\.(mp3|wav|ogg)$/i) ? (
                  <audio src={previewUrl} controls className="w-full" />
                ) : selectedFile?.name.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={previewUrl} controls className="w-full max-h-[60vh]" />
                ) : (
                  <div className="p-4 text-center">
                    <p>Preview not available for this file type.</p>
                    <a 
                      href={previewUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                      Open in new tab
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button asChild>
              <a 
                href={previewUrl || '#'} 
                download={selectedFile?.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
} 