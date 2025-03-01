'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Design system context
const WarmDesignContext = createContext(null);

/**
 * Warm but Badass Design System
 * 
 * A rich, textured design system with:
 * - Deep, warm colors with subtle gradients
 * - Substantial typography with presence
 * - Subtle texture and grain effects
 * - Premium, confident feel with rich details
 */
export function WarmDesignProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);
    
    // Apply design system CSS variables
    document.documentElement.style.setProperty('--radius', '2px');
    document.documentElement.style.setProperty('--primary', '#E8505B');
    document.documentElement.style.setProperty('--primary-foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--background', '#191714');
    document.documentElement.style.setProperty('--foreground', '#F2F0E4');
    document.documentElement.style.setProperty('--muted', '#252117');
    document.documentElement.style.setProperty('--muted-foreground', '#A09A8C');
    document.documentElement.style.setProperty('--card', '#201C18');
    document.documentElement.style.setProperty('--card-foreground', '#F2F0E4');
    document.documentElement.style.setProperty('--border', '#2C261F');
    document.documentElement.style.setProperty('--input', '#252117');
    
    // Add design system specific global styles
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'warm-design-styles');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600;700&display=swap');
      
      body {
        font-family: 'Bitter', serif;
        background: linear-gradient(135deg, #191714 0%, #201C18 100%);
        position: relative;
      }
      
      /* Noise texture overlay */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.03;
        pointer-events: none;
        z-index: 9999;
      }
      
      /* Warm panels */
      .warm-panel {
        background: #201C18;
        border: 1px solid #2C261F;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
      }
      
      .warm-panel::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #E8505B, #F0A868);
        opacity: 0.9;
      }
      
      /* Glowing elements */
      .warm-glow {
        box-shadow: 0 0 15px rgba(232, 80, 91, 0.2);
      }
      
      /* Panel headers */
      .warm-header {
        border-bottom: 1px solid #2C261F;
        padding-bottom: 0.5rem;
      }
      
      /* Grid layout */
      .warm-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;
      }
      
      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 700;
        letter-spacing: -0.01em;
        color: #F2F0E4;
      }
      
      /* Link styling */
      a {
        color: #E8505B;
        text-decoration: none;
        position: relative;
        display: inline-block;
      }
      
      a::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #E8505B;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }
      
      a:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }
      
      /* Buttons */
      button {
        transition: all 0.2s ease;
      }
      
      button:hover {
        transform: translateY(-1px);
      }
      
      button:active {
        transform: translateY(1px);
      }
      
      /* Status colors */
      .status-active {
        color: #E8505B;
      }
      
      .status-completed {
        color: #4EA770;
      }
      
      .status-draft {
        color: #F0A868;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #252117;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #2C261F;
        border-radius: 4px;
        border: 2px solid #252117;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #3C362F;
      }
      
      /* Table styling */
      table {
        border-collapse: separate;
        border-spacing: 0;
      }
      
      table th {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.7rem;
        letter-spacing: 0.05em;
        color: #A09A8C;
      }
      
      table tr {
        transition: background-color 0.2s ease;
      }
      
      table tr:hover {
        background-color: rgba(232, 80, 91, 0.05);
      }
      
      /* Badge styling */
      .warm-badge {
        display: inline-block;
        padding: 0.25em 0.5em;
        font-size: 0.7rem;
        font-weight: 600;
        border-radius: 2px;
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      if (document.getElementById('warm-design-styles')) {
        document.getElementById('warm-design-styles').remove();
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
    <WarmDesignContext.Provider value={{}}>
      {children}
    </WarmDesignContext.Provider>
  );
}

// Hook to use the design system
export const useWarmDesign = () => {
  const context = useContext(WarmDesignContext);
  if (context === null) {
    throw new Error('useWarmDesign must be used within a WarmDesignProvider');
  }
  return context;
};

// Example specialized components for this design system
export const WarmPanel = ({ children, title, className, ...props }) => {
  return (
    <div className={`warm-panel p-4 ${className || ''}`} {...props}>
      {title && <h3 className="warm-header text-lg mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export const WarmBadge = ({ status, children }) => {
  const statusClass = 
    status === 'active' ? 'bg-[#36201C] text-[#E8505B] border-[#5A3131]' :
    status === 'completed' ? 'bg-[#1C3622] text-[#4EA770] border-[#2A5345]' :
    status === 'draft' ? 'bg-[#3E2E17] text-[#F0A868] border-[#644F32]' : 
    'bg-[#2C261F] text-[#A09A8C] border-[#493D33]';
  
  return (
    <span className={`warm-badge ${statusClass} border`}>
      {children}
    </span>
  );
};

export const WarmTable = ({ children, className, ...props }) => {
  return (
    <div className="overflow-hidden">
      <table className={`w-full ${className || ''}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const WarmMetric = ({ label, value, icon }) => {
  return (
    <div className="flex items-start gap-3 p-3 warm-panel">
      {icon && (
        <div className="mt-1 text-primary">{icon}</div>
      )}
      <div>
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}; 