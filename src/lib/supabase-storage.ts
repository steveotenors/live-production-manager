'use client';

import { FileItem } from '@/types/files';
import { supabaseClient } from './supabaseClient';

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// The bucket where files are stored
const STORAGE_BUCKET = 'production-files';

/**
 * List files in the specified path
 * @param path Directory path to list
 * @returns Array of file items
 */
export async function listFiles(path: string): Promise<FileItem[]> {
  console.log(`[DEBUG-listFiles] Starting with path: "${path}"`);
  console.log(`[DEBUG-listFiles] Using bucket: "${STORAGE_BUCKET}"`);
  
  // Normalize the path
  const normalizedPath = path.endsWith('/') ? path : `${path}/`;
  console.log(`[DEBUG-listFiles] Normalized path: "${normalizedPath}"`);
  
  try {
    // IMPORTANT: Direct access approach
    // Instead of first checking for bucket existence, we directly access the bucket
    // This works even when the anon key doesn't have permission to list buckets
    console.log(`[DEBUG-listFiles] Directly accessing bucket: "${STORAGE_BUCKET}"`);
    
    // Small delay before file listing request
    await delay(500);
    
    const { data: objects, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)  // Direct access to the known bucket
      .list(normalizedPath, {
        sortBy: { column: 'name', order: 'asc' }
      });
    
    console.log(`[DEBUG-listFiles] Supabase response:`, { objects, error });
    
    if (error) {
      console.error('[DEBUG-listFiles] Error listing files:', error);
      throw error;
    }
    
    if (!objects) {
      console.log('[DEBUG-listFiles] No objects returned');
      return [];
    }
    
    console.log(`[DEBUG-listFiles] Processing ${objects.length} objects`);
    
    // Parse the objects into our file format
    const fileItems: FileItem[] = objects.map(obj => {
      console.log(`[DEBUG-listFiles] Processing object:`, obj);
      
      // Determine if the object is a folder
      const isFolder = !obj.metadata || obj.metadata.size === undefined;
      
      // Get file extension for file type
      let fileType = '';
      if (!isFolder && obj.name.includes('.')) {
        fileType = obj.name.split('.').pop()?.toLowerCase() || '';
      }
      
      // Get public URL for files
      let url = undefined;
      if (!isFolder) {
        try {
          const { data } = supabaseClient.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(normalizedPath + obj.name);
          url = data.publicUrl;
        } catch (e) {
          console.error(`[DEBUG-listFiles] Failed to get public URL for ${obj.name}:`, e);
        }
      }
      
      const fileItem = {
        id: obj.id || `${normalizedPath}${obj.name}`,
        name: obj.name,
        type: (isFolder ? 'folder' : 'file') as 'folder' | 'file',
        fileType: fileType,
        path: normalizedPath + obj.name + (isFolder ? '/' : ''),
        size: !isFolder && obj.metadata?.size ? Number(obj.metadata.size) : undefined,
        updated: obj.updated_at || '',
        url: url
      };
      
      console.log(`[DEBUG-listFiles] Created FileItem:`, fileItem);
      return fileItem;
    });
    
    console.log(`[DEBUG-listFiles] Returning ${fileItems.length} FileItems`);
    return fileItems;
  } catch (error) {
    console.error('[DEBUG-listFiles] Error:', error);
    throw error;
  }
}

/**
 * Delete a file or folder from storage
 * @param path Path to the file or folder to delete
 * @returns Result of the deletion operation
 */
export async function deleteFile(path: string) {
  try {
    // Check if it's a folder (ends with /)
    if (path.endsWith('/')) {
      // List all files in the folder
      const files = await listFiles(path);
      
      // Delete each file/subfolder recursively
      for (const file of files) {
        await deleteFile(file.path);
      }
      
      // The folder itself is removed when empty in Supabase Storage
      return { success: true };
    } else {
      // It's a file, delete it directly
      const { data, error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .remove([path]);
        
      if (error) throw error;
      
      return { success: true, data };
    }
  } catch (error) {
    console.error('Error deleting file:', error);
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
    const { data, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to allow overwriting existing files
      });
    
    if (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from upload');
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
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
    const { error } = await supabaseClient.storage
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
    const { data, error } = await supabaseClient.storage
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

/**
 * Deletes all files in the storage bucket
 * @returns A promise that resolves when all files are deleted
 */
export async function deleteAllFiles(): Promise<void> {
  try {
    await deleteFilesRecursively('');
    console.log('Successfully deleted all files and folders');
  } catch (error) {
    console.error('Failed to delete files:', error);
    throw error;
  }
}

/**
 * Recursively deletes files and folders from a path
 * @param path The path to delete files from
 */
async function deleteFilesRecursively(path: string): Promise<void> {
  try {
    // Normalize path
    const normalizedPath = path ? path.endsWith('/') ? path : `${path}/` : '';
    
    // List all files and folders in this path
    const { data: items, error: listError } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .list(normalizedPath);
    
    if (listError) {
      console.error(`Error listing files in ${normalizedPath}:`, listError.message);
      throw listError;
    }
    
    if (!items || items.length === 0) {
      return;
    }
    
    // Separate folders and files
    const folders = items.filter(item => !item.metadata);
    const files = items.filter(item => item.metadata);
    
    // Recursively process subfolders first
    for (const folder of folders) {
      await deleteFilesRecursively(`${normalizedPath}${folder.name}`);
    }
    
    // Then delete files at this level
    if (files.length > 0) {
      const filePaths = files.map(file => `${normalizedPath}${file.name}`);
      
      const { error: deleteError } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .remove(filePaths);
      
      if (deleteError) {
        console.error(`Error deleting files in ${normalizedPath}:`, deleteError.message);
        throw deleteError;
      }
      
      console.log(`Deleted ${filePaths.length} files from ${normalizedPath}`);
    }
  } catch (error) {
    console.error(`Failed to process path ${path}:`, error);
    throw error;
  }
}

/**
 * Creates a signed URL for accessing a file
 * @param path The path of the file
 * @param expiresIn Expiry time in seconds (default: 3600 = 1 hour)
 * @returns A promise that resolves to the signed URL string
 */
export async function getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    // Add delay to prevent rate limiting
    await delay(500);
    
    const { data, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error.message);
      throw error;
    }
    
    return data?.signedUrl || null;
  } catch (error) {
    console.error('Failed to create signed URL:', error);
    return null;
  }
}

/**
 * Checks the bucket contents and provides detailed diagnostic information
 * @returns A promise resolving to diagnostic information about the bucket
 */
export async function checkBucketStatus(): Promise<{ 
  success: boolean; 
  message: string; 
  details: any;
}> {
  try {
    console.log(`[BUCKET-STATUS] Checking bucket status for "${STORAGE_BUCKET}"`);
    
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
    
    // Add delay to prevent rate limiting
    await delay(500);
    
    if (bucketsError) {
      return { 
        success: false, 
        message: `Failed to list buckets: ${bucketsError.message}`,
        details: { error: bucketsError }
      };
    }
    
    if (!buckets || buckets.length === 0) {
      return {
        success: false,
        message: 'No storage buckets available in the Supabase project',
        details: { buckets: [] }
      };
    }
    
    // Find our target bucket (case-insensitive search)
    const foundBucket = buckets.find(b => 
      b.name.toLowerCase() === STORAGE_BUCKET.toLowerCase()
    );
    
    if (!foundBucket) {
      return {
        success: false,
        message: `Bucket "${STORAGE_BUCKET}" not found`,
        details: { 
          availableBuckets: buckets.map(b => b.name),
          searchedFor: STORAGE_BUCKET
        }
      };
    }
    
    // Use the exact case of the bucket name as found in Supabase
    const exactBucketName = foundBucket.name;
    
    // Try to list files from the root of the bucket
    await delay(500); // Add delay before the next API call
    
    const { data: files, error: filesError } = await supabaseClient.storage
      .from(exactBucketName)
      .list('', { sortBy: { column: 'name', order: 'asc' } });
    
    if (filesError) {
      return {
        success: false,
        message: `Error listing files in "${exactBucketName}": ${filesError.message}`,
        details: { error: filesError, bucketName: exactBucketName }
      };
    }
    
    return {
      success: true,
      message: `Found ${files?.length || 0} files in bucket "${exactBucketName}"`,
      details: {
        bucketName: exactBucketName,
        files: files || [],
        fileCount: files?.length || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: { error }
    };
  }
}

/**
 * Direct check of the bucket with minimal abstractions
 */
export async function directBucketCheck() {
  console.log('[DIRECT-CHECK] Starting direct bucket check...');
  
  try {
    // 1. Get the raw client and check the URL
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('[DIRECT-CHECK] Using connection:', { 
      url,
      keyPrefix: anonKey ? anonKey.substring(0, 10) + '...' : undefined
    });
    
    // 2. List all buckets without any filtering
    const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
    
    if (listError) {
      return {
        success: false,
        message: `Error listing buckets: ${listError.message}`,
        details: { error: listError }
      };
    }
    
    // Log all bucket names
    const bucketNames = buckets?.map(b => b.name) || [];
    console.log('[DIRECT-CHECK] All buckets found:', bucketNames);
    
    // 3. Try to find our target bucket
    const targetName = 'production-files';
    const exactMatch = buckets?.find(b => b.name === targetName);
    const caseInsensitiveMatch = buckets?.find(b => b.name.toLowerCase() === targetName.toLowerCase());
    
    if (exactMatch) {
      console.log(`[DIRECT-CHECK] Found exact bucket match: "${exactMatch.name}"`);
    } else if (caseInsensitiveMatch) {
      console.log(`[DIRECT-CHECK] Found case-insensitive match: "${caseInsensitiveMatch.name}" for "${targetName}"`);
    } else {
      console.log(`[DIRECT-CHECK] No bucket found matching "${targetName}"`);
    }
    
    // 4. Try to directly access the bucket
    const bucketToTry = exactMatch?.name || caseInsensitiveMatch?.name || targetName;
    
    try {
      console.log(`[DIRECT-CHECK] Attempting to access bucket: "${bucketToTry}"`);
      const { data: files, error: filesError } = await supabaseClient.storage
        .from(bucketToTry)
        .list('');
      
      if (filesError) {
        return {
          success: false,
          message: `Error accessing bucket "${bucketToTry}": ${filesError.message}`,
          details: { 
            error: filesError,
            buckets: bucketNames,
            exactMatch: !!exactMatch,
            caseMatch: !!caseInsensitiveMatch,
          }
        };
      }
      
      console.log(`[DIRECT-CHECK] Successfully accessed bucket "${bucketToTry}", found ${files?.length || 0} files/folders`);
      
      return {
        success: true,
        message: `Found ${files?.length || 0} items in bucket "${bucketToTry}"`,
        details: {
          buckets: bucketNames,
          exactMatch: !!exactMatch,
          caseMatch: !!caseInsensitiveMatch,
          files: files || [],
          bucketUsed: bucketToTry
        }
      };
    } catch (e) {
      return {
        success: false,
        message: `Error accessing bucket "${bucketToTry}": ${e instanceof Error ? e.message : String(e)}`,
        details: { 
          error: e,
          buckets: bucketNames,
          exactMatch: !!exactMatch,
          caseMatch: !!caseInsensitiveMatch,
        }
      };
    }
  } catch (error) {
    console.error('[DIRECT-CHECK] Unexpected error:', error);
    return {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: { error }
    };
  }
} 