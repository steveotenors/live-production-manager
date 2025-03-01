"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CueManager } from '@/components/director/CueManager';
import { TempoTool } from '@/components/director/TempoTool';
import { CrewSync } from '@/components/director/CrewSync';
import { PerformanceNotes } from '@/components/director/PerformanceNotes';
import { ScoreViewer } from '@/components/director/ScoreViewer';
import { 
  Music, 
  Clock, 
  Users, 
  FileText, 
  BarChart4, 
  ChevronDown, 
  Settings, 
  ListMusic,
  Timer,
  BookOpen,
  Calendar
} from 'lucide-react';

export interface MusicDirectorDashboardProps {
  projectId?: string | number;
  projectName?: string;
  className?: string;
}

export function MusicDirectorDashboard({
  projectId = '123',
  projectName = 'The Phantom of the Opera',
  className
}: MusicDirectorDashboardProps) {
  // State for dashboard
  const [activeView, setActiveView] = useState<'full' | 'split' | 'focus'>('full');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Demo statistics
  const stats = [
    { label: 'Total Cues', value: 136 },
    { label: 'Crew Members', value: 24 },
    { label: 'Rehearsal Hours', value: 42 },
    { label: 'Days to Opening', value: 15 }
  ];
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Switch between different view modes
  const handleViewChange = (view: 'full' | 'split' | 'focus') => {
    setActiveView(view);
  };
  
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-playfair-display premium-gradient-text font-bold">Musical Director Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {projectName} <span className="opacity-50">•</span> <span className="text-primary">Live Production</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex border border-primary/20 rounded-lg overflow-hidden bg-background/20 backdrop-blur-sm">
            <Button
              variant="ghost"
              className={`h-9 px-3 rounded-none ${activeView === 'full' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleViewChange('full')}
            >
              Full
            </Button>
            <Button
              variant="ghost"
              className={`h-9 px-3 rounded-none ${activeView === 'split' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleViewChange('split')}
            >
              Split
            </Button>
            <Button
              variant="ghost"
              className={`h-9 px-3 rounded-none ${activeView === 'focus' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => handleViewChange('focus')}
            >
              Focus
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="ml-2">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass obsidian-reflection border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">{stat.label}</p>
                {index === 0 && <ListMusic className="h-4 w-4 text-primary" />}
                {index === 1 && <Users className="h-4 w-4 text-primary" />}
                {index === 2 && <Clock className="h-4 w-4 text-primary" />}
                {index === 3 && <Calendar className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-3xl font-bold mt-2 premium-gradient-text">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start bg-background/20 backdrop-blur-sm border border-primary/10 rounded-lg h-12 mb-6">
          <TabsTrigger value="overview" className="h-10 data-[state=active]:bg-primary/10">
            <BarChart4 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="cues" className="h-10 data-[state=active]:bg-primary/10">
            <ListMusic className="h-4 w-4 mr-2" />
            Cues
          </TabsTrigger>
          <TabsTrigger value="tempo" className="h-10 data-[state=active]:bg-primary/10">
            <Timer className="h-4 w-4 mr-2" />
            Tempo
          </TabsTrigger>
          <TabsTrigger value="notes" className="h-10 data-[state=active]:bg-primary/10">
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="score" className="h-10 data-[state=active]:bg-primary/10">
            <Music className="h-4 w-4 mr-2" />
            Score
          </TabsTrigger>
          <TabsTrigger value="crew" className="h-10 data-[state=active]:bg-primary/10">
            <Users className="h-4 w-4 mr-2" />
            Crew
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CueManager className="min-h-[400px]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TempoTool 
                  initialTempo={120} 
                  initialTimeSignature="4/4" 
                  onTempoChange={(tempo) => console.log(`Tempo changed to ${tempo} BPM`)} 
                />
                <PerformanceNotes />
              </div>
            </div>
            <div className="space-y-6">
              <CrewSync />
              <Card className="glass obsidian-reflection border-primary/10">
                <CardHeader className="pb-2">
                  <CardTitle className="premium-gradient-text flex items-center text-lg">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col gap-2">
                    {[
                      { name: 'Act 1 Opening', type: 'Score', icon: <Music className="h-3.5 w-3.5" /> },
                      { name: 'Masquerade Scene', type: 'Cue', icon: <ListMusic className="h-3.5 w-3.5" /> },
                      { name: 'Final Lair Sequence', type: 'Notes', icon: <FileText className="h-3.5 w-3.5" /> },
                      { name: 'Overture', type: 'Tempo', icon: <Timer className="h-3.5 w-3.5" /> }
                    ].map((item, idx) => (
                      <Button 
                        key={idx} 
                        variant="ghost" 
                        className="justify-start h-auto py-2 px-3 hover:bg-primary/5"
                        onClick={() => {
                          setActiveTab(item.type.toLowerCase());
                        }}
                      >
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.type}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Cues Tab Content */}
        <TabsContent value="cues" className="mt-0">
          <div className="w-full">
            <CueManager className="min-h-[700px]" />
          </div>
        </TabsContent>
        
        {/* Tempo Tab Content */}
        <TabsContent value="tempo" className="mt-0">
          <div className="w-full">
            <TempoTool 
              initialTempo={120} 
              initialTimeSignature="4/4" 
              onTempoChange={(tempo) => console.log(`Tempo changed to ${tempo} BPM`)} 
              className="min-h-[700px]"
            />
          </div>
        </TabsContent>
        
        {/* Notes Tab Content */}
        <TabsContent value="notes" className="mt-0">
          <div className="w-full">
            <PerformanceNotes className="min-h-[700px]" />
          </div>
        </TabsContent>
        
        {/* Score Tab Content */}
        <TabsContent value="score" className="mt-0">
          <div className="w-full">
            <ScoreViewer className="min-h-[700px]" />
          </div>
        </TabsContent>
        
        {/* Crew Tab Content */}
        <TabsContent value="crew" className="mt-0">
          <div className="w-full">
            <CrewSync className="min-h-[700px]" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MusicDirectorDashboard; 