-- ═══════════════════════════════════════════════════════════════════════════
-- NOVANA — Settings migration
-- Run every statement in Supabase SQL Editor (paste all, click Run)
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE everywhere
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Add new columns to profiles ───────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name  TEXT,
  ADD COLUMN IF NOT EXISTS pronouns      TEXT,
  ADD COLUMN IF NOT EXISTS cycle_length  INTEGER DEFAULT 28,
  ADD COLUMN IF NOT EXISTS period_length INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS paused        BOOLEAN DEFAULT false;

-- ── 2. Create user_preferences table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  encrypt_logs         BOOLEAN DEFAULT false,
  anonymous_research   BOOLEAN DEFAULT false,
  local_ai             BOOLEAN DEFAULT false,
  notif_daily_log      BOOLEAN DEFAULT true,
  notif_weekly_summary BOOLEAN DEFAULT true,
  notif_cycle_phase    BOOLEAN DEFAULT true,
  notif_journal_invite BOOLEAN DEFAULT false,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Full CRUD for own row
CREATE POLICY "Users manage own preferences"
  ON public.user_preferences FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── 3. delete_own_account RPC (SECURITY DEFINER so it can touch auth.users) ──
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_preferences WHERE user_id  = auth.uid();
  DELETE FROM public.symptoms          WHERE user_id  = auth.uid();
  DELETE FROM public.journal_entries   WHERE user_id  = auth.uid();
  DELETE FROM public.profiles          WHERE id        = auth.uid();
  DELETE FROM auth.users               WHERE id        = auth.uid();
END;
$$;
