import Link from 'next/link'
import { ArrowRight, Trophy, Target, Zap, Users, Crown, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Navbar } from '@/components/navbar'


export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">FitSpark</span>
              <span className="block text-3xl md:text-5xl mt-2 text-white">
                Превращай привычки в игру ⚡
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Выполняй ежедневные челленджи, зарабатывай очки, получай бейджи 
              и соревнуйся с друзьями на пути к здоровому образу жизни
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/login">
                <Button size="lg" variant="glassPrimary" className="text-lg px-8 py-4">
                  Начать бесплатно
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/challenges">
                <Button size="lg" variant="glass" className="text-lg px-8 py-4">
                  Посмотреть челленджи
                  <Target className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Demo Challenge Card */}
            <div className="max-w-md mx-auto">
              <GlassCard variant="primary" className="text-center">
                <GlassCardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <GlassCardTitle>10,000 шагов в день</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span>7,542 / 10,000</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{width: '75%'}} />
                    </div>
                    <Button className="w-full" variant="glass">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Выполнено
                    </Button>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Почему FitSpark?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Превращаем скучные тренировки в увлекательную игру с друзьями
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <GlassCard>
              <GlassCardContent className="text-center p-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Ежедневные челленджи</h3>
                <p className="text-white/80">
                  Вода, шаги, силовые, растяжка — выбирай что нравится
                </p>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent className="text-center p-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Очки и бейджи</h3>
                <p className="text-white/80">
                  Зарабатывай очки за выполнение и получай крутые награды
                </p>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent className="text-center p-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Рейтинг</h3>
                <p className="text-white/80">
                  Соревнуйся с другими в недельном и месячном рейтинге
                </p>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Результаты говорят сами за себя
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Тысячи пользователей уже изменили свою жизнь с FitSpark
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                10,000+
              </div>
              <p className="text-white/80">Активных пользователей</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                500,000+
              </div>
              <p className="text-white/80">Выполненных челленджей</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                4.9★
              </div>
              <p className="text-white/80">Средняя оценка</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Отзывы пользователей
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <GlassCard>
              <GlassCardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">А</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Анна К.</p>
                    <p className="text-white/60 text-sm">Москва</p>
                  </div>
                </div>
                <p className="text-white/80">
                  &ldquo;За месяц с FitSpark я выработала привычку пить 2 литра воды в день. 
                  Игровой формат мотивирует лучше любых напоминаний!&rdquo;
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">Д</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Дмитрий М.</p>
                    <p className="text-white/60 text-sm">СПб</p>
                  </div>
                </div>
                <p className="text-white/80">
                  &ldquo;Прошёл челлендж &lsquo;10,000 шагов&rsquo; и сбросил 5 кг! 
                  Система очков и рейтинг с друзьями добавляют азарта.&rdquo;
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">Е</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Елена В.</p>
                    <p className="text-white/60 text-sm">Казань</p>
                  </div>
                </div>
                <p className="text-white/80">
                  &ldquo;Premium подписка того стоит! Медитация и планка изменили мой день. 
                  Стала спокойнее и сильнее.&rdquo;
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard variant="primary">
              <GlassCardContent className="p-8">
                <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  FitSpark Premium
                </h2>
                <p className="text-white/80 mb-6">
                  Разблокируй эксклюзивные челленджи и получай двойные очки
                </p>
                <div className="text-4xl font-bold text-white mb-6">
                  199 ₽<span className="text-lg text-white/60">/месяц</span>
                </div>
                <ul className="text-left space-y-2 mb-8 text-white/80">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    Эксклюзивные премиум-челленджи
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    Двойные очки по одному челленджу в день
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                    Приоритетная поддержка
                  </li>
                </ul>
                <Link href="/premium">
                  <Button size="lg" className="w-full" variant="glass">
                    Попробовать Premium
                  </Button>
                </Link>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Готов изменить свою жизнь?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Присоединяйся к тысячам пользователей, которые уже превратили 
            здоровые привычки в увлекательную игру
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="text-lg px-12 py-6">
              Начать бесплатно прямо сейчас
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <p className="text-white/60 text-sm mt-4">
            Регистрация займёт меньше минуты • Без обязательств
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">FitSpark</span>
          </div>
          <p className="text-white/60">
            © 2024 FitSpark. Превращаем привычки в игру.
          </p>
        </div>
      </footer>
    </div>
  )
}