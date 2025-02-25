// src/components/FileList.tsx
'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash, File, Music, Video, FileText, FileCode, Download, Eye } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import { Json } from '@/types/database.types'

type Asset = Database['public']['Tables']['assets']['Row']

interface FileListProps {
  projectId: string
  onFileDeleted: () => void
  refreshTrigger: number
}

export function FileList({ projectId, onFileDeleted, refreshTrigger }: FileListProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsBySong, setAssetsBySong] = useState<Record<string, Asset[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAssets() {
      try {
        const { data, error } = await supabaseClient
          .from('assets')
          .select('*')
          .eq('project_id', projectId)
          .eq('department', 'musical')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error fetching assets:', error)
        } else if (data) {
          setAssets(data)
          
          // Group by song
          const grouped = data.reduce((groups: Record<string, Asset[]>, asset) => {
            // Safely access song from metadata or fallback to "Uncategorized"
            let song = "Uncategorized";
            
            if (asset.metadata && typeof asset.metadata === 'object') {
              const metadata = asset.metadata as Record<string, unknown>;
              if ('song' in metadata && typeof metadata.song === 'string') {
                song = metadata.song;
              }
            }
            
            if (!groups[song]) groups[song] = [];
            groups[song].push(asset);
            return groups;
          }, {});
          
          setAssetsBySong(grouped);
        }
      } catch (error) {
        console.error('Error in fetchAssets:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAssets()
  }, [projectId, refreshTrigger])

  async function handleDelete(assetId: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return
    try {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) return;
      
      const { error: storageError } = await supabaseClient.storage
        .from('project-files')
        .remove([asset.storage_path])
      
      if (storageError) throw storageError

      const { error: dbError } = await supabaseClient
        .from('assets')
        .delete()
        .eq('id', assetId)
      
      if (dbError) throw dbError

      onFileDeleted()
    } catch (error) {
      console.error('Error deleting asset:', error)
      alert('Error deleting asset')
    }
  }

  async function getFileUrl(filePath: string) {
    try {
      const { data } = await supabaseClient.storage
        .from('project-files')
        .createSignedUrl(filePath, 3600) // 1 hour expiry
      
      return data?.signedUrl
    } catch (error) {
      console.error('Error getting file URL:', error)
      return null
    }
  }

  function getFileIcon(fileType: string | null, mimeType: string) {
    if (fileType === 'audio_stem' || fileType === 'mp3' || mimeType.startsWith('audio/')) {
      return <Music className="h-10 w-10 text-primary" />
    } else if (mimeType.startsWith('video/') || fileType === 'movie') {
      return <Video className="h-10 w-10 text-primary" />
    } else if (mimeType === 'application/pdf') {
      return <FileText className="h-10 w-10 text-primary" />
    } else if (fileType === 'midi' || fileType === 'mus' || fileType === 'sib') {
      return <FileCode className="h-10 w-10 text-primary" />
    } else {
      return <File className="h-10 w-10 text-primary" />
    }
  }

  async function handleViewFile(asset: Asset) {
    const url = await getFileUrl(asset.storage_path);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Could not generate file URL');
    }
  }

  async function handleDownloadFile(asset: Asset) {
    const url = await getFileUrl(asset.storage_path);
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Could not generate download URL');
    }
  }

  if (isLoading) {
    return <div className="text-center p-4 text-foreground">Loading assets...</div>
  }

  if (assets.length === 0) {
    return <p className="text-center text-muted-foreground">No assets yet. Upload some files to get started.</p>
  }

  return (
    <div className="space-y-8">
      {Object.entries(assetsBySong).map(([song, songAssets]) => (
        <div key={song} className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">{song}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(asset.file_type, asset.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate" title={asset.name}>
                        {asset.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Type: {asset.file_type || 'Unknown'}
                        {asset.version && `, Version: ${asset.version}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Size: {Math.round(asset.size / 1024).toLocaleString()} KB
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded: {new Date(asset.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end border-t border-border p-2 bg-muted/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewFile(asset)}
                      className="text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadFile(asset)}
                      className="text-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}