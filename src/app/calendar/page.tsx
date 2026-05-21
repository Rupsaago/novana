'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SymptomRow } from '@/types/database'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DOW_LABELS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function moodBg(mood: number): string {
  if (mood >= 8) return 'linear-gradient(160deg, #FFF4E0, #F1D4A4)'
  if (mood >= 6) return 'linear-gradient(160deg, #EDE3F2, #D4C7E8)'
  if (mood >= 4) return 'linear-gradient(160deg, #E8EFF7, #C8D7E5)'
  return 'linear-gradient(160deg, #F0E8EC, #DFD0D8)'
}

function moodTextColor(mood: number): string {
  if (mood >= 8) return '#8B5530'
  if (mood >= 6) return 'var(--nova-purple-dark)'
  if (mood >= 4) return '#4A5F7A'
  return '#8B3E5A'
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDOW(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

type Cell = { n: number; dateStr?: string; muted?: boolean; today?: boolean; future?: boolean; entry?: SymptomRow }

export default function CalendarPage() {
  const now      = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0])
  const [loggedMap, setLoggedMap]       = useState<Map<string, SymptomRow>>(new Map())
  const [loading, setLoading]           = useState(true)

  // Load symptom data for a wide window (90 days) to cover prev/current/next month
  useEffect(() => {
    fetch('/api/symptoms?days=90')
      .then(r => r.json())
      .then((json: { data?: SymptomRow[] }) => {
        const map = new Map<string, SymptomRow>()
        for (const row of json.data ?? []) map.set(row.logged_at, row)
        setLoggedMap(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  function goToday() {
    const t = new Date()
    setYear(t.getFullYear())
    setMonth(t.getMonth())
    setSelectedDate(t.toISOString().split('T')[0])
  }

  const todayStr   = now.toISOString().split('T')[0]
  const totalDays  = daysInMonth(year, month)
  const startDOW   = firstDOW(year, month)
  const prevDays   = daysInMonth(year, month - 1 < 0 ? 11 : month - 1)

  const cells: Cell[] = []
  for (let i = startDOW - 1; i >= 0; i--) cells.push({ n: prevDays - i, muted: true })
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const entry   = loggedMap.get(dateStr)
    cells.push({ n: d, dateStr, today: dateStr === todayStr, future: dateStr > todayStr, entry })
  }
  let j = 1
  while (cells.length < 42) cells.push({ n: j++, muted: true })

  const selectedEntry = selectedDate ? loggedMap.get(selectedDate) : undefined
  const selectedDay   = selectedDate ? parseInt(selectedDate.split('-')[2]) : parseInt(todayStr.split('-')[2])
  const loggedCount   = cells.filter(c => !c.muted && !c.future && c.entry).length

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 22, alignItems: 'start' }}>

        {/* Calendar card */}
        <section className="card" style={{ padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: 0 }}>
              <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>{MONTH_NAMES[month]}</em> {year}
            </h2>
            <div style={{ display: 'inline-flex', gap: 4 }}>
              <button onClick={prevMonth} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button onClick={goToday} style={{ height: 36, padding: '0 14px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer' }}>Today</button>
              <button onClick={nextMonth} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, fontSize: 11, color: 'var(--nova-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {DOW_LABELS.map(d => <div key={d} style={{ textAlign: 'center', padding: 4 }}>{d}</div>)}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {cells.map((cell, i) => {
              if (cell.muted) return (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 14, background: 'var(--nova-card)', border: '1px solid var(--nova-border-soft)', padding: 8, opacity: 0.5 }}>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, lineHeight: 1, color: 'var(--nova-muted)' }}>{cell.n}</div>
                </div>
              )
              const isSelected = cell.dateStr === selectedDate
              const bg = cell.entry ? moodBg(cell.entry.mood) : (cell.future ? 'var(--nova-card)' : '#fff')
              const tc = cell.entry ? moodTextColor(cell.entry.mood) : 'var(--nova-text)'
              return (
                <div
                  key={i}
                  onClick={() => cell.dateStr && setSelectedDate(cell.dateStr)}
                  style={{
                    aspectRatio: '1', borderRadius: 14,
                    background: bg,
                    border: cell.today ? '2px solid var(--nova-purple)' : isSelected ? '2px solid rgba(123,111,168,0.5)' : '1px solid var(--nova-border-soft)',
                    padding: 8, display: 'flex', flexDirection: 'column',
                    cursor: 'pointer', transition: 'transform .15s ease',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: cell.today ? '0 0 0 2px var(--nova-purple), var(--shadow-sm)' : undefined,
                    opacity: cell.future ? 0.55 : 1,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, lineHeight: 1, color: tc }}>
                    {cell.n}
                    {cell.today && <div style={{ width: 14, height: 2, background: 'var(--nova-purple)', marginTop: 2, borderRadius: 999 }} />}
                  </div>
                  {cell.entry && (
                    <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                      <i style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-purple)', display: 'inline-block' }} />
                    </div>
                  )}
                  {cell.entry && (
                    <div style={{ fontSize: 9, color: tc, marginTop: 'auto', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {cell.entry.mood}/10
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--nova-border-soft)', fontSize: 12, color: 'var(--nova-muted)' }}>
            {[
              { grad: 'linear-gradient(135deg, #FFF4E0, #F1D4A4)', label: 'Mood 8–10' },
              { grad: 'linear-gradient(135deg, #EDE3F2, #D4C7E8)', label: 'Mood 6–7' },
              { grad: 'linear-gradient(135deg, #E8EFF7, #C8D7E5)', label: 'Mood 4–5' },
              { grad: 'linear-gradient(135deg, #F0E8EC, #DFD0D8)', label: 'Mood 1–3' },
            ].map(l => (
              <span key={l.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i style={{ width: 12, height: 12, borderRadius: 4, display: 'inline-block', background: l.grad }} />
                {l.label}
              </span>
            ))}
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <i style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: 'var(--nova-purple)' }} />
              Logged
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
              <h4 style={{ position: 'absolute', top: 18, left: 18, color: '#fff', fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>
                {MONTH_NAMES[month]}
              </h4>
              <div style={{ position: 'absolute', top: 18, right: 18, color: 'rgba(255,255,255,0.85)', fontSize: 12, background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 999, backdropFilter: 'blur(8px)' }}>
                {loggedCount} logged
              </div>
              <div style={{ position: 'absolute', inset: 'auto 0 14px 0', textAlign: 'center', color: '#fff', fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 14, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                {loading ? 'Loading…' : `${loggedCount} of ${totalDays} days logged`}
              </div>
            </div>
          </div>

          {/* Day details card */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div className="eyebrow">Selected day</div>
                <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: '4px 0 0' }}>
                  {MONTH_NAMES[month]} {selectedDay}
                </h3>
              </div>
              <span className="chip">
                <i className="dot" style={{ background: selectedEntry ? moodTextColor(selectedEntry.mood) : 'var(--nova-muted)' }} />
                {selectedEntry ? `Mood ${selectedEntry.mood}/10` : 'No log'}
              </span>
            </div>
            {selectedEntry ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Mood',     val: selectedEntry.mood,           unit: '/10' },
                  { label: 'Fatigue',  val: selectedEntry.fatigue,        unit: '/10' },
                  { label: 'Sleep',    val: selectedEntry.sleep_hours,    unit: 'h'   },
                  { label: 'Stress',   val: selectedEntry.stress,         unit: '/10' },
                  { label: 'Cramps',   val: selectedEntry.cramps,         unit: '/10' },
                  { label: 'Exercise', val: selectedEntry.exercise_mins,  unit: 'min' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fff', border: '1px solid var(--nova-border-soft)', borderRadius: 12, fontSize: 13 }}>
                    <div style={{ color: 'var(--nova-text)' }}>{r.label}</div>
                    <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, color: 'var(--nova-text)' }}>
                      {r.val}<span style={{ color: 'var(--nova-muted)', fontSize: 12 }}> {r.unit}</span>
                    </div>
                  </div>
                ))}
                {selectedEntry.notes && (
                  <div style={{ padding: '10px 14px', background: 'rgba(168,158,208,0.08)', border: '1px solid var(--nova-border-soft)', borderRadius: 12, fontSize: 13, color: 'var(--nova-muted)', fontStyle: 'italic' }}>
                    {selectedEntry.notes}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--nova-muted)', fontSize: 13 }}>
                Nothing logged on this day.
              </div>
            )}
            <Link href="/today" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16, padding: '10px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, color: 'var(--nova-text)', textDecoration: 'none' }}>
              Log today →
            </Link>
          </div>

          {/* This month stats */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: '0 0 12px' }}>This month</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
              <div>
                <div className="eyebrow">Days logged</div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28 }}>
                  {loggedCount}<span style={{ fontSize: 13, color: 'var(--nova-muted)' }}>/{totalDays}</span>
                </div>
              </div>
              <div>
                <div className="eyebrow">Consistency</div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28 }}>
                  {totalDays > 0 ? Math.round((loggedCount / totalDays) * 100) : 0}<span style={{ fontSize: 13, color: 'var(--nova-muted)' }}>%</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <p className="disclaimer" style={{ textAlign: 'center', margin: '36px 0 0' }}>Cycle phases are estimated from your logs. This is not medical advice.</p>
    </>
  )
}
