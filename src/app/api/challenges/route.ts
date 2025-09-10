import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockChallenges } from '@/lib/mock-data'

export async function GET() {
  try {
    // Try to use real Supabase first
    const supabase = createClient()
    
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('Supabase error, using mock data:', error.message)
      return NextResponse.json({ challenges: mockChallenges })
    }

    return NextResponse.json({ challenges })
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return NextResponse.json({ challenges: mockChallenges })
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