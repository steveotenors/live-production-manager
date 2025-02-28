'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  Settings, 
  Folder, 
  UserCircle,
  FolderPlus,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Skip sidebar on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  
  // Check if we're on a project page
  const isProjectPage = pathname?.includes('/projects/');
  const projectId = isProjectPage ? pathname.split('/projects/')[1]?.split('/')[0] : null;
  
  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        // Check if user is logged in
        const { data: userData, error: userError } = await supabaseClient.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (userData?.user) {
          setUser(userData.user);
          
          // Load recent projects for sidebar
          const { data: projectsData, error: projectsError } = await supabaseClient
            .from('projects')
            .select('id, name, status')
            .order('updated_at', { ascending: false })
            .limit(5);
          
          if (projectsError) {
            throw projectsError;
          }
          
          setProjects(projectsData || []);
        }
      } catch (error) {
        console.error('Error fetching user or projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isAuthPage) {
      fetchUserAndProjects();
    }
  }, [isAuthPage, pathname]);
  
  const globalNavItems = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-5 w-5" />,
      active: pathname === '/'
    },
    {
      name: 'Calendar',
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
      active: pathname === '/schedule'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      active: pathname === '/settings'
    }
  ];
  
  // Only render the full layout with sidebar if not on auth pages
  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r bg-background md:block">
        <div className="flex h-full flex-col px-3 py-4">
          <div className="mb-8 px-3 py-2">
            <h2 className="text-xl font-bold">Production Manager</h2>
          </div>
          
          {/* Global Nav */}
          <nav className="space-y-1 px-3">
            {globalNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  item.active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Projects Section */}
          <div className="mt-6 px-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Recent Projects</h3>
              <Link href="/">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <nav className="space-y-1">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-8 rounded-md bg-muted animate-pulse" />
                ))
              ) : (
                projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                      projectId === project.id ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Folder className="h-4 w-4" />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))
              )}
              
              {!isLoading && projects.length === 0 && (
                <div className="text-xs text-muted-foreground p-3">
                  No projects yet. Create your first project from the dashboard.
                </div>
              )}
            </nav>
          </div>
          
          {/* Profile & Logout Section */}
          <div className="mt-auto px-3">
            <div className="border-t pt-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-8 w-8" />
                    <div className="truncate">
                      <p className="text-sm font-medium">{user.email?.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <form action={async () => {
                    await supabaseClient.auth.signOut();
                    window.location.href = '/auth/signin';
                  }}>
                    <Button size="icon" variant="ghost">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile navigation here (hamburger menu) */}
      
      {/* Main content */}
      <main className="flex-1 md:pl-64">
        {children}
      </main>
      
      <Toaster />
      <ThemeToggle />
    </div>
  );
} 