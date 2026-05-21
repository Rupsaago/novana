'use client'
import { useState } from 'react'
import Link from 'next/link'

const DEVICES = [
  { name: 'Apple Health', sub: 'via Apple Watch · iPhone', pulls: 'Pulls: sleep · HRV · cycle · heart rate · workouts', logoClass: 'apple', logoBg: 'linear-gradient(135deg, #1a1620, #4A3F66)', logoText: '⌚', connected: true },
  { name: 'Oura Ring', sub: 'Gen 3 · Gen 4', pulls: 'Pulls: sleep stages · readiness · body temp · HRV', logoBg: 'linear-gradient(135deg, #C97486, #8A5A75)', logoText: 'O' },
  { name: 'Fitbit', sub: 'Sense · Versa · Charge · Inspire', pulls: 'Pulls: sleep · steps · heart rate · stress score', logoBg: 'linear-gradient(135deg, #00B0B9, #007F86)', logoText: 'F' },
  { name: 'Whoop', sub: '4.0 strap', pulls: 'Pulls: recovery · strain · sleep · HRV', logoBg: 'linear-gradient(135deg, #2F2A28, #1a1620)', logoText: 'W' },
  { name: 'Garmin', sub: 'Forerunner · Venu · Fēnix · Vivosmart', pulls: 'Pulls: sleep · steps · stress · body battery', logoBg: 'linear-gradient(135deg, #007CC3, #003D6B)', logoText: 'G' },
  { name: 'Samsung Health', sub: 'Galaxy Watch · Galaxy Ring', pulls: 'Pulls: sleep · HRV · steps · cycle', logoBg: 'linear-gradient(135deg, #1428A0, #0A1466)', logoText: 'S' },
  { name: 'Withings', sub: 'ScanWatch · Body+ scale · Sleep mat', pulls: 'Pulls: weight · sleep · heart rate', logoBg: 'linear-gradient(135deg, #00C896, #007057)', logoText: 'W' },
  { name: 'Google Fit', sub: 'Pixel Watch · Android phone', pulls: 'Pulls: activity · steps · heart rate', logoBg: 'linear-gradient(135deg, #4285F4, #1A5DC9)', logoText: 'G' },
]

const DATA_TILES = [
  { grad: 'linear-gradient(135deg, #F4D6BD, #E8C9D4)', title: 'Sleep duration & stages', desc: 'Total sleep, REM, deep — for cycle-phase comparison.', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> },
  { grad: 'linear-gradient(135deg, #F1D7C5, #E8A98B)', title: 'Heart rate & HRV', desc: 'Resting HR + variability. Strong indicator of recovery & stress.', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { grad: 'linear-gradient(135deg, #E1D6E8, #B8A5D2)', title: 'Body temperature', desc: 'Confirms ovulation (small rise) — useful for irregular cycles.', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg> },
  { grad: 'linear-gradient(135deg, #F1D5DE, #D28CA7)', title: 'Activity & steps', desc: 'Daily movement context — not a goal to chase.', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { grad: 'linear-gradient(135deg, #D9E0EC, #8FA7C6)', title: 'Cycle & period data', desc: "From your device's tracker — Novana never overrides what you've logged.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
  { grad: 'var(--nova-purple)', color: '#fff', title: "What we never pull", desc: "Location, contacts, calls, messages, third-party app data, or anything outside health metrics.", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, special: true },
]

export default function ConnectPage() {
  const [modal, setModal] = useState<typeof DEVICES[0] | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [connected, setConnected] = useState<Set<string>>(new Set(['Apple Health']))

  function openModal(device: typeof DEVICES[0]) {
    setModal(device)
    setConnecting(false)
  }

  function handleConnect() {
    setConnecting(true)
    setTimeout(() => {
      if (modal) setConnected(prev => new Set([...prev, modal.name]))
      setModal(null)
      setConnecting(false)
    }, 1600)
  }

  function handleSync() {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 1400)
  }

  return (
    <>
      {/* Page head */}
      <div style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'end', paddingBottom: 28, borderBottom: '1px solid var(--nova-border-soft)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(38px, 4vw, 56px)', fontWeight: 400, margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.04 }}>
            Stop typing what your <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>body</em> already knows.
          </h1>
          <p style={{ color: 'var(--nova-muted)', fontSize: 16, maxWidth: '56ch', margin: 0, lineHeight: 1.6 }}>
            Connect a wearable and Novana pulls in sleep, HRV, heart rate, and activity automatically. Less work for you, sharper patterns to learn from.
          </p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, rgba(91,194,135,0.12), rgba(91,194,135,0.04))', border: '1px solid rgba(91,194,135,0.3)', color: '#2D6B47', padding: '14px 22px', borderRadius: 'var(--radius)', fontSize: 13, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(91,194,135,0.18)', color: '#2D6B47', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <b style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, fontWeight: 400, color: '#1F4F32', display: 'block' }}>~3 min saved per day</b>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Compared to manual logging.</span>
          </div>
        </div>
      </div>

      {/* Currently connected dark card */}
      <section style={{ background: 'linear-gradient(160deg, #1a1422 0%, #2D2538 100%)', borderRadius: 'var(--radius-lg)', padding: 32, color: '#fff', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,139,0.35), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', color: '#fff', fontSize: 24, fontWeight: 400, margin: 0 }}>
            What&apos;s <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>connected.</em>
          </h2>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 999, background: 'rgba(91,194,135,0.15)', color: '#91E0B0', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5BC287', boxShadow: '0 0 0 0 rgba(91,194,135,0.5)', animation: 'pulseGreen 1.8s infinite', display: 'inline-block' }} />
            LIVE
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, position: 'relative', zIndex: 2 }}>
          {[
            { lbl: 'Sleep', v: '6h 42', unit: 'm', delta: '↓ 18% vs avg', down: true },
            { lbl: 'HRV', v: '48', unit: 'ms', delta: '↓ 4ms', down: true },
            { lbl: 'Resting HR', v: '64', unit: 'bpm', delta: '↑ 6 over 60d', up: true },
            { lbl: 'Steps', v: '4,287', unit: '', delta: '68% of avg' },
            { lbl: 'Body temp', v: '97.8', unit: '°F', delta: '↑ 0.4° (luteal)', up: true },
          ].map(t => (
            <div key={t.lbl} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 18, backdropFilter: 'blur(20px)' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{t.lbl}</div>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
                {t.v}{t.unit && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginLeft: 2 }}>{t.unit}</span>}
              </div>
              <div style={{ fontSize: 11, marginTop: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', color: t.up ? '#91E0B0' : t.down ? '#F4A98B' : 'rgba(255,255,255,0.55)' }}>{t.delta}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, position: 'relative', zIndex: 2, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
          <div>Synced from <b style={{ color: 'rgba(255,255,255,0.85)' }}>Apple Watch Series 9</b> · <b style={{ color: 'rgba(255,255,255,0.85)' }}>Marisa</b> · 2 minutes ago</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSync} style={{ padding: '6px 14px', fontSize: 12, borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer' }}>
              {syncing ? 'Syncing…' : 'Sync now'}
            </button>
            <button style={{ padding: '6px 14px', fontSize: 12, borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>Manage</button>
          </div>
        </div>
      </section>

      {/* Devices grid */}
      <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 400, margin: '0 0 18px', letterSpacing: '-0.015em' }}>Add another device</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
        {DEVICES.map(device => {
          const isConnected = connected.has(device.name)
          return (
            <div
              key={device.name}
              onClick={() => !isConnected && openModal(device)}
              style={{
                background: isConnected ? 'linear-gradient(135deg, rgba(91,194,135,0.04), rgba(91,194,135,0.02)), var(--nova-card-2)' : 'var(--nova-card-2)',
                border: `1.5px solid ${isConnected ? 'rgba(91,194,135,0.4)' : 'var(--nova-border-soft)'}`,
                borderRadius: 'var(--radius-lg)', padding: '22px 24px',
                display: 'grid', gridTemplateColumns: '56px 1fr auto', alignItems: 'center', gap: 18,
                cursor: isConnected ? 'default' : 'pointer',
                transition: 'all .2s ease',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, display: 'grid', placeItems: 'center', background: device.logoBg, fontSize: 18, fontWeight: 600, color: '#fff' }}>
                {device.logoText}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 2px' }}>{device.name}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.4 }}>{device.sub}</p>
                <div style={{ fontSize: 11, color: 'var(--nova-purple-dark)', fontWeight: 500, marginTop: 4, letterSpacing: '0.02em' }}>{device.pulls}</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {isConnected ? (
                  <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'rgba(91,194,135,0.15)', color: '#2D6B47', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5BC287', display: 'inline-block' }} />
                    Connected
                  </span>
                ) : (
                  <button style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'linear-gradient(135deg, #8A7DBC, #5A5080)', color: '#fff', border: 'none', cursor: 'pointer' }}>Connect</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Manual fallback */}
      <section style={{
        background: `radial-gradient(60% 50% at 100% 0%, rgba(244,214,189,0.25), transparent 70%), var(--nova-card-2)`,
        border: '1px solid var(--nova-border-soft)', borderRadius: 'var(--radius-lg)', padding: '28px 32px',
        marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24,
      }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>
            Don&apos;t own a wearable? <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>That&apos;s fine too.</em>
          </h3>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, margin: 0, lineHeight: 1.55, maxWidth: '48ch' }}>
            Most of Novana works without one. Sleep and movement are the only fields wearables fill in automatically — and you can type those when you remember, or skip them entirely. Patterns will still emerge.
          </p>
        </div>
        <Link href="/dashboard" style={{ padding: '10px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 14, color: 'var(--nova-text)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Go log manually →
        </Link>
      </section>

      {/* What we pull */}
      <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 400, margin: '0 0 18px', letterSpacing: '-0.015em' }}>What Novana reads (and what it doesn&apos;t)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
        {DATA_TILES.map((tile, i) => (
          <div
            key={i}
            style={{
              padding: 18, borderRadius: 'var(--radius)', border: tile.special ? '1px solid rgba(168,158,208,0.2)' : '1px solid var(--nova-border-soft)',
              background: tile.special ? 'rgba(168,158,208,0.08)' : 'var(--nova-card-2)',
              display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14, alignItems: 'start',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 11, background: tile.grad || 'var(--nova-purple)', color: tile.color || 'var(--nova-purple-dark)', display: 'grid', placeItems: 'center' }}>
              {tile.icon}
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 3px' }}>{tile.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.45 }}>{tile.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 64 }} />

      {/* Modal */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,28,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
        >
          <div style={{ background: 'var(--nova-card-2)', borderRadius: 24, padding: 36, width: 'min(440px, 92vw)', textAlign: 'center', boxShadow: '0 40px 100px rgba(20,14,28,0.4)', border: '1px solid rgba(255,255,255,0.7)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, margin: '0 auto 18px', display: 'grid', placeItems: 'center', background: modal.logoBg, fontSize: 28, fontWeight: 600, color: '#fff' }}>{modal.logoText}</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 24, fontWeight: 400, margin: '0 0 8px' }}>Connect {modal.name}</h3>
            <p style={{ color: 'var(--nova-muted)', fontSize: 14, lineHeight: 1.55, margin: '0 0 22px' }}>Three taps and you&apos;re synced.</p>
            {connecting ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, color: 'var(--nova-muted)', fontSize: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--nova-border)', borderTopColor: 'var(--nova-purple)', animation: 'spin 0.8s linear infinite' }} />
                Connecting and backfilling 30 days…
              </div>
            ) : (
              <>
                {[
                  { n: '1.', text: 'Open your device app on your phone and grant Novana read access.' },
                  { n: '2.', text: 'Tap "Authorize" when the partner site opens.' },
                  { n: '3.', text: "You'll be redirected here. The last 30 days will backfill automatically." },
                ].map(step => (
                  <div key={step.n} style={{ textAlign: 'left', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 14, padding: '14px 18px', marginBottom: 10, display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12, fontSize: 13.5, lineHeight: 1.4 }}>
                    <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, color: 'var(--nova-purple-dark)', lineHeight: 1, paddingTop: 1 }}>{step.n}</span>
                    <div>{step.text}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'center' }}>
                  <button onClick={() => setModal(null)} style={{ padding: '10px 18px', borderRadius: 999, background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', fontSize: 14, cursor: 'pointer', color: 'var(--nova-text)' }}>Cancel</button>
                  <button onClick={handleConnect} style={{ padding: '10px 22px', borderRadius: 999, background: 'var(--nova-purple)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Open partner site →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes pulseGreen{0%{box-shadow:0 0 0 0 rgba(91,194,135,0.5)}70%{box-shadow:0 0 0 6px rgba(91,194,135,0)}100%{box-shadow:0 0 0 0 rgba(91,194,135,0)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  )
}
