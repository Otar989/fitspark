"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target, Star, Crown, Play } from 'lucide-react'
import { toast } from 'sonner'

interface Challenge {
  id: string
  title: string
  short?: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration_days: number
  points: number
  icon: string
  image_url?: string
  premium: boolean
  category?: {
    id: string
    slug: string
    name: string
  }
}

interface ChallengeCardProps {
  challenge: Challenge
  onJoin?: (challengeId: string) => void
  isJoined?: boolean
  loading?: boolean
}

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const difficultyLabels = {
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно'
}

export function ChallengeCard({ challenge, onJoin, isJoined = false, loading = false }: ChallengeCardProps) {
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    if (isJoined || loading) return
    
    setIsJoining(true)
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId: challenge.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join challenge')
      }

      toast.success('Вы успешно присоединились к челленджу!')
      onJoin?.(challenge.id)
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast.error(error instanceof Error ? error.message : 'Не удалось присоединиться к челленджу')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <GlassCard className="h-full flex flex-col">
      <GlassCardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{challenge.icon}</div>
            <div>
              <GlassCardTitle className="text-lg font-semibold text-white">
                {challenge.title}
              </GlassCardTitle>
              {challenge.category && (
                <Badge variant="outline" className="mt-1 text-xs border-white/20 text-white/80">
                  {challenge.category.name}
                </Badge>
              )}
            </div>
          </div>
          {challenge.premium && (
            <Crown className="w-5 h-5 text-yellow-400" />
          )}
        </div>
        
        {challenge.short && (
          <p className="text-white/80 text-sm leading-relaxed">
            {challenge.short}
          </p>
        )}
      </GlassCardHeader>

      <GlassCardContent className="flex-1 flex flex-col">
        {challenge.description && (
          <p className="text-white/70 text-sm mb-4 line-clamp-3">
            {challenge.description}
          </p>
        )}

        <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{challenge.duration_days} дней</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{challenge.points} баллов</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Badge 
            className={`${difficultyColors[challenge.difficulty]} border`}
          >
            {difficultyLabels[challenge.difficulty]}
          </Badge>
          
          <Button
            onClick={handleJoin}
            disabled={isJoined || isJoining || loading}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
          >
            {isJoined ? (
              <>
                <Star className="w-4 h-4 mr-2" />
                Присоединен
              </>
            ) : isJoining ? (
              'Присоединение...'
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Начать
              </>
            )}
          </Button>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}
