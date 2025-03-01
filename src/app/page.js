'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap } from 'lucide-react';
import { useDesignSystem, DESIGN_SYSTEMS } from '@/lib/design-system';

export default function Home() {
  const router = useRouter();
  const { activeDesign, setActiveDesign } = useDesignSystem();
  const [mounted, setMounted] = useState(false);
  
  // Solve hydration issues by only rendering UI after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // Or return a loading skeleton
  }

  // Handle design selection
  const handleSelectDesign = (designId) => {
    setActiveDesign(designId);
    setTimeout(() => router.push('/dashboard'), 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Live Production Manager
        </h1>
        
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Professional tools for managing live productions with multiple design system options to match your team's workflow.
        </p>
        
        {/* Design Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {DESIGN_SYSTEMS.map(design => (
            <div 
              key={design.id}
              onClick={() => handleSelectDesign(design.id)}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
              style={{
                borderColor: design.colors.border,
                background: design.colors.card,
                color: design.colors.cardForeground,
                transform: activeDesign === design.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: activeDesign === design.id ? `0 0 0 2px ${design.colors.primary}, 0 10px 30px -10px rgba(0,0,0,0.3)` : '',
              }}
            >
              {/* Design Preview Bar */}
              <div className="h-3" style={{ background: design.colors.primary }}></div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{design.name}</h3>
                <p className="text-sm mb-4 opacity-80">{design.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    {['primary', 'secondary', 'accent'].map(colorType => (
                      <div 
                        key={colorType}
                        className="w-6 h-6 rounded-full"
                        style={{ background: design.colors[colorType] }}
                      ></div>
                    ))}
                  </div>
                  
                  <div 
                    className="flex items-center text-sm font-medium group-hover:text-primary transition-colors"
                    style={{ color: activeDesign === design.id ? design.colors.primary : 'inherit' }}
                  >
                    {activeDesign === design.id ? (
                      <>
                        <span>Selected</span>
                        <Zap size={16} className="ml-1" />
                      </>
                    ) : (
                      <>
                        <span>Select</span>
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:brightness-110 transition-all"
          >
            Go to Dashboard
          </button>
          
          <button 
            onClick={() => router.push('/design-showcase')}
            className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-md transition-all"
          >
            Design Showcase
          </button>
        </div>
      </div>
    </div>
  );
}