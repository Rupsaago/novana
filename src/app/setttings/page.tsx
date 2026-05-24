'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter }    from 'next/navigation'
import WaitlistForm     from '@/components/WaitlistForm'

// ─── tiny sub-components ────────────────────────────────────────────────────

function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <div onClick={disabled ? undefined : onToggle} style={{
      width: 44, height: 24, borderRadius: 999, cursor: disabled ? 'default' : 'pointer',
      position: 'relative', opacity: disabled ? 0.5 : 1,
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

// ─── Toast ──────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: number; msg: string; type: ToastType }

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} className="animate-fade-up" style={{
          pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 14, fontSize: 13, fontWeight: 500,
          background: t.type === 'error' ? '#FFF0F4' : t.type === 'success' ? '#F0F7F4' : '#F5F2FA',
          border: `1px solid ${t.type === 'error' ? 'rgba(210,140,167,0.4)' : t.type === 'success' ? 'rgba(91,194,135,0.35)' : 'var(--nova-border-soft)'}`,
          color: t.type === 'error' ? '#A04060' : t.type === 'success' ? '#286044' : 'var(--nova-text)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          maxWidth: 320,
        }}>
          <span style={{ flexShrink: 0 }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          <button onClick={() => remove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: 14, padding: '0 2px' }}>×</button>
        </div>
      ))}
    </div>
  )
}

// ─── Modal base ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(47,42,40,0.35)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--nova-card-2)', borderRadius: 'var(--radius-lg)', padding: '32px 28px', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--nova-card)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 16, color: 'var(--nova-muted)' }}>×</button>
        <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: '0 0 20px' }}>{title}</h3>
        {children}
      </div>
    </div>
  )
}

// ─── Theme definitions ───────────────────────────────────────────────────────

const THEMES = [
  {
    nm: 'Golden Hour', cls: 'bg-dunes',
    vars: {
      '--nova-bg': '#F7F2ED', '--nova-card': '#EFE6DF', '--nova-card-2': '#FFFCF7',
      '--nova-purple': '#7B6FA8', '--nova-purple-light': '#A89ED0', '--nova-purple-dark': '#5A5080',
      '--nova-border': '#DDD4CA', '--nova-border-soft': '#E8DACC',
    },
    bodyBg: '#F7F2ED',
  },
  {
    nm: 'Dusk Lilac', cls: 'bg-mountains',
    vars: {
      '--nova-bg': '#F0EDF7', '--nova-card': '#E6E0F0', '--nova-card-2': '#F9F7FF',
      '--nova-purple': '#6B5FA0', '--nova-purple-light': '#9B8FD0', '--nova-purple-dark': '#4A3F80',
      '--nova-border': '#D8D0E8', '--nova-border-soft': '#E4DFF2',
    },
    bodyBg: '#F0EDF7',
  },
  {
    nm: 'Warm Sand', cls: 'bg-water',
    vars: {
      '--nova-bg': '#F9F4EE', '--nova-card': '#EDE4D8', '--nova-card-2': '#FFFDF8',
      '--nova-purple': '#8B7355', '--nova-purple-light': '#B8A090', '--nova-purple-dark': '#6A5242',
      '--nova-border': '#DDD0C0', '--nova-border-soft': '#EAE0D0',
    },
    bodyBg: '#F9F4EE',
  },
  {
    nm: 'Morning Mist', cls: 'bg-clouds',
    vars: {
      '--nova-bg': '#F2F4F7', '--nova-card': '#E4E8EF', '--nova-card-2': '#F9FBFC',
      '--nova-purple': '#7B8FA8', '--nova-purple-light': '#9EB0C8', '--nova-purple-dark': '#5A6F8A',
      '--nova-border': '#CDD4DF', '--nova-border-soft': '#DDE4EE',
    },
    bodyBg: '#F2F4F7',
  },
]

const NAV_ITEMS = [
  { href: '#profile',      label: 'Profile'            },
  { href: '#privacy',      label: 'Privacy'            },
  { href: '#notifs',       label: 'Notifications'      },
  { href: '#theme',        label: 'Theme'              },
  { href: '#subscription', label: 'Subscription'       },
  { href: '#premium',      label: 'Premium'            },
  { href: '#security',     label: 'Account & security' },
]

// ─── Main component ──────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router  = useRouter()
  const supabase = createClient()
  const toastIdRef = useRef(0)

  // ── core auth ───
  const [userId, setUserId]   = useState('')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(true)

  // ── profile ───
  const [editMode, setEditMode]         = useState(false)
  const [displayName, setDisplayName]   = useState('')
  const [pronouns, setPronouns]         = useState('')
  const [cycleLength, setCycleLength]   = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [joinedAt, setJoinedAt]         = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // ── privacy / notification prefs ───
  const [prefs, setPrefs] = useState({
    encrypt_logs:         false,
    anonymous_research:   false,
    local_ai:             false,
    notif_daily_log:      true,
    notif_weekly_summary: true,
    notif_cycle_phase:    true,
    notif_journal_invite: false,
  })

  // ── theme ───
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [font, setFont]                   = useState<'fraunces' | 'dmsans'>('fraunces')
  const [reduceMotion, setReduceMotion]   = useState(false)

  // ── ui ───
  const [activeNav, setActiveNav]   = useState('#profile')
  const [toasts, setToasts]         = useState<Toast[]>([])

  // ── modals ───
  const [emailModal, setEmailModal]   = useState(false)
  const [pwModal, setPwModal]         = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [pauseModal, setPauseModal]   = useState(false)

  // modal fields
  const [newEmail, setNewEmail]           = useState('')
  const [newPw, setNewPw]                 = useState('')
  const [confirmPw, setConfirmPw]         = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [modalLoading, setModalLoading]   = useState(false)

  // ── toast helpers ───
  const addToast = useCallback((msg: string, type: ToastType = 'success') => {
    const id = ++toastIdRef.current
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [])
  const removeToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), [])

  // ── load on mount ───
  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }

      setUserId(session.user.id)
      setEmail(session.user.email ?? '')

      // profile
      const { data: profile } = await supabase
        .from('profiles').select('*')
        .eq('id', session.user.id).single()
      if (profile) {
        setDisplayName(profile.display_name ?? profile.full_name ?? '')
        setPronouns(profile.pronouns ?? '')
        setCycleLength(profile.cycle_length ?? 28)
        setPeriodLength(profile.period_length ?? 5)
        setJoinedAt(profile.created_at)
      }

      // user_preferences (table may not exist yet if migration not run)
      try {
        const { data: p } = await supabase
          .from('user_preferences').select('*')
          .eq('user_id', session.user.id).single()
        if (p) {
          setPrefs({
            encrypt_logs:         p.encrypt_logs         ?? false,
            anonymous_research:   p.anonymous_research   ?? false,
            local_ai:             p.local_ai             ?? false,
            notif_daily_log:      p.notif_daily_log      ?? true,
            notif_weekly_summary: p.notif_weekly_summary ?? true,
            notif_cycle_phase:    p.notif_cycle_phase    ?? true,
            notif_journal_invite: p.notif_journal_invite ?? false,
          })
        }
      } catch { /* table doesn't exist yet — use defaults */ }

      setLoading(false)
    }
    load()

    // restore theme / font / motion from localStorage
    const savedTheme = localStorage.getItem('novana-theme')
    if (savedTheme !== null) {
      const idx = parseInt(savedTheme)
      setSelectedTheme(idx)
      applyThemeVars(idx)
    }
    const savedFont = localStorage.getItem('novana-font')
    if (savedFont === 'dmsans') { setFont('dmsans'); document.documentElement.setAttribute('data-font', 'dmsans') }
    const savedMotion = localStorage.getItem('novana-reduce-motion')
    if (savedMotion === 'true') { setReduceMotion(true); document.body.classList.add('reduce-motion') }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── preference upsert ───
  async function savePref(key: string, value: boolean) {
    if (!userId) return
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: userId, [key]: value }, { onConflict: 'user_id' })
      if (error) addToast('Failed to save preference.', 'error')
    } catch { addToast('Failed to save preference.', 'error') }
  }

  function togglePref(key: keyof typeof prefs) {
    const next = !prefs[key]
    setPrefs(p => ({ ...p, [key]: next }))
    savePref(key, next)
    if (key === 'notif_daily_log' && next) requestNotificationPermission()
  }

  async function requestNotificationPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      if (result === 'granted') addToast('Notifications enabled.', 'success')
      else addToast('Notifications blocked in browser settings.', 'info')
    }
  }

  // ── profile save ───
  async function saveProfile() {
    if (!userId) return
    setSavingProfile(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name:  displayName.trim() || null,
        pronouns:      pronouns.trim() || null,
        cycle_length:  cycleLength,
        period_length: periodLength,
        updated_at:    new Date().toISOString(),
      })
      .eq('id', userId)
    setSavingProfile(false)
    if (error) { addToast('Failed to save profile.', 'error'); return }
    addToast('Profile saved.', 'success')
    setEditMode(false)
  }

  // ── theme ───
  function applyThemeVars(idx: number) {
    const theme = THEMES[idx]
    const root  = document.documentElement
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v))
    document.body.style.backgroundColor = theme.bodyBg
  }

  function selectTheme(idx: number) {
    applyThemeVars(idx)
    setSelectedTheme(idx)
    localStorage.setItem('novana-theme', String(idx))
    addToast(`Theme changed to ${THEMES[idx].nm}.`, 'success')
  }

  function applyFont(f: 'fraunces' | 'dmsans') {
    setFont(f)
    if (f === 'dmsans') document.documentElement.setAttribute('data-font', 'dmsans')
    else document.documentElement.removeAttribute('data-font')
    localStorage.setItem('novana-font', f)
  }

  function toggleReduceMotion(on: boolean) {
    setReduceMotion(on)
    if (on) document.body.classList.add('reduce-motion')
    else    document.body.classList.remove('reduce-motion')
    localStorage.setItem('novana-reduce-motion', String(on))
  }

  // ── export ───
  function handleExport() {
    const link = document.createElement('a')
    link.href = '/api/export'
    link.click()
    addToast('Download starting…', 'info')
  }

  // ── sign out ───
  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/'); router.refresh()
  }

  // ── change email ───
  async function handleChangeEmail() {
    if (!newEmail.trim()) return
    setModalLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    setModalLoading(false)
    if (error) { addToast(error.message, 'error'); return }
    addToast('Confirmation sent to ' + newEmail.trim() + ' — check your inbox.', 'success')
    setEmailModal(false); setNewEmail('')
  }

  // ── change password ───
  async function handleChangePassword() {
    if (!newPw.trim()) { addToast('New password is required.', 'error'); return }
    if (newPw !== confirmPw) { addToast('Passwords do not match.', 'error'); return }
    if (newPw.length < 8)   { addToast('Password must be at least 8 characters.', 'error'); return }
    setModalLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setModalLoading(false)
    if (error) { addToast(error.message, 'error'); return }
    addToast('Password updated.', 'success')
    setPwModal(false); setNewPw(''); setConfirmPw('')
  }

  // ── pause account ───
  async function handlePause() {
    setModalLoading(true)
    const { error } = await supabase
      .from('profiles').update({ paused: true }).eq('id', userId)
    setModalLoading(false)
    if (error) { addToast('Failed to pause account.', 'error'); return }
    addToast('Account paused.', 'info')
    setPauseModal(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  // ── delete account ───
  async function handleDelete() {
    if (deleteConfirm !== 'delete') { addToast('Type "delete" to confirm.', 'error'); return }
    setModalLoading(true)
    try {
      const { error } = await supabase.rpc('delete_own_account')
      if (error) throw error
      await supabase.auth.signOut()
      router.push('/')
    } catch {
      setModalLoading(false)
      addToast('Could not delete automatically. Email privacy@novana.app.', 'error')
    }
  }

  const initial = displayName?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? 'N'
  const joinedYear = joinedAt ? new Date(joinedAt).getFullYear() : '2026'

  return (
    <>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl">Settings</h1>
          <p className="text-nova-muted mt-1 text-sm">Make Novana yours, gently.</p>
        </div>

        <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }}>

          {/* Sticky side nav */}
          <nav style={{ position: 'sticky', top: 28, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setActiveNav(item.href)} style={{
                padding: '10px 14px', borderRadius: 14, fontSize: 14, textDecoration: 'none',
                display: 'flex', alignItems: 'center',
                color: activeNav === item.href ? 'var(--nova-text)' : 'var(--nova-muted)',
                background: activeNav === item.href ? '#fff' : 'transparent',
                boxShadow: activeNav === item.href ? 'var(--shadow-sm)' : 'none',
              }}>
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* ── Profile ──────────────────────────────────────────────── */}
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
                  <div className="font-display" style={{ fontSize: 22 }}>{loading ? '…' : (displayName || email.split('@')[0] || 'Nova')}</div>
                  <div style={{ color: 'var(--nova-muted)', fontSize: 13 }}>{email || '—'} · joined {joinedYear}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn-soft"
                    style={{ fontSize: 13 }}
                    onClick={() => addToast('Photo upload coming soon — we\'re setting up storage.', 'info')}
                  >Change photo</button>
                  <button
                    className="btn-soft"
                    style={{ fontSize: 13, background: editMode ? 'var(--nova-purple)' : undefined, color: editMode ? '#fff' : undefined }}
                    onClick={() => { if (editMode) saveProfile(); else setEditMode(true) }}
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Saving…' : editMode ? 'Save profile' : 'Edit profile'}
                  </button>
                  {editMode && (
                    <button className="btn-soft" style={{ fontSize: 13 }} onClick={() => setEditMode(false)}>Cancel</button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em' }}>Display name</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                    style={{ opacity: editMode ? 1 : 0.75 }}
                    placeholder="How should Novana call you?"
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em' }}>Pronouns</span>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={e => setPronouns(e.target.value)}
                    readOnly={!editMode}
                    className="form-input"
                    style={{ opacity: editMode ? 1 : 0.75 }}
                    placeholder="she/they, he/him…"
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em' }}>Cycle length (days)</span>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={e => setCycleLength(parseInt(e.target.value) || 28)}
                    readOnly={!editMode}
                    className="form-input"
                    style={{ opacity: editMode ? 1 : 0.75 }}
                    min={21} max={45}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em' }}>Period length (days)</span>
                  <input
                    type="number"
                    value={periodLength}
                    onChange={e => setPeriodLength(parseInt(e.target.value) || 5)}
                    readOnly={!editMode}
                    className="form-input"
                    style={{ opacity: editMode ? 1 : 0.75 }}
                    min={2} max={10}
                  />
                </label>
              </div>
              {!editMode && (
                <p style={{ marginTop: 14, fontSize: 12, color: 'var(--nova-muted)' }}>
                  Click <em>Edit profile</em> to change your details.
                </p>
              )}
            </section>

            {/* ── Privacy ──────────────────────────────────────────────── */}
            <section className="card" id="privacy" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Privacy</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Your entries are yours. These settings control how Novana uses them, if at all.</p>
              <RowSet
                name="End-to-end encrypt health logs"
                desc="Symptom + journal data is encrypted with a key only you hold."
                ctrl={<Toggle on={prefs.encrypt_logs} onToggle={() => togglePref('encrypt_logs')} />}
              />
              <RowSet
                name="Anonymous research"
                desc="Share fully anonymized, aggregated patterns to improve PMOS research. Off by default."
                ctrl={<Toggle on={prefs.anonymous_research} onToggle={() => togglePref('anonymous_research')} />}
              />
              <RowSet
                name="Local-only AI insights"
                desc="Run pattern analysis on-device when possible (slower but never leaves your phone)."
                ctrl={<Toggle on={prefs.local_ai} onToggle={() => togglePref('local_ai')} />}
              />
              <RowSet
                name="Export my data"
                desc="Download a JSON archive of every entry, anytime."
                ctrl={
                  <button className="btn-soft" style={{ fontSize: 13 }} onClick={handleExport}>
                    Download archive
                  </button>
                }
              />
            </section>

            {/* ── Notifications ────────────────────────────────────────── */}
            <section className="card" id="notifs" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Notifications</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Gentle by default. Never streaks. Never shame.</p>
              <RowSet
                name="Daily log nudge"
                desc="A soft reminder if you haven't logged by your usual hour."
                ctrl={<Toggle on={prefs.notif_daily_log} onToggle={() => togglePref('notif_daily_log')} />}
              />
              <RowSet
                name="Weekly AI summary"
                desc="Sunday evenings, a short observation about your week."
                ctrl={<Toggle on={prefs.notif_weekly_summary} onToggle={() => togglePref('notif_weekly_summary')} />}
              />
              <RowSet
                name="Cycle-phase hand-off"
                desc="A quiet note when your cycle moves into a new phase."
                ctrl={<Toggle on={prefs.notif_cycle_phase} onToggle={() => togglePref('notif_cycle_phase')} />}
              />
              <RowSet
                name="Journaling invitations"
                desc="If three days pass without an entry, an open-ended prompt."
                ctrl={<Toggle on={prefs.notif_journal_invite} onToggle={() => togglePref('notif_journal_invite')} />}
              />
            </section>

            {/* ── Theme ────────────────────────────────────────────────── */}
            <section className="card" id="theme" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Theme</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Pick the sunset you live in. Light only, always.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 6 }}>
                {THEMES.map((t, i) => (
                  <div key={t.nm} onClick={() => selectTheme(i)} style={{
                    border: `2px solid ${selectedTheme === i ? 'var(--nova-purple)' : 'var(--nova-border-soft)'}`,
                    borderRadius: 16, padding: 4, cursor: 'pointer', transition: 'border-color .15s',
                  }}>
                    <div className={t.cls} style={{ height: 80, borderRadius: 12 }} />
                    <div style={{ padding: '8px 4px 4px', fontSize: 12, textAlign: 'center', color: selectedTheme === i ? 'var(--nova-text)' : 'var(--nova-muted)', fontWeight: selectedTheme === i ? 600 : 400 }}>{t.nm}</div>
                  </div>
                ))}
              </div>
              <RowSet
                name="Reduce motion"
                desc="Quiet the floating elements and gradient animations."
                ctrl={<Toggle on={reduceMotion} onToggle={() => toggleReduceMotion(!reduceMotion)} />}
              />
              <RowSet
                name="Display font"
                desc="Serif (default) or sans for the editorial headings."
                ctrl={
                  <div style={{ display: 'inline-flex', background: 'var(--nova-card)', border: '1px solid var(--nova-border-soft)', borderRadius: 999, padding: 3, gap: 2 }}>
                    {(['fraunces', 'dmsans'] as const).map((f) => (
                      <button key={f} onClick={() => applyFont(f)} style={{
                        background: font === f ? '#fff' : 'transparent',
                        border: 'none', padding: '6px 14px', borderRadius: 999,
                        fontSize: 13, color: font === f ? 'var(--nova-text)' : 'var(--nova-muted)',
                        boxShadow: font === f ? 'var(--shadow-sm)' : 'none', cursor: 'pointer',
                      }}>{f === 'fraunces' ? 'Fraunces' : 'DM Sans'}</button>
                    ))}
                  </div>
                }
              />
            </section>

            {/* ── Subscription ─────────────────────────────────────────── */}
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
              <button
                style={{ background: 'rgba(255,255,255,0.96)', color: 'var(--nova-text)', padding: '12px 22px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 500, position: 'relative', zIndex: 1 }}
                onClick={() => addToast('Premium launching soon — join the waitlist below.', 'info')}
              >
                Upgrade to Premium →
              </button>
            </section>

            {/* ── Premium waitlist ─────────────────────────────────────── */}
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
              <WaitlistForm feature="Premium" />
            </section>

            {/* ── Account & security ───────────────────────────────────── */}
            <section className="card" id="security" style={{ padding: 28 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Account &amp; security</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>The keys to your quiet space.</p>
              <RowSet
                name="Email"
                desc={email || '—'}
                ctrl={<button className="btn-soft" style={{ fontSize: 13 }} onClick={() => setEmailModal(true)}>Change</button>}
              />
              <RowSet
                name="Password"
                desc="Update your account password."
                ctrl={<button className="btn-soft" style={{ fontSize: 13 }} onClick={() => setPwModal(true)}>Update</button>}
              />
              <RowSet
                name="Two-factor authentication"
                desc="Authenticator app support — coming soon."
                ctrl={<button className="btn-soft" style={{ fontSize: 13 }} onClick={() => addToast('2FA is coming in a future update.', 'info')}>Coming soon</button>}
              />
              <RowSet
                name="Active sessions"
                desc="Manage devices where you are signed in — coming soon."
                ctrl={<button className="btn-soft" style={{ fontSize: 13 }} onClick={() => addToast('Session management coming soon.', 'info')}>Coming soon</button>}
              />
            </section>

            {/* ── Danger zone ──────────────────────────────────────────── */}
            <section id="danger" style={{ border: '1px solid rgba(210,140,167,0.4)', borderRadius: 'var(--radius-lg)', padding: 24, background: 'rgba(210,140,167,0.05)' }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0, color: 'var(--nova-rose)' }}>The quiet exit</h3>
              <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: '6px 0 22px' }}>Take your data with you, or step away entirely.</p>
              <RowSet
                name="Pause my account"
                desc="Hide entries, keep your history. Email us to reactivate."
                ctrl={
                  <button className="btn-soft" style={{ fontSize: 13 }} onClick={() => setPauseModal(true)}>
                    Pause account
                  </button>
                }
              />
              <RowSet
                name="Sign out"
                desc="End your current session on this device."
                ctrl={
                  <button onClick={handleSignOut} style={{ background: 'rgba(210,140,167,0.12)', color: 'var(--nova-rose)', border: '1px solid rgba(210,140,167,0.3)', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>
                    Sign out
                  </button>
                }
              />
              <RowSet
                name="Delete my account"
                desc="Permanently remove all data. This cannot be undone."
                ctrl={
                  <button onClick={() => setDeleteModal(true)} style={{ background: 'rgba(210,140,167,0.12)', color: 'var(--nova-rose)', border: '1px solid rgba(210,140,167,0.3)', padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer' }}>
                    Delete account
                  </button>
                }
              />
            </section>

            <p className="disclaimer" style={{ textAlign: 'center', margin: '8px 0 0' }}>Novana is a wellness journaling tool, not a medical device. This is not medical advice.</p>
          </div>
        </div>
      </div>

      {/* ── Change email modal ─────────────────────────────────────────── */}
      {emailModal && (
        <Modal title="Change email" onClose={() => { setEmailModal(false); setNewEmail('') }}>
          <p style={{ color: 'var(--nova-muted)', fontSize: 13, marginBottom: 18 }}>We&apos;ll send a confirmation link to your new address. Your current address stays active until confirmed.</p>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: 'var(--nova-muted)' }}>New email address</span>
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="form-input" placeholder="you@example.com" />
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleChangeEmail} disabled={modalLoading}>
              {modalLoading ? 'Sending…' : 'Send confirmation'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Change password modal ──────────────────────────────────────── */}
      {pwModal && (
        <Modal title="Update password" onClose={() => { setPwModal(false); setNewPw(''); setConfirmPw('') }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--nova-muted)' }}>New password</span>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="form-input" placeholder="8+ characters" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: 'var(--nova-muted)' }}>Confirm new password</span>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="form-input" placeholder="Same as above" />
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleChangePassword} disabled={modalLoading}>
              {modalLoading ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Pause account modal ────────────────────────────────────────── */}
      {pauseModal && (
        <Modal title="Pause your account" onClose={() => setPauseModal(false)}>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Your account will be paused and you&apos;ll be signed out. All your data is kept safe. To reactivate, email <strong>hello@novana.app</strong>.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setPauseModal(false)} className="btn-soft" style={{ flex: 1, justifyContent: 'center' }}>Never mind</button>
            <button onClick={handlePause} disabled={modalLoading} style={{ flex: 1, background: 'rgba(210,140,167,0.15)', color: 'var(--nova-rose)', border: '1px solid rgba(210,140,167,0.4)', padding: '10px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
              {modalLoading ? 'Pausing…' : 'Pause account'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Delete account modal ───────────────────────────────────────── */}
      {deleteModal && (
        <Modal title="Delete your account" onClose={() => { setDeleteModal(false); setDeleteConfirm('') }}>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, marginBottom: 8, lineHeight: 1.6 }}>
            This will permanently delete all your symptoms, journal entries, and account data. This cannot be undone.
          </p>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: 'var(--nova-rose)' }}>Type <strong>delete</strong> to confirm</span>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              className="form-input"
              placeholder="delete"
              style={{ borderColor: deleteConfirm === 'delete' ? 'rgba(91,194,135,0.5)' : undefined }}
            />
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setDeleteModal(false); setDeleteConfirm('') }} className="btn-soft" style={{ flex: 1, justifyContent: 'center' }}>Never mind</button>
            <button
              onClick={handleDelete}
              disabled={modalLoading || deleteConfirm !== 'delete'}
              style={{
                flex: 1, background: deleteConfirm === 'delete' ? 'rgba(210,140,167,0.20)' : 'rgba(210,140,167,0.06)',
                color: 'var(--nova-rose)', border: '1px solid rgba(210,140,167,0.4)',
                padding: '10px 16px', borderRadius: 999, fontSize: 13,
                cursor: deleteConfirm === 'delete' ? 'pointer' : 'not-allowed',
                fontWeight: 500, opacity: deleteConfirm === 'delete' ? 1 : 0.5,
              }}
            >
              {modalLoading ? 'Deleting…' : 'Delete everything'}
            </button>
          </div>
        </Modal>
      )}

      <ToastContainer toasts={toasts} remove={removeToast} />

      <style>{`
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr !important; }
          .settings-grid > nav { display: none; }
        }
      `}</style>
    </>
  )
}
