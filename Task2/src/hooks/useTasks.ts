import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import type { Task } from '../types/Task'
import { useAuth } from './useAuth'

export function useTasks() {
  const { session } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!session?.user) return

    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      setError(error.message)
    } else {
      setTasks(data as Task[])
    }
    setLoading(false)
  }, [session])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!session?.user) return
    
    // Optimistic update (optional, but let's stick to safe server response for now to ensure ID)
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: session.user.id }])
      .select()
      .single()

    if (error) throw error
    if (data) {
      setTasks(prev => [data as Task, ...prev])
    }
    return data
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)

    if (error) {
      // Revert if error (simple refetch)
      console.error('Error updating task:', error)
      fetchTasks()
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id))

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      fetchTasks()
      throw error
    }
  }

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask }
}
