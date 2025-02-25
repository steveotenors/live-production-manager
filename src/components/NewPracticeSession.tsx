import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'
import { Database } from '@/types/database.types'

type PracticeSession = Database['public']['Tables']['practice_sessions']['Row']

interface NewPracticeSessionProps {
  projectId: string
  onSessionCreated: () => void
}

export function NewPracticeSession({ projectId, onSessionCreated }: NewPracticeSessionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [tempo, setTempo] = useState(120) // Default tempo in BPM
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabaseClient
      .from('practice_sessions')
      .insert([{
        project_id: Number(projectId),
        name,
        department: 'musical',
        date: new Date().toISOString(), // Required field in your DB
        notes: `tempo: ${tempo}\n${notes}` // Store tempo in notes since metadata doesn't exist
      }]);
      if (error) throw error
      onSessionCreated()
      setIsOpen(false)
      setName('')
      setTempo(120)
      setNotes('')
    } catch (error) {
      console.error('Error creating practice session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Practice Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Practice Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="session-name" className="block text-sm font-medium text-gray-700">
              Session Name
            </label>
            <input
              id="session-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter session name"
              required
            />
          </div>
          <div>
            <label htmlFor="tempo" className="block text-sm font-medium text-gray-700">
              Tempo (BPM)
            </label>
            <input
              id="tempo"
              type="number"
              value={tempo}
              onChange={(e) => setTempo(parseInt(e.target.value) || 120)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., 120"
              min="1"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add notes for the session"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}