import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'
import { AlertCircle } from 'lucide-react'


export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <GlassCardTitle className="text-center">Ошибка авторизации</GlassCardTitle>
            <p className="text-center text-white/80">
              Произошла ошибка при входе в систему
            </p>
          </GlassCardHeader>
          <GlassCardContent className="space-y-4">
            <p className="text-sm text-white/60 text-center">
              Возможно, ссылка для входа устарела или была использована неправильно.
            </p>
            
            <div className="space-y-2">
              <Link href="/auth/login" className="block w-full">
                <Button className="w-full">
                  Попробовать снова
                </Button>
              </Link>
              
              <Link href="/" className="block w-full">
                <Button variant="glass" className="w-full">
                  На главную
                </Button>
              </Link>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  )
}
