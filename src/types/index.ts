export interface Project {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Folder {
    id: string;
    name: string;
    project_id: string;
    path: string[];
    created_at: string;
  }
  
  export interface File {
    id: string;
    name: string;
    size: number;
    type: string;
    project_id: string;
    folder_id: string | null;
    storage_path: string;
    created_at: string;
  }
  
  export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  }
  
  export interface FileUploadResponse {
    path: string;
    id: string;
    success: boolean;
    error?: string;
  }
  
  export interface ProjectMetadata {
    total_files: number;
    total_size: number;
    last_modified: string;
  }