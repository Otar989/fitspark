"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar, Target, Star, Crown, CheckCircle, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { UserChallenge as UserChallengeType } from '@/lib/supabase/challenges'

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
  const { challenge, progress, started_at, completed_at } = userChallenge

  if (!challenge) {
    return null
  }

  const isCompleted = completed_at
  const completedDays = Array.isArray(progress) ? progress.filter((p: any) => p.value !== null).length : 0
  const progressPercentage = Math.round((completedDays / challenge.duration_days) * 100)
  const daysSinceStart = Math.floor((Date.now() - new Date(started_at).getTime()) / (1000 * 60 * 60 * 24))
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
          <div className="flex flex-col items-end gap-2">
            {challenge.premium && (
              <Crown className="w-5 h-5 text-yellow-400" />
            )}
            {isCompleted && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
          </div>
        </div>
        
        {challenge.short && (
          <p className="text-white/80 text-sm leading-relaxed">
            {challenge.short}
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
          <div className={`h-2 rounded-full ${getProgressColor()}`} style={{ width: `${progressPercentage}%` }} />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{daysRemaining} дней осталось</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{challenge.points} баллов</span>
          </div>
        </div>

        {/* Difficulty and Actions */}
        <div className="flex items-center justify-between mt-auto">
          <Badge 
            className={`${difficultyColors[challenge.difficulty]} border`}
          >
            {difficultyLabels[challenge.difficulty]}
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
