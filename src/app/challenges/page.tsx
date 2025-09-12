"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Crown, Target, ArrowLeft, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ChallengeCard } from "@/components/challenge-card"
import { ChallengeFilters } from "@/components/challenges/challenge-filters"
import { ChallengesEmptyState } from "@/components/challenges/empty-state"
import { SubmitProofDialog } from "@/components/challenges/submit-proof-dialog"
import { createClient } from "@/lib/supabase/client"
import { 
  getCategories, 
  getChallenges, 
  getUserChallenges, 
  joinChallenge, 
  submitProof,
  type DatabaseChallenge,
  type DatabaseCategory,
  type DatabaseUserChallenge,
  type ChallengeFilters as ChallengeFiltersType
} from "@/lib/supabase/challenges"
import { toast } from "sonner"

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<DatabaseChallenge[]>([])
  const [categories, setCategories] = useState<DatabaseCategory[]>([])
  const [userChallenges, setUserChallenges] = useState<DatabaseUserChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [filters, setFilters] = useState<ChallengeFiltersType>({})
  const [selectedChallenge, setSelectedChallenge] = useState<DatabaseChallenge | null>(null)
  const [selectedUserChallenge, setSelectedUserChallenge] = useState<DatabaseUserChallenge | null>(null)
  const [proofDialogOpen, setProofDialogOpen] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch categories
      const categoriesData = await getCategories()
      setCategories(categoriesData)
      
      // Fetch challenges with filters
      const challengesData = await getChallenges(filters)
      setChallenges(challengesData)
      
      // Fetch user's joined challenges if user is logged in
      if (user) {
        const userChallengesData = await getUserChallenges(user.id)
        setUserChallenges(userChallengesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Ошибка при загрузке данных')
    } finally {
      setLoading(false)
    }
  }, [user, filters])

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

  const handleFiltersChange = (newFilters: {
    categorySlug?: string
    difficulty?: string
    q?: string
    sort?: 'popular' | 'newest' | 'points' | 'difficulty'
  }) => {
    const convertedFilters: ChallengeFiltersType = {
      categorySlug: newFilters.categorySlug as any,
      difficulty: newFilters.difficulty as any,
      q: newFilters.q,
      sort: newFilters.sort
    }
    setFilters(convertedFilters)
  }

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) {
      toast.error('Войдите в аккаунт, чтобы присоединиться к челленджу')
      return
    }

    try {
      await joinChallenge(challengeId)
      toast.success('Вы успешно присоединились к челленджу!')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast.error('Ошибка при присоединении к челленджу')
    }
  }

  const handleContinueChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId)
    const userChallenge = userChallenges.find(uc => uc.challenge_id === challengeId)
    
    if (challenge && userChallenge) {
      setSelectedChallenge(challenge)
      setSelectedUserChallenge(userChallenge)
      setProofDialogOpen(true)
    }
  }

  const handleSubmitProof = async (data: {
    day: number
    value: number
    proofUrl?: string
    file?: File
  }) => {
    if (!user || !selectedChallenge || !selectedUserChallenge) return

    try {
      await submitProof({
        userId: user.id,
        userChallengeId: selectedUserChallenge.id,
        proofType: 'number', // Default to number for now
        proofNumber: data.value,
        proofText: data.proofUrl,
        file: data.file
      })
      
      toast.success('Челлендж выполнен!')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error submitting proof:', error)
      throw error // Re-throw to let dialog handle the error
    }
  }

  const resetFilters = () => {
    setFilters({})
  }

  const getUserChallenge = (challengeId: string) => {
    return userChallenges.find(uc => uc.challenge_id === challengeId)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Загружаем челленджи...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            На главную
          </Link>
          
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Челленджи
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Выберите челленджи и превратите здоровые привычки в увлекательную игру
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ChallengeFilters
              categories={categories}
              onFiltersChange={handleFiltersChange}
              className="max-w-4xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            {challenges.length > 0 ? (
              <motion.div 
                key="challenges-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ChallengeCard
                      challenge={challenge}
                      userChallenge={getUserChallenge(challenge.id)}
                      onJoin={handleJoinChallenge}
                      onContinue={handleContinueChallenge}
                      loading={loading}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChallengesEmptyState onResetFilters={resetFilters} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Premium CTA */}
      {user && (
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto text-center">
            <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
            <h2 className="text-3xl font-bold mb-4">
              Хотите больше челленджей?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
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
        </motion.section>
      )}

      {/* Submit Proof Dialog */}
      <SubmitProofDialog
        open={proofDialogOpen}
        onOpenChange={setProofDialogOpen}
        challenge={selectedChallenge}
        userChallenge={selectedUserChallenge}
        onSubmit={handleSubmitProof}
      />
    </div>
  )
}
