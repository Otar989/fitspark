"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target, Star, Crown, Play, CheckCircle, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/challenges/progress-bar'
import { CHALLENGE_UNITS, DIFFICULTY_LABELS, DIFFICULTY_COLORS, CHALLENGE_STATUS } from '@/constants/challenges'

interface Challenge {
  id: string
  title: string
  short?: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  target: number
  unit: string
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

interface UserChallenge {
  id: string
  progress: any[]
  started_at: string
  completed_at?: string
}

interface ChallengeCardProps {
  challenge: Challenge
  userChallenge?: UserChallenge
  onJoin?: (challengeId: string) => void
  onContinue?: (challengeId: string) => void
  loading?: boolean
}

export function ChallengeCard({ 
  challenge, 
  userChallenge, 
  onJoin, 
  onContinue, 
  loading = false 
}: ChallengeCardProps) {
  const [isJoining, setIsJoining] = useState(false)

  const getChallengeStatus = () => {
    if (!userChallenge) return CHALLENGE_STATUS.NOT_JOINED
    if (userChallenge.completed_at) return CHALLENGE_STATUS.COMPLETED
    return CHALLENGE_STATUS.ACTIVE
  }

  const getProgressPercentage = () => {
    if (!userChallenge?.progress) return 0
    const completedDays = userChallenge.progress.filter((p: any) => p.value !== null).length
    return Math.round((completedDays / challenge.duration_days) * 100)
  }

  const getUnitInfo = () => {
    return CHALLENGE_UNITS[challenge.unit as keyof typeof CHALLENGE_UNITS] || {
      label: challenge.unit,
      placeholder: `Например: ${challenge.target}`,
      icon: '🎯'
    }
  }

  const handleJoin = async () => {
    if (loading) return
    
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

  const handleContinue = () => {
    onContinue?.(challenge.id)
  }

  const status = getChallengeStatus()
  const progress = getProgressPercentage()
  const unitInfo = getUnitInfo()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{challenge.icon}</div>
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {challenge.title}
                </CardTitle>
                {challenge.category && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {challenge.category.name}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {challenge.premium && (
                <Crown className="w-5 h-5 text-yellow-500" />
              )}
              {status === CHALLENGE_STATUS.COMPLETED && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
          
          {challenge.short && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {challenge.short}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {challenge.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {challenge.description}
            </p>
          )}

          {/* Progress for active challenges */}
          {status === CHALLENGE_STATUS.ACTIVE && (
            <div className="mb-4">
              <ProgressBar progress={progress} />
            </div>
          )}

          {/* Challenge info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{challenge.duration_days} дней</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{challenge.points} баллов</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">{challenge.target} {unitInfo.label}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-auto">
            <Badge 
              className={`${DIFFICULTY_COLORS[challenge.difficulty]} border`}
            >
              {DIFFICULTY_LABELS[challenge.difficulty]}
            </Badge>
            
            <div className="flex gap-2">
              {status === CHALLENGE_STATUS.NOT_JOINED && (
                <Button
                  onClick={handleJoin}
                  disabled={isJoining || loading}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  {isJoining ? (
                    'Присоединение...'
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Начать
                    </>
                  )}
                </Button>
              )}
              
              {status === CHALLENGE_STATUS.ACTIVE && (
                <Button
                  onClick={handleContinue}
                  size="sm"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Продолжить
                </Button>
              )}
              
              {status === CHALLENGE_STATUS.COMPLETED && (
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Завершен
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
