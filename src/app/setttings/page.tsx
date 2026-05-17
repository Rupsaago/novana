// src/app/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { createClient }        from '@/lib/supabase'
import { useRouter }           from 'next/navigation'

export default function SettingsPage() {
  const router                  = useRouter()
  const [email, setEmail]       = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(true)

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
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-nova-text">Settings ⚙️</h1>
        <p className="text-nova-muted text-sm mt-1">Manage your account</p>
      </div>

      {/* Profile card */}
      <div className="bg-nova-white rounded-3xl border border-nova-border/30
                      shadow-nova-sm p-6 space-y-4">
        <h2 className="font-display text-lg text-nova-text">Profile</h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-nova-border/40 rounded w-32" />
            <div className="h-4 bg-nova-border/40 rounded w-48" />
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs text-nova-muted mb-1">Name</p>
              <p className="text-sm font-medium text-nova-text">{name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-nova-muted mb-1">Email</p>
              <p className="text-sm font-medium text-nova-text">{email}</p>
            </div>
          </>
        )}
      </div>

      {/* About card */}
      <div className="bg-nova-white rounded-3xl border border-nova-border/30
                      shadow-nova-sm p-6 space-y-3">
        <h2 className="font-display text-lg text-nova-text">About</h2>
        <div className="space-y-2 text-sm">
          <a href="/about" className="flex items-center justify-between py-2
                                      border-b border-nova-border/30 text-nova-muted
                                      hover:text-nova-text transition-colors">
            <span>About Novana</span><span>→</span>
          </a>
          <a href="/privacy" className="flex items-center justify-between py-2
                                        border-b border-nova-border/30 text-nova-muted
                                        hover:text-nova-text transition-colors">
            <span>Privacy Policy</span><span>→</span>
          </a>
          <a href="/terms" className="flex items-center justify-between py-2
                                      text-nova-muted hover:text-nova-text transition-colors">
            <span>Terms of Service</span><span>→</span>
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-nova-peach/15 border border-nova-peach/30
                      rounded-2xl px-5 py-4">
        <p className="text-xs text-nova-muted leading-relaxed">
          ⚠️ Novana provides pattern insights only and is not a medical service.
          Always consult a qualified healthcare professional.
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-2xl border border-nova-rose/30
                   text-nova-rose text-sm font-medium hover:bg-nova-rose/10
                   transition-colors"
      >
        Log out
      </button>
    </div>
  )
}
