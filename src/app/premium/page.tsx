"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Crown, CheckCircle, ArrowLeft, CreditCard, Zap, Trophy, Target, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"


const premiumFeatures = [
  {
    icon: <Star className="w-6 h-6 text-yellow-400" />,
    title: "Эксклюзивные челленджи",
    description: "Доступ к премиум челленджам: медитация, планка, изучение языков"
  },
  {
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    title: "Двойные очки",
    description: "Получайте x2 очков за один выбранный челлендж каждый день"
  },
  {
    icon: <Target className="w-6 h-6 text-yellow-400" />,
    title: "Персональная аналитика",
    description: "Подробная статистика прогресса и рекомендации"
  },
  {
    icon: <Crown className="w-6 h-6 text-yellow-400" />,
    title: "Премиум бейджи",
    description: "Эксклюзивные награды только для премиум пользователей"
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Приоритетная поддержка",
    description: "Быстрые ответы на вопросы и персональная помощь"
  }
]

export default function PremiumPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Войдите в аккаунт для покупки Premium")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 199,
          description: 'FitSpark Premium - месячная подписка',
          returnUrl: `${window.location.origin}/premium/success`
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка создания платежа')
      }

      const { paymentUrl } = await response.json()
      
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        throw new Error('Не получен URL для оплаты')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      toast.error("Ошибка при создании платежа. Попробуйте позже.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Link>
            
            <Crown className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">FitSpark Premium</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Разблокируйте все возможности FitSpark и ускорьте свой прогресс
            </p>
            
            <div className="text-5xl font-bold text-white mb-2">
              199 ₽<span className="text-2xl text-white/60">/месяц</span>
            </div>
            <p className="text-white/60 mb-8">
              Первые 7 дней бесплатно • Отмена в любое время
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Что входит в Premium
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {premiumFeatures.map((feature, index) => (
              <GlassCard key={index}>
                <GlassCardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto">
            <GlassCard variant="primary">
              <GlassCardHeader>
                <GlassCardTitle className="text-center">
                  Премиум подписка
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="text-center">
                <div className="text-4xl font-bold text-white mb-6">
                  199 ₽<span className="text-lg text-white/60">/месяц</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8 text-white/80">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    Все премиум челленджи
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    Двойные очки (1 челлендж/день)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    Эксклюзивные бейджи
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    Детальная аналитика
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    Приоритетная поддержка
                  </li>
                </ul>
                
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Создание платежа...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Купить Premium
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-white/60 mt-4">
                  Безопасная оплата через YooKassa
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Часто задаваемые вопросы
          </h2>
          
          <div className="space-y-6">
            <GlassCard>
              <GlassCardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">
                  Что произойдёт после покупки?
                </h3>
                <p className="text-white/80">
                  Премиум функции активируются сразу после успешной оплаты. 
                  Вы получите доступ ко всем эксклюзивным челленджам и функциям.
                </p>
              </GlassCardContent>
            </GlassCard>
            
            <GlassCard>
              <GlassCardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">
                  Можно ли отменить подписку?
                </h3>
                <p className="text-white/80">
                  Да, вы можете отменить подписку в любое время в настройках профиля. 
                  Премиум функции останутся активными до конца оплаченного периода.
                </p>
              </GlassCardContent>
            </GlassCard>
            
            <GlassCard>
              <GlassCardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">
                  Как работают двойные очки?
                </h3>
                <p className="text-white/80">
                  Каждый день вы можете выбрать один челлендж, за который получите 
                  удвоенное количество очков при выполнении.
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  )
}