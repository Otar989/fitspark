import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const evaluateSchema = z.object({
  userId: z.string().uuid(),
  challengeId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { userId, challengeId } = evaluateSchema.parse(body)

    // Get all badges that user hasn't earned yet
    const { data: availableBadges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .not('id', 'in', `(
        SELECT badge_id FROM user_badges WHERE user_id = '${userId}'
      )`)

    if (badgesError) {
      throw badgesError
    }

    const newBadges = []

    for (const badge of availableBadges || []) {
      let shouldEarn = false

      switch (badge.requirement_type) {
        case 'total':
          // Check total completions
          const { count } = await supabase
            .from('completions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)

          if (count && count >= badge.requirement_value) {
            shouldEarn = true
          }
          break

        case 'streak':
          // Check current streak (simplified - would need more complex logic for real streaks)
          const { data: recentCompletions } = await supabase
            .from('completions')
            .select('completed_at')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false })
            .limit(badge.requirement_value)

          if (recentCompletions && recentCompletions.length >= badge.requirement_value) {
            shouldEarn = true
          }
          break

        case 'challenge_complete':
          // Check if specific challenge was completed
          if (challengeId && badge.challenge_id === challengeId) {
            const { data: completion } = await supabase
              .from('completions')
              .select('id')
              .eq('user_id', userId)
              .eq('challenge_id', challengeId)
              .single()

            if (completion) {
              shouldEarn = true
            }
          }
          break
      }

      if (shouldEarn) {
        const { error: earnError } = await supabase
          .from('user_badges')
          .insert({
            user_id: userId,
            badge_id: badge.id
          })

        if (!earnError) {
          newBadges.push(badge)
        }
      }
    }

    return NextResponse.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 ? `Earned ${newBadges.length} new badge(s)!` : 'No new badges earned'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error evaluating badges:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate badges', success: false },
      { status: 500 }
    )
  }
}