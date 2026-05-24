'use client'
import { useState } from 'react'
import WaitlistForm from '@/components/WaitlistForm'

const DEFAULT_QUESTIONS = [
  { q: 'Could my shortened cycles (28 → 24 days) be a sign of luteal phase defect or PMOS?', why: 'Cycle pattern: 3 consecutive shorter cycles.' },
  { q: "I've noticed acne breakthroughs clustered on days 18–22 — is that consistent with elevated androgens?", why: 'Late luteal acne, recurring across 3 cycles.' },
  { q: 'Should I have my testosterone, LH/FSH ratio, and AMH levels checked?', why: 'Standard bloodwork to evaluate PMOS markers.' },
  { q: 'My resting heart rate is up 6 bpm over 60 days — could this point to a thyroid issue?', why: 'Persistent HRV/RHR change from Apple Watch data.' },
  { q: "What lifestyle changes have the strongest evidence for women with cycle irregularity?", why: 'Forward-looking — actionable for between visits.' },
]

const PATTERNS = [
  { grad: 'linear-gradient(135deg, #F4D6BD, #E8C9D4)', desc: 'Cycle length shortened from 28 → 24 days', sub: 'Across the last 3 cycles. Stress on day 14–18 may be involved.', meta: '3 cycles', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
  { grad: 'linear-gradient(135deg, #F1D7C5, #E8A98B)', desc: 'Acne flares cluster around day 18–22', sub: 'Late luteal pattern. Worth asking about progesterone or spironolactone.', meta: '14 logs', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg> },
  { grad: 'linear-gradient(135deg, #E1D6E8, #B8A5D2)', desc: 'Sleep quality dropped 18% mid-cycle', sub: 'Average 7.2h → 5.8h on days 14–22. New pattern starting in March.', meta: '-18%', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> },
  { grad: 'linear-gradient(135deg, #F1D5DE, #D28CA7)', desc: 'Fatigue + low mood correlated (r=0.71)', sub: 'Strong correlation. Sleep is the most likely shared driver.', meta: '90 days', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { grad: 'linear-gradient(135deg, #D9E0EC, #8FA7C6)', desc: 'Resting heart rate up 6 bpm over 60 days', sub: 'From your Apple Watch. Often a stress or thyroid signal.', meta: '+6 bpm', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
]

const HEAT_LEVELS = ['', '', 'l1', 'l1', '', '', '', 'l1', '', 'l1', '', 'l1', 'l1', 'l2', 'l1', 'l2', 'l3', 'l3', 'l4', 'l3', 'l4', 'l4', 'l3', 'l2', 'l2', 'l1', 'l1', '']

const heatColor: Record<string, string> = {
  '': 'var(--nova-card)',
  l1: 'rgba(123,111,168,0.2)',
  l2: 'rgba(123,111,168,0.4)',
  l3: 'rgba(123,111,168,0.65)',
  l4: 'rgba(123,111,168,0.9)',
}

export default function DoctorPrepPage() {
  const [apptType, setApptType] = useState('OB-GYN')
  const [windowTab, setWindowTab] = useState('Last 90 days')
  const [loadingQ, setLoadingQ] = useState(false)
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS)
  const [copiedSummary, setCopiedSummary] = useState(false)

  const summaryText = "Hi — I've been tracking my cycle for 3 months. My cycles have shortened to 24 days, and I'm getting consistent acne, fatigue, and sleep disruption clustered in the late luteal phase. I'd like to talk about whether this could be PMOS, and what bloodwork would help us know."

  async function regenerate() {
    setLoadingQ(true)
    try {
      const res = await fetch('/api/doctor-prep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ windowTab }) })
      const data = await res.json()
      if (data.questions?.length >= 3) setQuestions(data.questions.slice(0, 5))
    } catch {
      // keep defaults
    }
    setLoadingQ(false)
  }

  function copySummary() {
    navigator.clipboard?.writeText(summaryText)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 1600)
  }

  return (
    <>
      {/* Page head */}
      <div className="dp-header-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'end', paddingBottom: 28, marginBottom: 32, borderBottom: '1px solid var(--nova-border-soft)' }}>
        <div>
          <span className="chip" style={{ marginBottom: 14, display: 'inline-flex' }}>
            <i className="dot" style={{ background: 'var(--nova-rose)' }} /> AI-prepared · private to you
          </span>
          <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(38px, 4vw, 56px)', fontWeight: 400, margin: '0 0 12px', letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            Walk in <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>prepared.</em>
          </h1>
          <p style={{ color: 'var(--nova-muted)', fontSize: 16, maxWidth: '52ch', margin: 0, lineHeight: 1.6 }}>
            Novana reads your last few months of patterns and writes you a one-page brief: the questions that matter, the symptoms worth mentioning, and a printable summary your doctor can scan in 90 seconds.
          </p>
        </div>

        {/* Appointment card */}
        <div style={{
          background: 'linear-gradient(160deg, #2D2538 0%, #4A3F66 100%)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,139,0.30), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>Upcoming appointment</div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 400, color: '#fff', margin: '0 0 4px' }}>OB-GYN Follow-up</h3>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>FRI · JUNE 6 · 2:30 PM · DR. EMERSON</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18, position: 'relative', zIndex: 2 }}>
            {['OB-GYN', 'Endocrinologist', 'Primary care', 'Telehealth'].map(t => (
              <button
                key={t}
                onClick={() => setApptType(t)}
                style={{
                  padding: '7px 14px', borderRadius: 999,
                  background: apptType === t ? 'linear-gradient(135deg, #F4D6BD, #E8A98B)' : 'rgba(255,255,255,0.08)',
                  border: apptType === t ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)',
                  color: apptType === t ? '#2F2A28' : 'rgba(255,255,255,0.75)',
                  fontSize: 12, cursor: 'pointer', fontWeight: apptType === t ? 500 : 400,
                  transition: 'all .15s ease',
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Window tabs */}
      <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--nova-card)', borderRadius: 999, border: '1px solid var(--nova-border-soft)', marginBottom: 32, width: 'fit-content' }}>
        {['Last 30 days', 'Last 90 days', 'Last 6 months', 'All time'].map(t => (
          <button
            key={t}
            onClick={() => setWindowTab(t)}
            style={{
              padding: '9px 18px', borderRadius: 999,
              background: windowTab === t ? '#fff' : 'transparent',
              color: windowTab === t ? 'var(--nova-text)' : 'var(--nova-muted)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
              boxShadow: windowTab === t ? '0 2px 8px rgba(123,111,168,0.12)' : undefined,
              transition: 'all .2s ease',
            }}
          >{t}</button>
        ))}
      </div>

      {/* Folio */}
      <div className="dp-folio-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Section 1: AI Questions */}
          <section style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 30, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 22, height: 22, background: 'var(--nova-purple)', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: 'var(--font-fraunces)', fontWeight: 400 }}>1</span>
              Questions to ask
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.015em' }}>
              Five questions Novana wrote <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>for you.</em>
            </h2>
            <p style={{ color: 'var(--nova-text)', lineHeight: 1.65, margin: '0 0 14px' }}>
              Based on what you&apos;ve been logging — your sleep dipping mid-luteal, acne breakthroughs around day 20, and the fatigue cluster last week. Tap any to copy or regenerate.
            </p>

            {loadingQ ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 18, background: 'linear-gradient(135deg, rgba(232,169,139,0.1), rgba(168,158,208,0.15))', borderRadius: 14, color: 'var(--nova-muted)', fontSize: 14, marginTop: 18 }}>
                <span style={{ display: 'inline-flex', gap: 4 }}>
                  {[0, 150, 300].map(d => <span key={d} style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-purple)', animation: 'bounce 1s infinite ease-in-out', animationDelay: `${d}ms`, opacity: 0.4 }} />)}
                </span>
                Generating your appointment questions from {windowTab.toLowerCase()} of patterns…
              </div>
            ) : (
              <ol style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 12 }}>
                {questions.map((item, i) => (
                  <QuestionItem key={i} num={i + 1} q={item.q} why={item.why} />
                ))}
              </ol>
            )}

            <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
              <button onClick={regenerate} style={{ padding: '9px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer', color: 'var(--nova-text)' }}>↻ Regenerate questions</button>
              <button style={{ padding: '9px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer', color: 'var(--nova-text)' }}>＋ Add my own</button>
            </div>
          </section>

          {/* Section 2: Patterns */}
          <section style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 30, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 22, height: 22, background: 'var(--nova-purple)', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: 'var(--font-fraunces)', fontWeight: 400 }}>2</span>
              Patterns worth mentioning
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.015em' }}>
              What I&apos;d <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>flag</em> if I were you.
            </h2>
            <p style={{ color: 'var(--nova-text)', lineHeight: 1.65, margin: '0 0 14px' }}>These are the patterns most likely to be useful clinical context. They&apos;re observations, not diagnoses.</p>
            <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
              {PATTERNS.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.65)', border: '1px solid var(--nova-border-soft)', borderRadius: 14, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center', background: p.grad, color: 'var(--nova-purple-dark)' }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--nova-text)', fontWeight: 500 }}>{p.desc}</div>
                    <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginTop: 2 }}>{p.sub}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px', borderRadius: 999, background: 'var(--nova-card)', color: 'var(--nova-purple-dark)', fontWeight: 500, whiteSpace: 'nowrap' }}>{p.meta}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: 30-second summary */}
          <section style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 30, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 22, height: 22, background: 'var(--nova-purple)', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: 'var(--font-fraunces)', fontWeight: 400 }}>3</span>
              Your one-line summary
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.015em' }}>
              If you only have <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>30 seconds.</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.5, color: 'var(--nova-text)', padding: '18px 22px', background: 'linear-gradient(135deg, rgba(255,240,220,0.5), rgba(232,168,200,0.20))', borderRadius: 14, borderLeft: '3px solid var(--nova-peach)', margin: 0 }}>
              &ldquo;Hi — I&apos;ve been tracking my cycle for 3 months. My cycles have shortened to 24 days, and I&apos;m getting consistent acne, fatigue, and sleep disruption clustered in the late luteal phase. I&apos;d like to talk about whether this could be PMOS, and what bloodwork would help us know.&rdquo;
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <button onClick={copySummary} style={{ padding: '9px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer', color: 'var(--nova-text)' }}>
                {copiedSummary ? '✓ Copied' : 'Copy summary'}
              </button>
              <button style={{ padding: '9px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer', color: 'var(--nova-text)' }}>Rephrase</button>
            </div>
          </section>
        </div>

        {/* Right: summary stack */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Vitals snapshot */}
          <div style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius)', padding: 24 }}>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-peach)', display: 'inline-block' }} />
              Vitals snapshot
            </h4>
            {[
              { lbl: 'Average cycle', val: '24.7d', delta: '↓ from 28d' },
              { lbl: 'Average sleep', val: '6h 24m', delta: '↓ 18%' },
              { lbl: 'Mood (90d)', val: '5.8 / 10', delta: '' },
              { lbl: 'Stress (90d)', val: '6.2 / 10', delta: '↑ 12%' },
              { lbl: 'Resting HR', val: '68 bpm', delta: '↑ 6 bpm' },
            ].map((r, i, arr) => (
              <div key={r.lbl} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--nova-border-soft)' : 'none', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: 'var(--nova-muted)' }}>{r.lbl}</span>
                <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, fontWeight: 400, color: 'var(--nova-text)' }}>
                  {r.val}
                  {r.delta && <span style={{ fontFamily: 'inherit', fontSize: 11, color: 'var(--nova-muted)', marginLeft: 6 }}>{r.delta}</span>}
                </span>
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius)', padding: 24 }}>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-peach)', display: 'inline-block' }} />
              Symptom × cycle day
            </h4>
            <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginBottom: 8 }}>Last 28 days — acne severity</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(28, 1fr)', gap: 2, padding: 10, background: 'rgba(255,255,255,0.5)', borderRadius: 12 }}>
              {HEAT_LEVELS.map((lvl, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: heatColor[lvl] || heatColor[''] }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11, color: 'var(--nova-muted)', alignItems: 'center' }}>
              <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                Less{' '}
                {['var(--nova-card)', 'rgba(123,111,168,0.4)', 'rgba(123,111,168,0.9)'].map((bg, i) => (
                  <span key={i} style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: bg }} />
                ))}{' '}
                More
              </span>
              <span>· Days 18–22 cluster visible</span>
            </div>
          </div>

          {/* PDF preview */}
          <div style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius)', padding: 22 }}>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-peach)', display: 'inline-block' }} />
              One-page brief preview
            </h4>
            <div style={{ background: '#fff', borderRadius: 12, padding: 22, boxShadow: '0 14px 40px rgba(74,63,102,0.15)', border: '1px solid var(--nova-border-soft)', aspectRatio: '8.5/11', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
              <div style={{ borderBottom: '2px solid var(--nova-purple)', paddingBottom: 10, marginBottom: 4 }}>
                <h5 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, fontWeight: 400, margin: 0, color: 'var(--nova-text)' }}>Novana · 90-Day Wellness Brief</h5>
                <div style={{ fontSize: 10, color: 'var(--nova-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>Nova R. · For Dr. Emerson · June 6</div>
              </div>
              {[
                { section: 'Questions to ask', lines: ['w-80', 'w-60', 'w-80', 'w-40'] },
                { section: 'Symptom highlights', lines: ['w-60', 'w-80', 'w-40'] },
              ].map(block => (
                <div key={block.section}>
                  <div style={{ fontSize: 8, color: 'var(--nova-purple-dark)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>{block.section}</div>
                  {block.lines.map((w, i) => (
                    <div key={i} style={{ height: 4, background: 'var(--nova-card)', borderRadius: 999, margin: '3px 0', width: w === 'w-80' ? '80%' : w === 'w-60' ? '60%' : '40%' }} />
                  ))}
                </div>
              ))}
              <div style={{ height: 60, marginTop: 4, background: 'linear-gradient(180deg, rgba(123,111,168,0.08) 0%, transparent 80%)', borderRadius: 6, position: 'relative' }}>
                <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <path d="M0,30 Q30,15 60,22 T120,28 T200,18" fill="none" stroke="#7B6FA8" strokeWidth="1.5" />
                  <path d="M0,38 Q30,28 60,34 T120,30 T200,32" fill="none" stroke="#E8A98B" strokeWidth="1.5" />
                </svg>
              </div>
              <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 9, color: 'var(--nova-muted)' }}>page 1 / 3</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Action bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: 14, alignItems: 'center', background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: '18px 22px' }}>
        <div style={{ position: 'relative' }}>
          <button disabled style={{ padding: '12px 22px', borderRadius: 999, background: 'var(--nova-purple)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'not-allowed', opacity: 0.45 }}>↓ Download PDF</button>
          <span style={{ position: 'absolute', top: -8, right: -8, fontSize: 9, background: 'var(--nova-purple-dark)', color: '#fff', padding: '2px 7px', borderRadius: 999, letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 600 }}>Soon</span>
        </div>
        <div style={{ position: 'relative' }}>
          <button disabled style={{ padding: '12px 22px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 14, cursor: 'not-allowed', color: 'var(--nova-muted)', opacity: 0.45 }}>Email to Dr. Emerson</button>
          <span style={{ position: 'absolute', top: -8, right: -8, fontSize: 9, background: 'var(--nova-purple-dark)', color: '#fff', padding: '2px 7px', borderRadius: 999, letterSpacing: '0.08em', textTransform: 'uppercase' as const, fontWeight: 600 }}>Soon</span>
        </div>
        <p style={{ color: 'var(--nova-muted)', fontSize: 12, textAlign: 'right', margin: 0 }}>
          Your data never leaves your account.{' '}
          <a href="#" style={{ color: 'var(--nova-purple-dark)', textDecoration: 'underline' }}>Privacy details →</a>
        </p>
      </div>

      {/* Waitlist for PDF & email export */}
      <div style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, marginBottom: 6 }}>Get notified</div>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: 0 }}>PDF export &amp; doctor email</h3>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, marginTop: 6, maxWidth: '52ch', lineHeight: 1.6 }}>
            One-tap PDF download and direct email to your provider are coming to Doctor Prep. Join the waitlist to be first.
          </p>
        </div>
        <WaitlistForm feature="Doctor Prep" />
      </div>

      <div style={{ height: 64 }} />

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4}40%{transform:translateY(-4px);opacity:1} }
        @media (max-width: 768px) {
          .dp-header-grid { grid-template-columns: 1fr !important; }
          .dp-folio-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

function QuestionItem({ num, q, why }: { num: number; q: string; why: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard?.writeText(q)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <li style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', borderRadius: 14, display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 14, alignItems: 'start', transition: 'all .15s ease' }}>
      <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 18, color: 'var(--nova-purple-dark)', lineHeight: 1, paddingTop: 2 }}>{num}.</span>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--nova-text)' }}>
        {q}
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--nova-muted)', fontStyle: 'italic' }}>Why: {why}</div>
      </div>
      <button onClick={copy} style={{ background: 'transparent', border: '1px solid var(--nova-border-soft)', borderRadius: 999, padding: '4px 10px', fontSize: 11, color: 'var(--nova-muted)', cursor: 'pointer', flexShrink: 0 }}>
        {copied ? '✓' : 'Copy'}
      </button>
    </li>
  )
}
