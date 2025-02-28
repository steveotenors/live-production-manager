'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderPlus, Calendar, LogOut, ArrowRight } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Check authentication
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError) {
        console.error('Authentication error:', userError.message);
        toast({
          title: 'Authentication Error',
          description: `Please sign in: ${userError.message}`,
          variant: 'destructive',
        });
        router.push('/auth/signin');
        return;
      }
      
      if (!userData?.user) {
        console.log('No authenticated user found');
        router.push('/auth/signin');
        return;
      }
      
      console.log('Fetching projects for user:', userData.user.id);
      
      // Fetch all user's projects
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Database error fetching projects:', error.message, error.details, error.hint);
        toast({
          title: 'Database Error',
          description: `Failed to load projects: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Projects fetched successfully:', data?.length || 0);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      
      // Force refresh to /auth/signin
      router.push('/auth/signin');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Sign out failed. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Custom date formatter function instead of using date-fns
  const formatUpdatedAt = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffMonth = Math.floor(diffDay / 30);
      const diffYear = Math.floor(diffMonth / 12);
      
      if (diffYear > 0) {
        return diffYear === 1 ? 'about 1 year ago' : `about ${diffYear} years ago`;
      } else if (diffMonth > 0) {
        return diffMonth === 1 ? 'about 1 month ago' : `about ${diffMonth} months ago`;
      } else if (diffDay > 0) {
        return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
      } else if (diffHour > 0) {
        return diffHour === 1 ? 'about 1 hour ago' : `about ${diffHour} hours ago`;
      } else if (diffMin > 0) {
        return diffMin === 1 ? 'a minute ago' : `${diffMin} minutes ago`;
      } else {
        return 'just now';
      }
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your production projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/settings')}
          >
            Settings
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Projects</h2>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push('/projects/new')}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md shadow-sm overflow-hidden">
            <div className="p-3 border-b bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-8 text-xs font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-5">Project Name</div>
                <div className="col-span-3">Last Updated</div>
              </div>
            </div>
            
            {loading ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {projects.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <FolderPlus className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No projects yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                      Create your first project to get started.
                    </p>
                    <Button 
                      onClick={() => router.push('/projects/new')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="p-3 grid grid-cols-8 items-center hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <div className="col-span-5">
                        <p className="font-medium">{project.name}</p>
                        {project.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-4">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                        {formatUpdatedAt(project.updated_at)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {projects.length > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 flex justify-end border-t border-gray-200 dark:border-gray-800">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => router.push('/projects')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  View All Projects
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Upcoming Events</h2>
          </div>
          
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <CardHeader className="py-3 px-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <span>Next 7 Days</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => router.push('/schedule')}
                  className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  View Calendar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-sm text-center py-8 text-gray-500 dark:text-gray-400">
                No upcoming events
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 