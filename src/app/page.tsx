'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Folder, Music } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { NewProjectDialog } from '@/components/NewProjectDialog';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { NewPracticeSession } from '@/components/NewPracticeSession';

interface Project {
  id: string;
  name: string;
  created_at: string;
}

interface PracticeSession {
  id: string;
  name: string;
  tempo: number;
  time_signature: string;
  created_at: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPracticeSessions = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPracticeSessions(data || []);
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedProject) {
      fetchPracticeSessions(selectedProject.id);
    }
  }, [selectedProject, refreshTrigger]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {selectedProject ? (
          // Project Detail View
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedProject(null)}
                >
                  ← Back
                </Button>
                <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
              </div>
              <div className="flex gap-2">
                <FileUpload 
                  projectId={selectedProject.id} 
                  onUploadComplete={handleRefresh}
                />
                <NewPracticeSession
                  projectId={selectedProject.id}
                  onSessionCreated={handleRefresh}
                />
              </div>
            </div>

            {/* Practice Sessions Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Practice Sessions</h2>
              {practiceSessions.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <Music className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No practice sessions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new practice session.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {practiceSessions.map((session) => (
                    <Card key={session.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{session.name}</h3>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                window.location.href = `/practice-session/${session.id}`;
                              }}
                            >
                              Open Session
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!confirm('Are you sure you want to delete this practice session?')) return;
                                
                                try {
                                  const { error } = await supabase
                                    .from('practice_sessions')
                                    .delete()
                                    .eq('id', session.id);
                                  
                                  if (error) throw error;
                                  handleRefresh();
                                } catch (error) {
                                  console.error('Error deleting practice session:', error);
                                  alert('Error deleting practice session');
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Files Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Files</h2>
              <FileList 
                projectId={selectedProject.id} 
                onFileDeleted={handleRefresh}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        ) : (
          // Projects List View
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Projects</h1>
              <NewProjectDialog onProjectCreated={handleRefresh} />
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">{project.name}</h2>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">
                          Created {new Date(project.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleProjectClick(project)}
                          >
                            <Folder className="mr-2 h-4 w-4" /> Open
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('Are you sure you want to delete this project?')) return;
                              
                              try {
                                const { error } = await supabase
                                  .from('projects')
                                  .delete()
                                  .eq('id', project.id);
                                
                                if (error) throw error;
                                handleRefresh();
                              } catch (error) {
                                console.error('Error deleting project:', error);
                                alert('Error deleting project');
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}