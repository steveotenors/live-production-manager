'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from './LogoutButton';
import { Music } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  
  // Don't show navbar on login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-background border-b border-border py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Music className="h-5 w-5 text-primary" />
              <span>Live Production Manager</span>
            </Link>
            
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/projects" 
                className={`px-3 py-2 rounded-md text-sm ${
                  pathname === '/projects' 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                Projects
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}