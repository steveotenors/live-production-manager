import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Upload, Settings } from 'lucide-react';

interface PracticeSessionPlayerProps {
  sessionId: string;
  sessionName: string;
}

export function PracticeSessionPlayer({ sessionId, sessionName }: PracticeSessionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{sessionName}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Add Files
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Score Display */}
        <div className="flex-1 bg-gray-50 p-4 overflow-auto">
          <Card className="w-full h-full flex items-center justify-center text-gray-500">
            Select a score to display
          </Card>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {/* Handle skip back */}}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {/* Handle skip forward */}}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Click Track Selection */}
        <div className="mt-4 flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={isPlaying ? 'bg-blue-50' : ''}
          >
            UREI Click
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            Standard Click
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            No Click
          </Button>
        </div>
      </div>
    </div>
  );
}