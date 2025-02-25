import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'

type Asset = Database['public']['Tables']['assets']['Row']

interface FileListProps {
  projectId: string
  onFileDeleted: () => void
  refreshTrigger: number
}

export function FileList({ projectId, onFileDeleted, refreshTrigger }: FileListProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAssets() {
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
      setIsLoading(false)
    }
    fetchAssets()
  }, [projectId, refreshTrigger])

  async function handleDelete(assetId: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return
    try {
      const { error: storageError } = await supabaseClient.storage
        .from('project-files')
        .remove([`${projectId}/${assets.find(a => a.id === assetId)?.name}`])
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.length === 0 ? (
        <p className="text-gray-500">No assets yet</p>
      ) : (
        assets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{asset.name}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {asset.file_type}, Version: {asset.version}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(asset.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(asset.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}