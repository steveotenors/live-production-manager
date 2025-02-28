'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'You have successfully signed in.',
      });
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button 
                  variant="link" 
                  className="text-xs text-blue-600 hover:text-blue-800 p-0"
                  type="button"
                  onClick={() => router.push('/auth/forgot-password')}
                >
                  Forgot password?
                </Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Button 
              variant="link" 
              className="text-blue-600 hover:text-blue-800 p-0"
              onClick={() => router.push('/auth/signup')}
            >
              Sign up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 