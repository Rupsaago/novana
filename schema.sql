-- ═══════════════════════════════════════════════════════════════════════════
-- NOVANA — Complete Supabase SQL Schema
-- ═══════════════════════════════════════════════════════════════════════════
--
-- HOW TO USE THIS FILE:
--   1. Go to supabase.com → your project → left sidebar → "SQL Editor"
--   2. Click "New query"
--   3. Copy EVERYTHING in this file and paste it into the editor
--   4. Click the green "Run" button (or press Ctrl+Enter / Cmd+Enter)
--   5. You should see "Success. No rows returned" — that means it worked!
--
-- You only need to run this ONCE. Running it again is safe because we use
-- "IF NOT EXISTS" everywhere — it won't break anything.
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 1: ENABLE EXTENSIONS
-- ───────────────────────────────────────────────────────────────────────────
-- "uuid-ossp" lets us auto-generate unique IDs for every row.
-- Think of a UUID as a unique serial number like "a3f9-42bc-..."

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 2: PROFILES TABLE
-- ───────────────────────────────────────────────────────────────────────────
-- Stores public user info (name, email).
-- The "id" column links directly to Supabase's built-in auth.users table.
-- When someone signs up, Supabase creates an auth.users row automatically.
-- We then mirror it here so we can store extra info like their name.

CREATE TABLE IF NOT EXISTS public.profiles (
  -- id: same UUID as auth.users — the link between auth and our data
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- email: copied from auth for easy access (kept in sync by a trigger below)
  email       TEXT NOT NULL,

  -- full_name: optional, filled in after signup
  full_name   TEXT,

  -- created_at: automatically set to "right now" when the row is created
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- updated_at: we'll update this whenever the profile changes
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add a comment so you can see what this table is for in the Supabase UI
COMMENT ON TABLE public.profiles IS
  'One row per user. Mirrors auth.users and stores extra profile info.';


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 3: SYMPTOMS TABLE
-- ───────────────────────────────────────────────────────────────────────────
-- The core table. Every daily check-in creates one row here.
-- A user can have many symptom rows — one per day they log.

CREATE TABLE IF NOT EXISTS public.symptoms (
  -- id: auto-generated unique ID for each log entry
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- user_id: which user this log belongs to
  -- ON DELETE CASCADE = if user deletes their account, their data is also deleted
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- logged_at: the DATE (not datetime) this entry is for — defaults to today
  -- Using DATE type means one entry per calendar day makes logical sense
  logged_at     DATE NOT NULL DEFAULT CURRENT_DATE,

  -- ── The 8 symptom fields ─────────────────────────────────────────────────
  -- SMALLINT = a small integer (uses less storage than regular INT)
  -- CHECK constraints enforce the valid range (1-10 or 0-120)

  mood          SMALLINT NOT NULL DEFAULT 5
                  CHECK (mood BETWEEN 1 AND 10),

  fatigue       SMALLINT NOT NULL DEFAULT 5
                  CHECK (fatigue BETWEEN 1 AND 10),

  -- NUMERIC(4,1) = up to 4 digits, 1 decimal place (e.g. 7.5)
  sleep_hours   NUMERIC(4,1) NOT NULL DEFAULT 7
                  CHECK (sleep_hours BETWEEN 0 AND 24),

  stress        SMALLINT NOT NULL DEFAULT 5
                  CHECK (stress BETWEEN 1 AND 10),

  acne          SMALLINT NOT NULL DEFAULT 1
                  CHECK (acne BETWEEN 1 AND 10),

  cramps        SMALLINT NOT NULL DEFAULT 1
                  CHECK (cramps BETWEEN 1 AND 10),

  exercise_mins SMALLINT NOT NULL DEFAULT 0
                  CHECK (exercise_mins BETWEEN 0 AND 1440),

  -- cycle_status: one of 5 allowed text values
  cycle_status  TEXT NOT NULL DEFAULT 'none'
                  CHECK (cycle_status IN ('none', 'spotting', 'light', 'moderate', 'heavy')),

  -- notes: free text, optional
  notes         TEXT,

  -- created_at: when this row was inserted (for audit purposes)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- This index speeds up queries like "get all symptoms for user X"
-- Without it, the database would scan every row — slow with lots of data
CREATE INDEX IF NOT EXISTS symptoms_user_id_idx ON public.symptoms(user_id);

-- This index speeds up "get symptoms between date A and date B"
CREATE INDEX IF NOT EXISTS symptoms_logged_at_idx ON public.symptoms(logged_at);

-- This UNIQUE constraint prevents logging the same day twice accidentally
-- (user_id + logged_at must be a unique combination)
CREATE UNIQUE INDEX IF NOT EXISTS symptoms_user_date_unique
  ON public.symptoms(user_id, logged_at);

COMMENT ON TABLE public.symptoms IS
  'One row per user per day. Stores all 8 PMOS symptom readings.';


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 4: JOURNAL_ENTRIES TABLE
-- ───────────────────────────────────────────────────────────────────────────
-- Free-text journal entries. One user can have many entries.
-- ai_summary is null until the user clicks "Summarise" in Phase 5.

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- The raw journal text written by the user
  content     TEXT NOT NULL,

  -- The AI-generated emotional pattern summary (filled in Phase 5)
  ai_summary  TEXT,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_user_id_idx ON public.journal_entries(user_id);

COMMENT ON TABLE public.journal_entries IS
  'Free-text journal entries with optional AI-generated emotional summaries.';


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ───────────────────────────────────────────────────────────────────────────
-- THIS IS CRITICAL FOR PRIVACY AND SECURITY.
--
-- RLS means: even if two users are logged in at the same time, each user
-- can ONLY see and edit their OWN data. It's enforced at the database level,
-- not just in your app code — so it's much safer.
--
-- Without RLS, any logged-in user could query ALL users' symptom data.
-- With RLS, the database automatically filters to only their own rows.

-- Step 1: Enable RLS on all three tables
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;


-- ── Policies for: profiles ────────────────────────────────────────────────
-- "auth.uid()" = the UUID of the currently logged-in user (from Supabase auth)
-- "id" = the profiles.id column

-- SELECT: users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- INSERT: users can only create their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ── Policies for: symptoms ────────────────────────────────────────────────
-- user_id column must match the logged-in user's ID

CREATE POLICY "Users can view own symptoms"
  ON public.symptoms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptoms"
  ON public.symptoms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptoms"
  ON public.symptoms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptoms"
  ON public.symptoms FOR DELETE
  USING (auth.uid() = user_id);


-- ── Policies for: journal_entries ────────────────────────────────────────
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 6: AUTO-CREATE PROFILE ON SIGNUP
-- ───────────────────────────────────────────────────────────────────────────
-- This is a "trigger" — a function that runs AUTOMATICALLY whenever a
-- new user signs up. It copies their auth data into our profiles table
-- so you don't have to do it manually in your app code.
--
-- Without this, a user could sign up but have no profile row, causing errors.

-- Step 1: Create the function that does the copying
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER   -- runs with elevated permissions to write to profiles
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,                                  -- auth user's UUID
    NEW.email,                               -- auth user's email
    NEW.raw_user_meta_data->>'full_name'     -- name from signup form (optional)
  );
  RETURN NEW;
END;
$$;

-- Step 2: Attach the function to the auth.users table
-- "AFTER INSERT" = runs after a new user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS
  'Automatically creates a profiles row when a new user signs up.';


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 7: UPDATED_AT AUTO-UPDATE TRIGGER
-- ───────────────────────────────────────────────────────────────────────────
-- Keeps the updated_at column accurate without manual code.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Attach to profiles
CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Attach to journal_entries
CREATE OR REPLACE TRIGGER journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 8: HELPFUL VIEWS
-- ───────────────────────────────────────────────────────────────────────────
-- A "view" is like a saved query — you can SELECT from it like a table.
-- This view pre-calculates 30-day averages per user, useful for the dashboard.

CREATE OR REPLACE VIEW public.symptom_averages_30d AS
SELECT
  user_id,
  ROUND(AVG(mood)::NUMERIC,          1) AS avg_mood,
  ROUND(AVG(fatigue)::NUMERIC,       1) AS avg_fatigue,
  ROUND(AVG(sleep_hours)::NUMERIC,   1) AS avg_sleep_hours,
  ROUND(AVG(stress)::NUMERIC,        1) AS avg_stress,
  ROUND(AVG(acne)::NUMERIC,          1) AS avg_acne,
  ROUND(AVG(cramps)::NUMERIC,        1) AS avg_cramps,
  ROUND(AVG(exercise_mins)::NUMERIC, 0) AS avg_exercise_mins,
  COUNT(*)                               AS total_days_logged
FROM public.symptoms
WHERE logged_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY user_id;

COMMENT ON VIEW public.symptom_averages_30d IS
  '30-day rolling averages per user. Used by the dashboard stat cards.';


-- ───────────────────────────────────────────────────────────────────────────
-- SECTION 9: SEED DATA FOR TESTING (OPTIONAL — read the note)
-- ───────────────────────────────────────────────────────────────────────────
-- This section is COMMENTED OUT.
-- After you sign up through the app and confirm your email,
-- you can manually insert test rows to see charts work.
--
-- To use: replace 'YOUR-USER-UUID-HERE' with your real user ID from
-- Supabase → Authentication → Users → copy the UUID shown there.

/*
INSERT INTO public.symptoms
  (user_id, logged_at, mood, fatigue, sleep_hours, stress, acne, cramps, exercise_mins, cycle_status, notes)
VALUES
  ('YOUR-USER-UUID-HERE', CURRENT_DATE - 6,  7, 4, 7.5, 3, 2, 1, 30,  'none',     'Good day overall'),
  ('YOUR-USER-UUID-HERE', CURRENT_DATE - 5,  6, 5, 6.0, 4, 3, 2, 0,   'none',     'Tired after work'),
  ('YOUR-USER-UUID-HERE', CURRENT_DATE - 4,  5, 7, 5.5, 6, 5, 4, 15,  'spotting', 'Headache around 3pm'),
  ('YOUR-USER-UUID-HERE', CURRENT_DATE - 3,  4, 8, 4.5, 7, 6, 7, 0,   'moderate', 'Rough day, cramps bad'),
  ('YOUR-USER-UUID-HERE', CURRENT_DATE - 2,  6, 6, 7.0, 5, 4, 5, 20,  'moderate', 'Feeling slightly better'),
  ('YOUR-USER-UUID-HERE', CURRENT_DATE - 1,  7, 4, 8.0, 3, 2, 2, 45,  'light',    'Morning walk helped a lot'),
  ('YOUR-USER-UUID-HERE', CURRENT_DATE,      8, 3, 8.5, 2, 1, 1, 60,  'none',     'Great day, feel like myself');
*/


-- ═══════════════════════════════════════════════════════════════════════════
-- ALL DONE! ✅
-- Your schema is set up. Tables, RLS, triggers, and views are all ready.
-- Next: copy your Supabase URL and anon key into .env.local
-- ═══════════════════════════════════════════════════════════════════════════
