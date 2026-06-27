'use client'
import { useState } from 'react'
import Image from 'next/image'
import ComingSoonPage from '@/components/ComingSoonPage'

const SHOW_PREVIEW = false

export default function ReportsPage() {
  if (!SHOW_PREVIEW) {
    return (
      <ComingSoonPage
        title="Monthly Reports"
        feature="Monthly Reports"
        description="A quiet letter about your month — patterns noticed, themes that recurred, what your body was asking for."
      />
    )
  }
  const [emailEnabled, setEmailEnabled] = useState(false)

  return (
    <>
      {/* Page head */}
      <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--nova-border-soft)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(38px, 4vw, 52px)', fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
            Your <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>monthly</em> issue.
          </h1>
          <p style={{ color: 'var(--nova-muted)', fontSize: 15, margin: 0, maxWidth: '56ch' }}>
            Every 30 days, Novana writes you a personal report — what shifted, what stayed steady, what&apos;s worth noticing. Auto-generated. Always private.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ padding: '10px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer', color: 'var(--nova-text)' }}>↓ Download</button>
          <button onClick={() => { window.location.href = 'mailto:?subject=My%20Novana%20Monthly%20Report&body=Hi%2C%0A%0AI%27d%20like%20to%20share%20my%20monthly%20wellness%20report%20from%20Novana%20with%20you.' }} style={{ padding: '10px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 13, cursor: 'pointer', color: 'var(--nova-text)' }}>Share with doctor</button>
        </div>
      </div>

      {/* Issue cover */}
      <section className="reports-cover" style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', minHeight: 460, marginBottom: 36, isolation: 'isolate', display: 'grid', gridTemplateColumns: '1.1fr 1fr', color: '#fff' }}>
        {/* Dark text side */}
        <div style={{ padding: '56px 48px', background: 'linear-gradient(160deg, #1a1422 0%, #2D2538 60%, #5A4A6E 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,139,0.35), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, position: 'relative', zIndex: 2 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontWeight: 600 }}>Issue No. 003 · May 2026</span>
              <span style={{ background: 'rgba(244,214,189,0.15)', color: '#F4D6BD', border: '1px solid rgba(244,214,189,0.3)', padding: '5px 14px', borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>
                AI written
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(38px, 4.4vw, 60px)', fontWeight: 400, color: '#fff', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.05, position: 'relative', zIndex: 2 }}>
              The month you <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>started</em> hearing yourself.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.5, margin: '22px 0 0', maxWidth: '42ch', position: 'relative', zIndex: 2 }}>
              May was the first month every day got a check-in. Your patterns finally have enough data to surprise you — and a few did.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.10)', fontSize: 12, color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 2 }}>
            <span>Written for <b style={{ color: '#F4D6BD' }}>Nova</b></span>
            <span>·</span>
            <span>22 of 31 days logged</span>
            <span>·</span>
            <span>4 patterns detected</span>
          </div>
        </div>
        {/* Photo side */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src="/images/sunset-mountains.jpg" alt="" fill className="object-cover" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, transparent 50%, rgba(26,20,34,0.6) 100%)' }} />
        </div>
      </section>

      {/* Feature section 1: By the numbers */}
      <section style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 36, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--nova-purple)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 400 }}>1</span>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>By the numbers</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          The shape of <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>May.</em>
        </h3>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: '0 0 14px', maxWidth: '64ch' }}>
          Most months don&apos;t have a clear story. This one does — and it&apos;s in the numbers that moved.
        </p>
        <div className="reports-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, margin: '24px 0' }}>
          {[
            { big: <>22<em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>/31</em></>, lbl: 'Days logged', delta: '+9 vs. April', up: true },
            { big: '6.4', lbl: 'Avg mood', delta: '↑ 0.6', up: true },
            { big: '5.8h', lbl: 'Avg sleep', delta: '↓ 12 min', up: false },
            { big: <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>25.7d</em>, lbl: 'Cycle length', delta: '↓ 2.3 days', up: false },
          ].map((c, i) => (
            <div key={i} style={{ padding: 22, borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.9)' }}>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 38, lineHeight: 1, fontWeight: 400, color: 'var(--nova-text)', marginBottom: 4 }}>{c.big}</div>
              <div style={{ fontSize: 12, color: 'var(--nova-muted)', lineHeight: 1.4 }}>{c.lbl}</div>
              <div style={{ fontSize: 11, marginTop: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', color: c.up ? '#5BC287' : '#E8896B' }}>{c.delta}</div>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: 0, maxWidth: '64ch' }}>
          The biggest shift: you showed up. 22 of 31 days is enough data for Novana to actually start reading your patterns instead of guessing. Welcome to the part where it gets useful.
        </p>
      </section>

      {/* Feature section 2: Pattern of the month */}
      <section style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 36, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--nova-purple)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 400 }}>2</span>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>Pattern of the month</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Your evenings got quieter <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>after walks.</em>
        </h3>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: '0 0 14px', maxWidth: '64ch' }}>
          On the 14 days you logged any movement before 6pm, your sleep quality averaged 6.8/10. On the 8 days you didn&apos;t — 4.9/10. That&apos;s a wider gap than most month-over-month patterns Novana sees.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 14, padding: 20, margin: '18px 0' }}>
          <div style={{ display: 'flex', gap: 18, marginBottom: 12, fontSize: 12, color: 'var(--nova-muted)' }}>
            {[{ color: 'var(--nova-purple)', label: 'Movement days · sleep' }, { color: 'var(--nova-peach)', label: 'Sedentary days · sleep' }].map(l => (
              <span key={l.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
          <svg viewBox="0 0 600 160" preserveAspectRatio="none" style={{ width: '100%', height: 160 }}>
            <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(74,63,102,0.15)" strokeDasharray="2 4" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(74,63,102,0.15)" strokeDasharray="2 4" />
            <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(74,63,102,0.15)" strokeDasharray="2 4" />
            <path d="M30,60 Q90,40 150,50 T270,55 T390,40 T510,45 T580,40" fill="none" stroke="#7B6FA8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30,110 Q90,118 150,105 T270,115 T390,108 T510,120 T580,110" fill="none" stroke="#E8A98B" strokeWidth="2.5" strokeLinecap="round" />
            <text x="30" y="155" fontSize="10" fill="rgba(74,63,102,0.7)" fontFamily="monospace">May 1</text>
            <text x="570" y="155" fontSize="10" fill="rgba(74,63,102,0.7)" textAnchor="end" fontFamily="monospace">May 31</text>
          </svg>
        </div>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: 0, maxWidth: '64ch' }}>
          It&apos;s not a prescription — and it might be reversed in June. But for May, that one variable did most of the work.
        </p>
      </section>

      {/* Feature section 3: In your own words */}
      <section style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 36, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--nova-purple)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 400 }}>3</span>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>In your own words</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          What <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>you</em> wrote, more than anything.
        </h3>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: '0 0 14px', maxWidth: '64ch' }}>
          Across your journal entries this month, three words came up more often than any others: <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>tired</em> (14×), <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>okay</em> (11×), and <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>grateful</em> (9×). Make of that what you want.
        </p>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,240,220,0.5), rgba(232,168,200,0.20))', borderLeft: '3px solid var(--nova-peach)', padding: '24px 28px', margin: '24px 0', borderRadius: 12 }}>
          <p style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.4, color: 'var(--nova-text)', margin: 0 }}>
            &ldquo;Felt heavy this week. But I noticed the wisteria on my walk and stopped for a minute. Small thing. Still counts.&rdquo;
          </p>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--nova-muted)' }}>— Your journal · May 17 · evening</div>
        </div>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: 0, maxWidth: '64ch' }}>
          One thing Novana picked up: your shortest entries were on your highest-mood days. Your longest were after the worst ones. You write more when you need to — which is its own kind of healthy.
        </p>
      </section>

      {/* Feature section 4: Looking ahead */}
      <section style={{ background: 'linear-gradient(160deg, rgba(255,240,220,0.30), rgba(232,168,200,0.15)), var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 36, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--nova-purple)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-fraunces)', fontSize: 14, fontWeight: 400 }}>4</span>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>Looking ahead</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          What to watch in <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>June.</em>
        </h3>
        <p style={{ color: 'var(--nova-text)', lineHeight: 1.7, fontSize: 16, margin: '0 0 14px', maxWidth: '64ch' }}>
          If May was about showing up, June is about noticing patterns get sharper. A few things Novana will be paying closer attention to:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 14 }}>
          {[
            { b: 'Cycle length stabilization.', rest: "3 short cycles in a row — June's will tell us if it's a trend or a stress blip." },
            { b: 'Sleep × stress correlation.', rest: 'Strong this month. If it holds in June, it\'s worth talking to your doctor about.' },
            { b: 'Late-luteal acne pattern.', rest: 'Three cycles is a pattern. Four would be a flag.' },
          ].map((item, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 14, padding: '16px 20px', background: 'rgba(255,255,255,0.65)', borderRadius: 14 }}>
              <span style={{ color: 'var(--nova-peach)', fontSize: 14 }}>✿</span>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--nova-text)' }}><b>{item.b}</b> {item.rest}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Settings card */}
      <section style={{
        background: `radial-gradient(60% 50% at 100% 0%, rgba(168,158,208,0.20), transparent 70%), var(--nova-card-2)`,
        border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: '28px 32px',
        margin: '32px 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center',
      }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>Get this issue in your inbox?</h3>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, margin: 0, maxWidth: '48ch', lineHeight: 1.55 }}>
            Novana can send you a private link to your monthly report on the 1st of each month. Nothing else — no marketing, no nudges.
          </p>
        </div>
        <button
          onClick={() => setEmailEnabled(true)}
          style={{ padding: '12px 22px', borderRadius: 999, background: emailEnabled ? 'rgba(91,194,135,0.2)' : 'var(--nova-purple)', color: emailEnabled ? '#5BC287' : '#fff', border: emailEnabled ? '1px solid #5BC287' : 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {emailEnabled ? 'Email enabled ✓' : 'Enable monthly email →'}
        </button>
      </section>

      {/* Past issues archive */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '56px 0 22px', paddingTop: 32, borderTop: '1px solid var(--nova-border-soft)' }}>
        <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: 0 }}>Past <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>issues.</em></h2>
        <p style={{ color: 'var(--nova-muted)', fontSize: 13, margin: 0 }}>3 reports · since March 2026</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {[
          { img: '/images/sunset-clouds.jpg', month: 'Apr 2026 · Issue 002', title: '"The month you started showing up."', stats: '13/30 DAYS · 2 PATTERNS' },
          { img: '/images/desert-dunes.jpg', month: 'Mar 2026 · Issue 001', title: '"The month you began."', stats: '8/31 DAYS · 1 PATTERN' },
          { placeholder: true, month: 'Feb 2026', title: '— before you began —', stats: 'NO DATA' },
          { comingSoon: true, month: 'June 2026', title: '— in progress —', stats: 'DAY 1 OF 30' },
        ].map((issue, i) => (
          <article key={i} style={{
            background: issue.img ? 'var(--nova-card-2)' : 'var(--nova-card)',
            border: '1px solid var(--nova-border-soft)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            cursor: issue.img ? 'pointer' : 'default',
            transition: 'all .2s ease',
            aspectRatio: '3/4',
            position: 'relative',
            display: 'flex', alignItems: 'flex-end',
            opacity: issue.comingSoon ? 0.4 : issue.placeholder ? 0.7 : 1,
          }}>
            {issue.img && <Image src={issue.img} alt="" fill className="object-cover" />}
            {issue.img && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,20,34,0.10) 0%, rgba(26,20,34,0.0) 40%, rgba(26,20,34,0.85) 100%)' }} />}
            <div style={{ position: 'relative', zIndex: 2, padding: 22, color: issue.img ? '#fff' : 'var(--nova-text)', width: '100%', textAlign: (issue.placeholder || issue.comingSoon) ? 'center' : 'left' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.24em', color: issue.img ? 'rgba(255,255,255,0.7)' : 'var(--nova-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{issue.month}</div>
              <h4 style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 19, fontWeight: 400, margin: 0, lineHeight: 1.3, color: issue.img ? '#fff' : 'var(--nova-text)' }}>{issue.title}</h4>
              <div style={{ fontSize: 11, color: issue.img ? 'rgba(255,255,255,0.7)' : 'var(--nova-muted)', marginTop: 10, letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>{issue.stats}</div>
            </div>
          </article>
        ))}
      </div>
      <div style={{ height: 64 }} />
      <style>{`
        @media (max-width: 768px) {
          .reports-cover { grid-template-columns: 1fr !important; min-height: auto !important; }
          .reports-cover > div:last-child { display: none; }
          .reports-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  )
}
