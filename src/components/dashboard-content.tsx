"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Trophy, 
  Flame, 
  Target, 
  Plus,
  Droplets,
  Activity,
  Moon,
  Dumbbell,
  Zap,
  Loader2,
  Play
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/challenges/progress-bar'
import { 
  getChallenges, 
  getUserChallenges,
  type DatabaseChallenge,
  type DatabaseUserChallenge 
} from '@/lib/supabase/challenges'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  CHALLENGE_CATEGORIES,
  CHALLENGE_UNITS,
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS 
} from '@/constants/challenges'

interface UserStats {
  totalPoints: number
  totalChallenges: number
  completedToday: number
  currentStreak: number
  weeklyRank: number
  badges: number
}

const categoryIcons = {
  'активность': Activity,
  'питание': Droplets,
  'силовая': Dumbbell,
  'развитие': Target,
  'ментальное': Zap,
  steps: Activity,
  water: Droplets,
  strength: Dumbbell,
  stretch: Zap,
  sleep: Moon,
  misc: Target
}

export function DashboardContent() {
  const [challenges, setChallenges] = useState<DatabaseChallenge[]>([])
  const [userChallenges, setUserChallenges] = useState<DatabaseUserChallenge[]>([])
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({ 
    totalPoints: 0, 
    totalChallenges: 0, 
    completedToday: 0,
    currentStreak: 0,
    weeklyRank: 0,
    badges: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchDashboardData(user.id)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [supabase.auth])

  const fetchDashboardData = async (userId: string) => {
    try {
      setLoading(true)
      
      // Fetch popular challenges (limited)
      const challengesData = await getChallenges({ sort: 'popular' })
      setChallenges(challengesData.slice(0, 6))
      
      // Fetch user's joined challenges
      const userChallengesData = await getUserChallenges(userId)
      setUserChallenges(userChallengesData)
      
      // Calculate stats from user challenges
      const totalPoints = userChallengesData
        .filter(uc => uc.status === 'completed')
        .reduce((sum, uc) => {
          const challenge = challengesData.find(c => c.id === uc.challenge_id)
          return sum + (challenge?.points_reward || 0)
        }, 0)

      const completedToday = userChallengesData.filter(uc => {
        const today = new Date().toDateString()
        return uc.completed_at && new Date(uc.completed_at).toDateString() === today
      }).length

      setStats({
        totalPoints,
        totalChallenges: userChallengesData.length,
        completedToday,
        currentStreak: 0, // TODO: Calculate actual streak
        weeklyRank: 0, // TODO: Calculate from leaderboard
        badges: 0 // TODO: Calculate from badges
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Ошибка при загрузке данных')
    } finally {
      setLoading(false)
    }
  }

  const getUserChallenge = (challengeId: string) => {
    return userChallenges.find(uc => uc.challenge_id === challengeId)
  }

  const getProgressPercentage = (userChallenge?: DatabaseUserChallenge) => {
    if (!userChallenge) return 0
    return Math.round(userChallenge.current_progress || 0)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Загружаем ваш дашборд...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <Card className="p-8 text-center">
          <CardContent>
            <Target className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <CardTitle className="mb-4">Добро пожаловать в FitSpark!</CardTitle>
            <p className="text-muted-foreground mb-6">
              Войдите в аккаунт, чтобы начать выполнять челленджи и отслеживать прогресс
            </p>
            <Link href="/auth/login">
              <Button size="lg">
                Войти в аккаунт
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Добро пожаловать в FitSpark! ⚡</CardTitle>
            <p className="text-muted-foreground">
              Выполняй челленджи, зарабатывай очки и поддерживай здоровые привычки
            </p>
          </CardHeader>
        </Card>

        <Card className="glass-card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Всего очков</p>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">Сегодня</p>
            <p className="text-xl font-bold">{stats.completedToday}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-muted-foreground">Стрик</p>
            <p className="text-xl font-bold">{stats.currentStreak}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-sm text-muted-foreground">Рейтинг</p>
            <p className="text-xl font-bold">#{stats.weeklyRank || '-'}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-sm text-muted-foreground">Челленджей</p>
            <p className="text-xl font-bold">{stats.totalChallenges}</p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Challenges */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Популярные челленджи</h2>
          <Link href="/challenges">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Все челленджи
            </Button>
          </Link>
        </div>

        {challenges.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Челленджи загружаются...
              </p>
              <Link href="/challenges">
                <Button>
                  Перейти к челленджам
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => {
              const userChallenge = getUserChallenge(challenge.id)
              const categoryInfo = challenge.category ? CHALLENGE_CATEGORIES[challenge.category.slug as keyof typeof CHALLENGE_CATEGORIES] : null
              const unitInfo = CHALLENGE_UNITS[challenge.target_unit as keyof typeof CHALLENGE_UNITS] || {
                label: challenge.target_unit,
                icon: '🎯'
              }
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full flex flex-col">
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
                        {challenge.is_premium && (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {challenge.description}
                      </p>

                      {/* Progress for active challenges */}
                      {userChallenge && userChallenge.status === 'active' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Прогресс</span>
                            <span className="font-medium">{getProgressPercentage(userChallenge)}%</span>
                          </div>
                          <ProgressBar progress={getProgressPercentage(userChallenge)} />
                        </div>
                      )}

                      {/* Challenge info */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Target className="w-4 h-4 shrink-0" />
                          <span>{challenge.target_value} {unitInfo.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="w-4 h-4 shrink-0" />
                          <span>{challenge.points_reward} баллов</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-auto">
                        {!userChallenge ? (
                          <Link href="/challenges">
                            <Button className="w-full" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Начать
                            </Button>
                          </Link>
                        ) : userChallenge.status === 'active' ? (
                          <Link href="/challenges">
                            <Button variant="outline" className="w-full" size="sm">
                              Продолжить
                            </Button>
                          </Link>
                        ) : (
                          <Badge className="w-full justify-center bg-green-500/20 text-green-500 border-green-500/30 px-3 py-1">
                            Завершен
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}