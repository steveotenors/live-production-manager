'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Folder,
  Settings,
  CheckSquare,
  Users,
  Calendar,
  Music,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define a proper project type based on your database schema
interface Project {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  visibility?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Remove musical_director_id field
}

// Define the member role type
interface ProjectMember {
  project_id: number;
  user_id: string;
  role: string;
  // Add any other fields from project_members
}

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        // First check if user is authenticated
        const { data: userData, error: authError } = await supabaseClient.auth.getUser();
        
        if (authError) {
          console.error('Authentication error:', authError);
          toast({
            title: 'Authentication Error',
            description: 'Please sign in to view this project.',
            variant: 'destructive',
          });
          router.push('/auth/signin');
          return;
        }
        
        if (!userData?.user) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to view this project.',
            variant: 'destructive',
          });
          router.push('/auth/signin');
          return;
        }
        
        setLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await supabaseClient
          .from('projects')
          .select('*')
          .eq('id', projectId) // Use the UUID string directly
          .single();
        
        if (projectError) {
          console.error('Error loading project data:', projectError.message);
          toast({
            title: 'Project Not Found',
            description: 'This project does not exist or you do not have permission to view it.',
            variant: 'destructive',
          });
          router.push('/projects');
          return;
        }
        
        if (!projectData) {
          toast({
            title: 'Project Not Found',
            description: 'This project does not exist or has been deleted.',
            variant: 'destructive',
          });
          router.push('/projects');
          return;
        }
        
        setProject(projectData as Project);
        
        // Fetch user role in this project using type assertion to bypass TypeScript constraints
        // since project_members is missing from your generated types
        const { data: memberData, error: memberError } = await supabaseClient
          .from('project_members' as any)
          .select('role')
          .eq('project_id', projectId)
          .eq('user_id', userData.user.id)
          .single();
        
        if (memberError && memberError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error loading project member data:', memberError.message);
          toast({
            title: 'Error',
            description: `Failed to load your project role: ${memberError.message}`,
            variant: 'destructive',
          });
        }
        
        if (memberData) {
          // Use type assertion since TypeScript doesn't know the structure
          setUserRole((memberData as any).role);
          // Check if this user has owner role directly in the project_members table
          if ((memberData as any).role === 'owner') {
            setUserRole('owner');
          }
        } else {
          // User has no role in this project
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to view this project.',
            variant: 'destructive',
          });
          router.push('/projects');
        }
      } catch (error: any) {
        console.error('Error loading project:', error?.message || error);
        toast({
          title: 'Error',
          description: 'Failed to load project information. Please return to the dashboard.',
          variant: 'destructive',
        });
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router, toast]);

  // Navigation items for the project
  const navItems = [
    {
      name: 'Overview',
      href: `/projects/${projectId}`,
      icon: <Folder className="h-4 w-4 mr-2" />,
      active: pathname === `/projects/${projectId}`
    },
    {
      name: 'Files',
      href: `/projects/${projectId}/files`,
      icon: <Folder className="h-4 w-4 mr-2" />,
      active: pathname !== null && (pathname === `/projects/${projectId}/files` || pathname.startsWith(`/projects/${projectId}/files/`))
    },
    {
      name: 'Tasks',
      href: `/projects/${projectId}/tasks`,
      icon: <CheckSquare className="h-4 w-4 mr-2" />,
      active: pathname !== null && (pathname === `/projects/${projectId}/tasks` || pathname.startsWith(`/projects/${projectId}/tasks/`))
    },
    {
      name: 'Team',
      href: `/projects/${projectId}/team`,
      icon: <Users className="h-4 w-4 mr-2" />,
      active: pathname === `/projects/${projectId}/team`
    },
    {
      name: 'Practice',
      href: `/projects/${projectId}/practice`,
      icon: <Music className="h-4 w-4 mr-2" />,
      active: pathname === `/projects/${projectId}/practice`
    },
    {
      name: 'Schedule',
      href: `/projects/${projectId}/schedule`,
      icon: <Calendar className="h-4 w-4 mr-2" />,
      active: pathname === `/projects/${projectId}/schedule`
    }
  ];

  // Function to get status badge based on project status
  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="py-6 px-4 md:px-6">
      {/* Project Header */}
      <header className="mb-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        ) : (
          project ? (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <Link href="/" className="text-muted-foreground text-sm hover:text-foreground flex items-center mb-2">
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to Dashboard
                  </Link>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center">
                    {project.name}
                    <div className="ml-3">{getStatusBadge(project.status)}</div>
                  </h1>
                </div>
                
                <Link href={`/projects/${projectId}/settings`}>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
              {project.description && (
                <p className="text-muted-foreground mt-2 max-w-3xl">{project.description}</p>
              )}
            </div>
          ) : (
            <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20 text-destructive">
              Project not found or you don't have access to it.
            </div>
          )
        )}
      </header>
      
      {/* Project Navigation */}
      <div className="border-b pb-4 mb-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={item.active ? "default" : "ghost"}
              asChild
              className="flex items-center whitespace-nowrap"
              size="sm"
            >
              <Link href={item.href}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Main content */}
      <main>
        {children}
      </main>
      
      <Toaster />
    </div>
  );
} 