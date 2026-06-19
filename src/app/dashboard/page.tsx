'use client'

import { useEffect, useState } from 'react'
import { createClient }        from '@/lib/supabase'
import SymptomForm             from '@/components/SymptomForm'
import Link                    from 'next/link'
import Image                   from 'next/image'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { SymptomAvgRow } from '@/types/database'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

const MOODS = [
  { val: 1, label: 'heavy',  bg: 'radial-gradient(circle at 30% 30%, #9B8FB8 0%, #6B5A95 100%)' },
  { val: 3, label: 'tender', bg: 'radial-gradient(circle at 30% 30%, #B8A5D2 0%, #8A7BA8 100%)' },
  { val: 5, label: 'okay',   bg: 'radial-gradient(circle at 30% 30%, #E8C9D4 0%, #D28CA7 100%)' },
  { val: 7, label: 'easy',   bg: 'radial-gradient(circle at 30% 30%, #F4D6BD 0%, #E8A98B 100%)' },
  { val: 9, label: 'bright', bg: 'radial-gradient(circle at 30% 30%, #FFE4B8 0%, #F0B570 100%)' },
]

export default function DashboardPage() {
  const [firstName, setFirstName]     = useState('Nova')
  const [averages, setAverages]       = useState<SymptomAvgRow | null>(null)
  const [streak, setStreak]           = useState(0)
  const [daysLogged, setDaysLogged]   = useState(0)
  const [consistency, setConsistency] = useState(0)
  const [recentData, setRecentData]   = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]         = useState(true)
  const [selectedMood, setSelectedMood] = useState(7)
  const [showDetail, setShowDetail]   = useState(false)
  const [saved, setSaved]             = useState(false)
  const [skipped, setSkipped]         = useState(false)
  const [lastSaved, setLastSaved]     = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }

      // Prefer profile display_name > full_name > auth metadata > email prefix
      const { data: prof } = await supabase
        .from('profiles').select('display_name, full_name')
        .eq('id', session.user.id).single()
      const raw = prof?.display_name ?? prof?.full_name ??
        session.user.user_metadata?.full_name ??
        session.user.email?.split('@')[0] ?? 'Nova'
      setFirstName(raw.split(' ')[0])

      const { data: avg, error: avgErr } = await supabase
        .from('symptom_averages_30d').select('*')
        .eq('user_id', session.user.id).single()
      console.log('[Dashboard] symptom_averages_30d:', { avg, error: avgErr?.message })
      if (avg) {
        setAverages(avg)
        setDaysLogged(avg.total_days_logged ?? 0)
        setConsistency(Math.round(((avg.total_days_logged ?? 0) / 30) * 100))
      }

      const ago7 = new Date(); ago7.setDate(ago7.getDate() - 7)
      const { data: recent, error: recentErr } = await supabase
        .from('symptoms').select('*')
        .eq('user_id', session.user.id)
        .gte('logged_at', ago7.toISOString().split('T')[0])
        .order('logged_at', { ascending: true })
      console.log('[Dashboard] recent symptoms (7d):', {
        count: recent?.length ?? 0,
        error: recentErr?.message,
        dateFrom: ago7.toISOString().split('T')[0],
        sample: recent?.[0],
      })
      if (recent) {
        setRecentData(recent.map((r) => ({
          ...r,
          date: new Date(r.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        })))
      }

      const { data: sd } = await supabase
        .from('symptoms').select('logged_at')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false }).limit(60)
      if (sd?.length) {
        let count = 0
        const today = new Date(); today.setHours(0, 0, 0, 0)
        for (let i = 0; i < sd.length; i++) {
          const d = new Date(sd[i].logged_at); d.setHours(0, 0, 0, 0)
          const exp = new Date(today); exp.setDate(today.getDate() - i)
          if (d.getTime() === exp.getTime()) count++; else break
        }
        setStreak(count)
      }
      setLoading(false)
    }
    load()
  }, [lastSaved])

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="min-h-screen -mx-5 -mt-6 md:-mx-7 md:-mt-7">

      {/* ── Greeting card ──────────────────────────────────────────────────── */}
      <div className="sunset-horizon grain relative overflow-hidden px-7 pt-8 pb-10 min-h-[200px]" style={{ marginBottom: 24 }}>
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(160deg, rgba(74,63,102,0.65) 0%, rgba(123,111,168,0.28) 50%, transparent 100%)' }} />
        <span className="orb orb-pink animate-float" style={{ width: 70, height: 70, top: '20%', right: '38%', zIndex: 2 }} />
        <span className="orb orb-peach animate-float delay-2" style={{ width: 48, height: 48, bottom: '22%', right: '26%', zIndex: 2 }} />

        <div className="relative z-10 grid gap-7 items-center max-w-6xl mx-auto dash-hero-grid"
             style={{ gridTemplateColumns: '1.3fr 1fr' }}>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>{getDayLabel()}</div>
            <h1 className="mt-2.5 flex items-center gap-3 flex-wrap"
                style={{ color: '#fff', fontSize: 'clamp(30px, 3.4vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em' }}>
              {getGreeting()}, <em style={{ fontStyle: 'italic' }}>{firstName}</em>
              <span style={{ color: '#FFD68A', filter: 'drop-shadow(0 0 12px rgba(255,214,138,0.6))', fontSize: 24 }}>✦</span>
            </h1>
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.88)', fontSize: 15, maxWidth: '48ch' }}>
              Let&apos;s take care of your today. Five symptoms logged this week — a gentle rhythm.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <a href="#log" className="btn-ghost">Log today</a>
              <Link href="/today" className="btn-ghost">Open today&apos;s ritual →</Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* Capsule insight widget */}
            <div className="glass rounded-3xl p-5 w-full max-w-xs" style={{ background: 'rgba(253,250,247,0.18)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Today</div>
              <p className="font-display" style={{ color: '#fff', fontSize: 18, fontWeight: 400, lineHeight: 1.3, margin: 0 }}>Soft consistency.</p>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                Five check-ins this week, mood steady around <span className="hl-peach">7</span>. Sleep is the <span className="hl-rose">lever to lean on</span> next.
              </p>
              <p className="disclaimer" style={{ color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>Educational only — not medical advice.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="px-5 md:px-7 pb-10 max-w-6xl mx-auto dash-main-grid"
           style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>

        {/* ── LEFT column ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Quick Log */}
          <section id="log" className="relative overflow-hidden rounded-[var(--radius-lg)]" style={{
            padding: '28px 28px 24px',
            background: 'linear-gradient(160deg, rgba(255,240,220,0.55), rgba(232,168,200,0.30)), var(--nova-card-2)',
            border: '1px solid rgba(255,255,255,0.9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <h3 className="font-display" style={{ fontSize: 24, fontWeight: 400, margin: 0 }}>
                  How are you <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>arriving</em> today?
                </h3>
                <p style={{ fontSize: 13, color: 'var(--nova-muted)', marginTop: 4 }}>One tap is enough. We&apos;ll learn the rest.</p>
              </div>
            </div>

            {/* Mood orbs */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginBottom: 18 }}>
              {MOODS.map((m) => (
                <div key={m.val} onClick={() => setSelectedMood(m.val)}
                     style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: m.bg,
                    border: selectedMood === m.val ? '2.5px solid var(--nova-purple)' : '2.5px solid rgba(255,255,255,0.6)',
                    boxShadow: selectedMood === m.val
                      ? '0 0 24px rgba(123,111,168,0.4), 0 0 0 3px rgba(255,255,255,0.8)'
                      : '0 6px 16px rgba(123,111,168,0.18)',
                    transform: selectedMood === m.val ? 'scale(1.14)' : 'scale(1)',
                    transition: 'all .2s ease',
                  }} />
                  <div style={{
                    fontSize: 11, textAlign: 'center',
                    color: selectedMood === m.val ? 'var(--nova-text)' : 'var(--nova-muted)',
                    fontWeight: selectedMood === m.val ? 600 : 400,
                  }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Shortcuts */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 6 }}>
              {[
                { icon: '↻', label: 'Same as yesterday', onClick: handleSave },
                { icon: '✕', label: skipped ? 'Skipped ✓' : 'Skip today', onClick: () => { setSkipped(true); setTimeout(() => setSkipped(false), 2000) } },
              ].map((s) => (
                <button key={s.label} onClick={s.onClick} style={{
                  background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.95)',
                  padding: '8px 14px', borderRadius: 999, fontSize: 12, color: 'var(--nova-text)',
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ color: 'var(--nova-purple-dark)' }}>{s.icon}</span> {s.label}
                </button>
              ))}
              <Link href="/today" style={{
                background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.95)',
                padding: '8px 14px', borderRadius: 999, fontSize: 12, color: 'var(--nova-text)',
                display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
              }}>
                <span style={{ color: 'var(--nova-purple-dark)' }}>→</span> Open today&apos;s ritual
              </Link>
            </div>

            {/* Save + toggle */}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={handleSave} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: 14 }}>
                {saved ? '✓ Saved' : 'Save today'}
              </button>
              <button onClick={() => setShowDetail(!showDetail)} className="btn-soft" style={{ whiteSpace: 'nowrap' }}>
                {showDetail ? 'Hide details ↑' : 'Add more details →'}
              </button>
            </div>

            {/* Collapsible detail log */}
            {showDetail && (
              <div className="animate-fade-up" style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--nova-border-soft)' }}>
                <h3 className="font-display" style={{ fontSize: 18, margin: '0 0 4px' }}>Detailed log</h3>
                <p style={{ fontSize: 13, color: 'var(--nova-muted)', marginBottom: 18 }}>Slide each one to rate. Skip what doesn&apos;t apply.</p>
                <SymptomForm onSaved={() => setLastSaved(n => n + 1)} />
              </div>
            )}
          </section>

          {/* Trend chart with sunset-water background */}
          <section className="card relative overflow-hidden" style={{ padding: 24 }}>
            <div className="absolute inset-0 z-0">
              <Image src="/images/sunset-water.jpg" alt="" fill className="object-cover object-center" style={{ opacity: 0.92 }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(74,63,102,0.10) 0%, rgba(255,251,245,0.05) 50%, rgba(255,251,245,0.20) 100%)' }} />
            </div>
            <div className="relative z-10">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <h3 className="font-display" style={{ color: '#fff', textShadow: '0 1px 6px rgba(74,63,102,0.4)', fontSize: 22, fontWeight: 400, margin: 0 }}>Symptom Trends</h3>
                  <p style={{ color: 'rgba(255,252,247,0.9)', textShadow: '0 1px 4px rgba(74,63,102,0.3)', fontSize: 13, margin: '4px 0 0' }}>Past 7 days</p>
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                  {[['Mood','#7B6FA8'],['Fatigue','#E8A98B'],['Stress','#D28CA7']].map(([l,c]) => (
                    <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,252,247,0.95)', textShadow: '0 1px 4px rgba(74,63,102,0.3)', fontWeight: 500 }}>
                      <i style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />{l}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{
                background: 'rgba(253,248,238,0.75)', backdropFilter: 'blur(22px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.85)', borderRadius: 14,
                padding: '16px 14px 4px',
                boxShadow: '0 6px 20px rgba(74,63,102,0.10), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}>
                {recentData.length === 0 ? (
                  <div style={{ height: 190, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <p style={{ fontSize: 13, color: 'var(--nova-purple)', fontWeight: 600 }}>Log your first day to see trends</p>
                    <p style={{ fontSize: 12, color: 'var(--nova-muted)', textAlign: 'center' }}>Head to Today to get started</p>
                  </div>
                ) : (
                  <div style={{ height: 190 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={recentData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 4" stroke="rgba(74,63,102,0.20)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11.5, fill: 'rgb(74,63,102)', fontWeight: 500 }} tickLine={false} axisLine={false} />
                        <YAxis domain={[0,10]} tick={{ fontSize: 11, fill: 'rgb(74,63,102)' }} tickLine={false} axisLine={false} tickCount={5} />
                        <Tooltip contentStyle={{ background: '#FDFAF7', border: '1px solid #DDD4CA', borderRadius: 12, fontSize: 12 }} />
                        <Line type="monotone" dataKey="mood" stroke="#7B6FA8" strokeWidth={2.5} dot={{ r: 3.5, fill: '#7B6FA8', strokeWidth: 0 }} connectNulls />
                        <Line type="monotone" dataKey="fatigue" stroke="#E8A98B" strokeWidth={2.5} dot={{ r: 3.5, fill: '#E8A98B', strokeWidth: 0 }} connectNulls />
                        <Line type="monotone" dataKey="stress" stroke="#D28CA7" strokeWidth={2.5} dot={{ r: 3.5, fill: '#D28CA7', strokeWidth: 0 }} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 4px 4px', fontSize: 11.5, color: 'rgb(74,63,102)', fontWeight: 500, letterSpacing: '0.02em' }}>
                  {recentData.slice(-7).map((d) => <span key={String(d.date)}>{String(d.date)}</span>)}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT column ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Today at a glance */}
          <section className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>Today at a glance</h3>
              <Link href="/analytics" style={{ fontSize: 12, color: 'var(--nova-muted)' }}>View all →</Link>
            </div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[1,2,3,4].map((i) => <div key={i} style={{ borderRadius: 18, height: 96, background: 'var(--nova-card)' }} />)}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Mood',   val: averages?.avg_mood ?? '—',        unit: '/10', color: '#7B6FA8', bg: '#EAE0F2', delta: '↑ 1 from yesterday', deltaColor: 'var(--nova-purple-dark)',
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg> },
                  { label: 'Energy', val: averages?.avg_fatigue ?? '—',     unit: '/10', color: '#A87155', bg: '#F1D7C5', delta: '↓ 4 from yesterday', deltaColor: '#A87155',
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-9 12h7l-1 8 9-12h-7z"/></svg> },
                  { label: 'Sleep',  val: averages?.avg_sleep_hours ?? '—', unit: 'h',   color: '#5A6F8F', bg: '#D9E0EC', delta: '→ Steady', deltaColor: '#5A6F8F',
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg> },
                  { label: 'Cycle',  val: 'Day 8', unit: '',               color: '#A85A75', bg: '#F1D5DE', delta: 'Follicular', deltaColor: 'var(--nova-rose)',
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg> },
                ].map((item) => (
                  <div key={item.label} style={{
                    borderRadius: 18, padding: 16, border: '1px solid var(--nova-border-soft)',
                    background: '#fff', position: 'relative',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.label}</div>
                    <div className="font-display" style={{ fontSize: 32, fontWeight: 400, marginTop: 4, color: item.color }}>
                      {item.val}<span style={{ fontSize: 14, color: 'var(--nova-muted)' }}>{item.unit}</span>
                    </div>
                    <div style={{ fontSize: 12, color: item.deltaColor }}>{item.delta}</div>
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      width: 32, height: 32, borderRadius: 10,
                      background: item.bg, color: item.color,
                      display: 'grid', placeItems: 'center',
                    }}>{item.icon}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AI Insight — dark purple gradient */}
          <section style={{
            background: 'linear-gradient(160deg, #2D2538 0%, #4A3F66 60%, #6B5687 100%)',
            color: '#fff', borderRadius: 'var(--radius-lg)', padding: 24,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', width: 260, height: 260, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,169,139,0.45), transparent 70%)',
              top: -120, right: -100, filter: 'blur(20px)', pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)',
                padding: '5px 12px', borderRadius: 999, fontSize: 11, backdropFilter: 'blur(8px)',
              }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>
                AI insight
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Generated 2h ago</span>
            </div>
            <h3 className="font-display" style={{ color: '#fff', fontSize: 24, fontWeight: 400, margin: '14px 0 10px', lineHeight: 1.2 }}>
              Your sleep tends to lift on days you exercise.
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, margin: '0 0 8px' }}>
              This week, sleep quality was <span className="hl-rose">1.6 points higher</span> on days with logged movement. Energy also rose during your <span className="hl-peach">follicular phase</span> — a pattern Novana has seen for three cycles now.
            </p>
            <p style={{ fontSize: 11, opacity: 0.55, marginTop: 8 }}>This is not medical advice.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, position: 'relative', zIndex: 2 }}>
              <Link href="/insights" style={{
                background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.22)',
                color: '#fff', padding: '8px 14px', borderRadius: 999, fontSize: 13,
                fontWeight: 500, textDecoration: 'none',
              }}>See full analysis →</Link>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>3 of 5 weekly insights</span>
            </div>
          </section>

          {/* Cycle phase card */}
          <section className="card" style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 110px', gap: 18, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cycle Phase</div>
              <h4 className="font-display" style={{ fontSize: 24, fontWeight: 400, margin: '4px 0 12px' }}>Follicular Phase</h4>
              <div style={{ fontSize: 13, color: 'var(--nova-muted)', marginBottom: 8 }}>Day 8 of 28</div>
              <div style={{ height: 6, background: 'var(--nova-border-soft)', borderRadius: 999 }}>
                <div style={{ height: '100%', width: '28%', background: 'linear-gradient(90deg, var(--nova-purple), var(--nova-rose))', borderRadius: 999 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--nova-muted)' }}>
                <span>28%</span><span>Next: Ovulatory · in 5d</span>
              </div>
            </div>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
              border: '4px solid #fff', boxShadow: 'var(--shadow-sm)', position: 'relative',
            }}>
              <Image src="/images/sunset-mountains.jpg" alt="Cycle phase" fill className="object-cover" />
            </div>
          </section>

          {/* Quote card */}
          <section className="grain relative overflow-hidden rounded-[var(--radius-lg)]" style={{
            padding: 28,
            background: 'radial-gradient(60% 60% at 80% 100%, #FBE2C8 0%, transparent 70%), linear-gradient(160deg, #E8C5D4 0%, #F1B894 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <span className="eyebrow" style={{ color: 'rgba(47,42,40,0.55)' }}>A gentle thought</span>
            <h3 className="font-display" style={{ fontStyle: 'italic', fontSize: 24, fontWeight: 400, margin: '10px 0 0', lineHeight: 1.3, maxWidth: '22ch' }}>
              Small, consistent choices create powerful changes.
            </h3>
            <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(47,42,40,0.65)', letterSpacing: '0.04em' }}>— a quiet reminder</div>
          </section>

          {/* Journey */}
          <section className="card" style={{ padding: 24 }}>
            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, margin: '0 0 12px' }}>Your journey</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { val: daysLogged, label: 'Days logged',    bg: '#EAE0F2', color: 'var(--nova-purple)',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg> },
                { val: streak,     label: 'Current streak', bg: '#F1D7C5', color: '#A87155',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 2.5-1 2.5-2.5 0-2.5-3-3.5-2-6.5-3 1-5 4-5 7a6 6 0 0 0 12 0c0-4-3-7-7-10v3"/></svg> },
                { val: `${consistency}%`, label: 'Consistency', bg: '#F1D5DE', color: '#A85A75',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 6.6L21 9l-5 4.5L17.5 21 12 17.4 6.5 21 8 13.5 3 9l6.6-.4z"/></svg> },
              ].map((s) => (
                <div key={s.label} style={{
                  background: '#fff', border: '1px solid var(--nova-border-soft)',
                  borderRadius: 16, padding: 14, textAlign: 'center',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, background: s.bg, color: s.color,
                    margin: '0 auto 8px', display: 'grid', placeItems: 'center',
                  }}>{s.icon}</div>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 400, display: 'block' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--nova-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @media (max-width: 1060px) {
          .dash-layout, .dash-main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dash-hero-grid { grid-template-columns: 1fr !important; }
          .dash-hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </div>
  )
}
