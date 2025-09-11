import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Proofs API: Processing proof submission...')
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Proofs API: Authentication failed:', authError?.message)
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userChallengeId, proofType, proofText, proofNumber, file } = body

    console.log('🔄 Proofs API: Proof data received:', {
      userChallengeId,
      proofType,
      hasText: !!proofText,
      hasNumber: !!proofNumber,
      hasFile: !!file
    })

    if (!userChallengeId || !proofType) {
      console.error('❌ Proofs API: Missing required fields')
      return NextResponse.json(
        { error: 'userChallengeId and proofType are required' }, 
        { status: 400 }
      )
    }

    // Verify user owns this challenge
    const { data: userChallenge, error: challengeError } = await supabase
      .from('user_challenges')
      .select('id, user_id, status')
      .eq('id', userChallengeId)
      .eq('user_id', user.id)
      .single()

    if (challengeError || !userChallenge) {
      console.error('❌ Proofs API: User challenge not found:', challengeError?.message)
      return NextResponse.json(
        { error: 'User challenge not found or access denied' }, 
        { status: 404 }
      )
    }

    if (userChallenge.status !== 'active') {
      console.error('❌ Proofs API: Challenge not active:', userChallenge.status)
      return NextResponse.json(
        { error: 'Challenge is not active' }, 
        { status: 400 }
      )
    }

    let fileUrl: string | undefined

    // Handle file upload if provided
    if (file && (proofType === 'photo' || proofType === 'video')) {
      console.log('🔄 Proofs API: Processing file upload...')
      
      // Convert base64 to file if needed (this is a simplified example)
      // In a real implementation, you'd handle multipart/form-data or base64
      const fileExt = proofType === 'photo' ? 'jpg' : 'mp4'
      const fileName = `${user.id}/${userChallengeId}/${Date.now()}.${fileExt}`
      
      try {
        // This is a placeholder - you'd need to handle actual file upload
        // For now, we'll just set a placeholder URL
        fileUrl = `https://placeholder.supabase.co/storage/v1/object/public/proofs/${fileName}`
        console.log('📁 Proofs API: File upload simulated:', fileUrl)
      } catch (uploadError) {
        console.error('❌ Proofs API: File upload failed:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload file' }, 
          { status: 500 }
        )
      }
    }

    // Create proof record
    const { data: proof, error: insertError } = await supabase
      .from('proofs')
      .insert({
        user_challenge_id: userChallengeId,
        proof_type: proofType,
        proof_text: proofText || null,
        proof_number: proofNumber || null,
        file_url: fileUrl || null,
        submitted_at: new Date().toISOString(),
        is_verified: false
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Proofs API: Error creating proof:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      })
      return NextResponse.json(
        { 
          error: 'Failed to create proof',
          details: process.env.NODE_ENV === 'development' ? insertError.message : undefined
        }, 
        { status: 500 }
      )
    }

    // Update challenge progress (simplified)
    const progressIncrement = proofNumber || 1
    const { error: updateError } = await supabase.rpc('update_challenge_progress', {
      user_challenge_id: userChallengeId,
      progress_increment: progressIncrement
    }).single()

    if (updateError) {
      console.warn('⚠️ Proofs API: Could not update progress (non-critical):', updateError.message)
    }

    console.log('✅ Proofs API: Proof submitted successfully:', proof.id)
    return NextResponse.json({ 
      message: 'Proof submitted successfully',
      proof
    })
  } catch (error) {
    console.error('❌ Proofs API: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, 
      { status: 500 }
    )
  }
}
