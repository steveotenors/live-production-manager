import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { PDFViewer } from '@/components/PDFViewer'
import { useParams } from 'next/navigation'
import { getFileUrl } from '@/lib/supabase'

type PracticeSession = Database['public']['Tables']['practice_sessions']['Row']
type Asset = Database['public']['Tables']['assets']['Row']

export default function PracticeSessionPlayer() {
  const params = useParams()
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [time, setTime] = useState(0)  // Time in seconds
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)  // Default tempo in BPM
  const [bar, setBar] = useState(1)  // Current bar number (simplified)

  useEffect(() => {
    async function fetchSession() {
      const sessionId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';  // Handle type
      const { data, error } = await supabaseClient
        .from('practice_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      if (error) {
        console.error('Error fetching session:', error)
      } else {
        setSession(data || null)
      }
    }

    async function fetchAssets() {
      const projectId = session?.project_id || '';  // Handle null/undefined
      const { data, error } = await supabaseClient
        .from('assets')
        .select('*')
        .eq('project_id', projectId)
        .eq('department', 'musical')
        .order('created_at', { ascending: false })
      if (error) {
        console.error('Error fetching assets:', error)
      } else {
        setAssets(data || [])
      }
    }

    fetchSession()
    if (session) fetchAssets()
  }, [params.id, session?.project_id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
        setBar((prev) => prev + (tempo / 60 / 4))  // Simplified: 4 beats per bar, adjust based on time signature
      }, 1000 / (tempo / 60))
    }
    return () => clearInterval(interval)
  }, [isPlaying, tempo])

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{session.name}</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </div>

        <div className="mb-4">
          <select 
            onChange={(e) => setSelectedAsset(e.target.value)} 
            className="p-2 border rounded"
            value={selectedAsset || ''}
          >
            <option value="">Select a Track</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.storage_path}>
                {asset.name} ({asset.file_type})
              </option>
            ))}
          </select>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value) || 120)}
            placeholder="Tempo (BPM)"
            className="ml-2 p-2 border rounded"
            min="1"
          />
          <input
            type="number"
            value={bar}
            onChange={(e) => setBar(parseInt(e.target.value) || 1)}
            placeholder="Bar Number"
            className="ml-2 p-2 border rounded"
            min="1"
          />
        </div>

        {selectedAsset && <PDFViewer url={getFileUrl(selectedAsset)} />}
        
        <div className="mt-4">
          <p>Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')} | Bar: {Math.floor(bar)}</p>
          <div className="flex gap-2">
            <Button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={() => setTime(0)}>Reset</Button>
            <Button onClick={() => setTime((prev) => prev - 1)}>Skip Back 1s</Button>
            <Button onClick={() => setTime((prev) => prev + 1)}>Skip Forward 1s</Button>
            <Button onClick={() => setBar((prev) => prev - 1)}>Previous Bar</Button>
            <Button onClick={() => setBar((prev) => prev + 1)}>Next Bar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}