'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from '@/components/Sidebar';
import { useDesignSystem } from '@/lib/design-system';
import { DesignSelector } from '@/components/DesignSelector';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';

const SIDEBAR_BREAKPOINT = 1024; // lg breakpoint

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const { activeDesign, setActiveDesign, designs } = useDesignSystem();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Get sidebar expanded state from localStorage on mount
  useEffect(() => {
    // Force Premium Obsidian theme on every render
    setActiveDesign('minimalist');
    
    // Save the Premium Obsidian theme to localStorage to persist across refreshes
    localStorage.setItem('design-system-preference', 'minimalist');
    
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setSidebarExpanded(savedState === 'true');
    }
    
    // Set mounted state to prevent hydration issues
    setMounted(true);
    
    // Add a subtle parallax effect to background patterns when scrolling
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const patterns = document.querySelectorAll('.bg-grid-pattern, .bg-dot-pattern');
      
      patterns.forEach(pattern => {
        pattern.style.backgroundPosition = `0 ${scrollY * 0.05}px`;
      });
    };
    
    // Apply premium theme CSS variables directly to ensure they're set
    document.documentElement.style.setProperty('--primary', '#FFD700');
    document.documentElement.style.setProperty('--background', '#090909');
    document.documentElement.style.setProperty('--foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--card', '#0D0D0D');
    document.documentElement.style.setProperty('--glass', 'rgba(8, 8, 10, 0.85)');
    document.documentElement.classList.add('premium-obsidian-theme');
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveDesign]);
  
  // Skip sidebar on auth pages and landing page
  const isAuthPage = pathname?.startsWith('/auth') || pathname?.startsWith('/login');
  const isLandingPage = pathname === '/';
  
  // Render a simpler layout on auth pages or landing page
  if (isAuthPage) {
    return mounted ? (
      <div className="min-h-screen bg-premium-gradient flex flex-col">
        <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-5"></div>
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <Toaster />
      </div>
    ) : null;
  }
  
  if (isLandingPage) {
    return mounted ? (
      <div className="min-h-screen bg-premium-gradient flex flex-col">
        <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-5"></div>
        <NavigationBar />
        <main className="flex-grow">
          {children}
          <AboutSection />
        </main>
        <Footer />
        <Toaster />
      </div>
    ) : null;
  }
  
  if (!mounted) return null;
  
  return (
    <div className="flex h-screen overflow-hidden bg-premium-gradient relative">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-5 z-0"></div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <NavigationBar 
          sidebarOpen={sidebarOpen} 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
          {/* Footer inside the scrollable area for app pages */}
          <Footer />
        </main>
      </div>
      
      {/* Design Selector - Hidden since we're forcing Premium Obsidian */}
      {/* <DesignSelector /> */}
      
      {/* Global Components */}
      <Toaster />
      
      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        body {
          background-color: #090909 !important; /* Force black background */
          color: #FFFFFF !important; /* Force white text */
        }
        
        /* Enhanced glass effect */
        .glass {
          background: rgba(8, 8, 10, 0.75) !important;
          backdrop-filter: blur(12px) !important;
          border-color: rgba(255, 215, 0, 0.15) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        }
        
        /* Premium card styles */
        .card, .bg-card {
          background: rgba(10, 10, 10, 0.95) !important;
          border-color: rgba(255, 215, 0, 0.1) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 215, 0, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default ClientLayout; 