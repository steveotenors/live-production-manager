'use client';

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TasksPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button>Create New Task</Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors">
                <div className="pt-0.5">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Finalize vocal recordings</h3>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Get final vocal takes for all verses and choruses</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 mr-1" /> Due June 15, 2023
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors">
                <div className="pt-0.5">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Schedule mixing session</h3>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Contact studio and book time for final mix</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 mr-1" /> Due June 18, 2023
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors">
                <div className="pt-0.5">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Review mastering options</h3>
                    <Badge variant="outline">Low</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Research studios and engineers for mastering</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3 mr-1" /> Due June 25, 2023
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="pt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-through text-muted-foreground">Record background vocals</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    Completed June 10, 2023
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="pt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-through text-muted-foreground">Arrange percussion elements</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    Completed June 8, 2023
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="pt-0.5">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-through text-muted-foreground">Finalize song structure</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    Completed June 5, 2023
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 