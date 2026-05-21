'use client'

import { useState, useEffect } from 'react'
import { createClient }        from '@/lib/supabase'
import { useRouter }           from 'next/navigation'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 999, cursor: 'pointer', position: 'relative',
      background: on ? 'var(--nova-purple)' : 'var(--nova-card)',
      border: `1px solid ${on ? 'var(--nova-purple)' : 'var(--nova-border-soft)'}`,
      transition: 'background .2s ease',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: 2, width: 18, height: 18,
        borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        transform: on ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform .2s ease',
      }} />
    </div>
  )
}

function RowSet({ name, desc, ctrl }: { name: string; desc: string; ctrl: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--nova-border-soft)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>{ctrl}</div>
    </div>
  )
}

const THEMES = [
  { nm: 'Golden Hour', cls: 'bg-dunes'    },
  { nm: 'Dusk Lilac',  cls: 'bg-mountains' },
  { nm: 'Warm Sand',   cls: 'bg-water'    },
  { nm: 'Morning Mist',cls: 'bg-clouds'   },
]

const NAV_ITEMS = [
  { href: '#profile',      label: 'Profile'           },
  { href: '#privacy',      label: 'Privacy'           },
  { href: '#notifs',       label: 'Notifications'     },
  { href: '#theme',        label: 'Theme'             },
  { href: '#subscription', label: 'Subscription'      },
  { href: '#premium',      label: 'Premium'           },
  { href: '#security',     label: 'Account & security'},
]

export default function SettingsPage() {
  const router            = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName]   = useState('')
  const [loading, setLoading] = useState(true)
  const [activeNav, setActiveNav]       = useState('#profile')
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [font, setFont]   = useState<'fraunces'|'dmsans'>('fraunces')

  const [premiumEmail, setPremiumEmail] = useState('')
  const [premiumStatus, setPremiumStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const [toggles, setToggles] = useState({
    e2e: true, research: false, localAI: true,
    dailyNudge: true, weeklySummary: true, phaseHandoff: true, journalInvite: false,
    reduceMotion: false, twoFactor: true,
  })
  function tog(k: keyof typeof toggles) { setToggles((p) => ({ ...p, [k]: !p[k] })) }

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmail(session.user.email ?? '')
        setName(session.user.user_metadata?.full_name ?? '')
      }
      setLoading(false)
    })
  }, [])

  async function handlePremiumWaitlist() {
    if (!premiumEmail.trim() || premiumStatus !== 'idle') return
    setPremiumStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: premiumEmail.trim(), feature: 'premium' }),
      })
      setPremiumStatus(res.ok ? 'done' : 'error')
    } catch {
      setPremiumStatus('error')
    }
  }

  async function handleLogout() {
    await createClient().auth.signOut()
    router.push('/'); router.refresh()
  }

  const initial = name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? 'N'

  return (
    <>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl">Settings ✦</h1>
          <p className="text-nova-muted mt-1 text-sm">Make Novana yours, gently.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>

          {/* Sticky side nav */}
          <nav style={{ position: 'sticky', top: 28, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setActiveNav(item.href)} style={{
                padding: '10px 14px', borderRadius: 14, fontSize: 14, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 10,
                color: activeNav === item.href ? 'var(--nova-text)' : 'var(--nova-muted)',
                background: activeNav === item.href ? '#fff' : 'transparent',
                boxShadow: activeNav === item.href ? 'var(--shadow-sm)' : 'none',
              }}>
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Profile */}
            <section className="card" id="profile" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Profile</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>How Novana greets you and adapts your tracking.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: 18, alignItems: 'center', paddingBottom: 22, borderBottom: '1px solid var(--nova-border-soft)', marginBottom: 22 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--nova-purple), var(--nova-rose))',
                  display: 'grid', placeItems: 'center',
                  color: '#fff', fontFamily: 'var(--font-fraunces)', fontSize: 30, fontWeight: 400,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {loading ? '…' : initial}
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: 22 }}>{loading ? '…' : (name || 'Nova')}</div>
                  <div style={{ color: 'var(--nova-muted)', fontSize: 13 }}>{email || '—'} · joined March 2026</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-soft" style={{ fontSize: 13 }}>Change photo</button>
                  <button className="btn-soft" style={{ fontSize: 13 }}>Edit profile</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['Display name','text','Nova'],['Pronouns','text','she/they'],['Cycle length (days)','number','28'],['Period length (days)','number','5']].map(([lbl,type,val]) => (
                  <label key={lbl} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em' }}>{lbl}</span>
                    <input type={type} defaultValue={val} className="form-input" />
                  </label>
                ))}
              </div>
            </section>

            {/* Privacy */}
            <section className="card" id="privacy" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Privacy</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Your entries are yours. These settings control how Novana uses them, if at all.</p>
              <RowSet name="End-to-end encrypt health logs" desc="Symptom + journal data is encrypted with a key only you hold." ctrl={<Toggle on={toggles.e2e} onToggle={() => tog('e2e')} />} />
              <RowSet name="Anonymous research" desc="Share fully anonymized, aggregated patterns to improve PMOS research. Off by default." ctrl={<Toggle on={toggles.research} onToggle={() => tog('research')} />} />
              <RowSet name="Local-only AI insights" desc="Run pattern analysis on-device when possible (slower but never leaves your phone)." ctrl={<Toggle on={toggles.localAI} onToggle={() => tog('localAI')} />} />
              <RowSet name="Export my data" desc="Download a JSON or CSV archive of every entry, anytime." ctrl={<button className="btn-soft" style={{ fontSize: 13 }}>Download archive</button>} />
            </section>

            {/* Notifications */}
            <section className="card" id="notifs" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Notifications</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Gentle by default. Never streaks. Never shame.</p>
              <RowSet name="Daily log nudge" desc="A soft reminder if you haven't logged by your usual hour." ctrl={<Toggle on={toggles.dailyNudge} onToggle={() => tog('dailyNudge')} />} />
              <RowSet name="Weekly AI summary" desc="Sunday evenings, a short observation about your week." ctrl={<Toggle on={toggles.weeklySummary} onToggle={() => tog('weeklySummary')} />} />
              <RowSet name="Cycle-phase hand-off" desc="A quiet note when your cycle moves into a new phase." ctrl={<Toggle on={toggles.phaseHandoff} onToggle={() => tog('phaseHandoff')} />} />
              <RowSet name="Journaling invitations" desc="If three days pass without an entry, an open-ended prompt." ctrl={<Toggle on={toggles.journalInvite} onToggle={() => tog('journalInvite')} />} />
            </section>

            {/* Theme */}
            <section className="card" id="theme" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Theme</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Pick the sunset you live in. Light only, always.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {THEMES.map((t, i) => (
                  <div key={t.nm} onClick={() => setSelectedTheme(i)} style={{
                    border: `2px solid ${selectedTheme === i ? 'var(--nova-purple)' : 'var(--nova-border-soft)'}`,
                    borderRadius: 16, padding: 4, cursor: 'pointer',
                    transform: 'none', transition: 'all .15s ease',
                  }}>
                    <div className={t.cls} style={{ height: 80, borderRadius: 12 }} />
                    <div style={{ padding: '8px 4px 4px', fontSize: 12, textAlign: 'center', color: 'var(--nova-muted)' }}>{t.nm}</div>
                  </div>
                ))}
              </div>
              <RowSet name="Reduce motion" desc="Quiet the floating elements and gradient animations." ctrl={<Toggle on={toggles.reduceMotion} onToggle={() => tog('reduceMotion')} />} />
              <RowSet name="Display font" desc="Serif (default) or sans for the editorial headings." ctrl={
                <div style={{ display: 'inline-flex', background: 'var(--nova-card)', border: '1px solid var(--nova-border-soft)', borderRadius: 999, padding: 3, gap: 2 }}>
                  {(['fraunces', 'dmsans'] as const).map((f) => (
                    <button key={f} onClick={() => setFont(f)} style={{
                      background: font === f ? '#fff' : 'transparent',
                      border: 'none', padding: '6px 14px', borderRadius: 999,
                      fontSize: 13, color: font === f ? 'var(--nova-text)' : 'var(--nova-muted)',
                      boxShadow: font === f ? 'var(--shadow-sm)' : 'none', cursor: 'pointer',
                    }}>{f === 'fraunces' ? 'Fraunces' : 'DM Sans'}</button>
                  ))}
                </div>
              } />
            </section>

            {/* Subscription */}
            <section className="grain relative overflow-hidden rounded-[var(--radius-lg)]" id="subscription" style={{
              background: 'radial-gradient(60% 60% at 90% 0%, rgba(232,169,139,0.4) 0%, transparent 70%), linear-gradient(160deg, #2D2538 0%, #4A3F66 100%)',
              color: '#fff', padding: 32,
            }}>
              <div style={{ position: 'absolute', inset: 'auto -50px -50px auto', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,140,167,0.45), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)', padding: '4px 12px', borderRadius: 999, fontSize: 11 }}>
                ✦ Novana Premium
              </span>
              <h3 className="font-display" style={{ color: '#fff', fontSize: 28, fontWeight: 400, margin: '14px 0 6px', position: 'relative', zIndex: 1 }}>
                You&apos;re on the gentle plan — free, forever.
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', margin: '0 0 18px', fontSize: 14, maxWidth: '48ch', position: 'relative', zIndex: 1 }}>
                Premium adds unlimited AI insights, year-over-year cycle comparisons, exportable PDF reports, and custom symptom tracking.
              </p>
              <div className="font-display" style={{ fontSize: 38, fontWeight: 400, position: 'relative', zIndex: 1 }}>
                $8.40<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}> / mo · billed yearly</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px', margin: '18px 0', position: 'relative', zIndex: 1 }}>
                {['Unlimited AI insights','Year-over-year cycle view','Custom symptoms & tags','PDF reports for your provider','Advanced privacy controls','Priority human support'].map((p) => (
                  <div key={p} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, background: 'var(--nova-peach)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
              <button style={{ background: 'rgba(255,255,255,0.96)', color: 'var(--nova-text)', padding: '12px 22px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 500, position: 'relative', zIndex: 1 }}>
                Upgrade to Premium →
              </button>
            </section>

            {/* Premium Coming Soon */}
            <section className="card" id="premium" style={{ padding: 28 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(123,111,168,0.1)', border: '1px solid rgba(123,111,168,0.2)', padding: '4px 12px', borderRadius: 999, fontSize: 11, color: 'var(--nova-purple-dark)', marginBottom: 14 }}>
                ✦ Coming soon
              </span>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>Novana Premium</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '0 0 18px' }}>
                Be first to unlock unlimited AI insights, PDF reports for your doctor, wearable integrations, and cross-cycle analytics.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px', marginBottom: 22 }}>
                {['Unlimited AI insights', 'Year-over-year cycle view', 'Custom symptoms & tags', 'PDF reports for your provider', 'Wearable integrations', 'Advanced privacy controls'].map((p) => (
                  <div key={p} style={{ fontSize: 13, color: 'var(--nova-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ width: 6, height: 6, background: 'var(--nova-purple)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="email"
                  value={premiumEmail}
                  onChange={(e) => setPremiumEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={premiumStatus === 'loading' || premiumStatus === 'done'}
                  style={{ flex: 1, padding: '10px 16px', borderRadius: 999, border: '1px solid var(--nova-border-soft)', fontSize: 13, background: 'var(--nova-card)', outline: 'none' }}
                />
                <button
                  onClick={handlePremiumWaitlist}
                  disabled={premiumStatus === 'loading' || premiumStatus === 'done'}
                  style={{ padding: '10px 20px', borderRadius: 999, background: 'var(--nova-purple)', color: '#fff', border: 'none', fontSize: 13, cursor: premiumStatus === 'done' ? 'default' : 'pointer', whiteSpace: 'nowrap' as const, opacity: premiumStatus === 'loading' ? 0.7 : 1 }}
                >
                  {premiumStatus === 'done' ? '✓ On the list' : premiumStatus === 'loading' ? 'Joining…' : 'Join waitlist →'}
                </button>
              </div>
              {premiumStatus === 'error' && <p style={{ fontSize: 12, color: 'var(--nova-rose)', marginTop: 8 }}>Something went wrong. Please try again.</p>}
            </section>

            {/* Account & security */}
            <section className="card" id="security" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Account &amp; security</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>The keys to your quiet space.</p>
              <RowSet name="Email" desc={email || 'nova@hellomoon.co'} ctrl={<button className="btn-soft" style={{ fontSize: 13 }}>Change</button>} />
              <RowSet name="Password" desc="Last changed 3 months ago" ctrl={<button className="btn-soft" style={{ fontSize: 13 }}>Update</button>} />
              <RowSet name="Two-factor authentication" desc="Authenticator app · enabled" ctrl={<Toggle on={toggles.twoFactor} onToggle={() => tog('twoFactor')} />} />
              <RowSet name="Active sessions" desc="2 devices · iPhone 15, MacBook Pro" ctrl={<button className="btn-soft" style={{ fontSize: 13 }}>Manage</button>} />
            </section>

            {/* Danger zone */}
            <section id="danger" style={{ border: '1px solid rgba(210,140,167,0.4)', borderRadius: 'var(--radius-lg)', padding: 24, background: 'rgba(210,140,167,0.05)' }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0, color: 'var(--nova-rose)' }}>The quiet exit</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Take your data with you, or step away entirely.</p>
              <RowSet name="Pause my account" desc="Hide entries, keep your history. Reactivate anytime." ctrl={<button className="btn-soft" style={{ fontSize: 13 }}>Pause account</button>} />
              <RowSet name="Sign out" desc="End your current session on this device." ctrl={
                <button onClick={handleLogout} style={{ background: 'rgba(210,140,167,0.12)', color: 'var(--nova-rose)', border: '1px solid rgba(210,140,167,0.3)', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>
                  Sign out
                </button>
              } />
              <RowSet name="Delete my account" desc="Permanently remove all data within 30 days. This can't be undone." ctrl={
                <button style={{ background: 'rgba(210,140,167,0.12)', color: 'var(--nova-rose)', border: '1px solid rgba(210,140,167,0.3)', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>
                  Delete account
                </button>
              } />
            </section>

            <p className="disclaimer" style={{ textAlign: 'center', margin: '8px 0 0' }}>Novana is a wellness journaling tool, not a medical device. This is not medical advice.</p>
          </div>
        </div>
      </div>
    </>
  )
}
