'use client'
import { useState } from 'react'
import ComingSoonPage from '@/components/ComingSoonPage'

const SHOW_PREVIEW = false

type Mode = 'partner' | 'provider'

const DEFAULT_SWITCHES: Record<string, boolean> = {
  phase: true, period: true, mood: true, symptoms: false, vibe: true,
}

export function ShareContent() {
  const [mode, setMode] = useState<Mode>('partner')
  const [activeRecipient, setActiveRecipient] = useState<'partner' | 'friend'>('partner')
  const [switches, setSwitches] = useState(DEFAULT_SWITCHES)
  const [copied, setCopied] = useState(false)

  function toggle(key: string) {
    setSwitches(s => ({ ...s, [key]: !s[key] }))
  }

  function copy() {
    navigator.clipboard?.writeText('novana.app/m/n4f2x').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleRows = [
    {
      section: 'Cycle context',
      items: [
        { key: 'phase', bg: 'linear-gradient(135deg,#FCEAD3,#F1C9A8)', color: '#A87155', desc: 'Cycle phase & day', sub: '"Day 8 · Follicular"' },
        { key: 'period', bg: 'linear-gradient(135deg,#F4DCDC,#E0B6BE)', color: '#A85A75', desc: 'Period likely date', sub: '"Around June 14"' },
      ],
    },
    {
      section: "How I'm doing",
      items: [
        { key: 'mood', bg: 'linear-gradient(135deg,#EAE0F2,#B8A5D2)', color: 'var(--nova-purple-dark)', desc: 'Energy & mood (weekly)', sub: 'A gentle summary, no numbers' },
        { key: 'symptoms', bg: 'linear-gradient(135deg,#F1D7C5,#E8A98B)', color: '#A87155', desc: 'Symptom highlights', sub: '"Sleep been lower this week"' },
        { key: 'vibe', bg: 'linear-gradient(135deg,#E8DDF0,#C2B3D8)', color: 'var(--nova-purple-dark)', desc: "Tonight's likely vibe", sub: '"Probably soft tonight"' },
      ],
    },
  ]

  return (
    <>
      {/* Page header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid var(--nova-border-soft)' }}>
        <div>
          <span className="chip" style={{ marginBottom: 12 }}><i className="dot" style={{ background: 'var(--nova-rose)' }} /> Private by default</span>
          <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 400, margin: '0 0 6px', letterSpacing: '-0.025em' }}>
            Share with <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>care.</em>
          </h1>
          <p style={{ color: 'var(--nova-muted)', fontSize: 16, maxWidth: '56ch', margin: 0, lineHeight: 1.55 }}>
            Send a soft snapshot to your partner, a friend, or your doctor. You choose exactly what they see, and the link expires when you want it to.
          </p>
        </div>
        <div style={{ display: 'inline-flex', background: 'var(--nova-card)', padding: 4, borderRadius: 999, border: '1px solid var(--nova-border-soft)' }}>
          {(['partner', 'provider'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              border: 'none', background: mode === m ? '#fff' : 'transparent',
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 500,
              color: mode === m ? 'var(--nova-text)' : 'var(--nova-muted)',
              cursor: 'pointer', transition: 'all .2s ease',
              boxShadow: mode === m ? '0 2px 8px rgba(123,111,168,0.12)' : 'none',
            }}>
              {m === 'partner' ? 'For a partner' : 'For a provider'}
            </button>
          ))}
        </div>
      </div>

      {/* Split screen */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.05fr', borderRadius: 'var(--radius-xl)',
        overflow: 'hidden', border: '1px solid var(--nova-border-soft)', background: 'var(--nova-card-2)',
        boxShadow: 'var(--shadow)', minHeight: 720,
      }}>
        {/* LEFT: Controls */}
        <div style={{ padding: 36, background: 'var(--nova-card-2)', borderRight: '1px solid var(--nova-border-soft)' }}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 400, margin: '0 0 6px' }}>
            What do you want them to see?
          </h2>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.55 }}>
            Each toggle changes the preview on the right in real-time.
          </p>

          {/* Recipient */}
          <div className="eyebrow" style={{ marginBottom: 10 }}>Sharing with</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {[
              { id: 'partner' as const, label: 'Marisa', sub: 'partner', bg: 'linear-gradient(135deg,#E8A98B,#D28CA7)', initial: 'M' },
              { id: 'friend' as const, label: 'Jess', sub: 'friend', bg: 'linear-gradient(135deg,#8FA7C6,#B8A5D2)', initial: 'J' },
            ].map(r => (
              <div key={r.id} onClick={() => setActiveRecipient(r.id)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '8px 14px 8px 8px', borderRadius: 999,
                background: activeRecipient === r.id ? 'linear-gradient(135deg,rgba(232,169,139,0.2),rgba(210,140,167,0.15))' : 'rgba(255,255,255,0.7)',
                border: `1.5px solid ${activeRecipient === r.id ? 'var(--nova-purple)' : 'var(--nova-border-soft)'}`,
                cursor: 'pointer', fontSize: 13,
                boxShadow: activeRecipient === r.id ? '0 4px 14px rgba(123,111,168,0.15)' : 'none',
              }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: r.bg, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11, fontWeight: 600 }}>{r.initial}</div>
                <span>{r.label}</span>
                <span style={{ color: 'var(--nova-muted)', fontSize: 11 }}>{r.sub}</span>
              </div>
            ))}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px 8px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1.5px dashed var(--nova-border-soft)', cursor: 'pointer', fontSize: 13, color: 'var(--nova-muted)' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--nova-card)', border: '1px dashed var(--nova-border)', display: 'grid', placeItems: 'center', fontSize: 14 }}>+</div>
              Add someone
            </div>
          </div>

          {/* Toggle sections */}
          {toggleRows.map(section => (
            <div key={section.section} style={{ marginBottom: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--nova-peach)', display: 'inline-block' }} />
                {section.section}
              </div>
              {section.items.map(item => (
                <div key={item.key} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--nova-border-soft)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: item.bg, display: 'grid', placeItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.desc}</div>
                    <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <div onClick={() => toggle(item.key)} style={{
                    width: 44, height: 26, background: switches[item.key] ? 'var(--nova-purple)' : 'var(--nova-border)', borderRadius: 999,
                    position: 'relative', cursor: 'pointer', transition: 'background .2s ease', flexShrink: 0,
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, left: switches[item.key] ? 21 : 3, width: 20, height: 20,
                      borderRadius: '50%', background: '#fff', transition: 'left .2s ease',
                      boxShadow: '0 1px 3px rgba(47,42,40,0.15)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Private always */}
          <div style={{ marginBottom: 28 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Private always</div>
            {['Journal entries', 'Ask Novana chats'].map(label => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--nova-border-soft)', opacity: 0.6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--nova-card)', display: 'grid', placeItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--nova-muted)" strokeWidth="1.8"><rect x="4" y="2" width="12" height="16" rx="2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginTop: 2 }}>Never shareable. Yours only.</div>
                </div>
                <div style={{ width: 44, height: 26, background: 'var(--nova-border)', borderRadius: 999, position: 'relative', opacity: 0.4, cursor: 'not-allowed' }}>
                  <div style={{ position: 'absolute', top: 3, left: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(47,42,40,0.15)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div style={{
          padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          background: 'radial-gradient(60% 60% at 80% 20%,rgba(232,169,139,0.18) 0%,transparent 60%),radial-gradient(50% 50% at 10% 90%,rgba(168,158,208,0.18) 0%,transparent 60%),linear-gradient(160deg,#F8E8DA 0%,#E8D5DE 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <span className="orb orb-pink animate-float" style={{ position: 'absolute', width: 80, height: 80, top: '10%', right: '8%' }} />
          <span className="orb animate-float delay-2" style={{ position: 'absolute', width: 56, height: 56, bottom: '16%', left: '6%', background: 'radial-gradient(circle at 30% 30%, rgba(168,158,208,0.6), rgba(123,111,168,0.3))' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nova-peach)', boxShadow: '0 0 0 3px rgba(232,169,139,0.25)', display: 'inline-block' }} />
              Live preview · their view
            </span>
            <span style={{ fontSize: 11, color: 'var(--nova-muted)', fontFamily: 'var(--font-mono)' }}>novana.app/m/n4f2x</span>
          </div>

          {/* Phone mockup */}
          <div style={{ width: 320, height: 640, borderRadius: 50, background: '#1a1620', padding: 12, boxShadow: '0 40px 100px rgba(74,63,102,0.4), 0 12px 28px rgba(47,42,40,0.12)', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden', background: '#FDF8EE', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {/* Notch */}
              <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 110, height: 28, background: '#1a1620', borderRadius: 999, zIndex: 5 }} />
              {/* Header photo */}
              <div style={{ height: 200, background: 'linear-gradient(180deg,rgba(74,63,102,0.15) 0%,transparent 50%), url(/images/sunset-clouds.jpg) center/cover no-repeat', padding: '60px 22px 22px', color: '#fff', position: 'relative', flexShrink: 0 }}>
                <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: 0, textShadow: '0 2px 8px rgba(46,36,64,0.4)' }}>From Nova ✿</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4, textShadow: '0 1px 4px rgba(46,36,64,0.3)' }}>A soft check-in · today</p>
              </div>
              {/* Body */}
              <div style={{ padding: '20px 18px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {switches.phase && (
                  <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 4px 14px rgba(74,63,102,0.08)', border: '1px solid var(--nova-border-soft)' }}>
                    <h4 style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', margin: '0 0 10px', fontWeight: 600 }}>Cycle</h4>
                    <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, marginBottom: 4 }}>She&apos;s on day <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>8</em></div>
                    <div style={{ fontSize: 11, color: 'var(--nova-muted)', lineHeight: 1.5 }}>Follicular phase · energy rising.{switches.period && <> Period likely around <strong>June 14</strong>.</>}</div>
                  </div>
                )}
                {switches.mood && (
                  <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 4px 14px rgba(74,63,102,0.08)', border: '1px solid var(--nova-border-soft)' }}>
                    <h4 style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', margin: '0 0 10px', fontWeight: 600 }}>This week</h4>
                    {[{ l: 'Mood', w: '65%', bg: 'var(--nova-purple)', v: 'soft' }, { l: 'Energy', w: '72%', bg: 'var(--nova-peach)', v: 'lifting' }, { l: 'Sleep', w: '50%', bg: 'var(--nova-rose)', v: 'light' }].map(row => (
                      <div key={row.l} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 32px', gap: 8, alignItems: 'center', fontSize: 11, padding: '5px 0' }}>
                        <span style={{ color: 'var(--nova-muted)' }}>{row.l}</span>
                        <span style={{ height: 4, background: 'var(--nova-card)', borderRadius: 999, overflow: 'hidden' }}>
                          <i style={{ display: 'block', height: '100%', background: row.bg, borderRadius: 999, width: row.w }} />
                        </span>
                        <span style={{ textAlign: 'right', fontWeight: 500 }}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {switches.vibe && (
                  <div style={{ background: 'linear-gradient(160deg,#FCEAD3,#F1D5DE)', borderRadius: 16, padding: 16 }}>
                    <h4 style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', margin: '0 0 10px', fontWeight: 600 }}>Tonight</h4>
                    <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, fontWeight: 400, marginBottom: 4 }}>Probably <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>soft.</em></div>
                    <div style={{ fontSize: 11, color: 'var(--nova-muted)', lineHeight: 1.5 }}>A gentle evening would land well. Light dinner, no big plans.</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--nova-border-soft)', fontSize: 9, color: 'var(--nova-muted)', textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.4 }}>
                Shared by Nova through Novana. This is a wellness summary, not medical advice.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share actions */}
      <div style={{ marginTop: 28, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: 28, display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 14, alignItems: 'center' }}>
        <div style={{ background: 'var(--nova-bg)', border: '1px solid var(--nova-border-soft)', borderRadius: 14, padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--nova-text)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--nova-purple-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style={{ flex: 1 }}>novana.app/m/n4f2x · expires in 7 days</span>
          <button onClick={copy} className="btn-soft" style={{ padding: '6px 12px', fontSize: 12 }}>{copied ? 'Copied ✿' : 'Copy'}</button>
        </div>
        {[{ label: 'Text', icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></> }, { label: 'Email', icon: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></> }, { label: 'QR', icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> }].map(btn => (
          <button key={btn.label} className="btn-soft" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 14, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--nova-purple-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{btn.icon}</svg>
            {btn.label}
          </button>
        ))}
      </div>

      {/* Provider PDF strip */}
      <div style={{
        marginTop: 28, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
        padding: '28px 36px', borderRadius: 'var(--radius-lg)',
        background: 'radial-gradient(60% 50% at 100% 0%,rgba(168,158,208,0.25),transparent 70%),linear-gradient(160deg,#E8DDF0 0%,#C2B3D8 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div>
          <span className="chip" style={{ marginBottom: 12 }}><i className="dot" /> For your doctor</span>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: '0 0 8px' }}>
            Walk in <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>prepared.</em>
          </h3>
          <p style={{ color: 'var(--nova-text)', opacity: 0.75, fontSize: 14, margin: 0, maxWidth: '56ch', lineHeight: 1.55 }}>
            Export your last 90 days as a clinician-friendly PDF: cycle patterns, symptom heatmap, mood trend, and your own notes — formatted for a 15-minute OB-GYN visit.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn-primary" style={{ padding: '10px 22px' }}>Download PDF →</button>
            <button className="btn-ghost" style={{ padding: '10px 22px' }}>See what&apos;s included</button>
          </div>
        </div>
        <div style={{
          width: 180, aspectRatio: '8.5/11', background: '#fff', borderRadius: 14,
          boxShadow: '0 18px 40px rgba(74,63,102,0.25), 0 6px 16px rgba(47,42,40,0.08)',
          padding: 18, position: 'relative', overflow: 'hidden',
          transform: 'rotate(2deg)', transition: 'transform .3s ease',
        }}>
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 12, color: 'var(--nova-purple-dark)', borderBottom: '1px solid var(--nova-border-soft)', paddingBottom: 6, marginBottom: 8 }}>Novana · 90-day summary</div>
          <div style={{ fontSize: 8, color: 'var(--nova-muted)', marginBottom: 8 }}>Patient: Nova R. · Cycles: 3 · Avg 26d</div>
          {[80, 60, 80, 60, 80].map((w, i) => <div key={i} style={{ height: 4, background: 'var(--nova-card)', borderRadius: 999, margin: '4px 0', width: `${w}%` }} />)}
          <div style={{ marginTop: 10, height: 50, borderRadius: 6, overflow: 'hidden', background: 'linear-gradient(180deg,rgba(123,111,168,0.1) 0%,transparent 80%)' }}>
            <svg viewBox="0 0 140 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,30 Q20,15 40,22 T80,28 T140,18" fill="none" stroke="#7B6FA8" strokeWidth="1.5"/>
              <path d="M0,38 Q20,28 40,34 T80,30 T140,32" fill="none" stroke="#E8A98B" strokeWidth="1.5"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 7, color: 'var(--nova-muted)' }}>page 1 / 4</div>
        </div>
      </div>

      {/* Privacy strip */}
      <div style={{ marginTop: 24, padding: '18px 24px', background: 'rgba(168,158,208,0.10)', border: '1px solid rgba(168,158,208,0.25)', borderRadius: 'var(--radius)', display: 'grid', gridTemplateColumns: '32px 1fr', gap: 14, alignItems: 'center', fontSize: 13, color: 'var(--nova-muted)', lineHeight: 1.5 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--nova-purple)', color: '#fff', display: 'grid', placeItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <b style={{ color: 'var(--nova-text)' }}>This link will expire in 7 days</b> · Marisa can view but not download, edit, or save. You can revoke access anytime from settings. Novana never reads what you share.
        </div>
      </div>

      <div style={{ height: 32 }} />
      <p className="disclaimer" style={{ textAlign: 'center' }}>Shared links are end-to-end encrypted. Recipients cannot copy, screenshot, or save your data. This is not medical advice.</p>
    </>
  )
}

export default function SharePage() {
  if (!SHOW_PREVIEW) {
    return (
      <ComingSoonPage
        title="Share with care"
        feature="share"
        description="Send a soft snapshot of your cycle data to a partner, friend, or doctor. You control exactly what they see."
      />
    )
  }
  return <ShareContent />
}
