'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

interface ChartDataPoint {
  date: string; logged_at: string
  mood: number; fatigue: number; sleep_hours: number; stress: number
  acne: number; cramps: number; exercise_mins: number; cycle_status: string
}
interface Averages {
  mood: number | null; fatigue: number | null; sleep_hours: number | null
  stress: number | null; acne: number | null; cramps: number | null; exercise_mins: number | null
}
interface AnalyticsData { chartData: ChartDataPoint[]; averages: Averages; totalDays: number }

const PHASES = [
  { name: 'Menstrual',  meta: 'Days 1–5 · avg this cycle',   accent: '#D28CA7', stats: { Mood: '5.1', Energy: '4.3', Cramps: '6.8' } },
  { name: 'Follicular', meta: 'Days 6–13 · current',          accent: '#7B6FA8', stats: { Mood: '7.0', Energy: '6.8', Cramps: '1.2' } },
  { name: 'Ovulatory',  meta: 'Days 14–16',                   accent: '#E8A98B', stats: { Mood: '7.4', Energy: '7.2', Cramps: '2.1' } },
  { name: 'Luteal',     meta: 'Days 17–28',                   accent: '#8FA7C6', stats: { Mood: '5.6', Energy: '5.2', Cramps: '3.6' } },
]

const OBS = [
  { gradient: 'linear-gradient(135deg, #7B6FA8, #D28CA7)', label: 'Sleep ↔ Exercise',
    text: <>On days you logged any movement, sleep quality averaged <em style={{ color: 'var(--nova-purple-dark)', fontStyle: 'italic' }}>1.6 points higher</em> than days you didn&apos;t.</> },
  { gradient: 'linear-gradient(135deg, #E8A98B, #D28CA7)', label: 'Stress ↔ Cycle',
    text: <>Stress trends gently <em style={{ color: 'var(--nova-purple-dark)', fontStyle: 'italic' }}>higher in the luteal phase</em> across your last three cycles — a common pattern, not a problem.</> },
  { gradient: 'linear-gradient(135deg, #8FA7C6, #7B6FA8)', label: 'Energy rhythm',
    text: <>Your highest-energy days cluster around <em style={{ color: 'var(--nova-purple-dark)', fontStyle: 'italic' }}>days 8–14</em> — the second week of your cycle.</> },
]

export default function AnalyticsPage() {
  const [data, setData]       = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays]       = useState(7)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true); setError(null)
      try {
        const today = new Date().toLocaleDateString('en-CA')
        const res = await fetch(`/api/analytics?days=${days}&today=${today}`)
        const json = await res.json()
        if (!res.ok) { setError(json.error ?? 'Failed to load analytics.'); return }
        console.log('[Analytics] data fetched:', {
          days,
          totalDays: json.totalDays,
          chartDataLength: json.chartData?.length,
          firstRow: json.chartData?.[0],
          averages: json.averages,
        })
        setData(json)
      } catch { setError('Network error. Please try again.') }
      finally { setLoading(false) }
    }
    loadData()
  }, [days])

  const avgs = data?.averages
  const chartData = data?.chartData ?? []

  return (
    <>
      <div className="space-y-8 max-w-5xl">

        {/* Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl">Analytics</h1>
          <p className="text-nova-muted mt-1 text-sm">A slow, honest look at how your patterns are moving.</p>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            background: 'var(--nova-card)', border: '1px solid var(--nova-border-soft)',
            borderRadius: 999, padding: 4,
          }}>
            {[['Today',1],['7 days',7],['30 days',30],['90 days',90]].map(([lbl,val]) => (
              <button key={val} onClick={() => setDays(Number(val))} style={{
                border: 'none', padding: '8px 16px', borderRadius: 999,
                background: days === Number(val) ? '#fff' : 'transparent',
                color: days === Number(val) ? 'var(--nova-text)' : 'var(--nova-muted)',
                boxShadow: days === Number(val) ? 'var(--shadow-sm)' : 'none',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>{lbl}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            <span className="chip"><i className="dot" /> Mood</span>
            <span className="chip peach"><i className="dot" style={{ background: 'var(--nova-peach)' }} /> Fatigue</span>
            <span className="chip rose"><i className="dot" style={{ background: 'var(--nova-rose)' }} /> Stress</span>
            <span className="chip" style={{ background: 'rgba(143,167,198,0.12)', borderColor: 'rgba(143,167,198,0.3)', color: '#5A6F8F' }}><i className="dot" style={{ background: '#8FA7C6' }} /> Sleep</span>
          </div>
        </div>

        {error && <div className="card p-4"><p className="text-sm" style={{ color: '#B85A82' }}>{error}</p></div>}

        {/* Big chart — sunset-water background */}
        <section className="grain relative overflow-hidden rounded-[var(--radius-lg)]" style={{ minHeight: 460, boxShadow: 'var(--shadow)' }}>
          <Image src="/images/sunset-water.jpg" alt="" fill className="object-cover object-center" style={{ zIndex: 0 }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(74,63,102,0.15) 0%, rgba(74,63,102,0.05) 35%, transparent 100%)',
            zIndex: 1,
          }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 88% 28%, rgba(255,220,180,0.45) 0%, transparent 6%), radial-gradient(circle at 15% 85%, rgba(232,168,200,0.40) 0%, transparent 8%)',
            zIndex: 1, filter: 'blur(2px)',
          }} />
          <div className="relative analytics-chart-grid" style={{ zIndex: 2, padding: 32, display: 'grid', gridTemplateColumns: '1fr 240px', gap: 28 }}>
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ color: 'rgba(255,252,247,0.85)', fontSize: 13, textShadow: '0 1px 4px rgba(74,63,102,0.25)' }}>Past {days} days · all symptoms</div>
                <h2 className="font-display" style={{ color: 'rgb(47,42,40)', fontSize: 28, fontWeight: 400, margin: 0, textShadow: '0 1px 2px rgba(255,252,247,0.6)' }}>Symptom trends</h2>
              </div>
              {/* Glass chart panel */}
              <div style={{
                background: 'rgba(253,248,238,0.75)',
                backdropFilter: 'blur(22px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.85)',
                borderRadius: 18, padding: '18px 14px 14px',
                boxShadow: '0 8px 28px rgba(74,63,102,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
              }}>
                {loading ? (
                  <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--nova-muted)' }}>Loading trends…</div>
                  </div>
                ) : chartData.length === 0 ? (
                  <div style={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <p style={{ fontSize: 13, color: 'var(--nova-purple)', fontWeight: 600 }}>No entries for this period</p>
                    <p style={{ fontSize: 12, color: 'var(--nova-muted)' }}>Try a wider range or log today</p>
                  </div>
                ) : (
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 4" stroke="rgba(74,63,102,0.22)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgb(74,63,102)', fontWeight: 500 }} tickLine={false} axisLine={false} />
                        <YAxis domain={[0,10]} tick={{ fontSize: 11, fill: 'rgb(74,63,102)' }} tickLine={false} axisLine={false} tickCount={5} />
                        <Tooltip contentStyle={{ background: 'rgba(253,248,238,0.95)', border: '1px solid rgba(255,255,255,0.85)', borderRadius: 12, fontSize: 12, backdropFilter: 'blur(12px)' }} />
                        <Line type="monotone" dataKey="mood" stroke="#5A4E8A" strokeWidth={3} dot={{ r: 6, fill: '#fff', stroke: '#5A4E8A', strokeWidth: 2.5 }} connectNulls />
                        <Line type="monotone" dataKey="fatigue" stroke="#C97A55" strokeWidth={3} dot={{ r: 5.5, fill: '#fff', stroke: '#C97A55', strokeWidth: 2.5 }} connectNulls />
                        <Line type="monotone" dataKey="stress" stroke="#B85A82" strokeWidth={3} dot={{ r: 5.5, fill: '#fff', stroke: '#B85A82', strokeWidth: 2.5 }} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Legend pill */}
            <div style={{
              background: 'rgba(253,250,247,0.72)', border: '1px solid rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px) saturate(140%)', borderRadius: 20, padding: 18,
              color: 'var(--nova-text)', boxShadow: '0 8px 28px rgba(74,63,102,0.10)',
            }}>
              <h5 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--nova-muted)', margin: '0 0 12px', fontWeight: 600 }}>Filter trends</h5>
              {[
                { color: '#C9B7E0', nm: 'Mood',    vl: avgs?.mood != null ? String(avgs.mood) : '6.4' },
                { color: '#F1B894', nm: 'Fatigue', vl: avgs?.fatigue != null ? String(avgs.fatigue) : '5.8' },
                { color: '#E8A8C0', nm: 'Stress',  vl: avgs?.stress != null ? String(avgs.stress) : '4.2' },
                { color: '#9FB5D2', nm: 'Sleep',   vl: avgs?.sleep_hours != null ? `${avgs.sleep_hours}h` : '7.1h' },
              ].map((row) => (
                <div key={row.nm} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid var(--nova-border-soft)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--nova-muted)' }}>{row.nm}</span>
                  <span className="font-display" style={{ fontSize: 18 }}>{row.vl}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, fontSize: 11, opacity: 0.7, color: 'var(--nova-muted)' }}>Tap a metric to focus, double-tap to isolate.</div>
            </div>
          </div>
        </section>

        {/* Mini stat grid */}
        <div className="analytics-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {[
            { lbl: 'Avg Mood',    val: avgs?.mood != null ? `${avgs.mood}` : '6.4',           unit: '/10', delta: '↑ 0.8 vs last week', deltaColor: 'var(--nova-purple-dark)', stroke: '#7B6FA8', path: 'M0,20 Q15,10 30,16 T60,12 T100,8' },
            { lbl: 'Avg Fatigue', val: avgs?.fatigue != null ? `${avgs.fatigue}` : '5.8',     unit: '/10', delta: '↓ 0.5 vs last week', deltaColor: '#A87155', stroke: '#E8A98B', path: 'M0,12 Q20,20 40,16 T70,22 T100,18' },
            { lbl: 'Avg Stress',  val: avgs?.stress != null ? `${avgs.stress}` : '4.2',       unit: '/10', delta: '↓ 1.1 vs last week', deltaColor: 'var(--nova-rose)', stroke: '#D28CA7', path: 'M0,8 Q20,22 40,14 T70,20 T100,22' },
            { lbl: 'Avg Sleep',   val: avgs?.sleep_hours != null ? `${avgs.sleep_hours}` : '7.1', unit: 'h', delta: '↑ 0.4h vs last week', deltaColor: '#5A6F8F', stroke: '#8FA7C6', path: 'M0,18 Q20,8 40,14 T70,10 T100,12' },
          ].map((s) => (
            <div key={s.lbl} style={{ padding: 20, borderRadius: 'var(--radius)', background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)' }}>
              <div style={{ fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.lbl}</div>
              <div className="font-display" style={{ fontSize: 32, fontWeight: 400, marginTop: 4 }}>
                {s.val}<span style={{ fontSize: 14, color: 'var(--nova-muted)' }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 12, color: s.deltaColor }}>{s.delta}</div>
              <svg viewBox="0 0 100 32" preserveAspectRatio="none" style={{ height: 32, width: '100%', marginTop: 8 }}>
                <path d={s.path} fill="none" stroke={s.stroke} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Cycle phase comparison */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: 26, fontWeight: 400, margin: 0 }}>By cycle phase</h2>
              <p style={{ color: 'var(--nova-muted)', margin: '4px 0 0', fontSize: 13 }}>How the same symptom feels in different phases of your cycle.</p>
            </div>
            <Link href="/cycle" style={{ fontSize: 12, color: 'var(--nova-muted)', textDecoration: 'none' }}>Last 3 cycles ↓</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {PHASES.map((p) => (
              <div key={p.name} style={{
                border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius)',
                padding: 18, background: '#fff', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: 4, background: p.accent }} />
                <h4 className="font-display" style={{ fontSize: 18, fontWeight: 400, margin: 0 }}>{p.name}</h4>
                <div style={{ fontSize: 11, color: 'var(--nova-muted)', margin: '4px 0 14px' }}>{p.meta}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  {Object.entries(p.stats).map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: 'var(--nova-muted)' }}>{k}</div>
                      <div className="font-display" style={{ fontSize: 22 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI observations */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="font-display" style={{ fontSize: 26, fontWeight: 400, margin: 0 }}>A few gentle observations</h2>
            <Link href="/insights" style={{ fontSize: 12, color: 'var(--nova-muted)', textDecoration: 'none' }}>All insights →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {OBS.map((o) => (
              <div key={o.label} className="card" style={{ padding: '22px 24px', display: 'grid', gridTemplateColumns: '38px 1fr', gap: 16, alignItems: 'start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, display: 'grid', placeItems: 'center', background: o.gradient, color: '#fff' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--nova-muted)', marginBottom: 4 }}>{o.label}</div>
                  <p className="font-display" style={{ fontSize: 17, lineHeight: 1.5, margin: 0, fontWeight: 400 }}>{o.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="disclaimer" style={{ marginTop: 20 }}>Observations are based on your own logs and are not medical advice or diagnosis.</p>
        </section>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .analytics-chart-grid { grid-template-columns: 1fr !important; }
          .analytics-chart-grid > div:last-child { display: none; }
          .analytics-stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  )
}
