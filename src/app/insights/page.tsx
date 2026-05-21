'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface InsightData {
  summary: string; correlations: string[]; suggestions: string[]; disclaimer: string
}
interface InsightResponse {
  insights: InsightData; meta: { daysAnalysed: number; generatedAt: string }
}

const STATIC_INSIGHTS = [
  { variant: 'featured', tag: 'This week\'s emotional trend', tagColor: '#7B6FA8',
    heading: 'Your mood lifted gently as your cycle moved past day five.',
    body: <>Mood ratings climbed from <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>5.1 average in the first five days</em> to <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>7.0 across days 6–8.</em> Journal language shifted too — words like "tired" appeared less, replaced by "clearer" and "okay."</>,
    stats: [{ v: '+1.9', l: 'Mood change' }, { v: '23', l: 'Logs analyzed' }, { v: '6', l: 'Journal entries' }, { v: '3', l: 'Cycle phases' }] },
  { variant: 'sky', tag: 'Sleep ↔ Stress', tagColor: '#8FA7C6',
    heading: 'Higher stress days were followed by lighter sleep.',
    body: <>Days where stress crossed <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>6/10</em> were typically followed by <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>0.4 hours less</em> total sleep that night.</>,
    stats: [{ v: '-0.4h', l: 'Sleep impact' }, { v: 'r=0.62', l: 'Correlation' }, { v: '30d', l: 'Window' }] },
  { variant: 'peach', tag: 'Cycle observation', tagColor: '#E8A98B',
    heading: 'Cramps in this cycle were lighter than the last two.',
    body: <>Your average cramp rating across days 1–5 was <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>4.1</em> — down from <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>6.8</em> last cycle.</>,
    stats: [{ v: '-2.7', l: 'vs last cycle' }, { v: '3', l: 'Cycles tracked' }] },
  { variant: 'rose', tag: 'Journal summary', tagColor: '#D28CA7',
    heading: <>You wrote most about <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>rest, family, and quiet evenings.</em></>,
    body: <>Across six entries this week, recurring themes were rest and slowness. "Anxious" appeared twice — both on logged high-caffeine days.</>,
    stats: [{ v: '6', l: 'Entries' }, { v: '847', l: 'Words' }, { v: '4', l: 'Tags used' }] },
  { variant: 'default', tag: 'Energy ↔ Movement', tagColor: '#7B6FA8',
    heading: 'Logged movement raised next-day energy by ~14%.',
    body: <>On the four days you logged exercise, the following day&apos;s energy averaged <em style={{ color:'var(--nova-text)', fontStyle:'italic' }}>6.9 vs 6.0</em>. A soft signal — listen to your body first.</>,
    stats: [{ v: '+0.9', l: 'Energy delta' }, { v: '4 of 7', l: 'Days active' }] },
]

const PAIRS = [
  { together: true,
    icons: ['linear-gradient(135deg,#7B6FA8,#A89ED0)', 'linear-gradient(135deg,#E8A98B,#C68B6A)'],
    iconSvgs: [
      <svg key="a" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>,
      <svg key="b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-9 12h7l-1 8 9-12h-7z"/></svg>,
    ],
    relation: '↑ Mood + Energy · lift together',
    heading: 'When your energy is up, your mood usually lifts too.',
    body: 'On most days you logged higher energy, you also rated your mood a little higher. This is the strongest connection Novana has spotted in your data.',
    strength: 3 },
  { together: true,
    icons: ['linear-gradient(135deg,#8FA7C6,#6E8AB2)', 'linear-gradient(135deg,#7B6FA8,#A89ED0)'],
    iconSvgs: [
      <svg key="a" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>,
      <svg key="b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>,
    ],
    relation: '↑ Sleep + Mood · lift together',
    heading: 'Mornings after good sleep felt softer in your mood.',
    body: 'Days following 7+ hours of sleep showed a noticeably warmer mood rating.',
    strength: 2 },
  { together: false,
    icons: ['linear-gradient(135deg,#D28CA7,#B16F8A)', 'linear-gradient(135deg,#8FA7C6,#6E8AB2)'],
    iconSvgs: [
      <svg key="a" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-9 12h7l-1 8 9-12h-7z"/></svg>,
      <svg key="b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>,
    ],
    relation: '↓ Stress + Sleep · move opposite',
    heading: 'High-stress days tended to bring lighter sleep that night.',
    body: 'On days you rated stress 6 or higher, you usually slept about 30–40 minutes less.',
    strength: 3 },
  { together: false,
    icons: ['linear-gradient(135deg,#D28CA7,#B16F8A)', 'linear-gradient(135deg,#7B6FA8,#A89ED0)'],
    iconSvgs: [
      <svg key="a" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-9 12h7l-1 8 9-12h-7z"/></svg>,
      <svg key="b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>,
    ],
    relation: '↓ Stress + Mood · move opposite',
    heading: 'Stress and mood pull in opposite directions for you.',
    body: 'When stress climbed, mood often dipped the same day.',
    strength: 2 },
]

export default function InsightsPage() {
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<InsightResponse | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [notEnoughData, setNotEnoughData] = useState(false)
  const [daysLogged, setDaysLogged] = useState(0)

  async function handleAnalyse() {
    setLoading(true); setError(null); setResult(null); setNotEnoughData(false)
    try {
      const res = await fetch('/api/insights', { method: 'POST' })
      const json = await res.json()
      if (res.status === 422 && json.error === 'not_enough_data') { setNotEnoughData(true); setDaysLogged(json.daysLogged); return }
      if (!res.ok) { setError(json.error ?? 'Something went wrong.'); return }
      setResult(json)
    } catch { setError('Network error. Please check your connection.') }
    finally { setLoading(false) }
  }

  return (
    <>
      <div className="space-y-8 max-w-4xl">

        {/* Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl">AI Insights ✦</h1>
          <p className="text-nova-muted mt-1 text-sm">Quiet observations drawn from what you&apos;ve logged.</p>
        </div>

        {/* Hero — sunset-water bg + glowing orb */}
        <section className="grain relative overflow-hidden text-center text-white rounded-[var(--radius-xl)]" style={{ padding: '56px 40px' }}>
          <Image src="/images/sunset-water.jpg" alt="" fill className="object-cover object-center" style={{ zIndex: 0 }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(46,36,64,0.05) 0%, rgba(46,36,64,0.35) 60%, rgba(46,36,64,0.55) 100%)', zIndex: 1 }} />
          <div className="absolute" style={{
            top: '38%', left: '50%', width: 540, height: 540,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,215,180,0.45) 0%, rgba(232,168,200,0.20) 35%, transparent 70%)',
            filter: 'blur(40px)', borderRadius: '50%', animation: 'pulse-bg 6s ease-in-out infinite',
            zIndex: 1, pointerEvents: 'none',
          }} />
          <div className="relative" style={{ zIndex: 2 }}>
            <div className="animate-float mx-auto" style={{
              width: 96, height: 96, borderRadius: '50%', marginBottom: 24,
              background: 'radial-gradient(circle at 35% 30%, #fff 0%, #FBE2C8 30%, #E8A98B 60%, #D28CA7 100%)',
              boxShadow: '0 0 60px rgba(232,169,139,0.6), 0 0 120px rgba(210,140,167,0.4), inset -10px -10px 30px rgba(123,111,168,0.3)',
            }} />
            <h1 className="font-display" style={{ color: '#fff', fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 300, margin: '0 0 14px' }}>
              Analyze my <em style={{ fontStyle: 'italic' }}>patterns.</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 16, maxWidth: '56ch', margin: '0 auto 32px' }}>
              Novana looks gently across your last 30 days of logs, journal entries, and cycle phases — surfacing soft observations to notice, never prescribe.
            </p>
            <button onClick={handleAnalyse} disabled={loading} style={{
              background: 'rgba(255,255,255,0.96)', color: 'var(--nova-text)',
              padding: '14px 28px', fontSize: 15, fontWeight: 500, borderRadius: 999,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.7), 0 18px 60px rgba(232,169,139,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: 10, opacity: loading ? 0.7 : 1,
            }}>
              <svg viewBox="0 0 24 24" fill="#E8A98B" width="16" height="16"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>
              {loading ? 'Analysing your patterns…' : 'Analyze my patterns'}
            </button>
            <div style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
              Last analysis · <strong style={{ color: '#fff', fontWeight: 500 }}>2 hours ago</strong> · 23 logs · 6 journal entries
            </div>
          </div>
        </section>

        {/* Not enough data */}
        {notEnoughData && (
          <div className="card p-8 text-center space-y-4">
            <p className="text-nova-muted text-sm">You&apos;ve logged <strong className="text-nova-text">{daysLogged} day{daysLogged !== 1 ? 's' : ''}</strong> so far. You need at least 3 days of data for meaningful insights.</p>
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-nova-border rounded-full overflow-hidden">
                <div className="h-2 rounded-full" style={{ width: `${Math.min((daysLogged / 3) * 100, 100)}%`, background: 'linear-gradient(90deg, #8A7DBC, #E8A98B)' }} />
              </div>
              <p className="text-xs text-nova-muted mt-2">{daysLogged}/3 days minimum</p>
            </div>
          </div>
        )}

        {error && <div className="card p-5"><p className="text-sm" style={{ color: '#B85A82' }}>{error}</p></div>}

        {/* AI results (when available) */}
        {result && (
          <div className="card p-7 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-nova-muted">Based on <strong className="text-nova-text">{result.meta.daysAnalysed} days</strong> · Generated {new Date(result.meta.generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <button onClick={() => setResult(null)} className="text-xs text-nova-purple hover:underline">← Back</button>
            </div>
            <div>
              <h3 className="font-display text-xl mb-2">Overview</h3>
              <p className="text-nova-muted text-sm leading-relaxed">{result.insights.summary}</p>
            </div>
            <div>
              <h3 className="font-display text-xl mb-3">Patterns &amp; correlations</h3>
              <div className="space-y-3">
                {result.insights.correlations.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(123,111,168,0.15)', color: 'var(--nova-purple)', display: 'grid', placeItems: 'center', fontSize: 11, flexShrink: 0, marginTop: 2 }}>{i+1}</span>
                    <p className="text-nova-muted text-sm leading-relaxed">{c}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl mb-3">Gentle suggestions</h3>
              <div className="space-y-3">
                {result.insights.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-nova-peach text-base mt-0.5">✦</span>
                    <p className="text-nova-muted text-sm leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="disclaimer">{result.insights.disclaimer}</p>
          </div>
        )}

        {/* Static insight grid (shown when no AI result yet) */}
        {!result && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            {STATIC_INSIGHTS.map((ins, idx) => (
              <div key={idx} style={{
                padding: 28, borderRadius: 'var(--radius-lg)',
                background: ins.variant === 'featured'
                  ? 'radial-gradient(60% 60% at 90% 0%, rgba(232,169,139,0.30) 0%, transparent 70%), linear-gradient(160deg, #F1E4DA 0%, #E8C5D4 100%)'
                  : 'var(--nova-card-2)',
                border: '1px solid var(--nova-border-soft)',
                gridColumn: ins.variant === 'featured' ? '1 / -1' : 'auto',
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--nova-muted)', marginBottom: 14 }}>
                  <i style={{ width: 8, height: 8, borderRadius: '50%', background: ins.tagColor, display: 'inline-block' }} />
                  {ins.tag}
                </div>
                <h3 className="font-display" style={{ fontSize: ins.variant === 'featured' ? 30 : 24, fontWeight: 400, margin: '0 0 12px' }}>{ins.heading}</h3>
                <p style={{ color: 'var(--nova-muted)', fontSize: ins.variant === 'featured' ? 15 : 14, lineHeight: 1.65, margin: '0 0 14px' }}>{ins.body}</p>
                <div style={{ display: 'flex', gap: 18, paddingTop: 14, borderTop: '1px solid var(--nova-border-soft)', marginTop: 14 }}>
                  {ins.stats.map((s) => (
                    <div key={s.l} style={{ fontSize: 11, color: 'var(--nova-muted)' }}>
                      <div className="font-display" style={{ fontSize: 22, color: 'var(--nova-text)', fontWeight: 400 }}>{s.v}</div>
                      {s.l}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How your symptoms move together */}
        <section className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>How your symptoms move together</h3>
              <p style={{ color: 'var(--nova-muted)', margin: '4px 0 0', fontSize: 13 }}>Plain-language patterns from your last 30 days.</p>
            </div>
            <span className="chip"><i className="dot" /> Educational only</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18 }}>
            {PAIRS.map((p, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--nova-border-soft)', borderRadius: 20, padding: 20, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {p.iconSvgs.map((svg, j) => (
                    <span key={j} style={{ width: 38, height: 38, borderRadius: '50%', background: p.icons[j], color: '#fff', display: 'grid', placeItems: 'center' }}>{svg}</span>
                  )).reduce((acc, el, j) => {
                    if (j > 0) acc.push(<span key={`link-${j}`} style={{ width: 14, borderTop: `2px ${p.together ? 'solid' : 'dashed'} ${p.together ? 'var(--nova-purple-light)' : 'var(--nova-rose)'}`, margin: '0 -2px' }} />)
                    acc.push(el); return acc
                  }, [] as React.ReactNode[])}
                </div>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--nova-muted)', marginBottom: 6 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.together ? 'rgba(123,111,168,0.16)' : 'rgba(210,140,167,0.18)', color: p.together ? 'var(--nova-purple-dark)' : '#9C4F6D', display: 'grid', placeItems: 'center', fontSize: 10 }}>
                      {p.together ? '↑' : '↓'}
                    </span>
                    {p.relation}
                  </div>
                  <h4 className="font-display" style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.35, margin: '0 0 10px' }}>{p.heading}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--nova-muted)', margin: '0 0 12px' }}>{p.body}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--nova-muted)' }}>
                    Strength
                    <span style={{ display: 'inline-flex', gap: 3 }}>
                      {[1,2,3].map((n) => (
                        <i key={n} style={{ width: 22, height: 6, borderRadius: 999, background: n <= p.strength ? (p.together ? 'var(--nova-purple)' : 'var(--nova-rose)') : 'var(--nova-card)', display: 'inline-block' }} />
                      ))}
                    </span>
                    {p.strength === 3 ? 'Strong' : p.strength === 2 ? 'Moderate' : 'Gentle'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="disclaimer" style={{ marginTop: 14 }}>These connections come from your own logs. They describe trends, not causes — and they&apos;re not medical advice.</p>
        </section>

        {/* Journal summary */}
        <section className="grain overflow-hidden rounded-[var(--radius-lg)]" style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)' }}>
          <div style={{ padding: 24, background: 'linear-gradient(160deg, #EEE2EC 0%, #F2D9C4 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="eyebrow">Weekly journal summary</div>
                <h3 className="font-display" style={{ fontSize: 24, fontWeight: 400, margin: 0 }}>A quiet week of rest and small clarity.</h3>
                <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginTop: 4 }}>Generated Sunday · from 6 entries</div>
              </div>
              <button onClick={handleAnalyse} disabled={loading} className="btn-soft" style={{ fontSize: 13 }}>Regenerate</button>
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
              This week, your writing leaned soft — themes of <em style={{ fontStyle: 'italic' }}>rest, family meals, and slow Sunday evenings</em> recurred across your entries. Words tagged <em style={{ fontStyle: 'italic' }}>anxious</em> appeared on the two days following late nights; <em style={{ fontStyle: 'italic' }}>peaceful</em> showed up after walks.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: '0 0 14px' }}>
              Notice: your most settled entries followed mornings where you logged sleep above 7 hours.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[['peaceful · 4','default'],['tired · 3','peach'],['anxious · 2','rose'],['grateful · 3','sky'],['hopeful · 2','default']].map(([t,v]) => (
                <span key={t} className={`chip${v !== 'default' ? ` ${v}` : ''}`}><i className="dot" style={{ background: v === 'peach' ? 'var(--nova-peach)' : v === 'rose' ? 'var(--nova-rose)' : v === 'sky' ? '#8FA7C6' : 'var(--nova-purple)' }} /> {t}</span>
              ))}
            </div>
            <p className="disclaimer" style={{ marginTop: 18 }}>Summary is generated from your own entries. It is educational, not clinical.</p>
          </div>
        </section>

      </div>

      <style>{`@keyframes pulse-bg { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; } 50% { transform: translate(-50%,-50%) scale(1.15); opacity: 1; } }`}</style>
    </>
  )
}
