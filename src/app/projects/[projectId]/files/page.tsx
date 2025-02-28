'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import FileManager from './component';
import { RealtimeChannel } from '@supabase/supabase-js';

// Update FilesPage component to accept our props
export default function FilesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Handle special path parameters like "new"
  const isSpecialPath = projectId === 'new';
  
  // Set up a real-time channel for file changes
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  
  useEffect(() => {
    // No need to load anything for special paths
    if (isSpecialPath) {
      setLoading(false);
      return;
    }
    
    async function loadProject() {
      setLoading(true);
      try {
        // Get project details to verify access
        const { data: projectData, error: projectError } = await supabaseClient
          .from('projects')
          .select('id, name, created_by')
          .eq('id', projectId)
          .single();
        
        if (projectError) {
          console.error('Project fetch error:', projectError);
          setError('Project not found or you don\'t have access');
          setLoading(false);
          return;
        }
        
        setProject(projectData);
        setError(null);
      } catch (e) {
        // Detailed error logging
        console.error('Error in Files component:', e);
        setError('An error occurred loading this project');
      } finally {
        setLoading(false);
      }
    }
    
    loadProject();
    
    // Clean up real-time subscription when unmounting
    return () => {
      if (channel) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [projectId, toast, router, isSpecialPath]);
  
  // If still loading, show a skeleton
  if (loading) {
    return <div className="animate-pulse h-screen bg-gray-100/40"></div>;
  }
  
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded bg-red-50 text-red-600">
        {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Files
          {project?.name && (
            <span className="ml-2 text-muted-foreground text-sm font-normal">
              for project <span className="font-medium">{project.name}</span>
            </span>
          )}
        </h1>
      </div>
      
      <FileManager 
        projectId={projectId} 
        basePath={`project-${projectId}`} 
      />
    </div>
  );
} 