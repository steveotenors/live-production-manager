'use client';

import { useState } from 'react';
import { 
  FileText, 
  Music, 
  Video, 
  File, 
  Image as ImageIcon, 
  Download, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Eye, 
  Code 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  size?: number;
  updated?: string;
  path: string;
  url?: string;
};

interface FilePreviewProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void; // For folder navigation
}

export function FilePreview({ file, isOpen, onClose, onNavigate }: FilePreviewProps) {
  const [imageError, setImageError] = useState(false);

  if (!file) return null;

  function formatSize(bytes?: number): string {
    if (bytes === undefined) return '-';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function getFileIcon() {
    if (!file) return <File className="h-6 w-6 text-gray-500" />;
    
    if (file.type === 'folder') {
      return <FileText className="h-6 w-6 text-blue-500" />;
    }
    
    switch (file.fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-rose-500" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Music className="h-6 w-6 text-purple-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <Video className="h-6 w-6 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className="h-6 w-6 text-green-500" />;
      case 'txt':
      case 'md':
        return <FileText className="h-6 w-6 text-gray-500" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'json':
        return <Code className="h-6 w-6 text-amber-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  }

  function renderPreviewContent() {
    if (!file) return null;
    
    if (file.type === 'folder') {
      // Mock folder content for demo - in real app, fetch folder contents
      const folderContents = [
        { id: 'f1', name: 'Example File 1.pdf', type: 'file', fileType: 'pdf', size: 2.4 * 1024 * 1024, path: `${file.path}/example-file-1.pdf` },
        { id: 'f2', name: 'Example File 2.mp3', type: 'file', fileType: 'mp3', size: 8.7 * 1024 * 1024, path: `${file.path}/example-file-2.mp3` },
        { id: 'f3', name: 'Subfolder', type: 'folder', path: `${file.path}/subfolder` },
      ];
      
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Folder contents:</p>
          <div className="border rounded-md divide-y">
            {folderContents.map((item) => (
              <div 
                key={item.id}
                className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                onClick={() => onNavigate?.(item.path)}
              >
                <div className="flex items-center">
                  {item.type === 'folder' ? (
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500 mr-2" />
                  )}
                  <span>{item.name}</span>
                </div>
                {item.type === 'file' && (
                  <span className="text-sm text-muted-foreground">{formatSize(item.size)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // File preview based on file type
    const fileType = file.fileType?.toLowerCase();
    
    // PDF Preview
    if (fileType === 'pdf' && file.url) {
      return (
        <div className="h-[400px] w-full border rounded-md overflow-hidden">
          <iframe 
            src={`${file.url}#toolbar=0`} 
            className="w-full h-full"
            title={file.name}
          />
        </div>
      );
    }
    
    // Image Preview
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType || '') && file.url) {
      return (
        <>
          {!imageError ? (
            <div className="max-h-[400px] flex items-center justify-center overflow-hidden border rounded-md p-2">
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-w-full max-h-[380px] object-contain"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="p-8 text-center border rounded-md">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Unable to preview image</p>
            </div>
          )}
        </>
      );
    }
    
    // Audio Preview
    if (['mp3', 'wav', 'ogg'].includes(fileType || '') && file.url) {
      return (
        <div className="p-6 border rounded-md">
          <div className="w-full mb-6 flex justify-center">
            <Music className="h-16 w-16 text-purple-500" />
          </div>
          <audio controls className="w-full">
            <source src={file.url} type={`audio/${fileType}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    
    // Video Preview
    if (['mp4', 'mov', 'webm'].includes(fileType || '') && file.url) {
      return (
        <div className="border rounded-md overflow-hidden">
          <video controls className="w-full max-h-[400px]">
            <source src={file.url} type={`video/${fileType}`} />
            Your browser does not support the video element.
          </video>
        </div>
      );
    }
    
    // Text/Code Preview (mock for demonstration)
    if (['txt', 'md', 'js', 'ts', 'html', 'css', 'json'].includes(fileType || '')) {
      return (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-2 border-b">
            <span className="text-sm font-mono">{file.name}</span>
          </div>
          <pre className="p-4 text-sm font-mono bg-muted/30 max-h-[380px] overflow-auto">
            {/* Mock text content - in real app, fetch file content */}
            {`// This is a preview of ${file.name}
// In a real application, the file content would be loaded here.

function example() {
  console.log("Hello world!");
  return true;
}

// File size: ${formatSize(file.size)}
// Last updated: ${file.updated || 'Unknown'}`}
          </pre>
        </div>
      );
    }
    
    // Default - No preview available
    return (
      <div className="p-12 text-center border rounded-md">
        <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-6">This file type cannot be previewed directly.</p>
        <div className="flex justify-center">
          {file.url && (
            <Button className="mr-2">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          )}
          {file.url && (
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" /> Open in new tab
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            {getFileIcon()}
            <div>
              <DialogTitle className="text-xl">{file.name}</DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">
                  {file.type === 'folder' ? 'Folder' : file.fileType?.toUpperCase() || 'File'}
                </Badge>
                {file.size && (
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatSize(file.size)}
                  </span>
                )}
                {file.updated && (
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {file.updated}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {renderPreviewContent()}
        </div>
        
        <DialogFooter className="mt-6">
          {file.type !== 'folder' && file.url && (
            <Button className="mr-2" onClick={() => window.open(file.url, '_blank')}>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          )}
          {file.type === 'folder' && (
            <Button onClick={() => onNavigate?.(file.path)}>
              <Eye className="h-4 w-4 mr-2" /> Open Folder
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 