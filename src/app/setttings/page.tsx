// src/app/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient }        from '@/lib/supabase'
import { useRouter }           from 'next/navigation'
import Link                    from 'next/link'

export default function SettingsPage() {
  const router                = useRouter()
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email ?? '')
        setName(session.user.user_metadata?.full_name ?? '')
      }
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold text-nova-text">
          Settings
        </h1>
        <p className="text-nova-muted text-sm mt-1">Manage your account</p>
      </div>

      {/* Profile */}
      <div className="bg-nova-white rounded-3xl border border-nova-border/20
                      shadow-nova-sm p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-nova-text">
          Profile
        </h2>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-nova-border/40 rounded w-32" />
            <div className="h-4 bg-nova-border/40 rounded w-48" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-nova-gradient flex items-center
                              justify-center text-white font-display text-xl">
                {name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? 'N'}
              </div>
              <div>
                <p className="font-semibold text-nova-text">{name || '—'}</p>
                <p className="text-sm text-nova-muted">{email}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Links */}
      <div className="bg-nova-white rounded-3xl border border-nova-border/20
                      shadow-nova-sm p-5 space-y-1">
        <h2 className="font-display text-lg font-semibold text-nova-text mb-3">
          About
        </h2>
        {[
          { href: '/about',   label: 'About Novana'    },
          { href: '/privacy', label: 'Privacy Policy'  },
          { href: '/terms',   label: 'Terms of Service'},
        ].map((item) => (
          <Link key={item.href} href={item.href}
                className="flex items-center justify-between py-3 px-1
                           border-b border-nova-border/20 last:border-0
                           text-sm text-nova-muted hover:text-nova-text transition-colors">
            <span>{item.label}</span>
            <span className="text-nova-muted/40">→</span>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-nova-peach/15 border border-nova-peach/30
                      rounded-2xl px-5 py-4">
        <p className="text-xs text-nova-muted leading-relaxed">
          ⚠️ Novana provides pattern insights only and is not a medical service.
          Always consult a qualified healthcare professional for any health concerns.
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl border border-nova-rose/30
                   text-nova-rose text-sm font-semibold hover:bg-nova-rose/10
                   transition-colors"
      >
        Log out
      </button>
    </div>
  )
}
