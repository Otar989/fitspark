import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const joinSchema = z.object({
  challengeId: z.string().uuid(),
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
    const { challengeId } = joinSchema.parse(body)

    // Check if challenge exists and is active
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id, premium')
      .eq('id', challengeId)
      .eq('active', true)
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: 'Challenge not found or inactive' },
        { status: 404 }
      )
    }

    // Check if premium challenge requires subscription
    if (challenge.premium) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', userData.id)
        .eq('status', 'active')
        .single()

      if (!subscription || (subscription.current_period_end && new Date(subscription.current_period_end) < new Date())) {
        return NextResponse.json(
          { error: 'Premium subscription required' },
          { status: 403 }
        )
      }
    }

    // Join challenge (upsert to handle re-joins)
    const { error: joinError } = await supabase
      .from('user_challenge')
      .upsert({
        user_id: userData.id,
        challenge_id: challengeId,
        start_date: new Date().toISOString().split('T')[0]
      })

    if (joinError) {
      throw joinError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error joining challenge:', error)
    return NextResponse.json(
      { error: 'Failed to join challenge' },
      { status: 500 }
    )
  }
}