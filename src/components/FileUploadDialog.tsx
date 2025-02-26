'use client';

import { useState, useRef } from 'react';
import { Upload, FolderPlus, File, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { uploadFile, createFolder } from '@/lib/supabase-storage';
import { UploadStatus } from '@/types/files';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onSuccess: () => void;
}

export function FileUploadDialog({ 
  isOpen, 
  onClose, 
  currentPath, 
  onSuccess 
}: FileUploadDialogProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...fileList]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    const uploadStatuses: UploadStatus[] = selectedFiles.map((file, index) => ({
      id: `upload-${index}`,
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploads(uploadStatuses);
    
    // Process uploads
    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        // Update progress to indicate start
        setUploads(prev => prev.map((status, idx) => 
          idx === i 
            ? { ...status, progress: 10 } 
            : status
        ));
        
        // Upload the file
        await uploadFile(selectedFiles[i], currentPath);
        
        // Update status to complete
        setUploads(prev => prev.map((status, idx) => 
          idx === i 
            ? { ...status, progress: 100, status: 'success' } 
            : status
        ));
      } catch (error) {
        console.error('Upload failed for', selectedFiles[i].name, error);
        // Update status to error
        setUploads(prev => prev.map((status, idx) => 
          idx === i 
            ? { 
                ...status, 
                status: 'error', 
                errorMessage: error instanceof Error ? error.message : 'Upload failed'
              } 
            : status
        ));
      }
    }
    
    setIsUploading(false);
    toast({
      title: "Files uploaded successfully",
      description: `${selectedFiles.length} file(s) have been uploaded`,
    });
    
    // Reset and refresh the file list
    onSuccess();
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the new folder",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createFolder(currentPath, folderName.trim());
      toast({
        title: "Folder created",
        description: `Folder "${folderName}" has been created`
      });
      setFolderName('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast({
        title: "Failed to create folder",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const resetDialog = () => {
    setSelectedFiles([]);
    setUploads([]);
    setFolderName('');
    setIsUploading(false);
    setActiveTab('upload');
  };

  const handleClose = () => {
    if (!isUploading) {
      resetDialog();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="folder" className="flex items-center">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="files">Select files to upload</Label>
              <div className="mt-2">
                <div
                  className="border-2 border-dashed rounded-md p-8 text-center hover:border-primary/50 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop your files here or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Up to 200MB per file
                  </p>
                  <input
                    id="files"
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="max-h-[200px] overflow-y-auto border rounded-md">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-2 border-b last:border-0"
                    >
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[300px]">
                          {file.name}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeSelectedFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {uploads.length > 0 && (
              <div className="space-y-3 mt-4">
                {uploads.map(upload => (
                  <div key={upload.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate max-w-[350px]">{upload.fileName}</span>
                      <span className={
                        upload.status === 'success' 
                          ? 'text-green-600' 
                          : upload.status === 'error' 
                            ? 'text-red-600' 
                            : 'text-muted-foreground'
                      }>
                        {upload.status === 'success' 
                          ? 'Completed' 
                          : upload.status === 'error' 
                            ? 'Failed' 
                            : `${upload.progress}%`
                        }
                      </span>
                    </div>
                    <Progress value={upload.progress} className="h-1" />
                    {upload.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{upload.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="folder" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-1"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          {activeTab === 'upload' ? (
            <Button 
              onClick={handleUploadFiles} 
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          ) : (
            <Button 
              onClick={handleCreateFolder}
              disabled={!folderName.trim()}
            >
              Create Folder
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 