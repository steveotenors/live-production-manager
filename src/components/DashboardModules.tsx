'use client';

import { useState } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult, 
  DroppableProvided, 
  DraggableProvided, 
  DraggableStateSnapshot 
} from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Calendar, 
  CheckSquare, 
  Users, 
  Settings, 
  BarChart, 
  MessageSquare,
  Grip,
  PlusCircle,
  X
} from 'lucide-react';

type ModuleType = 'files' | 'tasks' | 'schedule' | 'team' | 'notes' | 'analytics';

interface ModuleItem {
  id: string;
  type: ModuleType;
  title: string;
  description?: string;
  enabled: boolean;
}

// Define module types with their icons
const moduleIcons: Record<ModuleType, React.ReactNode> = {
  files: <FileText className="h-5 w-5" />,
  tasks: <CheckSquare className="h-5 w-5" />,
  schedule: <Calendar className="h-5 w-5" />,
  team: <Users className="h-5 w-5" />,
  notes: <MessageSquare className="h-5 w-5" />,
  analytics: <BarChart className="h-5 w-5" />,
};

// Module types with display names
const moduleTypes: Record<ModuleType, string> = {
  files: 'Files',
  tasks: 'Tasks',
  schedule: 'Schedule',
  team: 'Team',
  notes: 'Notes',
  analytics: 'Analytics',
};

// Sample initial modules
const initialModules: ModuleItem[] = [
  { id: 'tasks-module', type: 'tasks', title: 'Tasks', enabled: true },
  { id: 'schedule-module', type: 'schedule', title: 'Upcoming Events', enabled: true },
];

// Available modules to add
const availableModules: ModuleItem[] = [
  { id: 'files-module', type: 'files', title: 'Files', description: 'Access your files', enabled: false },
  { id: 'notes-module', type: 'notes', title: 'Notes', description: 'View recent notes', enabled: false },
  { id: 'team-module', type: 'team', title: 'Team', description: 'Manage your team', enabled: false },
  { id: 'analytics-module', type: 'analytics', title: 'Analytics', description: 'View performance metrics', enabled: false },
];

export function DashboardModules() {
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // Function to handle drag end
  const onDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    // Reorder the modules
    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setModules(items);
  };
  
  // Add a module to the dashboard
  const addModule = (moduleType: ModuleType) => {
    // Find the module template in available modules
    const moduleToAdd = availableModules.find(mod => mod.type === moduleType);
    
    if (!moduleToAdd) return;
    
    // Create a new instance of the module
    const newModule: ModuleItem = {
      ...moduleToAdd,
      id: `${moduleType}-${Math.random().toString(36).substr(2, 9)}`,
      enabled: true,
    };
    
    setModules([...modules, newModule]);
  };
  
  // Remove a module from the dashboard
  const removeModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };
  
  // Toggle customization mode
  const toggleCustomization = () => {
    setIsCustomizing(!isCustomizing);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Your Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Customize your workspace with the modules you need
          </p>
        </div>
        <Button
          variant={isCustomizing ? "default" : "outline"}
          onClick={toggleCustomization}
          size="sm"
        >
          {isCustomizing ? "Save Layout" : "Customize"}
        </Button>
      </div>
      
      {isCustomizing && (
        <Card className="border border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-md">Add Modules</CardTitle>
            <CardDescription>
              Drag and drop to rearrange or add new modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableModules
                .filter(module => !modules.some(m => m.type === module.type))
                .map((module) => (
                  <div 
                    key={module.id}
                    className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => addModule(module.type)}
                  >
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      {moduleIcons[module.type]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{module.title}</h3>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                    <PlusCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard-modules">
          {(provided: DroppableProvided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {modules.map((module, index) => (
                <Draggable
                  key={module.id}
                  draggableId={module.id}
                  index={index}
                  isDragDisabled={!isCustomizing}
                >
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "transition-shadow duration-200",
                        snapshot.isDragging ? "shadow-lg" : "",
                        isCustomizing ? "border border-dashed rounded-lg" : ""
                      )}
                    >
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isCustomizing && (
                                <div {...provided.dragHandleProps} className="cursor-grab">
                                  <Grip className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                                  {moduleIcons[module.type]}
                                </div>
                                <CardTitle className="text-md">{module.title}</CardTitle>
                              </div>
                            </div>
                            
                            {isCustomizing && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeModule(module.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-32 flex items-center justify-center border rounded-md bg-muted/30">
                            <p className="text-muted-foreground">
                              {moduleTypes[module.type]} module placeholder
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {/* Empty state when no modules are added */}
              {modules.length === 0 && (
                <div className="border border-dashed rounded-lg p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <PlusCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Add Your First Module</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Customize your dashboard with the modules you use most
                  </p>
                  <Button onClick={() => setIsCustomizing(true)}>
                    Add Module
                  </Button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {/* Note about future functionality */}
      {isCustomizing && (
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            Module settings and additional customization options will be available in a future update.
          </div>
        </div>
      )}
    </div>
  );
} 