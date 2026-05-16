// src/app/auth/signup/page.tsx
// ═══════════════════════════════════════════════════════════════════════════
// Signup Page — Phase 4
// Creates a new Supabase auth user + profile row via the trigger we set up.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

// Three possible states for the signup form
type SignupState = 'form' | 'loading' | 'success'

export default function SignupPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [state, setState]       = useState<SignupState>('form')
  const [error, setError]       = useState<string | null>(null)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setError(null)

    // Basic password length check before hitting Supabase
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setState('form')
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email:    email.trim(),
        password: password,
        options: {
          // Pass name so our trigger can save it to profiles.full_name
          data: { full_name: name.trim() },
          // After email confirmation, send them to the dashboard
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Try logging in instead.')
        } else if (error.message.includes('password')) {
          setError('Password is too weak. Use at least 8 characters.')
        } else {
          setError(error.message)
        }
        setState('form')
        return
      }

      // Show the "check your email" success screen
      setState('success')

    } catch (err) {
      setError('Something went wrong. Please try again.')
      setState('form')
      console.error(err)
    }
  }

  // ── Success screen — shown after signup ────────────────────────────────────
  if (state === 'success') {
    return (
      <main className="min-h-screen bg-nova-bg flex items-center justify-center px-6">
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full
                        bg-nova-peach/25 blur-3xl pointer-events-none" />
        <div className="w-full max-w-sm relative text-center">
          <div className="card space-y-5">
            <div className="w-16 h-16 rounded-full bg-nova-gradient flex items-center
                            justify-center text-3xl mx-auto">
              🌅
            </div>
            <div>
              <h1 className="font-display text-3xl text-nova-text mb-2">
                Check your email!
              </h1>
              <p className="text-nova-muted text-sm leading-relaxed">
                We sent a confirmation link to{' '}
                <span className="font-medium text-nova-text">{email}</span>.
                Click it to activate your account, then come back to log in.
              </p>
            </div>
            <div className="bg-nova-purple/8 border border-nova-purple/20
                            rounded-2xl px-4 py-3 text-left">
              <p className="text-xs text-nova-muted leading-relaxed">
                💡 Can't find it? Check your spam folder. The email comes from{' '}
                <span className="font-medium">noreply@mail.supabase.io</span>
              </p>
            </div>
            <Link href="/auth/login" className="btn-primary w-full justify-center py-3.5">
              Go to login →
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-nova-bg flex items-center justify-center px-6">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full
                      bg-nova-peach/25 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full
                      bg-nova-purple/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
          <span className="w-9 h-9 rounded-xl bg-nova-gradient flex items-center
                           justify-center text-white font-display text-base
                           group-hover:scale-105 transition-transform">
            n
          </span>
          <span className="font-display text-2xl text-nova-text">novana</span>
        </Link>

        <div className="card space-y-5">
          <div className="text-center">
            <h1 className="font-display text-3xl text-nova-text">Create account</h1>
            <p className="text-nova-muted text-sm mt-1">
              Start understanding your body today
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200
                            rounded-2xl px-4 py-3">
              <span className="text-base mt-0.5">⚠️</span>
              <p className="text-sm text-red-600 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label">First name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="form-input"
                required
                disabled={state === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                autoComplete="email"
                required
                disabled={state === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="form-input"
                autoComplete="new-password"
                required
                disabled={state === 'loading'}
              />
              {/* Password strength hint */}
              {password.length > 0 && (
                <p className={`text-xs mt-1 ${
                  password.length >= 8 ? 'text-nova-sky' : 'text-nova-rose'
                }`}>
                  {password.length >= 8
                    ? '✓ Good length'
                    : `${8 - password.length} more characters needed`}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={state === 'loading'}
              className={`btn-primary w-full justify-center py-3.5 text-base
                         ${state === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {state === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account →'}
            </button>
          </form>

          <p className="text-center text-sm text-nova-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-nova-purple hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-nova-muted/50 mt-6 leading-relaxed">
          By signing up you agree that Novana provides pattern insights only
          and is not a medical service. ⚠
        </p>
      </div>
    </main>
  )
}
