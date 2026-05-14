-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null default 'dev',
  usage integer not null default 0,
  key text not null unique,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security (optional — service role key bypasses RLS)
alter table api_keys enable row level security;
