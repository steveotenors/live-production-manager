'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, User, ChevronDown, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthStatus } from '@/components/AuthStatus';

// Define the NavLink interface
interface NavLink {
  name: string;
  href: string;
}

// Define navigation links
const links: NavLink[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Projects', href: '/projects' },
  { name: 'Files', href: '/documents' },
  { name: 'Calendar', href: '/schedule' },
  { name: 'Support', href: '/support' },
];

interface NavigationBarProps {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  sidebarOpen, 
  onSidebarToggle 
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <header id="main-navbar" className="sticky top-0 z-40 w-full backdrop-blur-premium border-b border-primary/10 glass shadow-lg">
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="flex h-16 justify-between">
          {/* Left section - Logo/title and mobile menu button */}
          <div className="flex px-2 lg:px-0">
            {/* Mobile menu button */}
            {onSidebarToggle && (
              <button
                onClick={onSidebarToggle}
                className="inline-flex items-center justify-center mr-2 rounded-full p-2 text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary-foreground transition-colors duration-300"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5 metallic-icon" />
              </button>
            )}
            
            {/* Logo or brand text */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-lg sm:text-xl font-semibold gradient-text">Live Production Manager</span>
                <div className="ml-2 flex items-center justify-center text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  <Crown className="h-3 w-3 mr-1" />
                  <span>Premium</span>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Center section - Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <nav className="flex space-x-2">
              {links.map((link) => {
                const isActive = pathname?.startsWith(link.href);
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group",
                      isActive
                        ? "text-primary gradient-text"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {link.name}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/70 mx-auto w-4/5 rounded-full" />
                    )}
                    
                    {/* Hover indicator */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/70 mx-auto w-0 group-hover:w-4/5 transition-all duration-300 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Right section - Search and user actions */}
          <div className="flex items-center space-x-3 px-2 lg:px-0">
            {/* Search button */}
            <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300">
              <Search className="h-5 w-5 text-primary metallic-icon" />
            </button>
            
            {/* Notifications */}
            <button className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300 relative">
              <Bell className="h-5 w-5 text-primary metallic-icon" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </button>
            
            {/* User dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-primary/10 transition-colors duration-300">
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-gold-glow">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <ChevronDown className="h-4 w-4 text-primary hidden sm:inline-block" />
              </button>
            </div>
            
            {/* Mobile menu button (visible on small screens) */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-primary/10 animate-fade-in">
          <nav className="px-4 pt-2 pb-3 space-y-1">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/15 text-primary gold-border-glow"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationBar; 