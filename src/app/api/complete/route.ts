import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const completeSchema = z.object({
  challengeId: z.string().uuid(),
  value: z.number().positive(),
  proofUrl: z.string().url().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
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
    const { challengeId, value, proofUrl, date } = completeSchema.parse(body)

    const completedAt = date || new Date().toISOString().split('T')[0]

    // Check if user is subscribed to challenge
    const { data: userChallenge, error: subscriptionError } = await supabase
      .from('user_challenge')
      .select('id')
      .eq('user_id', userData.id)
      .eq('challenge_id', challengeId)
      .single()

    if (subscriptionError || !userChallenge) {
      return NextResponse.json(
        { error: 'Not subscribed to this challenge' },
        { status: 403 }
      )
    }

    // Get challenge details for premium check
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('premium, target')
      .eq('id', challengeId)
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Calculate points
    let points = Math.min(100, Math.round((value / Math.max(challenge.target, 1)) * 100))

    // Double points for premium users on premium challenges
    if (challenge.premium) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userData.id)
        .eq('status', 'active')
        .single()

      if (subscription) {
        points *= 2
        points = Math.min(200, points) // Cap at 200 for premium
      }
    }

    // Upsert completion (allows updating existing completion)
    const { error: completionError } = await supabase
      .from('completions')
      .upsert({
        user_id: userData.id,
        challenge_id: challengeId,
        value,
        proof_url: proofUrl,
        completed_at: completedAt,
      })

    if (completionError) {
      throw completionError
    }

    // Refresh leaderboard view
    await supabase.rpc('refresh_leaderboard_week')

    // TODO: Call badge evaluation
    await fetch(`${request.nextUrl.origin}/api/badges/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userData.id, challengeId })
    })

    return NextResponse.json({ 
      success: true, 
      points 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error completing challenge:', error)
    return NextResponse.json(
      { error: 'Failed to complete challenge' },
      { status: 500 }
    )
  }
}