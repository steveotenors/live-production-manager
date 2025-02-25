// src/app/project/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { NewPracticeSession } from '@/components/NewPracticeSession';
import { ArrowLeft, Calendar, FileText, Play } from 'lucide-react';
import Link from 'next/link';
import type { Database } from '@/types/database.types';
import { Setlist } from '@/components/Setlist';
import { ProjectTodos } from '@/components/ProjectTodos';

type Project = Database['public']['Tables']['projects']['Row'];
type PracticeSession = Database['public']['Tables']['practice_sessions']['Row'];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching project:', error.message);
        } else {
          console.error('Unknown error:', error);
        }
      }
    };

    const fetchPracticeSessions = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('practice_sessions')
          .select('*')
          .eq('project_id', params.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPracticeSessions(data || []);
      } catch (error) {
        console.error('Error fetching practice sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
    fetchPracticeSessions();
  }, [params.id, refreshCount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Project Not Found</h1>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-foreground">The requested project could not be found.</p>
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
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <Button asChild variant="outline">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.composer_arranger && (
                  <div>
                    <p className="text-sm text-muted-foreground">Composer/Arranger</p>
                    <p className="text-foreground">{project.composer_arranger}</p>
                  </div>
                )}
                {project.piece_name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Piece</p>
                    <p className="text-foreground">{project.piece_name}</p>
                  </div>
                )}
                {project.version_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="text-foreground">{project.version_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area - takes up 3/4 of the width on larger screens */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="files" className="space-y-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="files" className="data-[state=active]:bg-background">
                <FileText className="h-4 w-4 mr-2" /> Files
              </TabsTrigger>
              <TabsTrigger value="practice" className="data-[state=active]:bg-background">
                <Play className="h-4 w-4 mr-2" /> Practice Sessions
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-background">
                <Calendar className="h-4 w-4 mr-2" /> Schedule
              </TabsTrigger>
            </TabsList>

        //</Tabs><Tabs defaultValue="files" className="space-y-4">
          //<TabsList className="bg-muted">
            //<TabsTrigger value="files" className="data-[state=active]:bg-background">
              //<FileText className="h-4 w-4 mr-2" /> Files
            //</TabsTrigger>
            //<TabsTrigger value="practice" className="data-[state=active]:bg-background">
              //<Play className="h-4 w-4 mr-2" /> Practice Sessions
            //</TabsTrigger>
            //<TabsTrigger value="schedule" className="data-[state=active]:bg-background">
              //<Calendar className="h-4 w-4 mr-2" /> Schedule
            //</TabsTrigger>
          //</TabsList>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <FileUpload 
                    projectId={params.id} 
                    onUploadComplete={() => setRefreshCount(prev => prev + 1)} 
                  />
                </div>
                <FileList 
                  projectId={params.id} 
                  onFileDeleted={() => setRefreshCount(prev => prev + 1)} 
                  refreshTrigger={refreshCount} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Practice Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <NewPracticeSession 
                    projectId={params.id} 
                    onSessionCreated={() => setRefreshCount(prev => prev + 1)} 
                  />
                </div>

                {practiceSessions.length === 0 ? (
                  <p className="text-muted-foreground">No practice sessions yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {practiceSessions.map((session) => (
                      <Link href={`/practice-session/${session.id}`} key={session.id}>
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <h3 className="font-semibold text-foreground mb-2">{session.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(session.created_at).toLocaleDateString()}
                            </p>
                            {session.metadata && typeof session.metadata === 'object' && (
                              <div className="mt-2 text-sm">
                                <p className="text-muted-foreground">
                                  Tempo: {(session.metadata as any).tempo || 'N/A'} BPM
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Schedule feature coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
        {/* Sidebar - takes up 1/4 of the width on larger screens */}
        <div className="lg:col-span-1 space-y-6">
          <Setlist projectId={params.id} />
          <ProjectTodos projectId={params.id} />
        </div>
      </div>
    </div>
  </div>
);