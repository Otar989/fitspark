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

    const { data: userChallenges, error } = await supabase
      .from('user_challenge')
      .select('*')
      .eq('user_id', user.id)

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