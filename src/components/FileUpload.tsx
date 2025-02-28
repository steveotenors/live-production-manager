// src/components/FileUpload.tsx
'use client';

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { uploadFile } from '@/lib/supabase-storage'
import { toast } from '@/components/ui/use-toast'

type Asset = Database['public']['Tables']['assets']['Row']

interface FileUploadProps {
  projectId: string;
  onUploadComplete: () => void;
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [diagnosticMessage, setDiagnosticMessage] = useState<string>('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Simple direct upload test that bypasses the asset database
  async function testDirectUpload() {
    if (!selectedFile) return
    
    setIsUploading(true)
    setDiagnosticMessage('Starting direct upload test...')
    
    try {
      // Create a simple test file path
      const testPath = `project-${projectId}/test-upload/${selectedFile.name}`
      setDiagnosticMessage(`Test path: ${testPath}`)
      
      // Direct Supabase upload without the helper function
      const { data, error } = await supabaseClient.storage
        .from('production-files')
        .upload(testPath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        })
      
      if (error) {
        setDiagnosticMessage(`Upload ERROR: ${error.message}`)
        return
      }
      
      setDiagnosticMessage(`SUCCESS: File uploaded to path ${data?.path || 'unknown'}`)
    } catch (error: any) {
      setDiagnosticMessage(`CAUGHT ERROR: ${error.message || 'Unknown error'}`)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleUpload() {
    if (!selectedFile) return
    
    setIsUploading(true)
    try {
      console.log('Starting upload for:', selectedFile.name);
      
      // Make sure the storage path includes project- prefix for RLS
      const storagePath = `project-${projectId}/${selectedFile.name}`;
      console.log('Storage path:', storagePath);
      
      // Upload file to Supabase storage using the shared function
      const fileUrl = await uploadFile(selectedFile, projectId);
      console.log('File uploaded successfully. URL:', fileUrl);

      // Get file extension for file type
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      
      // Save asset metadata to database with simplified metadata
      console.log('Adding asset to database...');
      const { error: dbError } = await supabaseClient
        .from('assets')
        .insert({
          project_id: projectId,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          storage_path: storagePath,
          department: 'general',
          file_type: fileExt, // This column now exists in the database
          version: selectedFile.name.match(/-v(\d+(\.\d+)*)\./) ? 
                  selectedFile.name.match(/-v(\d+(\.\d+)*)\./)?.[1] || '1.0' : 
                  '1.0',
          metadata: { 
            uploadDate: new Date().toISOString()
          }
        } as any)

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database error: ${dbError.message || 'Failed to save asset metadata'}`);
      }

      console.log('Asset added to database successfully');
      
      // Reset form fields
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded successfully`,
      })
      
      onUploadComplete()
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="max-w-xs"
        />
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={testDirectUpload}
          disabled={!selectedFile || isUploading}
        >
          Test Direct Upload
        </Button>
      </div>
      
      {selectedFile && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium">Selected file:</p>
            <p className="text-sm text-muted-foreground">{selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
          </CardContent>
        </Card>
      )}
      
      {diagnosticMessage && (
        <div className="bg-muted p-2 rounded text-sm font-mono whitespace-pre-wrap">
          {diagnosticMessage}
        </div>
      )}
    </div>
  )
}