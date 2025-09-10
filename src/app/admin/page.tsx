'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'


interface Challenge {
  id: string
  title: string
  created_at: string
}

export default function AdminPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [newChallenge, setNewChallenge] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }, [supabase.auth])

  const fetchChallenges = useCallback(async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkUser()
    fetchChallenges()
  }, [checkUser, fetchChallenges])

  const createChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChallenge.trim() || !user) return

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newChallenge })
      })

      if (response.ok) {
        setNewChallenge('')
        fetchChallenges()
      }
    } catch (error) {
      console.error('Error creating challenge:', error)
    }
  }

  const updateChallenge = async (id: string) => {
    if (!editingTitle.trim()) return

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle })
      })

      if (response.ok) {
        setEditingId(null)
        setEditingTitle('')
        fetchChallenges()
      }
    } catch (error) {
      console.error('Error updating challenge:', error)
    }
  }

  const deleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchChallenges()
      }
    } catch (error) {
      console.error('Error deleting challenge:', error)
    }
  }

  const startEditing = (challenge: Challenge) => {
    setEditingId(challenge.id)
    setEditingTitle(challenge.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-500 mb-4">You need to be signed in to access admin panel.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Challenge</h2>
        <form onSubmit={createChallenge} className="flex gap-2">
          <Input
            value={newChallenge}
            onChange={(e) => setNewChallenge(e.target.value)}
            placeholder="Enter new challenge..."
            className="flex-1"
          />
          <Button type="submit">Add Challenge</Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Manage Challenges</h2>
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="p-4">
            {editingId === challenge.id ? (
              <div className="flex gap-2">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => updateChallenge(challenge.id)}>
                  Save
                </Button>
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(challenge.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEditing(challenge)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteChallenge(challenge.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {challenges.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No challenges yet. Create one above!</p>
        </Card>
      )}
    </div>
  )
}
