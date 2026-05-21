'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SymptomRow } from '@/types/database'

type Daypart = 'morning' | 'day' | 'evening' | 'night'

function getDaypart(): Daypart {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)  return 'morning'
  if (h >= 12 && h < 17) return 'day'
  if (h >= 17 && h < 21) return 'evening'
  return 'night'
}

const SCENE: Record<Daypart, { img: string; sub: string; greeting: string }> = {
  morning: { img: '/images/sunset-clouds.jpg',    sub: "Let's take a quiet minute together. There's no goal — just notice yourself.", greeting: 'Good morning' },
  day:     { img: '/images/desert-dunes.jpg',     sub: 'The middle of the day is a kind place to pause. Drink something warm.',          greeting: 'Good afternoon' },
  evening: { img: '/images/sunset-mountains.jpg', sub: "Wind down the day. There's a few quiet hours left to claim as your own.",         greeting: 'Good evening' },
  night:   { img: '/images/sunset-water.jpg',     sub: "Slow your shoulders. We'll be here when you're ready to rest.",                  greeting: 'Good night' },
}

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const MOOD_ORBS = [
  { key: 'awful', label: 'heavy',  bg: 'radial-gradient(circle at 35% 30%, #9B8FB8 0%, #6B5A95 100%)' },
  { key: 'low',   label: 'tender', bg: 'radial-gradient(circle at 35% 30%, #B8A5D2 0%, #8A7BA8 100%)' },
  { key: 'ok',    label: 'okay',   bg: 'radial-gradient(circle at 35% 30%, #E8C9D4 0%, #D28CA7 100%)' },
  { key: 'good',  label: 'easy',   bg: 'radial-gradient(circle at 35% 30%, #F4D6BD 0%, #E8A98B 100%)' },
  { key: 'great', label: 'bright', bg: 'radial-gradient(circle at 35% 30%, #FFE4B8 0%, #F0B570 100%)' },
]

const MOOD_SCORE: Record<string, number> = { awful: 2, low: 4, ok: 6, good: 8, great: 10 }

function scoreToMoodKey(score: number): string {
  if (score <= 2) return 'awful'
  if (score <= 4) return 'low'
  if (score <= 6) return 'ok'
  if (score <= 8) return 'good'
  return 'great'
}

const PROMPTS = [
  { label: 'My body needed…',      stub: 'My body needed' },
  { label: 'A small good thing…',  stub: 'A small good thing' },
  { label: 'What surprised me…',   stub: 'What surprised me' },
  { label: 'One thing I noticed…', stub: 'One thing I noticed' },
]

const QUICK_TILES = [
  {
    href: '/journal', label: 'Open journal', sub: '3 quiet days — write a few words?',
    bg: 'linear-gradient(135deg, #F4D6BD, #E8C9D4)', color: 'var(--nova-purple-dark)',
    icon: <svg viewBox="0 0 20 20" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="2" width="12" height="16" rx="2"/><line x1="7" y1="7" x2="13" y2="7"/><line x1="7" y1="10" x2="13" y2="10"/><line x1="7" y1="13" x2="11" y2="13"/></svg>,
  },
  {
    href: '/ask', label: 'Ask Novana', sub: '"Why am I tired this week?"',
    bg: 'linear-gradient(135deg, #1a1422, #5a4a6e)', color: '#F4D6BD',
    icon: <svg viewBox="0 0 20 20" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.6"><path d="M10 2 L11.2 8.5 L18 10 L11.2 11.5 L10 18 L8.8 11.5 L2 10 L8.8 8.5 Z"/><circle cx="10" cy="10" r="2"/></svg>,
  },
  {
    href: '/cycle', label: 'Cycle', sub: 'Day 8 · Follicular phase',
    bg: 'linear-gradient(135deg, #F4D6BD, #E8C9D4)', color: 'var(--nova-purple-dark)',
    icon: <svg viewBox="0 0 20 20" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><path d="M10 3v3M10 14v3M3 10h3M14 10h3"/><circle cx="10" cy="10" r="2.5"/></svg>,
  },
  {
    href: '/analytics', label: 'This week', sub: 'Mood +12 · Sleep steady',
    bg: 'linear-gradient(135deg, #F4D6BD, #E8C9D4)', color: 'var(--nova-purple-dark)',
    icon: <svg viewBox="0 0 20 20" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="1.6"><polyline points="2,14 7,9 11,12 18,5"/><line x1="2" y1="18" x2="18" y2="18"/></svg>,
  },
]

export default function TodayPage() {
  const [daypart, setDaypart]             = useState<Daypart>('morning')
  const [dateStr, setDateStr]             = useState('TODAY')
  const [chipDate, setChipDate]           = useState('')
  const [selectedMood, setSelectedMood]   = useState<string | null>(null)
  const [intention, setIntention]         = useState('')
  const [reflection, setReflection]       = useState('')
  const [savingMorning, setSavingMorning] = useState(false)
  const [savingEvening, setSavingEvening] = useState(false)
  const [savedMorning, setSavedMorning]   = useState(false)
  const [savedEvening, setSavedEvening]   = useState(false)
  const [existing, setExisting]           = useState<SymptomRow | null>(null)

  useEffect(() => {
    const dp  = getDaypart()
    const now = new Date()
    setDaypart(dp)
    setDateStr(`${DAYS[now.getDay()].toUpperCase()} · ${MONTHS[now.getMonth()].toUpperCase()} ${now.getDate()}`)
    setChipDate(`${MONTHS[now.getMonth()].slice(0, 3).toUpperCase()} ${now.getDate()}`)

    // Load today's existing entry to pre-fill
    fetch('/api/symptoms?days=1')
      .then(r => r.json())
      .then((json: { data?: SymptomRow[] }) => {
        const today = now.toISOString().split('T')[0]
        const entry = json.data?.find(r => r.logged_at === today)
        if (entry) {
          setExisting(entry)
          setSelectedMood(scoreToMoodKey(entry.mood))
          if (entry.notes) setIntention(entry.notes)
        }
      })
      .catch(() => {})
  }, [])

  const scene = SCENE[daypart]

  async function handleSaveMorning() {
    setSavingMorning(true)
    try {
      await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood:          MOOD_SCORE[selectedMood ?? 'ok'] ?? 6,
          fatigue:       existing?.fatigue       ?? 5,
          sleep_hours:   existing?.sleep_hours   ?? 7,
          stress:        existing?.stress        ?? 5,
          acne:          existing?.acne          ?? 5,
          cramps:        existing?.cramps        ?? 5,
          exercise_mins: existing?.exercise_mins ?? 0,
          cycle_status:  existing?.cycle_status  ?? 'none',
          notes:         intention || null,
        }),
      })
      setSavedMorning(true)
      setTimeout(() => setSavedMorning(false), 2500)
    } catch {}
    setSavingMorning(false)
  }

  async function handleSaveEvening() {
    setSavingEvening(true)
    try {
      await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood:          MOOD_SCORE[selectedMood ?? 'ok'] ?? 6,
          fatigue:       existing?.fatigue       ?? 5,
          sleep_hours:   existing?.sleep_hours   ?? 7,
          stress:        existing?.stress        ?? 5,
          acne:          existing?.acne          ?? 5,
          cramps:        existing?.cramps        ?? 5,
          exercise_mins: existing?.exercise_mins ?? 0,
          cycle_status:  existing?.cycle_status  ?? 'none',
          notes:         reflection || intention || null,
        }),
      })
      setSavedEvening(true)
      setTimeout(() => setSavedEvening(false), 2500)
    } catch {}
    setSavingEvening(false)
  }

  const softBtn: React.CSSProperties = {
    padding: '10px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500,
    border: '1px solid var(--nova-border-soft)', background: 'rgba(255,255,255,0.7)',
    color: 'var(--nova-text)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', cursor: 'pointer',
  }

  const warmBtn: React.CSSProperties = {
    background: 'linear-gradient(135deg, #8A7DBC, #7B6FA8)', color: '#fff', border: 'none',
    padding: '12px 22px', borderRadius: 999, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', boxShadow: '0 6px 20px rgba(123,111,168,0.32)',
  }

  return (
    <>
      {/* Topbar chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <span className="chip">
          <i className="dot peach" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{chipDate}</span>
        </span>
        <span className="chip"><i className="dot rose" />Day 8 · Follicular</span>
      </div>

      {/* Scenic hero */}
      <section style={{
        position: 'relative', minHeight: 360, borderRadius: 'var(--radius-xl)',
        overflow: 'hidden', padding: '56px 48px 44px', color: '#fff',
        marginBottom: 28, isolation: 'isolate',
      }}>
        <Image src={scene.img} alt="" fill className="object-cover" style={{ zIndex: 0 }} priority />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(180deg, rgba(28,22,38,0.10) 0%, transparent 35%), radial-gradient(70% 80% at 20% 100%, rgba(28,22,38,0.45) 0%, transparent 60%)',
        }} />
        <span className="orb orb-pink animate-float" style={{ position: 'absolute', width: 90, height: 90, top: '22%', right: '14%', zIndex: 2 }} />
        <span className="orb orb-peach animate-float delay-2" style={{ position: 'absolute', width: 56, height: 56, top: '38%', right: '26%', zIndex: 2 }} />
        <div style={{ position: 'relative', zIndex: 3, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'end' }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14, display: 'inline-block', fontFamily: 'var(--font-mono)' }}>
              {dateStr}
            </span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(36px,4vw,56px)', fontWeight: 400, margin: 0, textShadow: '0 2px 14px rgba(46,36,64,0.4)' }}>
              {scene.greeting}, <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>Nova.</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.86)', marginTop: 14, fontSize: 16, maxWidth: '38ch', textShadow: '0 1px 4px rgba(46,36,64,0.3)' }}>
              {scene.sub}
            </p>
          </div>
          <div />
        </div>
      </section>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
        {QUICK_TILES.map(tile => (
          <Link key={tile.href} href={tile.href} style={{
            background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)',
            borderRadius: 'var(--radius)', padding: 18,
            display: 'flex', flexDirection: 'column', gap: 8,
            textDecoration: 'none', color: 'inherit', transition: 'all .2s ease',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: tile.bg, color: tile.color, display: 'grid', placeItems: 'center' }}>
              {tile.icon}
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{tile.label}</h4>
            <p style={{ fontSize: 12, color: 'var(--nova-muted)', margin: 0 }}>{tile.sub}</p>
          </Link>
        ))}
      </div>

      {/* Ritual grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

        {/* Morning ritual */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(255,240,220,0.5) 0%, rgba(255,220,196,0.3) 100%), var(--nova-card-2)',
          border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)',
          padding: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg,#E8A98B,#D28CA7)', boxShadow: '0 0 0 3px rgba(232,169,139,0.2)', display: 'inline-block' }} />
            Morning ritual
          </div>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.015em' }}>
            Set a quiet <em style={{ fontStyle: 'italic' }}>intention.</em>
          </h2>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, margin: '0 0 22px', lineHeight: 1.55 }}>
            One sentence. What do you want today to feel like? Skip if you&apos;d rather not.
          </p>
          <textarea
            value={intention}
            onChange={e => setIntention(e.target.value)}
            rows={2}
            placeholder="Today I want to feel…"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: 16, padding: '18px 20px',
              fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 20,
              color: 'var(--nova-text)', resize: 'none', outline: 'none',
            }}
          />
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--nova-muted)', marginBottom: 8 }}>How are you arriving?</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 8 }}>
              {MOOD_ORBS.map(orb => (
                <div key={orb.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedMood(orb.key)}
                    style={{
                      width: 56, height: 56, borderRadius: '50%', cursor: 'pointer',
                      background: orb.bg,
                      border: selectedMood === orb.key ? '2px solid var(--nova-purple)' : '2px solid rgba(255,255,255,0.6)',
                      boxShadow: selectedMood === orb.key ? '0 0 24px rgba(123,111,168,0.4),0 0 0 3px rgba(255,255,255,0.8)' : '0 4px 12px rgba(123,111,168,0.15)',
                      transform: selectedMood === orb.key ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform .2s ease,box-shadow .2s ease',
                    }}
                  />
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--nova-muted)', marginTop: 8, letterSpacing: '0.04em' }}>
                    {orb.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={handleSaveMorning} disabled={savingMorning} style={warmBtn}>
              {savingMorning ? 'Saving…' : savedMorning ? 'Saved ✿' : 'Save morning →'}
            </button>
            <Link href="/dashboard" style={softBtn}>Full log</Link>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--nova-border-soft)' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginBottom: 6 }}>This week&apos;s mornings</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[true, true, true, false, true, true, 'today'].map((d, i) => (
                  <span key={i} style={{
                    width: 10, height: 10, borderRadius: '50%', display: 'inline-block',
                    background: d === 'today' ? 'var(--nova-purple)' : d ? 'linear-gradient(135deg,#E8A98B,#D28CA7)' : 'var(--nova-border)',
                    boxShadow: d === 'today' ? '0 0 0 3px rgba(123,111,168,0.18)' : d ? '0 0 6px rgba(232,169,139,0.4)' : 'none',
                  }} />
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 14, color: 'var(--nova-muted)' }}>5 of 7</div>
          </div>
        </section>

        {/* Evening ritual */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(210,195,240,0.35) 0%, rgba(168,158,208,0.25) 100%), var(--nova-card-2)',
          border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)',
          padding: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg,#B8A5D2,#8A7BA8)', display: 'inline-block' }} />
            Evening reflection
          </div>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.015em' }}>
            Three words for <em style={{ fontStyle: 'italic' }}>today.</em>
          </h2>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, margin: '0 0 22px', lineHeight: 1.55 }}>
            No essays. Just a few honest words. We&apos;ll learn your patterns from the way you say them.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '14px 0 18px' }}>
            {PROMPTS.map(p => (
              <span key={p.stub} role="button" tabIndex={0} onClick={() => setReflection(p.stub + ' ')} style={{
                padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
                background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)',
                fontSize: 12, color: 'var(--nova-text)', transition: 'all .15s ease',
              }}>
                {p.label}
              </span>
            ))}
          </div>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="A few words is enough."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: 16, padding: '16px 20px', fontSize: 15,
              color: 'var(--nova-text)', lineHeight: 1.6, minHeight: 120,
              resize: 'vertical', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button onClick={handleSaveEvening} disabled={savingEvening} style={warmBtn}>
              {savingEvening ? 'Saving…' : savedEvening ? 'Saved ✿' : 'Save evening →'}
            </button>
            <Link href="/journal" style={softBtn}>Longer entry</Link>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--nova-border-soft)' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginBottom: 6 }}>This week&apos;s evenings</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[true, false, true, true, false, true, false].map((d, i) => (
                  <span key={i} style={{
                    width: 10, height: 10, borderRadius: '50%', display: 'inline-block',
                    background: d ? 'linear-gradient(135deg,#E8A98B,#D28CA7)' : 'var(--nova-border)',
                    boxShadow: d ? '0 0 6px rgba(232,169,139,0.4)' : 'none',
                  }} />
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 14, color: 'var(--nova-muted)' }}>4 of 7</div>
          </div>
        </section>
      </div>

      {/* Pattern strip */}
      <section style={{
        position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        minHeight: 320, padding: '44px 44px', marginBottom: 32, color: '#fff',
        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'center',
      }}>
        <Image src="/images/sunset-mountains.jpg" alt="" fill className="object-cover" style={{ zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(135deg,rgba(46,36,64,0.55) 0%,rgba(46,36,64,0.20) 60%,transparent 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="chip" style={{ background: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            <i className="dot" style={{ background: '#F4D6BD' }} /> Pattern of the week
          </span>
          <h3 style={{ color: '#fff', fontFamily: 'var(--font-fraunces)', fontSize: 32, fontWeight: 400, margin: '18px 0 14px' }}>
            Your evenings are <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>quieter</em> after walks.
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Across 4 of 5 days this week, sleep quality rated higher on days you logged any movement before 6pm. Stress lifted in parallel. A tiny correlation — but a kind one.
          </p>
          <Link href="/insights" style={{ marginTop: 22, display: 'inline-block', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Open insights →
          </Link>
        </div>
        <div />
      </section>
    </>
  )
}
