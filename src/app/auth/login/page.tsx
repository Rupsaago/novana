'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode]         = useState<'in' | 'up'>('in')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (mode === 'in') {
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
        router.push('/dashboard')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email:    email.trim(),
          password: password,
          options:  { data: { full_name: name.trim() } },
        })
        if (error) {
          setError(error.message)
          return
        }
        setError(null)
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Sunset art side */}
      <aside className="relative hidden md:flex flex-col justify-between p-12 bg-mountains overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(46,36,64,0.25)] to-[rgba(46,36,64,0.55)] pointer-events-none" />
        <div className="relative z-10">
          <Link href="/" className="wordmark text-white" style={{ color: '#fff', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }}>
            novana
          </Link>
          <h2 className="mt-24 text-white font-display font-light leading-[1.05] text-[clamp(34px,3.6vw,54px)] max-w-[14ch]">
            Welcome back to <em className="italic">your own quiet.</em>
          </h2>
        </div>
        <blockquote className="relative z-10 font-display italic text-lg leading-relaxed max-w-[36ch] text-white/90">
          <span className="block w-8 h-px bg-white/55 mb-3.5" />
          Tracking isn&apos;t about control. It&apos;s about noticing what was already there, waiting to be seen.
        </blockquote>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[30%] w-[60%] h-[50%] rounded-full"
               style={{ background: 'radial-gradient(60% 50% at 30% 20%, rgba(232,169,139,0.18) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-[60%] h-[50%] rounded-full"
               style={{ background: 'radial-gradient(60% 50% at 80% 90%, rgba(168,158,208,0.18) 0%, transparent 70%)' }} />
        </div>

        <div className="w-full max-w-[420px] relative z-10">
          <Link href="/" className="text-xs text-nova-muted hover:text-nova-text transition-colors">← Back to home</Link>

          <div className="glass mt-4 p-10">
            <h1 className="font-display text-[36px] tracking-tight mt-4 mb-1.5">
              {mode === 'in' ? <>Sign in to <em className="italic">Novana.</em></> : <>Create your <em className="italic">Novana.</em></>}
            </h1>
            <p className="text-nova-muted text-sm mb-6">
              {mode === 'in' ? "Pick up where you left off — your patterns are waiting." : "A quiet space for tracking patterns and noticing yourself."}
            </p>

            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-full border border-nova-border-soft mb-6"
                 style={{ background: 'rgba(247,242,237,0.7)' }}>
              <button
                type="button"
                onClick={() => setMode('in')}
                className={`py-2 px-3.5 rounded-full text-sm font-medium transition-all duration-200 ${mode === 'in' ? 'bg-white text-nova-text shadow-nova-sm' : 'text-nova-muted'}`}
              >Sign in</button>
              <button
                type="button"
                onClick={() => setMode('up')}
                className={`py-2 px-3.5 rounded-full text-sm font-medium transition-all duration-200 ${mode === 'up' ? 'bg-white text-nova-text shadow-nova-sm' : 'text-nova-muted'}`}
              >Create account</button>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
                <p className="text-sm text-red-600 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'up' && (
                <div>
                  <label className="form-label">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nova"
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              )}
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hello.com"
                  className="form-input"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
                  required
                  disabled={loading}
                />
              </div>

              {mode === 'in' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-nova-muted cursor-pointer">
                    <input type="checkbox" className="accent-nova-purple" /> Remember me
                  </label>
                  <a href="#" className="text-xs text-nova-purple-dark hover:underline">Forgot password?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full justify-center py-3.5 text-base mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {mode === 'in' ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : mode === 'in' ? 'Sign in →' : 'Create account →'}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-nova-muted">
              {mode === 'in' ? 'New to Novana?' : 'Already with us?'}
              <button
                type="button"
                onClick={() => setMode(mode === 'in' ? 'up' : 'in')}
                className="ml-1 text-nova-purple-dark hover:underline font-medium"
              >
                {mode === 'in' ? 'Create an account →' : 'Sign in →'}
              </button>
            </p>

            <p className="disclaimer text-center mt-4">By continuing you agree to our terms. Novana is not a medical device.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
