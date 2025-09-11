import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const q = searchParams.get('q')
    const sort = searchParams.get('sort')

    console.log('🔄 Challenges API: Fetching challenges with filters:', {
      category,
      difficulty, 
      q,
      sort
    })
    
    let query = supabase
      .from('challenges')
      .select(`
        id,
        category_id,
        title,
        description,
        difficulty,
        target_value,
        target_unit,
        duration_days,
        points_reward,
        is_premium,
        proof_required,
        is_active,
        created_at,
        updated_at,
        category:categories!inner(
          id,
          slug,
          name,
          icon,
          color,
          description
        )
      `)
      .eq('is_active', true)

    // Apply filters
    if (category) {
      query = query.eq('category.slug', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'points':
        query = query.order('points_reward', { ascending: false })
        break
      case 'difficulty':
        query = query.order('difficulty', { ascending: true })
        break
      default: // popular
        query = query.order('created_at', { ascending: false })
    }

    const { data: challenges, error } = await query

    if (error) {
      console.error('❌ Challenges API: Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        filters: { category, difficulty, q, sort }
      })
      return NextResponse.json(
        { 
          error: 'Failed to fetch challenges',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }

    console.log('✅ Challenges API: Successfully fetched', challenges?.length || 0, 'challenges')
    return NextResponse.json({ challenges: challenges || [] })
  } catch (error) {
    console.error('❌ Challenges API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data: challenge, error } = await supabase
      .from('challenges')
      .insert({ title })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ challenge })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}