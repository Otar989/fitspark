import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { challengeId } = await request.json()

    console.log('🔄 Join Challenge API: Processing join request for challenge:', challengeId)

    if (!challengeId) {
      console.error('❌ Join Challenge API: Missing challengeId')
      return NextResponse.json(
        { error: 'Challenge ID is required' }, 
        { status: 400 }
      )
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Join Challenge API: Authentication failed:', authError?.message)
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    console.log('🔄 Join Challenge API: User authenticated:', user.id)

    // Check if challenge exists and is active
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('id, title, is_active')
      .eq('id', challengeId)
      .eq('is_active', true)
      .single()

    if (challengeError || !challenge) {
      console.error('❌ Join Challenge API: Challenge not found or inactive:', challengeError?.message)
      return NextResponse.json(
        { error: 'Challenge not found or inactive' }, 
        { status: 404 }
      )
    }

    // Check if user is already in this challenge
    const { data: existingChallenge, error: checkError } = await supabase
      .from('user_challenges')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found, which is OK
      console.error('❌ Join Challenge API: Error checking existing challenge:', checkError.message)
      return NextResponse.json(
        { error: 'Database error checking existing challenge' }, 
        { status: 500 }
      )
    }

    if (existingChallenge) {
      console.log('ℹ️ Join Challenge API: User already in challenge, returning existing record')
      return NextResponse.json({
        message: 'Already joined this challenge',
        userChallenge: existingChallenge
      })
    }

    // Create user_challenge record
    const { data: userChallenge, error: insertError } = await supabase
      .from('user_challenges')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        status: 'active',
        current_progress: 0,
        joined_at: new Date().toISOString()
      })
      .select(`
        id,
        user_id,
        challenge_id,
        status,
        current_progress,
        joined_at,
        completed_at,
        challenge:challenges(
          id,
          title,
          description,
          difficulty,
          target_value,
          target_unit,
          duration_days,
          points_reward,
          is_premium,
          category:categories(
            id,
            slug,
            name,
            icon,
            color
          )
        )
      `)
      .single()

    if (insertError) {
      console.error('❌ Join Challenge API: Error creating user challenge:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      })
      return NextResponse.json(
        { 
          error: 'Failed to join challenge',
          details: process.env.NODE_ENV === 'development' ? insertError.message : undefined
        }, 
        { status: 500 }
      )
    }

    console.log('✅ Join Challenge API: Successfully joined challenge:', userChallenge.id)
    return NextResponse.json({ 
      message: 'Successfully joined challenge',
      userChallenge 
    })
  } catch (error) {
    console.error('❌ Join Challenge API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}