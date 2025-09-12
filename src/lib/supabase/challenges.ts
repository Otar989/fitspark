import { createClient } from '@/lib/supabase/client'
import { 
  STORAGE_BUCKET,
  CHALLENGE_MESSAGES,
  type Challenge,
  type UserChallenge as UserChallengeType,
  type Proof as ProofType,
  type Category as CategoryType,
  type ChallengeCategory,
  type ChallengeDifficulty,
  type ChallengeStatus,
  type ChallengeUnit,
  type ProofType as ProofTypeEnum
} from '@/constants/challenges'

export interface DatabaseChallenge {
  id: string
  category_id: string
  title: string
  description: string
  difficulty: ChallengeDifficulty
  target_value: number
  target_unit: ChallengeUnit
  duration_days: number
  points_reward: number
  is_premium: boolean
  proof_required: ProofTypeEnum
  is_active: boolean
  created_at: string
  updated_at: string
  category?: DatabaseCategory
  participant_count?: number
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: ChallengeCategory
  icon: string
  color: string
  description: string
  created_at: string
}

export interface DatabaseUserChallenge {
  id: string
  user_id: string
  challenge_id: string
  joined_at: string
  completed_at?: string
  current_progress: number
  status: ChallengeStatus
  created_at: string
  updated_at: string
  challenge?: DatabaseChallenge
}

export interface DatabaseProof {
  id: string
  user_challenge_id: string
  proof_type: ProofTypeEnum
  proof_text?: string
  proof_number?: number
  file_url?: string
  submitted_at: string
  is_verified: boolean
  created_at: string
}

export interface ChallengeFilters {
  categorySlug?: ChallengeCategory
  difficulty?: ChallengeDifficulty
  q?: string
  sort?: 'popular' | 'newest' | 'points' | 'difficulty'
  status?: 'all' | 'active' | 'completed'
  premium?: boolean
}

export interface SubmitProofData {
  userId: string
  userChallengeId: string
  proofType: ProofTypeEnum
  proofText?: string
  proofNumber?: number
  file?: File
}

// Get all categories via API
export async function getCategories(): Promise<DatabaseCategory[]> {
  const response = await fetch('/api/categories')
  
  if (!response.ok) {
    throw new Error(CHALLENGE_MESSAGES.networkError)
  }

  const data = await response.json()
  return data.categories || []
}

// Get challenges with filters via API
export async function getChallenges(filters: ChallengeFilters = {}): Promise<DatabaseChallenge[]> {
  const params = new URLSearchParams()
  
  if (filters.categorySlug) params.append('category', filters.categorySlug)
  if (filters.difficulty) params.append('difficulty', filters.difficulty)
  if (filters.q) params.append('q', filters.q)
  if (filters.sort) params.append('sort', filters.sort)

  const response = await fetch(`/api/challenges?${params}`)
  
  if (!response.ok) {
    throw new Error(CHALLENGE_MESSAGES.networkError)
  }

  const data = await response.json()
  return data.challenges || []
}

// Get user's challenges via API
export async function getUserChallenges(userId?: string, status?: ChallengeStatus): Promise<DatabaseUserChallenge[]> {
  const params = new URLSearchParams()
  
  if (status) params.append('status', status)

  const response = await fetch(`/api/user-challenges?${params}`)
  
  if (!response.ok) {
    throw new Error(CHALLENGE_MESSAGES.networkError)
  }

  const data = await response.json()
  return data.userChallenges || []
}

// Join a challenge via API
export async function joinChallenge(challengeId: string): Promise<DatabaseUserChallenge> {
  const response = await fetch('/api/challenges/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ challengeId }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || CHALLENGE_MESSAGES.joinError)
  }

  return data.userChallenge
}

// Leave a challenge
export async function leaveChallenge(userId: string, challengeId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_challenges')
    .delete()
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)

  if (error) {
    console.error('Error leaving challenge:', error)
    throw new Error(CHALLENGE_MESSAGES.leaveError)
  }
}

// Submit proof via API
export async function submitProof(data: SubmitProofData): Promise<DatabaseProof> {
  const response = await fetch('/api/proofs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || CHALLENGE_MESSAGES.submitError)
  }

  return result.proof
}

// Update challenge progress after submitting proof
export async function updateChallengeProgress(userChallengeId: string): Promise<void> {
  const supabase = createClient()
  
  // Get user challenge with target info
  const { data: userChallenge, error: ucError } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenge:challenges(
        target_value,
        duration_days
      )
    `)
    .eq('id', userChallengeId)
    .single()

  if (ucError || !userChallenge) {
    console.error('Error fetching user challenge:', ucError)
    return
  }

  // Get all verified proofs for this user challenge
  const { data: proofs, error: proofsError } = await supabase
    .from('proofs')
    .select('proof_number, proof_type')
    .eq('user_challenge_id', userChallengeId)
    .eq('is_verified', true)

  if (proofsError) {
    console.error('Error fetching proofs:', proofsError)
    return
  }

  // Calculate current progress based on proof numbers
  const totalProgress = proofs?.reduce((sum, proof) => {
    return sum + (proof.proof_number || 0)
  }, 0) || 0

  const targetValue = userChallenge.challenge?.target_value || 0
  const progressPercentage = targetValue > 0 ? Math.min((totalProgress / targetValue) * 100, 100) : 0

  // Determine status
  let status: ChallengeStatus = 'active'
  if (progressPercentage >= 100) {
    status = 'completed'
  }

  // Update user challenge
  const { error: updateError } = await supabase
    .from('user_challenges')
    .update({ 
      current_progress: progressPercentage,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', userChallengeId)

  if (updateError) {
    console.error('Error updating user challenge progress:', updateError)
  }
}

// Get proofs for a user challenge
export async function getProofs(userChallengeId: string, limit = 10): Promise<DatabaseProof[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('proofs')
    .select('*')
    .eq('user_challenge_id', userChallengeId)
    .order('submitted_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching proofs:', error)
    throw new Error(CHALLENGE_MESSAGES.networkError)
  }

  return data || []
}

// Get single challenge details
export async function getChallenge(challengeId: string, userId?: string): Promise<DatabaseChallenge | null> {
  const supabase = createClient()
  
  let query
  
  // Add user challenge info if userId provided
  if (userId) {
    query = supabase
      .from('challenges')
      .select(`
        *,
        category:categories(
          id,
          name,
          slug,
          icon,
          color,
          description
        ),
        user_challenges!left(
          id,
          status,
          current_progress,
          joined_at,
          completed_at
        )
      `)
      .eq('id', challengeId)
  } else {
    query = supabase
      .from('challenges')
      .select(`
        *,
        category:categories(
          id,
          name,
          slug,
          icon,
          color,
          description
        )
      `)
      .eq('id', challengeId)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error('Error fetching challenge:', error)
    return null
  }

  return data
}
