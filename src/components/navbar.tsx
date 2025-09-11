"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Trophy, Target, User, LogIn, LogOut, Menu } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { SimpleThemeToggle } from "@/components/simple-theme-toggle"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"

const navigation = [
  { name: "Челленджи", href: "/challenges", icon: Target },
  { name: "Рейтинг", href: "/leaderboard", icon: Trophy },
  { name: "Профиль", href: "/profile", icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">FitSpark</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-white hover:bg-white/20 flex items-center space-x-2",
                      pathname === item.href && "bg-white/20"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Auth */}
          <div className="flex items-center space-x-4">
            <SimpleThemeToggle />
            
            {!loading && (
              <>
                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-white hover:bg-white/20 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Выйти</span>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-white hover:bg-white/20 flex items-center space-x-2"
                  >
                    <Link href="/auth/login">
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Войти</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/20"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-card w-80">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gradient">FitSpark</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left flex items-center space-x-3 h-12",
                            pathname === item.href && "bg-primary/20 text-primary"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-base">{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                  
                  <div className="h-px bg-border my-4" />
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between px-3">
                      <span className="text-sm font-medium">Тема</span>
                      <SimpleThemeToggle />
                    </div>
                    
                    {!loading && (
                      <>
                        {user ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              handleSignOut()
                              setMobileMenuOpen(false)
                            }}
                            className="w-full justify-start flex items-center space-x-3 h-12"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Выйти</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            asChild
                            className="w-full justify-start flex items-center space-x-3 h-12"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/auth/login">
                              <LogIn className="w-5 h-5" />
                              <span>Войти</span>
                            </Link>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}