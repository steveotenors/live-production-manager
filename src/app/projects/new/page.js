'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    visibility: 'private',
    status: 'active'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  
  const handleSelectChange = (name, value) => {
    setProjectData({ ...projectData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError) throw userError;
      
      if (!userData?.user) {
        router.push('/auth/signin');
        return;
      }
      
      // Insert new project
      const { data, error } = await supabaseClient
        .from('projects')
        .insert({
          name: projectData.name.trim(),
          description: projectData.description.trim() || null,
          status: projectData.status,
          visibility: projectData.visibility,
          created_by: userData.user.id
        })
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Project created but no data returned');
      }
      
      // Add the creator as an owner in the project_members table
      const projectId = data[0].id;
      const { error: memberError } = await supabaseClient
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userData.user.id,
          role: 'owner',
          joined_at: new Date().toISOString()
        });
      
      if (memberError) {
        console.error('Error adding owner to project_members:', memberError);
        // Continue anyway since the project was created
      }
      
      toast({
        title: 'Success',
        description: 'Project created successfully!'
      });
      
      // Navigate to the new project
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: `Failed to create project: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Create New Project</h1>
        </div>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter the information for your new project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                placeholder="Enter project description (optional)"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="visibility" className="text-sm font-medium">
                  Visibility
                </label>
                <Select
                  value={projectData.visibility}
                  onValueChange={(value) => handleSelectChange('visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Team Only)</SelectItem>
                    <SelectItem value="shared">Shared (With Link)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={projectData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="relative"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Toaster />
    </div>
  );
} 