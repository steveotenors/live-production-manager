'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderPlus, Search, ArrowLeft, Folder } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Check authentication
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (!userData?.user) {
        router.push('/auth/signin');
        return;
      }
      
      // Fetch all user's projects
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
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
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date to readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  // Get status badge classes
  const getStatusClasses = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Projects</h1>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push('/projects/new')}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-10 max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                <div className="flex justify-between items-center mt-6">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        filteredProjects.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-white dark:bg-gray-950">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No matching projects</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No projects found matching "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <FolderPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No projects yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first project to get started
                </p>
                <Button 
                  onClick={() => router.push('/projects/new')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-950 hover:shadow-md cursor-pointer transition-shadow"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <Folder className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(project.status)}`}>
                    {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Active'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Updated {formatDate(project.updated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
} 