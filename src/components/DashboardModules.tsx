'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  Clock, 
  FileText, 
  ArrowRight, 
  Wrench, 
  BarChart2, 
  Mic2,
  Sliders,
  Upload,
  Download,
  Code,
  Calendar,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Tool = {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
};

export function DashboardModules() {
  const initialTools: Tool[] = [
    { 
      id: 'metronome', 
      name: 'Metronome', 
      href: '/tools/metronome', 
      icon: <Clock className="h-5 w-5" />, 
      enabled: true,
      description: 'Tempo and timing tool'
    },
    { 
      id: 'notes', 
      name: 'Quick Notes', 
      href: '/tools/notes', 
      icon: <FileText className="h-5 w-5" />, 
      enabled: true,
      description: 'Fast note-taking for sessions'
    },
    { 
      id: 'converter', 
      name: 'File Converter', 
      href: '/tools/converter', 
      icon: <ArrowRight className="h-5 w-5" />, 
      enabled: true,
      description: 'Convert between audio formats'
    },
    { 
      id: 'effects', 
      name: 'Audio Effects', 
      href: '/tools/effects', 
      icon: <Wrench className="h-5 w-5" />, 
      enabled: false,
      description: 'Apply common audio effects'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      href: '/tools/analytics', 
      icon: <BarChart2 className="h-5 w-5" />, 
      enabled: false,
      description: 'Track project statistics'
    },
    { 
      id: 'recorder', 
      name: 'Voice Recorder', 
      href: '/tools/recorder', 
      icon: <Mic2 className="h-5 w-5" />, 
      enabled: false,
      description: 'Quick audio capture'
    },
    { 
      id: 'eq', 
      name: 'Equalizer', 
      href: '/tools/eq', 
      icon: <Sliders className="h-5 w-5" />, 
      enabled: false,
      description: 'Basic EQ adjustment tool'
    },
    { 
      id: 'export', 
      name: 'Batch Export', 
      href: '/tools/export', 
      icon: <Upload className="h-5 w-5" />, 
      enabled: false,
      description: 'Export multiple files at once'
    },
    { 
      id: 'download', 
      name: 'File Downloader', 
      href: '/tools/download', 
      icon: <Download className="h-5 w-5" />, 
      enabled: false,
      description: 'Download resources from web'
    },
    { 
      id: 'snippets', 
      name: 'Code Snippets', 
      href: '/tools/snippets', 
      icon: <Code className="h-5 w-5" />, 
      enabled: false,
      description: 'Save and reuse code blocks'
    },
    { 
      id: 'schedule', 
      name: 'Scheduler', 
      href: '/tools/schedule', 
      icon: <Calendar className="h-5 w-5" />, 
      enabled: false,
      description: 'Plan your production schedule'
    }
  ];

  const [tools, setTools] = useLocalStorage<Tool[]>('dashboard-tools', initialTools);
  const [isEditing, setIsEditing] = useState(false);

  const toggleTool = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  const enabledTools = tools.filter(tool => tool.enabled);

  return (
    <div className="w-full">
      {isEditing ? (
        <div className="w-full">
          <div className="overflow-auto max-h-[400px] mb-3">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 font-medium text-muted-foreground">Tool</th>
                  <th className="text-left py-1.5 font-medium text-muted-foreground hidden md:table-cell">Description</th>
                  <th className="text-right py-1.5 font-medium text-muted-foreground w-14">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id} className="border-b border-border/50 last:border-0">
                    <td className="py-1.5 align-middle">
                      <div className="flex items-center gap-1.5">
                        {React.cloneElement(tool.icon as React.ReactElement, { 
                          className: cn("h-3.5 w-3.5", tool.enabled ? "text-primary" : "text-muted-foreground")
                        })}
                        <span className={cn(tool.enabled ? "font-medium" : "text-muted-foreground")}>
                          {tool.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 text-muted-foreground hidden md:table-cell">
                      {tool.description}
                    </td>
                    <td className="py-1.5 text-right">
                      <button
                        type="button"
                        className={`relative inline-flex h-5 w-9 items-center rounded-full ${tool.enabled ? 'bg-primary' : 'bg-muted'}`}
                        onClick={() => toggleTool(tool.id)}
                      >
                        <span className="sr-only">Toggle {tool.name}</span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${tool.enabled ? 'translate-x-4' : 'translate-x-1'}`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(false)}
              className="text-xs h-6 px-2"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <>
          {enabledTools.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
              {enabledTools.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={tool.href}
                  className="flex items-center py-1 text-xs transition-colors hover:bg-muted/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary group"
                >
                  {React.cloneElement(tool.icon as React.ReactElement, { 
                    className: "h-3.5 w-3.5 text-primary shrink-0"
                  })}
                  <div className="ml-1.5 flex-1 min-w-0">
                    <span className="font-medium block truncate">{tool.name}</span>
                  </div>
                  <ArrowRight className="h-2.5 w-2.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground text-xs">
              <p>No tools enabled. Click Customize to add tools.</p>
            </div>
          )}
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="w-full text-xs h-6 flex items-center justify-center"
            >
              <Settings className="h-3 w-3 mr-1.5" />
              Customize Tools
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 