'use client';

/**
 * Design System Core
 * 
 * This module provides utilities for managing design system variables and styles.
 * It uses a layered approach to prevent hydration issues and ensure consistent styling.
 */

import { useState, useEffect, createContext, useContext } from 'react';

// Available design systems
export const DESIGN_SYSTEMS = [
  {
    id: 'minimalist',
    name: 'Premium Obsidian',
    description: 'Luxurious volcanic glass aesthetic with razor-sharp details and opulent finishes.',
    colors: {
      // Primary accent - electric gold that screams opulence against obsidian black
      primary: '#FFD700',
      secondary: '#B8B8FF',
      accent: '#34D399',
      destructive: '#FF3B30',
      
      // Ultra-deep backgrounds with mirror-like finish
      background: '#090909',
      foreground: '#FFFFFF',
      muted: '#141414',
      mutedForeground: '#8E8E93',
      
      // Card styling with glossy elevation
      card: '#0D0D0D',
      cardForeground: '#FFFFFF',
      
      // Refined borders and input styling - surgical precision
      border: '#222222',
      input: '#141414',
      
      // Subtle corners - razor-sharp edges with just enough rounding
      radius: '4px',
      
      // Additional design tokens for functional signaling
      success: '#30D158',
      warning: '#FFD60A',
      info: '#64D2FF',
      
      // Liquid metal gradients
      gradient1: 'linear-gradient(135deg, #FFD700 0%, #B78628 100%)',
      gradient2: 'linear-gradient(135deg, #222222 0%, #0D0D0D 100%)',
      
      // Dramatic shadows 
      shadowSm: '0 1px 2px rgba(0, 0, 0, 0.5)',
      shadowMd: '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)',
      shadowLg: '0 10px 25px rgba(0, 0, 0, 0.5), 0 5px 10px rgba(0, 0, 0, 0.3)',
      
      // Ultra-glossy glass effect
      glass: 'rgba(8, 8, 10, 0.85)',
      glassBorder: 'rgba(255, 215, 0, 0.1)',
      
      // Prestigious typography
      fontHeading: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      fontBody: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      fontMono: "'SF Mono', SFMono-Regular, ui-monospace, monospace"
    }
  },
  {
    id: 'experimental',
    name: 'Wild Experimental',
    description: 'Bold diagonal elements, unexpected positioning, and dramatic contrast.',
    colors: {
      primary: '#FF3366',
      secondary: '#7928CA',
      accent: '#FFC700',
      destructive: '#FF4757',
      background: '#18181A',
      foreground: '#FFFFFF',
      muted: '#27272A',
      mutedForeground: '#A1A1AA',
      card: '#1C1C1E',
      cardForeground: '#FFFFFF',
      border: '#333333',
      input: '#27272A',
      radius: '0px'
    }
  },
  {
    id: 'warm',
    name: 'Warm Badass',
    description: 'Rich textured design with substantial typography and premium details.',
    colors: {
      primary: '#E8505B',
      secondary: '#F0A04B',
      accent: '#D4B483',
      destructive: '#C1292E',
      background: '#191714',
      foreground: '#F2F0E4',
      muted: '#252117',
      mutedForeground: '#A09A8C',
      card: '#1D1A16',
      cardForeground: '#F2F0E4',
      border: '#2C261F',
      input: '#252117',
      radius: '2px'
    }
  }
];

// Create a context to store the current design system
const DesignSystemContext = createContext({
  activeDesign: 'minimalist',
  setActiveDesign: () => {},
  design: DESIGN_SYSTEMS[0],
  selectorVisible: false,
  toggleSelector: () => {}
});

/**
 * DesignSystemProvider component
 * 
 * Manages the active design system and applies CSS variables safely
 */
export function DesignSystemProvider({ children }) {
  // State for managing the active design system
  const [activeDesign, setActiveDesign] = useState('minimalist');
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Get the current design system object
  const design = DESIGN_SYSTEMS.find(d => d.id === activeDesign) || DESIGN_SYSTEMS[0];
  
  // Function to toggle the selector visibility
  const toggleSelector = () => setSelectorVisible(prev => !prev);
  
  // Handle design changes
  const handleDesignChange = (newDesign) => {
    setActiveDesign(newDesign);
    localStorage.setItem('design-system-preference', newDesign);
    setSelectorVisible(false);
  };
  
  // Initialize from localStorage and set up CSS variables
  useEffect(() => {
    // Get stored preference from localStorage
    const storedDesign = localStorage.getItem('design-system-preference');
    if (storedDesign && DESIGN_SYSTEMS.some(d => d.id === storedDesign)) {
      setActiveDesign(storedDesign);
    }
    
    // Load fonts
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    // Mark component as mounted
    setMounted(true);
  }, []);
  
  // Apply CSS variables when the active design changes
  useEffect(() => {
    if (!mounted) return;
    
    // Get the current design system
    const currentDesign = DESIGN_SYSTEMS.find(d => d.id === activeDesign) || DESIGN_SYSTEMS[0];
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--radius', currentDesign.colors.radius);
    document.documentElement.style.setProperty('--primary', currentDesign.colors.primary);
    document.documentElement.style.setProperty('--secondary', currentDesign.colors.secondary);
    document.documentElement.style.setProperty('--accent', currentDesign.colors.accent);
    document.documentElement.style.setProperty('--destructive', currentDesign.colors.destructive);
    document.documentElement.style.setProperty('--background', currentDesign.colors.background);
    document.documentElement.style.setProperty('--foreground', currentDesign.colors.foreground);
    document.documentElement.style.setProperty('--muted', currentDesign.colors.muted);
    document.documentElement.style.setProperty('--muted-foreground', currentDesign.colors.mutedForeground);
    document.documentElement.style.setProperty('--card', currentDesign.colors.card);
    document.documentElement.style.setProperty('--card-foreground', currentDesign.colors.cardForeground);
    document.documentElement.style.setProperty('--border', currentDesign.colors.border);
    document.documentElement.style.setProperty('--input', currentDesign.colors.input);
    
    // Apply additional design tokens if they exist
    if (currentDesign.colors.success) {
      document.documentElement.style.setProperty('--success', currentDesign.colors.success);
      document.documentElement.style.setProperty('--warning', currentDesign.colors.warning);
      document.documentElement.style.setProperty('--info', currentDesign.colors.info);
      document.documentElement.style.setProperty('--gradient1', currentDesign.colors.gradient1);
      document.documentElement.style.setProperty('--gradient2', currentDesign.colors.gradient2);
      document.documentElement.style.setProperty('--shadow-sm', currentDesign.colors.shadowSm);
      document.documentElement.style.setProperty('--shadow-md', currentDesign.colors.shadowMd);
      document.documentElement.style.setProperty('--shadow-lg', currentDesign.colors.shadowLg);
      document.documentElement.style.setProperty('--glass', currentDesign.colors.glass);
      document.documentElement.style.setProperty('--glass-border', currentDesign.colors.glassBorder);
      document.documentElement.style.setProperty('--font-heading', currentDesign.colors.fontHeading);
      document.documentElement.style.setProperty('--font-body', currentDesign.colors.fontBody);
      document.documentElement.style.setProperty('--font-mono', currentDesign.colors.fontMono);
    }
    
  }, [activeDesign, mounted]);
  
  // Avoid rendering anything until mounted to prevent hydration issues
  if (!mounted) {
    // Render a passive container that won't affect hydration
    return <>{children}</>;
  }
  
  // Create the context value
  const contextValue = {
    activeDesign,
    setActiveDesign: handleDesignChange,
    design,
    selectorVisible,
    toggleSelector,
    designs: DESIGN_SYSTEMS
  };
  
  // Provide the design system context to children
  return (
    <DesignSystemContext.Provider value={contextValue}>
      {children}
    </DesignSystemContext.Provider>
  );
}

// Hook for using the design system
export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  
  return context;
} 