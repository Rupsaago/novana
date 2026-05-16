// src/app/dashboard/layout.tsx  (PHASE 4 VERSION — replaces Phase 2 version)
// ═══════════════════════════════════════════════════════════════════════════
// WHAT CHANGED FROM PHASE 2:
//   - Reads real user session from Supabase
//   - Shows user's actual name/email in the sidebar
//   - Logout button actually signs the user out
//   - Redirects to login if no session found
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Daily Log',   icon: '📋' },
  { href: '/analytics', label: 'Analytics',   icon: '📊' },
  { href: '/insights',  label: 'AI Insights', icon: '✨' },
  { href: '/journal',   label: 'Journal',     icon: '📓' },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  user,
  onClose,
  onLogout,
}: {
  user: User | null
  onClose?: () => void
  onLogout: () => void
}) {
  const pathname = usePathname()

  // Get display name: prefer full_name from metadata, fallback to email prefix
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? 'there'

  // Get initials for the avatar circle
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="flex flex-col h-full bg-nova-white border-r border-nova-border/40
                      w-64 px-4 py-6 overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-2 mb-8 group"
            onClick={onClose}>
        <span className="w-8 h-8 rounded-xl bg-nova-gradient flex items-center
                         justify-center text-white font-display text-sm font-semibold
                         shadow-nova-sm group-hover:scale-105 transition-transform">
          n
        </span>
        <span className="font-display text-xl text-nova-text tracking-tight">
          novana
        </span>
      </Link>

      {/* Greeting card */}
      <div className="mx-2 mb-6 px-4 py-3 bg-nova-bg rounded-2xl">
        <p className="text-xs text-nova-muted">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric',
          })}
        </p>
        <p className="text-sm font-medium text-nova-text mt-0.5">
          Hi, {displayName.split(' ')[0]} ✦
        </p>
      </div>

      {/* Nav label */}
      <p className="text-xs text-nova-muted/60 font-medium uppercase tracking-widest
                    px-4 mb-2">
        Menu
      </p>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-2xl text-nova-purple ' +
                    'text-sm font-medium bg-nova-purple/10 border border-nova-purple/20'
                  : 'flex items-center gap-3 px-4 py-3 rounded-2xl text-nova-muted ' +
                    'text-sm font-medium hover:bg-nova-card hover:text-nova-text ' +
                    'transition-all duration-200'
              }
            >
              <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-purple" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-6 border-t border-nova-border/40 pt-4 space-y-2">
        {/* Disclaimer */}
        <div className="bg-nova-peach/15 border border-nova-peach/30 rounded-2xl px-4 py-3">
          <p className="text-xs text-nova-muted leading-relaxed">
            ⚠️ Novana provides pattern insights only.{' '}
            <span className="font-medium text-nova-text">Not medical advice.</span>
          </p>
        </div>

        {/* User row + logout */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center
                          justify-center text-white text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-nova-text truncate">{displayName}</p>
            <p className="text-xs text-nova-muted truncate">{user?.email}</p>
          </div>
          {/* Logout button */}
          <button
            onClick={onLogout}
            title="Log out"
            className="text-nova-muted/50 hover:text-nova-rose transition-colors
                       text-sm p-1 rounded-lg hover:bg-nova-card"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Mobile top bar ────────────────────────────────────────────────────────────
function MobileTopBar({
  onMenuOpen,
  title,
}: {
  onMenuOpen: () => void
  title: string
}) {
  return (
    <header className="md:hidden flex items-center justify-between
                       bg-nova-white border-b border-nova-border/40 px-5 py-4">
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl bg-nova-bg flex items-center justify-center
                   text-nova-muted hover:bg-nova-card transition-colors"
        aria-label="Open menu"
      >
        ☰
      </button>
      <span className="font-display text-nova-text">{title}</span>
      <div className="w-9 h-9 rounded-full bg-nova-gradient flex items-center
                      justify-center text-white text-xs">
        N
      </div>
    </header>
  )
}

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/dashboard': 'Daily Log',
    '/analytics': 'Analytics',
    '/insights':  'AI Insights',
    '/journal':   'Journal',
  }
  return map[pathname] ?? 'Novana'
}

// ── Main layout export ────────────────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname    = usePathname()
  const router      = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser]             = useState<User | null>(null)
  const [loading, setLoading]       = useState(true)

  // ── Load session on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()

    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // No session — send to login
        router.push('/auth/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    })

    // Listen for auth changes (e.g. if session expires mid-use)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push('/auth/login')
        } else {
          setUser(session.user)
        }
      }
    )

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe()
  }, [router])

  // ── Logout handler ──────────────────────────────────────────────────────────
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-nova-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-12 h-12 rounded-2xl bg-nova-gradient flex items-center
                           justify-center text-white font-display text-xl animate-pulse">
            n
          </span>
          <p className="text-nova-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-nova-bg overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-nova-text/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full z-50 md:hidden shadow-nova-lg">
            <Sidebar
              user={user}
              onClose={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MobileTopBar
          onMenuOpen={() => setMobileOpen(true)}
          title={getPageTitle(pathname)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8 md:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
