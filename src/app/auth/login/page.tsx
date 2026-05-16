// src/app/auth/login/page.tsx
// ═══════════════════════════════════════════════════════════════════════════
// Login Page — Phase 4
// Wired to Supabase email/password auth.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email:    email.trim(),
        password: password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password. Please try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link first.')
        } else {
          setError(error.message)
        }
        return
      }

      // Login successful — send to dashboard
      router.push('/dashboard')
      router.refresh()

    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-nova-bg flex items-center justify-center px-6">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full
                      bg-nova-rose/20 blur-3xl pointer-events-none" />
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
            <h1 className="font-display text-3xl text-nova-text">Welcome back</h1>
            <p className="text-nova-muted text-sm mt-1">Log in to your Novana account</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200
                            rounded-2xl px-4 py-3">
              <span className="text-base mt-0.5">⚠️</span>
              <p className="text-sm text-red-600 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full justify-center py-3.5 text-base
                         ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Logging in...
                </span>
              ) : 'Log in →'}
            </button>
          </form>

          <p className="text-center text-sm text-nova-muted">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-nova-purple hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-nova-muted/50 mt-6">
          ⚠ Not medical advice · Private by design
        </p>
      </div>
    </main>
  )
}
