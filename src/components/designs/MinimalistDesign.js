'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Design system context
const MinimalistDesignContext = createContext(null);

/**
 * Minimalist Razor-Sharp Design System
 * 
 * A high-contrast, asymmetrical design system with:
 * - Monochromatic color scheme with single accent
 * - Sharp lines and precision
 * - Maximum data density with minimal space waste
 * - Custom typography and grid approach
 */
export function MinimalistDesignProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);
    
    // Apply design system CSS variables
    document.documentElement.style.setProperty('--radius', '0px');
    document.documentElement.style.setProperty('--primary', '#0066FF');
    document.documentElement.style.setProperty('--primary-foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--background', '#0A0A0A');
    document.documentElement.style.setProperty('--foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--muted', '#101010');
    document.documentElement.style.setProperty('--muted-foreground', '#888888');
    document.documentElement.style.setProperty('--card', '#0D0D0D');
    document.documentElement.style.setProperty('--card-foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--border', '#202020');
    document.documentElement.style.setProperty('--input', '#151515');
    
    // Add design system specific global styles
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'minimalist-design-styles');
    styleElement.textContent = `
      body {
        font-family: 'Inter', sans-serif;
        letter-spacing: -0.02em;
        background: linear-gradient(130deg, #0A0A0A 0%, #121212 100%);
      }
      
      .panel {
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .panel-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .razor-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-gap: 1px;
      }
      
      .data-table thead th {
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.65rem;
      }
      
      .data-cell {
        font-variant-numeric: tabular-nums;
      }
      
      .sharp-shadow {
        box-shadow: 4px 4px 0px rgba(0, 102, 255, 0.2);
      }
      
      @keyframes subtle-pulse {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
      }
      
      .pulse-accent {
        animation: subtle-pulse 4s infinite ease-in-out;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #0066FF;
        opacity: 0.5;
      }
      
      /* Asymmetrical layout classes */
      .shift-left {
        margin-left: -1rem;
      }
      
      .shift-right {
        margin-left: 1rem;
      }
      
      .shift-up {
        margin-top: -1rem;
      }
      
      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        letter-spacing: -0.03em;
      }
      
      /* Buttons */
      button {
        font-weight: 500;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        font-size: 0.75rem;
      }
      
      /* Status indicators */
      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 0;
        display: inline-block;
        margin-right: 8px;
      }
      
      .status-active {
        background-color: #0066FF;
      }
      
      .status-completed {
        background-color: #1DB954;
      }
      
      .status-draft {
        background-color: #FFC107;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      if (document.getElementById('minimalist-design-styles')) {
        document.getElementById('minimalist-design-styles').remove();
      }
      
      // Reset CSS variables to defaults
      document.documentElement.style.removeProperty('--radius');
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--foreground');
      document.documentElement.style.removeProperty('--muted');
      document.documentElement.style.removeProperty('--muted-foreground');
      document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--card-foreground');
      document.documentElement.style.removeProperty('--border');
      document.documentElement.style.removeProperty('--input');
    };
  }, []);
  
  return (
    <MinimalistDesignContext.Provider value={{}}>
      {children}
    </MinimalistDesignContext.Provider>
  );
}

// Hook to use the design system
export const useMinimalistDesign = () => {
  const context = useContext(MinimalistDesignContext);
  if (context === null) {
    throw new Error('useMinimalistDesign must be used within a MinimalistDesignProvider');
  }
  return context;
};

// Example specialized components for this design system
export const RazorPanel = ({ children, className, ...props }) => {
  return (
    <div className={`panel ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const RazorBadge = ({ status, children }) => {
  const statusColor = 
    status === 'active' ? 'text-[#0066FF]' :
    status === 'completed' ? 'text-[#1DB954]' :
    status === 'draft' ? 'text-[#FFC107]' : 'text-muted-foreground';
  
  return (
    <div className={`inline-flex items-center font-mono text-xs px-1.5 py-0.5 border border-[#202020] ${statusColor}`}>
      {children}
    </div>
  );
};

export const RazorDataTable = ({ children, className, ...props }) => {
  return (
    <table className={`data-table w-full ${className || ''}`} {...props}>
      {children}
    </table>
  );
};

export const RazorMetric = ({ label, value, icon, trend }) => {
  const trendColor = trend > 0 ? 'text-[#1DB954]' : trend < 0 ? 'text-[#E53935]' : '';
  
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="flex items-center gap-1.5">
        {icon && <div className="text-primary">{icon}</div>}
        <div className="text-lg font-mono data-cell">{value}</div>
        {trend !== undefined && (
          <div className={`text-xs ${trendColor}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : ''}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}; 