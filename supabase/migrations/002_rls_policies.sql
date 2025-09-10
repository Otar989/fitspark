-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth_id = auth.uid());

-- Challenges policies (read-only for all authenticated users)
CREATE POLICY "Everyone can view active challenges" ON public.challenges
    FOR SELECT USING (active = true);

-- User challenge policies
CREATE POLICY "Users can view own challenge subscriptions" ON public.user_challenge
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own challenge subscriptions" ON public.user_challenge
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

-- Completions policies
CREATE POLICY "Users can view own completions" ON public.completions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own completions" ON public.completions
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

-- Badges policies (read-only for all authenticated users)
CREATE POLICY "Everyone can view badges" ON public.badges
    FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Users can view own badges" ON public.user_badges
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Service can award badges" ON public.user_badges
    FOR INSERT WITH CHECK (true);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.users WHERE auth_id = auth.uid()
        )
    );

-- Promo codes policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view active promo codes" ON public.promo_codes
    FOR SELECT USING (active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Create a function to get current user ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id
    FROM public.users
    WHERE auth_id = auth.uid();
    
    RETURN user_id;
END;
$$;

-- Grant necessary permissions
GRANT SELECT ON public.leaderboard_week TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_leaderboard_week() TO service_role;