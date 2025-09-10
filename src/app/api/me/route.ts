import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockStats } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.warn('No user found, using mock stats')
      return NextResponse.json({ stats: mockStats })
    }

    try {
      // Get user scores
      const { data: userScore } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Get total completions count
      const { count: totalChallenges } = await supabase
        .from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get today's completions
      const today = new Date().toISOString().split('T')[0]
      const { count: completedToday } = await supabase
        .from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed_at', today)

      // Get badges count
      const { count: badges } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Get weekly rank (simplified - just use score rank)
      const { data: rankings } = await supabase
        .from('user_scores')
        .select('user_id, score')
        .order('score', { ascending: false })
        .limit(100)

      const weeklyRank = rankings ? rankings.findIndex(r => r.user_id === user.id) + 1 : 0

      const stats = {
        totalPoints: userScore?.score || 0,
        totalChallenges: totalChallenges || 0,
        completedToday: completedToday || 0,
        longestStreak: userScore?.best_streak || 0,
        currentStreak: userScore?.current_streak || 0,
        weeklyRank: weeklyRank || 0,
        badges: badges || 0
      }

      return NextResponse.json({ stats })
    } catch (dbError) {
      console.warn('Database error, using mock stats:', dbError)
      return NextResponse.json({ stats: mockStats })
    }
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return NextResponse.json({ stats: mockStats })
  }
}