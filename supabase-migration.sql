-- FitSpark Database Migration Script
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS proofs CASCADE;
DROP TABLE IF EXISTS user_challenges CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '🎯',
    color TEXT DEFAULT 'from-purple-500 to-indigo-500',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    target_value INTEGER DEFAULT 1,
    target_unit TEXT DEFAULT 'times',
    duration_days INTEGER DEFAULT 30,
    points_reward INTEGER DEFAULT 10,
    is_premium BOOLEAN DEFAULT FALSE,
    proof_required TEXT DEFAULT 'text' CHECK (proof_required IN ('text', 'photo', 'video', 'number')),
    is_active BOOLEAN DEFAULT TRUE,
    tasks JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_challenges table
CREATE TABLE user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    current_progress DECIMAL(5,2) DEFAULT 0.00 CHECK (current_progress >= 0 AND current_progress <= 100),
    status TEXT DEFAULT 'active' CHECK (status IN ('not_joined', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Create proofs table
CREATE TABLE proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_challenge_id UUID NOT NULL REFERENCES user_challenges(id) ON DELETE CASCADE,
    proof_type TEXT DEFAULT 'text' CHECK (proof_type IN ('text', 'photo', 'video', 'number')),
    proof_text TEXT,
    proof_number DECIMAL,
    file_url TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_challenges_category_id ON challenges(category_id);
CREATE INDEX idx_challenges_is_active ON challenges(is_active);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_status ON user_challenges(status);
CREATE INDEX idx_proofs_user_challenge_id ON proofs(user_challenge_id);
CREATE INDEX idx_proofs_submitted_at ON proofs(submitted_at);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

-- RLS Policies for challenges (public read for active challenges)
CREATE POLICY "Allow public read access to active challenges" ON challenges
    FOR SELECT USING (is_active = true);

-- RLS Policies for user_challenges (users can only see their own)
CREATE POLICY "Users can view their own challenges" ON user_challenges
    FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can insert their own challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can update their own challenges" ON user_challenges
    FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete their own challenges" ON user_challenges
    FOR DELETE USING (auth.uid()::uuid = user_id);

-- RLS Policies for proofs (users can only see their own)
CREATE POLICY "Users can view proofs for their challenges" ON proofs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_challenges uc 
            WHERE uc.id = proofs.user_challenge_id 
            AND uc.user_id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can insert proofs for their challenges" ON proofs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_challenges uc 
            WHERE uc.id = proofs.user_challenge_id 
            AND uc.user_id = auth.uid()::uuid
        )
    );

-- Create Storage bucket for proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proofs', 'proofs', false);

-- Storage policies for proofs bucket
CREATE POLICY "Users can upload proofs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'proofs' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own proofs" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'proofs' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Insert seed data for categories
INSERT INTO categories (slug, name, icon, color, description) VALUES
    ('fitness', 'Фитнес', '💪', 'from-orange-500 to-red-500', 'Физические упражнения и активность'),
    ('nutrition', 'Питание', '🥗', 'from-green-500 to-emerald-500', 'Здоровое питание и диета'),
    ('mindfulness', 'Медитация', '🧘', 'from-purple-500 to-indigo-500', 'Ментальное здоровье и осознанность'),
    ('habits', 'Привычки', '⭐', 'from-blue-500 to-cyan-500', 'Полезные повседневные привычки'),
    ('social', 'Социальные', '👥', 'from-pink-500 to-rose-500', 'Социальные активности и общение'),
    ('learning', 'Обучение', '📚', 'from-yellow-500 to-orange-500', 'Обучение и развитие навыков'),
    ('creativity', 'Творчество', '🎨', 'from-violet-500 to-purple-500', 'Творческие активности и хобби')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    description = EXCLUDED.description;

-- Insert seed data for challenges
WITH category_ids AS (
    SELECT slug, id FROM categories
)
INSERT INTO challenges (category_id, title, description, difficulty, target_value, target_unit, duration_days, points_reward, is_premium, proof_required) VALUES
    -- Fitness challenges
    ((SELECT id FROM category_ids WHERE slug = 'fitness'), '10000 шагов в день', 'Проходите 10000 шагов каждый день для поддержания активности', 'easy', 10000, 'steps', 7, 50, false, 'number'),
    ((SELECT id FROM category_ids WHERE slug = 'fitness'), '30 отжиманий', 'Сделайте 30 отжиманий для укрепления верхней части тела', 'medium', 30, 'times', 14, 100, false, 'number'),
    ((SELECT id FROM category_ids WHERE slug = 'fitness'), 'Пробежка 5км', 'Пробежите 5 километров для улучшения выносливости', 'hard', 5, 'kilometers', 21, 200, true, 'photo'),
    
    -- Nutrition challenges  
    ((SELECT id FROM category_ids WHERE slug = 'nutrition'), '2 литра воды в день', 'Выпивайте 2 литра воды ежедневно для поддержания гидратации', 'easy', 2, 'liters', 7, 30, false, 'number'),
    ((SELECT id FROM category_ids WHERE slug = 'nutrition'), '5 порций овощей и фруктов', 'Съедайте 5 порций овощей и фруктов каждый день', 'medium', 5, 'servings', 14, 80, false, 'photo'),
    
    -- Mindfulness challenges
    ((SELECT id FROM category_ids WHERE slug = 'mindfulness'), 'Медитация 10 минут', 'Медитируйте по 10 минут каждый день для ментального здоровья', 'easy', 10, 'minutes', 7, 40, false, 'text'),
    ((SELECT id FROM category_ids WHERE slug = 'mindfulness'), '8 часов сна', 'Спите не менее 8 часов для восстановления организма', 'medium', 8, 'hours', 14, 60, false, 'text'),
    
    -- Learning challenges
    ((SELECT id FROM category_ids WHERE slug = 'learning'), 'Чтение 20 страниц', 'Читайте по 20 страниц книги каждый день', 'easy', 20, 'pages', 7, 35, false, 'text'),
    ((SELECT id FROM category_ids WHERE slug = 'learning'), 'Изучение 10 новых слов', 'Изучайте 10 новых слов на иностранном языке', 'medium', 10, 'words', 14, 70, false, 'text')
ON CONFLICT DO NOTHING;

COMMIT;