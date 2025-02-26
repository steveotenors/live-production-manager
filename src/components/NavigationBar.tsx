'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AuthStatus } from '@/components/AuthStatus';

interface NavLink {
  name: string;
  href: string;
}

const links: NavLink[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Files', href: '/files' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Practice', href: '/practice' },
];

export function NavigationBar() {
  const pathname = usePathname();
  
  return (
    <div className="flex items-center space-x-4 lg:space-x-6 px-4 py-2 bg-background border-b">
      <div className="font-semibold text-lg">Live Production Manager</div>
      
      <nav className="flex items-center space-x-4 lg:space-x-6 ml-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === link.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      
      <div className="ml-auto flex items-center gap-4">
        <AuthStatus />
        
        {/* Simple direct link to logout page */}
        <Link
          href="/logout"
          className="text-sm font-medium px-3 py-1 rounded border border-gray-200 text-muted-foreground hover:bg-gray-50"
        >
          Log Out
        </Link>
      </div>
    </div>
  );
} 