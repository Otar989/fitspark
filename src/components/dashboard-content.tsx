"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Flame, 
  Target, 
  Plus,
  Droplets,
  Activity,
  Moon,
  Dumbbell,
  Zap
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { CompleteDialog } from '@/components/complete-dialog'

interface Challenge {
  id: string
  title: string
  category: string
  description: string
  unit: string
  target: number
  premium: boolean
}

interface UserStats {
  totalPoints: number
  totalChallenges: number
  longestStreak: number
}

const categoryIcons = {
  steps: Activity,
  water: Droplets,
  strength: Dumbbell,
  stretch: Zap,
  sleep: Moon,
  misc: Target
}

export function DashboardContent() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [stats, setStats] = useState<UserStats>({ totalPoints: 0, totalChallenges: 0, longestStreak: 0 })
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile and stats
      const profileResponse = await fetch('/api/me')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setStats(profileData.stats)
      }

      // Fetch challenges
      const challengesResponse = await fetch('/api/challenges')
      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json()
        setChallenges(challengesData.challenges)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsCompleteDialogOpen(true)
  }

  const handleCompleteSubmit = async (value: number, proofUrl?: string) => {
    if (!selectedChallenge) return

    try {
      const response = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          value,
          proofUrl
        })
      })

      if (response.ok) {
        setIsCompleteDialogOpen(false)
        setSelectedChallenge(null)
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      console.error('Error completing challenge:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl h-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2">
          <GlassCardHeader>
            <GlassCardTitle>Добро пожаловать в FitSpark! ⚡</GlassCardTitle>
            <p className="text-white/80">
              Выполняй челленджи, зарабатывай очки и поддерживай здоровые привычки
            </p>
          </GlassCardHeader>
        </GlassCard>

        <GlassCard variant="accent">
          <GlassCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Всего очков</p>
                <p className="text-2xl font-bold text-white">{stats.totalPoints}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <GlassCardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-sm text-white/80">Челленджей</p>
            <p className="text-xl font-bold text-white">{stats.totalChallenges}</p>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
            <p className="text-sm text-white/80">Лучший стрик</p>
            <p className="text-xl font-bold text-white">{stats.longestStreak}</p>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <p className="text-sm text-white/80">Рейтинг</p>
            <p className="text-xl font-bold text-white">-</p>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-sm text-white/80">Бейджей</p>
            <p className="text-xl font-bold text-white">0</p>
          </GlassCardContent>
        </GlassCard>
      </div>

      {/* Today's Challenges */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Сегодняшние челленджи</h2>
          <Button variant="glass" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Добавить челлендж
          </Button>
        </div>

        {challenges.length === 0 ? (
          <GlassCard>
            <GlassCardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-white/60" />
              <p className="text-white/80 mb-4">
                У вас пока нет активных челленджей
              </p>
              <Button variant="glassPrimary">
                Выбрать челленджи
              </Button>
            </GlassCardContent>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.slice(0, 6).map((challenge, index) => {
              const IconComponent = categoryIcons[challenge.category as keyof typeof categoryIcons]
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <GlassCardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {IconComponent && (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-white">{challenge.title}</h3>
                            {challenge.premium && (
                              <Badge variant="secondary" className="text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <p className="text-white/80 text-sm mb-4">
                        Цель: {challenge.target} {challenge.unit}
                      </p>
                      <Button 
                        className="w-full" 
                        variant="glass"
                        onClick={() => handleCompleteChallenge(challenge)}
                      >
                        Выполнить
                      </Button>
                    </GlassCardContent>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Complete Dialog */}
      {selectedChallenge && (
        <CompleteDialog
          isOpen={isCompleteDialogOpen}
          onClose={() => {
            setIsCompleteDialogOpen(false)
            setSelectedChallenge(null)
          }}
          challenge={selectedChallenge}
          onSubmit={handleCompleteSubmit}
        />
      )}
    </div>
  )
}