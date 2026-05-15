-- Run in Supabase SQL Editor (Table Editor → users will appear after success)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  image text,
  created_at timestamptz not null default now()
);
