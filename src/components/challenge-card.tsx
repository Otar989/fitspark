"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target, Users, Crown, Play, CheckCircle, TrendingUp, Award } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/challenges/progress-bar'
import { 
  CHALLENGE_UNITS, 
  DIFFICULTY_LABELS, 
  DIFFICULTY_COLORS, 
  CHALLENGE_CATEGORIES,
  CHALLENGE_MESSAGES,
  type ChallengeCategory
} from '@/constants/challenges'
import { 
  joinChallenge,
  type DatabaseChallenge,
  type DatabaseUserChallenge
} from '@/lib/supabase/challenges'

interface ChallengeCardProps {
  challenge: DatabaseChallenge
  userChallenge?: DatabaseUserChallenge
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
    if (!userChallenge) return 'not_joined'
    return userChallenge.status
  }

  const getProgressPercentage = () => {
    return userChallenge?.current_progress || 0
  }

  const getUnitInfo = () => {
    return CHALLENGE_UNITS[challenge.target_unit as keyof typeof CHALLENGE_UNITS] || {
      label: challenge.target_unit,
      placeholder: `Например: ${challenge.target_value}`,
      icon: '🎯'
    }
  }

  const getCategoryInfo = () => {
    if (!challenge.category) return null
    return CHALLENGE_CATEGORIES[challenge.category.slug as keyof typeof CHALLENGE_CATEGORIES]
  }

  const handleJoin = async () => {
    if (loading) return
    
    setIsJoining(true)
    try {
      await joinChallenge(challenge.id)
      toast.success(CHALLENGE_MESSAGES.joinSuccess)
      onJoin?.(challenge.id)
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast.error(error instanceof Error ? error.message : CHALLENGE_MESSAGES.joinError)
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
  const categoryInfo = getCategoryInfo()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col glass-card group hover:shadow-lg transition-all duration-300 border">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{categoryInfo?.icon || '🎯'}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                  {challenge.title}
                </CardTitle>
                {challenge.category && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs border challenge-${challenge.category.slug}`}
                  >
                    {challenge.category.name}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {challenge.is_premium && (
                <Crown className="w-5 h-5 text-yellow-500" />
              )}
              {status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {challenge.description}
          </p>

          {/* Progress for active challenges */}
          {status === 'active' && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}

          {/* Challenge info */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{challenge.duration_days} дней</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-4 h-4 shrink-0" />
              <span>{challenge.points_reward} баллов</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4 shrink-0" />
              <span>{challenge.target_value} {unitInfo.label}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 shrink-0" />
              <span>{challenge.participant_count || 0}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-auto">
            <Badge 
              className={`${DIFFICULTY_COLORS[challenge.difficulty]} border px-2 py-1`}
            >
              {DIFFICULTY_LABELS[challenge.difficulty]}
            </Badge>
            
            <div className="flex gap-2">
              {status === 'not_joined' && (
                <Button
                  onClick={handleJoin}
                  disabled={isJoining || loading}
                  size="sm"
                  className="glass-button bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
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
              
              {status === 'active' && (
                <Button
                  onClick={handleContinue}
                  size="sm"
                  variant="outline"
                  className="glass-button"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Продолжить
                </Button>
              )}
              
              {status === 'completed' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
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
