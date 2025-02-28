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
  LogOut
} from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <PageHeader
            heading="Dashboard"
            description="Manage your production projects"
          />
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/settings')}
              className="h-9"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLogout}
              className="h-9"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
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
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden border shadow-sm">
              <CardHeader className="px-6 py-4 bg-muted/50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Projects</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => router.push('/projects/new')}
                  className="h-9"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardHeader>
              
              <div className="px-6 py-3 border-b bg-card">
                <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground">
                  <div className="col-span-6 md:col-span-5">Project Name</div>
                  <div className="col-span-3 md:col-span-4">Status</div>
                  <div className="col-span-3">Last Updated</div>
                </div>
              </div>
              
              {loading ? (
                <CardContent className="divide-y p-0">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              ) : (
                <CardContent className="divide-y p-0">
                  {projects.length === 0 ? (
                    <EmptyState
                      icon={<FolderPlus />}
                      title="No projects yet"
                      description="Create your first project to get started."
                      action={
                        <Button 
                          onClick={() => router.push('/projects/new')}
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Create Project
                        </Button>
                      }
                    />
                  ) : (
                    projects.slice(0, 5).map((project) => (
                      <div 
                        key={project.id} 
                        className="px-6 py-4 grid grid-cols-12 items-center hover:bg-muted/40 cursor-pointer transition-colors"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <div className="col-span-6 md:col-span-5">
                          <p className="font-medium">{project.name}</p>
                          {project.description && (
                            <p className="text-xs text-muted-foreground truncate pr-4 mt-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="col-span-3 md:col-span-4">
                          <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'secondary' : 'outline'}>
                            {project.status || 'draft'}
                          </Badge>
                        </div>
                        <div className="col-span-3 text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              )}
              
              {projects.length > 0 && (
                <CardFooter className="flex justify-center md:justify-end p-4 bg-muted/50 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/projects')}
                    className="h-9"
                  >
                    View All Projects
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Upcoming Events Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Coming Up</CardTitle>
                <CardDescription>Your next scheduled events</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {loading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto opacity-50 mb-2" />
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push('/schedule')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </CardFooter>
            </Card>
            
            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start h-9" onClick={() => router.push('/projects/new')}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  <span>New Project</span>
                </Button>
                <Button variant="outline" className="justify-start h-9" onClick={() => router.push('/schedule')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Schedule Event</span>
                </Button>
                <Button variant="outline" className="justify-start h-9" onClick={() => router.push('/tasks')}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  <span>View Tasks</span>
                </Button>
                <Button variant="outline" className="justify-start h-9" onClick={() => router.push('/team')}>
                  <Users className="h-4 w-4 mr-2" />
                  <span>Team</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}