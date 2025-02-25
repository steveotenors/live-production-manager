import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'

type Asset = Database['public']['Tables']['assets']['Row']

interface FileUploadProps {
  projectId: string
  onUploadComplete: () => void
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState('score') // Default to "score" for musical assets
  const [version, setVersion] = useState('v1.0')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Upload file to Supabase storage
      const { data: storageData, error: storageError } = await supabaseClient.storage
        .from('project-files')
        .upload(`${projectId}/${file.name}`, file)

      if (storageError) throw storageError

      // Save asset metadata to database with musical metadata
      const { error: dbError } = await supabaseClient
        .from('assets')
        .insert([{
          project_id: projectId,
          name: file.name,
          size: file.size,
          type: file.type,  // MIME type (e.g., "application/pdf", "audio/mpeg")
          storage_path: storageData.path,
          department: 'musical',
          file_type: fileType,  // Custom type (score, audio_stem, midi, etc.)
          version: version,
          waveform_length: fileType === 'audio_stem' || fileType === 'midi' ? '00:00:00' : null,  // Placeholder for audio/midi
          metadata: { 
            tempo: 120,  // Default tempo for musical assets
            key: '',     // Empty for now, user can update later
            instrumentation: ''  // Empty for now, user can update later
          }
        }])

      if (dbError) throw dbError

      onUploadComplete()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <select
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
        className="mr-2 p-2 border rounded"
      >
        <option value="score">Score</option>
        <option value="audio_stem">Audio Stem</option>
        <option value="midi">MIDI</option>
        <option value="mp3">MP3</option>
        <option value="click">Click Track</option>
      </select>
      <input
        type="text"
        value={version}
        onChange={(e) => setVersion(e.target.value)}
        placeholder="Version (e.g., v1.0)"
        className="mr-2 p-2 border rounded"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload File'}
      </Button>
    </div>
  )
}