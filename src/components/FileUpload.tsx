// src/components/FileUpload.tsx
'use client';

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileInput } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadFile } from '@/lib/supabase-storage'

type Asset = Database['public']['Tables']['assets']['Row']

interface FileUploadProps {
  projectId: string
  onUploadComplete: () => void
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState('score')
  const [version, setVersion] = useState('v1.0')
  const [songName, setSongName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  async function handleUpload() {
    if (!selectedFile) return
    
    setIsUploading(true)
    try {
      // Upload file to Supabase storage using the shared function
      const storagePath = `${projectId}/${selectedFile.name}`;
      const fileUrl = await uploadFile(selectedFile, projectId);

      // Save asset metadata to database with musical metadata
      const { error: dbError } = await supabaseClient
        .from('assets')
        .insert({
          project_id: parseInt(projectId, 10),
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          storage_path: storagePath,
          department: 'musical',
          file_type: fileType,
          version: version,
          song: songName || 'Untitled',
          waveform_length: fileType === 'audio_stem' || fileType === 'midi' ? '00:00:00' : null,
          metadata: { 
            tempo: 120,
            key: '',
            instrumentation: ''
          }
        })

      if (dbError) throw dbError

      // Reset form fields
      setSelectedFile(null)
      setSongName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      onUploadComplete()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              File Type
            </label>
            <Select 
              value={fileType} 
              onValueChange={setFileType}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="audio_stem">Audio Stem</SelectItem>
                <SelectItem value="midi">MIDI</SelectItem>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="click">Click Track</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Version
            </label>
            <Input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Version (e.g., v1.0)"
              className="bg-background"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Song Name
            </label>
            <Input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              placeholder="Enter song name"
              className="bg-background"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            File
          </label>
          
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="bg-background"
            />
            
            <Button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className="whitespace-nowrap"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          
          {selectedFile && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024).toLocaleString()} KB)
              </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}