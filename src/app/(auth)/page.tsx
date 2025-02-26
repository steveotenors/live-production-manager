// src/app/(auth)/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Music, FileText, Calendar, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export default function Home() {
  return (
    <>
      <PageHeader 
        title="Live Production Manager"
        description="Welcome to your production dashboard"
      />
      
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
        
        <Link href="/files" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-col items-center">
              <FileText className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Access all your scores, audio files, and more
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/schedule" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Plan and view rehearsals and performances
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/tasks" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-col items-center">
              <ListChecks className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Track your production to-do list
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}