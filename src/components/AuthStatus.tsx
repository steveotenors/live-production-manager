'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAuthStatus } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { authenticated, user, error } = await getAuthStatus();
        setUser(user);
        
        if (!authenticated && error) {
          console.error('Auth error:', error);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return <Badge variant="outline" className="animate-pulse">Checking...</Badge>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="destructive">Not Logged In</Badge>
        <Button size="sm" onClick={handleLogin}>Login</Button>
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="bg-green-500 text-white">
      {user.email || user.user_metadata?.full_name || 'Authenticated User'}
    </Badge>
  );
} 