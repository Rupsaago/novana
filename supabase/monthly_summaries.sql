-- Run this in Supabase SQL Editor to create the monthly_summaries table
-- Required for the Monthly Reports feature (GET/POST /api/reports)

create table if not exists public.monthly_summaries (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  month         text not null,           -- "2026-04" format
  summary_text  text not null,
  averages_json jsonb,
  created_at    timestamptz default now()
);

-- Unique constraint so we can upsert by user_id + month
create unique index if not exists monthly_summaries_user_month_idx
  on public.monthly_summaries (user_id, month);

-- Row-level security
alter table public.monthly_summaries enable row level security;

create policy "Users can read own summaries"
  on public.monthly_summaries for select
  using (auth.uid() = user_id);

create policy "Users can insert own summaries"
  on public.monthly_summaries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own summaries"
  on public.monthly_summaries for update
  using (auth.uid() = user_id);
