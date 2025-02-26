// src/components/PracticeSessionPlayer.tsx
'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { PDFViewer } from '@/components/PDFViewer'
import { useParams } from 'next/navigation'
import { Play, Pause, SkipBack, SkipForward, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getSignedUrl } from '@/lib/supabase-storage'

type PracticeSession = Database['public']['Tables']['practice_sessions']['Row']
type Asset = Database['public']['Tables']['assets']['Row']

export default function PracticeSessionPlayer() {
  const params = useParams()
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [time, setTime] = useState(0)  // Time in seconds
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)  // Default tempo in BPM
  const [bar, setBar] = useState(1)  // Current bar number (simplified)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      setIsLoading(true)
      const sessionId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';
      try {
        const { data, error } = await supabaseClient
          .from('practice_sessions')
          .select('*')
          .eq('id', Number(sessionId))
          .single()
        
        if (error) throw error
        
        setSession(data)
        
        // Initialize tempo from session metadata
        if (data?.notes) {
          try {
            const notesText = data.notes || '';
            const tempoMatch = notesText.match(/tempo:\s*(\d+)/i);
            if (tempoMatch && tempoMatch[1]) {
              setTempo(parseInt(tempoMatch[1]));
            } else {
              setTempo(120); // Default
            }
          } catch (e) {
            setTempo(120); // Default
          }
        }
        
        // Fetch assets for this project
        if (data?.project_id) {
          const { data: assetsData, error: assetsError } = await supabaseClient
            .from('assets')
            .select('*')
            .eq('project_id', data.project_id)
            .eq('department', 'musical')
          
          if (assetsError) throw assetsError
          
          if (assetsData) {
            setAssets(assetsData)
          }
        }
      } catch (error) {
        console.error('Error fetching session data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSession()
  }, [params.id])

  // When tempo changes, update beats timing
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prev) => prev + 0.1) // Update every 100ms for smoother timing
        
        // 4 beats per bar, tempo is in BPM (beats per minute)
        const beatsPerSecond = tempo / 60
        const secondsPerBar = 4 / beatsPerSecond
        
        setBar((prev) => 1 + (time / secondsPerBar))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying, tempo, time])

  // Get file URL when asset is selected
  useEffect(() => {
    async function getFileUrl() {
      if (!selectedAsset) {
        setFileUrl(null)
        return
      }
      
      try {
        const signedUrl = await getSignedUrl(selectedAsset.storage_path || '', 3600); // 1 hour expiry
        setFileUrl(signedUrl)
      } catch (error) {
        console.error('Error getting file URL:', error)
        setFileUrl(null)
      }
    }
    
    getFileUrl()
  }, [selectedAsset])

  function handleAssetSelect(assetId: string) {
    const asset = assets.find(a => a.id === Number(assetId)) || null
    setSelectedAsset(asset)
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading practice session...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Session Not Found</h1>
          <p>The requested practice session could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Practice Session</h1>
          <Link href={`/project/${session.project_id}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select File
                  </label>
                  <Select onValueChange={handleAssetSelect}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Choose a file" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={String(asset.id)}>
                          {asset.name} ({(asset.metadata as any)?.file_type || 'file'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tempo (BPM)
                  </label>
                  <Input
                    type="number"
                    value={tempo}
                    onChange={(e) => setTempo(parseInt(e.target.value) || 120)}
                    min="1"
                    max="300"
                    className="bg-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bar Number
                  </label>
                  <Input
                    type="number"
                    value={Math.floor(bar)}
                    onChange={(e) => {
                      const newBar = parseInt(e.target.value) || 1
                      setBar(newBar)
                      
                      // Update time based on bar
                      const beatsPerSecond = tempo / 60
                      const secondsPerBar = 4 / beatsPerSecond
                      setTime((newBar - 1) * secondsPerBar)
                    }}
                    min="1"
                    className="bg-background"
                  />
                </div>
                
                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">
                    Time: {formatTime(time)} | Bar: {Math.floor(bar)}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      variant="default"
                      className="flex-1"
                    >
                      {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setTime(0)
                        setBar(1)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      onClick={() => {
                        setBar(prev => Math.max(1, prev - 1))
                        const beatsPerSecond = tempo / 60
                        const secondsPerBar = 4 / beatsPerSecond
                        setTime(prev => Math.max(0, prev - secondsPerBar))
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <SkipBack className="mr-2 h-4 w-4" />
                      Prev Bar
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setBar(prev => prev + 1)
                        const beatsPerSecond = tempo / 60
                        const secondsPerBar = 4 / beatsPerSecond
                        setTime(prev => prev + secondsPerBar)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <SkipForward className="mr-2 h-4 w-4" />
                      Next Bar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3 h-[calc(100vh-200px)] min-h-[500px]">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                {fileUrl ? (
                  selectedAsset?.type === 'application/pdf' ? (
                    <PDFViewer url={fileUrl} />
                  ) : selectedAsset?.type.startsWith('audio/') ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-full max-w-md p-4">
                        <h3 className="mb-4 text-lg font-semibold">{selectedAsset.name}</h3>
                        <audio controls src={fileUrl} className="w-full" />
                      </div>
                    </div>
                  ) : selectedAsset?.type.startsWith('video/') ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="w-full max-w-2xl">
                        <video controls src={fileUrl} className="w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p>Preview not available for this file type. <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">Download instead</a></p>
                    </div>
                  )
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">Select a file to view</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}