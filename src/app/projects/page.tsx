'use client';

// src/app/projects/page.tsx
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Music } from 'lucide-react';
import { NewProjectDialog } from '@/components/NewProjectDialog';
import { PageHeader } from '@/components/ui/page-header';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import type { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient
          .from('projects')
          .select('*');

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [refreshTrigger]);

  function handleProjectCreated() {
    // Increment refresh trigger to reload projects
    setRefreshTrigger(prev => prev + 1);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Projects</h1>
          <Card>
            <CardContent className="p-6">
              <p className="text-foreground">Loading projects...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Projects</h1>
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">Error loading projects: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <Button asChild>
            <Link href="/">
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex justify-end mb-6">
          <NewProjectDialog onProjectCreated={handleProjectCreated} />
        </div>
        
        {!projects || projects.length === 0 ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
              <p className="text-muted-foreground mb-6">Create your first project to get started</p>
              <NewProjectDialog onProjectCreated={handleProjectCreated} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.department && `Department: ${project.department}`}
                      {project.metadata && typeof project.metadata === 'object' && 
                       'piece_name' in project.metadata && 
                       ` • ${project.metadata.piece_name}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {project.metadata && typeof project.metadata === 'object' && 
                       'composer_arranger' in project.metadata && 
                       `By: ${project.metadata.composer_arranger}`}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Created: {new Date(project.created_at || '').toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}