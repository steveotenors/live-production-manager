/**
 * Represents a file or folder item
 */
export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: string;
  path: string;
  size?: number;
  updated: string;
  url?: string;
}

/**
 * Upload status for tracking file uploads
 */
export type UploadStatus = {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
};

/**
 * Breadcrumb item for navigation
 */
export type BreadcrumbItem = {
  name: string;
  path: string;
}; 