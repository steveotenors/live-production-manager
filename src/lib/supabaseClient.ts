import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import Cookies from 'js-cookie';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug information (only logging if values are defined, not the actual values)
console.log('[DEBUG-Supabase] Environment variables:', { 
  supabaseUrl: supabaseUrl ? '✓ Defined' : '✗ Missing',
  supabaseAnonKey: supabaseAnonKey ? '✓ Defined' : '✗ Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[DEBUG-Supabase] Missing environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    // Sets reasonable timeouts for API calls to prevent hanging
    fetch: (url, options) => {
      const timeout = 30000; // 30 seconds timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));
    },
  },
});

console.log('[DEBUG-Supabase] Client initialized');

/**
 * Get the current authentication status and user information
 * @returns Object containing auth status and user details
 */
export async function getAuthStatus() {
  try {
    // Get current session
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
    
    if (sessionError) {
      console.error('[AUTH-CHECK] Session error:', sessionError);
      return { 
        authenticated: false, 
        error: sessionError.message,
        session: null,
        user: null 
      };
    }
    
    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('[AUTH-CHECK] User error:', userError);
      return { 
        authenticated: false, 
        error: userError.message,
        session: sessionData.session,
        user: null 
      };
    }
    
    // Return authentication status and user info
    return {
      authenticated: !!user,
      user,
      session: sessionData.session,
      error: null
    };
  } catch (error) {
    console.error('[AUTH-CHECK] Unexpected error:', error);
    return { 
      authenticated: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      session: null,
      user: null
    };
  }
}

/**
 * Log out the current user
 * @returns Success status and any error message
 */
export async function logoutUser() {
  console.log('Logging out user...');
  
  try {
    // Clear Supabase auth session
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error('Error during signOut:', error);
    
    // Clear auth cookies
    Cookies.remove('supabase-auth', { path: '/' });
    
    // Clear any Supabase data from storage
    clearLocalStorage();
    
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error };
  }
}

// Helper to clear localStorage of Supabase items
const clearLocalStorage = () => {
  try {
    const lsKeys = Object.keys(localStorage);
    lsKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
};

// Storage-related helper functions
export const getStorageFileUrl = async (bucket: string, filename: string, expiresIn = 60) => {
  try {
    // First ensure we have a valid session before attempting to get the URL
    const { data: sessionData } = await supabaseClient.auth.getSession();
    
    if (!sessionData.session) {
      console.error('No active session when trying to access storage');
      return { url: null, error: 'Authentication required' };
    }
    
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .createSignedUrl(filename, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return { url: null, error: error.message };
    }
    
    return { url: data.signedUrl, error: null };
  } catch (error) {
    console.error('Unexpected error getting file URL:', error);
    return { url: null, error: 'Failed to generate download URL' };
  }
};

export const listStorageFiles = async (bucket: string, path = '') => {
  try {
    // First ensure we have a valid session
    const { data: sessionData } = await supabaseClient.auth.getSession();
    
    if (!sessionData.session) {
      console.error('No active session when trying to list storage files');
      return { files: [], error: 'Authentication required' };
    }
    
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .list(path);
    
    if (error) {
      console.error('Error listing files:', error);
      return { files: [], error: error.message };
    }
    
    return { files: data || [], error: null };
  } catch (error) {
    console.error('Unexpected error listing files:', error);
    return { files: [], error: 'Failed to list files' };
  }
};

// Add a simple test function to verify connection
export async function testConnection() {
  try {
    console.log('[DEBUG-Supabase] Testing connection...');
    
    // Test basic auth connection
    const { data: authData, error: authError } = await supabaseClient.auth.getSession();
    console.log('[DEBUG-Supabase] Auth test:', authError ? '✗ Failed' : '✓ Succeeded');
    
    // Check auth status
    const authStatus = await getAuthStatus();
    console.log('[DEBUG-Supabase] Auth status:', authStatus.authenticated 
      ? `✓ Authenticated as ${authStatus.user?.email}` 
      : '✗ Not authenticated (using anon key)');
    
    // Test storage access
    const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
    console.log('[DEBUG-Supabase] Storage test:', bucketsError ? '✗ Failed' : '✓ Succeeded');
    
    if (buckets) {
      console.log('[DEBUG-Supabase] Available buckets:', buckets.map(b => b.name));
    }
    
    return { 
      success: !authError && !bucketsError,
      buckets: buckets || [],
      authStatus
    };
  } catch (error) {
    console.error('[DEBUG-Supabase] Connection test failed:', error);
    return { success: false, error };
  }
}

// A simpler diagnostic function to check Supabase project settings
export async function checkBucketSettings() {
  try {
    console.log('[SUPABASE-DIAG] Checking Supabase project settings...');
    
    // Check auth status first
    const authStatus = await getAuthStatus();
    console.log('[SUPABASE-DIAG] Auth status:', authStatus.authenticated 
      ? `Authenticated as ${authStatus.user?.email}` 
      : 'Not authenticated (using anon key)');
    
    // Check if the key might be a service role key instead of anon key
    let keyType = 'unknown';
    try {
      if (supabaseAnonKey?.startsWith('eyJ')) {
        // This looks like a JWT token, let's try to extract some info
        const parts = supabaseAnonKey.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          keyType = payload.role || 'unknown';
          console.log('[SUPABASE-DIAG] Key type appears to be:', keyType);
        }
      }
    } catch (e) {
      console.log('[SUPABASE-DIAG] Could not determine key type');
    }
    
    // Try to list buckets
    const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
    
    if (bucketsError) {
      console.error('[SUPABASE-DIAG] Bucket listing error:', bucketsError.message);
      return {
        success: false,
        message: `Error: ${bucketsError.message}`,
        keyType,
        url: supabaseUrl,
        authStatus
      };
    }
    
    return {
      success: true,
      message: `Found ${buckets?.length || 0} buckets`,
      buckets: buckets?.map(b => b.name) || [],
      keyType,
      url: supabaseUrl,
      authStatus
    };
  } catch (error) {
    console.error('[SUPABASE-DIAG] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      keyType: 'unknown',
      url: supabaseUrl
    };
  }
}

/**
 * Forces a fresh connection to Supabase by recreating the client
 * This can help when there are stale connections or cached data
 */
export async function forceRefreshConnection() {
  console.log('[SUPABASE-REFRESH] Forcing a fresh Supabase connection...');
  
  // Clear any browser storage related to Supabase
  try {
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
    
    // Clear cookies related to Supabase
    Object.keys(Cookies.get()).forEach(name => {
      if (name.startsWith('sb-')) {
        Cookies.remove(name);
      }
    });
    
    console.log('[SUPABASE-REFRESH] Cleared auth data');
  } catch (e) {
    console.error('[SUPABASE-REFRESH] Error clearing storage:', e);
  }
  
  // Create a fresh client
  const freshClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  });
  
  // Test the connection
  try {
    console.log('[SUPABASE-REFRESH] Testing fresh connection...');
    const { data: buckets, error } = await freshClient.storage.listBuckets();
    
    if (error) {
      console.error('[SUPABASE-REFRESH] Error with fresh connection:', error.message);
      return {
        success: false,
        message: error.message,
        error
      };
    }
    
    console.log('[SUPABASE-REFRESH] Fresh connection successful, found buckets:', 
      buckets?.map(b => b.name) || []);
    
    // Return the results
    return {
      success: true,
      message: `Connection refreshed. Found ${buckets?.length || 0} buckets.`,
      buckets: buckets || []
    };
  } catch (e) {
    console.error('[SUPABASE-REFRESH] Unexpected error:', e);
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Unknown error',
      error: e
    };
  }
}

/**
 * Helper function to perform a complete auth reset and page refresh
 * This is useful when there are issues with auth state persistence
 */
export function completeAuthReset() {
  console.log('[AUTH-RESET] Performing complete auth reset...');
  
  try {
    // 1. Clear all localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Only clear Supabase-related items to avoid affecting other parts of the app
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
          console.log(`[AUTH-RESET] Removed localStorage item: ${key}`);
        }
      });
    }
    
    // 2. Clear all sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
          console.log(`[AUTH-RESET] Removed sessionStorage item: ${key}`);
        }
      });
    }
    
    // 3. Clear all cookies
    if (typeof Cookies !== 'undefined') {
      Object.keys(Cookies.get()).forEach(name => {
        if (name.includes('supabase') || name.startsWith('sb-')) {
          console.log(`[AUTH-RESET] Clearing cookie: ${name}`);
          Cookies.remove(name, { path: '/' });
          Cookies.remove(name);
        }
      });
    }
    
    console.log('[AUTH-RESET] Auth reset complete');
    
    // Return true to indicate success
    return true;
  } catch (e) {
    console.error('[AUTH-RESET] Error during auth reset:', e);
    return false;
  }
}

// Exports for use in application
export default supabaseClient;