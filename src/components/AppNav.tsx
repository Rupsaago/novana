// src/components/AppNav.tsx
'use client'

import Link                       from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect }    from 'react'
import { createClient }           from '@/lib/supabase'
import type { User }              from '@supabase/supabase-js'

const TABS = [
  { href: '/dashboard', label: 'Daily Log',   emoji: '📋' },
  { href: '/insights',  label: 'AI Insights', emoji: '✨' },
  { href: '/analytics', label: 'Analytics',   emoji: '📊' },
  { href: '/journal',   label: 'Journal',     emoji: '📓' },
]

function DesktopSidebar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'there'
  const initials    = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside className="hidden lg:flex flex-col h-full bg-nova-white border-r
                      border-nova-border/40 w-64 px-4 py-6 flex-shrink-0 overflow-y-auto">
      <Link href="/" className="flex items-center gap-2.5 px-2 mb-8 group">
        <span className="w-8 h-8 rounded-xl bg-nova-gradient flex items-center
                         justify-center text-white font-display text-sm
                         group-hover:scale-105 transition-transform">n</span>
        <span className="font-display text-xl text-nova-text">novana</span>
      </Link>
      <div className="mx-2 mb-6 px-4 py-3 bg-nova-bg rounded-2xl">
        <p className="text-xs text-nova-muted">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-sm font-medium text-nova-text mt-0.5">Hi, {displayName.split(' ')[0]} ✦</p>
      </div>
      <p className="text-xs text-nova-muted/60 font-medium uppercase tracking-widest px-4 mb-2">Menu</p>
      <nav className="flex flex-col gap-1 flex-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}
              className={isActive
                ? 'flex items-center gap-3 px-4 py-3 rounded-2xl text-nova-purple text-sm font-medium bg-nova-purple/10 border border-nova-purple/20'
                : 'flex items-center gap-3 px-4 py-3 rounded-2xl text-nova-muted text-sm font-medium hover:bg-nova-card hover:text-nova-text transition-all duration-200'
              }>
              <span className="text-base w-5 text-center shrink-0">{tab.emoji}</span>
              <span>{tab.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-purple" />}
            </Link>
          )
        })}
      </nav>
      <div className="mt-6 border-t border-nova-border/40 pt-4 space-y-2">
        <div className="bg-nova-peach/15 border border-nova-peach/30 rounded-2xl px-4 py-3">
          <p className="text-xs text-nova-muted leading-relaxed">
            ⚠️ Pattern insights only. <span className="font-medium text-nova-text">Not medical advice.</span>
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center justify-center text-white text-xs font-medium shrink-0">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-nova-text truncate">{displayName}</p>
            <p className="text-xs text-nova-muted truncate">{user?.email}</p>
          </div>
          <button onClick={onLogout} className="text-nova-muted/50 hover:text-nova-rose transition-colors p-1 rounded-lg hover:bg-nova-card text-sm">⎋</button>
        </div>
      </div>
    </aside>
  )
}

function MobileTopBar({ user }: { user: User | null }) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? ''
  const initial     = displayName?.[0]?.toUpperCase() ?? 'N'
  const pageTitle   = TABS.find((t) => t.href === pathname)?.label ?? 'Novana'

  return (
    <header className="lg:hidden flex items-center justify-between
                       bg-nova-white/80 backdrop-blur-md border-b border-nova-border/40
                       px-5 py-3 sticky top-0 z-30">
      <Link href="/" className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-nova-gradient flex items-center justify-center text-white font-display text-xs">n</span>
        <span className="font-display text-lg text-nova-text">novana</span>
      </Link>
      <span className="font-display text-nova-text text-sm absolute left-1/2 -translate-x-1/2">{pageTitle}</span>
      <div className="w-8 h-8 rounded-full bg-nova-gradient flex items-center justify-center text-white text-xs font-medium">{initial}</div>
    </header>
  )
}

function BottomTabBar() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                    bg-nova-white/95 backdrop-blur-md border-t border-nova-border/40
                    flex items-stretch">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-1 relative">
            {isActive && <span className="absolute top-1.5 w-1 h-1 rounded-full bg-nova-purple" />}
            <span className={`text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100 opacity-40'}`}>{tab.emoji}</span>
            <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-nova-purple' : 'text-nova-muted/50'}`}>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default function AppNav() {
  const router          = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
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
