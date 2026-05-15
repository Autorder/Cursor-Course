-- Per-key request quota for rate limiting (e.g. github-summarizer / LLM calls)
alter table public.api_keys
  add column if not exists "limit" integer not null default 200;
