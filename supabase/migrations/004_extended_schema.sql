-- Extended schema with complete FitSpark functionality

-- Users table (main users table)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique not null references auth.users(id) on delete cascade,
  username text unique,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Extended challenges table
alter table challenges add column if not exists description text;
alter table challenges add column if not exists target int default 1;
alter table challenges add column if not exists unit text default 'times';
alter table challenges add column if not exists icon text default '🎯';
alter table challenges add column if not exists category text default 'general';
alter table challenges add column if not exists premium boolean default false;
alter table challenges add column if not exists active boolean default true;
alter table challenges add column if not exists duration_days int default 30;

-- User challenge subscriptions
create table if not exists user_challenge (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  completed boolean default false,
  created_at timestamptz not null default now(),
  unique(user_id, challenge_id)
);

-- Challenge completions
create table if not exists completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  value decimal not null default 1,
  proof_url text,
  completed_at date not null default current_date,
  points int not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, challenge_id, completed_at)
);

-- Subscriptions table for premium features
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Badges system
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text default '🏆',
  requirement_type text not null check (requirement_type in ('streak', 'total', 'challenge_complete')),
  requirement_value int not null,
  challenge_id uuid references challenges(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- User badges
create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- Update user_scores to reference users table
alter table user_scores drop constraint if exists user_scores_pkey;
alter table user_scores add column if not exists id uuid primary key default gen_random_uuid();
alter table user_scores add constraint user_scores_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

-- Update profiles to reference auth.users
alter table profiles add constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade;

-- Create indexes for better performance
create index if not exists idx_user_challenge_user_id on user_challenge(user_id);
create index if not exists idx_user_challenge_challenge_id on user_challenge(challenge_id);
create index if not exists idx_completions_user_id on completions(user_id);
create index if not exists idx_completions_challenge_id on completions(challenge_id);
create index if not exists idx_completions_completed_at on completions(completed_at);
create index if not exists idx_users_auth_id on users(auth_id);
create index if not exists idx_user_scores_user_id on user_scores(user_id);

-- Create or replace leaderboard view with weekly data
create or replace view leaderboard_view as
select 
  coalesce(u.username, left(cast(u.id as text), 8)) as username,
  u.id as user_id,
  coalesce(weekly_points.points, 0) as weekly_points,
  coalesce(us.score, 0) as total_score
from users u
left join user_scores us on us.user_id = u.id
left join (
  select 
    c.user_id,
    sum(c.points) as points
  from completions c
  where c.completed_at >= date_trunc('week', current_date)
  group by c.user_id
) weekly_points on weekly_points.user_id = u.id
where coalesce(weekly_points.points, 0) > 0 or coalesce(us.score, 0) > 0
order by weekly_points.points desc nulls last, us.score desc nulls last;

-- Function to refresh leaderboard (for API calls)
create or replace function refresh_leaderboard_week()
returns void
language plpgsql
as $$
begin
  -- This is a placeholder function for manual leaderboard refresh
  -- In a real implementation, you might want to use materialized views
  -- or update aggregate tables here
  return;
end;
$$;

-- Function to update user scores based on completions
create or replace function update_user_total_score()
returns trigger
language plpgsql
as $$
begin
  -- Update total score when completion is added/updated
  insert into user_scores (user_id, score)
  select 
    NEW.user_id,
    coalesce(sum(points), 0)
  from completions 
  where user_id = NEW.user_id
  on conflict (user_id) do update set
    score = (
      select coalesce(sum(points), 0)
      from completions 
      where user_id = NEW.user_id
    );
  return NEW;
end;
$$;

-- Trigger to automatically update user scores
drop trigger if exists trigger_update_user_score on completions;
create trigger trigger_update_user_score
  after insert or update on completions
  for each row execute function update_user_total_score();