'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FileItem } from '@/types/files';

// Initialize the Supabase client
const supabase = createClientComponentClient();

// The bucket where files are stored
const STORAGE_BUCKET = 'production-files';

/**
 * Fetches files and folders from Supabase Storage
 * @param path The path to list files from (e.g., 'documents/')
 * @returns A promise resolving to an array of FileItems
 */
export async function listFiles(path: string = ''): Promise<FileItem[]> {
  try {
    // Normalize the path to ensure it ends with '/' if not empty
    const normalizedPath = path ? path.endsWith('/') ? path : `${path}/` : '';
    
    // Fetch files from Supabase storage
    const { data: files, error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .list(normalizedPath, {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('Error fetching files:', error.message);
      throw error;
    }
    
    if (!files) return [];
    
    // Transform the Supabase file list into our FileItem format
    const fileItems: FileItem[] = files.map(file => {
      const isFolder = !file.metadata;
      const fileType = !isFolder ? file.name.split('.').pop()?.toLowerCase() : undefined;
      
      return {
        id: file.id,
        name: file.name,
        type: isFolder ? 'folder' : 'file',
        fileType,
        size: file.metadata?.size,
        updated: file.metadata?.lastModified 
          ? new Date(file.metadata.lastModified).toLocaleString() 
          : undefined,
        path: normalizedPath + file.name + (isFolder ? '/' : ''),
        url: !isFolder 
          ? supabase.storage.from(STORAGE_BUCKET).getPublicUrl(normalizedPath + file.name).data.publicUrl 
          : undefined
      };
    });
    
    return fileItems;
  } catch (error) {
    console.error('Failed to list files:', error);
    throw error;
  }
}

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param path The path where to upload the file (e.g., 'documents/')
 * @returns A promise resolving to the uploaded file URL
 */
export async function uploadFile(file: File, path: string = ''): Promise<string> {
  try {
    // Normalize the path
    const normalizedPath = path ? path.endsWith('/') ? path : `${path}/` : '';
    const filePath = `${normalizedPath}${file.name}`;
    
    // Upload the file
    const { error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param path The path of the file to delete
 * @returns A promise that resolves when the file is deleted
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const { error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
}

/**
 * Creates a new folder in Supabase Storage
 * @param path The current path
 * @param folderName The name of the new folder
 * @returns A promise that resolves when the folder is created
 */
export async function createFolder(path: string, folderName: string): Promise<void> {
  try {
    // Normalize the path
    const normalizedPath = path ? path.endsWith('/') ? path : `${path}/` : '';
    const folderPath = `${normalizedPath}${folderName}/.placeholder`;
    
    // Create an empty file as a placeholder to create the folder
    const { error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(folderPath, new Blob(['']), {
        contentType: 'text/plain',
        upsert: false
      });
    
    if (error) {
      console.error('Error creating folder:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
}

/**
 * Downloads a file from Supabase Storage
 * @param path The path of the file to download
 * @returns A promise that resolves to the downloaded file
 */
export async function downloadFile(path: string): Promise<Blob> {
  try {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .download(path);
    
    if (error) {
      console.error('Error downloading file:', error.message);
      throw error;
    }
    
    if (!data) {
      throw new Error('No file data received');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
} 