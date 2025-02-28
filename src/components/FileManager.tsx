'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { Folder, File, Plus, Upload, ArrowLeft, Home } from 'lucide-react';
import { 
  listFiles, 
  uploadFile, 
  createFolder, 
  getFileUrl 
} from '@/lib/supabase-storage';
import { supabaseClient } from '@/lib/supabaseClient';

// Types for our file manager
interface FileItem {
  id: string;
  name: string;
  size?: number;
  type?: string;
  created_at?: string;
  updated_at?: string;
  url?: string;
}

interface FolderItem {
  id: string;
  name: string;
  path?: string[];
  created_at?: string;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface FileManagerProps {
  projectId: string;
  basePath: string;
  realtimeEnabled?: boolean;
}

export default function FileManager({ projectId, basePath = '', realtimeEnabled }: FileManagerProps) {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const fullPath = basePath ? (currentPath ? `${basePath}/${currentPath}` : basePath) : currentPath;
  
  // Handle real-time updates if enabled
  useEffect(() => {
    if (!realtimeEnabled || !projectId) return;
    
    // Listen for changes to files/folders tables
    const channel = supabaseClient
      .channel('file-manager-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'assets',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          // Trigger refresh when any changes are detected
          setRefreshTrigger(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'folders',
          filter: `project_id=eq.${projectId}`
        },
        () => {
          // Trigger refresh when any changes are detected
          setRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [projectId, realtimeEnabled]);
  
  // Load files whenever the path changes or refresh is triggered
  useEffect(() => {
    if (!projectId) return;
    
    loadFiles();
  }, [projectId, currentPath, refreshTrigger]);
  
  // Function to load files for the current path
  const loadFiles = async () => {
    try {
      setLoading(true);
      
      console.log('Loading files for path:', fullPath);
      
      // Use the storage API to list files
      const result = await listFiles(fullPath);
      
      if (result.error) {
        throw result.error;
      }
      
      // Update state with the retrieved files and folders
      const fileList = result.data?.filter(item => item.type === 'file') || [];
      const folderList = result.data?.filter(item => item.type === 'folder') || [];
      
      setFiles(fileList as FileItem[]);
      setFolders(folderList as FolderItem[]);
      
      // Update breadcrumbs
      if (currentPath) {
        const pathParts = currentPath.split('/');
        const breadcrumbsItems: BreadcrumbItem[] = [
          { name: 'Root', path: '' }
        ];
        
        let cumulativePath = '';
        pathParts.forEach((part, index) => {
          if (part) {
            cumulativePath += (index > 0 ? '/' : '') + part;
            breadcrumbsItems.push({
              name: part,
              path: cumulativePath
            });
          }
        });
        
        setBreadcrumbs(breadcrumbsItems);
      } else {
        setBreadcrumbs([{ name: 'Root', path: '' }]);
      }
    } catch (error: any) {
      console.error('Error loading files:', error);
      toast({
        title: 'Error',
        description: `Failed to load files: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Function to navigate into a folder
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };
  
  // Function to go up one directory level
  const navigateUp = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
  };
  
  // Function to navigate to root
  const navigateToRoot = () => {
    setCurrentPath('');
  };
  
  // Function to handle file selection
  const handleFileClick = async (file: any) => {
    try {
      setSelectedFile(file);
      
      // Get a public URL for the file
      const filePath = fullPath ? `${fullPath}/${file.name}` : file.name;
      const result = await getFileUrl(filePath, 3600);
      if (result && result.data?.signedUrl) {
        setPreviewUrl(result.data.signedUrl);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };
  
  // Handle folder creation
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a folder name',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Create the folder in storage
      const folderPath = currentPath 
        ? `${fullPath}/${newFolderName}` 
        : `${basePath}/${newFolderName}`;
      
      console.log('Creating folder at path:', folderPath);
      
      const { success, error } = await createFolder(folderPath);
      
      if (error) throw error;
      
      if (success) {
        toast({
          title: 'Success',
          description: `Folder "${newFolderName}" created`,
        });
        
        // Clear input and close dialog
        setNewFolderName('');
        setShowNewFolderDialog(false);
        
        // Refresh the file list
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: `Failed to create folder: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  
  const handleUploadComplete = () => {
    setShowUploadDialog(false);
    // Refresh the file list
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="space-y-4">
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateToRoot} 
            disabled={!currentPath}
          >
            <Home className="h-4 w-4 mr-1" />
            Root
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateUp} 
            disabled={!currentPath}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Up
          </Button>
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="mx-1">/</span>}
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto" 
                  onClick={() => navigateToFolder(crumb.path)}
                >
                  {crumb.name}
                </Button>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowNewFolderDialog(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Folder
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      
      {/* File and folder display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Folders */}
        {folders.map((folder) => (
          <Card 
            key={folder.id || folder.name} 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigateToFolder(currentPath ? `${currentPath}/${folder.name}` : folder.name)}
          >
            <CardContent className="p-4 flex items-center">
              <Folder className="h-6 w-6 mr-3 text-blue-500" />
              <div className="truncate">{folder.name}</div>
            </CardContent>
          </Card>
        ))}
        
        {/* Files */}
        {files.map((file) => (
          <Card 
            key={file.id || file.name} 
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedFile?.name === file.name ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFileClick(file)}
          >
            <CardContent className="p-4 flex items-center">
              <File className="h-6 w-6 mr-3 text-gray-500" />
              <div>
                <div className="truncate font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty state */}
        {!loading && folders.length === 0 && files.length === 0 && (
          <div className="col-span-full p-8 text-center">
            <p className="text-muted-foreground mb-4">This folder is empty</p>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowNewFolderDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Folder
              </Button>
              
              <Button 
                size="sm" 
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload File
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input 
                id="folderName" 
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)} 
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setNewFolderName('');
                setShowNewFolderDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="upload">
              <TabsList>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="p-2">
                <FileUpload 
                  projectId={projectId} 
                  onUploadComplete={handleUploadComplete} 
                />
              </TabsContent>
              <TabsContent value="info" className="p-2">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Current upload path:</p>
                  <code className="bg-muted p-2 rounded block">
                    {fullPath || 'Root'}
                  </code>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 