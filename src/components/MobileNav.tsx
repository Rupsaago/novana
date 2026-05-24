// src/components/MobileNav.tsx
// ═══════════════════════════════════════════════════════════════════════════
// Shared mobile navigation — hamburger menu + slide-in sidebar.
// Used by ALL dashboard pages (analytics, insights, journal, dashboard).
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import Link                            from 'next/link'
import { usePathname, useRouter }      from 'next/navigation'
import { useState, useEffect }         from 'react'
import { createClient }                from '@/lib/supabase'
import type { User }                   from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Daily Log',   icon: '📋' },
  { href: '/analytics', label: 'Analytics',   icon: '📊' },
  { href: '/insights',  label: 'AI Insights', icon: '✨' },
  { href: '/journal',   label: 'Journal',     icon: '📓' },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Daily Log',
  '/analytics': 'Analytics',
  '/insights':  'AI Insights',
  '/journal':   'Journal',
}

// ── Sidebar contents ──────────────────────────────────────────────────────────
function SidebarContents({
  user,
  onClose,
  onLogout,
}: {
  user:      User | null
  onClose:   () => void
  onLogout:  () => void
}) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? 'there'
  const initials    = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col h-full bg-nova-white w-72 px-4 py-6">
      {/* Logo + close button */}
      <div className="flex items-center justify-between px-2 mb-8">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <span className="w-8 h-8 rounded-xl bg-nova-gradient flex items-center
                           justify-center text-white font-display text-sm">
            n
          </span>
          <span className="font-display text-xl text-nova-text">novana</span>
        </Link>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-nova-bg flex items-center justify-center
                     text-nova-muted hover:bg-nova-card transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      {/* Date greeting */}
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

      {/* Nav links */}
      <p className="text-xs text-nova-muted/60 font-medium uppercase tracking-widest
                    px-4 mb-2">
        Menu
      </p>
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

      {/* Bottom */}
      <div className="mt-6 border-t border-nova-border/40 pt-4 space-y-2">
        <div className="bg-nova-peach/15 border border-nova-peach/30 rounded-2xl px-4 py-3">
          <p className="text-xs text-nova-muted leading-relaxed">
            ⚠️ Pattern insights only.{' '}
            <span className="font-medium text-nova-text">Not medical advice.</span>
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center
                          justify-center text-white text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-nova-text truncate">{displayName}</p>
            <p className="text-xs text-nova-muted truncate">{user?.email}</p>
          </div>
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
    </div>
  )
}

// ── Main MobileNav export ─────────────────────────────────────────────────────
// This renders:
//   - On MOBILE: a top bar with hamburger + slide-in drawer
//   - On DESKTOP: a full left sidebar
export default function MobileNav() {
  const pathname              = usePathname()
  const router                = useRouter()
  const [open, setOpen]       = useState(false)
  const [user, setUser]       = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  // Close drawer when route changes (user tapped a link)
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* ── DESKTOP sidebar (always visible md+) ───────────────────────────── */}
      <div className="hidden md:flex md:flex-shrink-0">
        <aside className="flex flex-col h-full bg-nova-white border-r
                          border-nova-border/40 w-64 overflow-y-auto">
          <SidebarContents
            user={user}
            onClose={() => {}}
            onLogout={handleLogout}
          />
        </aside>
      </div>

      {/* ── MOBILE top bar ─────────────────────────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between
                         bg-nova-white border-b border-nova-border/40 px-5 py-4
                         sticky top-0 z-30">
        {/* Hamburger button — THREE LINES ☰ */}
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-xl bg-nova-bg flex items-center justify-center
                     text-nova-text hover:bg-nova-card transition-colors"
          aria-label="Open menu"
        >
          {/* Three lines drawn with divs — always visible */}
          <div className="flex flex-col gap-1.5">
            <div className="w-5 h-0.5 bg-nova-text rounded-full" />
            <div className="w-5 h-0.5 bg-nova-text rounded-full" />
            <div className="w-5 h-0.5 bg-nova-text rounded-full" />
          </div>
        </button>

        {/* Page title */}
        <span className="font-display text-nova-text">
          {pageTitles[pathname] ?? 'Novana'}
        </span>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-nova-gradient flex items-center
                        justify-center text-white text-xs font-medium">
          {user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? 'N'}
        </div>
      </header>

      {/* ── Mobile slide-in drawer ──────────────────────────────────────────── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-nova-text/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full z-50 md:hidden shadow-nova">
            <SidebarContents
              user={user}
              onClose={() => setOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </>
      )}
    </>
  )
}
