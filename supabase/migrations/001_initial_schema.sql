-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create tables
-- Users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges table  
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT CHECK (category IN ('steps','water','strength','stretch','sleep','misc')) NOT NULL,
  description TEXT,
  unit TEXT NOT NULL,
  target INTEGER NOT NULL,
  period TEXT CHECK (period IN ('daily','weekly')) DEFAULT 'daily',
  premium BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User challenge subscriptions
CREATE TABLE public.user_challenge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  start_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, challenge_id)
);

-- Challenge completions
CREATE TABLE public.completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  value INTEGER NOT NULL,
  proof_url TEXT,
  completed_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id, completed_at)
);

-- Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

-- User badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  percent INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leaderboard materialized view
CREATE MATERIALIZED VIEW public.leaderboard_week AS
SELECT 
  u.id as user_id,
  u.name,
  u.avatar_url,
  SUM(LEAST(c.value::FLOAT / GREATEST(ch.target,1) * 100, 100))::INTEGER as points,
  DATE_TRUNC('week', c.completed_at) as week_start
FROM public.completions c
JOIN public.challenges ch ON ch.id = c.challenge_id
JOIN public.users u ON u.id = c.user_id
GROUP BY u.id, u.name, u.avatar_url, DATE_TRUNC('week', c.completed_at);

-- Create unique index for better performance
CREATE UNIQUE INDEX leaderboard_week_user_week_idx ON public.leaderboard_week (user_id, week_start);

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_leaderboard_week()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_week;
END;
$$;