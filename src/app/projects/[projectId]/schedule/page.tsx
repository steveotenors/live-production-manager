'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Music, 
  Users, 
  MapPin,
  ArrowRight
} from 'lucide-react';

export default function ProjectSchedulePage() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  
  const [loading, setLoading] = useState(true);
  
  // Placeholder rehearsal schedule
  const [rehearsals] = useState([
    {
      id: '1',
      title: 'Full Rehearsal',
      date: '2023-11-15',
      time: '18:00 - 20:30',
      location: 'Main Studio',
      description: 'Run through Act 1 with all musicians'
    },
    {
      id: '2',
      title: 'String Sectional',
      date: '2023-11-18',
      time: '15:00 - 17:00',
      location: 'Room 204',
      description: 'Focus on difficult passage at measure 42'
    }
  ]);
  
  useEffect(() => {
    // Simulating data fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [projectId]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Schedule</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[100px] w-full rounded-lg" />
          <Skeleton className="h-[100px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Rehearsals
              </CardTitle>
              <CardDescription>
                Schedule of rehearsals and performances for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rehearsals.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium">No events scheduled</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add rehearsals and performances to keep your team informed
                  </p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rehearsals.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                      <p className="text-sm mt-3">{event.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Repertoire
                </CardTitle>
                <CardDescription>
                  Music selected for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Feature coming soon. You will be able to link musical pieces to specific rehearsals.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Attendance
                </CardTitle>
                <CardDescription>
                  Attendance tracking for team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Feature coming soon. You will be able to track and manage rehearsal attendance.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      <Toaster />
    </div>
  );
} 