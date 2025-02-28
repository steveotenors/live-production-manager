import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Settings, 
  FileText,
  ClipboardList,
  Users,
  Folder,
  UserCircle
} from 'lucide-react';

/**
 * Sidebar Component
 * 
 * A standalone navigation sidebar that can be used in any layout
 * Designed to be responsive, collapsible, and interactive
 */
const Sidebar = ({ 
  projects = [],
  user = null,
  projectId = null,
  isProjectPage = false,
  onExpandChange = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  
  // When expanded state changes, notify parent component
  useEffect(() => {
    onExpandChange(isExpanded);
  }, [isExpanded, onExpandChange]);
  
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  // Determine active state for nav items
  const isActive = (path) => pathname === path;

  return (
    <aside 
      className="fixed top-0 left-0 h-screen w-auto transition-all duration-300 ease-in-out bg-gray-900 border-r border-gray-800 shadow-md"
      style={{ width: isExpanded ? '220px' : '64px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Branding */}
        <div className="flex items-center justify-center py-5">
          <Link href="/">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              {isExpanded && (
                <span className="ml-3 font-semibold text-lg text-white">
                  PM
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          <NavItem 
            href="/" 
            icon={<Home className="h-5 w-5" />}
            label="Dashboard" 
            expanded={isExpanded}
            active={isActive('/')} 
          />
          
          {/* Conditionally render project-specific nav items when in a project */}
          {isProjectPage && projectId && (
            <>
              <NavItem 
                href={`/projects/${projectId}/files`} 
                icon={<FileText className="h-5 w-5" />}
                label="Files" 
                expanded={isExpanded}
                active={isActive(`/projects/${projectId}/files`)} 
              />
              <NavItem 
                href={`/projects/${projectId}/tasks`} 
                icon={<ClipboardList className="h-5 w-5" />}
                label="Tasks" 
                expanded={isExpanded}
                active={isActive(`/projects/${projectId}/tasks`)} 
              />
              <NavItem 
                href={`/projects/${projectId}/team`} 
                icon={<Users className="h-5 w-5" />}
                label="Team" 
                expanded={isExpanded}
                active={isActive(`/projects/${projectId}/team`)} 
              />
              <NavItem 
                href={`/projects/${projectId}/schedule`} 
                icon={<Calendar className="h-5 w-5" />}
                label="Schedule" 
                expanded={isExpanded}
                active={isActive(`/projects/${projectId}/schedule`)} 
              />
            </>
          )}
          
          {/* Projects section */}
          {projects.length > 0 && (
            <div className="pt-4">
              <div className={`px-3 text-xs font-medium text-gray-400 uppercase ${!isExpanded && 'sr-only'}`}>
                Projects
              </div>
              <div className="mt-2 space-y-1">
                {projects.map(project => (
                  <NavItem 
                    key={project.id}
                    href={`/projects/${project.id}`} 
                    icon={<Folder className="h-5 w-5" />}
                    label={project.name} 
                    expanded={isExpanded}
                    active={projectId === project.id} 
                  />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Settings and User Section */}
        <div className="mt-auto">
          <div className={`px-3 text-xs font-medium text-gray-400 uppercase ${!isExpanded && 'sr-only'}`}>
            Settings
          </div>
          <div className="mt-2 mb-2 space-y-1 px-2">
            <NavItem 
              href="/preferences" 
              icon={<Settings className="h-5 w-5" />}
              label="Preferences" 
              expanded={isExpanded}
              active={isActive('/preferences')} 
            />
            <NavItem 
              href="/account" 
              icon={<UserCircle className="h-5 w-5" />}
              label="Account" 
              expanded={isExpanded}
              active={isActive('/account')} 
            />
          </div>

          {/* User Profile */}
          {user && (
            <div className="border-t border-gray-800 mt-4 pt-4 px-2">
              <Link href="/account">
                <div className="flex items-center px-2 py-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {isExpanded && (
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-200">{user.user_metadata?.full_name || 'User'}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// Helper component for nav items
const NavItem = ({ href, icon, label, expanded, active }) => {
  return (
    <Link href={href}>
      <div className={`flex items-center py-2 px-3 rounded-md transition-all duration-200
        ${active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
        <div className={`flex items-center justify-center ${!expanded && 'mx-auto'}`}>
          {icon}
        </div>
        {expanded && (
          <span className="ml-3 text-sm whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Sidebar; 