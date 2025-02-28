'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Mail,
  Shield,
  UserCircle
} from 'lucide-react';
import { TeamMember } from '@/types/database';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  const router = useRouter();
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({
    email: '',
    role: 'viewer'
  });
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    fetchTeamMembers();
  }, [projectId]);
  
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      if (userError) throw userError;
      
      if (!userData.user) {
        router.push('/auth/signin');
        return;
      }
      
      // Log for debugging
      console.log('Current user:', userData.user.id);
      
      // First check if the user has access to this project
      const { data: memberData, error: memberError } = await supabaseClient
        .from('project_members')
        .select('role')
        .eq('project_id', projectId as any)
        .eq('user_id', userData.user.id)
        .single();
      
      console.log('Member check result:', { memberData, memberError });
      
      if (memberError && memberError.code !== 'PGRST116') {
        console.error('Error checking member access:', memberError);
        throw memberError;
      }
      
      if (memberData) {
        // User is a member, set their role
        setUserRole(memberData.role);
      } else {
        // If user is not a direct member, check if they own the project
        const { data: projectData, error: projectError } = await supabaseClient
          .from('projects')
          .select('created_by')
          .eq('id', projectId)
          .single();
          
        console.log('Project check result:', { projectData, projectError });
        
        if (projectError) {
          console.error('Error checking project ownership:', projectError);
          throw projectError;
        }
        
        // If user created the project, they have owner access
        if (projectData.created_by === userData.user.id) {
          setUserRole('owner');
        } else {
          setError('You do not have access to this project');
          setLoading(false);
          return;
        }
      }
      
      // Now fetch all team members
      const { data: teamData, error: teamError } = await supabaseClient
        .from('project_members')
        .select('*')
        .eq('project_id', projectId as any);
        
      console.log('Team members query result:', { count: teamData?.length, teamError });
      
      if (teamError) {
        console.error('Error fetching team members:', teamError);
        throw teamError;
      }
      
      if (teamData && teamData.length > 0) {
        // Create minimal team member records with the data we have
        const transformedMembers = teamData.map((member: any) => {
          // Check if this is the current user
          const isCurrentUser = member.user_id === userData.user.id;
          
          return {
            user_id: member.user_id,
            role: member.role,
            // Use current user's info if available, otherwise use placeholder
            name: isCurrentUser 
              ? (userData.user.user_metadata?.name || userData.user.email || 'Current User')
              : `Team Member (${member.user_id.substring(0, 6)})`,
            email: isCurrentUser
              ? (userData.user.email || 'No Email')
              : 'Email not available',
            avatar_url: isCurrentUser
              ? (userData.user.user_metadata?.avatar_url || undefined)
              : undefined,
            created_at: member.created_at,
            project_id: member.project_id
          };
        });
        
        console.log('Transformed team members:', transformedMembers.length);
        setMembers(transformedMembers as TeamMember[]);
      } else {
        console.log('No team members found');
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError(`Failed to load team members: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        title: 'Error',
        description: 'Failed to load team members. Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInvite = async () => {
    if (!newInvite.email.trim() || !newInvite.role) {
      toast({
        title: 'Error',
        description: 'Please enter an email and select a role',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSendingInvite(true);
      
      // This is a placeholder for future invite functionality
      // In a real implementation, you would:
      // 1. Check if the user exists in your system
      // 2. If yes, add them directly to project_members
      // 3. If no, send them an invitation email with a signup link
      
      toast({
        title: 'Feature Coming Soon',
        description: 'Team invitations will be implemented in a future update.',
      });
      
      // Reset form for now
      setNewInvite({
        email: '',
        role: 'viewer'
      });
      setIsInviteDialogOpen(false);
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingInvite(false);
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-purple-600">Owner</Badge>;
      case 'editor':
        return <Badge className="bg-blue-600">Editor</Badge>;
      case 'viewer':
        return <Badge className="bg-gray-600">Viewer</Badge>;
      case 'musician':
        return <Badge className="bg-green-600">Musician</Badge>;
      case 'musical_director':
        return <Badge className="bg-amber-600">Musical Director</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  const canManageTeam = userRole === 'owner' || userRole === 'musical_director';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Team Members</h2>
        {canManageTeam && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading team members...</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Access</CardTitle>
              <CardDescription>
                People with access to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No team members found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.user_id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <UserCircle className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getRoleBadge(member.role)}
                          </div>
                        </div>
                      </div>
                      
                      {canManageTeam && member.role !== 'owner' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Role descriptions card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Understanding Roles</CardTitle>
              <CardDescription>
                Different roles have different permissions in the project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 text-purple-600" />
                  <div>
                    <p className="font-medium">Owner</p>
                    <p className="text-sm text-muted-foreground">
                      Can manage all aspects of the project including deleting it and managing other members
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 text-amber-600" />
                  <div>
                    <p className="font-medium">Musical Director</p>
                    <p className="text-sm text-muted-foreground">
                      Can manage content, tasks, and team members but cannot delete the project
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-medium">Editor</p>
                    <p className="text-sm text-muted-foreground">
                      Can add and edit content but cannot manage team members
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 text-green-600" />
                  <div>
                    <p className="font-medium">Musician</p>
                    <p className="text-sm text-muted-foreground">
                      Can view and comment on content, and use practice tools
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 mt-0.5 text-gray-600" />
                  <div>
                    <p className="font-medium">Viewer</p>
                    <p className="text-sm text-muted-foreground">
                      Can only view content, cannot make changes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newInvite.email}
                onChange={(e) => setNewInvite({...newInvite, email: e.target.value})}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role <span className="text-red-500">*</span>
              </label>
              <Select
                value={newInvite.role}
                onValueChange={(value) => setNewInvite({...newInvite, role: value})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="musician">Musician</SelectItem>
                  {userRole === 'owner' && (
                    <SelectItem value="musical_director">Musical Director</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
              disabled={isSendingInvite}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInvite}
              disabled={!newInvite.email.trim() || !newInvite.role || isSendingInvite}
              className="relative"
            >
              {isSendingInvite ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-primary">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  </div>
                  <span className="opacity-0">Send Invitation</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
} 