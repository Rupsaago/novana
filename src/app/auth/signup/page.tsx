// src/app/auth/signup/page.tsx  (FIXED — no email confirmation screen)
'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router                  = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<ReactNode>(null)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signUp({
        email:    email.trim(),
        password: password,
        options: {
          data: { full_name: name.trim() },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError(<>An account with this email already exists.{' '}<Link href="/auth/login" className="underline font-medium">Log in instead →</Link></>)
        } else if (error.message.includes('password')) {
          setError('Password is too weak. Use at least 8 characters.')
        } else {
          setError(error.message)
        }
        return
      }

      // Email confirmation is OFF — go straight to dashboard
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
                disabled={loading}
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
                placeholder="At least 8 characters"
                className="form-input"
                autoComplete="new-password"
                required
                disabled={loading}
              />
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
              disabled={loading}
              className={`btn-primary w-full justify-center py-3.5 text-base
                         ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account →'}
            </button>
          </form>

          <p className="text-center text-sm text-nova-muted">
            Already have an account?{' '}
            <Link href="/auth/login"
                  className="text-nova-purple hover:underline font-medium">
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
