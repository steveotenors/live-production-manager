"use client";

import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, RotateCcw, Music, Settings, Plus, Minus, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TempoToolProps {
  initialTempo?: number;
  initialTimeSignature?: string;
  className?: string;
  onTempoChange?: (tempo: number) => void;
}

export function TempoTool({ 
  initialTempo = 120, 
  initialTimeSignature = '4/4',
  className,
  onTempoChange
}: TempoToolProps) {
  const [tempo, setTempo] = useState(initialTempo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState(initialTimeSignature);
  const [beatCount, setBeatCount] = useState(1);
  const [volume, setVolume] = useState(70);
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  const [accentOtherBeats, setAccentOtherBeats] = useState(false);
  const [subdivisions, setSubdivisions] = useState(1); // 1 = quarter notes, 2 = eighth notes, etc.
  const [presets, setPresets] = useState([
    { name: 'Largo', tempo: 50, timeSignature: '4/4' },
    { name: 'Adagio', tempo: 70, timeSignature: '4/4' },
    { name: 'Andante', tempo: 92, timeSignature: '4/4' },
    { name: 'Moderato', tempo: 108, timeSignature: '4/4' },
    { name: 'Allegro', tempo: 132, timeSignature: '4/4' },
    { name: 'Vivace', tempo: 160, timeSignature: '4/4' },
    { name: 'Presto', tempo: 180, timeSignature: '4/4' },
  ]);
  
  // References for audio
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const accentAudioRef = useRef<HTMLAudioElement | null>(null);
  const subdivClickAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Parse the time signature to get beats per measure
  const getBeatsPerMeasure = () => {
    const [beatsPerMeasure] = timeSignature.split('/').map(Number);
    return beatsPerMeasure || 4; // Default to 4 if parsing fails
  };
  
  // Start the metronome
  const startMetronome = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setBeatCount(1);
    
    // Create audio elements if they don't exist
    if (!clickAudioRef.current) {
      clickAudioRef.current = new Audio('/sounds/click.mp3');
    }
    
    if (!accentAudioRef.current) {
      accentAudioRef.current = new Audio('/sounds/accent.mp3');
    }
    
    if (!subdivClickAudioRef.current) {
      subdivClickAudioRef.current = new Audio('/sounds/subclick.mp3');
    }
    
    // Set volume for all audio elements
    const volumeLevel = volume / 100;
    if (clickAudioRef.current) clickAudioRef.current.volume = volumeLevel;
    if (accentAudioRef.current) accentAudioRef.current.volume = volumeLevel;
    if (subdivClickAudioRef.current) subdivClickAudioRef.current.volume = volumeLevel * 0.7;
    
    const beatsPerMeasure = getBeatsPerMeasure();
    let currentBeat = 1;
    let currentSubdivision = 1;
    const totalSubdivisions = subdivisions;
    
    // Calculate interval in milliseconds
    const beatInterval = 60000 / tempo; // milliseconds per beat
    const subdivInterval = beatInterval / totalSubdivisions;
    
    // Function to play the appropriate sound based on current beat and subdivision
    const playSound = () => {
      const isMainBeat = currentSubdivision === 1;
      
      if (isMainBeat) {
        // Play accent on the first beat of the measure if enabled
        if (currentBeat === 1 && accentFirstBeat && accentAudioRef.current) {
          accentAudioRef.current.currentTime = 0;
          accentAudioRef.current.play();
        } 
        // Play accent on other beats if enabled
        else if (currentBeat !== 1 && accentOtherBeats && accentAudioRef.current) {
          accentAudioRef.current.currentTime = 0;
          accentAudioRef.current.play();
        }
        // Otherwise play normal click
        else if (clickAudioRef.current) {
          clickAudioRef.current.currentTime = 0;
          clickAudioRef.current.play();
        }
        
        // Update UI beat counter
        setBeatCount(currentBeat);
        
        // Move to next beat
        currentBeat = currentBeat % beatsPerMeasure + 1;
      } 
      // Play subdivision clicks
      else if (totalSubdivisions > 1 && subdivClickAudioRef.current) {
        subdivClickAudioRef.current.currentTime = 0;
        subdivClickAudioRef.current.play();
      }
      
      // Move to next subdivision
      currentSubdivision = currentSubdivision % totalSubdivisions + 1;
    };
    
    // Initial beat
    playSound();
    
    // Set interval for subsequent beats
    timerRef.current = setInterval(playSound, subdivInterval);
  };
  
  // Stop the metronome
  const stopMetronome = () => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };
  
  // Reset to first beat
  const resetBeat = () => {
    setBeatCount(1);
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  };
  
  // Handle tempo change
  const handleTempoChange = (newTempo: number) => {
    // Limit to a reasonable range
    const clampedTempo = Math.max(30, Math.min(300, newTempo));
    setTempo(clampedTempo);
    
    if (onTempoChange) {
      onTempoChange(clampedTempo);
    }
    
    // Restart metronome if it's playing
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  };
  
  // Handle time signature change
  const handleTimeSignatureChange = (newTimeSignature: string) => {
    setTimeSignature(newTimeSignature);
    
    // Restart metronome if it's playing
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Get tempo name description
  const getTempoDescription = (currentTempo: number) => {
    if (currentTempo < 60) return 'Largo';
    if (currentTempo < 80) return 'Adagio';
    if (currentTempo < 100) return 'Andante';
    if (currentTempo < 120) return 'Moderato';
    if (currentTempo < 140) return 'Allegro';
    if (currentTempo < 170) return 'Vivace';
    return 'Presto';
  };
  
  // Get color based on tempo
  const getTempoColor = (currentTempo: number) => {
    if (currentTempo < 80) return 'text-blue-400';
    if (currentTempo < 120) return 'text-green-400';
    if (currentTempo < 160) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <Card className={`glass obsidian-reflection shadow-gold-glow ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="premium-gradient-text flex items-center">
          <Music className="mr-2 h-5 w-5" />
          Tempo Tool
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="metronome" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="metronome">Metronome</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Metronome Tab */}
          <TabsContent value="metronome" className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold font-mono mb-2">{tempo}</div>
                <div className={`text-sm ${getTempoColor(tempo)}`}>
                  {getTempoDescription(tempo)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 my-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleTempoChange(tempo - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Slider
                value={[tempo]}
                min={30}
                max={300}
                step={1}
                onValueChange={(values) => handleTempoChange(values[0])}
                className="w-48 mx-4"
              />
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleTempoChange(tempo + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between gap-2 border border-primary/10 rounded-md p-2 bg-background/50">
              <div className="flex items-center">
                <span className="text-sm mr-2">Time:</span>
                <select
                  value={timeSignature}
                  onChange={(e) => handleTimeSignatureChange(e.target.value)}
                  className="text-sm p-1 rounded bg-muted/20 border border-primary/20"
                >
                  <option value="2/4">2/4</option>
                  <option value="3/4">3/4</option>
                  <option value="4/4">4/4</option>
                  <option value="5/4">5/4</option>
                  <option value="6/8">6/8</option>
                  <option value="7/8">7/8</option>
                  <option value="9/8">9/8</option>
                  <option value="12/8">12/8</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm mr-2">Subdivide:</span>
                <select
                  value={subdivisions}
                  onChange={(e) => setSubdivisions(Number(e.target.value))}
                  className="text-sm p-1 rounded bg-muted/20 border border-primary/20"
                >
                  <option value="1">1 (Quarter)</option>
                  <option value="2">2 (Eighth)</option>
                  <option value="3">3 (Triplet)</option>
                  <option value="4">4 (16th)</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-8">
              <Button 
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full ${isPlaying ? 'bg-primary/20' : ''}`}
                onClick={togglePlayPause}
              >
                {isPlaying ? 
                  <PauseCircle className="h-6 w-6 text-primary" /> : 
                  <PlayCircle className="h-6 w-6 text-primary" />}
              </Button>
              
              <Button 
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={resetBeat}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Beat indicator */}
            <div className="flex justify-center items-center mt-4 h-6">
              {Array.from({ length: getBeatsPerMeasure() }).map((_, index) => (
                <div 
                  key={index}
                  className={`h-3 w-3 rounded-full mx-1 ${
                    beatCount === index + 1 
                      ? index === 0 
                        ? 'bg-primary animate-pulse' 
                        : 'bg-primary/70' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {/* Volume control */}
            <div className="flex items-center justify-center mt-4">
              <Volume2 className="h-4 w-4 mr-2" />
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => setVolume(values[0])}
                className="w-32"
              />
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Accent First Beat</label>
                <input 
                  type="checkbox" 
                  checked={accentFirstBeat}
                  onChange={() => setAccentFirstBeat(!accentFirstBeat)}
                  className="h-4 w-4 rounded border-primary/30 bg-muted/20"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm">Accent Other Beats</label>
                <input 
                  type="checkbox" 
                  checked={accentOtherBeats}
                  onChange={() => setAccentOtherBeats(!accentOtherBeats)}
                  className="h-4 w-4 rounded border-primary/30 bg-muted/20"
                />
              </div>
              
              <div className="border-t border-primary/10 pt-3 mt-3">
                <h4 className="text-sm font-medium mb-2">Tempo Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setTempo(preset.tempo);
                        setTimeSignature(preset.timeSignature);
                        if (onTempoChange) onTempoChange(preset.tempo);
                      }}
                    >
                      <span className="text-xs">{preset.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{preset.tempo}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-primary/10 pt-3 mt-3">
                <h4 className="text-sm font-medium mb-2">Add Custom Preset</h4>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Name" 
                    className="text-sm glass bg-muted/20"
                  />
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-primary/10 pt-4">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Tap spacebar to toggle play/pause
          </div>
          <Button variant="ghost" size="sm" className="text-primary h-8">
            <Settings className="h-3 w-3 mr-1" />
            Advanced
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default TempoTool; 