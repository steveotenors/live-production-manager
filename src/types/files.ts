/**
 * Represents a file or folder item in storage
 */
export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  updated?: string;
  created_at?: string;
  path: string;
  metadata?: {
    size?: number;
    mimetype?: string;
    cacheControl?: string;
    lastModified?: string;
  };
}

/**
 * Represents a breadcrumb navigation item
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
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