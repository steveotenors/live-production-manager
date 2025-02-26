'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import Cookies from 'js-cookie';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LogoutPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Logging you out...');

  // Thorough cleanup of all auth data
  const performCompleteLogout = async () => {
    console.log('[Logout] Starting complete logout process');
    
    try {
      // 1. Clear all cookies
      console.log('[Logout] Clearing auth cookies');
      Cookies.remove('supabase-auth', { path: '/' });
      Cookies.remove('supabase-auth');
      
      // Clear all Supabase-related cookies
      const cookieNames = Object.keys(Cookies.get());
      cookieNames.forEach(name => {
        if (name.includes('sb-') || name.includes('supabase')) {
          console.log(`[Logout] Removing cookie: ${name}`);
          Cookies.remove(name, { path: '/' });
          Cookies.remove(name);
        }
      });

      // 2. Clear localStorage
      console.log('[Logout] Clearing localStorage');
      const lsKeys = Object.keys(localStorage);
      lsKeys.forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      // 3. Clear sessionStorage
      console.log('[Logout] Clearing sessionStorage');
      const ssKeys = Object.keys(sessionStorage);
      ssKeys.forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });

      // 4. Tell Supabase to sign out (server-side session cleanup)
      console.log('[Logout] Calling Supabase signOut');
      await supabaseClient.auth.signOut();
      
      // 5. Double-check cookie was cleared
      const authCookieCheck = Cookies.get('supabase-auth');
      console.log('[Logout] Auth cookie check after logout:', authCookieCheck ? 'Still present' : 'Successfully removed');
      
      if (authCookieCheck) {
        // One last forced attempt to delete the cookie
        document.cookie = 'supabase-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }

      setStatus('success');
      setMessage('Successfully logged out!');
      
      // Redirect to login after short delay
      setTimeout(() => {
        console.log('[Logout] Redirecting to login page');
        window.location.href = '/login';
      }, 1000);
    } catch (error) {
      console.error('[Logout] Error during logout:', error);
      setStatus('error');
      setMessage('There was a problem logging you out. Redirecting to login page anyway...');
      
      // Redirect to login even if there was an error
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  };

  useEffect(() => {
    performCompleteLogout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {status === 'processing' ? 'Logging Out' : 
             status === 'success' ? 'Logout Successful' : 'Logout Error'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{message}</p>
          
          {status === 'processing' && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {status !== 'processing' && (
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="mt-4"
            >
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 