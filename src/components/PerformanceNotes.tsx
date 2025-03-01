"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Save, 
  Tag, 
  Search, 
  Plus, 
  Trash, 
  Music, 
  Edit, 
  CheckCircle,
  Filter,
  Star,
  Calendar,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved' | 'archived';
  cueReference?: string;
  sectionReference?: string;
}

interface PerformanceNotesProps {
  projectId?: string | number;
  className?: string;
  onSaveNote?: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote?: (id: string, note: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
  initialNotes?: Note[];
}

export function PerformanceNotes({
  projectId,
  className,
  onSaveNote,
  onUpdateNote,
  onDeleteNote,
  initialNotes = []
}: PerformanceNotesProps) {
  // Demo tags for musical notes
  const availableTags = [
    'Tempo', 'Dynamics', 'Intonation', 'Balance', 'Entrances', 
    'Cutoffs', 'Articulation', 'Phrasing', 'Blocking', 'Staging',
    'Lighting', 'Sound', 'Costuming', 'Props', 'Technical'
  ];
  
  // State for notes and form
  const [notes, setNotes] = useState<Note[]>(initialNotes.length > 0 ? initialNotes : [
    {
      id: '1',
      title: 'Crescendo in measure 32',
      content: 'The brass section needs to emphasize the crescendo at measure 32 to build more tension before the climax.',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000),
      tags: ['Dynamics', 'Brass'],
      priority: 'high',
      status: 'active',
      sectionReference: 'Act 1, Scene 3'
    },
    {
      id: '2',
      title: 'Timing issue with stage transition',
      content: 'The transition from the ballroom scene to the garden needs to match the ritardando. Lighting cues should follow conductor.',
      createdAt: new Date(Date.now() - 43200000), // 12 hours ago
      updatedAt: new Date(Date.now() - 43200000),
      tags: ['Tempo', 'Lighting', 'Transitions'],
      priority: 'medium',
      status: 'active',
      cueReference: 'Cue 23B'
    },
    {
      id: '3',
      title: 'Background vocals balance',
      content: 'Background vocals are overpowering lead vocals in the final chorus. Adjust monitor mix and have them sing at mezzo-forte.',
      createdAt: new Date(Date.now() - 21600000), // 6 hours ago
      updatedAt: new Date(Date.now() - 21600000),
      tags: ['Balance', 'Vocals'],
      priority: 'medium',
      status: 'resolved',
      sectionReference: 'Act 2, Finale'
    }
  ]);
  
  const [newNote, setNewNote] = useState<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    content: '',
    tags: [],
    priority: 'medium',
    status: 'active'
  });
  
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Note['status'] | 'all'>('all');
  const [selectedTagInput, setSelectedTagInput] = useState('');
  
  // Handle creating/updating a note
  const handleSaveNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    
    if (editingNoteId) {
      // Update existing note
      const updatedNotes = notes.map(note => 
        note.id === editingNoteId 
          ? { 
              ...note, 
              ...newNote, 
              updatedAt: new Date() 
            } 
          : note
      );
      
      setNotes(updatedNotes);
      
      if (onUpdateNote) {
        onUpdateNote(editingNoteId, newNote);
      }
    } else {
      // Create new note
      const note: Note = {
        id: `note-${Date.now()}`,
        ...newNote,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setNotes([note, ...notes]);
      
      if (onSaveNote) {
        onSaveNote(newNote);
      }
    }
    
    // Reset form
    setNewNote({
      title: '',
      content: '',
      tags: [],
      priority: 'medium',
      status: 'active'
    });
    setEditingNoteId(null);
  };
  
  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    if (onDeleteNote) {
      onDeleteNote(id);
    }
    
    if (editingNoteId === id) {
      setEditingNoteId(null);
      setNewNote({
        title: '',
        content: '',
        tags: [],
        priority: 'medium',
        status: 'active'
      });
    }
  };
  
  // Handle editing a note
  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      priority: note.priority,
      status: note.status,
      cueReference: note.cueReference,
      sectionReference: note.sectionReference
    });
  };
  
  // Handle adding a tag to a note
  const handleAddTag = () => {
    if (!selectedTagInput.trim()) return;
    
    if (!newNote.tags.includes(selectedTagInput)) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, selectedTagInput]
      });
    }
    
    setSelectedTagInput('');
  };
  
  // Handle removing a tag from a note
  const handleRemoveTag = (tag: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(t => t !== tag)
    });
  };
  
  // Filter notes based on search query, tag filter, and status filter
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = tagFilter === null || note.tags.includes(tagFilter);
    const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
    
    return matchesSearch && matchesTag && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get priority badge color
  const getPriorityColor = (priority: Note['priority']) => {
    switch (priority) {
      case 'low': return 'bg-primary/20 text-primary';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'high': return 'bg-destructive/20 text-destructive';
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: Note['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-500';
      case 'resolved': return 'bg-green-500/20 text-green-500';
      case 'archived': return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  return (
    <Card className={`glass obsidian-reflection shadow-gold-glow ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="premium-gradient-text flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Performance Notes
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 px-6">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="add">
            {editingNoteId ? 'Edit Note' : 'Add Note'}
          </TabsTrigger>
        </TabsList>
        
        {/* Notes List Tab */}
        <TabsContent value="notes" className="px-6 py-4 space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  className="pl-9 glass bg-muted/20 border-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={tagFilter || ''}
                  onChange={(e) => setTagFilter(e.target.value || null)}
                  className="h-10 rounded bg-muted/20 border border-primary/20 text-sm px-3 glass min-w-[100px]"
                >
                  <option value="">All Tags</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-10 rounded bg-muted/20 border border-primary/20 text-sm px-3 glass min-w-[100px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
              {tagFilter && <span> • Tag: {tagFilter}</span>}
              {statusFilter !== 'all' && <span> • Status: {statusFilter}</span>}
              {searchQuery && <span> • Search: "{searchQuery}"</span>}
            </div>
          </div>
          
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 mt-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notes found matching your filters.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery('');
                    setTagFilter(null);
                    setStatusFilter('all');
                  }}
                  className="mt-2 text-primary"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredNotes.map(note => (
                <Card key={note.id} className="bg-background/30 backdrop-blur-sm border-primary/10 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{note.title}</h3>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(note.priority)}`}>
                          {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getStatusColor(note.status)}`}>
                          {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit className="h-3.5 w-3.5 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">
                      {note.content}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {note.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] bg-primary/5 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        {note.cueReference && (
                          <div className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            <span>{note.cueReference}</span>
                          </div>
                        )}
                        
                        {note.sectionReference && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{note.sectionReference}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(note.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Add/Edit Note Tab */}
        <TabsContent value="add" className="px-6 py-4 space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="glass bg-muted/20 border-primary/20"
            />
            
            <textarea
              placeholder="Note content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full p-3 rounded bg-muted/20 border border-primary/20 min-h-[120px] glass"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Reference (optional)</label>
                <Input
                  placeholder="Cue reference (e.g. Cue 12A)"
                  value={newNote.cueReference || ''}
                  onChange={(e) => setNewNote({ ...newNote, cueReference: e.target.value })}
                  className="glass bg-muted/20 border-primary/20"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Section (optional)</label>
                <Input
                  placeholder="Section reference (e.g. Act 1, Scene 2)"
                  value={newNote.sectionReference || ''}
                  onChange={(e) => setNewNote({ ...newNote, sectionReference: e.target.value })}
                  className="glass bg-muted/20 border-primary/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Priority</label>
                <select
                  value={newNote.priority}
                  onChange={(e) => setNewNote({ ...newNote, priority: e.target.value as Note['priority'] })}
                  className="w-full p-2.5 rounded bg-muted/20 border border-primary/20 glass"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                <select
                  value={newNote.status}
                  onChange={(e) => setNewNote({ ...newNote, status: e.target.value as Note['status'] })}
                  className="w-full p-2.5 rounded bg-muted/20 border border-primary/20 glass"
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <select
                  value={selectedTagInput}
                  onChange={(e) => setSelectedTagInput(e.target.value)}
                  className="flex-1 p-2.5 rounded bg-muted/20 border border-primary/20 glass"
                >
                  <option value="">Select a tag</option>
                  {availableTags
                    .filter(tag => !newNote.tags.includes(tag))
                    .map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
                
                <Button
                  variant="outline"
                  className="glass"
                  onClick={handleAddTag}
                  disabled={!selectedTagInput}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-2 min-h-[32px]">
                {newNote.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-primary/10 hover:bg-primary/20 px-2 py-1 flex items-center gap-1"
                  >
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0" 
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-3 border-t border-primary/10 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setNewNote({
                  title: '',
                  content: '',
                  tags: [],
                  priority: 'medium',
                  status: 'active'
                });
                setEditingNoteId(null);
                
                // Switch to notes tab
                const notesTab = document.querySelector('[data-value="notes"]') as HTMLElement;
                if (notesTab) notesTab.click();
              }}
            >
              Cancel
            </Button>
            
            <Button
              className="button-premium"
              onClick={handleSaveNote}
              disabled={!newNote.title.trim() || !newNote.content.trim()}
            >
              <Save className="h-4 w-4 mr-1" />
              {editingNoteId ? 'Update' : 'Save'} Note
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default PerformanceNotes; 