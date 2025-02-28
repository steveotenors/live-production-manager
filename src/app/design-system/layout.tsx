'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileText,
  Palette,
  Type,
  Sliders,
  Square,
  Circle,
  Inbox,
  Loader2,
  Layers,
  Home,
  ChevronRight,
  Box,
  Package,
  Check,
} from 'lucide-react';

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');
  
  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const sections = document.querySelectorAll('section[id]');
        let currentActiveSection = '';
        
        sections.forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top;
          
          if (sectionTop < 200) {
            currentActiveSection = section.id;
          }
        });
        
        if (currentActiveSection !== activeSection) {
          setActiveSection(currentActiveSection);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);
  
  const navigationItems = [
    { id: 'typography', label: 'Typography', icon: <Type className="h-4 w-4 mr-2" /> },
    { id: 'colors', label: 'Colors', icon: <Palette className="h-4 w-4 mr-2" /> },
    { id: 'buttons', label: 'Buttons', icon: <Square className="h-4 w-4 mr-2" /> },
    { id: 'badges', label: 'Badges', icon: <Circle className="h-4 w-4 mr-2" /> },
    { id: 'cards', label: 'Cards', icon: <LayoutGrid className="h-4 w-4 mr-2" /> },
    { id: 'dialogs', label: 'Dialogs', icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: 'forms', label: 'Forms', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'empty-states', label: 'Empty States', icon: <Inbox className="h-4 w-4 mr-2" /> },
    { id: 'loading-states', label: 'Loading States', icon: <Loader2 className="h-4 w-4 mr-2" /> },
    { id: 'progress', label: 'Progress', icon: <Sliders className="h-4 w-4 mr-2" /> },
    { id: 'container', label: 'Container', icon: <Box className="h-4 w-4 mr-2" /> },
  ];
  
  if (pathname !== '/design-system') {
    return children;
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Side navigation */}
      <div className="w-64 border-r bg-muted/30 p-4 hidden md:block">
        <div className="fixed w-56">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Design System</h2>
            <p className="text-sm text-muted-foreground mb-4">Component Documentation</p>
            
            <Link href="/" className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
              <Home className="h-4 w-4 mr-2" />
              Back to Application
            </Link>
          </div>
          
          <div className="mb-4">
            <div className="text-xs uppercase text-muted-foreground font-medium tracking-wider mb-2">Components</div>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          
          <div className="pt-4 border-t space-y-1">
            <Link 
              href="/design-system/docs" 
              className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
            >
              <Package className="h-4 w-4 mr-2" />
              Documentation
              <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
            </Link>
            
            <Link 
              href="/design-system/validator" 
              className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
            >
              <Check className="h-4 w-4 mr-2" />
              Design Validator
              <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold">Design System</h2>
          </div>
          <div className="flex gap-3">
            <Link href="/design-system/validator" className="flex items-center text-sm text-primary">
              <Check className="h-4 w-4 mr-1" />
              Validator
            </Link>
            <Link href="/" className="flex items-center text-sm text-primary">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="md:hidden h-16"></div> {/* Spacer for mobile header */}
        {children}
      </div>
    </div>
  );
} 