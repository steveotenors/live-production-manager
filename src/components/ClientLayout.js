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

// Animation variants for staggered animations
const staggerDelay = (index) => `${50 * (index + 1)}ms`;

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentProject, setRecentProject] = useState(null);
  
  // Refs for interaction tracking
  const hoverIntentTimerRef = useRef(null);
  const leaveIntentTimerRef = useRef(null);
  
  // Skip sidebar on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  
  // Check if we're on a project page
  const isProjectPage = pathname?.includes('/projects/');
  const projectId = isProjectPage ? pathname.split('/projects/')[1]?.split('/')[0] : null;
  
  useEffect(() => {
    // Check for saved sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
    
    // Check for pinned state
    const pinnedState = localStorage.getItem('sidebarPinned');
    if (pinnedState !== null) {
      setIsPinned(pinnedState === 'true');
      // If pinned, ensure sidebar is expanded
      if (pinnedState === 'true') {
        setIsHovering(true);
      }
    }
    
    // Close mobile menu when changing pages
    setIsMobileOpen(false);
    
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
          
          // Set most recent project
          if (projectsData && projectsData.length > 0) {
            setRecentProject(projectsData[0]);
          }
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
    
    return () => {
      clearTimeout(hoverIntentTimerRef.current);
      clearTimeout(leaveIntentTimerRef.current);
    };
  }, [isAuthPage, pathname]);
  
  const toggleSidebar = () => {
    // First handle collapse state
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
    
    // Then handle pin/expand state
    if (newState) { // If collapsing (true)
      // When collapsing, always close sidebar and unpin
      setIsHovering(false);
      setIsPinned(false);
      localStorage.setItem('sidebarPinned', 'false');
    } else { // If expanding (false)
      // When expanding, open sidebar
      setIsHovering(true);
    }
  };
  
  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem('sidebarPinned', String(newPinned));
    
    // Ensure sidebar is expanded when pinned
    if (newPinned) {
      setIsHovering(true);
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  const globalNavItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <Home className="h-5 w-5" />,
      active: pathname === '/'
    },
    // Only show these nav items when inside a project
    ...(isProjectPage ? [
      {
        name: 'Schedule',
        href: `/projects/${projectId}/schedule`,
        icon: <Calendar className="h-5 w-5" />,
        active: pathname === `/projects/${projectId}/schedule`
      },
      {
        name: 'Files',
        href: `/projects/${projectId}/files`,
        icon: <FileText className="h-5 w-5" />,
        active: pathname === `/projects/${projectId}/files`
      },
      {
        name: 'Tasks',
        href: `/projects/${projectId}/tasks`,
        icon: <ClipboardList className="h-5 w-5" />,
        active: pathname === `/projects/${projectId}/tasks`
      },
      {
        name: 'Team',
        href: `/projects/${projectId}/team`,
        icon: <Users className="h-5 w-5" />,
        active: pathname === `/projects/${projectId}/team`
      },
    ] : []),
  ];
  
  // Handle hover with intent detection
  const handleMouseEnter = () => {
    if (isPinned) return; // Don't respond to hover if pinned
    
    // Clear any existing timers
    if (leaveIntentTimerRef.current) {
      clearTimeout(leaveIntentTimerRef.current);
      leaveIntentTimerRef.current = null;
    }
    
    // Slight delay for hover intent
    hoverIntentTimerRef.current = setTimeout(() => {
      setIsHovering(true);
    }, 150);
  };
  
  const handleMouseLeave = () => {
    if (isPinned) return; // Don't respond to hover if pinned
    
    // Clear the hover intent timer
    if (hoverIntentTimerRef.current) {
      clearTimeout(hoverIntentTimerRef.current);
      hoverIntentTimerRef.current = null;
    }
    
    // Add a delay before closing to prevent accidental closes
    leaveIntentTimerRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300);
  };
  
  // Toggle sidebar open/close with click
  const toggleHover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPinned) {
      // If pinned, unpin instead
      setIsPinned(false);
      localStorage.setItem('sidebarPinned', 'false');
    } else {
      // Toggle hover state
      setIsHovering(!isHovering);
    }
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
  
  // The expanded state is either hovering or pinned
  const isExpanded = isHovering || isPinned;
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile menu backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile menu toggle button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 rounded-md bg-background p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex h-screen flex-col transition-all duration-300 ease-in-out",
          "-translate-x-full md:translate-x-0",
          "md:w-auto md:bg-transparent md:border-0 md:shadow-none md:overflow-visible",
          isMobileOpen && "translate-x-0 bg-card border-r"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Navigation"
        role="navigation"
      >
        {/* Backdrop that appears when sidebar is expanded */}
        {isExpanded && (
          <div className="fixed inset-0 bg-background/40 backdrop-blur-[1.5px] pointer-events-none z-20" aria-hidden="true" />
        )}
        
        {/* Hover-sensitive container */}
        <div 
          className="fixed inset-y-0 left-0 w-12 z-30 pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          aria-hidden="true"
        />
        
        {/* Floating content column - entire sidebar */}
        <div 
          className="absolute flex flex-col left-0 top-0 bottom-0 px-2 py-6 z-40 h-full"
          onMouseEnter={handleMouseEnter}
        >
          {/* Sidebar background - with proper height to only cover navigation items */}
          {isExpanded && (
            <div 
              className="absolute pointer-events-none z-[-1]" 
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.07), rgba(147, 197, 253, 0.03))',
                backdropFilter: 'blur(4px)',
                boxShadow: 'inset -1px 0 0 rgba(59, 130, 246, 0.08)',
                borderRadius: '0 16px 16px 0',
                left: '-4px',
                right: '-20px',
                top: '70px',       /* Start below the logo */
                height: '350px'    /* Fixed height to cover only nav items */
              }}
              aria-hidden="true"
            />
          )}
          
          {/* Logo/App icon */}
          <div className="mb-8">
            <div 
              onClick={toggleHover}
              className={cn(
                "group flex h-10 items-center rounded-full backdrop-blur-sm shadow-sm hover:bg-card/90 transition-all duration-500 cursor-pointer",
                isExpanded 
                  ? "w-56 justify-start pr-3 bg-gradient-to-r from-card/90 to-card/80" 
                  : "w-10 justify-center bg-card/80"
              )}
              title={isCollapsed ? "Click to expand sidebar" : "Click to collapse sidebar"}
              style={{
                transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                <span className="text-lg font-bold text-primary">P</span>
              </span>
              <div 
                className={cn(
                  "flex-1 overflow-hidden transition-all duration-500",
                  isExpanded ? "opacity-100 ml-1.5" : "opacity-0 w-0"
                )}
              >
                <h2 className="text-base font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                  Production Manager
                </h2>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex flex-col space-y-1.5">
            {/* Section heading - only visible when expanded */}
            <div className={cn(
              "px-3 mb-0.5 overflow-hidden transition-all duration-300",
              isExpanded ? "h-5 opacity-100" : "h-0 opacity-0"
            )}>
              <span className="text-xs font-medium uppercase text-muted-foreground/70 tracking-wider">
                {isProjectPage ? 'Project Navigation' : 'Main'}
              </span>
            </div>
            
            {/* Navigation links */}
            {globalNavItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-10 items-center transition-all duration-300 rounded-full",
                  isExpanded ? "w-56 backdrop-blur-sm shadow-sm" : "w-10",
                  item.active 
                    ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5" 
                    : "text-muted-foreground hover:text-foreground bg-gradient-to-r from-card/50 to-card/30"
                )}
                title={item.name}
                onMouseOver={handleMouseEnter}
                style={{
                  transitionDelay: isExpanded ? staggerDelay(index) : '0ms',
                }}
              >
                <div className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center",
                  item.active && "bg-primary/10 rounded-full",
                  "transition-all duration-300 group-hover:text-primary group-hover:scale-105",
                  "group-active:scale-95"
                )}>
                  {item.icon}
                </div>
                
                <div className={cn(
                  "ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300",
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                )}>
                  <span className={cn(
                    "font-medium text-sm",
                    item.active && "font-semibold"
                  )}>
                    {item.name}
                  </span>
                </div>
                
                {/* Indicator for active item */}
                {item.active && isExpanded && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Projects section */}
          {projects.length > 0 && (
            <div className="mt-6 flex flex-col space-y-1.5">
              {/* Section heading */}
              <div className={cn(
                "px-3 mb-0.5 flex justify-between items-center overflow-hidden transition-all duration-300",
                isExpanded ? "h-5 opacity-100" : "h-0 opacity-0"
              )}>
                <span className="text-xs font-medium uppercase text-muted-foreground/70 tracking-wider">
                  Projects
                </span>
                <Link href="/projects/new">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-4 w-4 rounded-full p-0 text-muted-foreground hover:text-primary -mt-0.5"
                    title="New Project"
                  >
                    <FolderPlus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
              
              {/* Recent project hint - only when not expanded and we have projects */}
              {!isExpanded && recentProject && (
                <div className="absolute left-12 w-40 px-3 py-1.5 bg-card/80 backdrop-blur-sm rounded-md shadow-md text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1">
                  <p className="font-medium">Recent Project:</p>
                  <p className="truncate text-muted-foreground">{recentProject.name}</p>
                </div>
              )}
              
              {/* Project links */}
              {projects.slice(0, 3).map((project, index) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={cn(
                    "group flex h-10 items-center transition-all duration-300 rounded-full",
                    isExpanded ? "w-56 backdrop-blur-sm shadow-sm" : "w-10",
                    projectId === project.id 
                      ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5" 
                      : "text-muted-foreground hover:text-foreground bg-gradient-to-r from-card/50 to-card/30"
                  )}
                  title={project.name}
                  onMouseOver={handleMouseEnter}
                  style={{
                    transitionDelay: isExpanded ? staggerDelay(index) : '0ms',
                  }}
                >
                  <div className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center",
                    projectId === project.id && "bg-primary/10 rounded-full",
                    "transition-all duration-300 group-hover:text-primary group-hover:scale-105",
                    "group-active:scale-95"
                  )}>
                    <Folder className="h-4 w-4" />
                  </div>
                  
                  <div className={cn(
                    "ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300",
                    isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
                  )}>
                    <span className={cn(
                      "font-medium text-sm truncate block max-w-[160px]",
                      projectId === project.id && "font-semibold"
                    )}>
                      {project.name}
                    </span>
                  </div>
                  
                  {/* Indicator for active project */}
                  {projectId === project.id && isExpanded && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                  )}
                </Link>
              ))}
              
              {/* Empty state */}
              {!isLoading && projects.length === 0 && isExpanded && (
                <div className="px-3 py-1.5 text-xs italic text-muted-foreground">
                  No projects yet
                </div>
              )}
            </div>
          )}

          {/* User and settings section */}
          <div className="mt-auto pt-4 flex flex-col space-y-1.5">
            {/* Settings heading */}
            <div className={cn(
              "px-3 mb-0.5 overflow-hidden transition-all duration-300",
              isExpanded ? "h-5 opacity-100" : "h-0 opacity-0"
            )}>
              <span className="text-xs font-medium uppercase text-muted-foreground/70 tracking-wider">
                Settings
              </span>
            </div>
            
            {/* Settings link */}
            <Link
              href="/settings"
              className={cn(
                "group flex h-10 items-center transition-all duration-300 rounded-full",
                isExpanded ? "w-56 backdrop-blur-sm shadow-sm" : "w-10",
                pathname === '/settings'
                  ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5" 
                  : "text-muted-foreground hover:text-foreground bg-gradient-to-r from-card/50 to-card/30"
              )}
              title="Settings"
              onMouseOver={handleMouseEnter}
            >
              <div className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center",
                pathname === '/settings' && "bg-primary/10 rounded-full",
                "transition-all duration-300 group-hover:text-primary group-hover:scale-105",
                "group-active:scale-95"
              )}>
                <Settings className="h-5 w-5" />
              </div>
              
              <div className={cn(
                "ml-1.5 overflow-hidden whitespace-nowrap transition-all duration-300",
                isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
              )}>
                <span className={cn(
                  "font-medium text-sm",
                  pathname === '/settings' && "font-semibold"
                )}>
                  Preferences
                </span>
              </div>
              
              {/* Indicator for active setting */}
              {pathname === '/settings' && isExpanded && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
            </Link>
            
            {/* Account link - only visible when expanded */}
            {user && isExpanded && (
              <Link
                href="/settings/account"
                className={cn(
                  "group flex h-10 items-center w-56 backdrop-blur-sm shadow-sm transition-all duration-300 rounded-full",
                  pathname === '/settings/account'
                    ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5" 
                    : "text-muted-foreground hover:text-foreground bg-gradient-to-r from-card/50 to-card/30"
                )}
                title="Account"
                onMouseOver={handleMouseEnter}
              >
                <div className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center",
                  pathname === '/settings/account' && "bg-primary/10 rounded-full",
                  "transition-all duration-300 group-hover:text-primary group-hover:scale-105",
                  "group-active:scale-95"
                )}>
                  <UserCircle className="h-5 w-5" />
                </div>
                
                <div className="ml-1.5 overflow-hidden whitespace-nowrap">
                  <span className={cn(
                    "font-medium text-sm",
                    pathname === '/settings/account' && "font-semibold"
                  )}>
                    Account
                  </span>
                </div>
                
                {/* Indicator for active account */}
                {pathname === '/settings/account' && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
              </Link>
            )}
            
            {/* User section */}
            <div className={cn(
              "px-3 mb-0.5 overflow-hidden transition-all duration-300 mt-3",
              isExpanded ? "h-5 opacity-100" : "h-0 opacity-0"
            )}>
              <span className="text-xs font-medium uppercase text-muted-foreground/70 tracking-wider">
                User
              </span>
            </div>
            
            {/* User profile or sign in */}
            {user ? (
              <div 
                className={cn(
                  "group flex items-center transition-all duration-300 rounded-full",
                  isExpanded 
                    ? "w-56 backdrop-blur-sm shadow-sm h-auto py-2 px-0 bg-gradient-to-r from-card/50 to-card/30" 
                    : "w-10 h-10 justify-center bg-card/80",
                )}
                onMouseOver={handleMouseEnter}
                style={{
                  animation: isExpanded ? 'pulse 8s infinite alternate' : 'none',
                }}
              >
                <div className={cn(
                  "flex items-center justify-center h-10 w-10 flex-shrink-0",
                  "bg-primary/10 rounded-full group-hover:scale-105",
                  "transition-all duration-300"
                )}>
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
                
                {isExpanded && (
                  <div className="flex-1 px-1.5 flex justify-between items-center min-w-0">
                    <div className="flex flex-col min-w-0 mr-1 ml-1">
                      <p className="text-sm font-medium truncate">{user.email?.split('@')[0]}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <form action={async () => {
                        await supabaseClient.auth.signOut();
                        window.location.href = '/auth/signin';
                      }}>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-7 w-7 rounded-full p-0 text-muted-foreground hover:text-primary"
                          aria-label="Sign out"
                          title="Sign out"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "group flex items-center transition-all duration-300 rounded-full",
                  isExpanded ? "w-56 backdrop-blur-sm shadow-sm bg-gradient-to-r from-card/50 to-card/30" : "w-10 h-10 justify-center"
                )}
                onMouseOver={handleMouseEnter}
              >
                <div className={cn(
                  "flex items-center justify-center h-10 w-10 flex-shrink-0",
                  "bg-muted/60 rounded-full group-hover:scale-105",
                  "transition-all duration-300"
                )}>
                  <UserCircle className="h-5 w-5" />
                </div>
                
                {isExpanded && (
                  <div className="flex-1 px-2">
                    <Link href="/auth/signin" className="block">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                      >
                        Sign in
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar controls */}
          {isExpanded && (
            <div className="absolute right-0 flex flex-col items-center space-y-2">
              {/* Pin button */}
              <button
                type="button"
                onClick={togglePin}
                className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border bg-card/95 backdrop-blur-md shadow-md hover:bg-accent"
                aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              >
                {isPinned ? (
                  <PinOff className="h-3 w-3" />
                ) : (
                  <Pin className="h-3 w-3" />
                )}
              </button>
              
              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setIsHovering(false);
                  if (isPinned) {
                    setIsPinned(false);
                    localStorage.setItem('sidebarPinned', 'false');
                  }
                }}
                className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border bg-card/95 backdrop-blur-md shadow-md hover:bg-accent"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content area - always full width */}
      <main 
        className="flex-1 w-full transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: 0,
          paddingLeft: isMobileOpen ? 0 : '12px' // Just enough space for the icon column
        }}
      >
        <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      {children}
        </div>
      </main>
      
      <Toaster />
      <ThemeToggle />
      
      {/* Global animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.95; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 