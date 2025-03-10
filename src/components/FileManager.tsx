'use client';

import React, { useState, useEffect, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { FileUpload } from '@/components/FileUpload';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  File as FileIcon, 
  Plus, 
  Upload, 
  ArrowLeft, 
  ArrowUp, 
  Home,
  MoreHorizontal,
  Download,
  Trash2,
  FolderUp,
  Edit,
  Eye,
  CheckSquare,
  X,
  FolderClosed,
  Trash
} from 'lucide-react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  listFiles, 
  uploadFile, 
  createFolder, 
  getFileUrl,
  deleteFile,
  moveFile,
  renameFile
} from '@/lib/supabase-storage';
import { supabaseClient } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

// Add this utility for delay - import it from the existing function in supabase-storage
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types for our file manager
interface FileItem {
  id: string;
  name: string;
  path: string;
  size?: number;
  type?: string;
  created_at?: string;
  updated_at?: string;
  updated?: string;
  url?: string;
}

interface FolderItem {
  id: string;
  name: string;
  path: string;
  isExpanded?: boolean;
  children?: (FolderItem | FileItem)[];
  created_at?: string;
  updated?: string;
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

// Add state for sorting
type SortField = 'name' | 'updated' | 'size';
type SortDirection = 'asc' | 'desc';

// Add component for loading overlay
const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
    <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-center text-muted-foreground">{message}</p>
      </div>
    </div>
  </div>
);

// Add formatBytes utility function
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Update the OperationHistoryItem (or Operation) type definition to include all needed fields
type Operation = {
  type: 'delete' | 'rename' | 'move';
  items: Array<{
    item: FileItem | FolderItem;
    data?: Blob;
    folderContents?: Array<{path: string, data?: Blob}>; // Make folderContents optional
    oldPath?: string;
    newPath?: string;
  }>;
  // For rename and move operations
  oldPath?: string;
  newPath?: string;
  isFolder?: boolean;
  // For move operations
  sourcePath?: string;
  targetPath?: string;
  data?: Blob;
  folderItems?: Array<{name: string, data?: Blob}>;
};

export default function FileManager({ projectId, basePath = '', realtimeEnabled }: FileManagerProps): JSX.Element {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<(FileItem | FolderItem)[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedItem, setSelectedItem] = useState<FileItem | FolderItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggedItem, setDraggedItem] = useState<FileItem | FolderItem | null>(null);
  const [moveTargetPath, setMoveTargetPath] = useState('');
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [itemToRename, setItemToRename] = useState<FileItem | FolderItem | null>(null);
  const [newName, setNewName] = useState('');
  const [showMoveToDialog, setShowMoveToDialog] = useState(false);
  const [itemToMove, setItemToMove] = useState<FileItem | FolderItem | null>(null);
  const [folderStructure, setFolderStructure] = useState<FolderItem[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  
  // Add sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Add a state to track current focus index for keyboard navigation
  const [focusIndex, setFocusIndex] = useState<number>(-1);
  
  // Add a drop area ref to enable root folder dropping
  const dropAreaRef = useRef<HTMLDivElement>(null);
  
  // Handle double-click feedback by adding visual feedback state
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  
  // Add state for showing keyboard shortcuts
  const [showShortcutsTooltip, setShowShortcutsTooltip] = useState(false);
  
  // Add operation history for undo functionality
  const [operationHistory, setOperationHistory] = useState<Operation[]>([]);
  const [redoHistory, setRedoHistory] = useState<Operation[]>([]);
  
  const fullCurrentPath = basePath ? (currentPath ? `${basePath}/${currentPath}` : basePath) : currentPath;
  
  // Add operation loading states
  const [operationLoading, setOperationLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Add state for multiple selection
  const [selectedItems, setSelectedItems] = useState<(FileItem | FolderItem)[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showBatchActionsMenu, setShowBatchActionsMenu] = useState(false);

  const renderFilePreview = () => {
    if (!selectedItem || !previewUrl) return null;
    
    const fileExtension = selectedItem.name.split('.').pop()?.toLowerCase();
    
    // Handle images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '')) {
      return (
        <div className="flex items-center justify-center p-4 max-h-[70vh] overflow-hidden">
          <img 
            src={previewUrl} 
            alt={selectedItem.name} 
            className="max-w-full max-h-[70vh] object-contain" 
          />
        </div>
      );
    }
    
    // Handle video
    if (['mp4', 'webm', 'ogg'].includes(fileExtension || '')) {
      return (
        <div className="p-4">
          <video 
            controls 
            className="max-w-full max-h-[70vh]" 
            src={previewUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    // Handle audio
    if (['mp3', 'wav', 'ogg'].includes(fileExtension || '')) {
      return (
        <div className="p-4">
          <audio 
            controls 
            className="w-full" 
            src={previewUrl}
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }
    
    // Handle PDFs
    if (fileExtension === 'pdf') {
      return (
        <div className="p-4 h-[70vh]">
          <iframe 
            src={previewUrl} 
            className="w-full h-full"
            title={selectedItem.name}
          ></iframe>
        </div>
      );
    }
    
    // For other files, show download link
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Preview not available for this file type.</p>
        <Button asChild>
          <a href={previewUrl} download={selectedItem.name} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download File
          </a>
        </Button>
      </div>
    );
  };
  
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
  }, [projectId, refreshTrigger]);
  
  // Sort items based on sort criteria
  const sortItems = (items: (FileItem | FolderItem)[]) => {
    // Always keep folders first, then sort files
    const folders = items.filter(item => 'children' in item) as FolderItem[];
    const files = items.filter(item => !('children' in item)) as FileItem[];
    
    // Sort folders by name always
    const sortedFolders = [...folders].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    
    // Sort files by selected criteria
    const sortedFiles = [...files].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } 
      else if (sortField === 'updated') {
        const aDate = a.updated ? new Date(a.updated).getTime() : 0;
        const bDate = b.updated ? new Date(b.updated).getTime() : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      } 
      else if (sortField === 'size') {
        const aSize = a.size || 0;
        const bSize = b.size || 0;
        return sortDirection === 'asc' ? aSize - bSize : bSize - aSize;
      }
      
      return 0;
    });
    
    return [...sortedFolders, ...sortedFiles];
  };
  
  // Function to toggle sort
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Function to load files for the current path
  const loadFiles = async () => {
    try {
      setLoading(true);
      
      // Use the storage API to list files
      const result = await listFiles(fullCurrentPath);
      
      if (result.error) {
        throw result.error;
      }
      
      // Organize files and folders
      const fileItems = (result.data?.filter(item => item.type === 'file') || [])
        .map(file => ({
          ...file,
          path: currentPath ? `${currentPath}/${file.name}` : file.name,
        }));
        
      const folderItems = (result.data?.filter(item => item.type === 'folder') || [])
        .map(folder => ({
          ...folder,
          path: currentPath ? `${currentPath}/${folder.name}` : folder.name,
          isExpanded: expandedFolders[folder.path] || false,
          children: []
        }));
      
      // Instead of sorting here directly, apply our sorting function
      const allItems = [...folderItems, ...fileItems];
      const sortedItems = sortItems(allItems);
      
      setItems(sortedItems);
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
  
  // Add effect to re-sort when sort options change
  useEffect(() => {
    if (items.length > 0) {
      setItems(sortItems(items));
    }
  }, [sortField, sortDirection]);
  
  // Handle folder expansion/collapse
  const toggleFolderExpansion = async (folder: FolderItem, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const isExpanded = !expandedFolders[folder.path];
    
    setExpandedFolders(prev => ({
      ...prev,
      [folder.path]: isExpanded
    }));
    
    if (isExpanded) {
      // Load folder contents
      try {
        const folderPath = basePath ? `${basePath}/${folder.path}` : folder.path;
        const result = await listFiles(folderPath);
        
        if (result.error) {
          throw result.error;
        }
        
        const fileItems = (result.data?.filter(item => item.type === 'file') || [])
          .map(file => ({
            ...file,
            path: `${folder.path}/${file.name}`,
          }));
          
        const folderItems = (result.data?.filter(item => item.type === 'folder') || [])
          .map(subFolder => ({
            ...subFolder,
            path: `${folder.path}/${subFolder.name}`,
            isExpanded: expandedFolders[`${folder.path}/${subFolder.name}`] || false,
            children: []
          }));
        
        // Update the folder's children
        setItems(prevItems => {
          return prevItems.map(item => {
            if (item.path === folder.path && 'children' in item) {
              return {
                ...item,
                children: [
                  ...folderItems.sort((a, b) => a.name.localeCompare(b.name)),
                  ...fileItems.sort((a, b) => a.name.localeCompare(b.name))
                ]
              };
            }
            return item;
          });
        });
      } catch (error: any) {
        console.error('Error loading folder contents:', error);
        toast({
          title: 'Error',
          description: `Failed to load folder contents: ${error.message || 'Unknown error'}`,
          variant: 'destructive',
        });
      }
    }
  };
  
  // Function to navigate to root
  const navigateToRoot = () => {
    setCurrentPath('');
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Function to navigate up one level
  const navigateUp = () => {
    if (!currentPath) return;
    
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Function to create a new folder - with loading
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
      setOperationLoading(true);
      setLoadingMessage(`Creating folder "${newFolderName}"...`);
      
      // Create the folder in storage
      const folderPath = currentPath 
        ? `${fullCurrentPath}/${newFolderName}` 
        : `${basePath}/${newFolderName}`;
      
      const { success, error } = await createFolder(folderPath || '');
      
      if (error) throw error;
      
      if (success) {
        // Add a short delay to ensure file system operations are complete
        await delay(500);
        
        // Check for and remove any empty subfolders that may have been created automatically
        await cleanupEmptySubfolders(folderPath);
        
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
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Helper function to cleanup empty subfolders that are created automatically
  const cleanupEmptySubfolders = async (folderPath: string) => {
    try {
      const { data: contents, error } = await supabaseClient.storage
        .from('production-files')
        .list(folderPath);
      
      if (error || !contents) return;
      
      // Look for empty subfolder markers or .folder files
      for (const item of contents) {
        // If it's a directory or has .folder extension, it might be an auto-created folder
        if (!item.metadata || item.name.endsWith('.folder')) {
          const subPath = `${folderPath}/${item.name}`;
          
          // Check if it's empty (only contains a .folder marker)
          const { data: subContents, error: subError } = await supabaseClient.storage
            .from('production-files')
            .list(subPath);
          
          // If it's empty or just has a marker file, delete it
          if (!subError && (!subContents || subContents.length === 0 || 
              (subContents.length === 1 && subContents[0].name === '.folder'))) {
            console.log(`Cleaning up automatically created empty subfolder: ${subPath}`);
            await deleteFile(subPath, 'production-files', true);
          }
        }
      }
    } catch (e) {
      console.warn('Error during empty subfolder cleanup:', e);
      // Don't throw, as this is just cleanup
    }
  };
  
  // Handle file upload completion
  const handleUploadComplete = () => {
    setShowUploadDialog(false);
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: 'Success',
      description: 'File uploaded successfully',
    });
  };
  
  // Function to delete a file or folder - with loading
  const handleDelete = async (item: FileItem | FolderItem) => {
    try {
      const isFolder = 'children' in item;
      const itemPath = basePath ? `${basePath}/${item.path}` : item.path;
      
      setOperationLoading(true);
      setLoadingMessage(`Deleting ${isFolder ? 'folder' : 'file'} "${item.name}"...`);
      
      // Enhanced undo preparation
      let savedData: Blob | undefined;
      let folderContents: Array<{path: string, data?: Blob}> = [];
      
      if (!isFolder) {
        // For files, download the content for undo
        try {
          const { data } = await supabaseClient.storage
            .from('production-files')
            .download(itemPath);
            
          if (data) {
            savedData = data;
          }
        } catch (downloadError) {
          console.error('Error saving file for undo:', downloadError);
        }
      } else {
        // For folders, recursively save the entire structure
        try {
          folderContents = await saveEntireFolderStructure(itemPath);
        } catch (folderError) {
          console.error('Error saving folder structure for undo:', folderError);
        }
      }
      
      // Remove the loading dialog temporarily to show the confirmation
      setOperationLoading(false);
      
      // Confirm delete
      if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
        return;
      }
      
      setOperationLoading(true);
      setLoadingMessage(`Deleting ${isFolder ? 'folder' : 'file'} "${item.name}"...`);
      
      // Proceed with deletion
      const { success, error } = await deleteFile(itemPath, undefined, isFolder);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        // Add to operation history with enhanced folder data
        setOperationHistory(prev => [...prev, {
          type: 'delete',
          items: [{
            item: item,
            data: savedData,
            folderContents: folderContents
          }]
        }]);
        
        toast({
          title: 'Success',
          description: `${isFolder ? 'Folder' : 'File'} deleted successfully`,
        });
        
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: `Failed to delete item: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Helper function to recursively save folder structure
  const saveEntireFolderStructure = async (folderPath: string): Promise<Array<{path: string, data?: Blob}>> => {
    const contents: Array<{path: string, data?: Blob}> = [];
    
    try {
      // List all items in the folder
      const { data: items } = await supabaseClient.storage
        .from('production-files')
        .list(folderPath);
        
      if (!items) return contents;
      
      // Process each item
      for (const item of items) {
        const itemPath = `${folderPath}/${item.name}`;
        
        if (item.metadata && item.metadata.mimetype) {
          // It's a file, download it
          try {
            const { data } = await supabaseClient.storage
              .from('production-files')
              .download(itemPath);
              
            if (data) {
              contents.push({ path: itemPath, data });
            }
          } catch (e) {
            console.warn(`Could not download file ${itemPath} for undo preparation`, e);
          }
        } else {
          // It's a folder, recursively process it
          contents.push({ path: itemPath }); // Save the folder itself
          const subContents = await saveEntireFolderStructure(itemPath);
          contents.push(...subContents); // Add all subcontents
        }
      }
    } catch (error) {
      console.error('Error saving folder structure:', error);
    }
    
    return contents;
  };
  
  // Function to handle clicking on a file
  const handleItemClick = (item: FileItem | FolderItem) => {
    setSelectedItem(item);
    
    // No longer toggle folder expansion on single click
    // This makes single click only select the item
  };
  
  // Function to handle double-clicking an item
  const handleItemDoubleClick = async (item: FileItem | FolderItem) => {
    // Set the clicked item for visual feedback
    setClickedItemId(item.id);
    
    // Clear the visual effect after a short delay
    setTimeout(() => setClickedItemId(null), 300);
    
    // For folders, navigate into the folder
    if ('children' in item) {
      setCurrentPath(item.path);
      setRefreshTrigger(prev => prev + 1);
      return;
    }
    
    // For files, show preview
    try {
      setSelectedItem(item);
      
      const itemPath = basePath ? `${basePath}/${item.path}` : item.path;
      const { data, error } = await getFileUrl(itemPath);
      
      if (error) {
        throw error;
      }
      
      if (data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
        setShowPreviewDialog(true);
      }
    } catch (error: any) {
      console.error('Error getting file URL:', error);
      toast({
        title: 'Error',
        description: `Failed to preview file: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  
  // Function to get icon based on file extension
  const getFileIcon = (file: FileItem | FolderItem) => {
    if ('children' in file) {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileIcon className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-4 w-4 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon className="h-4 w-4 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FileIcon className="h-4 w-4 text-yellow-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <FileIcon className="h-4 w-4 text-pink-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Handle drag start
  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: FileItem | FolderItem) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.path);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image (a small icon with file name)
    const dragIcon = document.createElement('div');
    dragIcon.className = 'fixed top-0 left-0 bg-background/95 shadow-md rounded-md p-2 text-sm flex items-center pointer-events-none border';
    dragIcon.innerHTML = `
      ${'children' in item 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>' 
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'
      }
      <span class="ml-2 truncate" style="max-width: 120px;">${item.name}</span>
    `;
    document.body.appendChild(dragIcon);
    
    // Set the drag image with offset to position near cursor
    e.dataTransfer.setDragImage(dragIcon, 20, 20);
    
    // Remove the element after drag operation starts
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);
  };
  
  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>, item?: FolderItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item && 'children' in item) {
      setDragOverFolder(item.path);
      e.dataTransfer.dropEffect = 'move';
    }
  };
  
  // Handle drag leave
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolder(null);
  };
  
  // Handle drop
  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetFolder?: FolderItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragOverFolder(null);
    
    if (!draggedItem || !targetFolder || draggedItem.path === targetFolder.path) {
      return;
    }
    
    try {
      // Get paths
      const sourcePath = basePath ? `${basePath}/${draggedItem.path}` : draggedItem.path;
      const targetPath = basePath 
        ? `${basePath}/${targetFolder.path}/${draggedItem.name}` 
        : `${targetFolder.path}/${draggedItem.name}`;
      
      // Move file using browser's fetch API (since Supabase doesn't have a direct move function)
      const { data: fileData } = await supabaseClient.storage
        .from('production-files')
        .download(sourcePath);
        
      if (!fileData) {
        throw new Error('Failed to download source file');
      }
      
      // Upload to new location
      const { error: uploadError } = await supabaseClient.storage
        .from('production-files')
        .upload(targetPath, fileData, {
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Delete from old location
      const { error: deleteError } = await supabaseClient.storage
        .from('production-files')
        .remove([sourcePath]);
        
      if (deleteError) {
        throw deleteError;
      }
      
      toast({
        title: 'Success',
        description: `Moved "${draggedItem.name}" to "${targetFolder.name}"`,
      });
      
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Error moving file:', error);
      toast({
        title: 'Error',
        description: `Failed to move file: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  
  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    if (!currentPath) return null;
    
    const pathParts = currentPath.split('/');
    const breadcrumbs = [];
    
    // Add root
    breadcrumbs.push(
          <Button 
        key="root" 
        variant="ghost" 
            size="sm" 
        className="h-8 px-2"
            onClick={navigateToRoot} 
          >
            Root
          </Button>
    );
    
    // Add path parts
    let currentPathBuild = '';
    pathParts.forEach((part, index) => {
      breadcrumbs.push(<span key={`separator-${index}`} className="mx-1">/</span>);
      
      currentPathBuild += (index === 0 ? '' : '/') + part;
      const pathForNavigation = currentPathBuild;
      
      breadcrumbs.push(
          <Button 
          key={pathForNavigation} 
          variant="ghost" 
            size="sm" 
          className="h-8 px-2"
          onClick={() => {
            setCurrentPath(pathForNavigation);
            setRefreshTrigger(prev => prev + 1);
          }}
        >
          {part}
          </Button>
      );
    });
    
    return (
      <div className="flex items-center text-sm mb-2 overflow-x-auto pb-1">
        {breadcrumbs}
      </div>
    );
  };
  
  // Function to handle renaming a file or folder
  const handleRename = async (item: FileItem | FolderItem) => {
    setItemToRename(item);
    setNewName(item.name);
    setIsRenaming(true);
  };
  
  // Function to submit the rename - with loading
  const submitRename = async () => {
    if (!itemToRename || !newName.trim() || newName === itemToRename.name) return;
    
    setLoadingMessage("Renaming...");
    setOperationLoading(true);
    
    // Check if the new name contains invalid characters
    if (/[/\\:*?"<>|]/.test(newName)) {
      toast({
        title: "Invalid name",
        description: "The name cannot contain any of the following characters: / \\ : * ? \" < > |",
        variant: "destructive"
      });
      setOperationLoading(false);
      return;
    }
    
    const isFolder = 'children' in itemToRename;
    const oldPath = itemToRename.path;
    const pathParts = oldPath.split('/');
    pathParts.pop(); // Remove the file/folder name
    const parentPath = pathParts.join('/');
    const newPath = parentPath ? `${parentPath}/${newName}` : newName;
    
    try {
      // Save the operation to history for undo
      const newOperation: Operation = {
        type: 'rename',
        items: [{
          item: itemToRename,
          oldPath,
          newPath,
          folderContents: [] // Add empty folderContents array
        }],
        oldPath,
        newPath,
        isFolder
      };
      
      setOperationHistory(prev => [newOperation, ...prev]);
      setRedoHistory([]); // Clear redo history on new operation
      
      const { success, error } = await renameFile(oldPath, newName, 'production-files', isFolder);
      
      if (success) {
        toast({
          title: "Success",
          description: `${isFolder ? 'Folder' : 'File'} renamed successfully.`,
        });
        
        setIsRenaming(false);
        setItemToRename(null);
        setNewName('');
        loadFiles();
      } else {
        toast({
          title: "Error",
          description: `Failed to rename: ${error}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Rename error:', error);
      toast({
        title: "Error",
        description: "An error occurred while renaming.",
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Function to open the move file dialog
  const handleMoveToClick = async (item: FileItem | FolderItem) => {
    setItemToMove(item);
    setSelectedDestination('');
    
    try {
      // Load all folders from the root
      await loadFolderStructure();
      setShowMoveToDialog(true);
    } catch (error: any) {
      console.error('Error preparing move dialog:', error);
      toast({
        title: 'Error',
        description: `Failed to prepare move dialog: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };
  
  // Function to load folder structure for the move dialog
  const loadFolderStructure = async () => {
    try {
      const foldersList = await fetchFoldersRecursively('');
      setFolderStructure(foldersList);
    } catch (error) {
      console.error('Error loading folder structure:', error);
      throw error;
    }
  };
  
  // Recursively fetch folders
  const fetchFoldersRecursively = async (path: string): Promise<FolderItem[]> => {
    const pathToList = basePath ? (path ? `${basePath}/${path}` : basePath) : path;
    const { data, error } = await listFiles(pathToList);
    
    if (error) {
      throw error;
    }
    
    const folders = (data?.filter(item => item.type === 'folder') || []) as FolderItem[];
    
    // Format folder paths correctly
    const formattedFolders = folders.map(folder => ({
      ...folder,
      path: path ? `${path}/${folder.name}` : folder.name,
      children: []
    }));
    
    return formattedFolders;
  };
  
  // Function to perform the move - with loading
  const handleMoveTo = async () => {
    if (!itemToMove || !selectedDestination) return;
    
    setLoadingMessage("Moving...");
    setOperationLoading(true);
    
    const isFolder = 'children' in itemToMove;
    const sourcePath = itemToMove.path;
    let targetPath: string;
    
    if (selectedDestination === 'root') {
      // Move to root
      targetPath = itemToMove.name;
    } else {
      // Move to selected folder
      targetPath = `${selectedDestination}/${itemToMove.name}`;
    }
    
    // Check if target already exists
    const { data: targetContents } = await listFiles(selectedDestination === 'root' ? '' : selectedDestination);
    const targetExists = targetContents?.some(item => item.name === itemToMove.name);
    
    if (targetExists) {
      toast({
        title: "Error",
        description: `An item with the name "${itemToMove.name}" already exists in the destination folder.`,
        variant: "destructive"
      });
      setOperationLoading(false);
      return;
    }
    
    try {
      // Save the operation to history for undo
      const newOperation: Operation = {
        type: 'move',
        items: [{
          item: itemToMove,
          oldPath: sourcePath,
          newPath: targetPath,
          folderContents: [] // Add empty folderContents array
        }],
        sourcePath,
        targetPath,
        isFolder
      };
      
      setOperationHistory(prev => [newOperation, ...prev]);
      setRedoHistory([]); // Clear redo history on new operation
      
      // Non-null assertion for targetPath since we've checked selectedDestination
      const { success, error } = await moveFile(sourcePath, targetPath!, 'production-files');
      
      if (success) {
        toast({
          title: "Success",
          description: `${isFolder ? 'Folder' : 'File'} moved successfully.`,
        });
        setShowMoveToDialog(false);
        setItemToMove(null);
        setSelectedDestination('');
        loadFiles();
      } else {
        toast({
          title: "Error",
          description: `Failed to move: ${error}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Move error:', error);
      toast({
        title: "Error",
        description: "An error occurred while moving the item.",
        variant: "destructive"
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Render destination folder structure
  const renderFolderOption = (folder: FolderItem, level = 0) => {
    const padding = level * 16;
    
    return (
      <div key={folder.path} className="space-y-1">
        <div 
          className={`flex items-center px-2 py-1 rounded-sm cursor-pointer ${
            selectedDestination === folder.path ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
          }`}
          style={{ paddingLeft: `${padding + 8}px` }}
          onClick={() => setSelectedDestination(folder.path)}
        >
          <Folder className="h-4 w-4 text-blue-500 mr-2" />
          <span>{folder.name}</span>
        </div>
      </div>
    );
  };
  
  // Implement the undo functionality
  const handleUndo = async () => {
    if (operationHistory.length === 0) return;
    
    setOperationLoading(true);
    setLoadingMessage('Undoing last operation...');
    
    // Get the last operation
    const lastOperation = operationHistory[operationHistory.length - 1];
    
    try {
      // ... existing undo code ...
      
      // Add to redo history
      setRedoHistory(prev => [...prev, lastOperation]);
      
      // Remove from operation history
      setOperationHistory(prev => prev.slice(0, -1));
      
      // ... existing code ...
    } catch (error: any) {
      // ... existing error handling ...
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Function to redo the last undone operation
  const handleRedo = async () => {
    if (redoHistory.length === 0) return;
    
    setOperationLoading(true);
    setLoadingMessage('Redoing operation...');
    
    // Get the last operation from redo history
    const lastRedoOperation = redoHistory[redoHistory.length - 1];
    
    try {
      switch (lastRedoOperation.type) {
        case 'delete': {
          // For redo, we need to delete the items again
          for (const deletedItem of lastRedoOperation.items) {
            const itemPath = basePath ? `${basePath}/${deletedItem.item.path}` : deletedItem.item.path;
            const isFolder = 'children' in deletedItem.item;
            
            await deleteFile(itemPath, undefined, isFolder);
          }
          break;
        }
        
        case 'rename': {
          // For redo, we rename from oldName to newName (opposite of undo)
          const { oldPath, newPath, isFolder } = lastRedoOperation;
          
          if (isFolder) {
            // For folders, we need a similar process to the original rename
            const { data: folderContents } = await listFiles(oldPath);
            
            if (folderContents && folderContents.length > 0) {
              // Create the new folder
              await createFolder(newPath || '');
              
              // Move each file
              for (const file of folderContents) {
                const oldFilePath = `${oldPath}/${file.name}`;
                const newFilePath = `${newPath}/${file.name}`;
                
                // Download
                const { data: fileData } = await supabaseClient.storage
                  .from('production-files')
                  .download(oldFilePath);
                  
                if (fileData) {
                  // Upload to new location
                  await supabaseClient.storage
                    .from('production-files')
                    .upload(newFilePath, fileData, { upsert: true });
                  
                  // Delete old file
                  await supabaseClient.storage
                    .from('production-files')
                    .remove([oldFilePath]);
                }
              }
              
              // Delete the old folder
              await deleteFile(oldPath || '', undefined, true);
            } else {
              // Empty folder - just create new and delete old
              await createFolder(newPath || '');
              await deleteFile(oldPath || '', undefined, true);
            }
          } else {
            // For files
            const { data: fileData } = await supabaseClient.storage
              .from('production-files')
              .download(oldPath || '');
              
            if (fileData) {
              // Upload to new location
              await supabaseClient.storage
                .from('production-files')
                .upload(newPath || '', fileData, { upsert: true });
              
              // Delete old file
              await supabaseClient.storage
                .from('production-files')
                .remove([oldPath || '']);
            }
          }
          break;
        }
        
        case 'move': {
          // For redo, we move from source to target (opposite of undo)
          const { sourcePath, targetPath, isFolder, data } = lastRedoOperation;
          
          if (isFolder) {
            // For folders, similar to move operation
            await createFolder(targetPath || '');
            
            // Process folder contents if available
            for (const item of lastRedoOperation.folderItems || []) {
              const sourceFilePath = `${sourcePath}/${item.name}`;
              const targetFilePath = `${targetPath}/${item.name}`;
              
              if (item.data) {
                // Upload file to new location
                await supabaseClient.storage
                  .from('production-files')
                  .upload(targetFilePath, item.data, { upsert: true });
                  
                // Remove from original location
                await supabaseClient.storage
                  .from('production-files')
                  .remove([sourceFilePath]);
              }
            }
            
            // Delete the source folder
            await deleteFile(sourcePath || '', undefined, true);
          } else {
            // For files
            if (data) {
              // Upload to target location
              await supabaseClient.storage
                .from('production-files')
                .upload(targetPath || '', data, { upsert: true });
              
              // Delete from source location
              await supabaseClient.storage
                .from('production-files')
                .remove([sourcePath || '']);
            }
          }
          break;
        }
      }
      
      // Add to operation history and remove from redo history
      setOperationHistory(prev => [...prev, lastRedoOperation]);
      setRedoHistory(prev => prev.slice(0, -1));
      
      toast({
        title: 'Success',
        description: 'Operation redone successfully',
      });
      
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Error redoing operation:', error);
      toast({
        title: 'Error',
        description: `Failed to redo operation: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Update the handleKeyDown function
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in dialogs
      if (showUploadDialog || showNewFolderDialog || showPreviewDialog || isRenaming || showMoveToDialog) {
        return;
      }
      
      // Skip if focused on input field
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Undo - Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (operationHistory.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
      
      // Redo - Shift + Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        if (redoHistory.length > 0) {
          e.preventDefault();
          handleRedo();
        }
      }
      
      // Navigate to parent folder with Backspace
      if (e.key === 'Backspace' && currentPath) {
        e.preventDefault();
        navigateUp();
      }
      
      // Navigate into folder with right arrow
      if (e.key === 'ArrowRight' && selectedItem && 'children' in selectedItem) {
        e.preventDefault();
        handleItemDoubleClick(selectedItem);
      }
      
      // Navigate down into folder with Cmd/Ctrl + Down
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown' && selectedItem && 'children' in selectedItem) {
        e.preventDefault();
        handleItemDoubleClick(selectedItem);
      }
      
      // Navigate to parent folder with left arrow
      if (e.key === 'ArrowLeft' && currentPath) {
        e.preventDefault();
        navigateUp();
      }
      
      // Rename with F2
      if (e.key === 'F2' && selectedItem) {
        e.preventDefault();
        handleRename(selectedItem);
      }
      
      // Delete with Delete key
      if (e.key === 'Delete' && selectedItem) {
        e.preventDefault();
        handleDelete(selectedItem);
      }
      
      // Arrow up/down navigation
      if (items.length > 0 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const visibleItems = getAllVisibleItems();
        const currentIdx = visibleItems.findIndex(item => item.id === selectedItem?.id);
        
        if (e.key === 'ArrowUp' && currentIdx > 0) {
          setSelectedItem(visibleItems[currentIdx - 1]);
        } else if (e.key === 'ArrowDown' && currentIdx < visibleItems.length - 1) {
          setSelectedItem(visibleItems[currentIdx + 1]);
        } else if (e.key === 'ArrowDown' && currentIdx === -1 && visibleItems.length > 0) {
          setSelectedItem(visibleItems[0]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedItem, 
    currentPath, 
    showUploadDialog, 
    showNewFolderDialog, 
    showPreviewDialog, 
    isRenaming,
    showMoveToDialog,
    items,
    expandedFolders,
    operationHistory,
    redoHistory
  ]);
  
  // Helper function to get all visible items (including those in expanded folders)
  const getAllVisibleItems = () => {
    let visibleItems: (FileItem | FolderItem)[] = [];
    
    // Recursive function to collect visible items
    const addVisibleItems = (itemsList: (FileItem | FolderItem)[], level = 0) => {
      itemsList.forEach(item => {
        visibleItems.push(item);
        
        // If this is an expanded folder, add its children
        if ('children' in item && expandedFolders[item.path] && item.children) {
          addVisibleItems(item.children, level + 1);
        }
      });
    };
    
    // Start with the top-level items
    addVisibleItems(items);
    
    return visibleItems;
  };
  
  // Function to handle selecting/unselecting an item for batch operations
  const handleDropToRoot = async (e: React.DragEvent) => {
    e.stopPropagation();
    
    if (!draggedItem) {
      return;
    }
    
    try {
      // Source path
      const sourcePath = basePath ? `${basePath}/${draggedItem.path}` : draggedItem.path;
      
      // Target path (move to root directory)
      const targetPath = basePath ? 
        `${basePath}/${draggedItem.name}` : 
        draggedItem.name;
      
      // Check if we're already at root
      const sourceDir = draggedItem.path.split('/').slice(0, -1).join('/');
      if (sourceDir === '') {
        toast({
          title: 'Info',
          description: 'The file is already in root location',
        });
        return;
      }
      
      // Check if file with same name exists at root
      const rootPath = basePath || '';
      const { data: rootFiles } = await listFiles(rootPath);
      const fileExists = rootFiles?.some(file => file.name === draggedItem.name);
      
      if (fileExists) {
        if (!confirm(`A file named "${draggedItem.name}" already exists in the root folder. Overwrite?`)) {
          return;
        }
      }
      
      const isFolder = 'children' in draggedItem;
      
      if (isFolder) {
        // For folders, similar to existing move code
        const { data: folderContents } = await listFiles(sourcePath);
        
        if (folderContents && folderContents.length > 0) {
          // Create the target folder at root
          await createFolder(targetPath || '');
          
          // Move each item to root
          for (const item of folderContents) {
            if (item.type === 'file') {
              const sourceFilePath = basePath ? 
                `${basePath}/${draggedItem.path}/${item.name}` : 
                `${draggedItem.path}/${item.name}`;
                
              const targetFilePath = basePath ? 
                `${basePath}/${draggedItem.name}/${item.name}` : 
                `${draggedItem.name}/${item.name}`;
              
              // Move file to root/foldername
              const { data: fileData } = await supabaseClient.storage
                .from('production-files')
                .download(sourceFilePath);
                
              if (fileData) {
                await supabaseClient.storage
                  .from('production-files')
                  .upload(targetFilePath, fileData, { upsert: true });
                  
                await supabaseClient.storage
                  .from('production-files')
                  .remove([sourceFilePath]);
              }
            }
          }
          
          // Delete the old folder
          await deleteFile(sourcePath, 'production-files', true);
        } else {
          // Empty folder
          await createFolder(targetPath || '');
          await deleteFile(sourcePath, 'production-files', true);
        }
      } else {
        // Move file to root
        const { data: fileData } = await supabaseClient.storage
          .from('production-files')
          .download(sourcePath);
          
        if (!fileData) {
          throw new Error('Failed to download file for moving');
        }
        
        // Upload to root
        const { error: uploadError } = await supabaseClient.storage
          .from('production-files')
          .upload(targetPath, fileData, { upsert: true });
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Delete from old location
        const { error: deleteError } = await supabaseClient.storage
          .from('production-files')
          .remove([sourcePath]);
          
        if (deleteError) {
          throw deleteError;
        }
      }
      
      toast({
        title: 'Success',
        description: `Moved ${isFolder ? 'folder' : 'file'} to root successfully`,
      });
      
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error('Error moving item to root:', error);
      toast({
        title: 'Error',
        description: `Failed to move item: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setDraggedItem(null);
    }
  };
  
  // Enhance the rename dialog with Enter key support
  useEffect(() => {
    const handleRenameKeyDown = (e: KeyboardEvent) => {
      if (isRenaming && e.key === 'Enter') {
        e.preventDefault();
        submitRename();
      }
    };
    
    window.addEventListener('keydown', handleRenameKeyDown);
    return () => window.removeEventListener('keydown', handleRenameKeyDown);
  }, [isRenaming, newName]);

  // Enhance the move dialog with Enter key support
  useEffect(() => {
    const handleMoveKeyDown = (e: KeyboardEvent) => {
      if (showMoveToDialog && e.key === 'Enter') {
        e.preventDefault();
        handleMoveTo();
      }
    };
    
    window.addEventListener('keydown', handleMoveKeyDown);
    return () => window.removeEventListener('keydown', handleMoveKeyDown);
  }, [showMoveToDialog, selectedDestination]);

  // Enhance the create folder dialog with Enter key support
  useEffect(() => {
    const handleCreateFolderKeyDown = (e: KeyboardEvent) => {
      if (showNewFolderDialog && e.key === 'Enter' && newFolderName.trim()) {
        e.preventDefault();
        handleCreateFolder();
      }
    };
    
    window.addEventListener('keydown', handleCreateFolderKeyDown);
    return () => window.removeEventListener('keydown', handleCreateFolderKeyDown);
  }, [showNewFolderDialog, newFolderName]);

  // Function to handle selecting/unselecting an item for batch operations
  const handleItemSelect = (item: FileItem | FolderItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (selectedItems.some(i => i.id === item.id)) {
      // If item is already selected, remove it
      setSelectedItems(prevItems => prevItems.filter(i => i.id !== item.id));
    } else {
      // Otherwise, add it to selection
      setSelectedItems(prevItems => [...prevItems, item]);
    }
    
    // Enable multi-select mode if it's not already on
    if (!isMultiSelectMode) {
      setIsMultiSelectMode(true);
    }
  };
  
  // Function to toggle multi-select mode
  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      // Exit multi-select mode and clear selections
      setIsMultiSelectMode(false);
      setSelectedItems([]);
    } else {
      // Enter multi-select mode
      setIsMultiSelectMode(true);
    }
  };
  
  // Function to select all visible items
  const selectAllItems = () => {
    setSelectedItems(items);
  };
  
  // Function to clear all selections
  const clearSelection = () => {
    setSelectedItems([]);
  };
  
  // Enhanced delete function to handle multiple items
  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      return;
    }
    
    setOperationLoading(true);
    setLoadingMessage(`Deleting ${selectedItems.length} items...`);
    
    const deletedItems: Array<{
      item: FileItem | FolderItem;
      data?: Blob;
      folderContents: Array<{path: string, data?: Blob}>;
    }> = [];
    
    try {
      for (const item of selectedItems) {
        const isFolder = 'children' in item;
        const itemPath = basePath ? `${basePath}/${item.path}` : item.path;
        
        // For undo functionality
        let savedData: Blob | undefined;
        let folderContents: Array<{path: string, data?: Blob}> = [];
        
        if (!isFolder) {
          // Save file data for undo
          try {
            const { data } = await supabaseClient.storage
              .from('production-files')
              .download(itemPath);
              
            if (data) {
              savedData = data;
            }
          } catch (downloadError) {
            console.error('Error saving file for undo:', downloadError);
          }
        } else {
          // Save folder structure for undo
          try {
            folderContents = await saveEntireFolderStructure(itemPath);
          } catch (folderError) {
            console.error('Error saving folder structure for undo:', folderError);
          }
        }
        
        // Delete the item
        const { success, error } = await deleteFile(itemPath, undefined, isFolder);
        
        if (success) {
          deletedItems.push({
            item: item,
            data: savedData,
            folderContents: folderContents
          });
        } else if (error) {
          throw new Error(`Error deleting ${item.name}: ${error}`);
        }
      }
      
      // Add to operation history for undo
      if (deletedItems.length > 0) {
        setOperationHistory(prev => [...prev, {
          type: 'delete',
          items: deletedItems
        }]);
        
        toast({
          title: 'Success',
          description: `Deleted ${deletedItems.length} items successfully`,
        });
      }
      
      // Clear selection and refresh the file list
      setSelectedItems([]);
      setIsMultiSelectMode(false);
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error: any) {
      console.error('Error in batch delete:', error);
      toast({
        title: 'Error',
        description: `Failed to delete all items: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setOperationLoading(false);
    }
  };
  
  // Function to move multiple items
  const handleBatchMoveClick = () => {
    if (selectedItems.length === 0) return;
    
    // Use the existing itemToMove infrastructure for the move dialog
    // We'll handle the batch operation in handleMoveTo
    setItemToMove(selectedItems[0]);
    setShowMoveToDialog(true);
  };
  
  // Update renderFileItem to include checkboxes and preserve context menu
  const renderFileItem = (item: FileItem | FolderItem, level = 0, parentPath = '') => {
    const isFolder = 'children' in item;
    const isExpanded = isFolder && (item as FolderItem).isExpanded;
    
    const indent = level * 16;
    
    return (
      <div key={item.path}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              id={`file-item-${item.id}`}
              className={`group relative flex items-center px-2 py-1 hover:bg-accent/40 border-b border-border/40 ${
                selectedItem?.id === item.id ? 'bg-accent text-accent-foreground' : ''
              } ${isMultiSelectMode && selectedItems.some(i => i.id === item.id) ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
            >
              {/* Add checkbox for multi-select */}
              {isMultiSelectMode && (
                <div 
                  className="flex items-center justify-center w-6 h-6"
                  onClick={(e) => handleItemSelect(item, e)}
                >
                  <input 
                    type="checkbox" 
                    checked={selectedItems.some(i => i.id === item.id)}
                    onChange={() => {}} // Controlled by handleItemSelect
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              )}
              
              <div
                className={`
                  flex items-center px-2 py-1.5 rounded-sm group relative transition-colors
                  ${isFolder ? 'cursor-pointer' : ''}
                  ${selectedItem?.id === item.id ? 'text-accent-foreground' : 'text-foreground'}
                `}
                style={{ marginLeft: `${indent}px` }}
                onClick={() => handleItemClick(item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                draggable 
                onDragStart={(e) => handleDragStart(e, item)}
                data-testid={`file-item-${item.id}`}
              >
                {/* Toggle arrow for folders */}
                {isFolder && (
                  <span 
                    className="mr-1 w-4 h-4 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolderExpansion(item as FolderItem, e);
                    }}
                  >
                    <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`} />
                  </span>
                )}
                
                {/* File icon */}
                <span className="mr-2">{getFileIcon(item)}</span>
                
                {/* File name */}
                <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                  {item.name}
                </span>
                
                {/* Last modified - show only on larger screens */}
                <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
                  {item.updated && formatDistanceToNow(new Date(item.updated), { addSuffix: true })}
                </span>
                
                {/* File size */}
                <span className="ml-4 text-xs text-muted-foreground min-w-[60px] text-right">
                  {'size' in item && item.size ? formatBytes(item.size) : ''}
                </span>
                
                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 ml-2 flex items-center space-x-1">
                  {!isFolder && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                      e.stopPropagation();
                      handleItemDoubleClick(item);
                    }}>
                      <Eye className="h-3.5 w-3.5" />
                </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => {
                    e.stopPropagation();
                    handleRename(item);
                  }}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
          </div>
        </div>
            </div>
          </ContextMenuTrigger>
          
          <ContextMenuContent className="w-48">
            {isFolder ? (
              <>
                <ContextMenuItem 
                  onClick={() => handleItemDoubleClick(item)}
                >
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Open
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleRename(item)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Rename
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  className="text-red-600"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </>
            ) : (
              <>
                <ContextMenuItem 
                  onClick={() => handleItemDoubleClick(item)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </ContextMenuItem>
                <ContextMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleRename(item)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleMoveToClick(item)}
                >
                  <FolderUp className="mr-2 h-4 w-4" />
                  Move to...
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem 
                  className="text-red-600"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
        
        {/* Render children if folder is expanded */}
        {isFolder && isExpanded && (item as FolderItem).children && (
          <div>
            {(item as FolderItem).children?.map(child => 
              renderFileItem(child, level + 1, item.path)
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Update the return JSX to add batch selection UI controls
  return (
    <div>
      {/* Ensure loading overlay is above dialogs with higher z-index */}
      {operationLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              <p className="text-center text-muted-foreground">{loadingMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateToRoot}
          >
            <Home className="h-4 w-4 mr-1" />
            Root
          </Button>
          
          {currentPath && (
          <Button 
              variant="outline" 
            size="sm" 
              onClick={navigateUp}
          >
              <ArrowUp className="h-4 w-4 mr-1" />
              Up
          </Button>
          )}
      </div>
      
        <div className="flex space-x-2">
          {/* Add multi-select toggle button */}
          <Button 
            variant={isMultiSelectMode ? "secondary" : "outline"}
            size="sm" 
            onClick={toggleMultiSelectMode}
            className={isMultiSelectMode ? "border-primary" : ""}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            {isMultiSelectMode ? "Exit Selection" : "Select"}
          </Button>
          
          <TooltipProvider>
            <Tooltip open={showShortcutsTooltip} onOpenChange={setShowShortcutsTooltip}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowShortcutsTooltip(!showShortcutsTooltip)}
                >
                  <span className="sr-only">Keyboard shortcuts</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-keyboard"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="p-0 w-80">
                <div className="text-sm p-4 space-y-2">
                  <h4 className="font-medium">Keyboard Shortcuts</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>⌘/Ctrl + Z</span>
                      <span className="text-muted-foreground">Undo</span>
                </div>
                    <div className="flex justify-between">
                      <span>⇧ + ⌘/Ctrl + Z</span>
                      <span className="text-muted-foreground">Redo</span>
              </div>
                    <div className="flex justify-between">
                      <span>⌘/Ctrl + ↓</span>
                      <span className="text-muted-foreground">Navigate into folder</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⌘/Ctrl + ↑</span>
                      <span className="text-muted-foreground">Navigate up</span>
                    </div>
                    <div className="flex justify-between">
                      <span>F2</span>
                      <span className="text-muted-foreground">Rename selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delete</span>
                      <span className="text-muted-foreground">Delete selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enter</span>
                      <span className="text-muted-foreground">Open selected</span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
            Upload
          </Button>
        </div>
      </div>
      
      {/* Show action bar when in multi-select mode */}
      {isMultiSelectMode && (
        <div className="flex justify-between items-center mb-2 px-2 py-1 bg-accent/20 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {selectedItems.length} selected
            </span>
            <Button size="sm" variant="ghost" onClick={selectAllItems}>
              Select All
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Clear
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleBatchMoveClick} disabled={selectedItems.length === 0}>
              <FolderUp className="h-4 w-4 mr-1" />
              Move
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBatchDelete} disabled={selectedItems.length === 0}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
              </Button>
            </div>
          </div>
        )}
      
      {/* Current path breadcrumbs */}
      {renderBreadcrumbs()}
      
      {/* File list */}
      <div className="border rounded-lg bg-background">
        <div className="divide-y">
          {items.length > 0 ? (
            sortItems(items).map((item: FileItem | FolderItem) => renderFileItem(item))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {loading ? 'Loading...' : 'No files or folders found.'}
            </div>
          )}
        </div>
      </div>
      
      {/* New Folder Dialog with keyboard support */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent 
          className="sm:max-w-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newFolderName.trim()) {
              e.preventDefault();
              handleCreateFolder();
            }
          }}
        >
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="py-4">
                <FileUpload 
                  projectId={projectId} 
                  onUploadComplete={handleUploadComplete} 
                />
                </div>
        </DialogContent>
      </Dialog>
      
      {/* File Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl p-0 bg-black/5 backdrop-blur-xl border border-white/20">
          <DialogHeader className="p-4 bg-background/80 backdrop-blur-md">
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="bg-white dark:bg-black">
            {renderFilePreview()}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Rename Dialog with keyboard support */}
      <Dialog open={isRenaming} onOpenChange={(open) => !open && setIsRenaming(false)}>
        <DialogContent 
          className="sm:max-w-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newName.trim() && newName !== itemToRename?.name) {
              e.preventDefault();
              submitRename();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Rename {itemToRename ? ('children' in itemToRename ? 'Folder' : 'File') : ''}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="newName">New name</Label>
              <Input 
                id="newName" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Enter new name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRenaming(false);
                setItemToRename(null);
                setNewName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={submitRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Move To Dialog with keyboard support */}
      <Dialog open={showMoveToDialog} onOpenChange={(open) => !open && setShowMoveToDialog(false)}>
        <DialogContent 
          className="sm:max-w-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && selectedDestination) {
              e.preventDefault();
              handleMoveTo();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Move {itemToMove?.name}</DialogTitle>
            <DialogDescription>
              Select destination folder
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-lg bg-background max-h-[40vh] overflow-y-auto">
              <div 
                className={`flex items-center px-2 py-1 rounded-sm cursor-pointer ${
                  selectedDestination === 'root' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedDestination('root')}
              >
                <Home className="h-4 w-4 text-muted-foreground mr-2" />
                <span>Root</span>
              </div>
              {folderStructure.map(folder => renderFolderOption(folder))}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowMoveToDialog(false);
                setItemToMove(null);
                setSelectedDestination('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMoveTo}
              disabled={!selectedDestination}
            >
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 

