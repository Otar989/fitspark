import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user record
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: userChallenges, error } = await supabase
      .from('user_challenge')
      .select(`
        *,
        challenge:challenges(
          id,
          title,
          short,
          description,
          difficulty,
          duration_days,
          points,
          icon,
          image_url,
          premium,
          category:categories(
            id,
            slug,
            name
          )
        )
      `)
      .eq('user_id', userData.id)
      .order('started_at', { ascending: false })

    if (error) {
      console.error('Error fetching user challenges:', error)
      return NextResponse.json({ userChallenges: [] })
    }

    return NextResponse.json({ userChallenges })
  } catch (error) {
    console.error('Error in user-challenges API:', error)
    return NextResponse.json({ userChallenges: [] })
  }
}