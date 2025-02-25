// src/components/ProjectTodos.tsx
'use client';

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabaseClient } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Plus, Check, Save, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

interface ProjectTodosProps {
  projectId: string
}

interface Todo {
  id: string
  text: string
  completed: boolean
  created_at: string
}

export function ProjectTodos({ projectId }: ProjectTodosProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadTodos() {
      try {
        const { data, error } = await supabaseClient
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setTodos(data || [])
      } catch (error) {
        console.error('Error loading todos:', error)
      }
    }
    
    loadTodos()
  }, [projectId])

  async function addTodo() {
    if (!newTodo.trim()) return
    
    try {
      setIsLoading(true)
      
      const { data, error } = await supabaseClient
        .from('tasks')
        .insert([
          {
            project_id: projectId,
            description: newTodo,
            status: 'pending',
            department: 'musical'
          }
        ])
        .select()
      
      if (error) throw error
      
      setTodos([...(data || []), ...todos])
      setNewTodo('')
      toast.success('Task added')
    } catch (error) {
      console.error('Error adding todo:', error)
      toast.error('Failed to add task')
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleTodo(id: string) {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return
      
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed'
      
      await supabaseClient
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id)
      
      setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t))
    } catch (error) {
      console.error('Error toggling todo:', error)
      toast.error('Failed to update task')
    }
  }

  async function deleteTodo(id: string) {
    try {
      await supabaseClient
        .from('tasks')
        .delete()
        .eq('id', id)
      
      setTodos(todos.filter(t => t.id !== id))
      toast.success('Task deleted')
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast.error('Failed to delete task')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>To-Do List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="bg-background flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button onClick={addTodo} disabled={isLoading}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {todos.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No tasks yet</p>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center p-2 border rounded bg-background">
                <Checkbox
                  checked={todo.status === 'completed'}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mr-2"
                />
                <span className={`flex-1 ${todo.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {todo.description}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}