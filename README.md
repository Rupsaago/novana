# Novana

**A calm AI wellness companion for women with PMOS.**

Novana helps you track symptoms, understand your cycle, and walk into every doctor's appointment with proof — not just feelings.

> Not medical advice. Not a diagnostic tool. A place to finally feel like your body makes sense.

---

## What it does

- **Daily symptom log** — mood, fatigue, sleep, stress, cramps, acne, exercise, cycle status. One tap is enough.
- **AI pattern insights** — gentle weekly observations drawn from your own data. What correlates with what. How your symptoms shift across cycle phases.
- **Cycle tracking** — real phase calculation from your logged period start date. Predictions for ovulation, luteal phase, next period.
- **Journal** — a no-pressure writing space with mood tagging and AI emotional summaries.
- **Ask Novana** — conversational AI that knows your patterns and speaks like a thoughtful friend, not WebMD.
- **Doctor Prep** — AI-generated appointment questions grounded in your actual symptom history.
- **Analytics** — charts, phase comparisons, and trend lines across any date range.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design system |
| Database & Auth | Supabase (Postgres + Row Level Security) |
| AI | OpenAI GPT-4o-mini |
| Email | Resend |
| Hosting | Vercel |
| Testing | Jest + React Testing Library + Playwright |

---

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project
- An OpenAI API key
- A Resend API key (for waitlist confirmation emails)

### Setup

```bash
git clone https://github.com/your-username/novana.git
cd novana
npm install --legacy-peer-deps
```

Copy the environment variables:

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database setup

Run the following SQL files in Supabase SQL Editor in order:

1. `supabase/schema.sql` — core tables (symptoms, profiles, journal_entries, waitlist)
2. `supabase/settings-migration.sql` — user_preferences table + profile columns
3. `supabase/cycle-migration.sql` — period_start_date column
4. `supabase/waitlist.sql` — waitlist table with unique constraint
5. `supabase/monthly_summaries.sql` — monthly reports table

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Testing

```bash
# Unit tests (Jest + React Testing Library)
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# End-to-end tests (Playwright — requires running dev server)
npm run test:e2e
```

Unit tests cover all 9 API routes at 80–100% statement coverage. E2E tests cover auth, dashboard, symptom logging, analytics, journal, Ask Novana, settings, cycle, waitlist, and landing page flows.

CI runs unit tests automatically on every push to `main` via GitHub Actions.

---

## Project structure

```
src/
  app/
    api/          — API routes (symptoms, analytics, ask, insights, journal, waitlist, export, doctor-prep, reports)
    (pages)/      — dashboard, today, analytics, insights, journal, cycle, ask, settings, ...
  components/     — AppNav, AppShell, SymptomForm, WaitlistForm, ...
  lib/            — supabase.ts, supabase-server.ts, openai.ts
  types/          — database.ts (typed Supabase schema)
supabase/         — SQL migrations
tests/
  unit/           — API route + component unit tests
  e2e/            — Playwright end-to-end tests
.github/
  workflows/      — CI (test.yml)
```

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `OPENAI_API_KEY` | Yes | OpenAI API key (server-side only) |
| `RESEND_API_KEY` | Yes | Resend API key for confirmation emails |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL (e.g. `https://novana-eight.vercel.app`) |

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables under **Settings → Environment Variables**
4. Add GitHub secrets for CI: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`
5. Deploy

---

## Disclaimer

Novana is a wellness journaling and pattern-tracking tool. It is **not** a medical device, diagnostic service, or substitute for professional healthcare. Always consult a qualified healthcare provider about your health.

---

*Built by Rupsaa G. — diagnosed at 14, building at 18.*
