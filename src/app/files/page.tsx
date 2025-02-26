'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient, checkBucketSettings } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import FileUploader from '@/components/FileUploader';
import { 
  FileIcon, 
  DownloadIcon, 
  RefreshCw, 
  Grid, 
  List, 
  Search, 
  AlertCircle, 
  ChevronDown, 
  Filter,
  Music,
  FileText,
  Info,
  X,
  Maximize2,
  Eye,
  Trash2,
  FolderPlus,
  Folder,
  ChevronRight,
  Home,
  UploadIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { deleteFile, createFolder, listFiles } from '@/lib/supabase-storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BreadcrumbItem, FileItem } from '@/types/files';
import { Toaster } from '@/components/ui/toaster';

// Instead of using styled-jsx, which is causing issues, use a standard style tag
const dragDropStyles = `
  .potential-drop-target {
    outline: 2px dashed #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }
  .folder-item.drag-over {
    background-color: rgba(59, 130, 246, 0.2) !important;
    outline: 2px solid #3b82f6 !important;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
`;

// Extend FileItem to include the properties from Supabase objects
interface ExtendedFileItem extends FileItem {
  metadata?: {
    size?: number;
    mimetype?: string;
  };
  created_at?: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<ExtendedFileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<ExtendedFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [bucketInfo, setBucketInfo] = useState<any>(null);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{name: string, url: string} | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{path: string, isFolder: boolean} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [draggedFile, setDraggedFile] = useState<ExtendedFileItem | null>(null);
  const [isFolderDragOver, setIsFolderDragOver] = useState(false);
  const [isMovingFile, setIsMovingFile] = useState(false);
  const bucketName = 'production-files';
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | null>(null);
  const [contextMenuFile, setContextMenuFile] = useState<ExtendedFileItem | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressDuration = 500; // ms
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState<ExtendedFileItem | null>(null);
  const [availableFolders, setAvailableFolders] = useState<ExtendedFileItem[]>([]);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [audioFile, setAudioFile] = useState<{name: string, url: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLInputElement>(null);

  // File type categories
  const fileTypes = {
    'audio': ['.mp3', '.wav', '.ogg', '.aac'],
    'document': ['.pdf', '.doc', '.docx', '.txt'],
  };

  // Load files on component mount or when currentPath changes
  useEffect(() => {
    loadFiles();
    diagnoseStorageAccess();
    checkUserRole();
  }, [currentPath]);

  // Update breadcrumbs when currentPath changes
  useEffect(() => {
    const updateBreadcrumbs = () => {
      // Start with home
      const items: BreadcrumbItem[] = [
        { name: 'Home', path: '' }
      ];
      
      // If we're in a subfolder, add each path segment
      if (currentPath) {
        const segments = currentPath.split('/').filter(Boolean);
        let cumulativePath = '';
        
        segments.forEach(segment => {
          cumulativePath += `${segment}/`;
          items.push({
            name: segment,
            path: cumulativePath
          });
        });
      }
      
      setBreadcrumbs(items);
    };
    
    updateBreadcrumbs();
  }, [currentPath]);

  // Filter and sort files when dependencies change
  useEffect(() => {
    const filtered = files.filter(file => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        file.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply type filter
      const matchesType = !filterType || 
        fileTypes[filterType as keyof typeof fileTypes].some(ext => 
          file.type === 'file' && file.name.toLowerCase().endsWith(ext));
      
      return matchesSearch && matchesType;
    });

    // Sort the filtered files
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.updated || 0).getTime() - new Date(b.updated || 0).getTime()
          : new Date(b.updated || 0).getTime() - new Date(a.updated || 0).getTime();
      } else { // size
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        return sortOrder === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      }
    });

    setFilteredFiles(sorted);
  }, [files, searchQuery, filterType, sortBy, sortOrder]);

  // Diagnose storage access issues
  const diagnoseStorageAccess = async () => {
    try {
      setLoading(true);
      
      // Simple check of bucket settings
      const result = await checkBucketSettings();
      setBucketInfo(result);
      
      if (!result.success) {
        setBucketError(result.message);
      } else {
        // Clear any previous errors since we have access
        setBucketError(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error diagnosing storage access:', error);
      setBucketError('Failed to diagnose storage access');
      setLoading(false);
    }
  };

  // Load files from Supabase storage
  const loadFiles = async () => {
    try {
      setLoading(true);
      console.log('Loading files from bucket:', bucketName, 'path:', currentPath);
      
      // Get files from Supabase storage
      const { data: fileData, error } = await supabaseClient.storage
        .from(bucketName)
        .list(currentPath, {
          sortBy: { column: 'name', order: 'asc' },
        });
      
      if (error) {
        console.error('Error loading files:', error.message);
        toast({
          title: 'Error',
          description: `Failed to load files: ${error.message}`,
          variant: 'destructive',
        });
        setFiles([]);
        setLoading(false);
        return;
      }
      
      if (fileData) {
        console.log('===== RAW SUPABASE DATA =====');
        console.log(JSON.stringify(fileData, null, 2));
        console.log('Raw files data:', fileData);
        
        // Process files to identify folders and regular files
        const processedFiles: ExtendedFileItem[] = fileData.map((item: any): ExtendedFileItem => {
          // If it's an entry with null metadata or a .folder file, treat it as a folder
          // In Supabase, folders appear as entries with null metadata
          const isFolder = item.metadata === null || 
                          item.name.endsWith('.folder') || 
                          item.metadata?.mimetype === 'application/x-directory';
          
          if (isFolder) {
            // For folders, clean up the name if it has .folder extension
            const displayName = item.name.endsWith('.folder') 
              ? item.name.replace('.folder', '') 
              : item.name;
              
            const folderPath = currentPath 
              ? `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${displayName}/` 
              : `${displayName}/`;
            
            return {
              id: `folder-${folderPath}`,
              name: displayName,
              path: folderPath,
              type: 'folder' as const,
              size: 0,
              updated: item.updated_at || item.created_at,
              created_at: item.created_at
            };
          }
          
          // Otherwise, it's a regular file
          const filePath = currentPath 
            ? `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${item.name}` 
            : item.name;
          
          return {
            id: `file-${filePath}`,
            name: item.name,
            path: filePath,
            type: 'file' as const,
            size: item.metadata?.size || 0,
            updated: item.updated_at || item.created_at,
            metadata: item.metadata,
            created_at: item.created_at
          };
        });
        
        console.log('Processed files:', processedFiles);
        setFiles(processedFiles);
      } else {
        setFiles([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('File loading error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load files. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Download a file
  const handleDownload = async (fileName: string) => {
    try {
      console.log('Downloading file:', fileName);
      
      // Get file URL - use full path if it looks like one, otherwise construct from current path
      const filePath = fileName.includes('/') 
        ? fileName 
        : `${currentPath}${currentPath.endsWith('/') || !currentPath ? '' : '/'}${fileName}`;
      
      // Get file URL
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .createSignedUrl(filePath, 60); // URL valid for 60 seconds
      
      if (error) {
        console.error('Error generating download URL:', error.message);
        toast({
          title: 'Download Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (data?.signedUrl) {
        // Open the URL in a new tab
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'Unable to download the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const lowerName = fileName.toLowerCase();
    
    if (fileTypes.audio.some(ext => lowerName.endsWith(ext))) {
      return <Music className="h-10 w-10 text-blue-500" />;
    } else if (fileTypes.document.some(ext => lowerName.endsWith(ext))) {
      return <FileText className="h-10 w-10 text-orange-500" />;
    } else {
      return <FileIcon className="h-10 w-10 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  // Check if file is previewable
  const isPreviewable = (fileName: string) => {
    const lowerName = fileName.toLowerCase();
    return lowerName.endsWith('.pdf');
  };

  // Preview a file
  const handlePreview = async (fileName: string) => {
    try {
      console.log('Previewing file:', fileName);
      
      // Get file URL - use full path if it looks like one, otherwise construct from current path
      const filePath = fileName.includes('/') 
        ? fileName 
        : `${currentPath}${currentPath.endsWith('/') || !currentPath ? '' : '/'}${fileName}`;
      
      // Get file URL
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600); // URL valid for 1 hour
      
      if (error) {
        console.error('Error generating preview URL:', error.message);
        toast({
          title: 'Preview Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (data?.signedUrl) {
        setPreviewFile({
          name: fileName.split('/').pop() || fileName,
          url: data.signedUrl
        });
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: 'Preview Failed',
        description: 'Unable to preview the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle file deletion
  const handleDeleteClick = (filePath: string, isFolder: boolean = false) => {
    // Construct the full path for the file in the bucket
    setFileToDelete({path: filePath, isFolder});
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    
    try {
      setIsDeleting(true);
      
      if (fileToDelete.isFolder) {
        // For folders, we need to delete all files inside first
        console.log('Deleting folder:', fileToDelete.path);
        
        // List all files in the folder
        const { data: folderContents, error: listError } = await supabaseClient.storage
          .from(bucketName)
          .list(fileToDelete.path, {
            sortBy: { column: 'name', order: 'asc' },
          });
        
        if (listError) {
          throw listError;
        }
        
        // Delete all files in the folder
        if (folderContents && folderContents.length > 0) {
          const filesToDelete = folderContents.map(item => 
            `${fileToDelete.path}${fileToDelete.path.endsWith('/') ? '' : '/'}${item.name}`
          );
          
          // Delete files in batches of 10
          while (filesToDelete.length > 0) {
            const batch = filesToDelete.splice(0, 10);
            const { error: deleteError } = await supabaseClient.storage
              .from(bucketName)
              .remove(batch);
            
            if (deleteError) {
              console.error('Error deleting folder contents:', deleteError);
            }
          }
        }
        
        // Finally, delete the folder marker file if it exists
        const folderMarkerPath = `${fileToDelete.path}${fileToDelete.path.endsWith('/') ? '' : '/'}`;
        const { error: markerError } = await supabaseClient.storage
          .from(bucketName)
          .remove([`${folderMarkerPath}.folder`]);
        
        if (markerError) {
          console.log('No marker file found or error deleting marker:', markerError);
        }
      } else {
        // For regular files, just delete them
        await deleteFile(fileToDelete.path);
      }
      
      toast({
        title: fileToDelete.isFolder ? 'Folder Deleted' : 'File Deleted',
        description: `${fileToDelete.path.split('/').pop()} has been deleted.`,
      });
      
      // Refresh file list after a small delay to allow Supabase to process the deletion
      setTimeout(() => {
        loadFiles();
      }, 500);
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  // Navigate to a folder
  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  // Handle creating a new folder
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
      setIsCreatingFolder(true);
      const folderName = newFolderName.trim();
      
      // Create a .folder file as a marker for the folder
      const folderPath = currentPath 
        ? `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${folderName}` 
        : folderName;
      
      console.log('===== CREATING FOLDER =====');
      console.log('Folder name:', folderName);
      console.log('Current path:', currentPath);
      console.log('Full folder path to create:', `${folderPath}/.folder`);
      
      // Create an empty .folder file in the path
      const { error } = await supabaseClient.storage
        .from(bucketName)
        .upload(`${folderPath}/.folder`, new File([], `${folderName}.folder`));
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Folder Created',
        description: `${folderName} has been created successfully.`,
      });
      
      // Reset state and refresh
      setNewFolderName('');
      setIsNewFolderDialogOpen(false);
      await loadFiles();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Failed to Create Folder',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Add a check for the musical_director role
  const checkUserRole = async () => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        return;
      }
      
      if (data && data.user) {
        const role = data.user.user_metadata?.role || 
                     data.user.app_metadata?.role || 
                     null;
        setUserRole(role);
        console.log('[DEBUG-Auth] User role:', role);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  // Move a file
  const moveFile = async (file: ExtendedFileItem, targetPath: string) => {
    if (file.type !== 'file') {
      toast({
        title: 'Operation Not Supported',
        description: 'Only files can be moved. Folder moving is not supported yet.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsMovingFile(true);
      
      // Construct source and target paths
      const sourcePath = file.path;
      let filename = file.name;
      const targetFilePath = targetPath 
        ? `${targetPath}${targetPath.endsWith('/') ? '' : '/'}${filename}` 
        : filename;
      
      console.log('Moving file from:', sourcePath, 'to:', targetFilePath);
      
      // Check if file with same name exists at target
      const { data: existingFiles, error: listError } = await supabaseClient.storage
        .from(bucketName)
        .list(targetPath, {
          limit: 100,
        });
      
      if (listError) {
        throw listError;
      }
      
      // If file with same name exists, add timestamp to filename
      if (existingFiles?.some(f => f.name === filename)) {
        const timestamp = new Date().getTime();
        const fileExt = filename.includes('.') ? `.${filename.split('.').pop()}` : '';
        const baseName = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;
        filename = `${baseName}_${timestamp}${fileExt}`;
        
        console.log('File with same name exists. New filename:', filename);
      }
      
      // Download the file from source
      const { data: fileData, error: downloadError } = await supabaseClient.storage
        .from(bucketName)
        .download(sourcePath);
      
      if (downloadError) {
        throw downloadError;
      }
      
      if (!fileData) {
        throw new Error('File data is null');
      }
      
      // Upload to target
      const { error: uploadError } = await supabaseClient.storage
        .from(bucketName)
        .upload(targetFilePath, fileData, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Delete from source
      const { error: deleteError } = await supabaseClient.storage
        .from(bucketName)
        .remove([sourcePath]);
      
      if (deleteError) {
        throw deleteError;
      }
      
      toast({
        title: 'File Moved',
        description: `${file.name} has been moved successfully.`,
      });
      
      // Refresh file list
      await loadFiles();
    } catch (error) {
      console.error('Error moving file:', error);
      toast({
        title: 'Move Failed',
        description: error instanceof Error ? error.message : 'Failed to move file',
        variant: 'destructive',
      });
    } finally {
      setIsMovingFile(false);
      setDraggedFile(null);
      setDraggedOver(null);
    }
  };

  // Handle context menu for file actions
  const handleContextMenu = (e: React.MouseEvent, file: ExtendedFileItem) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuFile(file);
  };
  
  // Handle long press for touch devices
  const handleTouchStart = (file: ExtendedFileItem) => {
    longPressTimer.current = setTimeout(() => {
      // Calculate position (center of the element)
      const element = document.getElementById(`file-item-${file.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        setContextMenuPosition({ x, y });
        setContextMenuFile(file);
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, longPressDuration);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  // Close context menu
  const closeContextMenu = () => {
    setContextMenuFile(null);
    setContextMenuPosition(null);
  };

  // Get all available folders for the move dialog
  const loadAllFolders = async () => {
    try {
      setLoading(true);
      
      // Get files and folders from root directory first
      const { data: rootItems, error: rootError } = await supabaseClient.storage
        .from(bucketName)
        .list('', {
          sortBy: { column: 'name', order: 'asc' },
        });
      
      if (rootError) {
        throw rootError;
      }
      
      // Process folders
      let folders: ExtendedFileItem[] = [];
      
      // Add root directory option
      folders.push({
        id: 'folder-root',
        name: 'Root Directory',
        path: '',
        type: 'folder' as const,
        size: 0,
        updated: new Date().toISOString(),
      });
      
      // Add folders from root directory
      if (rootItems) {
        const rootFolders = rootItems.filter(item => 
          item.metadata === null || 
          item.name.endsWith('.folder') ||
          item.metadata?.mimetype === 'application/x-directory'
        );
        
        for (const folder of rootFolders) {
          const displayName = folder.name.endsWith('.folder') 
            ? folder.name.replace('.folder', '') 
            : folder.name;
          
          folders.push({
            id: `folder-${displayName}/`,
            name: displayName,
            path: `${displayName}/`,
            type: 'folder' as const,
            size: 0,
            updated: folder.updated_at || folder.created_at,
            created_at: folder.created_at
          });
          
          // Todo: For a more complete solution, we could recursively load subfolders here
        }
      }
      
      setAvailableFolders(folders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load folders. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Handle opening the move dialog
  const handleMoveClick = (file: ExtendedFileItem) => {
    if (file.type !== 'file') {
      toast({
        title: 'Operation Not Supported',
        description: 'Only files can be moved. Folder moving is not supported yet.',
        variant: 'destructive',
      });
      return;
    }
    
    setFileToMove(file);
    loadAllFolders();
    setIsMoveDialogOpen(true);
  };

  // Handle move to selected folder
  const handleMoveToFolder = async (targetPath: string) => {
    if (!fileToMove) return;
    
    try {
      setIsMovingFile(true);
      setIsMoveDialogOpen(false);
      
      await moveFile(fileToMove, targetPath);
      
      // Cleanup
      setFileToMove(null);
    } catch (error) {
      console.error('Error moving file:', error);
      toast({
        title: 'Move Failed',
        description: error instanceof Error ? error.message : 'Failed to move file',
        variant: 'destructive',
      });
    } finally {
      setIsMovingFile(false);
    }
  };

  // Check if file is audio
  const isAudioFile = (fileName: string) => {
    const lowerName = fileName.toLowerCase();
    return fileTypes.audio.some(ext => lowerName.endsWith(ext));
  };

  // Play an audio file
  const handlePlayAudio = async (fileName: string) => {
    try {
      console.log('Playing audio file:', fileName);
      
      // Get file URL - use full path if it looks like one, otherwise construct from current path
      const filePath = fileName.includes('/') 
        ? fileName 
        : `${currentPath}${currentPath.endsWith('/') || !currentPath ? '' : '/'}${fileName}`;
      
      // Get file URL
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600); // URL valid for 1 hour
      
      if (error) {
        console.error('Error generating audio URL:', error.message);
        toast({
          title: 'Audio Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      if (data?.signedUrl) {
        setAudioFile({
          name: fileName.split('/').pop() || fileName,
          url: data.signedUrl
        });
        setIsAudioPlayerOpen(true);
        setIsPlaying(true);
        
        // Start playback when dialog opens (handled by useEffect)
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      toast({
        title: 'Playback Failed',
        description: 'Unable to play the audio file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Control audio playback
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle seeking when user interacts with the slider
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = Number(e.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Update the current time as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Get duration when audio metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Effect to handle audio playback when dialog opens
  useEffect(() => {
    if (isAudioPlayerOpen && audioRef.current && isPlaying) {
      // Small delay to ensure the audio element is ready
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [isAudioPlayerOpen, audioFile]);

  // Reset audio state when dialog closes
  const handleAudioDialogClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsAudioPlayerOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Add the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: dragDropStyles }} />
      
      <Tabs defaultValue="files" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="upload" ref={uploadButtonRef}>Upload</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setView('grid')}
              className={view === 'grid' ? 'bg-primary/10' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setView('list')}
              className={view === 'list' ? 'bg-primary/10' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-2xl">Files</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search files..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsNewFolderDialogOpen(true)}
                    title="Create new folder"
                    className="gap-1"
                  >
                    <FolderPlus className="h-4 w-4 mr-1" />
                    New Folder
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem 
                        onClick={() => setFilterType(null)}
                        className={!filterType ? 'bg-accent/50' : ''}
                      >
                        All Files
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterType('audio')}
                        className={filterType === 'audio' ? 'bg-accent/50' : ''}
                      >
                        Audio Files
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterType('document')}
                        className={filterType === 'document' ? 'bg-accent/50' : ''}
                      >
                        Documents
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-1">
                        Sort
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem 
                        onClick={() => { setSortBy('name'); setSortOrder('asc'); }}
                        className={sortBy === 'name' && sortOrder === 'asc' ? 'bg-accent/50' : ''}
                      >
                        Name (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSortBy('name'); setSortOrder('desc'); }}
                        className={sortBy === 'name' && sortOrder === 'desc' ? 'bg-accent/50' : ''}
                      >
                        Name (Z-A)
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSortBy('date'); setSortOrder('desc'); }}
                        className={sortBy === 'date' && sortOrder === 'desc' ? 'bg-accent/50' : ''}
                      >
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSortBy('date'); setSortOrder('asc'); }}
                        className={sortBy === 'date' && sortOrder === 'asc' ? 'bg-accent/50' : ''}
                      >
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSortBy('size'); setSortOrder('desc'); }}
                        className={sortBy === 'size' && sortOrder === 'desc' ? 'bg-accent/50' : ''}
                      >
                        Largest First
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSortBy('size'); setSortOrder('asc'); }}
                        className={sortBy === 'size' && sortOrder === 'asc' ? 'bg-accent/50' : ''}
                      >
                        Smallest First
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={loadFiles} 
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Breadcrumb Navigation */}
              <div className="flex items-center flex-wrap mb-4 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
                    <Button
                      variant="link"
                      className={`p-0 h-auto ${index === breadcrumbs.length - 1 ? 'font-medium text-primary' : 'text-muted-foreground'}`}
                      onClick={() => navigateToFolder(crumb.path)}
                    >
                      {index === 0 ? (
                        <Home className="h-4 w-4 mr-1" />
                      ) : null}
                      {crumb.name}
                    </Button>
                  </React.Fragment>
                ))}
              </div>
              
              {/* File Drop Zone - visible when dragging a file */}
              {draggedFile && currentPath !== '' && (
                <div 
                  className={`mb-4 border-2 ${isFolderDragOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded-md p-6 transition-colors text-center drop-target`}
                  data-target-path=""
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsFolderDragOver(true);
                  }}
                  onDragLeave={() => {
                    setIsFolderDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedFile) {
                      moveFile(draggedFile, '');
                    }
                    setIsFolderDragOver(false);
                  }}
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <Folder className={`h-16 w-16 mb-2 ${isFolderDragOver ? 'text-blue-600 animate-pulse' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">Drop here to move to root directory</p>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading files...</p>
                </div>
              ) : (
                <>
                  {bucketError && (
                    <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-md flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-orange-800">Storage Access Issue</h4>
                        <p className="text-sm text-orange-700 mt-1">{bucketError}</p>
                        <p className="text-sm text-orange-700 mt-2">
                          This is likely a permissions issue in your Supabase dashboard. Check that:
                        </p>
                        <ul className="text-sm text-orange-700 mt-1 list-disc list-inside">
                          <li>The bucket &apos;{bucketName}&apos; exists</li>
                          <li>The bucket has appropriate Row Level Security (RLS) policies</li>
                          <li>Your user has permission to access this bucket</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileIcon className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium">No Files Found</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        {searchQuery || filterType 
                          ? "No files match your current filters. Try adjusting your search criteria."
                          : "Upload some files or create a folder to get started."}
                      </p>
                      {(searchQuery || filterType) && (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setSearchQuery('');
                            setFilterType(null);
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                      
                      {!searchQuery && !filterType && (
                        <div className="mt-6 flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsNewFolderDialogOpen(true)}
                            className="flex items-center gap-2"
                          >
                            <FolderPlus className="h-4 w-4" />
                            Create Folder
                          </Button>
                          
                          <Button 
                            variant="default"
                            onClick={() => uploadButtonRef.current?.click()}
                            className="flex items-center gap-2"
                          >
                            <UploadIcon className="h-4 w-4" />
                            Upload Files
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    view === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {filteredFiles.map((file, index) => (
                          <div 
                            key={file.id || `file-${index}-${file.name}`}
                            id={`file-item-${file.id}`}
                            className={`border rounded-lg overflow-hidden transition-all hover:shadow-md flex flex-col
                              ${file.type === 'folder' 
                                ? 'hover:border-blue-400 hover:bg-blue-50/50' 
                                : 'hover:border-primary/40'}
                              ${draggedOver === file.path ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                              ${draggedFile?.id === file.id ? 'opacity-50' : ''}`}
                            data-file-id={file.id}
                            data-file-type={file.type}
                            data-file-path={file.path}
                            data-is-folder={file.type === 'folder' ? 'true' : 'false'}
                            onContextMenu={(e) => handleContextMenu(e, file)}
                            onTouchStart={() => handleTouchStart(file)}
                            onTouchEnd={handleTouchEnd}
                          >
                            <div 
                              className={`p-4 flex items-center justify-center border-b h-32
                                ${file.type === 'folder' ? 'bg-blue-50 cursor-pointer folder-item' : 'bg-muted/30'}
                                ${draggedOver === file.path ? 'drag-over' : ''}`}
                              onClick={() => file.type === 'folder' ? navigateToFolder(file.path) : null}
                              data-folder-path={file.type === 'folder' ? file.path : undefined}
                              onDragOver={(e) => {
                                // Only allow drops on folders
                                if (file.type === 'folder' && draggedFile && draggedFile.id !== file.id) {
                                  e.preventDefault();
                                  setDraggedOver(file.path);
                                  // Add highlighted class
                                  e.currentTarget.classList.add('drag-over');
                                }
                              }}
                              onDragLeave={(e) => {
                                // Remove highlighted class
                                e.currentTarget.classList.remove('drag-over');
                                setDraggedOver(null);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('drag-over');
                                
                                if (file.type === 'folder' && draggedFile && draggedFile.id !== file.id) {
                                  console.log('Drop event on folder:', file.name);
                                  moveFile(draggedFile, file.path);
                                }
                              }}
                            >
                              {file.type === 'folder' ? 
                                <Folder className={`h-16 w-16 ${draggedOver === file.path ? 'text-blue-600 animate-pulse' : 'text-blue-500'}`} /> : 
                                getFileIcon(file.name)
                              }
                            </div>
                            <div 
                              className="p-3 flex-1"
                              onClick={() => file.type === 'folder' ? navigateToFolder(file.path) : null}
                              style={{ cursor: file.type === 'folder' ? 'pointer' : 'default' }}
                              draggable={file.type === 'file'}
                              onDragStart={(e) => {
                                if (file.type === 'file') {
                                  console.log('Started dragging file:', file.name);
                                  
                                  // Set drag data
                                  e.dataTransfer.setData('application/json', JSON.stringify({
                                    id: file.id,
                                    name: file.name,
                                    path: file.path,
                                    type: file.type
                                  }));
                                  
                                  // Set a ghost drag image
                                  try {
                                    const ghostImg = new Image();
                                    ghostImg.src = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`);
                                    e.dataTransfer.setDragImage(ghostImg, 25, 25);
                                  } catch (err) {
                                    console.log('Could not set drag image:', err);
                                  }
                                  
                                  // Update state
                                  setDraggedFile(file);
                                  
                                  // Highlight all folder items
                                  document.querySelectorAll('.folder-item').forEach(el => {
                                    el.classList.add('potential-drop-target');
                                  });
                                  
                                  // Add class to root drop zone if exists
                                  const dropZone = document.querySelector('.drop-target');
                                  if (dropZone) dropZone.classList.add('potential-drop-target');
                                }
                              }}
                              onDragEnd={() => {
                                console.log('Ended dragging file');
                                
                                // Remove highlighting
                                document.querySelectorAll('.potential-drop-target').forEach(el => {
                                  el.classList.remove('potential-drop-target');
                                });
                                
                                document.querySelectorAll('.drag-over').forEach(el => {
                                  el.classList.remove('drag-over');
                                });
                                
                                setTimeout(() => {
                                  setDraggedFile(null);
                                  setDraggedOver(null);
                                }, 100);
                              }}
                            >
                              <h3 className={`font-medium text-sm break-all line-clamp-2
                                ${file.type === 'folder' ? 'text-blue-700' : ''}`}>
                                {file.name}
                              </h3>
                              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>{file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}</span>
                                <span>{formatDate(file.created_at)}</span>
                              </div>
                            </div>
                            
                            {/* Simplify the action buttons - only keep delete button */}
                            <div className="p-2 bg-muted/20 border-t flex justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteClick(file.path, file.type === 'folder')}
                                className="flex-1 justify-center text-red-500 hover:text-red-700 hover:bg-red-100/20"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-border">
                            {filteredFiles.map((file, index) => (
                              <tr 
                                key={file.id || `file-${index}-${file.name}`} 
                                className={`transition-colors hover:bg-muted/30 ${file.type === 'folder' ? 'hover:bg-blue-50/50' : ''}`}
                                onContextMenu={(e) => handleContextMenu(e, file)}
                                onTouchStart={() => handleTouchStart(file)}
                                onTouchEnd={handleTouchEnd}
                                id={`file-item-${file.id}`}
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div 
                                    className="flex items-center cursor-pointer"
                                    onClick={() => file.type === 'folder' ? navigateToFolder(file.path) : null}
                                  >
                                    <div className="flex-shrink-0 h-8 w-8 mr-3">
                                      {file.type === 'folder' ? 
                                        <Folder className="h-8 w-8 text-blue-500" /> : 
                                        getFileIcon(file.name)
                                      }
                                    </div>
                                    <div className="truncate max-w-[240px]">
                                      <div className={`text-sm font-medium ${file.type === 'folder' ? 'text-blue-700' : ''}`}>
                                        {file.name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {file.type === 'folder' ? 
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Folder</span> : 
                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">File</span>
                                  }
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {file.type === 'folder' ? '--' : formatFileSize(file.size)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {formatDate(file.created_at)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                  <div className="flex justify-end">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteClick(file.path, file.type === 'folder')}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100/20"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </>
              )}
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${filteredFiles.length} ${filteredFiles.length === 1 ? 'file' : 'files'} ${searchQuery || filterType ? '(filtered)' : ''}`}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Music Files</CardTitle>
              <CardDescription>
                {currentPath 
                  ? `Upload files to ${currentPath}`
                  : 'Upload music files and documents to share with your team.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader 
                bucketName={bucketName}
                onUploadComplete={loadFiles}
                allowedFileTypes={[...fileTypes.audio, ...fileTypes.document]}
                currentPath={currentPath}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                View storage bucket information and diagnose access issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-md">
                  <h3 className="font-medium flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Bucket Information
                  </h3>
                  
                  {bucketInfo ? (
                    <div className="mt-4 text-sm space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 border rounded-md">
                          <p className="text-muted-foreground mb-1">Status</p>
                          <p className="font-medium flex items-center">
                            {bucketInfo.success ? (
                              <span className="flex items-center text-green-600">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                Connected
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                                Connection Issue
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div className="p-3 border rounded-md">
                          <p className="text-muted-foreground mb-1">Authentication</p>
                          <p className="font-medium">
                            {bucketInfo.authStatus?.authenticated ? (
                              <span className="flex items-center text-green-600">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                Authenticated as {bucketInfo.authStatus?.user?.email}
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-600">
                                <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                                Not authenticated
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {bucketInfo.buckets && bucketInfo.buckets.length > 0 && (
                        <div className="p-3 border rounded-md">
                          <p className="text-muted-foreground mb-2">Available Buckets</p>
                          <div className="flex flex-wrap gap-2">
                            {bucketInfo.buckets.map((bucket: string, index: number) => (
                              <span 
                                key={bucket || `bucket-${index}`} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {bucket || "Unnamed bucket"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!bucketInfo.success && (
                        <div className="p-3 border border-red-200 bg-red-50 rounded-md">
                          <p className="text-red-800 font-medium mb-1">Error Message</p>
                          <p className="text-red-600">{bucketInfo.message}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="animate-pulse mt-4 space-y-3">
                      <div className="h-10 bg-muted rounded"></div>
                      <div className="h-10 bg-muted rounded"></div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Troubleshooting Steps</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium text-sm">1. Check Supabase Storage Policies</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Go to Supabase Dashboard → Storage → Buckets → "{bucketName}" → Policies tab.
                        Ensure you have a policy that allows authenticated users to select (read) files.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium text-sm">2. Verify Bucket Name</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Make sure the bucket name "{bucketName}" matches exactly with the bucket in your Supabase project.
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium text-sm">3. Sample Storage Policy</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add this policy to allow authenticated users to read files:
                      </p>
                      <pre className="bg-muted p-2 rounded mt-2 text-xs overflow-x-auto">
                        {"CREATE POLICY \"Authenticated users can read files\" ON storage.objects\n" +
                        "FOR SELECT USING (auth.role() = 'authenticated')"}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <Button variant="outline" onClick={diagnoseStorageAccess}>
                Re-check Storage Access
              </Button>
              
              <Button variant="default" onClick={loadFiles}>
                Reload Files
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* File Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">{previewFile?.name}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(previewFile?.url, '_blank')}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPreviewOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {previewFile && (
              <iframe 
                src={`${previewFile.url}#toolbar=0`} 
                className="w-full h-full border-0" 
                title={`Preview of ${previewFile.name}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {fileToDelete?.isFolder ? 'Delete Folder' : 'Delete File'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {fileToDelete?.isFolder ? 
                `Are you sure you want to delete the folder "${fileToDelete.path.split('/').pop()}" and all its contents? This action cannot be undone.` :
                `Are you sure you want to delete "${fileToDelete?.path.split('/').pop()}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {fileToDelete?.isFolder ? 'Delete Folder' : 'Delete File'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              {currentPath 
                ? `Create a new folder inside ${currentPath}`
                : 'Create a new folder in the root directory'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="folder-name" className="text-sm font-medium">
                Folder Name
              </label>
              <Input
                id="folder-name"
                placeholder="Enter folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isCreatingFolder && newFolderName.trim()) {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewFolderDialogOpen(false)}
              disabled={isCreatingFolder}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || isCreatingFolder}
              className="relative"
            >
              {isCreatingFolder ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-primary">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                  <span className="opacity-0">Create Folder</span>
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
      
      {/* File movement loading overlay */}
      {isMovingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Moving File</h3>
            <p className="text-center text-muted-foreground">
              Please wait while your file is being moved...
            </p>
          </div>
        </div>
      )}
      
      {/* Global context menu */}
      {contextMenuFile && (
        <div 
          className="fixed inset-0 z-50"
          onClick={closeContextMenu}
          style={{ cursor: 'default' }}
        >
          <div 
            className="absolute bg-white rounded-md shadow-lg border overflow-hidden py-1"
            style={{ 
              left: `${contextMenuPosition?.x || 0}px`, 
              top: `${contextMenuPosition?.y || 0}px`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenuFile.type === 'folder' ? (
              <button 
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                onClick={() => {
                  navigateToFolder(contextMenuFile.path);
                  closeContextMenu();
                }}
              >
                <Folder className="h-4 w-4 mr-2" />
                Open Folder
              </button>
            ) : (
              <>
                {isAudioFile(contextMenuFile.name) && (
                  <button 
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                    onClick={() => {
                      handlePlayAudio(contextMenuFile.name);
                      closeContextMenu();
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play Audio
                  </button>
                )}

                <button 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                  onClick={() => {
                    handleDownload(contextMenuFile.name);
                    closeContextMenu();
                  }}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </button>
                
                {isPreviewable(contextMenuFile.name) && (
                  <button 
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                    onClick={() => {
                      handlePreview(contextMenuFile.name);
                      closeContextMenu();
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                )}
                
                <button 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                  onClick={() => {
                    handleMoveClick(contextMenuFile);
                    closeContextMenu();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Move to...
                </button>
              </>
            )}
            
            <div className="my-1 border-t"></div>
            
            <button 
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center"
              onClick={() => {
                handleDeleteClick(contextMenuFile.path, contextMenuFile.type === 'folder');
                closeContextMenu();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {contextMenuFile.type === 'folder' ? 'Folder' : 'File'}
            </button>
          </div>
        </div>
      )}
      
      {/* Move File Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move File</DialogTitle>
            <DialogDescription>
              Select a destination folder to move "{fileToMove?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {availableFolders.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No folders available. Create a folder first.
                  </p>
                ) : (
                  availableFolders.map(folder => (
                    <button
                      key={folder.id}
                      className="w-full flex items-center p-3 rounded-md hover:bg-muted text-left transition-colors"
                      onClick={() => handleMoveToFolder(folder.path)}
                    >
                      <Folder className="h-5 w-5 mr-3 text-blue-500" />
                      <span className="font-medium">{folder.name || 'Root Directory'}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMoveDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Audio Player Dialog */}
      <Dialog open={isAudioPlayerOpen} onOpenChange={handleAudioDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Audio Player</DialogTitle>
            <DialogDescription>
              Playing: {audioFile?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/30 rounded-lg p-4 mb-4 flex items-center justify-center">
              <Music className="h-24 w-24 text-primary/60" />
            </div>
            
            <audio 
              ref={audioRef}
              src={audioFile?.url} 
              className="hidden" 
              onEnded={handleAudioEnded}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg">{audioFile?.name}</h3>
              </div>
              
              {/* Audio Progress Slider */}
              <div className="space-y-2">
                <div className="w-full">
                  <input
                    ref={progressBarRef}
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="rounded-full"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="default"
                  size="icon"
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full"
                >
                  {isPlaying ? 
                    <Pause className="h-6 w-6" /> : 
                    <Play className="h-6 w-6 ml-1" />
                  }
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(audioFile?.url, '_blank')}
                  className="rounded-full"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
} 