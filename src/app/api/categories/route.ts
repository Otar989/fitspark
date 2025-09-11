import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔄 Categories API: Fetching categories...')
    const supabase = createClient()
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        id,
        slug,
        name,
        icon,
        color,
        description,
        created_at
      `)
      .order('name', { ascending: true })

    if (error) {
      console.error('❌ Categories API: Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { 
          error: 'Failed to fetch categories',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, 
        { status: 500 }
      )
    }

    console.log('✅ Categories API: Successfully fetched', categories?.length || 0, 'categories')
    return NextResponse.json({ categories: categories || [] })
  } catch (error) {
    console.error('❌ Categories API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}
