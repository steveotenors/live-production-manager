// src/components/ThemeToggle.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Check if we have a saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system preference
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setIsDark(initialDark);
  }, []);

  const toggleTheme = () => {
    // Add transitioning class for smooth color changes
    document.documentElement.classList.add('transitioning');
    
    // Toggle dark mode
    const newIsDark = !isDark;
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