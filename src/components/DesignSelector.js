'use client';

import { Paintbrush, Check, ChevronRight } from 'lucide-react';
import { useDesignSystem, DESIGN_SYSTEMS } from '@/lib/design-system';
import { useState, useEffect } from 'react';

/**
 * DesignSelector Component
 * 
 * An elegant floating button and panel for selecting between design systems.
 */
export function DesignSelector() {
  const { activeDesign, setActiveDesign, selectorVisible, toggleSelector } = useDesignSystem();
  const [mounted, setMounted] = useState(false);
  const [animationState, setAnimationState] = useState('exit');
  
  // Handle hydration issues by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle animation states for the selector panel
  useEffect(() => {
    if (selectorVisible) {
      setAnimationState('enter');
    } else {
      setAnimationState('exit');
    }
  }, [selectorVisible]);
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Elegant Design Selector Button with Glow Effect */}
      <button
        onClick={toggleSelector}
        className="fixed right-6 bottom-6 z-50 p-0 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 backdrop-blur-sm hover:rotate-12"
        style={{ 
          background: `var(--gradient1)`,
          color: '#FFFFFF',
          width: '50px',
          height: '50px',
          boxShadow: selectorVisible 
            ? '0 0 0 3px rgba(var(--primary-rgb), 0.3), 0 10px 20px rgba(0,0,0,0.3)' 
            : '0 6px 16px rgba(0,0,0,0.2)'
        }}
        aria-label="Design settings"
      >
        <Paintbrush size={22} />
      </button>
      
      {/* Premium Design Selector Panel with Glass Effect */}
      {selectorVisible && (
        <>
          {/* Overlay that closes the selector when clicked */}
          <div 
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity: animationState === 'enter' ? 1 : 0 }}
            onClick={toggleSelector}
          />
          
          <div 
            className="fixed bottom-24 right-6 z-50 rounded-xl overflow-hidden border transition-all duration-300"
            style={{
              width: '340px',
              background: 'var(--glass)',
              backdropFilter: 'blur(16px)',
              borderColor: 'var(--glass-border)',
              boxShadow: 'var(--shadow-lg)',
              opacity: animationState === 'enter' ? 1 : 0,
              transform: animationState === 'enter' 
                ? 'translateY(0) scale(1)' 
                : 'translateY(20px) scale(0.95)'
            }}
          >
            <div className="px-5 py-4 border-b border-border/40 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Design System</h3>
              <div className="text-xs text-muted-foreground">
                Change appearance
              </div>
            </div>
            
            <div className="p-3">
              {DESIGN_SYSTEMS.map(design => (
                <div 
                  key={design.id}
                  onClick={() => setActiveDesign(design.id)}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                  style={{
                    background: activeDesign === design.id ? 'var(--muted)' : 'transparent',
                  }}
                >
                  {/* Design Color Preview */}
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden"
                      style={{ 
                        background: design.id === 'minimalist' 
                          ? design.colors.gradient1
                          : design.colors.primary,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)'
                      }}
                    >
                      {design.id === 'minimalist' && (
                        <div className="absolute inset-0 bg-grid-white/10"></div>
                      )}
                    </div>
                    
                    {/* Selection Indicator */}
                    {activeDesign === design.id && (
                      <div className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">
                      {design.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {design.description}
                    </p>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
            
            <div className="px-5 py-3 border-t border-border/40 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Saved to your preferences
              </p>
              <div 
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--primary)' }}
              ></div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 