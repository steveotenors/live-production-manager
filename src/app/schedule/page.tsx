'use client';

import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <Button>Add Event</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" /> Recording Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 mr-1" /> June 15, 2023 · 2:00 PM - 6:00 PM
                </div>
                <p className="text-sm">Studio A with John and Sarah</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" /> Mixing Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 mr-1" /> June 18, 2023 · 10:00 AM - 3:00 PM
                </div>
                <p className="text-sm">Studio B with Mike</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center">
                <div className="text-xs font-medium">Sun</div>
                <div className="text-xs font-medium">Mon</div>
                <div className="text-xs font-medium">Tue</div>
                <div className="text-xs font-medium">Wed</div>
                <div className="text-xs font-medium">Thu</div>
                <div className="text-xs font-medium">Fri</div>
                <div className="text-xs font-medium">Sat</div>
                
                {/* Simple calendar cells */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center text-sm rounded-sm
                      ${i === 14 || i === 17 ? 'bg-primary/20 font-medium' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 