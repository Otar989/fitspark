import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET } from '@/constants/challenges'

export interface Category {
  id: string
  slug: string
  name: string
  created_at: string
}

export interface Challenge {
  id: string
  category_id: string
  title: string
  short?: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  target: number
  unit: string
  icon: string
  image_url?: string
  premium: boolean
  is_active: boolean
  duration_days: number
  points: number
  tasks?: any
  created_at: string
  category?: Category
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  progress: any[] // Array of { day: number, value: number|null, proof_url?: string, media_url?: string, created_at: string }
  started_at: string
  completed_at?: string
  created_at: string
  challenge?: Challenge
}

export interface Proof {
  id: string
  user_id: string
  challenge_id: string
  user_challenge_id: string
  day: number
  value: number
  proof_url?: string
  media_url?: string
  created_at: string
}

export interface ChallengeFilters {
  categorySlug?: string
  difficulty?: string
  q?: string
  sort?: 'popular' | 'newest' | 'points' | 'difficulty'
}

export interface SubmitProofData {
  userId: string
  challengeId: string
  day: number
  value: number
  proofUrl?: string
  file?: File
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }

  return data || []
}

// Get challenges with filters
export async function getChallenges(filters: ChallengeFilters = {}): Promise<Challenge[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('challenges')
    .select(`
      *,
      category:categories(
        id,
        slug,
        name
      )
    `)
    .eq('is_active', true)

  // Apply filters
  if (filters.categorySlug) {
    query = query.eq('category.slug', filters.categorySlug)
  }

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }

  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,short.ilike.%${filters.q}%,description.ilike.%${filters.q}%`)
  }

  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'points':
      query = query.order('points', { ascending: false })
      break
    case 'difficulty':
      query = query.order('difficulty', { ascending: true })
      break
    default: // popular
      query = query.order('created_at', { ascending: true })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching challenges:', error)
    throw new Error('Failed to fetch challenges')
  }

  return data || []
}

// Get user's challenges
export async function getUserChallenges(userId: string): Promise<UserChallenge[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_challenge')
    .select(`
      *,
      challenge:challenges(
        *,
        category:categories(
          id,
          slug,
          name
        )
      )
    `)
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (error) {
    console.error('Error fetching user challenges:', error)
    throw new Error('Failed to fetch user challenges')
  }

  return data || []
}

// Join a challenge
export async function joinChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_challenge')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      started_at: new Date().toISOString()
    })
    .select(`
      *,
      challenge:challenges(
        *,
        category:categories(
          id,
          slug,
          name
        )
      )
    `)
    .single()

  if (error) {
    console.error('Error joining challenge:', error)
    throw new Error('Failed to join challenge')
  }

  return data
}

// Submit proof for a challenge
export async function submitProof(data: SubmitProofData): Promise<Proof> {
  const supabase = createClient()
  
  let mediaUrl: string | undefined
  let proofUrl = data.proofUrl

  // Upload file if provided
  if (data.file) {
    const fileExt = data.file.name.split('.').pop()
    const fileName = `${data.userId}/${data.challengeId}/${data.day}-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, data.file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      throw new Error('Failed to upload file')
    }

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)

    mediaUrl = publicUrl
  }

  // Get user_challenge_id
  const { data: userChallenge, error: userChallengeError } = await supabase
    .from('user_challenge')
    .select('id')
    .eq('user_id', data.userId)
    .eq('challenge_id', data.challengeId)
    .single()

  if (userChallengeError) {
    console.error('Error finding user challenge:', userChallengeError)
    throw new Error('User challenge not found')
  }

  // Insert proof
  const { data: proof, error: proofError } = await supabase
    .from('proofs')
    .insert({
      user_id: data.userId,
      challenge_id: data.challengeId,
      user_challenge_id: userChallenge.id,
      day: data.day,
      value: data.value,
      proof_url: proofUrl,
      media_url: mediaUrl
    })
    .select()
    .single()

  if (proofError) {
    console.error('Error creating proof:', proofError)
    throw new Error('Failed to create proof')
  }

  // Update progress
  await computeProgress(data.userId, data.challengeId)

  return proof
}

// Compute progress for a challenge
export async function computeProgress(userId: string, challengeId: string): Promise<void> {
  const supabase = createClient()
  
  // Get challenge duration
  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('duration_days')
    .eq('id', challengeId)
    .single()

  if (challengeError) {
    console.error('Error fetching challenge:', challengeError)
    return
  }

  // Get all proofs for this challenge
  const { data: proofs, error: proofsError } = await supabase
    .from('proofs')
    .select('day, value, proof_url, media_url, created_at')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .order('day', { ascending: true })

  if (proofsError) {
    console.error('Error fetching proofs:', proofsError)
    return
  }

  // Create progress array
  const progress = Array.from({ length: challenge.duration_days }, (_, index) => {
    const day = index + 1
    const proof = proofs?.find(p => p.day === day)
    
    return {
      day,
      value: proof?.value || null,
      proof_url: proof?.proof_url || null,
      media_url: proof?.media_url || null,
      created_at: proof?.created_at || null
    }
  })

  // Update user_challenge progress
  const { error: updateError } = await supabase
    .from('user_challenge')
    .update({ progress })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)

  if (updateError) {
    console.error('Error updating progress:', updateError)
  }

  // Check if challenge is completed (all days have values)
  const completedDays = progress.filter(p => p.value !== null).length
  if (completedDays === challenge.duration_days) {
    await supabase
      .from('user_challenge')
      .update({ completed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
  }
}

// Get proofs for a challenge
export async function getProofs(userId: string, challengeId: string): Promise<Proof[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('proofs')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .order('day', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching proofs:', error)
    throw new Error('Failed to fetch proofs')
  }

  return data || []
}
