export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          slug: string
          category: 'steps' | 'water' | 'strength' | 'stretch' | 'sleep' | 'misc'
          description: string | null
          unit: string
          target: number
          period: 'daily' | 'weekly'
          premium: boolean
          image_url: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: 'steps' | 'water' | 'strength' | 'stretch' | 'sleep' | 'misc'
          description?: string | null
          unit: string
          target: number
          period?: 'daily' | 'weekly'
          premium?: boolean
          image_url?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: 'steps' | 'water' | 'strength' | 'stretch' | 'sleep' | 'misc'
          description?: string | null
          unit?: string
          target?: number
          period?: 'daily' | 'weekly'
          premium?: boolean
          image_url?: string | null
          active?: boolean
          created_at?: string
        }
      }
      user_challenge: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          start_date: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          start_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          start_date?: string
        }
      }
      completions: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          value: number
          proof_url: string | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          value: number
          proof_url?: string | null
          completed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          value?: number
          proof_url?: string | null
          completed_at?: string
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          code: string
          title: string
          description?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          image_url?: string | null
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          awarded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          awarded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          awarded_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          provider: string | null
          status: string | null
          current_period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider?: string | null
          status?: string | null
          current_period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string | null
          status?: string | null
          current_period_end?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard_week: {
        Row: {
          user_id: string
          points: number
          week_start: string
        }
      }
    }
  }
}

export type Challenge = Database['public']['Tables']['challenges']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Completion = Database['public']['Tables']['completions']['Row']
export type UserChallenge = Database['public']['Tables']['user_challenge']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type LeaderboardEntry = Database['public']['Views']['leaderboard_week']['Row']