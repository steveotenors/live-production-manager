// src/components/Setlist.tsx
'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseClient } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Plus, GripVertical, Trash, Clock, Save } from 'lucide-react'
import { toast } from 'sonner'

interface SetlistProps {
  projectId: string
}

interface Song {
  id: string
  name: string
  duration: number // in seconds
}

export function Setlist({ projectId }: SetlistProps) {
  const [songs, setSongs] = useState<Song[]>([])
  const [newSong, setNewSong] = useState('')
  const [duration, setDuration] = useState('3:00')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadSetlist() {
      try {
        const { data } = await supabaseClient
          .from('projects')
          .select('metadata')
          .eq('id', projectId)
          .single()
      
        if (data?.metadata?.setlist) {
          setSongs(data.metadata.setlist)
        }
      } catch (error) {
        console.error('Error loading setlist:', error)
      }
    }
    
    loadSetlist()
  }, [projectId])

  function parseDuration(durationStr: string): number {
    const parts = durationStr.split(':').map(part => parseInt(part.trim()))
    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1] // minutes and seconds
    }
    return 180 // default 3 minutes
  }

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  function getTotalDuration(): number {
    return songs.reduce((total, song) => total + song.duration, 0)
  }

  function formatTotalDuration(): string {
    const totalSeconds = getTotalDuration()
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    }
    
    return `${minutes}m ${seconds}s`
  }

  async function addSong() {
    if (!newSong.trim()) return
    
    const newSongObj: Song = {
      id: Date.now().toString(),
      name: newSong,
      duration: parseDuration(duration)
    }
    
    setSongs([...songs, newSongObj])
    setNewSong('')
    setDuration('3:00')
  }

  async function saveSongs() {
    setIsLoading(true)
    try async function saveSongs() {
        setIsLoading(true)
    try {
      await supabaseClient
        .from('projects')
        .update({
          metadata: {
            setlist: songs
          }
        })
        .eq('id', projectId)
      
      toast.success('Setlist saved successfully')
    } catch (error) {
      console.error('Error saving setlist:', error)
      toast.error('Failed to save setlist')
    } finally {
      setIsLoading(false)
    }
  }

  function removeSong(id: string) {
    setSongs(songs.filter(song => song.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Setlist</span>
          {songs.length > 0 && (
            <span className="text-sm font-normal flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" /> {formatTotalDuration()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="song-name">
              Song Name
            </label>
            <Input
              id="song-name"
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
              placeholder="Enter song name"
              className="bg-background"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium mb-1" htmlFor="duration">
              Duration
            </label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="3:00"
              className="bg-background"
            />
          </div>
          <Button onClick={addSong} size="icon" className="h-10 w-10">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {songs.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No songs in the setlist yet</p>
        ) : (
          <div className="border rounded-md divide-y divide-border">
            {songs.map((song, index) => (
              <div key={song.id} className="p-2 flex items-center">
                <div className="flex items-center mr-2 text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                  <span className="ml-1 w-6 text-center">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-foreground">{song.name}</p>
                </div>
                <div className="flex items-center ml-2 space-x-2">
                  <span className="text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeSong(song.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {songs.length > 0 && (
          <Button 
            onClick={saveSongs} 
            className="w-full" 
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Setlist
          </Button>
        )}
      </CardContent>
    </Card>
  );
}