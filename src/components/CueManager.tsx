"use client";

import React, { useState, useEffect } from 'react';
import { 
  ListMusic, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Clock,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  FilePlus,
  Download,
  Upload,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Cue {
  id: string;
  number: string;
  name: string;
  description: string;
  duration: string;
  type: 'music' | 'lighting' | 'sound' | 'stage' | 'combined';
  status: 'pending' | 'active' | 'completed' | 'skipped';
  section?: string;
  act?: string;
  scene?: string;
  notes?: string;
  dependencies?: string[];
  triggerTime?: string;
}

interface CueManagerProps {
  className?: string;
  onCueAction?: (action: 'play' | 'skip' | 'reset', cueId: string) => void;
  onCueCreate?: (cue: Omit<Cue, 'id' | 'status'>) => void;
  onCueUpdate?: (id: string, cue: Partial<Cue>) => void;
  onCueDelete?: (id: string) => void;
  initialCues?: Cue[];
}

export function CueManager({
  className,
  onCueAction,
  onCueCreate,
  onCueUpdate,
  onCueDelete,
  initialCues = []
}: CueManagerProps) {
  // Demo cues data
  const demoCues: Cue[] = [
    {
      id: 'cue-1',
      number: '1A',
      name: 'Overture Begin',
      description: 'Orchestra begins overture, house lights dim',
      duration: '2:45',
      type: 'music',
      status: 'completed',
      act: 'Act 1',
      scene: 'Preshow',
      notes: 'Ensure conductor is ready before triggering'
    },
    {
      id: 'cue-2',
      number: '1B',
      name: 'Chandelier Reveal',
      description: 'Lighting effect for chandelier reveal',
      duration: '0:30',
      type: 'lighting',
      status: 'completed',
      act: 'Act 1',
      scene: 'Preshow',
      dependencies: ['cue-1']
    },
    {
      id: 'cue-3',
      number: '2A',
      name: 'Auction Scene',
      description: 'Start auction scene music and lighting',
      duration: '3:15',
      type: 'combined',
      status: 'active',
      act: 'Act 1',
      scene: 'Scene 1',
      dependencies: ['cue-2']
    },
    {
      id: 'cue-4',
      number: '2B',
      name: 'Flashback Transition',
      description: 'Transition to opera house flashback',
      duration: '0:45',
      type: 'combined',
      status: 'pending',
      act: 'Act 1',
      scene: 'Scene 1',
      dependencies: ['cue-3']
    },
    {
      id: 'cue-5',
      number: '3A',
      name: 'Think of Me Begin',
      description: 'Carlotta begins aria, spotlight follows',
      duration: '1:30',
      type: 'music',
      status: 'pending',
      act: 'Act 1',
      scene: 'Scene 2',
      dependencies: ['cue-4']
    },
    {
      id: 'cue-6',
      number: '3B',
      name: 'Backdrop Falls',
      description: 'Drop backdrop with thunder effect',
      duration: '0:15',
      type: 'stage',
      status: 'pending',
      act: 'Act 1',
      scene: 'Scene 2',
      notes: 'Safety check required before cue'
    },
    {
      id: 'cue-7',
      number: '4A',
      name: 'Christine Takes Stage',
      description: 'Transition to Christine, lighting change',
      duration: '0:20',
      type: 'combined',
      status: 'pending',
      act: 'Act 1',
      scene: 'Scene 2',
      dependencies: ['cue-6']
    }
  ];
  
  // State for cues and filtering
  const [cues, setCues] = useState<Cue[]>(initialCues.length > 0 ? initialCues : demoCues);
  const [filteredCues, setFilteredCues] = useState<Cue[]>(cues);
  const [activeCueId, setActiveCueId] = useState<string | null>('cue-3'); // Set to the active cue
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Cue['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Cue['type'] | 'all'>('all');
  const [editingCue, setEditingCue] = useState<Cue | null>(null);
  const [isAddingCue, setIsAddingCue] = useState(false);
  const [newCue, setNewCue] = useState<Omit<Cue, 'id' | 'status'>>({
    number: '',
    name: '',
    description: '',
    duration: '',
    type: 'music',
    act: 'Act 1',
    scene: 'Scene 1'
  });
  
  // Update filtered cues when filters or search changes
  useEffect(() => {
    let result = [...cues];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(cue => 
        cue.number.toLowerCase().includes(query) || 
        cue.name.toLowerCase().includes(query) || 
        cue.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(cue => cue.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(cue => cue.type === typeFilter);
    }
    
    setFilteredCues(result);
  }, [cues, searchQuery, statusFilter, typeFilter]);
  
  // Handle cue actions (play, skip, reset)
  const handleCueAction = (action: 'play' | 'skip' | 'reset', cueId: string) => {
    if (action === 'play') {
      // Set the current cue to active and previous to completed
      setCues(prevCues => prevCues.map(cue => {
        if (cue.id === cueId) {
          setActiveCueId(cueId);
          return { ...cue, status: 'active' };
        }
        if (cue.id === activeCueId) {
          return { ...cue, status: 'completed' };
        }
        return cue;
      }));
    } else if (action === 'skip') {
      // Mark the cue as skipped
      setCues(prevCues => prevCues.map(cue => 
        cue.id === cueId ? { ...cue, status: 'skipped' } : cue
      ));
    } else if (action === 'reset') {
      // Reset all cues to pending except the active one
      setCues(prevCues => prevCues.map(cue => {
        if (cue.id === activeCueId) return cue;
        return { ...cue, status: 'pending' };
      }));
    }
    
    // Callback for external handling
    if (onCueAction) {
      onCueAction(action, cueId);
    }
  };
  
  // Handle creating a new cue
  const handleCreateCue = () => {
    const cueId = `cue-${Date.now()}`;
    const newCueWithId: Cue = {
      id: cueId,
      ...newCue,
      status: 'pending'
    };
    
    setCues(prevCues => [newCueWithId, ...prevCues]);
    setIsAddingCue(false);
    
    // Reset the form
    setNewCue({
      number: '',
      name: '',
      description: '',
      duration: '',
      type: 'music',
      act: 'Act 1',
      scene: 'Scene 1'
    });
    
    // Callback for external handling
    if (onCueCreate) {
      onCueCreate(newCue);
    }
  };
  
  // Handle updating a cue
  const handleUpdateCue = () => {
    if (!editingCue) return;
    
    setCues(prevCues => prevCues.map(cue => 
      cue.id === editingCue.id ? { ...editingCue } : cue
    ));
    
    setEditingCue(null);
    
    // Callback for external handling
    if (onCueUpdate) {
      onCueUpdate(editingCue.id, editingCue);
    }
  };
  
  // Handle deleting a cue
  const handleDeleteCue = (cueId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this cue?');
    
    if (confirmDelete) {
      setCues(prevCues => prevCues.filter(cue => cue.id !== cueId));
      
      // Callback for external handling
      if (onCueDelete) {
        onCueDelete(cueId);
      }
    }
  };
  
  // Get badge color based on cue type
  const getCueTypeColor = (type: Cue['type']) => {
    switch (type) {
      case 'music': return 'bg-blue-500/20 text-blue-500';
      case 'lighting': return 'bg-amber-500/20 text-amber-500';
      case 'sound': return 'bg-purple-500/20 text-purple-500';
      case 'stage': return 'bg-green-500/20 text-green-500';
      case 'combined': return 'bg-pink-500/20 text-pink-500';
    }
  };
  
  // Get badge color based on cue status
  const getCueStatusColor = (status: Cue['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-400/20 text-gray-400';
      case 'active': return 'bg-primary/20 text-primary';
      case 'completed': return 'bg-green-500/20 text-green-500';
      case 'skipped': return 'bg-red-500/20 text-red-500';
    }
  };
  
  // Find the next cue after the active one
  const nextCue = activeCueId 
    ? cues.find(cue => 
        cue.status === 'pending' && 
        cues.findIndex(c => c.id === cue.id) > 
        cues.findIndex(c => c.id === activeCueId)
      )
    : cues.find(cue => cue.status === 'pending');
  
  return (
    <Card className={`glass obsidian-reflection shadow-gold-glow ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="premium-gradient-text flex items-center">
            <ListMusic className="mr-2 h-5 w-5" />
            Cue Manager
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9"
              onClick={() => setIsAddingCue(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Cue
            </Button>
            
            <Dialog open={isAddingCue} onOpenChange={setIsAddingCue}>
              <DialogContent className="glass obsidian-reflection max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="premium-gradient-text">Create New Cue</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cueNumber">Cue Number</Label>
                    <Input 
                      id="cueNumber" 
                      value={newCue.number}
                      onChange={(e) => setNewCue({...newCue, number: e.target.value})}
                      className="glass bg-muted/20 border-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cueType">Cue Type</Label>
                    <select
                      id="cueType"
                      value={newCue.type}
                      onChange={(e) => setNewCue({...newCue, type: e.target.value as Cue['type']})}
                      className="w-full h-10 px-3 py-2 rounded bg-muted/20 border border-primary/20 glass"
                    >
                      <option value="music">Music</option>
                      <option value="lighting">Lighting</option>
                      <option value="sound">Sound</option>
                      <option value="stage">Stage</option>
                      <option value="combined">Combined</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="cueName">Cue Name</Label>
                    <Input 
                      id="cueName" 
                      value={newCue.name}
                      onChange={(e) => setNewCue({...newCue, name: e.target.value})}
                      className="glass bg-muted/20 border-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="cueDescription">Description</Label>
                    <textarea 
                      id="cueDescription"
                      value={newCue.description}
                      onChange={(e) => setNewCue({...newCue, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 rounded bg-muted/20 border border-primary/20 glass"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cueDuration">Duration (MM:SS)</Label>
                    <Input 
                      id="cueDuration" 
                      value={newCue.duration}
                      onChange={(e) => setNewCue({...newCue, duration: e.target.value})}
                      placeholder="00:00"
                      className="glass bg-muted/20 border-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cueAct">Act</Label>
                    <Input 
                      id="cueAct" 
                      value={newCue.act || ''}
                      onChange={(e) => setNewCue({...newCue, act: e.target.value})}
                      className="glass bg-muted/20 border-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cueScene">Scene</Label>
                    <Input 
                      id="cueScene" 
                      value={newCue.scene || ''}
                      onChange={(e) => setNewCue({...newCue, scene: e.target.value})}
                      className="glass bg-muted/20 border-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cueNotes">Notes (Optional)</Label>
                    <Input 
                      id="cueNotes" 
                      value={newCue.notes || ''}
                      onChange={(e) => setNewCue({...newCue, notes: e.target.value})}
                      className="glass bg-muted/20 border-primary/20"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingCue(false)}>Cancel</Button>
                  <Button 
                    className="button-premium"
                    onClick={handleCreateCue}
                    disabled={!newCue.number || !newCue.name || !newCue.description}
                  >
                    Create Cue
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={!!editingCue} onOpenChange={(open) => !open && setEditingCue(null)}>
              {editingCue && (
                <DialogContent className="glass obsidian-reflection max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="premium-gradient-text">Edit Cue #{editingCue.number}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="editCueNumber">Cue Number</Label>
                      <Input 
                        id="editCueNumber" 
                        value={editingCue.number}
                        onChange={(e) => setEditingCue({...editingCue, number: e.target.value})}
                        className="glass bg-muted/20 border-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editCueType">Cue Type</Label>
                      <select
                        id="editCueType"
                        value={editingCue.type}
                        onChange={(e) => setEditingCue({...editingCue, type: e.target.value as Cue['type']})}
                        className="w-full h-10 px-3 py-2 rounded bg-muted/20 border border-primary/20 glass"
                      >
                        <option value="music">Music</option>
                        <option value="lighting">Lighting</option>
                        <option value="sound">Sound</option>
                        <option value="stage">Stage</option>
                        <option value="combined">Combined</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="editCueName">Cue Name</Label>
                      <Input 
                        id="editCueName" 
                        value={editingCue.name}
                        onChange={(e) => setEditingCue({...editingCue, name: e.target.value})}
                        className="glass bg-muted/20 border-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="editCueDescription">Description</Label>
                      <textarea 
                        id="editCueDescription"
                        value={editingCue.description}
                        onChange={(e) => setEditingCue({...editingCue, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 rounded bg-muted/20 border border-primary/20 glass"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editCueDuration">Duration (MM:SS)</Label>
                      <Input 
                        id="editCueDuration" 
                        value={editingCue.duration}
                        onChange={(e) => setEditingCue({...editingCue, duration: e.target.value})}
                        placeholder="00:00"
                        className="glass bg-muted/20 border-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editCueStatus">Status</Label>
                      <select
                        id="editCueStatus"
                        value={editingCue.status}
                        onChange={(e) => setEditingCue({...editingCue, status: e.target.value as Cue['status']})}
                        className="w-full h-10 px-3 py-2 rounded bg-muted/20 border border-primary/20 glass"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="skipped">Skipped</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editCueAct">Act</Label>
                      <Input 
                        id="editCueAct" 
                        value={editingCue.act || ''}
                        onChange={(e) => setEditingCue({...editingCue, act: e.target.value})}
                        className="glass bg-muted/20 border-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editCueScene">Scene</Label>
                      <Input 
                        id="editCueScene" 
                        value={editingCue.scene || ''}
                        onChange={(e) => setEditingCue({...editingCue, scene: e.target.value})}
                        className="glass bg-muted/20 border-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="editCueNotes">Notes (Optional)</Label>
                      <Input 
                        id="editCueNotes" 
                        value={editingCue.notes || ''}
                        onChange={(e) => setEditingCue({...editingCue, notes: e.target.value})}
                        className="glass bg-muted/20 border-primary/20"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingCue(null)}>Cancel</Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleDeleteCue(editingCue.id);
                        setEditingCue(null);
                      }}
                      className="mr-auto"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button 
                      className="button-premium"
                      onClick={handleUpdateCue}
                      disabled={!editingCue.number || !editingCue.name || !editingCue.description}
                    >
                      Update Cue
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      {/* Active Cue Section */}
      {activeCueId && (
        <div className="px-6 pb-2">
          <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary px-3 py-1">ACTIVE CUE</Badge>
                <h3 className="text-xl font-semibold premium-gradient-text">
                  {cues.find(c => c.id === activeCueId)?.number} - {cues.find(c => c.id === activeCueId)?.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                  onClick={() => {
                    if (activeCueId) {
                      handleCueAction('skip', activeCueId);
                      setActiveCueId(nextCue?.id || null);
                    }
                  }}
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  onClick={() => {
                    if (activeCueId && nextCue) {
                      handleCueAction('play', nextCue.id);
                    }
                  }}
                  disabled={!nextCue}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Next
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-3 text-sm">
              {cues.find(c => c.id === activeCueId)?.description}
            </p>
            
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Duration: {cues.find(c => c.id === activeCueId)?.duration}</span>
              </div>
              
              {cues.find(c => c.id === activeCueId)?.act && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{cues.find(c => c.id === activeCueId)?.act}</span>
                </div>
              )}
              
              {cues.find(c => c.id === activeCueId)?.scene && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ListMusic className="h-3.5 w-3.5" />
                  <span>{cues.find(c => c.id === activeCueId)?.scene}</span>
                </div>
              )}
              
              <Badge variant="outline" className={`${getCueTypeColor(cues.find(c => c.id === activeCueId)?.type || 'music')}`}>
                {cues.find(c => c.id === activeCueId)?.type}
              </Badge>
            </div>
            
            {cues.find(c => c.id === activeCueId)?.notes && (
              <div className="mt-3 text-sm p-2 bg-primary/5 rounded border border-primary/10">
                <p className="font-medium text-xs text-primary">Notes:</p>
                <p className="text-muted-foreground">
                  {cues.find(c => c.id === activeCueId)?.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Cue List */}
      <div className="px-6 pt-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cues..."
              className="pl-9 glass bg-muted/20 border-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded bg-muted/20 border border-primary/20 text-sm px-3 glass min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="h-10 rounded bg-muted/20 border border-primary/20 text-sm px-3 glass min-w-[120px]"
            >
              <option value="all">All Types</option>
              <option value="music">Music</option>
              <option value="lighting">Lighting</option>
              <option value="sound">Sound</option>
              <option value="stage">Stage</option>
              <option value="combined">Combined</option>
            </select>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Cue List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredCues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ListMusic className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No cues found matching your filters.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
                className="mt-2 text-primary"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filteredCues.map(cue => (
              <div 
                key={cue.id} 
                className={`p-3 rounded-lg border transition-all duration-300 hover:bg-primary/5 ${
                  cue.id === activeCueId 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'border-primary/10 bg-background/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        cue.id === activeCueId ? 'bg-primary text-white' : 'bg-primary/10'
                      }`}
                    >
                      <span className="font-semibold text-sm">{cue.number}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{cue.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{cue.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className={getCueTypeColor(cue.type)}>
                          {cue.type}
                        </Badge>
                        <Badge variant="outline" className={getCueStatusColor(cue.status)}>
                          {cue.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cue.act} {cue.scene && `• ${cue.scene}`}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingCue(cue)}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      
                      {cue.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleCueAction('play', cue.id)}
                        >
                          <Play className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <CardFooter className="flex justify-between border-t border-primary/10 mt-6 py-3">
        <div className="text-xs text-muted-foreground">
          {cues.length} cues total • {cues.filter(c => c.status === 'completed').length} completed
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Upload className="h-3.5 w-3.5 mr-1" />
            Import
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CueManager; 