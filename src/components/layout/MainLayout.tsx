'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, FileText, Calendar, ListChecks, Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: Music },
    { href: '/files', label: 'Files', icon: FileText },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/tasks', label: 'Tasks', icon: ListChecks },
    { href: '/logout', label: 'Log Out', icon: LogOut },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-foreground">
            Live Production Manager
          </Link>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = 
                item.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(item.href);
              
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-10">
        <div className="grid grid-cols-6">
          {navItems.map((item) => {
            const isActive = 
              item.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.href);
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 text-xs",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Breadcrumb & Page Header Area */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumbs pathname={pathname} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          Live Production Manager &copy; {new Date().getFullYear()}
        </div>
      </footer>
      
      {/* Padding for mobile navigation */}
      <div className="h-16 md:hidden" />
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  // Skip breadcrumbs on main dashboard
  if (pathname === '/') return null;
  
  const segments = pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs if just one level deep
  if (segments.length <= 1) {
    return (
      <div className="text-sm py-1 font-medium text-foreground capitalize">
        {segments[0] || 'Dashboard'}
      </div>
    );
  }
  
  return (
    <div className="flex items-center text-sm py-1">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      
      {segments.map((segment, index) => {
        // Build the path up to this segment
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        
        // Check if this is the last segment
        const isLastSegment = index === segments.length - 1;
        
        // Handle dynamic routes
        const label = segment.startsWith('[') ? 'Detail' : segment;
        
        return (
          <div key={path} className="flex items-center">
            <span className="mx-2 text-muted-foreground">/</span>
            {isLastSegment ? (
              <span className="font-medium text-foreground capitalize">
                {label}
              </span>
            ) : (
              <Link 
                href={path} 
                className="text-muted-foreground hover:text-foreground capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
} 