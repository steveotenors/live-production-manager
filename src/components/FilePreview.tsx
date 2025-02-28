'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Download, 
  Maximize2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  FileText, 
  Eye,
  Image as ImageIcon,
  Music,
  File
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

interface FilePreviewProps {
  file: {
    name: string;
    url: string;
    type?: string;
    size?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose }) => {
  // Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  // Image states
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // PDF states
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Determine file type
  const getFileType = (): 'image' | 'audio' | 'pdf' | 'video' | 'text' | 'unknown' => {
    if (!file) return 'unknown';
    
    const fileName = file.name.toLowerCase();
    const mimeType = file.type?.toLowerCase() || '';
    
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)) return 'image';
    if (fileName.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/)) return 'audio';
    if (fileName.match(/\.(mp4|webm|ogv|mov|avi)$/)) return 'video';
    if (fileName.match(/\.(pdf)$/)) return 'pdf';
    if (fileName.match(/\.(txt|md|rtf)$/)) return 'text';
    
    // Check by mime type as fallback
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('text/')) return 'text';
    
    return 'unknown';
  };
  
  // Audio player functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsImageLoading(true);
      setImageError(null);
      setIsPdfLoading(true);
      setPdfError(null);
    }
  }, [isOpen]);
  
  // Get appropriate file icon
  const getFileIcon = () => {
    const fileType = getFileType();
    
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-12 w-12 text-blue-500" />;
      case 'audio':
        return <Music className="h-12 w-12 text-green-500" />;
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-500" />;
      case 'video':
        return <Play className="h-12 w-12 text-purple-500" />;
      case 'text':
        return <FileText className="h-12 w-12 text-orange-500" />;
      default:
        return <File className="h-12 w-12 text-gray-500" />;
    }
  };
  
  // Render preview based on file type
  const renderPreview = () => {
    if (!file) return null;
    
    const fileType = getFileType();
    
    switch (fileType) {
      case 'image':
        return (
          <div className="relative flex items-center justify-center h-full w-full bg-black/5">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {imageError && (
              <div className="text-center p-6">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Unable to preview this image.</p>
                <p className="text-sm text-red-500 mt-2">{imageError}</p>
              </div>
            )}
            <img
              src={file.url}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
              style={{ display: isImageLoading ? 'none' : 'block' }}
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                setIsImageLoading(false);
                setImageError('Failed to load image');
              }}
            />
          </div>
        );
        
      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-6 max-w-xl mx-auto">
            <div className="mb-8 bg-muted/30 rounded-lg p-8 w-full text-center">
              <Music className="h-24 w-24 text-primary/60 mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-1">{file.name}</h3>
              {duration > 0 && (
                <p className="text-sm text-muted-foreground">
                  Duration: {formatTime(duration)}
                </p>
              )}
            </div>
            
            <audio
              ref={audioRef}
              src={file.url}
              className="hidden"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div className="w-full space-y-6">
              {/* Progress/seek slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
              
              {/* Audio controls */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={skipBackward}
                  className="rounded-full"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={togglePlayPause}
                  className="h-14 w-14 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={skipForward}
                  className="rounded-full"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Volume control */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-28"
                />
              </div>
            </div>
          </div>
        );
        
      case 'pdf':
        return (
          <div className="relative w-full h-full">
            {isPdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {pdfError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Unable to preview this PDF.</p>
                  <p className="text-sm text-red-500 mt-2">{pdfError}</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`${file.url}#toolbar=0`}
              className="w-full h-full border-0"
              title={`Preview of ${file.name}`}
              onLoad={() => setIsPdfLoading(false)}
              onError={() => {
                setIsPdfLoading(false);
                setPdfError('Failed to load PDF');
              }}
            />
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12">
            {getFileIcon()}
            <h3 className="mt-4 font-medium">No preview available</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This file type cannot be previewed. Please download the file to view it.
            </p>
            <Button 
              className="mt-6"
              onClick={() => window.open(file.url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>{file?.name}</DialogTitle>
        </DialogHeader>
        
        {/* Header with file name and controls */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {file && getFileIcon()}
            <h2 className="ml-3 text-lg font-medium truncate max-w-lg">{file?.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => file && window.open(file.url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => file && window.open(file.url, '_blank')}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {renderPreview()}
        </div>
        
        {/* Footer with additional info */}
        <div className="p-3 border-t text-xs text-muted-foreground bg-muted/30">
          {file && (
            <>
              <span>File type: {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}</span>
              {file.size && (
                <span className="ml-4">
                  Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview; 