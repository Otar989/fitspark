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

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [newChallenge, setNewChallenge] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }, [supabase.auth])

  useEffect(() => {
    checkUser()
    fetchChallenges()
  }, [checkUser])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Challenges</h1>
      
      {user && (
        <Card className="p-4 mb-6">
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
      )}

      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="p-4">
            <h3 className="text-xl font-semibold">{challenge.title}</h3>
            <p className="text-sm text-gray-500">
              Created: {new Date(challenge.created_at).toLocaleDateString()}
            </p>
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
