'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  Mic, 
  Music, 
  FileText, 
  Video, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
  Clock,
  BookOpen,
  ListMusic,
  FastForward,
  ChevronDown,
  MusicIcon
} from 'lucide-react';

export default function PracticePage() {
  const params = useParams();
  const { toast } = useToast();
  const projectId = params?.projectId as string;
  
  const [loading, setLoading] = useState(true);
  const [practiceSessions, setPracticeSessions] = useState<any[]>([]);
  const [projectAudioFiles, setProjectAudioFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [playerView, setPlayerView] = useState('audio');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (!projectId) return;
    loadPracticeData();
  }, [projectId]);
  
  const loadPracticeData = async () => {
    try {
      setLoading(true);
      
      // In a future implementation, fetch actual practice sessions and audio files
      // For now, we're using placeholder data
      
      // Placeholder for fetching audio files from project storage
      const { data: filesData, error: filesError } = await supabaseClient.storage
        .from('production-files')
        .list(`project-${projectId}`);
      
      if (filesError) throw filesError;
      
      // Filter only audio files
      const audioFiles = filesData?.filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'aac' || ext === 'm4a';
      }) || [];
      
      setProjectAudioFiles(audioFiles);
      
      // Placeholder practice sessions data
      setPracticeSessions([
        {
          id: '1',
          name: 'Rehearsal 1',
          date: '2023-09-15',
          notes: 'Focus on sections 24-35',
          files: ['Track 1.mp3', 'Score.pdf']
        },
        {
          id: '2',
          name: 'Sectional - Strings',
          date: '2023-09-18',
          notes: 'Work on difficult passage at measure 42',
          files: ['String Section.mp3', 'Score.pdf']
        }
      ]);
      
    } catch (error) {
      console.error('Error loading practice data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load practice materials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileSelect = async (filename: string) => {
    try {
      // Get file URL
      const { data, error } = await supabaseClient.storage
        .from('production-files')
        .createSignedUrl(`project-${projectId}/${filename}`, 3600); // 1 hour expiry
      
      if (error) throw error;
      
      if (data?.signedUrl) {
        setSelectedFile(data.signedUrl);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        
        // After selecting a file, we'd set it as the source for our player
        if (audioRef.current) {
          audioRef.current.src = data.signedUrl;
          audioRef.current.load();
        }
      }
    } catch (error) {
      console.error('Error generating file URL:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audio file.',
        variant: 'destructive',
      });
    }
  };
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          toast({
            title: 'Playback Error',
            description: 'There was an error playing this file.',
            variant: 'destructive',
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration, 
        audioRef.current.currentTime + 10
      );
    }
  };
  
  const handleTempoChange = (value: number[]) => {
    setTempo(value[0]);
    // In a real implementation, this would adjust playback speed
    // This is complex and would require Web Audio API or libraries
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Practice Room</h2>
        <Button>
          <Mic className="h-4 w-4 mr-2" />
          New Recording
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          {/* Media Player */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Music className="h-5 w-5 mr-2" /> 
                Practice Player
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Tabs defaultValue="audio">
                  <TabsList>
                    <TabsTrigger value="audio" onClick={() => setPlayerView('audio')}>
                      <Music className="h-4 w-4 mr-2" />
                      Audio Player
                    </TabsTrigger>
                    <TabsTrigger value="score" onClick={() => setPlayerView('score')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Score View
                    </TabsTrigger>
                    <TabsTrigger value="video" onClick={() => setPlayerView('video')}>
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {playerView === 'audio' && (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg h-[200px]">
                    {selectedFile ? (
                      <div className="text-center">
                        <h3 className="text-xl font-medium mb-1">
                          {projectAudioFiles.find(f => selectedFile.includes(f.name))?.name || 'Selected Track'}
                        </h3>
                        <p className="text-muted-foreground">
                          {isPlaying ? 'Now Playing' : 'Ready to Play'}
                        </p>
                        <div className="waveform-placeholder mx-auto h-16 w-4/5 mt-4 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 rounded-lg"></div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Music className="h-16 w-16 text-muted-foreground mb-4" />
                        <p>Select a track from the playlist below</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Audio controls */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground w-10">
                        {formatTime(currentTime)}
                      </span>
                      <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={1}
                        onValueChange={handleSeek}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-10 text-right">
                        {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="icon" onClick={skipBackward}>
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="w-12 h-12 rounded-full" 
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      <Button variant="outline" size="icon" onClick={skipForward}>
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-28"
                      />
                      
                      <div className="ml-auto flex items-center gap-2">
                        <Volume2 className="h-4 w-4 mr-2" />
                        <Slider
                          value={[tempo]}
                          min={50}
                          max={200}
                          step={1}
                          onValueChange={handleTempoChange}
                          className="w-28"
                        />
                        <span className="text-sm w-10">{tempo} bpm</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              )}
              
              {playerView === 'score' && (
                <div className="flex flex-col items-center justify-center bg-muted/30 p-6 h-[350px]">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Score View</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    This feature will allow you to follow along with the score in sync with audio playback.
                    Coming soon!
                  </p>
                </div>
              )}
              
              {playerView === 'video' && (
                <div className="flex flex-col items-center justify-center bg-muted/30 p-6 h-[350px]">
                  <Video className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Video Player</h3>
                  <p className="text-muted-foreground text-center max-w-md mt-2">
                    This feature will allow you to watch rehearsal videos with measure markers and annotations.
                    Coming soon!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Track Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ListMusic className="h-5 w-5 mr-2" />
                Practice Materials
              </CardTitle>
              <CardDescription>
                Select tracks and materials for your practice session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">Audio Tracks</h3>
              
              {projectAudioFiles.length === 0 ? (
                <div className="text-center p-6 border rounded-lg">
                  <Music className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No audio files available</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    asChild
                  >
                    <a href={`/projects/${projectId}/files`}>
                      Upload Audio Files
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {projectAudioFiles.map((file) => (
                    <div 
                      key={file.name}
                      className={`flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer ${
                        selectedFile?.includes(file.name) ? 'bg-muted/80' : ''
                      }`}
                      onClick={() => handleFileSelect(file.name)}
                    >
                      <div className="flex items-center">
                        <Music className="h-4 w-4 mr-2 text-primary" />
                        <span>{file.name}</span>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Practice Sessions</h3>
                {practiceSessions.length === 0 ? (
                  <div className="text-center p-6 border rounded-lg">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No practice sessions recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {practiceSessions.map((session) => (
                      <div key={session.id} className="border rounded-md overflow-hidden">
                        <div className="p-3 bg-muted/40 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{session.name}</h4>
                            <p className="text-sm text-muted-foreground">{session.date}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm">{session.notes}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {session.files.map((file: string) => (
                              <Button key={file} variant="outline" size="sm">
                                {file.endsWith('.mp3') ? (
                                  <Music className="h-3 w-3 mr-1" />
                                ) : (
                                  <FileText className="h-3 w-3 mr-1" />
                                )}
                                {file}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  New Practice Session
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Practice History
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Features Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Practice Room Features</CardTitle>
              <CardDescription>
                Tools to help you prepare efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Audio Playback</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Play tracks with variable speed to learn at your own pace
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Score Following</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Follow along with synchronized digital scores
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Video Playback</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Watch rehearsal recordings with measure markers
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FastForward className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Section Looping</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Loop difficult sections to master challenging passages
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      <Toaster />
    </div>
  );
} 