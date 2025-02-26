'use client';

import { useState } from 'react';
import { Folder, File, FileText, Music, Video, ArrowUp, ArrowDown, Search, List, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { FilePreview } from '@/components/FilePreview';

// Define the FileItem type
type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  size?: number;
  updated?: string;
  path: string;
  url?: string; // URL for previewing or downloading
};

export default function FilesPage() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'size' | 'updated'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPath, setCurrentPath] = useState<string>('/files');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Mock data - in real app, this would come from your database
  // and would be filtered by the currentPath
  const sampleFiles: FileItem[] = [
    { 
      id: '1', 
      name: 'Project Documents', 
      type: 'folder', 
      path: '/files/project-documents', 
      updated: '2 days ago' 
    },
    { 
      id: '2', 
      name: 'Song Recordings', 
      type: 'folder', 
      path: '/files/song-recordings', 
      updated: 'yesterday' 
    },
    { 
      id: '3', 
      name: 'Project Plan.pdf', 
      type: 'file', 
      fileType: 'pdf', 
      size: 2.4 * 1024 * 1024, 
      path: '/files/project-plan.pdf', 
      updated: 'June 12, 2023',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // Example URL
    },
    { 
      id: '4', 
      name: 'Final Mix v2.mp3', 
      type: 'file', 
      fileType: 'mp3', 
      size: 18.7 * 1024 * 1024, 
      path: '/files/final-mix-v2.mp3', 
      updated: 'June 10, 2023',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Example URL
    },
    { 
      id: '5', 
      name: 'Rehearsal Notes', 
      type: 'folder', 
      path: '/files/rehearsal-notes', 
      updated: 'June 5, 2023' 
    },
    { 
      id: '6', 
      name: 'Sheet Music', 
      type: 'folder', 
      path: '/files/sheet-music', 
      updated: 'June 8, 2023' 
    },
    { 
      id: '7', 
      name: 'Meeting Recording.mp4', 
      type: 'file', 
      fileType: 'mp4', 
      size: 156 * 1024 * 1024, 
      path: '/files/meeting-recording.mp4', 
      updated: 'June 3, 2023',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4' // Example URL
    },
    { 
      id: '8', 
      name: 'Budget.xlsx', 
      type: 'file', 
      fileType: 'xlsx', 
      size: 0.8 * 1024 * 1024, 
      path: '/files/budget.xlsx', 
      updated: 'June 15, 2023' 
    },
  ];
  
  // Filter files based on search query and current path
  const filteredFiles = sampleFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        if (comparison === 0 && a.fileType && b.fileType) {
          comparison = a.fileType.localeCompare(b.fileType);
        }
        break;
      case 'size':
        // Sort folders first, then by size
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        comparison = (a.size || 0) - (b.size || 0);
        break;
      case 'updated':
        // Simple string comparison - in real app use date parsing
        comparison = String(a.updated || '').localeCompare(String(b.updated || ''));
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Toggle sort
  const handleSort = (column: 'name' | 'type' | 'size' | 'updated') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Handle file click for preview
  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    setPreviewOpen(true);
  };

  // Handle folder navigation
  const handleFolderNavigation = (path: string) => {
    setCurrentPath(path);
    setPreviewOpen(false);
    // In a real app, you would fetch folder contents here
  };
  
  function formatSize(bytes?: number): string {
    if (bytes === undefined) return '-';
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  
  function getFileIcon(file: FileItem) {
    if (file.type === 'folder') {
      return <Folder className="h-5 w-5 text-primary" />;
    }
    
    switch (file.fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-rose-500" />;
      case 'mp3':
      case 'wav':
        return <Music className="h-5 w-5 text-purple-500" />;
      case 'mp4':
      case 'mov':
        return <Video className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  }
  
  return (
    <>
      <PageHeader 
        title="Files" 
        description="Access all your production files"
      >
        <Button>Upload New File</Button>
      </PageHeader>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button 
            variant={view === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setView('grid')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
        </div>
      </div>
      
      {/* Breadcrumb navigation */}
      <div className="mb-4 flex items-center text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground font-normal" 
          onClick={() => handleFolderNavigation('/files')}
        >
          Files
        </Button>
        {/* In a real app, show actual breadcrumb path based on currentPath */}
        {currentPath !== '/files' && (
          <>
            <span className="mx-1 text-muted-foreground">/</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-foreground font-normal"
            >
              Current Folder
            </Button>
          </>
        )}
      </div>
      
      {/* List View */}
      {view === 'list' && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">
                  <button 
                    className="flex items-center hover:text-foreground"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortBy === 'name' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center hover:text-foreground"
                    onClick={() => handleSort('type')}
                  >
                    Type
                    {sortBy === 'type' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button 
                    className="flex items-center hover:text-foreground ml-auto"
                    onClick={() => handleSort('size')}
                  >
                    Size
                    {sortBy === 'size' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button 
                    className="flex items-center hover:text-foreground ml-auto"
                    onClick={() => handleSort('updated')}
                  >
                    Last Updated
                    {sortBy === 'updated' && (
                      sortDirection === 'asc' ? 
                        <ArrowUp className="ml-1 h-3 w-3" /> : 
                        <ArrowDown className="ml-1 h-3 w-3" />
                    )}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No files found
                  </TableCell>
                </TableRow>
              ) : (
                sortedFiles.map((file) => (
                  <TableRow 
                    key={file.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleFileClick(file)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getFileIcon(file)}
                        <span className="ml-2">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {file.type === 'folder' ? (
                        <Badge variant="outline">Folder</Badge>
                      ) : (
                        <Badge variant="outline">{file.fileType?.toUpperCase() || 'File'}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {file.type === 'folder' ? (
                        '--'
                      ) : (
                        formatSize(file.size)
                      )}
                    </TableCell>
                    <TableCell className="text-right">{file.updated || '--'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedFiles.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No files found
            </div>
          ) : (
            sortedFiles.map((file) => (
              <div 
                key={file.id}
                className="border rounded-lg p-4 flex flex-col cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all"
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-center mb-3">
                  {getFileIcon(file)}
                  <span className="ml-2 font-medium truncate">{file.name}</span>
                </div>
                <div className="flex justify-between mt-auto text-xs text-muted-foreground">
                  <span>
                    {file.type === 'folder' ? (
                      'Folder'
                    ) : (
                      file.fileType?.toUpperCase() || 'File'
                    )}
                  </span>
                  <span>
                    {file.type === 'folder' ? '' : formatSize(file.size)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Updated: {file.updated || '--'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* File Preview Dialog */}
      <FilePreview 
        file={selectedFile} 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)}
        onNavigate={handleFolderNavigation}
      />
    </>
  );
} 