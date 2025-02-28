// src/components/ThemeToggle.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  // Use a ref to track the theme state across renders
  const isDarkRef = useRef<boolean>(false);
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check if we have a saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system preference
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    // Update ref and state
    isDarkRef.current = initialDark;
    setIsDark(initialDark);
    
    // Ensure the HTML class matches our state
    // This shouldn't be needed if the script in layout.js worked, but it's a fallback
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Set up a listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change theme if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        const newIsDark = e.matches;
        isDarkRef.current = newIsDark;
        setIsDark(newIsDark);
        
        if (newIsDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    // Add transitioning class for smooth color changes
    document.documentElement.classList.add('transitioning');
    
    // Toggle dark mode
    const newIsDark = !isDarkRef.current;
    isDarkRef.current = newIsDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning');
    }, 500);
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme} 
      className="fixed bottom-4 right-4 z-50 rounded-full bg-background text-foreground border-border shadow-md hover:shadow-lg transition-all"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}