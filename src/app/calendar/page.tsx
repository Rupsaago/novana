'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PHASE_STYLES: Record<string, { bg: string; numColor: string; phColor: string; label: string }> = {
  menstrual: { bg: 'linear-gradient(160deg, #F2D5DE 0%, #E8C0CC 100%)', numColor: '#8B3E5A', phColor: '#8B3E5A', label: 'Menst.' },
  follicular: { bg: 'linear-gradient(160deg, #EDE3F2 0%, #DECCE8 100%)', numColor: 'var(--nova-purple-dark)', phColor: 'var(--nova-purple-dark)', label: 'Follic.' },
  ovulatory: { bg: 'linear-gradient(160deg, #F5E1D2 0%, #F1C9A8 100%)', numColor: '#8B5530', phColor: '#8B5530', label: 'Ovul.' },
  luteal: { bg: 'linear-gradient(160deg, #E1E8F0 0%, #C8D7E5 100%)', numColor: '#4A5F7A', phColor: '#4A5F7A', label: 'Luteal' },
}

function getPhase(dayOfMonth: number): string {
  if (dayOfMonth >= 1 && dayOfMonth <= 7) return 'follicular'
  if (dayOfMonth >= 8 && dayOfMonth <= 12) return 'ovulatory'
  if (dayOfMonth >= 13 && dayOfMonth <= 17) return 'luteal'
  if (dayOfMonth >= 18 && dayOfMonth <= 22) return 'menstrual'
  if (dayOfMonth >= 23 && dayOfMonth <= 30) return 'follicular'
  if (dayOfMonth === 31) return 'ovulatory'
  return 'follicular'
}

const LOGGED = new Set([1,2,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25])
const TODAY = 25
const FIRST_DOW = 5 // May 2026 starts on Friday (0=Sun)

type Cell = { n: number; phase?: string; muted?: boolean; today?: boolean; future?: boolean; logged?: boolean }

function buildCells(): Cell[] {
  const cells: Cell[] = []
  // Trailing April days
  for (let i = FIRST_DOW - 1; i >= 0; i--) {
    cells.push({ n: 30 - i, muted: true })
  }
  // May 1–31
  for (let d = 1; d <= 31; d++) {
    cells.push({ n: d, phase: getPhase(d), today: d === TODAY, future: d > TODAY, logged: LOGGED.has(d) })
  }
  // Trailing June days to fill 6 rows
  let j = 1
  while (cells.length < 42) { cells.push({ n: j++, muted: true }) }
  return cells
}

const CELLS = buildCells()

const DAY_DETAIL = {
  'Sunday, May 25': [
    { label: 'Mood', val: '7', unit: '/10' },
    { label: 'Energy', val: '6', unit: '/10' },
    { label: 'Sleep', val: '7.2', unit: 'h' },
    { label: 'Stress', val: '4', unit: '/10' },
    { label: 'Cramps', val: '5', unit: '/10' },
  ]
}

export default function CalendarPage() {
  const [selected, setSelected] = useState(TODAY)

  return (
    <>
      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 22, alignItems: 'start' }}>

        {/* Calendar card */}
        <section className="card" style={{ padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: 0 }}>
              <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>May</em> 2026
            </h2>
            <div style={{ display: 'inline-flex', gap: 4 }}>
              <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button style={{ height: 36, padding: '0 14px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer' }}>Today</button>
              <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, fontSize: 11, color: 'var(--nova-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', padding: 4 }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {CELLS.map((cell, i) => {
              if (cell.muted) return (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 14, background: 'var(--nova-card)', border: '1px solid var(--nova-border-soft)', padding: 8, opacity: 0.5 }}>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, lineHeight: 1, color: 'var(--nova-muted)' }}>{cell.n}</div>
                </div>
              )
              const ps = cell.phase ? PHASE_STYLES[cell.phase] : undefined
              const isSelected = cell.n === selected && !cell.muted
              return (
                <div
                  key={i}
                  onClick={() => !cell.muted && setSelected(cell.n!)}
                  style={{
                    aspectRatio: '1', borderRadius: 14,
                    background: ps?.bg || '#fff',
                    border: cell.today ? '2px solid var(--nova-purple)' : (isSelected ? '2px solid rgba(123,111,168,0.5)' : '1px solid var(--nova-border-soft)'),
                    padding: 8, display: 'flex', flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform .15s ease, box-shadow .15s ease',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: cell.today ? '0 0 0 2px var(--nova-purple), var(--shadow-sm)' : undefined,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, lineHeight: 1, color: ps?.numColor || 'var(--nova-text)', opacity: cell.future ? 0.55 : 1 }}>
                    {cell.n}
                    {cell.today && <div style={{ width: 14, height: 2, background: 'var(--nova-purple)', marginTop: 2, borderRadius: 999 }} />}
                  </div>
                  {cell.logged && !cell.future && (
                    <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                      <i style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-purple)', display: 'inline-block' }} />
                    </div>
                  )}
                  <div style={{ fontSize: 9, color: ps?.phColor || 'var(--nova-muted)', marginTop: 'auto', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {ps?.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Phase legend */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--nova-border-soft)', fontSize: 12, color: 'var(--nova-muted)' }}>
            {[
              { grad: 'linear-gradient(135deg, #E8C0CC, #D28CA7)', label: 'Menstrual' },
              { grad: 'linear-gradient(135deg, #DECCE8, #A89ED0)', label: 'Follicular' },
              { grad: 'linear-gradient(135deg, #F1C9A8, #E8A98B)', label: 'Ovulatory' },
              { grad: 'linear-gradient(135deg, #C8D7E5, #8FA7C6)', label: 'Luteal' },
            ].map(l => (
              <span key={l.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i style={{ width: 12, height: 12, borderRadius: 4, display: 'inline-block', background: l.grad }} />
                {l.label}
              </span>
            ))}
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: 'var(--nova-purple)' }} />
              Logged a symptom
            </span>
          </div>
        </section>

        {/* Side panel */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Cycle arc card */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ width: '100%', aspectRatio: '1.4', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
              <Image src="/images/sunset-water.jpg" alt="" fill className="object-cover" />
              <div className="grain" style={{ position: 'absolute', inset: 0 }} />
              <h4 style={{ position: 'absolute', top: 18, left: 18, color: '#fff', fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>Follicular</h4>
              <div style={{ position: 'absolute', top: 18, right: 18, color: 'rgba(255,255,255,0.85)', fontSize: 12, background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 999, backdropFilter: 'blur(8px)' }}>Day 8 of 28</div>
              <div style={{ position: 'absolute', inset: 'auto 0 14px 0', textAlign: 'center', color: '#fff', fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                May 18 → May 31 · the warm second week
              </div>
            </div>
            <p style={{ color: 'var(--nova-muted)', fontSize: 13, lineHeight: 1.6, margin: '16px 0 0' }}>
              Energy and clarity often return in the follicular phase. Three days from now, Novana will mark your shift toward ovulatory.
            </p>
          </div>

          {/* Day details card */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div className="eyebrow">Selected day</div>
                <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: '4px 0 0' }}>Sunday, May {selected}</h3>
              </div>
              <span className="chip"><i className="dot" /> Follicular</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Mood', val: '7', unit: '/10' },
                { label: 'Energy', val: '6', unit: '/10' },
                { label: 'Sleep', val: '7.2', unit: 'h' },
                { label: 'Stress', val: '4', unit: '/10' },
                { label: 'Cramps', val: '5', unit: '/10' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fff', border: '1px solid var(--nova-border-soft)', borderRadius: 12, fontSize: 13 }}>
                  <div style={{ color: 'var(--nova-text)' }}>{r.label}</div>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, color: 'var(--nova-text)' }}>
                    {r.val}<span style={{ color: 'var(--nova-muted)', fontSize: 12 }}> {r.unit}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16, padding: '10px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, color: 'var(--nova-text)', textDecoration: 'none' }}>
              Open in dashboard →
            </Link>
          </div>

          {/* This month stats */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: '0 0 12px' }}>This month</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
              <div>
                <div className="eyebrow">Days logged</div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28 }}>23<span style={{ fontSize: 13, color: 'var(--nova-muted)' }}>/25</span></div>
              </div>
              <div>
                <div className="eyebrow">Phase shifts</div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28 }}>3</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <p className="disclaimer" style={{ textAlign: 'center', margin: '36px 0 0' }}>Cycle phases are estimated from your logs. This is not medical advice.</p>
    </>
  )
}
