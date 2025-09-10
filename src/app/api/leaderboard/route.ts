import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockLeaderboard } from '@/lib/mock-data'

export async function GET() {
  try {
    // Try to use real Supabase first
    const supabase = createClient()
    
    const { data: leaderboard, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .limit(100)

    if (error) {
      console.warn('Supabase error, using mock data:', error.message)
      return NextResponse.json({ leaderboard: mockLeaderboard })
    }

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return NextResponse.json({ leaderboard: mockLeaderboard })
  }
}