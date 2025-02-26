'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { Progress } from '@/components/ui/progress-fallback';
import { FileUploadStatus } from '@/types/files';
import { UploadIcon, FileIcon, XIcon, AlertCircle, Check } from 'lucide-react';

// Create an interface for component props
interface FileUploaderProps {
  bucketName: string;
  onUploadComplete?: () => void;
  allowedFileTypes?: string[];
  currentPath?: string;
}

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function FileUploader({ 
  bucketName, 
  onUploadComplete,
  allowedFileTypes = ['.mp3', '.wav', '.ogg', '.pdf', '.doc', '.docx', '.txt'],
  currentPath = '',
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<FileUploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles(filesArray);
      setUploadStatus(filesArray.map(file => ({
        file,
        progress: 0,
        status: 'pending'
      })));
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);
  
  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const fileList = e.dataTransfer.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles(filesArray);
      setUploadStatus(filesArray.map(file => ({
        file,
        progress: 0,
        status: 'pending'
      })));
    }
  }, []);

  // Upload the selected files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    // Update all status to 'uploading'
    setUploadStatus(prev => prev.map(item => ({
      ...item,
      status: 'uploading',
    })));

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      
      // Check for file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadStatus(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: 'error',
            progress: 0,
            error: 'File exceeds the maximum size limit (10MB)'
          };
          return updated;
        });
        continue;
      }
      
      // Check for file type
      const fileExt = fileName.split('.').pop()?.toLowerCase();
      if (!fileExt || !allowedFileTypes.some(type => 
        type.toLowerCase() === `.${fileExt}` || type.toLowerCase() === fileExt
      )) {
        setUploadStatus(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: 'error',
            progress: 0,
            error: `File type .${fileExt} is not allowed`
          };
          return updated;
        });
        continue;
      }

      try {
        // Create a unique file name to avoid overwriting
        const timestamp = new Date().getTime();
        const uniqueName = `${fileName.substring(0, fileName.lastIndexOf('.'))}-${timestamp}.${fileExt}`;
        
        // Build path incorporating the current folder path
        let fullPath = currentPath;
        if (fullPath && !fullPath.endsWith('/')) {
          fullPath += '/';
        }
        fullPath += uniqueName;

        // Track upload progress
        let uploadProgress = 0;

        // Create an XHR to track progress
        const xhr = new XMLHttpRequest();
        
        // Create a promise that resolves with the upload result
        const uploadPromise = new Promise<void>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              uploadProgress = Math.round((event.loaded / event.total) * 100);
              // Update progress in state
              setUploadStatus(prev => {
                const updated = [...prev];
                updated[i] = {
                  ...updated[i],
                  progress: uploadProgress
                };
                return updated;
              });
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });
          
          xhr.addEventListener('error', () => {
            reject(new Error('Network error occurred during upload'));
          });
          
          xhr.addEventListener('abort', () => {
            reject(new Error('Upload was aborted'));
          });
        });
        
        // Start the upload using Supabase
        const { error } = await supabaseClient.storage
          .from(bucketName)
          .upload(fullPath, file, {
            cacheControl: '3600',
            upsert: false,
            // Use type assertion to work around the type error with xhr
            ...(xhr ? { xhr } as any : {})
          });
          
        // Wait for the XHR promise to resolve/reject
        await uploadPromise;

        if (error) {
          throw error;
        }

        // Update status to completed
        setUploadStatus(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: 'completed',
            progress: 100,
            path: fullPath
          };
          return updated;
        });

        toast({
          title: 'Upload Complete',
          description: `${fileName} has been uploaded successfully.`,
        });
      } catch (error) {
        console.error('Upload error:', error);
        
        // Update status to error
        setUploadStatus(prev => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown upload error'
          };
          return updated;
        });

        toast({
          title: 'Upload Failed',
          description: error instanceof Error ? error.message : 'Unknown upload error',
          variant: 'destructive',
        });
      }
    }

    setIsUploading(false);
    
    // If all completed successfully, invoke the callback
    if (uploadStatus.every(item => item.status === 'completed')) {
      if (onUploadComplete) {
        onUploadComplete();
      }
    }
  };

  // Reset all state
  const resetFiles = () => {
    setSelectedFiles([]);
    setUploadStatus([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format list of allowed file types
  const formatAllowedTypes = () => {
    return allowedFileTypes.join(', ');
  };

  // Format file size in human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {currentPath && (
        <div className="p-3 border rounded-md bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Files will be uploaded to: <span className="font-medium">{currentPath.length > 0 ? currentPath : 'Root directory'}</span>
          </p>
        </div>
      )}
    
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <UploadIcon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Select Files
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/30 p-3 border-b">
            <h3 className="font-medium">Selected Files</h3>
          </div>
          <ul className="divide-y">
            {uploadStatus.map((status, index) => (
              <li key={`${status.file.name}-${index}`} className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{status.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(status.file.size)}
                      </p>
                    </div>
                  </div>
                  {!isUploading && status.status !== 'completed' && (
                    <button
                      onClick={() => {
                        // Remove this file from both arrays
                        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                        setUploadStatus(prev => prev.filter((_, i) => i !== index));
                      }}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="mt-2">
                  <Progress value={status.progress} className="h-2" />
                </div>
                
                <div className="mt-1 flex justify-between items-center">
                  <div className="text-xs">
                    {status.status === 'pending' && 'Ready to upload'}
                    {status.status === 'uploading' && `Uploading: ${status.progress}%`}
                    {status.status === 'completed' && (
                      <span className="text-green-600 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Complete
                      </span>
                    )}
                    {status.status === 'error' && (
                      <span className="text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {status.error}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {status.progress}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t p-3 bg-muted/10 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFiles}
              disabled={isUploading}
            >
              Clear All
            </Button>
            <Button 
              size="sm"
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Maximum file size: 10MB</p>
        <p>Allowed file types: {formatAllowedTypes()}</p>
      </div>
    </div>
  );
} 