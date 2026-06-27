-- Run this in Supabase SQL Editor
-- Adds period_start_date to profiles table for real cycle day calculation

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS period_start_date DATE;

-- Optional index for quick lookup
CREATE INDEX IF NOT EXISTS profiles_period_start_date_idx
  ON public.profiles (period_start_date)
  WHERE period_start_date IS NOT NULL;
