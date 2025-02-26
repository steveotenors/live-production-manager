import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Using the fallback version that doesn't require the extra package
import { Progress } from '@/components/ui/progress-fallback';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { Upload, X, File, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  bucketName: string;
  onUploadComplete: () => void;
  allowedFileTypes?: string[];
}

// Define a progress tracking interface
interface UploadProgress {
  loaded: number;
  total: number;
}

export default function FileUploader({ 
  bucketName, 
  onUploadComplete,
  allowedFileTypes = ['.mp3', '.wav', '.ogg', '.aac', '.pdf'] 
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Just take the first file for now
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    // Check file extension
    const fileName = selectedFile.name.toLowerCase();
    const validFileType = allowedFileTypes.some(type => fileName.endsWith(type));
    
    if (!validFileType) {
      toast({
        title: 'Invalid File Type',
        description: `Only ${allowedFileTypes.join(', ')} files are allowed.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Create a unique file name to avoid overwriting existing files
      const timestamp = new Date().getTime();
      const fileExtension = fileName.split('.').pop() || '';
      const uniqueFileName = `${fileName.split('.')[0]}_${timestamp}.${fileExtension}`;
      
      // Setup a progress tracker
      let uploadProgress = 0;
      const progressInterval = setInterval(() => {
        if (uploadProgress < 95) {
          uploadProgress += Math.random() * 5;
          setUploadProgress(Math.min(Math.round(uploadProgress), 95));
        }
      }, 200);
      
      // Upload the file
      const { error } = await supabaseClient.storage
        .from(bucketName)
        .upload(uniqueFileName, selectedFile, {
          cacheControl: '3600',
        });

      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }

      // Complete the progress
      setUploadProgress(100);

      // Success
      toast({
        title: 'Upload Successful',
        description: 'Your file has been uploaded.',
      });
      
      // Reset state after a short delay to show 100% progress
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploading(false);
        
        // Notify parent component to refresh file list
        onUploadComplete();
      }, 800);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'An error occurred during upload.',
        variant: 'destructive',
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset file selection
  const handleReset = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format the allowed file types in a readable way
  const formatAllowedTypes = () => {
    return allowedFileTypes.join(', ').replace(/\./g, '');
  };

  return (
    <div className="space-y-6">
      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border'
        } relative`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={uploading}
          accept={allowedFileTypes.join(',')}
        />
        
        <div className="text-center flex flex-col items-center justify-center py-4">
          <div className={`mb-4 rounded-full p-3 ${dragActive ? 'bg-primary/10' : 'bg-muted'}`}>
            <Upload className={`h-6 w-6 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="text-lg font-medium mb-1">
            {dragActive ? 'Drop your file here' : 'Drag and drop your file here'}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: {formatAllowedTypes()}
          </p>
        </div>
      </div>

      {/* File preview & upload button */}
      {selectedFile && !uploading && (
        <div className="bg-muted/30 rounded-lg p-4 flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-background p-2 rounded mr-3">
              <File className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm break-all">{selectedFile.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-8 w-8 p-0" 
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium">Uploading...</div>
            <div className="text-sm text-muted-foreground">{uploadProgress}%</div>
          </div>
          <Progress value={uploadProgress} />
          
          <div className="flex items-start bg-muted/30 rounded-lg p-4">
            <div className="bg-background p-2 rounded mr-3">
              <File className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{selectedFile?.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {selectedFile ? formatFileSize(selectedFile.size) : ''}
                </p>
                <p className="text-xs text-primary">
                  {uploadProgress === 100 ? 'Complete!' : 'Uploading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File restrictions info */}
      <div className="rounded-lg border p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium">File Requirements</h4>
          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
            <li>• Maximum file size: 50MB</li>
            <li>• Allowed file types: {formatAllowedTypes()}</li>
            <li>• Files will be stored in the "{bucketName}" bucket</li>
          </ul>
        </div>
      </div>

      {/* Upload button */}
      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="min-w-[120px]"
        >
          {uploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <span className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </span>
          )}
        </Button>
      </div>
    </div>
  );
} 