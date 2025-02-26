// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { useSearchParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get the redirect path from URL params (if any)
  const redirectPath = searchParams?.get('from') || '/';

  // Force clear ALL auth cookies to prevent stale authentication state
  const clearAuthCookies = () => {
    console.log('[Login] Clearing all auth cookies');
    // Clear with different potential paths to ensure removal
    Cookies.remove('supabase-auth', { path: '/' });
    Cookies.remove('supabase-auth');
    
    // Also clear any Supabase default cookies
    const cookieNames = Object.keys(Cookies.get());
    cookieNames.forEach(name => {
      if (name.includes('sb-') || name.includes('supabase')) {
        Cookies.remove(name, { path: '/' });
        Cookies.remove(name);
      }
    });
  };

  // On mount, check for existing session and clear invalid cookies
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('[Login] Checking auth status...');
      
      // Always start by clearing cookies to prevent stale state
      clearAuthCookies();
      
      try {
        // Check if we have a valid session with Supabase
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) {
          console.error('[Login] Session error:', error);
          setInitializing(false);
          return;
        }
        
        // If we have a valid session with access token, set cookie and redirect
        if (data.session?.access_token) {
          console.log('[Login] Found valid session, setting cookie and redirecting');
          
          // Set a fresh auth cookie with the validated token
          Cookies.set('supabase-auth', data.session.access_token, { 
            expires: 7, // 7 days
            path: '/',
            sameSite: 'strict',
            secure: window.location.protocol === 'https:'
          });
          
          // Short delay to ensure cookie is set
          setTimeout(() => {
            console.log(`[Login] Redirecting to ${redirectPath} after successful auth check`);
            window.location.href = redirectPath;
          }, 300);
        } else {
          console.log('[Login] No valid session found, remaining on login page');
          setInitializing(false);
        }
      } catch (err) {
        console.error('[Login] Error during auth check:', err);
        setInitializing(false);
      }
    };
    
    checkAuthStatus();
  }, [redirectPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Clear any existing cookies before attempting login
      clearAuthCookies();
      
      // Attempt login with Supabase
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('[Login] Login error:', error);
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      console.log('[Login] Login successful, user:', data.user?.email);
      
      // Log full session data for debugging (without sensitive info)
      console.log('[Login] Session established:', {
        user: data.user?.email,
        hasToken: !!data.session?.access_token,
        expiresAt: data.session?.expires_at
      });
      
      // Set auth cookie with the access token
      if (data.session?.access_token) {
        Cookies.set('supabase-auth', data.session.access_token, { 
          expires: 7, // 7 days
          path: '/',
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        
        // Log that cookie was set (not the actual token)
        console.log('[Login] Auth cookie set successfully');
        
        // Verify cookie was set
        const cookieCheck = Cookies.get('supabase-auth');
        console.log('[Login] Cookie verification:', !!cookieCheck);
        
        // Show success toast
        toast({
          title: 'Login successful',
          description: `Welcome, ${data.user?.email}!`,
        });
        
        // Add a small delay to ensure cookie is set before navigation
        setTimeout(() => {
          console.log(`[Login] Redirecting to ${redirectPath}`);
          
          // Force a hard navigation to ensure middleware runs
          window.location.href = redirectPath;
        }, 500);
      } else {
        console.error('[Login] No access token in response');
        toast({
          title: 'Login issue',
          description: 'Authentication succeeded but no access token was received',
          variant: 'destructive',
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('[Login] Unexpected error:', err);
      toast({
        title: 'Something went wrong',
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Checking Authentication</h1>
          <p className="mb-4">Please wait while we verify your session...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-500">
            Secure authentication powered by Supabase
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}