"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Crown, Target, ArrowLeft, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ChallengeCard } from "@/components/challenge-card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

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

interface Category {
  id: string
  slug: string
  name: string
}

interface UserChallenge {
  id: string
  challenge_id: string
  progress: number
  started_at: string
  completed_at?: string
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  const fetchData = React.useCallback(async () => {
    try {
      // Fetch challenges
      const challengesResponse = await fetch('/api/challenges')
      const challengesData = await challengesResponse.json()
      setChallenges(challengesData.challenges || [])
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories')
      const categoriesData = await categoriesResponse.json()
      setCategories(categoriesData.categories || [])
      
      // Fetch user's joined challenges if user is logged in
      if (user) {
        const userResponse = await fetch('/api/user-challenges')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserChallenges(userData.userChallenges || [])
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
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
  }, [supabase.auth])

  useEffect(() => {
    if (user !== null) {
      fetchData()
    }
  }, [user, fetchData])

  const handleJoinChallenge = (challengeId: string) => {
    fetchData() // Refresh data after joining
  }

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category?.slug === selectedCategory)

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
            <Button
              variant={selectedCategory === 'all' ? "default" : "ghost"}
              onClick={() => setSelectedCategory('all')}
              className={`${
                selectedCategory === 'all' 
                  ? "bg-white/20 text-white" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Все
            </Button>
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category.slug)}
                className={`${
                  selectedCategory === category.slug 
                    ? "bg-white/20 text-white" 
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoinChallenge}
                isJoined={isJoined(challenge.id)}
                loading={loading}
              />
            ))}
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
