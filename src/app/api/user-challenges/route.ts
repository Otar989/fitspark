import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 User Challenges API: Fetching user challenges...')
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ User Challenges API: Authentication failed:', authError?.message)
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    console.log('🔄 User Challenges API: User authenticated:', user.id, 'Status filter:', status)

    let query = supabase
      .from('user_challenges')
      .select(`
        id,
        user_id,
        challenge_id,
        joined_at,
        completed_at,
        current_progress,
        status,
        created_at,
        updated_at,
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
          proof_required,
          category:categories(
            id,
            slug,
            name,
            icon,
            color
          )
        )
      `)
      .eq('user_id', user.id)

    // Apply status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    query = query.order('joined_at', { ascending: false })

    const { data: userChallenges, error } = await query

    if (error) {
      console.error('❌ User Challenges API: Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        userId: user.id,
        status
      })
      return NextResponse.json(
        { 
          error: 'Failed to fetch user challenges',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, 
        { status: 500 }
      )
    }

    console.log('✅ User Challenges API: Successfully fetched', userChallenges?.length || 0, 'user challenges')
    return NextResponse.json({ userChallenges: userChallenges || [] })
  } catch (error) {
    console.error('❌ User Challenges API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}