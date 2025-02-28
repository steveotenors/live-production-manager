'use client';

import React, { useState, useCallback, useRef } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Upload, 
  File, 
  Music, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

// Custom type to extend Supabase FileOptions
interface ExtendedFileOptions {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
  duplex?: string;
  onUploadProgress?: (progress: { loaded: number; total: number }) => void;
}

interface FileUploaderProps {
  bucketName: string;
  onUploadComplete: () => void;
  allowedFileTypes?: string[];
  maxSizeMB?: number;
  maxFiles?: number;
  currentPath?: string;
}

export default function FileUploader({
  bucketName,
  onUploadComplete,
  allowedFileTypes = ['.mp3', '.wav', '.pdf', '.doc', '.docx', '.txt'],
  maxSizeMB = 50,
  maxFiles = 10,
  currentPath = '',
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Convert allowedFileTypes to lowercase for case-insensitive comparison
  const normalizedAllowedTypes = allowedFileTypes.map(type => type.toLowerCase());
  
  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      validateAndAddFiles(selectedFiles);
    }
  };
  
  // Validate files and add valid ones to state
  const validateAndAddFiles = (selectedFiles: File[]) => {
    // Check if adding these files would exceed max files
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can only upload ${maxFiles} files at once.`,
        variant: 'destructive',
      });
      return;
    }
    
    const validFiles: File[] = [];
    const invalidFiles: { name: string; reason: string }[] = [];
    
    selectedFiles.forEach(file => {
      // Check file extension
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isValidType = normalizedAllowedTypes.includes(fileExt) || 
                         normalizedAllowedTypes.includes('*');
      
      // Check file size (convert maxSizeMB to bytes)
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      
      if (!isValidType) {
        invalidFiles.push({ 
          name: file.name, 
          reason: `Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}` 
        });
      } else if (!isValidSize) {
        invalidFiles.push({ 
          name: file.name, 
          reason: `File too large. Maximum size: ${maxSizeMB}MB` 
        });
      } else {
        // Check if file with same name already selected
        const isDuplicate = files.some(f => f.name === file.name);
        if (isDuplicate) {
          invalidFiles.push({ 
            name: file.name, 
            reason: 'File with this name already selected' 
          });
        } else {
          validFiles.push(file);
        }
      }
    });
    
    // Add valid files to state
    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
    
    // Show toast for invalid files
    if (invalidFiles.length > 0) {
      toast({
        title: `${invalidFiles.length} ${invalidFiles.length === 1 ? 'file' : 'files'} can't be uploaded`,
        description: (
          <ul className="mt-2 text-sm space-y-1 max-h-32 overflow-y-auto">
            {invalidFiles.map((file, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span className="font-medium">{file.name}</span>: {file.reason}
              </li>
            ))}
          </ul>
        ),
        variant: 'destructive',
      });
    }
    
    // Reset input value to allow uploading the same file again after removing it
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  }, [files]);
  
  // Remove file from selection
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // Upload all selected files
  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    let successCount = 0;
    
    try {
      // Initialize progress for all files
      const initialProgress = files.reduce((acc, file, index) => {
        acc[index] = 0;
        return acc;
      }, {} as { [key: string]: number });
      
      setUploadProgress(initialProgress);
      
      // Upload files sequentially to avoid rate limiting
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Handle file with special chars or spaces
        const sanitizedName = file.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace special chars with underscore
        
        // Construct full path including current directory
        const filePath = currentPath 
          ? `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${sanitizedName}`
          : sanitizedName;
        
        try {
          // We need to use XHR for progress tracking since Supabase doesn't support it directly
          const uploadPromise = new Promise<void>((resolve, reject) => {
            // Create a custom XMLHttpRequest to track progress
            const xhr = new XMLHttpRequest();
            
            // Setup progress tracking
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(prev => ({ ...prev, [i]: percentComplete }));
              }
            });
            
            // Handle completion
            xhr.addEventListener('load', async () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                successCount++;
                resolve();
              } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            });
            
            // Handle errors
            xhr.addEventListener('error', () => {
              reject(new Error('Network error during upload'));
            });
            
            // Handle aborted uploads
            xhr.addEventListener('abort', () => {
              reject(new Error('Upload aborted'));
            });
            
            // Now use Supabase for the actual upload, but track progress with our XHR
            // This is a workaround since we can't directly access XHR in Supabase client
            supabaseClient.storage
              .from(bucketName)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              })
              .then(({ data, error }) => {
                if (error) {
                  reject(error);
                } else {
                  // If supabase upload succeeds, mark as 100% complete
                  setUploadProgress(prev => ({ ...prev, [i]: 100 }));
                  resolve();
                }
              })
              .catch(reject);
            
            // Start tracking progress from 0
            setUploadProgress(prev => ({ ...prev, [i]: 0 }));
          });
          
          await uploadPromise;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadError(`Error uploading ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Small delay between uploads to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Show success message
      if (successCount > 0) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} of ${files.length} files.`,
        });
        
        // Clear files if all uploads were successful
        if (successCount === files.length) {
          setFiles([]);
        } else {
          // Remove successful uploads from the list
          const newFiles = [...files];
          const failedFiles = newFiles.filter((_, i) => uploadProgress[i] !== 100);
          setFiles(failedFiles);
        }
        
        // Notify parent component
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('An unexpected error occurred during upload');
    } finally {
      setUploading(false);
    }
  };
  
  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['.mp3', '.wav', '.ogg', '.m4a', '.flac'].some(e => e.includes(ext || ''))) {
      return <Music className="h-6 w-6 text-blue-500" />;
    } else if (['.pdf', '.doc', '.docx', '.txt'].some(e => e.includes(ext || ''))) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  return (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 ${
          dragOver ? 'border-primary bg-primary/5' : 'border-dashed border-gray-300'
        } rounded-lg p-8 transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-4 cursor-pointer">
          <Upload className={`h-12 w-12 mb-4 ${dragOver ? 'text-primary animate-bounce' : 'text-gray-400'}`} />
          <h3 className="text-lg font-medium mb-1">Drag and drop files here</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            or click to browse<br />
            {allowedFileTypes.length > 0 && (
              <span>
                Accepted files: {allowedFileTypes.join(', ')}
              </span>
            )}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={allowedFileTypes.join(',')}
            disabled={uploading}
          />
          <Button type="button" disabled={uploading} variant="outline">
            Select Files
          </Button>
        </div>
      </div>
      
      {/* Selected Files */}
      {files.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h3 className="font-medium">Selected Files ({files.length})</h3>
          </div>
          <ul className="divide-y max-h-[300px] overflow-y-auto">
            {files.map((file, index) => (
              <li key={index} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center mr-2 min-w-0 flex-1">
                  <div className="mr-3 flex-shrink-0">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {uploading ? (
                  <div className="w-32 flex items-center">
                    <Progress value={uploadProgress[index] || 0} className="h-2 flex-1 mr-2" />
                    <span className="text-xs whitespace-nowrap">
                      {uploadProgress[index] || 0}%
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
          
          {/* Upload Error */}
          {uploadError && (
            <div className="bg-red-50 border-t border-red-200 px-4 py-3">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-red-700">{uploadError}</div>
              </div>
            </div>
          )}
          
          {/* Upload Button */}
          <div className="bg-muted/30 px-4 py-3 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Max {maxFiles} files, up to {maxSizeMB}MB each
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setFiles([])}
                disabled={uploading}
              >
                Clear All
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
                className="relative min-w-[100px]"
              >
                {uploading ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-primary">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    </div>
                    <span className="opacity-0">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {files.length > 1 ? `(${files.length})` : ''}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Instructions */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-medium text-sm mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Tips for uploading files
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
          <li>Use descriptive filenames without special characters</li>
          <li>Allowed file types: {allowedFileTypes.join(', ')}</li>
          <li>Maximum file size: {maxSizeMB}MB</li>
          <li>You can upload up to {maxFiles} files at once</li>
          <li>If you're in a folder, files will be uploaded to the current folder</li>
        </ul>
      </div>
    </div>
  );
} 