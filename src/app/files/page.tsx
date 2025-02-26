'use client';

import React, { useState, useEffect } from 'react';
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
  Eye
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
  DialogHeader
} from '@/components/ui/dialog';

export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
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
  const bucketName = 'production-files';

  // File type categories
  const fileTypes = {
    'audio': ['.mp3', '.wav', '.ogg', '.aac'],
    'document': ['.pdf', '.doc', '.docx', '.txt'],
  };

  // Load files on component mount
  useEffect(() => {
    loadFiles();
    diagnoseStorageAccess();
  }, []);

  // Filter and sort files when dependencies change
  useEffect(() => {
    const filtered = files.filter(file => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        file.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply type filter
      const matchesType = !filterType || 
        fileTypes[filterType as keyof typeof fileTypes].some(ext => 
          file.name.toLowerCase().endsWith(ext));
      
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
          ? new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          : new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      } else { // size
        const sizeA = a.metadata?.size || 0;
        const sizeB = b.metadata?.size || 0;
        return sortOrder === 'asc' ? sizeA - sizeB : sizeB - sizeA;
      }
    });

    setFilteredFiles(sorted);
  }, [files, searchQuery, filterType, sortBy, sortOrder]);

  // Diagnose storage access issues
  const diagnoseStorageAccess = async () => {
    try {
      const result = await checkBucketSettings();
      setBucketInfo(result);
      
      if (!result.success) {
        setBucketError(result.message);
      }
    } catch (error) {
      console.error('Error diagnosing storage access:', error);
      setBucketError('Failed to diagnose storage access');
    }
  };

  // Load files from Supabase storage
  const loadFiles = async () => {
    try {
      setLoading(true);
      console.log('Loading files from bucket:', bucketName);
      
      const { data, error } = await supabaseClient.storage.from(bucketName).list();
      
      if (error) {
        console.error('Error loading files:', error.message);
        toast({
          title: 'Error Loading Files',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log('Files loaded successfully:', data.length);
        setFiles(data);
      } else {
        console.log('No files found or access denied');
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
      
      // Get file URL
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .createSignedUrl(fileName, 60); // URL valid for 60 seconds
      
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
      
      // Get file URL
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600); // URL valid for 1 hour
      
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
          name: fileName,
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

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="files" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
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
                <CardTitle className="text-2xl">Music Files</CardTitle>
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
                          : "Upload some music files to see them here."}
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
                    </div>
                  ) : (
                    view === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredFiles.map((file, index) => (
                          <div 
                            key={file.id || `file-${index}-${file.name}`} 
                            className="border border-border rounded-lg overflow-hidden transition-all hover:shadow-md hover:border-primary/40 flex flex-col"
                          >
                            <div className="p-4 flex items-center justify-center bg-muted/30 border-b h-32">
                              {getFileIcon(file.name)}
                            </div>
                            <div className="p-3 flex-1">
                              <h3 className="font-medium text-sm break-all line-clamp-2">{file.name}</h3>
                              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                <span>{formatFileSize(file.metadata?.size)}</span>
                                <span>{formatDate(file.created_at)}</span>
                              </div>
                            </div>
                            <div className="p-2 bg-muted/20 border-t flex justify-between">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownload(file.name)}
                                className="flex-1 justify-center"
                              >
                                <DownloadIcon className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              
                              {isPreviewable(file.name) && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handlePreview(file.name)}
                                  className="flex-1 justify-center"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">File</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-border">
                            {filteredFiles.map((file, index) => (
                              <tr key={file.id || `file-${index}-${file.name}`} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 mr-3">
                                      {getFileIcon(file.name)}
                                    </div>
                                    <div className="truncate max-w-[240px]">
                                      <div className="text-sm font-medium">{file.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {formatFileSize(file.metadata?.size)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {formatDate(file.created_at)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownload(file.name)}
                                    >
                                      <DownloadIcon className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                    
                                    {isPreviewable(file.name) && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePreview(file.name)}
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                      </Button>
                                    )}
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
                Upload music files and documents to share with your team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader 
                bucketName={bucketName}
                onUploadComplete={loadFiles}
                allowedFileTypes={[...fileTypes.audio, ...fileTypes.document]}
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
    </div>
  );
} 