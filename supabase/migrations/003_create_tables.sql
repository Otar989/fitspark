-- Create extension for UUID generation
create extension if not exists pgcrypto;

-- challenges table
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now()
);

-- profiles table
create table if not exists profiles (
  id uuid primary key,
  username text,
  updated_at timestamptz not null default now()
);

-- user_scores table
create table if not exists user_scores (
  user_id uuid primary key,
  score int not null default 0
);

-- leaderboard_view
create or replace view leaderboard_view as
select coalesce(p.username, left(cast(s.user_id as text), 8)) as username,
       s.user_id,
       s.score
from user_scores s
left join profiles p on p.id = s.user_id
order by s.score desc;
