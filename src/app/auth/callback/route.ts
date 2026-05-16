// src/app/auth/callback/route.ts
// ═══════════════════════════════════════════════════════════════════════════
// Auth Callback Route
// ═══════════════════════════════════════════════════════════════════════════
//
// WHAT IS THIS?
// When a user clicks the confirmation link in their signup email,
// Supabase sends them to: yourapp.com/auth/callback?code=XXXX
//
// This route handler:
//   1. Catches that redirect
//   2. Exchanges the code for a real session
//   3. Redirects the user to the dashboard
//
// Without this file, email confirmation would fail and users would
// land on a broken page.
// ═══════════════════════════════════════════════════════════════════════════

import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  // Supabase puts the auth code in the URL as ?code=XXXX
  const code  = searchParams.get('code')
  // Where to send them after — defaults to dashboard
  const next  = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClientInstance()

    // Exchange the one-time code for a permanent session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Success — redirect to dashboard (or wherever 'next' points)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — send to login with an error message
  return NextResponse.redirect(
    `${origin}/auth/login?error=Could not confirm your account. Please try signing up again.`
  )
}
