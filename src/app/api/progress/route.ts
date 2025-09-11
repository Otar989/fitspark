import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const progressSchema = z.object({
  challengeId: z.string().uuid(),
  progress: z.number().min(0).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user record
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { challengeId, progress } = progressSchema.parse(body)

    // Check if user is participating in this challenge
    const { data: userChallenge, error: challengeError } = await supabase
      .from('user_challenge')
      .select('id, progress')
      .eq('user_id', userData.id)
      .eq('challenge_id', challengeId)
      .single()

    if (challengeError || !userChallenge) {
      return NextResponse.json(
        { error: 'Challenge not found or user not participating' },
        { status: 404 }
      )
    }

    // Update progress
    const { error: updateError } = await supabase
      .from('user_challenge')
      .update({ 
        progress,
        ...(progress === 100 && { completed_at: new Date().toISOString() })
      })
      .eq('id', userChallenge.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
