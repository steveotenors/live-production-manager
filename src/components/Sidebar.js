'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut, 
  HelpCircle, 
  User, 
  Crown,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Main navigation links
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
];

// Settings and support links
const bottomNavItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Support', href: '/support', icon: HelpCircle },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Apply premium-obsidian-theme to document
  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('premium-obsidian-theme');
  }, []);

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r border-primary/10",
        "glass shadow-lg backdrop-blur-premium",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Sidebar backdrop glow effect */}
      <div className="absolute inset-0 pointer-events-none shadow-gold-glow opacity-20 rounded-r-lg" />
      
      {/* Sidebar header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-primary/10">
        <div className={cn("flex items-center", isOpen ? "justify-between w-full" : "justify-center")}>
          {isOpen && (
            <Link href="/dashboard">
              <div className="flex items-center">
                <span className="text-xl font-semibold gradient-text">Production</span>
              </div>
            </Link>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 sidebar-toggle-btn"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 text-primary transition-transform duration-300",
                !isOpen && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>
      
      {/* User profile section */}
      <div className={cn(
        "border-b border-primary/10 py-4 px-3 obsidian-reflection relative",
        isOpen ? "mx-3 my-4 rounded-xl bg-primary/5" : "mx-2 my-3"
      )}>
        <div className={cn("flex", isOpen ? "items-start space-x-3" : "flex-col items-center")}>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-gold-glow">
              <User className="h-5 w-5 text-primary" />
            </div>
            {/* Premium badge */}
            <div className="absolute -top-1 -right-1">
              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-gold-glow">
                <Crown className="h-3 w-3 text-black" />
              </div>
            </div>
          </div>
          
          {isOpen && (
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">Premium User</h3>
              <p className="text-xs text-muted-foreground truncate">premium@example.com</p>
              <div className="mt-2">
                <span className="premium-badge text-[10px] py-0.5">Premium Obsidian</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                  isOpen ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-primary/15 text-primary shadow-gold-glow gold-border-glow"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  "transition-colors duration-300",
                  isOpen ? "mr-3" : ""
                )}>
                  <item.icon className={cn("h-5 w-5", isActive && "metallic-icon")} />
                  
                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-pulse bg-primary/10 -z-10"></span>
                  )}
                </div>
                
                {isOpen && (
                  <span className={cn(
                    "truncate", 
                    isActive && "gradient-text font-medium"
                  )}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Notifications */}
      {isOpen && (
        <div className="px-6 py-4">
          <div className="glass p-3 rounded-lg obsidian-reflection flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs">You have 3 unread notifications</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom navigation */}
      <div className="px-3 pb-4 border-t border-primary/10 pt-4">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                  isOpen ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-primary/15 text-primary shadow-gold-glow"
                    : "text-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                  "transition-colors duration-300",
                  isOpen ? "mr-3" : ""
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                
                {isOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
          
          {/* Logout button */}
          <button
            className={cn(
              "w-full mt-4 group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg",
              "hover:bg-red-500/10 hover:text-red-500 transition-all duration-300",
              isOpen ? "justify-start" : "justify-center",
              "text-foreground"
            )}
          >
            <LogOut className={cn(
              "h-5 w-5 transition-colors duration-300",
              isOpen ? "mr-3" : "",
              "text-muted-foreground group-hover:text-red-500"
            )} />
            
            {isOpen && <span className="truncate">Log Out</span>}
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 