'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const phases = [
  {
    key: 'menstrual',
    label: 'Menstrual',
    days: 'Day 1 – 5',
    pipColor: '#C97486',
    grad: 'linear-gradient(160deg, #F4DCDC 0%, #E0B6BE 100%)',
    title: 'Quiet rest.',
    vibe: '"My body is letting something go."',
    micro: 'Energy low, introspection up. Permission to do less.',
  },
  {
    key: 'follicular',
    label: 'Follicular',
    days: 'Day 6 – 13',
    pipColor: '#E8A565',
    grad: 'linear-gradient(160deg, #FCEAD3 0%, #F1C9A8 100%)',
    title: 'Bright lift.',
    vibe: '"Things feel possible again."',
    micro: 'Estrogen rising. Energy returns. Good days to start.',
    active: true,
    youAreHere: true,
  },
  {
    key: 'ovulatory',
    label: 'Ovulatory',
    days: 'Day 14 – 16',
    pipColor: '#E89571',
    grad: 'linear-gradient(160deg, #F8E1CF 0%, #E8B5A0 100%)',
    title: 'Peak warmth.',
    vibe: '"I feel like myself, but more."',
    micro: 'Energy and libido peak. Social, expressive.',
  },
  {
    key: 'luteal',
    label: 'Luteal',
    days: 'Day 17 – 28',
    pipColor: '#8A7BB8',
    grad: 'linear-gradient(160deg, #E8DDF0 0%, #C2B3D8 100%)',
    title: 'Turn inward.',
    vibe: '"I need a little more from myself."',
    micro: 'Progesterone rises. Sensitive, focused, then tired.',
  },
]

function getDaysUntil(cycleDay: number, targetDay: number, cycleLength = 28) {
  const diff = targetDay - cycleDay
  return diff > 0 ? diff : diff + cycleLength
}

function addDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
}

export default function CyclePage() {
  const [activePhase, setActivePhase] = useState('follicular')
  const [cycleDay, setCycleDay]       = useState(8)
  const [phaseName, setPhaseName]     = useState('follicular')

  useEffect(() => {
    fetch('/api/symptoms?days=60')
      .then(r => r.json())
      .then((json: { data?: Array<{ logged_at: string; cycle_status: string }> }) => {
        const rows = (json.data ?? []).sort((a, b) => b.logged_at.localeCompare(a.logged_at))
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const lastFlow = rows.find(r => r.cycle_status !== 'none')
        if (!lastFlow) return
        const flowDate = new Date(lastFlow.logged_at + 'T00:00:00')
        const day = Math.floor((today.getTime() - flowDate.getTime()) / 86400000) + 1
        const clamped = Math.max(1, Math.min(day, 28))
        const phase = clamped <= 5 ? 'menstrual' : clamped <= 13 ? 'follicular' : clamped <= 16 ? 'ovulatory' : 'luteal'
        setCycleDay(clamped)
        setPhaseName(phase)
        setActivePhase(phase)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Cycle Hero — editorial gradient, no scenic photo */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        padding: '64px 56px',
        marginBottom: '28px',
        isolation: 'isolate',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
        gap: '48px',
        alignItems: 'center',
        background: `
          radial-gradient(60% 70% at 88% 8%, rgba(232,169,139,0.32) 0%, transparent 60%),
          radial-gradient(50% 60% at 8% 92%, rgba(168,158,208,0.32) 0%, transparent 60%),
          linear-gradient(160deg, #FCEEDE 0%, #F4DDC8 60%, #E8D5E0 100%)
        `,
        border: '1px solid rgba(255,255,255,0.7)',
      }}>
        {/* Decorative corner orbs */}
        <span style={{
          position: 'absolute', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          filter: 'blur(0.5px)', width: 140, height: 140, top: -40, right: -40,
          background: 'radial-gradient(circle, rgba(232,169,139,0.45), rgba(232,169,139,0.10))',
        }} />
        <span style={{
          position: 'absolute', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          filter: 'blur(0.5px)', width: 100, height: 100, bottom: -20, left: -30,
          background: 'radial-gradient(circle, rgba(168,158,208,0.45), rgba(168,158,208,0.10))',
        }} />
        <span style={{
          position: 'absolute', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          filter: 'blur(0.5px)', width: 60, height: 60, top: '60%', right: '8%',
          background: 'radial-gradient(circle, rgba(244,214,189,0.5), rgba(244,214,189,0.12))',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="chip" style={{ background: 'rgba(255,255,255,0.78)', borderColor: 'rgba(255,255,255,0.9)' }}>
            <i className="dot" style={{ background: 'var(--nova-peach)' }} /> Day {cycleDay} of 28
          </span>
          <h1 style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(40px, 4.4vw, 60px)',
            fontWeight: 400,
            margin: '18px 0 16px',
            letterSpacing: '-0.025em',
            lineHeight: 1.02,
            color: 'var(--nova-text)',
          }}>
            You&apos;re in your{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>{phaseName}</em>{' '}
            {phaseName === 'menstrual' ? 'rest.' : phaseName === 'follicular' ? 'bloom.' : phaseName === 'ovulatory' ? 'peak.' : 'turn.'}
          </h1>
          <p style={{ color: 'var(--nova-muted)', fontSize: 17, maxWidth: '44ch', margin: 0, lineHeight: 1.65 }}>
            This is your body&apos;s slow lift — estrogen rising, energy building. The follicles in your ovaries are quietly developing one of the eggs that may become this month&apos;s ovulation. A bright, open phase.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none', background: 'var(--nova-purple)', color: '#fff', display: 'inline-block' }}>
              Log today →
            </Link>
            <Link href="/analytics" style={{ padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 500, textDecoration: 'none', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', color: 'var(--nova-text)', display: 'inline-block' }}>
              See history
            </Link>
          </div>
        </div>

        {/* Wheel */}
        <div style={{ position: 'relative', width: 380, height: 380, maxWidth: '100%', margin: '0 auto', zIndex: 2 }}>
          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="g-menstrual" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F4DCDC" /><stop offset="100%" stopColor="#C97486" />
              </linearGradient>
              <linearGradient id="g-follicular" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FCEAD3" /><stop offset="100%" stopColor="#E8A565" />
              </linearGradient>
              <linearGradient id="g-ovulatory" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F8E1CF" /><stop offset="100%" stopColor="#E89571" />
              </linearGradient>
              <linearGradient id="g-luteal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8DDF0" /><stop offset="100%" stopColor="#8A7BB8" />
              </linearGradient>
            </defs>
            {/* Menstrual: days 1-5 */}
            <path d="M 100 12 A 88 88 0 0 1 173.4 56.4 L 100 100 Z" fill="url(#g-menstrual)" opacity="0.95" />
            {/* Follicular: days 6-13 */}
            <path d="M 173.4 56.4 A 88 88 0 0 1 173.4 143.6 L 100 100 Z" fill="url(#g-follicular)" opacity="0.95" />
            {/* Ovulatory: days 14-16 */}
            <path d="M 173.4 143.6 A 88 88 0 0 1 138.9 181.5 L 100 100 Z" fill="url(#g-ovulatory)" opacity="0.95" />
            {/* Luteal: days 17-28 */}
            <path d="M 138.9 181.5 A 88 88 0 1 1 100 12 L 100 100 Z" fill="url(#g-luteal)" opacity="0.95" />
            {/* Outer ring */}
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
            {/* Day marker — rotated based on current cycle day */}
            <g transform={`rotate(${Math.round((cycleDay - 1) * 360 / 28)} 100 100)`}>
              <line x1="100" y1="20" x2="100" y2="6" stroke="#2F2A28" strokeWidth="2" strokeLinecap="round" />
              <circle cx="100" cy="12" r="6" fill="#fff" stroke="#2F2A28" strokeWidth="1.5" />
            </g>
          </svg>
          {/* Wheel center dark glass */}
          <div style={{
            position: 'absolute', inset: '28%',
            borderRadius: '50%',
            background: 'rgba(20,14,28,0.62)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'grid', placeItems: 'center',
            textAlign: 'center',
            color: '#fff',
            padding: 18,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.25)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Day</div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 56, lineHeight: 1, fontWeight: 400, margin: '4px 0' }}>{cycleDay}</div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 18, color: '#F4D6BD' }}>{phaseName}</div>
          </div>
        </div>
      </section>

      {/* Phase Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {phases.map((p) => (
          <div
            key={p.key}
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              padding: 24,
              minHeight: 240,
              background: p.grad,
              color: 'var(--nova-text)',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'box-shadow .2s ease',
              border: activePhase === p.key
                ? '2px solid var(--nova-purple)'
                : '1px solid var(--nova-border-soft)',
              boxShadow: activePhase === p.key ? 'var(--shadow)' : undefined,
              transform: activePhase === p.key ? 'translateY(-2px)' : undefined,
            }}
          >
            <div>
              <div style={{
                fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--nova-purple-dark)', fontWeight: 600, marginBottom: 10,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.pipColor, display: 'inline-block', flexShrink: 0 }} />
                {p.label}{p.key === phaseName ? ' · you are here' : ''}
              </div>
              <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>{p.title}</h3>
              <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginBottom: 12 }}>{p.days}</div>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.4, color: 'var(--nova-text)', margin: '0 0 16px' }}>{p.vibe}</p>
              <p style={{ fontSize: 12, color: 'var(--nova-muted)', lineHeight: 1.5, margin: 0 }}>{p.micro}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Phase Detail Panel */}
      <section style={{
        background: 'var(--nova-card-2)',
        border: '1px solid var(--nova-border-soft)',
        borderRadius: 'var(--radius-lg)',
        padding: 36,
        marginBottom: 32,
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 40,
      }}>
        <div>
          <span className="chip" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <i className="dot" style={{ background: 'var(--nova-peach)' }} /> Currently
          </span>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 36, fontWeight: 400, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
            The <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>follicular</em> phase.
          </h2>
          <div style={{ fontSize: 13, color: 'var(--nova-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            DAYS 6 – 13 · YOU&apos;RE ON DAY 8
          </div>
          <p style={{ margin: '18px 0 0', fontSize: 16, color: 'var(--nova-text)', lineHeight: 1.6, maxWidth: '38ch' }}>
            After your period ends, estrogen begins climbing. The lining of your uterus is rebuilding. You may feel a slow, returning brightness — like the world has more color in it.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 24 }}>
            {[
              { label: 'Likely energy', value: 'Rising' },
              { label: 'Mood tendency', value: 'Open, curious' },
              { label: 'Sleep needs', value: 'Steady' },
              { label: 'Cycle day', value: '8 of 28' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 16, padding: 16 }}>
                <h4 style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--nova-muted)', margin: '0 0 6px', fontWeight: 600 }}>{s.label}</h4>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, color: 'var(--nova-text)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nova-purple)', display: 'inline-block' }} />
              What may feel easy
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {['Starting something — a project, a habit, a conversation', 'Movement: cardio, dance, longer walks', 'Connecting socially without it draining you', 'Thinking strategically about your week', 'Skin tends to clear and brighten'].map(item => (
                <li key={item} style={{ fontSize: 14, color: 'var(--nova-text)', paddingLeft: 22, position: 'relative', lineHeight: 1.55 }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, color: 'var(--nova-peach)', fontSize: 13 }}>✿</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nova-purple)', display: 'inline-block' }} />
              What may feel easier
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {['Cravings ease; appetite levels out', 'Mood stabilizes after the menstrual dip', 'Sleep gets steadier night to night', 'Tolerance for discomfort returns', 'Inner critic quiets'].map(item => (
                <li key={item} style={{ fontSize: 14, color: 'var(--nova-text)', paddingLeft: 22, position: 'relative', lineHeight: 1.55 }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, color: 'var(--nova-peach)', fontSize: 13 }}>✿</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recommendations: Nourish / Move / Focus */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 32 }}>
        {/* Nourish */}
        <div style={{
          background: `radial-gradient(70% 60% at 100% 0%, rgba(244,214,189,0.35), transparent 60%), linear-gradient(160deg, rgba(252,234,211,0.55), rgba(255,255,255,0.7))`,
          border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #F4D6BD, #E8A98B)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>Nourish</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 14px' }}>
            Eat for <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>building.</em>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {[
              { icon: '✿', color: 'var(--nova-peach)', bold: 'Fermented foods', rest: ' support estrogen metabolism. Kefir, kimchi, sauerkraut.' },
              { icon: '✿', color: 'var(--nova-peach)', bold: 'Leafy greens, eggs, lean protein.', rest: ' Building blocks for the cycle ahead.' },
              { icon: '✿', color: 'var(--nova-peach)', bold: 'Sprouted grains, seeds.', rest: ' Flax + pumpkin in this half of the cycle.' },
              { icon: '○', color: 'var(--nova-muted)', bold: '', rest: 'Lean lighter overall — appetite tends to be moderate now.', muted: true },
            ].map((item, i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start' }}>
                <span style={{ color: item.color, fontSize: 14 }}>{item.icon}</span>
                <div style={{ fontSize: item.muted ? 13 : 14, lineHeight: 1.55, color: item.muted ? 'var(--nova-muted)' : 'var(--nova-text)' }}>
                  {item.bold && <b style={{ fontWeight: 600 }}>{item.bold}</b>}{item.rest}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Move */}
        <div style={{
          background: `radial-gradient(70% 60% at 0% 0%, rgba(168,158,208,0.30), transparent 60%), linear-gradient(160deg, rgba(232,221,240,0.55), rgba(255,255,255,0.7))`,
          border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #B8A5D2, #8A7BB8)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>Move</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 14px' }}>
            Lift, run, <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>try new.</em>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {[
              { icon: '✿', color: 'var(--nova-purple)', bold: 'Heavy lifting week.', rest: ' Estrogen makes connective tissue more resilient. Strength gains come easiest here.' },
              { icon: '✿', color: 'var(--nova-purple)', bold: 'HIIT, sprints, dance.', rest: ' Your VO₂ max peaks. Push harder than you usually do.' },
              { icon: '✿', color: 'var(--nova-purple)', bold: 'Pick the harder class.', rest: " If you've been curious about trying something — this is the week." },
              { icon: '○', color: 'var(--nova-muted)', bold: '', rest: 'Save the gentler yoga & walks for luteal week.', muted: true },
            ].map((item, i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start' }}>
                <span style={{ color: item.color, fontSize: 14 }}>{item.icon}</span>
                <div style={{ fontSize: item.muted ? 13 : 14, lineHeight: 1.55, color: item.muted ? 'var(--nova-muted)' : 'var(--nova-text)' }}>
                  {item.bold && <b style={{ fontWeight: 600 }}>{item.bold}</b>}{item.rest}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Focus */}
        <div style={{
          background: `radial-gradient(70% 60% at 100% 100%, rgba(232,168,200,0.30), transparent 60%), linear-gradient(160deg, rgba(248,225,207,0.55), rgba(255,255,255,0.7))`,
          border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 28,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #E8C5D4, #D28CA7)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>Focus</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 14px' }}>
            Begin <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>brave</em> things.
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
            {[
              { icon: '✿', color: 'var(--nova-rose)', bold: 'Start the thing.', rest: ' New project, new habit, hard conversation. Inner critic is quieter.' },
              { icon: '✿', color: 'var(--nova-rose)', bold: 'Strategic thinking week.', rest: ' Plan, map, dream — long-term cognition is sharpest now.' },
              { icon: '✿', color: 'var(--nova-rose)', bold: 'Network, pitch, ask.', rest: ' Social energy is renewable. Use it before luteal asks for it back.' },
              { icon: '○', color: 'var(--nova-muted)', bold: '', rest: "Don't waste this on dishes & emails — save mundane tasks for luteal.", muted: true },
            ].map((item, i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 10, alignItems: 'start' }}>
                <span style={{ color: item.color, fontSize: 14 }}>{item.icon}</span>
                <div style={{ fontSize: item.muted ? 13 : 14, lineHeight: 1.55, color: item.muted ? 'var(--nova-muted)' : 'var(--nova-text)' }}>
                  {item.bold && <b style={{ fontWeight: 600 }}>{item.bold}</b>}{item.rest}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Predictions */}
      <section style={{
        background: `linear-gradient(135deg, rgba(255,240,220,0.5), rgba(232,168,200,0.25)), var(--nova-card-2)`,
        border: '1px solid var(--nova-border-soft)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
        marginBottom: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="chip"><i className="dot" style={{ background: 'var(--nova-rose)' }} /> Predictions</span>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: '14px 0 4px' }}>
              What&apos;s <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>probably</em> coming up.
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--nova-muted)' }}>Based on your average 28-day cycle. Bodies aren&apos;t clocks — these are gentle estimates.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: 18 }}>
          {(() => {
            const ovulIn   = getDaysUntil(cycleDay, 14)
            const lutealIn = getDaysUntil(cycleDay, 17)
            const nextIn   = getDaysUntil(cycleDay, 28) + 1
            return [
              { when: `IN ${ovulIn} DAYS · ${addDays(ovulIn)}`, what: 'Ovulation window opens', why: 'Energy peaks. Libido often rises. Most fertile 24 hours.' },
              { when: `IN ${lutealIn} DAYS · ${addDays(lutealIn)}`, what: 'Luteal phase begins', why: 'Progesterone climbs. Inward turn — focus may sharpen.' },
              { when: `IN ${nextIn} DAYS · ${addDays(nextIn)}`, what: 'Period likely begins', why: 'Honor the rest your body asks for. PMS may arrive a few days prior.' },
            ]
          })().map(pred => (
            <div key={pred.when} style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 16, padding: 18 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--nova-muted)', marginBottom: 6 }}>{pred.when}</div>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 19, fontWeight: 400, color: 'var(--nova-text)', marginBottom: 6 }}>{pred.what}</div>
              <div style={{ fontSize: 12, color: 'var(--nova-muted)', lineHeight: 1.5 }}>{pred.why}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gentle note for irregular cycles */}
      <section style={{
        background: 'rgba(168,158,208,0.10)',
        border: '1px solid rgba(168,158,208,0.25)',
        borderRadius: 'var(--radius)',
        padding: '24px 28px',
        marginBottom: 32,
        display: 'grid',
        gridTemplateColumns: '40px 1fr',
        gap: 18,
        alignItems: 'start',
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--nova-purple)', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 18, fontWeight: 400, margin: '0 0 6px' }}>
            If your cycle is irregular — or doesn&apos;t follow this map at all
          </h4>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--nova-muted)', lineHeight: 1.55 }}>
            This timeline is built for &ldquo;average&rdquo; cycles, which most of us don&apos;t have. PMOS, perimenopause, hormonal contraception, stress, and dozens of other reasons can scramble it. Novana still works — we just lean more on what you log, less on calendar math.{' '}
            <Link href="/setttings" style={{ color: 'var(--nova-purple-dark)', fontWeight: 500 }}>Open your cycle settings</Link>{' '}
            to adjust.
          </p>
        </div>
      </section>

      {/* Capsule footer — AI insight */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(160deg, #2D2538 0%, #4A3F66 60%, #6B5687 100%)',
        padding: '24px 28px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
      }}>
        <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,139,0.35), transparent 70%)', top: -20, right: 40, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Cycle insight</span>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: '8px 0 6px', color: '#fff' }}>Your last 3 cycles ran short.</h3>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Average{' '}
            <span style={{ background: 'rgba(232,169,139,0.3)', borderRadius: 4, padding: '1px 6px', color: '#F4D6BD', fontWeight: 500 }}>25 days</span>
            {' '}vs. your stated 28. Stress on day 14–18 may be{' '}
            <span style={{ background: 'rgba(208,130,150,0.3)', borderRadius: 4, padding: '1px 6px', color: '#F4A8BB', fontWeight: 500 }}>nudging ovulation earlier</span>
            . Not concerning — but worth a note.
          </p>
          <p className="disclaimer" style={{ color: 'rgba(255,255,255,0.4)' }}>Educational only — not medical advice.</p>
        </div>
      </div>
    </>
  )
}
