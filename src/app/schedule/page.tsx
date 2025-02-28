'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Calendar, 
  Clock, 
  Plus, 
  MapPin,
  ArrowRight,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function GlobalSchedulePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Placeholder schedule data
  const [events] = useState([
    {
      id: '1',
      title: 'Full Rehearsal - Project A',
      date: '2023-11-15',
      time: '18:00 - 20:30',
      location: 'Main Studio',
      project: { id: 'project-a', name: 'Symphony No. 5' }
    },
    {
      id: '2',
      title: 'String Sectional - Project A',
      date: '2023-11-18',
      time: '15:00 - 17:00',
      location: 'Room 204',
      project: { id: 'project-a', name: 'Symphony No. 5' }
    },
    {
      id: '3',
      title: 'Recording Session - Project B',
      date: '2023-11-20',
      time: '10:00 - 14:00',
      location: 'Studio B',
      project: { id: 'project-b', name: 'Film Score' }
    }
  ]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects from Supabase
        const { data, error } = await supabaseClient
          .from('projects')
          .select('id, name, status')
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = event.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, typeof events>);

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-1">View and manage all upcoming events</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Projects filter pills */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm cursor-pointer">
              All Projects
            </Badge>
            {projects.map(project => (
              <Badge 
                key={project.id} 
                variant="outline" 
                className="px-3 py-1 text-sm cursor-pointer hover:bg-accent"
              >
                {project.name}
              </Badge>
            ))}
          </div>
          
          {/* Timeline view */}
          <div className="space-y-8">
            {sortedDates.length > 0 ? (
              sortedDates.map(date => (
                <div key={date}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <div className="space-y-4">
                    {groupedEvents[date].map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{event.title}</h3>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {event.time}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {event.location}
                                </div>
                              </div>
                              <div className="mt-3">
                                <Link href={`/projects/${event.project.id}`}>
                                  <Badge variant="outline" className="hover:bg-accent transition-colors">
                                    {event.project.name}
                                  </Badge>
                                </Link>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/projects/${event.project.id}/schedule`}>
                                Details
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No events scheduled</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  Add events to your projects to see them appear in your global schedule.
                </p>
                <Button className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Toaster />
    </div>
  );
} 