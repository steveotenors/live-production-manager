// src/app/(auth)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Music, FileText, Calendar, ListChecks } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Live Production Manager</h1>
          <p className="text-muted-foreground">Welcome to your production dashboard</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/projects">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-col items-center">
                <Music className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                View and manage all your production projects
              </CardContent>
            </Card>
          </Link>
          
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Access all your scores, audio files, and more
            </CardContent>
          </Card>
          
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Plan and view rehearsals and performances
            </CardContent>
          </Card>
          
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-col items-center">
              <ListChecks className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Track your production to-do list
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild>
                <Link href="/projects">View All Projects</Link>
              </Button>
              <Button variant="outline">New Project</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}