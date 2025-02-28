'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileIcon, 
  Folder, 
  Users, 
  Calendar, 
  CheckSquare, 
  Clock, 
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function ProjectOverview() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    fileCount: 0,
    taskCount: 0,
    pendingTasks: 0,
    completedTasks: 0,
    teamMembers: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (!projectId) return;
    
    const fetchProjectStats = async () => {
      try {
        setLoading(true);
        
        // Get file count
        const { data: filesData, error: filesError } = await supabaseClient.storage
          .from('production-files')
          .list(`project-${projectId}`);
        
        const fileCount = filesData?.length || 0;
        
        // Get task counts
        const { data: tasksData, error: tasksError } = await supabaseClient
          .from('tasks')
          .select('id, status')
          .eq('project_id', parseInt(projectId));
        
        const taskCount = tasksData?.length || 0;
        const pendingTasks = tasksData?.filter(task => 
          task.status === 'pending' || task.status === 'in_progress'
        ).length || 0;
        const completedTasks = tasksData?.filter(task => 
          task.status === 'completed'
        ).length || 0;
        
        // Get team member count
        const teamMembers = 0; // FIXME: TypeScript definition needs updating
        /* Temporarily commented out due to TypeScript error
        const { data: membersData, error: membersError } = await supabaseClient
          .from('project_members')
          .select('id')
          .eq('project_id', projectId);

        const teamMembers = membersData?.length || 0;
        */
        
        setStats({
          fileCount,
          taskCount,
          pendingTasks,
          completedTasks,
          teamMembers,
          recentActivity: []
        });
      } catch (error) {
        console.error('Error fetching project stats:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project statistics.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectStats();
  }, [projectId, toast]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Project Overview</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Files Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.fileCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total files in this project
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${projectId}/files`}>
                      Manage Files
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Tasks Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.taskCount}</div>
                <div className="flex text-xs text-muted-foreground gap-4 mt-1">
                  <span className="text-amber-500">{stats.pendingTasks} pending</span>
                  <span className="text-green-500">{stats.completedTasks} completed</span>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${projectId}/tasks`}>
                      View Tasks
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Team Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.teamMembers}</div>
                <p className="text-xs text-muted-foreground">
                  Team members
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${projectId}/team`}>
                      Manage Team
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-1" asChild>
            <Link href={`/projects/${projectId}/files`}>
              <FileIcon className="h-6 w-6 mb-1" />
              <span>View Files</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-1" asChild>
            <Link href={`/projects/${projectId}/tasks`}>
              <CheckSquare className="h-6 w-6 mb-1" />
              <span>Manage Tasks</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-1" asChild>
            <Link href={`/projects/${projectId}/team`}>
              <Users className="h-6 w-6 mb-1" />
              <span>Team</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="flex flex-col h-auto py-4 gap-1" asChild>
            <Link href={`/projects/${projectId}/schedule`}>
              <Calendar className="h-6 w-6 mb-1" />
              <span>Schedule</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Project Description */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            About This Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p>
                This project contains all files, tasks, and scheduling information for your production.
                Use the navigation above to access different sections of the project.
              </p>
              <ul>
                <li><strong>Files</strong>: Upload, organize, and share music files and documents</li>
                <li><strong>Tasks</strong>: Track to-dos and assignments for your team</li>
                <li><strong>Team</strong>: Manage who has access to this project</li>
                <li><strong>Schedule</strong>: Plan rehearsals and important events</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 