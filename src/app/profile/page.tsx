'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Label } from '@/components/ui/label'
import { UserChallengeCard } from '@/components/user-challenge-card'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, User, Target, Trophy, Settings } from 'lucide-react'
import { toast } from 'sonner'

interface Profile {
  id: string
  username: string | null
  updated_at: string
}

interface UserChallenge {
  id: string
  progress: number
  started_at: string
  completed_at?: string
  challenge: {
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
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }, [supabase.auth])

  useEffect(() => {
    checkUser()
    fetchData()
  }, [checkUser])

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileResponse = await fetch('/api/profile')
      const profileData = await profileResponse.json()
      setProfile(profileData.profile)
      setUsername(profileData.profile?.username || '')

      // Fetch user challenges
      const challengesResponse = await fetch('/api/user-challenges')
      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json()
        setUserChallenges(challengesData.userChallenges || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !user) return

    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        toast.success('Профиль обновлен!')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Ошибка при сохранении профиля')
    } finally {
      setSaving(false)
    }
  }

  const handleProgressUpdate = (challengeId: string, progress: number) => {
    setUserChallenges(prev => 
      prev.map(uc => 
        uc.challenge.id === challengeId 
          ? { ...uc, progress, ...(progress === 100 && { completed_at: new Date().toISOString() }) }
          : uc
      )
    )
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white/80">Загружаем профиль...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <GlassCard className="max-w-md mx-auto">
              <GlassCardHeader>
                <GlassCardTitle className="text-2xl font-bold mb-4">Войдите в аккаунт</GlassCardTitle>
                <p className="text-white/80 mb-4">Вам нужно войти в аккаунт, чтобы просмотреть профиль.</p>
                <Link href="/">
                  <Button className="w-full">
                    На главную
                  </Button>
                </Link>
              </GlassCardHeader>
            </GlassCard>
          </div>
        </div>
      </div>
    )
  }

  const activeChallenges = userChallenges.filter(uc => !uc.completed_at)
  const completedChallenges = userChallenges.filter(uc => uc.completed_at)
  const totalPoints = userChallenges.reduce((sum, uc) => sum + (uc.completed_at ? uc.challenge.points : 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Профиль</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Управляйте своим профилем и отслеживайте прогресс в челленджах
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-1">
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Настройки профиля
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <form onSubmit={saveProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="username" className="text-white/80">Имя пользователя</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Введите имя пользователя..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button type="button" variant="outline" onClick={signOut} className="border-white/20 text-white hover:bg-white/10">
                      Выйти
                    </Button>
                  </div>
                </form>

                {profile && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h3 className="font-semibold mb-2 text-white">Информация о профиле</h3>
                    <p className="text-sm text-white/60">ID: {profile.id}</p>
                    <p className="text-sm text-white/60">
                      Последнее обновление: {new Date(profile.updated_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Stats */}
            <GlassCard className="mt-6">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Статистика
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/80">Активные челленджи:</span>
                    <span className="text-white font-semibold">{activeChallenges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Завершенные:</span>
                    <span className="text-white font-semibold">{completedChallenges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Всего баллов:</span>
                    <span className="text-white font-semibold">{totalPoints}</span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Active Challenges */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Активные челленджи
              </h2>
              
              {activeChallenges.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {activeChallenges.map((userChallenge) => (
                    <UserChallengeCard
                      key={userChallenge.id}
                      userChallenge={userChallenge}
                      onProgressUpdate={handleProgressUpdate}
                    />
                  ))}
                </div>
              ) : (
                <GlassCard>
                  <GlassCardContent className="text-center py-12">
                    <Target className="w-16 h-16 mx-auto mb-4 text-white/40" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Нет активных челленджей
                    </h3>
                    <p className="text-white/60 mb-6">
                      Присоединяйтесь к челленджам, чтобы начать свой путь к здоровым привычкам
                    </p>
                    <Link href="/challenges">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                        Найти челленджи
                      </Button>
                    </Link>
                  </GlassCardContent>
                </GlassCard>
              )}
            </div>

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Завершенные челленджи
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {completedChallenges.map((userChallenge) => (
                    <UserChallengeCard
                      key={userChallenge.id}
                      userChallenge={userChallenge}
                      onProgressUpdate={handleProgressUpdate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
