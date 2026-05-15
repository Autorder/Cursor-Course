-- Links each API key to the user who owns it (users table from Google sign-in).
-- Run in Supabase SQL Editor after 001_create_users_table.sql

alter table public.api_keys
  add column if not exists user_id uuid references public.users(id);

create index if not exists api_keys_user_id_idx on public.api_keys (user_id);
