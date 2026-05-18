// src/components/AppNav.tsx  (FINAL — sparkle logo, beige sidebar, bg image)
'use client'

import Link                       from 'next/link'
import Image                      from 'next/image'
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

// ── Sparkle logo SVG — matches the brand image ────────────────────────────────
function NovanaLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* Sparkle icon */}
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Main 4-point star */}
        <path
          d="M16 4 L17.5 14 L28 16 L17.5 18 L16 28 L14.5 18 L4 16 L14.5 14 Z"
          fill="url(#sparkleGrad)"
        />
        {/* Small top-right star */}
        <path
          d="M24 6 L24.7 9.3 L28 10 L24.7 10.7 L24 14 L23.3 10.7 L20 10 L23.3 9.3 Z"
          fill="url(#sparkleGrad)"
          opacity="0.7"
        />
        {/* Tiny dot */}
        <circle cx="26" cy="6" r="1.5" fill="#E8A98B" opacity="0.8" />
        <defs>
          <linearGradient id="sparkleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8A98B" />
            <stop offset="100%" stopColor="#D28CA7" />
          </linearGradient>
        </defs>
      </svg>
      {/* Wordmark */}
      <span className="font-display text-xl text-nova-purple tracking-tight">
        novana
      </span>
    </div>
  )
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────
function DesktopSidebar({ user, onLogout }: {
  user: User | null
  onLogout: () => void
}) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0] ?? 'Nova'
  const initials    = displayName
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside
      className="hidden lg:flex flex-col h-screen w-56 xl:w-60 flex-shrink-0
                 sticky top-0 overflow-y-auto border-r border-nova-border/30"
      style={{ background: '#FAF7F4' }}  // off-white beige — matches mockup
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-2">
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
          <NovanaLogo size={28} />
        </Link>
        <p className="text-[11px] text-nova-muted/60 leading-tight mt-2 ml-0.5">
          Understand your body,<br />Empower your journey
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm transition-all duration-200
                         ${isActive
                           ? 'bg-nova-purple/12 text-nova-purple font-semibold'
                           : 'text-nova-muted hover:bg-nova-card hover:text-nova-text font-medium'
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

      {/* Motivational card with sunset-water.png */}
      <div className="mx-3 mb-4 rounded-2xl overflow-hidden shadow-nova-sm">
        <div className="relative h-32">
          <Image
            src="/images/sunset-water.png"
            alt="Motivational background"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.8) saturate(0.9)' }}
          />
          <div className="absolute inset-0"
               style={{
                 background: 'linear-gradient(160deg, rgba(123,111,168,0.4) 0%, rgba(232,169,139,0.3) 100%)',
               }} />
          <div className="relative z-10 p-4 h-full flex flex-col justify-end">
            <p className="text-white/80 text-xs leading-relaxed">
              You're not alone.
            </p>
            <p className="text-white text-xs font-semibold leading-relaxed">
              You're becoming something. ✦
            </p>
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="border-t border-nova-border/30 p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl
                        hover:bg-nova-card transition-colors group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center
                          justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-nova-text truncate">
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
                       border-b border-nova-border/40 px-5 py-3 sticky top-0 z-30"
            style={{ background: '#FAF7F4' }}>
      <Link href="/">
        <NovanaLogo size={24} />
      </Link>
      <span className="font-display text-nova-text text-sm absolute
                       left-1/2 -translate-x-1/2">
        {pageTitle}
      </span>
      <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center
                      justify-center text-white text-xs font-semibold">
        {initial}
      </div>
    </header>
  )
}

// ── Mobile bottom tab bar ─────────────────────────────────────────────────────
function BottomTabBar() {
  const pathname    = usePathname()
  const mobileTabs  = TABS.filter((t) => t.href !== '/settings')

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                    border-t border-nova-border/40 flex items-stretch"
         style={{ background: '#FAF7F4' }}>
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
