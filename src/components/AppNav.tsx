// src/components/AppNav.tsx
'use client'

import Link                       from 'next/link'
import Image                      from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect }    from 'react'
import { createClient }           from '@/lib/supabase'
import type { User }              from '@supabase/supabase-js'

// ── SVG icon components ───────────────────────────────────────────────────────
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
  cycle: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="7"/>
      <path d="M10 3v3M10 14v3M3 10h3M14 10h3"/>
      <circle cx="10" cy="10" r="2.5"/>
    </svg>
  ),
  resources: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 5h14M3 10h14M3 15h8"/>
      <circle cx="16" cy="15" r="2.5"/>
    </svg>
  ),
  ask: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 2 L11.2 8.5 L18 10 L11.2 11.5 L10 18 L8.8 11.5 L2 10 L8.8 8.5 Z"/>
      <circle cx="10" cy="10" r="2"/>
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="2" width="14" height="16" rx="2"/>
      <line x1="6" y1="7" x2="14" y2="7"/>
      <line x1="6" y1="10" x2="14" y2="10"/>
      <line x1="6" y1="13" x2="10" y2="13"/>
      <polyline points="10,15 12,13 14,15"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="4" width="16" height="14" rx="2"/>
      <line x1="2" y1="8" x2="18" y2="8"/>
      <line x1="6" y1="2" x2="6" y2="6"/>
      <line x1="14" y1="2" x2="14" y2="6"/>
      <rect x="5" y="11" width="3" height="3" rx="0.5"/>
      <rect x="11" y="11" width="3" height="3" rx="0.5"/>
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="8"/>
      <circle cx="10" cy="7.5" r="2"/>
      <path d="M5 16c0-2.76 2.24-4 5-4s5 1.24 5 4"/>
    </svg>
  ),
  connect: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <rect x="7" y="5" width="6" height="10" rx="2"/>
      <path d="M9 7h2M10 13v1"/>
      <path d="M5 8c-1.5.8-2.5 2.3-2.5 4s1 3.2 2.5 4"/>
      <path d="M15 8c1.5.8 2.5 2.3 2.5 4s-1 3.2-2.5 4"/>
      <path d="M3 6c-2 1.5-3 3.7-3 6s1 4.5 3 6"/>
      <path d="M17 6c2 1.5 3 3.7 3 6s-1 4.5-3 6"/>
    </svg>
  ),
  more: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <circle cx="4" cy="10" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  today: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="11" r="4"/>
      <line x1="10" y1="2" x2="10" y2="4"/>
      <line x1="3.5" y1="5.5" x2="4.9" y2="6.9"/>
      <line x1="16.5" y1="5.5" x2="15.1" y2="6.9"/>
      <path d="M2 15h16" strokeLinecap="round"/>
    </svg>
  ),
  doctorPrep: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3" width="12" height="15" rx="2"/>
      <path d="M8 3v-1a2 2 0 0 1 4 0v1" strokeLinecap="round"/>
      <line x1="7" y1="9" x2="13" y2="9"/>
      <line x1="7" y1="12" x2="13" y2="12"/>
      <line x1="7" y1="15" x2="10" y2="15"/>
    </svg>
  ),
  share: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5" stroke="currentColor" strokeWidth="1.6">
      <circle cx="15" cy="4" r="2"/>
      <circle cx="5" cy="10" r="2"/>
      <circle cx="15" cy="16" r="2"/>
      <line x1="7" y1="9" x2="13" y2="5"/>
      <line x1="7" y1="11" x2="13" y2="15"/>
    </svg>
  ),
}

// ── Nav structure ─────────────────────────────────────────────────────────────
const PRIMARY_TABS = [
  { href: '/dashboard', label: 'Dashboard',      icon: NavIcons.dashboard  },
  { href: '/analytics', label: 'Analytics',      icon: NavIcons.analytics  },
  { href: '/insights',  label: 'AI Insights',    icon: NavIcons.insights   },
  { href: '/journal',   label: 'Journal',        icon: NavIcons.journal    },
]

const SECONDARY_TABS = [
  { href: '/today',       label: 'Today',           icon: NavIcons.today      },
  { href: '/cycle',       label: 'Cycle',           icon: NavIcons.cycle      },
  { href: '/calendar',    label: 'Calendar',        icon: NavIcons.calendar   },
  { href: '/ask',         label: 'Ask Novana',      icon: NavIcons.ask        },
  { href: '/resources',   label: 'Resources',       icon: NavIcons.resources  },
  { href: '/reports',     label: 'Reports',         icon: NavIcons.reports    },
  { href: '/circle',      label: 'Circle',          icon: NavIcons.circle     },
  { href: '/connect',     label: 'Connect devices', icon: NavIcons.connect    },
  { href: '/doctor-prep', label: 'Doctor Prep',     icon: NavIcons.doctorPrep },
  { href: '/share',       label: 'Share',           icon: NavIcons.share      },
]

const SETTINGS_TAB = { href: '/settings', label: 'Settings', icon: NavIcons.settings }

// Mobile bottom bar: top 4 most-used + "More" sheet trigger
const MOBILE_PRIMARY = [
  { href: '/dashboard', label: 'Home',    icon: NavIcons.dashboard },
  { href: '/cycle',     label: 'Cycle',   icon: NavIcons.cycle     },
  { href: '/ask',       label: 'Ask',     icon: NavIcons.ask       },
  { href: '/journal',   label: 'Journal', icon: NavIcons.journal   },
]

// ── Logo ──────────────────────────────────────────────────────────────────────
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
function DesktopSidebar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const pathname    = usePathname()
  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0] ?? 'Nova'
  const initials    = displayName
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const allTabs = [...PRIMARY_TABS, ...SECONDARY_TABS]
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="hidden lg:flex flex-col h-screen w-60 xl:w-64 flex-shrink-0
                      sticky top-0 overflow-y-auto border-r border-nova-border/20"
           style={{ background: '#F7F2ED' }}>

      {/* Logo */}
      <div className="px-6 pt-7 pb-3">
        <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
          <NovanaLogo />
        </Link>
        <p className="text-xs text-nova-muted/60 leading-snug mt-2 ml-0.5">
          Understand your body,<br />Empower your journey
        </p>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-4 py-3 space-y-0.5">
        {allTabs.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm transition-all duration-200
                         ${active
                           ? 'bg-nova-purple/10 text-nova-purple font-semibold'
                           : 'text-nova-muted hover:bg-nova-card hover:text-nova-text font-medium'
                         }`}>
              <span className={`w-5 flex items-center justify-center shrink-0
                               ${active ? 'text-nova-purple' : 'text-nova-muted'}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-purple" />
              )}
            </Link>
          )
        })}

        {/* Divider before settings */}
        <div className="my-1 border-t border-nova-border/20" />

        {(() => {
          const active = isActive(SETTINGS_TAB.href)
          return (
            <Link href={SETTINGS_TAB.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-sm transition-all duration-200
                         ${active
                           ? 'bg-nova-purple/10 text-nova-purple font-semibold'
                           : 'text-nova-muted hover:bg-nova-card hover:text-nova-text font-medium'
                         }`}>
              <span className={`w-5 flex items-center justify-center shrink-0
                               ${active ? 'text-nova-purple' : 'text-nova-muted'}`}>
                {SETTINGS_TAB.icon}
              </span>
              <span>{SETTINGS_TAB.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nova-purple" />
              )}
            </Link>
          )
        })()}
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
            <p className="text-white/80 text-xs leading-relaxed">You&apos;re not alone.</p>
            <p className="text-white text-xs font-semibold leading-relaxed">
              You&apos;re becoming something. ✦
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
  const allTabs     = [...PRIMARY_TABS, ...SECONDARY_TABS, SETTINGS_TAB]
  const pageLabel   = allTabs.find((t) => t.href === pathname)?.label ?? 'Novana'

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

// ── Mobile "More" sheet ───────────────────────────────────────────────────────
function MobileMoreSheet({ open, onClose, pathname }: {
  open: boolean; onClose: () => void; pathname: string
}) {
  if (!open) return null
  const extraTabs = [...PRIMARY_TABS.slice(1), ...SECONDARY_TABS, SETTINGS_TAB]
    .filter(t => !MOBILE_PRIMARY.some(p => p.href === t.href))

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-safe"
           style={{ background: '#F7F2ED', boxShadow: '0 -8px 40px rgba(47,42,40,0.14)' }}>
        <div className="w-10 h-1 rounded-full bg-nova-border/40 mx-auto mt-3 mb-4" />
        <div className="px-4 pb-8 grid grid-cols-3 gap-2">
          {extraTabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link key={tab.href} href={tab.href} onClick={onClose}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors
                           ${active ? 'bg-nova-purple/10 text-nova-purple' : 'text-nova-muted hover:bg-nova-card'}`}>
                <span className={`w-6 h-6 flex items-center justify-center
                                 ${active ? 'text-nova-purple' : 'text-nova-muted'}`}>
                  {tab.icon}
                </span>
                <span className="text-[11px] font-medium text-center leading-tight">
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── Mobile bottom tab bar ─────────────────────────────────────────────────────
function BottomTabBar() {
  const pathname          = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  // Close sheet when navigating
  useEffect(() => { setMoreOpen(false) }, [pathname])

  const isMoreActive = [...SECONDARY_TABS, SETTINGS_TAB, ...PRIMARY_TABS.slice(1)]
    .filter(t => !MOBILE_PRIMARY.some(p => p.href === t.href))
    .some(t => pathname === t.href)

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                      border-t border-nova-border/30 flex items-stretch"
           style={{ background: '#F7F2ED' }}>
        {MOBILE_PRIMARY.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative">
              {active && (
                <span className="absolute top-1.5 w-1 h-1 rounded-full bg-nova-purple" />
              )}
              <span className={`w-5 h-5 flex items-center justify-center transition-transform duration-200
                               ${active ? 'text-nova-purple scale-110' : 'text-nova-muted/50 scale-100'}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium leading-none
                               ${active ? 'text-nova-purple' : 'text-nova-muted/50'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(v => !v)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 relative">
          {isMoreActive && !moreOpen && (
            <span className="absolute top-1.5 w-1 h-1 rounded-full bg-nova-purple" />
          )}
          <span className={`w-5 h-5 flex items-center justify-center
                           ${moreOpen || isMoreActive ? 'text-nova-purple' : 'text-nova-muted/50'}`}>
            {NavIcons.more}
          </span>
          <span className={`text-[10px] font-medium leading-none
                           ${moreOpen || isMoreActive ? 'text-nova-purple' : 'text-nova-muted/50'}`}>
            More
          </span>
        </button>
      </nav>

      <MobileMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        pathname={pathname}
      />
    </>
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
