// src/lib/openai.ts
// ═══════════════════════════════════════════════════════════════════════════
// OpenAI client setup.
// ONLY import this in API routes (route.ts files) — never in client components.
// The API key is server-side only (no NEXT_PUBLIC_ prefix).
// ═══════════════════════════════════════════════════════════════════════════

import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    '❌ Missing OPENAI_API_KEY in .env.local\n' +
    'Go to platform.openai.com → API keys → Create new secret key'
  )
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
