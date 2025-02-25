// src/app/projects/page.tsx
import { getServerSupabaseClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Music } from 'lucide-react';
import { NewProjectDialog } from '@/components/NewProjectDialog';

export default async function ProjectsPage() {
  const supabase = await getServerSupabaseClient();
  
  // Fetch projects and join with users table
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      users:musical_director_id (id, role)
    `);

  // Handle errors
  if (error) {
    console.error('Error fetching projects:', error.message);
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Projects</h1>
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">Error loading projects: {error.message}</p>
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
          <NewProjectDialog onProjectCreated={() => {}} />
        </div>
        
        {!projects || projects.length === 0 ? (
          <Card>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
              <p className="text-muted-foreground mb-6">Create your first project to get started</p>
              <NewProjectDialog onProjectCreated={() => {}} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.department && `Department: ${project.department}`}
                      {project.piece_name && ` • ${project.piece_name}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {project.composer_arranger && `By: ${project.composer_arranger}`}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Created: {new Date(project.created_at).toLocaleDateString()}
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