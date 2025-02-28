/**
 * File system type definitions
 */

/**
 * Basic file item interface
 */
export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  updated?: string;
  metadata?: any;
}

/**
 * Extended file details with additional metadata
 */
export interface FileDetails extends FileItem {
  created_at?: string;
  last_accessed?: string;
  content_type?: string;
  extension?: string;
  is_favorite?: boolean;
  tags?: string[];
  permissions?: FilePermissions;
  version?: number;
  versions?: FileVersion[];
}

/**
 * File version information
 */
export interface FileVersion {
  id: string;
  created_at: string;
  created_by?: string;
  size?: number;
  path: string;
  comment?: string;
}

/**
 * File access permissions
 */
export interface FilePermissions {
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  can_share: boolean;
  owner: string;
  shared_with?: string[];
}

/**
 * Upload task information
 */
export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  path: string;
  created_at: string;
}

/**
 * Download task information
 */
export interface DownloadTask {
  id: string;
  filename: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
  path: string;
  created_at: string;
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Storage bucket information
 */
export interface BucketInfo {
  id: string;
  name: string;
  owner: string;
  public: boolean;
  created_at: string;
  updated_at: string;
  size_limit?: number;
  file_size_limit?: number;
}

/**
 * File operation result interface
 */
export interface FileOperationResult {
  success: boolean;
  error: string | null;
  path?: string;
  message?: string;
}

/**
 * File search options
 */
export interface FileSearchOptions {
  term: string;
  path?: string;
  recursive?: boolean;
  fileTypes?: string[];
  sortBy?: 'name' | 'size' | 'updated';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

/**
 * File upload status
 */
export interface FileUploadStatus {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  path?: string;
  url?: string;
}

/**
 * Upload response from Supabase
 */
export interface UploadResponse {
  path: string;
  url: string;
} 