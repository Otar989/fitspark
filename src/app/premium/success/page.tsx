"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Crown, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { Navbar } from "@/components/navbar"

export default function PremiumSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed'>('pending')
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // In a real app, you would verify the payment with YooKassa
        // For now, we'll assume success if we reached this page
        setPaymentStatus('success')
      } catch (error) {
        console.error('Error checking payment status:', error)
        setPaymentStatus('failed')
      } finally {
        setLoading(false)
      }
    }

    checkPaymentStatus()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-white/80">Проверяем статус платежа...</p>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center max-w-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Ошибка платежа
            </h1>
            <p className="text-white/80 mb-8">
              Произошла ошибка при обработке платежа. Попробуйте ещё раз.
            </p>
            <Link href="/premium">
              <Button size="lg">
                Попробовать снова
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <Sparkles className="absolute -top-4 -left-4 w-6 h-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -right-6 w-4 h-4 text-yellow-400 animate-pulse delay-1000" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Добро пожаловать в Premium!</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8">
            Поздравляем! Ваша премиум подписка активна. 
            Теперь у вас есть доступ ко всем эксклюзивным функциям FitSpark.
          </p>

          {/* Premium Features Unlocked */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <GlassCard>
              <GlassCardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Премиум челленджи разблокированы
                </h3>
                <p className="text-white/80 text-sm">
                  Медитация, планка и изучение языков теперь доступны
                </p>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Двойные очки активны
                </h3>
                <p className="text-white/80 text-sm">
                  Выберите челлендж для получения x2 очков сегодня
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>

          {/* Next Steps */}
          <GlassCard variant="primary">
            <GlassCardHeader>
              <GlassCardTitle>Что дальше?</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <p className="text-white/80">
                Начните с выбора премиум челленджа и активации двойных очков 
                для максимального прогресса!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/challenges">
                  <Button size="lg" className="w-full sm:w-auto">
                    Премиум челленджи
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                
                <Link href="/app">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-white/20">
                    Мой дашборд
                  </Button>
                </Link>
              </div>
            </GlassCardContent>
          </GlassCard>

          <p className="text-white/60 text-sm mt-8">
            Подписка будет автоматически продлена через 30 дней. 
            Вы можете отменить её в любое время в настройках профиля.
          </p>
        </div>
      </div>
    </div>
  )
}