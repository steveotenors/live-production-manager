'use client';

import { FileItem } from '@/types/files';
import { supabaseClient } from './supabaseClient';
import { toast } from '@/components/ui/use-toast';

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// The bucket where files are stored
const STORAGE_BUCKET = 'production-files';

/**
 * List files in a specific path in the bucket
 * @param path Current path to list files from
 * @param bucketName Storage bucket name
 * @returns Array of file and folder items
 */
export async function listFiles(
  path: string = '',
  bucketName: string = 'production-files'
): Promise<FileItem[]> {
  try {
    console.log(`Listing files from ${bucketName}/${path}`);
    
    // Normalize path to ensure it has the correct format
    const normalizedPath = path.endsWith('/') || path === '' ? path : `${path}/`;
    
    // Get user session first to ensure authenticated
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData.session) {
      console.error('No active session found');
      toast({
        title: 'Authentication Error',
        description: 'Please log in to access files',
        variant: 'destructive',
      });
      return [];
    }
    
    // List all objects in the path
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .list(normalizedPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
    
    if (error) {
      console.error('Error listing files:', error.message);
      throw new Error(`Failed to list files: ${error.message}`);
    }
    
    if (!data) {
      return [];
    }
    
    // Process and format the files
    const files: FileItem[] = data.map((item) => {
      const isFolder = !!item.id && !item.metadata;
      const filePath = normalizedPath + item.name;
      
      return {
        id: item.id || `file-${item.name}`,
        name: item.name,
        type: isFolder ? 'folder' : 'file',
        size: item.metadata?.size || 0,
        updated: item.updated_at,
        created_at: item.created_at,
        path: isFolder ? filePath : normalizedPath + item.name,
        metadata: item.metadata,
      };
    });
    
    console.log(`Retrieved ${files.length} items`);
    return files;
  } catch (error) {
    console.error('Error in listFiles:', error);
    toast({
      title: 'Error Loading Files',
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return [];
  }
}

/**
 * Delete a file or folder from storage
 * @param path Path of the file or folder to delete
 * @param bucketName Storage bucket name
 */
export async function deleteFile(
  path: string,
  bucketName: string = 'production-files'
): Promise<void> {
  try {
    console.log(`Deleting ${path} from ${bucketName}`);
    
    // Check if path ends with / (a folder)
    const isFolder = path.endsWith('/') || (path.split('/').pop() || '').indexOf('.') === -1;
    
    if (isFolder) {
      // If it's a folder, we need to:
      // 1. List all files in the folder
      // 2. Delete all files in the folder
      // 3. Delete the folder itself (empty folders don't exist in object storage)
      
      // Ensure path ends with /
      const folderPath = path.endsWith('/') ? path : `${path}/`;
      
      // List all files in the folder
      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .list(folderPath);
      
      if (error) {
        throw new Error(`Failed to list folder contents: ${error.message}`);
      }
      
      // Delete all files and subfolders recursively
      for (const item of data || []) {
        const itemPath = `${folderPath}${item.name}`;
        if (!item.metadata) { // It's a subfolder
          await deleteFile(itemPath, bucketName);
        } else { // It's a file
          const { error: deleteError } = await supabaseClient.storage
            .from(bucketName)
            .remove([itemPath]);
          
          if (deleteError) {
            throw new Error(`Failed to delete file ${itemPath}: ${deleteError.message}`);
          }
        }
      }
      
      // Folders are automatically removed when empty in object storage
      console.log(`Folder ${folderPath} and its contents deleted successfully`);
    } else {
      // It's a file, just delete it directly
      const { error } = await supabaseClient.storage
        .from(bucketName)
        .remove([path]);
      
      if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      
      console.log(`File ${path} deleted successfully`);
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
}

/**
 * Create a new folder in storage
 * @param currentPath Current directory path
 * @param folderName Name of the new folder
 * @param bucketName Storage bucket name
 */
export async function createFolder(
  currentPath: string = '',
  folderName: string,
  bucketName: string = 'production-files'
): Promise<void> {
  try {
    console.log(`Creating folder ${folderName} in ${currentPath}`);
    
    // Sanitize folder name (remove any leading/trailing slashes)
    const sanitizedFolderName = folderName.replace(/^\/+|\/+$/g, '');
    
    if (!sanitizedFolderName) {
      throw new Error('Folder name cannot be empty');
    }
    
    // Format the path correctly
    let fullPath = currentPath;
    if (fullPath && !fullPath.endsWith('/')) {
      fullPath += '/';
    }
    fullPath += `${sanitizedFolderName}/.gitkeep`;
    
    // In object storage, folders are created by adding a placeholder file
    const { error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fullPath, new Uint8Array(0), {
        contentType: 'application/octet-stream',
        upsert: false,
      });
    
    if (error) {
      if (error.message.includes('already exists')) {
        throw new Error(`A folder named '${sanitizedFolderName}' already exists`);
      }
      throw new Error(`Failed to create folder: ${error.message}`);
    }
    
    console.log(`Folder ${sanitizedFolderName} created successfully`);
  } catch (error) {
    console.error('Error in createFolder:', error);
    throw error;
  }
}

/**
 * Get a signed URL for a file
 * @param path Path to the file
 * @param bucketName Storage bucket name
 * @param expiresIn Expiration time in seconds (default: 60)
 * @returns Signed URL
 */
export async function getSignedUrl(
  path: string,
  bucketName: string = 'production-files',
  expiresIn: number = 60
): Promise<string> {
  try {
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error generating signed URL:', error.message);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    throw error;
  }
}

/**
 * Upload a file with optional path
 * @param file File to upload
 * @param path Path to upload to (optional)
 * @param bucketName Storage bucket name
 * @returns Upload result
 */
export async function uploadFile(
  file: File,
  path: string = '',
  bucketName: string = 'production-files'
): Promise<{ path: string; url: string }> {
  try {
    // Generate a unique filename to avoid collisions
    const timestamp = new Date().getTime();
    const originalName = file.name;
    const ext = originalName.split('.').pop();
    const baseFileName = originalName.substring(0, originalName.lastIndexOf('.'));
    const newFileName = `${baseFileName}-${timestamp}.${ext}`;
    
    // Construct the full path
    let fullPath = path;
    if (fullPath && !fullPath.endsWith('/')) {
      fullPath += '/';
    }
    fullPath += newFileName;
    
    // Upload the file
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    
    if (!data?.path) {
      throw new Error('Upload succeeded but path is missing from response');
    }
    
    // Get the public URL
    const { data: urlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
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