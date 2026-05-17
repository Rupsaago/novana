// src/components/AppNav.tsx  (DESKTOP REDESIGN — matches mockup sidebar)
'use client'

import Link                       from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect }    from 'react'
import { createClient }           from '@/lib/supabase'
import type { User }              from '@supabase/supabase-js'

const TABS = [
  { href: '/dashboard', label: 'Dashboard',   icon: '⊞' },
  { href: '/analytics', label: 'Analytics',   icon: '📊' },
  { href: '/insights',  label: 'AI Insights', icon: '✨' },
  { href: '/journal',   label: 'Journal',     icon: '📓' },
  { href: '/settings',  label: 'Settings',    icon: '⚙️' },
]

// ── Desktop sidebar — matches the mockup exactly ──────────────────────────────
function DesktopSidebar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0] ?? 'Nova'
  const initials    = displayName
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside className="hidden lg:flex flex-col h-screen bg-nova-white border-r
                      border-nova-border/40 w-56 xl:w-64 flex-shrink-0
                      overflow-y-auto sticky top-0">

      {/* Logo + tagline */}
      <div className="px-5 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2 group mb-1">
          <span className="w-8 h-8 rounded-xl bg-nova-gradient flex items-center
                           justify-center text-white font-display text-sm
                           group-hover:scale-105 transition-transform shadow-nova-sm">
            n
          </span>
          <span className="font-display text-xl text-nova-text">novana</span>
        </Link>
        <p className="text-[11px] text-nova-muted/70 leading-tight ml-10">
          Understand your body,<br />Empower your journey
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm transition-all duration-200
                         ${isActive
                           ? 'bg-nova-purple/10 text-nova-purple font-medium'
                           : 'text-nova-muted hover:bg-nova-bg hover:text-nova-text'
                         }`}>
              <span className="text-base w-5 text-center shrink-0">{tab.icon}</span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-purple" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Motivational card */}
      <div className="mx-3 mb-4 rounded-2xl overflow-hidden">
        <div className="relative p-4"
             style={{
               background: 'linear-gradient(160deg, #EFE6DF, #E8C4B8)',
             }}>
          {/* Decorative circle */}
          <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full
                          bg-nova-rose/20 blur-xl" />
          <p className="text-xs text-nova-muted relative z-10 leading-relaxed mb-1">
            You're not alone.
          </p>
          <p className="text-xs font-medium text-nova-text relative z-10 leading-relaxed">
            You're becoming something. ✦
          </p>
        </div>
      </div>

      {/* User profile */}
      <div className="border-t border-nova-border/40 p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl
                        hover:bg-nova-bg transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center
                          justify-center text-white text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-nova-text truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-nova-muted">View profile</p>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            className="text-nova-muted/30 hover:text-nova-rose transition-colors
                       opacity-0 group-hover:opacity-100 text-xs p-1"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Mobile top bar ────────────────────────────────────────────────────────────
function MobileTopBar({ user }: { user: User | null }) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0] ?? ''
  const initial     = displayName?.[0]?.toUpperCase() ?? 'N'
  const pageTitle   = TABS.find((t) => t.href === pathname)?.label ?? 'Novana'

  return (
    <header className="lg:hidden flex items-center justify-between
                       bg-nova-white/90 backdrop-blur-md border-b border-nova-border/40
                       px-5 py-3 sticky top-0 z-30">
      <Link href="/" className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-nova-gradient flex items-center
                         justify-center text-white font-display text-xs">n</span>
        <span className="font-display text-lg text-nova-text">novana</span>
      </Link>
      <span className="font-display text-nova-text text-sm absolute
                       left-1/2 -translate-x-1/2">
        {pageTitle}
      </span>
      <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center
                      justify-center text-white text-xs font-medium">
        {initial}
      </div>
    </header>
  )
}

// ── Mobile bottom tab bar ─────────────────────────────────────────────────────
function BottomTabBar() {
  const pathname = usePathname()
  const mobileTabs = TABS.filter((t) => t.href !== '/settings')

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                    bg-nova-white/95 backdrop-blur-md border-t border-nova-border/40
                    flex items-stretch">
      {mobileTabs.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href}
                className="flex-1 flex flex-col items-center justify-center
                           gap-1 py-3 px-1 relative">
            {isActive && (
              <span className="absolute top-1.5 w-1 h-1 rounded-full bg-nova-purple" />
            )}
            <span className={`text-xl transition-transform duration-200
                             ${isActive ? 'scale-110' : 'scale-100 opacity-40'}`}>
              {tab.icon}
            </span>
            <span className={`text-[10px] font-medium leading-none
                             ${isActive ? 'text-nova-purple' : 'text-nova-muted/50'}`}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

// ── Main AppNav ───────────────────────────────────────────────────────────────
export default function AppNav() {
  const router          = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) =>
      setUser(session?.user ?? null)
    )
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <DesktopSidebar user={user} onLogout={handleLogout} />
      <MobileTopBar user={user} />
      <BottomTabBar />
    </>
  )
}
