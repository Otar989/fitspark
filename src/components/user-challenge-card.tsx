"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Target, Star, Crown, CheckCircle, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { DatabaseUserChallenge as UserChallengeType } from '@/lib/supabase/challenges'

type UserChallenge = UserChallengeType

interface UserChallengeCardProps {
  userChallenge: UserChallenge
  onProgressUpdate?: (challengeId: string, progress: number) => void
  onContinue?: (challengeId: string) => void
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

export function UserChallengeCard({ userChallenge, onProgressUpdate, onContinue }: UserChallengeCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { challenge, progress, completed_steps, total_steps, completed_at, joined_at } = userChallenge

  if (!challenge) {
    return null
  }

  // Calculate progress safely
  const getProgressPercentage = (): number => {
    // If progress is defined, use it
    if (typeof progress === 'number') {
      return Math.round(Math.max(0, Math.min(100, progress)))
    }
    
    // If we have completed_steps and total_steps, calculate from them
    if (typeof completed_steps === 'number' && typeof total_steps === 'number' && total_steps > 0) {
      return Math.round((completed_steps / total_steps) * 100)
    }
    
    // Use current_progress field as fallback (should be 0-100)
    if (typeof userChallenge.current_progress === 'number') {
      return Math.round(Math.max(0, Math.min(100, userChallenge.current_progress)))
    }
    
    // Default to 0 if nothing is available
    return 0
  }

  const isCompleted = !!completed_at
  const progressPercentage = getProgressPercentage()
  const daysSinceStart = Math.floor((Date.now() - new Date(joined_at).getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, challenge.duration_days - daysSinceStart)

  const updateProgress = async (newProgress: number) => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          challengeId: challenge.id, 
          progress: newProgress 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update progress')
      }

      toast.success('Прогресс обновлен!')
      onProgressUpdate?.(challenge.id, newProgress)
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error(error instanceof Error ? error.message : 'Не удалось обновить прогресс')
    } finally {
      setIsUpdating(false)
    }
  }

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-green-500'
    if (progressPercentage >= 75) return 'bg-blue-500'
    if (progressPercentage >= 50) return 'bg-yellow-500'
    if (progressPercentage >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <GlassCard className="h-full flex flex-col">
      <GlassCardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">
              {challenge.category?.icon || '🎯'}
            </div>
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
          <div className="flex flex-col items-end gap-2">
            {challenge.is_premium && (
              <Crown className="w-5 h-5 text-yellow-400" />
            )}
            {isCompleted && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </div>
        </div>
        
        {challenge.description && (
          <p className="text-white/80 text-sm leading-relaxed">
            {challenge.description}
          </p>
        )}
      </GlassCardHeader>

      <GlassCardContent className="flex-1 flex flex-col">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Прогресс</span>
            <span className="text-sm font-semibold text-white">{progressPercentage}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-white/10"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{daysRemaining} дней осталось</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{challenge.points_reward} баллов</span>
          </div>
        </div>

        {/* Difficulty and Actions */}
        <div className="flex items-center justify-between mt-auto">
          <Badge 
            className={`${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]} border`}
          >
            {difficultyLabels[challenge.difficulty as keyof typeof difficultyLabels]}
          </Badge>
          
          <div className="flex gap-2">
            {!isCompleted && (
              <Button
                onClick={() => onContinue?.(challenge.id)}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Продолжить
              </Button>
            )}
            {isCompleted && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-4 h-4 mr-1" />
                Завершен
              </Badge>
            )}
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}