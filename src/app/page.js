'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/ui/page-header';
import { 
  FolderPlus, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Users,
  FileText, 
  ArrowRight, 
  Settings, 
  LogOut,
  Folder
} from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';  // For conditional class names
import { DashboardModules } from '@/components/DashboardModules';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    upcomingEvents: 0
  });
  const [mounted, setMounted] = useState(false);
  
  // Animation effect for page load
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
      
      // Update stats
      setStats({
        totalProjects: data?.length || 0,
        activeProjects: data?.filter(p => p.status === 'active').length || 0,
        upcomingEvents: 2 // Mock data - replace with real count from API
      });
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
  
  return (
    <div className={cn(
      "h-full w-full transition-opacity duration-medium",
      mounted ? "opacity-100" : "opacity-0"
    )}>
      <div className="mb-8">
        <PageHeader
          heading="Dashboard"
          description="Your production hub"
        />
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-md bg-primary/10 p-2">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                {loading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold">{stats.totalProjects}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-md bg-success/10 p-2">
                <CheckSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                {loading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold">{stats.activeProjects}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-md bg-secondary/10 p-2">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                {loading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-semibold">{stats.upcomingEvents}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Modules */}
      <div className="space-y-8">
        <DashboardModules />
      
        {/* Projects List */}
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="bg-muted/50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Recent Projects</CardTitle>
              <Button 
                size="sm" 
                onClick={() => router.push('/projects/new')}
                aria-label="Create new project"
              >
                New Project
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {projects.length > 0 ? (
                  <div className="divide-y" role="table">
                    {projects.map((project) => (
                      <div 
                        key={project.id} 
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        role="row"
                      >
                        <div className="flex items-center gap-4" role="cell">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Folder className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                              {project.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {project.updated_at 
                                ? `Updated ${formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}` 
                                : 'Recently created'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" role="cell">
                          <Badge variant={
                            project.status === 'active' ? 'success' :
                            project.status === 'completed' ? 'secondary' :
                            project.status === 'cancelled' ? 'destructive' : 'outline'
                          }>
                            {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Draft'}
                          </Badge>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/projects/${project.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={<FolderPlus className="h-8 w-8 text-muted-foreground" />}
                    title="No projects yet"
                    description="Create your first project to get started"
                    action={
                      <Button onClick={() => router.push('/projects/new')}>
                        New Project
                      </Button>
                    }
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}