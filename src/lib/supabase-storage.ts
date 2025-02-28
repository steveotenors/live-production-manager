'use client';

import { FileItem } from '@/types/files';
import { supabaseClient } from './supabaseClient';
import { toast } from '@/components/ui/use-toast';

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Default delay between API calls to prevent rate limiting (200ms)
const API_CALL_DELAY = 200; 

// The bucket where files are stored
const STORAGE_BUCKET = 'production-files';

// Default bucket name
const DEFAULT_BUCKET = 'production-files';

/**
 * Helper function to handle common storage errors with consistent messaging
 * @param error The error object from Supabase
 * @param operation Description of the operation that failed
 */
function handleStorageError(error: any, operation: string) {
  console.error(`Storage ${operation} error:`, error);
  
  // Handle known error types
  if (error.message && error.message.includes('infinite recursion detected in policy')) {
    toast({
      title: 'Storage Access Error',
      description: 'There is an issue with storage permissions. Please contact your administrator.',
      variant: 'destructive',
    });
    return 'Storage policy configuration issue. Please contact an administrator.';
  }
  
  // Rate limit errors
  if (error.message && error.message.includes('rate limit')) {
    toast({
      title: 'Too Many Requests',
      description: 'Please wait a moment before trying again.',
      variant: 'destructive',
    });
    return 'Rate limit exceeded. Please wait and try again.';
  }
  
  // General error message
  toast({
    title: `Error ${operation}`,
    description: error.message || 'An unexpected error occurred',
    variant: 'destructive',
  });
  
  return error.message || 'Unknown error';
}

/**
 * List files in a directory
 * @param path Directory path
 * @param bucket Bucket name
 * @returns List of files and directories
 */
export async function listFiles(path: string = '', bucket: string = DEFAULT_BUCKET) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .list(path, {
        sortBy: { column: 'name', order: 'asc' },
      });
    
    if (error) {
      // Handle specific error cases
      const errorMessage = handleStorageError(error, 'listing files');
      return {
        data: [],
        error: errorMessage
      };
    }
    
    // Process files to identify folders and regular files
    const processedFiles = data?.map((item: any) => {
      // If it's an entry with null metadata or a .folder file, treat it as a folder
      const isFolder = item.metadata === null || 
                        item.name.endsWith('.folder') || 
                        item.metadata?.mimetype === 'application/x-directory';
      
      if (isFolder) {
        // For folders, clean up the name if it has .folder extension
        const displayName = item.name.endsWith('.folder') 
          ? item.name.replace('.folder', '') 
          : item.name;
          
        const folderPath = path 
          ? `${path}${path.endsWith('/') ? '' : '/'}${displayName}/` 
          : `${displayName}/`;
        
        return {
          id: `folder-${folderPath}`,
          name: displayName,
          path: folderPath,
          type: 'folder' as const,
          size: 0,
          updated: item.updated_at || item.created_at,
          created_at: item.created_at
        };
      }
      
      // Otherwise, it's a regular file
      const filePath = path 
        ? `${path}${path.endsWith('/') ? '' : '/'}${item.name}` 
        : item.name;
      
      return {
        id: `file-${filePath}`,
        name: item.name,
        path: filePath,
        type: 'file' as const,
        size: item.metadata?.size || 0,
        updated: item.updated_at || item.created_at,
        metadata: item.metadata,
        created_at: item.created_at
      };
    }) || [];
    
    return { data: processedFiles, error: null };
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get a signed URL for a file
 * @param filePath Path to the file
 * @param expiresIn Expiration time in seconds
 * @param bucket Bucket name
 * @returns Signed URL
 */
export async function getFileUrl(filePath: string, expiresIn: number = 3600, bucket: string = DEFAULT_BUCKET) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);
    
    if (error) {
      // Handle specific error cases
      const errorMessage = handleStorageError(error, 'generating file URL');
      return { data: null, error: errorMessage };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error getting file URL:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Delete a file or folder
 * @param path Path to the file or folder
 * @param bucket Bucket name
 * @param isFolder Whether the path is a folder
 * @returns Success or error
 */
export async function deleteFile(path: string, bucket: string = DEFAULT_BUCKET, isFolder: boolean = false) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    if (isFolder) {
      // For folders, we need to delete all files inside first
      console.log('Deleting folder:', path);
      
      // List all files in the folder
      const { data: folderContents, error: listError } = await supabaseClient.storage
        .from(bucket)
        .list(path, {
          sortBy: { column: 'name', order: 'asc' },
        });
      
      if (listError) {
        // Handle specific error cases
        const errorMessage = handleStorageError(listError, 'listing folder contents for deletion');
        return { data: null, error: errorMessage };
      }
      
      // Delete all files in the folder
      if (folderContents && folderContents.length > 0) {
        const filesToDelete = folderContents.map(item => 
          `${path}${path.endsWith('/') ? '' : '/'}${item.name}`
        );
        
        // Delete files in batches of 10
        while (filesToDelete.length > 0) {
          const batch = filesToDelete.splice(0, 10);
          
          // Add delay between batch deletion requests
          await delay(API_CALL_DELAY);
          
          const { error: deleteError } = await supabaseClient.storage
            .from(bucket)
            .remove(batch);
          
          if (deleteError) {
            const errorMessage = handleStorageError(deleteError, 'deleting folder contents');
            return { success: false, error: errorMessage };
          }
        }
      }
      
      // Finally, delete the folder marker file if it exists
      // Add delay before final deletion
      await delay(API_CALL_DELAY);
      
      const folderMarkerPath = `${path}${path.endsWith('/') ? '' : '/'}`;
      const { error: markerError } = await supabaseClient.storage
        .from(bucket)
        .remove([`${folderMarkerPath}.folder`]);
      
      if (markerError) {
        // Don't treat this as fatal, just log it
        console.log('No marker file found or error deleting marker:', markerError);
      }
      
      return { success: true, error: null };
    } else {
      // For regular files, just delete them
      const { error } = await supabaseClient.storage
        .from(bucket)
        .remove([path]);
      
      if (error) {
        const errorMessage = handleStorageError(error, 'deleting file');
        return { success: false, error: errorMessage };
      }
      
      return { success: true, error: null };
    }
  } catch (error) {
    console.error('Error deleting file/folder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Create a new folder
 * @param folderPath Path to the new folder
 * @param bucket Bucket name
 * @returns Success or error
 */
export async function createFolder(folderPath: string, bucket: string = DEFAULT_BUCKET) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    // Create a .folder file as a marker for the folder
    const { error } = await supabaseClient.storage
      .from(bucket)
      .upload(`${folderPath}/.folder`, new File([], `.folder`));
    
    if (error) {
      const errorMessage = handleStorageError(error, 'creating folder');
      return { success: false, error: errorMessage };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error creating folder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Move a file from one location to another
 * @param sourcePath Source file path
 * @param targetPath Target file path
 * @param bucket Bucket name
 * @returns Success or error
 */
export async function moveFile(sourcePath: string, targetPath: string, bucket: string = DEFAULT_BUCKET) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    // Check if file with same name exists at target
    const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/'));
    const fileName = targetPath.substring(targetPath.lastIndexOf('/') + 1);
    
    const { data: existingFiles, error: listError } = await supabaseClient.storage
      .from(bucket)
      .list(targetDir, {
        limit: 100,
      });
    
    if (listError) {
      const errorMessage = handleStorageError(listError, 'checking target directory');
      return { success: false, error: errorMessage };
    }
    
    // If file with same name exists, add timestamp to filename
    if (existingFiles?.some(f => f.name === fileName)) {
      const timestamp = new Date().getTime();
      const fileExt = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
      const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
      const newFileName = `${baseName}_${timestamp}${fileExt}`;
      
      // Update target path with new filename
      targetPath = `${targetDir}/${newFileName}`;
    }
    
    // Add delay before download
    await delay(API_CALL_DELAY);
    
    // Download the file from source
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from(bucket)
      .download(sourcePath);
    
    if (downloadError) {
      const errorMessage = handleStorageError(downloadError, 'downloading file for move');
      return { success: false, error: errorMessage };
    }
    
    if (!fileData) {
      return { success: false, error: 'File data is null' };
    }
    
    // Add delay before upload
    await delay(API_CALL_DELAY);
    
    // Upload to target
    const { error: uploadError } = await supabaseClient.storage
      .from(bucket)
      .upload(targetPath, fileData, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      const errorMessage = handleStorageError(uploadError, 'uploading file to new location');
      return { success: false, error: errorMessage };
    }
    
    // Add delay before deletion
    await delay(API_CALL_DELAY);
    
    // Delete from source
    const { error: deleteError } = await supabaseClient.storage
      .from(bucket)
      .remove([sourcePath]);
    
    if (deleteError) {
      const errorMessage = handleStorageError(deleteError, 'removing original file');
      // Don't fail the operation if delete fails, just log it
      console.warn('Failed to delete source file after move:', errorMessage);
    }
    
    return { success: true, error: null, newPath: targetPath };
  } catch (error) {
    console.error('Error moving file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      newPath: null
    };
  }
}

/**
 * Copy a file from one location to another
 * @param sourcePath Source file path
 * @param targetPath Target file path
 * @param bucket Bucket name
 * @returns Success or error
 */
export async function copyFile(sourcePath: string, targetPath: string, bucket: string = DEFAULT_BUCKET) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    // Check if file with same name exists at target
    const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/'));
    const fileName = targetPath.substring(targetPath.lastIndexOf('/') + 1);
    
    const { data: existingFiles, error: listError } = await supabaseClient.storage
      .from(bucket)
      .list(targetDir, {
        limit: 100,
      });
    
    if (listError) {
      const errorMessage = handleStorageError(listError, 'checking target directory');
      return { success: false, error: errorMessage, newPath: null };
    }
    
    // If file with same name exists, add timestamp to filename
    if (existingFiles?.some(f => f.name === fileName)) {
      const timestamp = new Date().getTime();
      const fileExt = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
      const baseName = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
      const newFileName = `${baseName}_${timestamp}${fileExt}`;
      
      // Update target path with new filename
      targetPath = `${targetDir}/${newFileName}`;
    }
    
    // Add delay before download
    await delay(API_CALL_DELAY);
    
    // Download the file from source
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from(bucket)
      .download(sourcePath);
    
    if (downloadError) {
      const errorMessage = handleStorageError(downloadError, 'downloading file for copy');
      return { success: false, error: errorMessage, newPath: null };
    }
    
    if (!fileData) {
      return { success: false, error: 'File data is null', newPath: null };
    }
    
    // Add delay before upload
    await delay(API_CALL_DELAY);
    
    // Upload to target
    const { error: uploadError } = await supabaseClient.storage
      .from(bucket)
      .upload(targetPath, fileData, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      const errorMessage = handleStorageError(uploadError, 'uploading file copy');
      return { success: false, error: errorMessage, newPath: null };
    }
    
    return { success: true, error: null, newPath: targetPath };
  } catch (error) {
    console.error('Error copying file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      newPath: null
    };
  }
}

/**
 * Rename a file or folder
 * @param currentPath Current path
 * @param newName New name (not full path)
 * @param bucket Bucket name
 * @param isFolder Whether the path is a folder
 * @returns Success or error
 */
export async function renameFile(
  currentPath: string, 
  newName: string, 
  bucket: string = DEFAULT_BUCKET,
  isFolder: boolean = false
) {
  try {
    // Add delay to prevent too many requests
    await delay(API_CALL_DELAY);
    
    // Extract directory and construct new path
    const lastSlashIndex = currentPath.lastIndexOf('/');
    const directory = lastSlashIndex >= 0 ? currentPath.substring(0, lastSlashIndex) : '';
    const newPath = directory ? `${directory}/${newName}` : newName;
    
    if (isFolder) {
      // For folders, we need to:
      // 1. List all files in the folder
      // 2. Move each file to a new path
      // 3. Create a new folder marker
      // 4. Delete the old folder marker
      
      // First, make sure the folder path ends with /
      const folderPath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
      const newFolderPath = newPath.endsWith('/') ? newPath : `${newPath}/`;
      
      // List all files in the folder
      const { data: folderContents, error: listError } = await supabaseClient.storage
        .from(bucket)
        .list(folderPath, {
          sortBy: { column: 'name', order: 'asc' },
        });
      
      if (listError) {
        const errorMessage = handleStorageError(listError, 'listing folder contents for rename');
        return { success: false, error: errorMessage, newPath: null };
      }
      
      // Move each file
      if (folderContents && folderContents.length > 0) {
        for (const item of folderContents) {
          // Add delay between operations
          await delay(API_CALL_DELAY);
          
          const sourcePath = `${folderPath}${item.name}`;
          const targetPath = `${newFolderPath}${item.name}`;
          
          // Use our moveFile function
          const { success, error } = await moveFile(sourcePath, targetPath, bucket);
          
          if (!success) {
            return { 
              success: false, 
              error: `Failed to move file ${sourcePath}: ${error}`,
              newPath: null
            };
          }
        }
      }
      
      // Add delay before creating folder
      await delay(API_CALL_DELAY);
      
      // Create new folder marker
      const { success: folderSuccess, error: folderError } = await createFolder(newFolderPath, bucket);
      
      if (!folderSuccess) {
        console.warn('Failed to create folder marker during rename:', folderError);
        // Don't fail the operation if this fails, as files were moved successfully
      }
      
      // Add delay before deleting
      await delay(API_CALL_DELAY);
      
      // Delete old folder marker
      const { error: deleteError } = await supabaseClient.storage
        .from(bucket)
        .remove([`${folderPath}.folder`]);
      
      if (deleteError) {
        console.log('No marker file found or error deleting marker:', deleteError);
        // Don't fail operation just for marker cleanup
      }
      
      return { success: true, error: null, newPath: newFolderPath };
    } else {
      // For files, just use moveFile
      const { success, error, newPath: resultPath } = await moveFile(currentPath, newPath, bucket);
      
      return { success, error, newPath: success ? resultPath : null };
    }
  } catch (error) {
    console.error('Error renaming file/folder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      newPath: null
    };
  }
}

/**
 * Process multiple files with the same operation (delete, move, etc.)
 * @param paths Array of file paths
 * @param operation Function to process each file
 * @param bucket Bucket name
 * @returns Results for each file
 */
export async function batchProcessFiles(
  paths: string[],
  operation: (path: string, bucket: string) => Promise<any>,
  bucket: string = DEFAULT_BUCKET
) {
  const results = [];
  
  for (const path of paths) {
    const result = await operation(path, bucket);
    results.push({ path, ...result });
    
    // Use consistent delay value to prevent rate limiting
    await delay(API_CALL_DELAY);
  }
  
  return results;
}

/**
 * Search for files by name
 * @param searchTerm Search term
 * @param path Directory to search in (recursive)
 * @param bucket Bucket name
 * @returns Matching files
 */
export async function searchFiles(searchTerm: string, path: string = '', bucket: string = DEFAULT_BUCKET) {
  try {
    // Add initial delay
    await delay(API_CALL_DELAY);
    
    // Helper function to recursively search directories
    async function searchDirectory(dirPath: string, results: any[] = []) {
      // Add delay before listing directory
      await delay(API_CALL_DELAY);
      
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .list(dirPath, {
          sortBy: { column: 'name', order: 'asc' },
        });
      
      if (error) {
        const errorMessage = handleStorageError(error, 'searching directory contents');
        throw new Error(errorMessage);
      }
      
      if (!data) return results;
      
      // Process current directory items
      for (const item of data) {
        const itemPath = dirPath ? `${dirPath}/${item.name}` : item.name;
        
        // Check if it's a folder
        const isFolder = item.metadata === null || 
                          item.name.endsWith('.folder') || 
                          item.metadata?.mimetype === 'application/x-directory';
        
        // If the name matches, add to results
        if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          const result = {
            id: isFolder ? `folder-${itemPath}` : `file-${itemPath}`,
            name: isFolder && item.name.endsWith('.folder') ? item.name.replace('.folder', '') : item.name,
            path: itemPath,
            type: isFolder ? 'folder' : 'file',
            size: item.metadata?.size || 0,
            updated: item.updated_at || item.created_at,
            metadata: item.metadata,
            created_at: item.created_at
          };
          
          results.push(result);
        }
        
        // If it's a folder, search recursively (but with a small delay)
        if (isFolder) {
          const folderPath = itemPath.endsWith('/') ? itemPath : `${itemPath}/`;
          await searchDirectory(folderPath, results);
        }
      }
      
      return results;
    }
    
    const results = await searchDirectory(path);
    return { data: results, error: null };
  } catch (error) {
    console.error('Error searching files:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get storage bucket details and check access permissions
 * @param bucketName Bucket name
 * @returns Bucket information and access status
 */
export async function checkBucketAccess(bucketName: string = DEFAULT_BUCKET) {
  try {
    // Check if we can list files in the bucket
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .list('');
    
    // Get user info
    const { data: userData } = await supabaseClient.auth.getUser();
    
    // Get bucket information
    const { data: bucketsData, error: bucketsError } = await supabaseClient.storage
      .getBucket(bucketName);
    
    return {
      success: !error,
      message: error ? error.message : 'Bucket accessible',
      bucket: bucketsData,
      hasAccess: !error,
      authStatus: {
        authenticated: !!userData?.user,
        user: userData?.user
      }
    };
  } catch (error) {
    console.error('Error checking bucket access:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      bucket: null,
      hasAccess: false,
      authStatus: {
        authenticated: false,
        user: null
      }
    };
  }
}

/**
 * List files in a specific path in the bucket
 * @param path Current path to list files from
 * @param bucketName Storage bucket name
 * @returns Array of file and folder items
 */
export async function listFilesInBucket(
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
export async function deleteFileInBucket(
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
          await deleteFileInBucket(itemPath, bucketName);
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
export async function createFolderInBucket(
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
 * Upload a file with optional path
 * @param file File to upload
 * @param path Path to upload to (optional)
 * @param bucketName Storage bucket name
 * @returns Upload result
 */
export async function uploadFileInBucket(
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
export async function downloadFileInBucket(path: string): Promise<Blob> {
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
export async function deleteAllFilesInBucket(): Promise<void> {
  try {
    await deleteFilesRecursivelyInBucket('');
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
async function deleteFilesRecursivelyInBucket(path: string): Promise<void> {
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
      await deleteFilesRecursivelyInBucket(`${normalizedPath}${folder.name}`);
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
export async function checkBucketStatusInBucket(): Promise<{ 
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
export async function directBucketCheckInBucket() {
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

/**
 * Uploads a file to Supabase storage in the specified project folder
 * @param file The file to upload
 * @param projectId The project ID to upload the file to
 * @param customPath Optional custom path within the project folder
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  projectId: string,
  customPath?: string
): Promise<string> {
  try {
    console.log('[UPLOAD] Starting file upload process', {
      fileName: file.name,
      fileSize: file.size,
      projectId,
      customPath
    });
    
    // Create storage path - either in custom path or directly in project folder
    const storagePath = customPath 
      ? `project-${projectId}/${customPath}/${file.name}`
      : `project-${projectId}/${file.name}`;
    
    console.log(`[UPLOAD] Storage path: ${storagePath}`);
    
    // Add small delay to prevent rate limiting
    await delay(API_CALL_DELAY);
    
    // Upload the file
    const { data, error } = await supabaseClient.storage
      .from(DEFAULT_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true // Use upsert true to overwrite existing files
      });
    
    if (error) {
      console.error('[UPLOAD] Supabase error details:', JSON.stringify(error, null, 2));
      const errorMessage = handleStorageError(error, 'uploading file');
      throw new Error(`Upload failed: ${errorMessage}`);
    }
    
    console.log('[UPLOAD] File uploaded successfully, getting URL');
    
    // Get the public URL for the file
    const { data: urlData } = supabaseClient.storage
      .from(DEFAULT_BUCKET)
      .getPublicUrl(storagePath);
    
    console.log('[UPLOAD] Complete, URL generated');
    return urlData?.publicUrl || '';
  } catch (error: any) {
    console.error('[UPLOAD] Error uploading file:', error);
    console.error('[UPLOAD] Error details:', JSON.stringify(error, null, 2));
    
    // Use a more descriptive error message for the toast
    toast({
      title: 'Upload Failed',
      description: error.message || 'Failed to upload file. Please try again.',
      variant: 'destructive',
    });
    
    // Throw a new Error with a cleaner message rather than the raw object
    throw new Error(error.message || 'Unknown upload error');
  }
} 