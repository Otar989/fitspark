import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockStats } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Try to use real Supabase first
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.warn('No user found, using mock stats')
      return NextResponse.json({ stats: mockStats })
    }

    // In real implementation, calculate stats from user's completed challenges
    // For now, return mock data
    return NextResponse.json({ stats: mockStats })
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return NextResponse.json({ stats: mockStats })
  }
}