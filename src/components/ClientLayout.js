'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Calendar, 
  Settings, 
  FileText,
  ClipboardList,
  Users,
  Folder,
  FolderPlus,
  UserCircle, 
  LogOut,
  Menu,
  ChevronLeft,
  Pin,
  PinOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { supabaseClient } from '@/lib/supabaseClient';
import Sidebar from './Sidebar';

// Animation variants for staggered animations
const staggerDelay = (index) => `${50 * (index + 1)}ms`;

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
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
  
  // Handle sidebar expansion state changes
  const handleSidebarExpand = (expanded) => {
    setSidebarExpanded(expanded);
  };

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
    <div className="flex bg-gray-950 min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        projects={projects}
        user={user}
        projectId={projectId}
        isProjectPage={isProjectPage}
        onExpandChange={handleSidebarExpand}
      />
      
      {/* Main Content Container */}
      <div 
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: sidebarExpanded ? '220px' : '64px' 
        }}
      >
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="section-container p-6 rounded-lg">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Global Components */}
      <Toaster position="top-right" />
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default ClientLayout; 