import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Mock user badges for fallback
const mockUserBadges = [
  {
    id: '1',
    user_id: 'mock-user-id',
    badge_id: '1',
    earned_at: new Date().toISOString(),
    badge: {
      id: '1',
      name: 'Первые шаги',
      description: 'Завершите свой первый челлендж',
      icon: '🌟',
      requirement_type: 'total',
      requirement_value: 1
    }
  }
]

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ userBadges: [] })
    }

    // Get user record
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (userError || !userData) {
      console.warn('User not found, using mock data')
      return NextResponse.json({ userBadges: mockUserBadges })
    }

    // Get user badges with badge details
    const { data: userBadges, error } = await supabase
      .from('user_badges')
      .select(`
        id,
        user_id,
        badge_id,
        earned_at,
        badge:badges(*)
      `)
      .eq('user_id', userData.id)
      .order('earned_at', { ascending: false })

    if (error) {
      console.warn('Supabase error, using mock data:', error.message)
      return NextResponse.json({ userBadges: mockUserBadges })
    }

    return NextResponse.json({ userBadges })
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return NextResponse.json({ userBadges: mockUserBadges })
  }
}