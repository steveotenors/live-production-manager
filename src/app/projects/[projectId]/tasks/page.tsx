'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  CheckSquare, 
  Square, 
  Clock, 
  Calendar, 
  MoreVertical, 
  Plus,
  User,
  CheckCircle,
  Circle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Task } from '@/types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

interface TaskData {
  id: string;
  title: string;
  description: string;
  status: string;
  due_date?: string | null;
  assigned_to?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  project_id: string;
  assignee_name?: string;
}

export default function TasksPage() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: ''
  });
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  
  useEffect(() => {
    if (!projectId) return;
    loadTasks();
    
    // Set up real-time subscription
    setupRealtimeSubscription();
    
    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, [projectId]);
  
  const setupRealtimeSubscription = async () => {
    // Create a channel for tasks table changes
    const newChannel = supabaseClient
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (insert, update, delete)
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId as any}`
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as TaskData;
            setTasks(prev => [...prev, newTask]);
            toast({
              title: 'New Task',
              description: `Task "${newTask.title}" has been added`
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as TaskData;
            setTasks(prev => 
              prev.map(task => task.id === updatedTask.id ? updatedTask : task)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedTask = payload.old as TaskData;
            setTasks(prev => prev.filter(task => task.id !== deletedTask.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase realtime subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          toast({
            title: 'Real-time updates active',
            description: 'You will see task changes as they happen'
          });
        }
      });
      
    setChannel(newChannel);
  };
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      
      console.log('Loading tasks for project:', projectId);
      
      // First check if project exists to confirm ID format
      const { data: projectData, error: projectError } = await supabaseClient
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error('Error checking project:', projectError.message || projectError);
        toast({
          title: 'Project not found',
          description: 'The project you are trying to access does not exist or you don\'t have permission to view it.',
          variant: 'destructive',
        });
        setTasks([]);
        return;
      }
      
      console.log('Project confirmed:', projectData?.id);
      
      // Use the corrected types after regenerating the TypeScript definitions
      const { data, error } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('project_id', projectId as any);
        
      if (error) {
        console.error('Supabase error loading tasks:', error.message || error);
        toast({
          title: 'Error loading tasks',
          description: `Failed to load tasks: ${error.message || 'Database error'}`,
          variant: 'destructive',
        });
        setTasks([]);
        return;
      }
      
      console.log('Tasks loaded successfully:', data?.length || 0, 'tasks found');
      
      if (data) {
        // Simply transform the data we have without trying to fetch user emails
        const transformedTasks: TaskData[] = data.map((task: any) => ({
          id: task.id,
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'pending',
          due_date: task.due_date,
          assigned_to: task.assigned_to,
          created_by: task.created_by || '',
          created_at: task.created_at,
          updated_at: task.updated_at,
          project_id: projectId,
          // Just use the assigned_to ID as the name for now
          assignee_name: task.assigned_to ? `User ${task.assigned_to.substring(0, 8)}...` : ''
        }));
        
        setTasks(transformedTasks);
      } else {
        console.log('No tasks found, setting empty array');
        setTasks([]);
      }
    } catch (error: any) {
      console.error('Error fetching tasks:', error?.message || error);
      toast({
        title: 'Error',
        description: `Failed to load tasks: ${error?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      // Set tasks to empty array in case of error
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateTask = async () => {
    if (!newTask.title) {
      toast({
        title: 'Error',
        description: 'Please enter a task title.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsCreatingTask(true);
      
      // Get current user
      const { data: userData } = await supabaseClient.auth.getUser();
      
      const newTaskData = {
        title: newTask.title,
        description: newTask.description, 
        status: newTask.status,
        due_date: newTask.due_date,
        project_id: projectId as any, // Use type assertion with the updated TypeScript definitions
        created_by: userData?.user?.id || ''
      };
      
      console.log('Creating new task:', newTaskData);
      
      const { data, error } = await supabaseClient
        .from('tasks')
        .insert(newTaskData)
        .select();
        
      if (error) throw error;
      
      console.log('Task created successfully:', data);
      
      toast({
        title: 'Success',
        description: 'Task created successfully!',
      });
      
      // Close dialog and reset form
      setIsNewTaskDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        due_date: ''
      });
      
      // No need to manually reload tasks since we're using Realtime subscription
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTask(false);
    }
  };
  
  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabaseClient
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // No need to manually update tasks since we have Realtime subscription
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status.',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-5 w-5 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Blocked</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>;
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>
        <Button onClick={() => setIsNewTaskDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No tasks found for this project.</p>
              <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex p-4 items-start gap-3">
                      <div className="pt-0.5 cursor-pointer" onClick={() => {
                        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
                        handleUpdateTaskStatus(task.id, newStatus);
                      }}>
                        {getStatusIcon(task.status || 'pending')}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(task.status || 'pending')}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleUpdateTaskStatus(task.id, 'pending')}
                                >
                                  Mark as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                >
                                  Mark as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                >
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateTaskStatus(task.id, 'blocked')}
                                >
                                  Mark as Blocked
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateTaskStatus(task.id, 'cancelled')}
                                >
                                  Mark as Cancelled
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground mt-2 gap-3">
                          {task.due_date && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" /> 
                              Due {formatDate(task.due_date)}
                            </div>
                          )}
                          {task.assignee_name && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" /> 
                              {task.assignee_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="task-title"
                placeholder="Enter task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="task-description"
                placeholder="Describe the task..."
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="task-status" className="text-sm font-medium">
                Status
              </label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({...newTask, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="task-due-date" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="task-due-date"
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewTaskDialogOpen(false)}
              disabled={isCreatingTask}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={!newTask.title.trim() || isCreatingTask}
              className="relative"
            >
              {isCreatingTask ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-primary">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  </div>
                  <span className="opacity-0">Create Task</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
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