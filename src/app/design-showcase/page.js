'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDesignSystem } from '@/lib/design-system';
import { 
  ChevronRight, 
  Palette, 
  Layout, 
  Type, 
  Paintbrush, 
  Layers, 
  Shield, 
  Zap, 
  Eye, 
  ArrowLeft,
  Check
} from 'lucide-react';

export default function DesignShowcase() {
  const [mounted, setMounted] = useState(false);
  const { activeDesign, setActiveDesign, designs } = useDesignSystem();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const colorItems = [
    { name: 'Primary', value: 'var(--primary, #0A84FF)', className: 'bg-primary text-primary-foreground' },
    { name: 'Secondary', value: 'var(--secondary, #64748B)', className: 'bg-secondary text-secondary-foreground' },
    { name: 'Accent', value: 'var(--accent, #F8FAFC)', className: 'bg-accent text-accent-foreground' },
    { name: 'Muted', value: 'var(--muted, #F1F5F9)', className: 'bg-muted text-muted-foreground' },
    { name: 'Destructive', value: 'var(--destructive, #DC2626)', className: 'bg-destructive text-destructive-foreground' },
    { name: 'Success', value: 'var(--success, #10B981)', className: 'bg-success text-success-foreground' },
    { name: 'Warning', value: 'var(--warning, #F59E0B)', className: 'bg-warning text-warning-foreground' }
  ];

  const typographyItems = [
    { name: 'Display', className: 'text-4xl font-bold tracking-tight', sample: 'Premium Typography' },
    { name: 'Heading 1', className: 'text-3xl font-semibold tracking-tight', sample: 'High-End Design System' },
    { name: 'Heading 2', className: 'text-2xl font-semibold', sample: 'Professional & Clean' },
    { name: 'Heading 3', className: 'text-xl font-medium', sample: 'Sophisticated Components' },
    { name: 'Body Large', className: 'text-base', sample: 'The premium design system offers a sophisticated, high-contrast aesthetic with carefully crafted components.' },
    { name: 'Body Small', className: 'text-sm', sample: 'Our components are built with accessibility and performance in mind.' },
    { name: 'Caption', className: 'text-xs text-muted-foreground', sample: 'Designed with modern best practices' }
  ];

  const componentItems = [
    { name: 'Premium Card', preview: (
      <div className="card-premium p-4 w-full">
        <h3 className="font-medium">Premium Card Component</h3>
        <p className="text-sm text-muted-foreground mt-1">Elegant shadowing and subtle hover effects</p>
      </div>
    )},
    { name: 'Glass Container', preview: (
      <div className="glass p-4 w-full">
        <h3 className="font-medium">Glass Effect Container</h3>
        <p className="text-sm text-muted-foreground mt-1">Sophisticated backdrop blur with border</p>
      </div>
    )},
    { name: 'Gradient Text', preview: (
      <h3 className="gradient-text text-xl font-semibold w-full">
        Stunning Gradient Typography
      </h3>
    )},
    { name: 'Premium Button', preview: (
      <button className="button-premium bg-primary text-primary-foreground w-full">
        Interactive Premium Button
      </button>
    )},
    { name: 'Animated Element', preview: (
      <div className="animate-shimmer h-12 rounded-lg w-full"></div>
    )}
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header with glass effect */}
      <div className="glass sticky top-0 z-10 mb-8 border-b">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Design Showcase</h1>
              <p className="text-muted-foreground">Exploring our premium design system</p>
            </div>
            <Link 
              href="/dashboard" 
              className="button-premium bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Design Selector Section */}
        <div className="rounded-xl border bg-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Paintbrush className="mr-2 h-5 w-5 text-primary" />
            Design System Selection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(designs).map((design) => (
              <div 
                key={design.id}
                onClick={() => setActiveDesign(design.id)}
                className={`rounded-lg border p-4 cursor-pointer transition-all hover-lift ${
                  activeDesign === design.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div 
                      className="h-8 w-8 rounded-full mr-3" 
                      style={{background: design.id === 'premium' ? '#0A84FF' : design.id === 'experimental' ? '#F471B5' : '#FF6B35'}}
                    />
                    <h3 className="font-medium">{design.name}</h3>
                  </div>
                  {activeDesign === design.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{design.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto border-b mb-8 no-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'overview' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="mr-2 h-4 w-4" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('typography')}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'typography' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Type className="mr-2 h-4 w-4" />
            Typography
          </button>
          <button 
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'colors' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Palette className="mr-2 h-4 w-4" />
            Colors
          </button>
          <button 
            onClick={() => setActiveTab('components')}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center ${
              activeTab === 'components' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layout className="mr-2 h-4 w-4" />
            Components
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <div className="rounded-xl border bg-card p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                About {designs[activeDesign]?.name}
              </h2>
              <p className="mb-4">{designs[activeDesign]?.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Professional Grade</h3>
                  <p className="text-sm text-muted-foreground">Built for enterprise applications with modern best practices</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">High Performance</h3>
                  <p className="text-sm text-muted-foreground">Optimized for fast rendering and smooth interactions</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg border">
                  <Paintbrush className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium mb-1">Customizable</h3>
                  <p className="text-sm text-muted-foreground">Easily adaptable to match your brand identity</p>
                </div>
              </div>
            </div>
            
            <div className="bg-grid-pattern bg-fixed rounded-xl p-8 text-center">
              <h3 className="gradient-text text-3xl font-bold mb-4">Experience Premium Design</h3>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                This design system has been crafted with meticulous attention to detail, 
                focusing on a premium user experience worthy of high-end applications.
              </p>
              <button className="button-premium bg-primary text-primary-foreground inline-flex items-center">
                <span>Explore Components</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Type className="mr-2 h-5 w-5 text-primary" />
              Typography System
            </h2>
            
            <div className="space-y-8">
              {typographyItems.map((item, index) => (
                <div key={index} className="pb-4 border-b last:border-0">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground font-mono">
                      {item.className}
                    </span>
                  </div>
                  <div className={item.className}>{item.sample}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Palette className="mr-2 h-5 w-5 text-primary" />
              Color Palette
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorItems.map((color, index) => (
                <div key={index} className="rounded-lg border overflow-hidden">
                  <div className={`${color.className} p-6 h-20 flex items-end`}>
                    <span className="font-medium">{color.name}</span>
                  </div>
                  <div className="p-3 text-xs font-mono bg-card text-muted-foreground">
                    {color.value}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 rounded-lg border">
              <h3 className="font-medium mb-3">Gradient Effects</h3>
              <div className="h-20 rounded-lg mb-3" style={{
                background: 'linear-gradient(135deg, #0A84FF 0%, #4CC2FF 100%)'
              }}></div>
              <code className="text-xs bg-muted p-2 rounded block">
                background: linear-gradient(135deg, #0A84FF 0%, #4CC2FF 100%);
              </code>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8">
            {componentItems.map((component, index) => (
              <div key={index} className="rounded-xl border bg-card p-6">
                <h3 className="text-lg font-medium mb-4">{component.name}</h3>
                <div className="p-4 border rounded-lg bg-background">
                  {component.preview}
                </div>
              </div>
            ))}
            
            <div className="flex justify-center mt-8">
              <Link href="/dashboard" className="button-premium bg-primary text-primary-foreground">
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 