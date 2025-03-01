'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Design system context
const ExperimentalDesignContext = createContext(null);

/**
 * Wild & Experimental Design System
 * 
 * A rule-breaking, asymmetrical design system with:
 * - Diagonal and angular elements
 * - Bold limited color palette
 * - Unexpected element positioning
 * - Overlapping panels and dramatic contrast
 */
export function ExperimentalDesignProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted state to true
    setMounted(true);
    
    // Apply design system CSS variables
    document.documentElement.style.setProperty('--radius', '0px');
    document.documentElement.style.setProperty('--primary', '#FF3366');
    document.documentElement.style.setProperty('--primary-foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--background', '#18181A');
    document.documentElement.style.setProperty('--foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--muted', '#22222A');
    document.documentElement.style.setProperty('--muted-foreground', '#9898A0');
    document.documentElement.style.setProperty('--card', '#202025');
    document.documentElement.style.setProperty('--card-foreground', '#FFFFFF');
    document.documentElement.style.setProperty('--border', '#33333D');
    document.documentElement.style.setProperty('--input', '#28282E');
    
    // Add design system specific global styles
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'experimental-design-styles');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      
      body {
        font-family: 'Space Grotesk', sans-serif;
        background: linear-gradient(135deg, #18181A 0%, #222230 100%);
        overflow-x: hidden;
      }
      
      /* Diagonal elements */
      .diagonal-panel {
        position: relative;
        clip-path: polygon(0 0, 100% 0, 98% 100%, 0% 100%);
        background: #202025;
        transform: perspective(800px) rotateY(-2deg);
      }
      
      .diagonal-panel-right {
        position: relative;
        clip-path: polygon(2% 0, 100% 0, 100% 100%, 0% 100%);
        background: #202025;
        transform: perspective(800px) rotateY(2deg);
      }
      
      /* Experimental grid system */
      .chaos-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(2, auto);
        grid-gap: 15px;
      }
      
      .span-2 { grid-column: span 2; }
      .span-3 { grid-column: span 3; }
      .span-4 { grid-column: span 4; }
      .span-5 { grid-column: span 5; }
      .span-6 { grid-column: span 6; }
      
      .overlap-top { margin-top: -30px; z-index: 2; }
      .overlap-left { margin-left: -20px; z-index: 2; }
      .overlap-right { margin-right: -20px; z-index: 2; }
      
      /* Neon effects */
      .neon-border {
        box-shadow: 0 0 5px rgba(255, 51, 102, 0.5), 
                    0 0 10px rgba(255, 51, 102, 0.3);
      }
      
      /* Glitch animation */
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      
      .glitch-hover:hover {
        animation: glitch 0.2s cubic-bezier(.25, .46, .45, .94) both;
      }
      
      /* Skewed badges and buttons */
      .skewed-element {
        transform: skew(-10deg);
      }
      
      .skewed-element > * {
        transform: skew(10deg);
      }
      
      /* Gradient text */
      .gradient-text {
        background: linear-gradient(90deg, #FF3366, #FF9966);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      
      ::-webkit-scrollbar-track {
        background: #22222A;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #FF3366, #FF9966);
      }
      
      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      /* Status indicators */
      .status-active {
        background: linear-gradient(90deg, #FF3366, #FF6666);
      }
      
      .status-completed {
        background: linear-gradient(90deg, #33CCFF, #3366FF);
      }
      
      .status-draft {
        background: linear-gradient(90deg, #FFCC33, #FF9966);
      }
      
      /* Hover effects */
      .wild-hover {
        transition: all 0.2s ease;
      }
      
      .wild-hover:hover {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 5px 15px rgba(255, 51, 102, 0.2);
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Cleanup on unmount
    return () => {
      if (document.getElementById('experimental-design-styles')) {
        document.getElementById('experimental-design-styles').remove();
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
    <ExperimentalDesignContext.Provider value={{}}>
      {children}
    </ExperimentalDesignContext.Provider>
  );
}

// Hook to use the design system
export const useExperimentalDesign = () => {
  const context = useContext(ExperimentalDesignContext);
  if (context === null) {
    throw new Error('useExperimentalDesign must be used within an ExperimentalDesignProvider');
  }
  return context;
};

// Example specialized components for this design system
export const DiagonalPanel = ({ children, right = false, className, ...props }) => {
  return (
    <div className={`${right ? 'diagonal-panel-right' : 'diagonal-panel'} p-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const WildBadge = ({ status, children }) => {
  const statusClass = 
    status === 'active' ? 'status-active' :
    status === 'completed' ? 'status-completed' :
    status === 'draft' ? 'status-draft' : '';
  
  return (
    <div className="skewed-element inline-block">
      <div className={`${statusClass} text-white text-xs px-2 py-1`}>
        {children}
      </div>
    </div>
  );
};

export const GlitchText = ({ children, className, ...props }) => {
  return (
    <span className={`glitch-hover font-bold ${className || ''}`} {...props}>
      {children}
    </span>
  );
};

export const WildMetric = ({ label, value, accentColor = '#FF3366' }) => {
  return (
    <div className="diagonal-panel p-3 wild-hover">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color: accentColor }}>{value}</div>
    </div>
  );
}; 