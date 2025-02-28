'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  Trash, 
  AlertTriangle, 
  Archive, 
  ArchiveRestore,
  CheckCircle
} from 'lucide-react';
import { Project } from '@/types/database';

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    status: 'active',
    visibility: 'private'
  });

  useEffect(() => {
    if (!projectId) return;
    loadProjectDetails();
  }, [projectId]);
  
  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      
      // First check if user is authenticated
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      if (userError) throw userError;
      
      if (!userData?.user) {
        router.push('/auth/signin');
        return;
      }
      
      // Check if user has role in this project
      // Use type assertion to bypass TypeScript constraints
      const { data: memberData, error: memberError } = await supabaseClient
        .from('project_members' as any)
        .select('role')
        .eq('project_id', projectId)
        .eq('user_id', userData.user.id)
        .single();
      
      if (memberError && memberError.code !== 'PGRST116') {
        throw memberError;
      }
      
      // Get project details
      const { data: projectData, error: projectError } = await supabaseClient
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (projectError) throw projectError;
      
      // Check if user is a member or the project owner
      const isTeamMember = !!memberData;
      const isOwner = memberData && (memberData as any).role === 'owner';
      
      if (!isTeamMember) {
        setError('You do not have permission to edit this project.');
        router.push(`/projects/${projectId}`);
        return;
      }
      
      setProject(projectData as Project);
      
      // Initialize form with project data using type assertion
      // This ensures we can access properties from our database.ts types
      const typedProject = projectData as unknown as Project;
      setProjectForm({
        name: typedProject.name || '',
        description: typedProject.description || '',
        status: typedProject.status || 'active',
        visibility: typedProject.visibility || 'private'
      });
      
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!projectForm.name.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Type assertion to let us update with our expected schema
      const updateData = {
        name: projectForm.name.trim(),
        description: projectForm.description.trim() || null,
        status: projectForm.status,
        visibility: projectForm.visibility
      } as any;
      
      const { error } = await supabaseClient
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Project settings updated successfully.',
      });
      
      // Refresh project details
      await loadProjectDetails();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteProject = async () => {
    try {
      // First archive the project (as a soft delete)
      // Use type assertion for update
      const { error: updateError } = await supabaseClient
        .from('projects')
        .update({ status: 'archived' } as any)
        .eq('id', projectId);
      
      if (updateError) {
        throw updateError;
      }
      
      // In a production app, you might want to:
      // 1. Schedule hard deletion after a retention period
      // 2. Mark related data as archived
      // 3. Clean up storage files associated with the project
      
      toast({
        title: 'Project Archived',
        description: 'The project has been archived and will be inaccessible to team members.',
      });
      
      // Redirect to dashboard
      router.push('/');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };
  
  const canEditProject = userRole === 'owner' || userRole === 'musical_director';
  const canDeleteProject = userRole === 'owner';
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Project Settings</h2>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full max-w-sm" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Manage your project details and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  disabled={!canEditProject}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  disabled={!canEditProject}
                  placeholder="Describe the purpose of this project"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={projectForm.status}
                    onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}
                    disabled={!canEditProject}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="visibility" className="text-sm font-medium">
                    Visibility
                  </label>
                  <Select
                    value={projectForm.visibility}
                    onValueChange={(value) => setProjectForm({ ...projectForm, visibility: value })}
                    disabled={!canEditProject}
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Team Only)</SelectItem>
                      <SelectItem value="shared">Shared (With Link)</SelectItem>
                      <SelectItem value="public">Public (Coming Soon)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            {canEditProject && (
              <CardFooter>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="relative"
                >
                  {saving ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-primary">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                      </div>
                      <span className="opacity-0">Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Danger Zone */}
          {canDeleteProject && (
            <Card className="border-red-200">
              <CardHeader className="text-red-600">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-red-600/80">
                  Destructive actions for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-red-200 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-medium text-red-600">Delete Project</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This action cannot be undone. All data will be permanently deleted.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="mt-3 sm:mt-0"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Project Status Actions */}
          {canEditProject && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common project status changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectForm.status !== 'archived' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                      <div>
                        <h3 className="font-medium">Archive Project</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hide the project from active views without deleting data
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-3 sm:mt-0"
                        onClick={() => {
                          setProjectForm({ ...projectForm, status: 'archived' });
                          setTimeout(() => handleSaveChanges(), 100);
                        }}
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  )}
                  
                  {projectForm.status === 'archived' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                      <div>
                        <h3 className="font-medium">Restore Project</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Restore this project to active status
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-3 sm:mt-0"
                        onClick={() => {
                          setProjectForm({ ...projectForm, status: 'active' });
                          setTimeout(() => handleSaveChanges(), 100);
                        }}
                      >
                        <ArchiveRestore className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                  )}
                  
                  {projectForm.status !== 'completed' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-medium">Mark as Completed</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mark this project as completed and move to historical record
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-3 sm:mt-0"
                        onClick={() => {
                          setProjectForm({ ...projectForm, status: 'completed' });
                          setTimeout(() => handleSaveChanges(), 100);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteProject}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Toaster />
    </div>
  );
} 