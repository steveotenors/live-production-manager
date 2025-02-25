import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/database.types'

type Project = Database['public']['Tables']['projects']['Row']

interface NewProjectDialogProps {
  onProjectCreated: () => void
}

export function NewProjectDialog({ onProjectCreated }: NewProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [version, setVersion] = useState('')
  const [composer, setComposer] = useState('')
  const [pieceName, setPieceName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .insert([{
          name,
          version_number: version,
          composer_arranger: composer,
          piece_name: pieceName,
          department: 'musical',
          order_index: 0,
          metadata: { genre: '', tempo: 120, key: '', instrumentation: '' }
        }]) as { data: Project[] | null, error: Error | null }  // Type assertion
      if (error) throw error
      onProjectCreated()
      setIsOpen(false)
      setName('')
      setVersion('')
      setComposer('')
      setPieceName('')
      if (data && data.length > 0) {  // Now safe to check length
        router.push(`/project/${data[0].id}`)  // Now safe to access id
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter project name"
              required
            />
          </div>
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700">
              Version
            </label>
            <input
              id="version"
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., v1.0"
            />
          </div>
          <div>
            <label htmlFor="composer" className="block text-sm font-medium text-gray-700">
              Composer/Arranger
            </label>
            <input
              id="composer"
              type="text"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter composer/arranger"
            />
          </div>
          <div>
            <label htmlFor="piece-name" className="block text-sm font-medium text-gray-700">
              Piece Name
            </label>
            <input
              id="piece-name"
              type="text"
              value={pieceName}
              onChange={(e) => setPieceName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter piece name"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}