"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, Crown, Star, Medal, ArrowLeft, Flame, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"


interface LeaderboardEntry {
  username: string
  user_id: string
  score: number
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-400" />
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />
    case 3:
      return <Star className="w-6 h-6 text-orange-400" />
    default:
      return <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">{position}</div>
  }
}

const getRankColor = (position: number) => {
  switch (position) {
    case 1:
      return "from-yellow-400 to-orange-500"
    case 2:
      return "from-gray-300 to-gray-500"
    case 3:
      return "from-orange-400 to-red-500"
    default:
      return "from-purple-500 to-pink-500"
  }
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week')

  useEffect(() => {
    fetchLeaderboard()
  }, [timeFilter])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white/80">Загружаем рейтинг...</p>
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
            <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Рейтинг</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Соревнуйтесь с другими пользователями и поднимайтесь в таблице лидеров
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 p-1 bg-white/10 rounded-lg">
              {[
                { key: 'week', label: 'Неделя' },
                { key: 'month', label: 'Месяц' }, 
                { key: 'all', label: 'Всё время' }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={timeFilter === filter.key ? "default" : "ghost"}
                  onClick={() => setTimeFilter(filter.key as any)}
                  className={`${
                    timeFilter === filter.key 
                      ? "bg-white/20 text-white" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {leaderboard.length === 0 ? (
            <GlassCard>
              <GlassCardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-6 text-white/40" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  Рейтинг пуст
                </h3>
                <p className="text-white/60 mb-8">
                  Станьте первым! Выполняйте челленджи и зарабатывайте очки.
                </p>
                <Link href="/challenges">
                  <Button size="lg">
                    <Target className="w-4 h-4 mr-2" />
                    Начать челленджи
                  </Button>
                </Link>
              </GlassCardContent>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* 2nd place */}
                  <div className="flex flex-col items-center order-1">
                    <GlassCard className="w-full text-center p-4">
                      <GlassCardContent>
                        <div className="flex justify-center mb-3">
                          <Medal className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 flex items-center justify-center">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-white mb-1 truncate">
                          {leaderboard[1]?.username || 'User_02'}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-2xl font-bold text-white">
                            {leaderboard[1]?.score || 0}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-gray-400/30 text-gray-300">
                          Серебро
                        </Badge>
                      </GlassCardContent>
                    </GlassCard>
                  </div>

                  {/* 1st place */}
                  <div className="flex flex-col items-center order-2">
                    <GlassCard variant="primary" className="w-full text-center p-4">
                      <GlassCardContent>
                        <div className="flex justify-center mb-3">
                          <Crown className="w-10 h-10 text-yellow-400" />
                        </div>
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">1</span>
                        </div>
                        <h3 className="font-semibold text-white mb-1 truncate">
                          {leaderboard[0]?.username || 'User_01'}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-3xl font-bold text-white">
                            {leaderboard[0]?.score || 0}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                          🏆 Чемпион
                        </Badge>
                      </GlassCardContent>
                    </GlassCard>
                  </div>

                  {/* 3rd place */}
                  <div className="flex flex-col items-center order-3">
                    <GlassCard className="w-full text-center p-4">
                      <GlassCardContent>
                        <div className="flex justify-center mb-3">
                          <Star className="w-8 h-8 text-orange-400" />
                        </div>
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-white mb-1 truncate">
                          {leaderboard[2]?.username || 'User_03'}
                        </h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-2xl font-bold text-white">
                            {leaderboard[2]?.score || 0}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-orange-400/30 text-orange-300">
                          Бронза
                        </Badge>
                      </GlassCardContent>
                    </GlassCard>
                  </div>
                </div>
              )}

              {/* Rest of the leaderboard */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>Полный рейтинг</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-2">
                    {leaderboard.slice(3).map((entry, index) => {
                      const position = index + 4
                      const gradientColor = getRankColor(position)
                      
                      return (
                        <div 
                          key={entry.user_id} 
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                              <span className="text-white font-bold text-sm">{position}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">
                                {entry.username || `User_${String(position).padStart(2, '0')}`}
                              </h3>
                              <p className="text-white/60 text-sm">
                                ID: {entry.user_id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <span className="text-2xl font-bold text-white">
                                {entry.score}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm">очков</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {leaderboard.length > 10 && (
                    <div className="text-center mt-6">
                      <Button variant="glass" size="sm">
                        Показать больше
                      </Button>
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="container mx-auto text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Хотите подняться в рейтинге?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Выполняйте ежедневные челленджи, зарабатывайте очки и соревнуйтесь с друзьями
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/challenges">
              <Button size="lg">
                <Target className="w-4 h-4 mr-2" />
                Выбрать челленджи
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="glass">
                Мой дашборд
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
