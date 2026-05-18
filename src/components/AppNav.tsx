// src/components/AppNav.tsx  (POLISHED)
'use client'

import Link                       from 'next/link'
import Image                      from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect }    from 'react'
import { createClient }           from '@/lib/supabase'
import type { User }              from '@supabase/supabase-js'

// ── SVG icon components — clean, non-emoji ────────────────────────────────────
const NavIcons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="2" width="7" height="7" rx="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <polyline points="2,14 7,9 11,12 18,5"/>
      <line x1="2" y1="18" x2="18" y2="18"/>
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 2 L11.2 8.5 L18 10 L11.2 11.5 L10 18 L8.8 11.5 L2 10 L8.8 8.5 Z"/>
    </svg>
  ),
  journal: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="2" width="12" height="16" rx="2"/>
      <line x1="7" y1="7" x2="13" y2="7"/>
      <line x1="7" y1="10" x2="13" y2="10"/>
      <line x1="7" y1="13" x2="11" y2="13"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="3"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/>
    </svg>
  ),
}

const TABS = [
  { href: '/dashboard', label: 'Dashboard',   icon: NavIcons.dashboard },
  { href: '/analytics', label: 'Analytics',   icon: NavIcons.analytics  },
  { href: '/insights',  label: 'AI Insights', icon: NavIcons.insights   },
  { href: '/journal',   label: 'Journal',     icon: NavIcons.journal    },
  { href: '/settings',  label: 'Settings',    icon: NavIcons.settings   },
]

// Mobile tabs use simple emoji for bottom bar
const MOBILE_TABS = [
  { href: '/dashboard', label: 'Dashboard',   emoji: '⊞' },
  { href: '/analytics', label: 'Analytics',   emoji: '📊' },
  { href: '/insights',  label: 'AI Insights', emoji: '✨' },
  { href: '/journal',   label: 'Journal',     emoji: '📓' },
]

// ── Sparkle logo ──────────────────────────────────────────────────────────────
function NovanaLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4 L19.8 16 L32 18 L19.8 20 L18 32 L16.2 20 L4 18 L16.2 16 Z"
              fill="url(#sg1)" />
        <path d="M27 7 L27.9 10.8 L32 11.5 L27.9 12.2 L27 16 L26.1 12.2 L22 11.5 L26.1 10.8 Z"
              fill="url(#sg1)" opacity="0.65" />
        <circle cx="30" cy="7" r="1.8" fill="#E8A98B" opacity="0.75" />
        <defs>
          <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8A98B"/>
            <stop offset="100%" stopColor="#D28CA7"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display text-2xl text-nova-purple tracking-tight">
        novana
      </span>
    </div>
  )
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────
// Sidebar bg = #F7F2ED (same as current dashboard bg)
// Dashboard bg = #EFE8E1 (slightly darker)
function DesktopSidebar({ user, onLogout }: {
  user: User | null; onLogout: () => void
}) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0] ?? 'Nova'
  const initials    = displayName
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside className="hidden lg:flex flex-col h-screen w-60 xl:w-64 flex-shrink-0
                      sticky top-0 overflow-y-auto border-r border-nova-border/20"
           style={{ background: '#F7F2ED' }}>

      {/* Logo — bigger */}
      <div className="px-6 pt-7 pb-3">
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
          <NovanaLogo />
        </Link>
        <p className="text-xs text-nova-muted/60 leading-snug mt-2 ml-0.5">
          Understand your body,<br />Empower your journey
        </p>
      </div>

      {/* Nav links with SVG icons */}
      <nav className="flex-1 px-4 py-3 space-y-0.5">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm transition-all duration-200
                         ${isActive
                           ? 'bg-nova-purple/10 text-nova-purple font-semibold'
                           : 'text-nova-muted hover:bg-nova-card hover:text-nova-text font-medium'
                         }`}>
              <span className={`w-5 flex items-center justify-center shrink-0
                               ${isActive ? 'text-nova-purple' : 'text-nova-muted'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-purple" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Motivational card */}
      <div className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-nova-sm">
        <div className="relative h-36">
          <Image src="/images/sunset-water.png" alt="Motivation" fill
                 className="object-cover"
                 style={{ filter: 'brightness(0.75) saturate(0.9)' }} />
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(160deg,rgba(123,111,168,0.45) 0%,rgba(232,169,139,0.3) 100%)' }} />
          <div className="relative z-10 p-4 h-full flex flex-col justify-end">
            <p className="text-white/80 text-xs leading-relaxed">You're not alone.</p>
            <p className="text-white text-xs font-semibold leading-relaxed">
              You're becoming something. ✦
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-nova-border/20 p-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl
                        hover:bg-nova-card transition-colors group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-nova-gradient flex items-center
                          justify-center text-white text-sm font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-nova-text truncate">
              {displayName}
            </p>
            <p className="text-xs text-nova-muted">View profile</p>
          </div>
          <button onClick={onLogout} title="Log out"
                  className="text-nova-muted/30 hover:text-nova-rose transition-colors
                             opacity-0 group-hover:opacity-100 text-sm p-1">
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
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? ''
  const initial     = displayName?.[0]?.toUpperCase() ?? 'N'
  const pageLabel   = TABS.find((t) => t.href === pathname)?.label ?? 'Novana'

  return (
    <header className="lg:hidden flex items-center justify-between
                       border-b border-nova-border/30 px-5 py-3 sticky top-0 z-30"
            style={{ background: '#F7F2ED' }}>
      <Link href="/"><NovanaLogo /></Link>
      <span className="font-display text-nova-text text-sm absolute left-1/2 -translate-x-1/2">
        {pageLabel}
      </span>
      <div className="w-9 h-9 rounded-full bg-nova-gradient flex items-center
                      justify-center text-white text-sm font-semibold">
        {initial}
      </div>
    </header>
  )
}

// ── Mobile bottom tab bar ─────────────────────────────────────────────────────
function BottomTabBar() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                    border-t border-nova-border/30 flex items-stretch"
         style={{ background: '#F7F2ED' }}>
      {MOBILE_TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative">
            {isActive && (
              <span className="absolute top-1.5 w-1 h-1 rounded-full bg-nova-purple" />
            )}
            <span className={`text-xl transition-transform duration-200
                             ${isActive ? 'scale-110' : 'scale-100 opacity-40'}`}>
              {tab.emoji}
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

// ── Main export ───────────────────────────────────────────────────────────────
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
