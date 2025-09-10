"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Crown, Target, Play, CheckCircle, ArrowLeft, Star, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"


interface Challenge {
  id: string
  title: string
  description: string
  target: number
  unit: string
  icon: string
  category: string
  premium: boolean
  duration_days: number
  active: boolean
}

interface UserChallenge {
  id: string
  challenge_id: string
  completed: boolean
  start_date: string
}

const categoryColors = {
  'активность': 'bg-gradient-to-r from-blue-500 to-cyan-500',
  'питание': 'bg-gradient-to-r from-green-500 to-emerald-500', 
  'силовая': 'bg-gradient-to-r from-red-500 to-orange-500',
  'развитие': 'bg-gradient-to-r from-purple-500 to-pink-500',
  'ментальное': 'bg-gradient-to-r from-indigo-500 to-purple-500',
  'сон': 'bg-gradient-to-r from-violet-500 to-purple-500'
}

const categoryIcons = {
  'активность': <Target className="w-5 h-5" />,
  'питание': <Zap className="w-5 h-5" />,
  'силовая': <Star className="w-5 h-5" />,
  'развитие': <Target className="w-5 h-5" />,
  'ментальное': <CheckCircle className="w-5 h-5" />,
  'сон': <Star className="w-5 h-5" />
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  const fetchChallenges = React.useCallback(async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      setChallenges(data.challenges || [])
      
      if (user) {
        // Fetch user's joined challenges
        const userResponse = await fetch('/api/user-challenges')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserChallenges(userData.userChallenges || [])
        }
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
    fetchChallenges()
  }, [supabase.auth, fetchChallenges])

  const joinChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error("Войдите в аккаунт, чтобы присоединиться к челленджу")
      return
    }

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      })

      if (response.ok) {
        toast.success("Вы присоединились к челленджу!")
        fetchChallenges()
      } else {
        const error = await response.json()
        toast.error(error.error || "Ошибка при присоединении к челленджу")
      }
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast.error("Ошибка при присоединении к челленджу")
    }
  }

  const categories = ['all', ...Array.from(new Set(challenges.map(c => c.category)))]
  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory)

  const isJoined = (challengeId: string) => {
    return userChallenges.some(uc => uc.challenge_id === challengeId)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white/80">Загружаем челленджи...</p>
          </div>
        </div>
      </div>
    )
  }

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
              <span className="text-gradient">Челленджи</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Выберите челленджи и превратите здоровые привычки в увлекательную игру
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? "bg-white/20 text-white" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category === 'all' ? 'Все' : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge) => {
              const categoryColor = categoryColors[challenge.category as keyof typeof categoryColors] || 'bg-gradient-to-r from-gray-500 to-gray-600'
              const categoryIcon = categoryIcons[challenge.category as keyof typeof categoryIcons] || <Target className="w-5 h-5" />
              const joined = isJoined(challenge.id)
              
              return (
                <GlassCard key={challenge.id} className="group hover:scale-105 transition-transform duration-300">
                  <GlassCardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${categoryColor} flex items-center justify-center text-white`}>
                        <span className="text-2xl">{challenge.icon}</span>
                      </div>
                      <div className="flex gap-2">
                        {challenge.premium && (
                          <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-white/20 text-white/80">
                          <div className="flex items-center">
                            {categoryIcon}
                            <span className="ml-1 text-xs">{challenge.category}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                    
                    <GlassCardTitle className="mb-2">
                      {challenge.title}
                    </GlassCardTitle>
                    <p className="text-white/80 text-sm mb-4">
                      {challenge.description}
                    </p>
                  </GlassCardHeader>
                  
                  <GlassCardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Цель:</span>
                        <span className="text-white font-semibold">
                          {challenge.target} {challenge.unit}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Длительность:</span>
                        <span className="text-white font-semibold">
                          {challenge.duration_days} дней
                        </span>
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => joinChallenge(challenge.id)}
                        disabled={joined || (challenge.premium && !user)}
                        variant={joined ? "ghost" : "default"}
                      >
                        {joined ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Участвуете
                          </>
                        ) : challenge.premium && !user ? (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Требуется Premium
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Присоединиться
                          </>
                        )}
                      </Button>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              )
            })}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 mx-auto mb-4 text-white/40" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Нет челленджей в этой категории
              </h3>
              <p className="text-white/60">
                Попробуйте выбрать другую категорию или вернитесь позже
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Premium CTA */}
      {user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
          <div className="container mx-auto text-center">
            <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Хотите больше челленджей?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              С FitSpark Premium получите доступ к эксклюзивным челленджам 
              и удвойте свой прогресс
            </p>
            <Link href="/premium">
              <Button size="lg" className="px-8">
                Попробовать Premium
                <Crown className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
