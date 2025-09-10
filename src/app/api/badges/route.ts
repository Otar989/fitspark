import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Mock badges data for fallback
const mockBadges = [
  {
    id: '1',
    name: 'Первые шаги',
    description: 'Завершите свой первый челлендж',
    icon: '🌟',
    requirement_type: 'total',
    requirement_value: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Активист',
    description: 'Завершите 10 челленджей',
    icon: '🔥',
    requirement_type: 'total',
    requirement_value: 10,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Серийник',
    description: 'Выполните челлендж 7 дней подряд',
    icon: '⚡',
    requirement_type: 'streak',
    requirement_value: 7,
    created_at: new Date().toISOString()
  }
]

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: badges, error } = await supabase
      .from('badges')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('Supabase error, using mock data:', error.message)
      return NextResponse.json({ badges: mockBadges })
    }

    return NextResponse.json({ badges })
  } catch (error) {
    console.warn('Supabase connection failed, using mock data:', error)
    return NextResponse.json({ badges: mockBadges })
  }
}