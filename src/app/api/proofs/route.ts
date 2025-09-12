import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateChallengeProgress } from '@/lib/supabase/challenges'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userChallengeId, proofType, proofText, proofNumber, file } = body

    console.log('🔄 Submit Proof API: Processing proof submission:', {
      userChallengeId,
      proofType,
      userId: user.id
    })

    if (!userChallengeId || !proofType) {
      return NextResponse.json(
        { error: 'User challenge ID and proof type are required' }, 
        { status: 400 }
      )
    }

    // Verify user owns this challenge
    const { data: userChallenge, error: challengeError } = await supabase
      .from('user_challenges')
      .select(`
        id,
        status,
        challenge:challenges(
          id,
          title,
          target_value,
          target_unit,
          proof_required
        )
      `)
      .eq('id', userChallengeId)
      .eq('user_id', user.id)
      .single()

    if (challengeError || !userChallenge) {
      console.error('❌ Submit Proof API: User challenge not found:', challengeError?.message)
      return NextResponse.json(
        { error: 'User challenge not found' }, 
        { status: 404 }
      )
    }

    if (userChallenge.status !== 'active') {
      return NextResponse.json(
        { error: 'Challenge is not active' }, 
        { status: 400 }
      )
    }

    // Create proof record
    const proofData: any = {
      user_challenge_id: userChallengeId,
      proof_type: proofType,
      submitted_at: new Date().toISOString(),
      is_verified: true // Auto-verify for now
    }

    // Add proof content based on type
    if (proofType === 'text' && proofText) {
      proofData.proof_text = proofText
    }
    
    if (proofType === 'number' && proofNumber !== undefined) {
      proofData.proof_number = proofNumber
    }

    if (proofType === 'photo' || proofType === 'video') {
      // TODO: Handle file upload to Supabase storage
      // For now, just store as text placeholder
      proofData.proof_text = proofText || 'File uploaded'
    }

    const { data: proof, error: proofError } = await supabase
      .from('proofs')
      .insert(proofData)
      .select()
      .single()

    if (proofError) {
      console.error('❌ Submit Proof API: Error creating proof:', proofError.message)
      return NextResponse.json(
        { error: 'Failed to submit proof' }, 
        { status: 500 }
      )
    }

    console.log('✅ Submit Proof API: Proof created:', proof.id)

    // Update challenge progress
    try {
      await updateChallengeProgress(userChallengeId)
      console.log('✅ Submit Proof API: Challenge progress updated')
    } catch (progressError) {
      console.error('❌ Submit Proof API: Error updating progress:', progressError)
      // Don't fail the request if progress update fails
    }

    return NextResponse.json({ 
      message: 'Proof submitted successfully',
      proof 
    })
  } catch (error) {
    console.error('❌ Submit Proof API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}