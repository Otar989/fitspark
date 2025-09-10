"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { Home, ArrowLeft, Zap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <GlassCardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <GlassCardTitle className="text-2xl">404</GlassCardTitle>
            <p className="text-white/80">
              Страница не найдена
            </p>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <p className="text-white/60 text-center">
              К сожалению, запрашиваемая страница не существует или была перемещена.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="w-full text-white/80 hover:text-white hover:bg-white/20"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}
