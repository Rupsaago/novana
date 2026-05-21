'use client'

const STATUS_ICONS = (
  <>
    <svg viewBox="0 0 18 12" fill="currentColor" style={{ width: 14, height: 10 }}><path d="M1 6c0-.5.4-1 1-1s1 .5 1 1v4c0 .5-.4 1-1 1s-1-.5-1-1V6zm4-2c0-.5.4-1 1-1s1 .5 1 1v6c0 .5-.4 1-1 1s-1-.5-1-1V4zm4-2c0-.5.4-1 1-1s1 .5 1 1v8c0 .5-.4 1-1 1s-1-.5-1-1V2zm4-1c0-.5.4-1 1-1s1 .5 1 1v9c0 .5-.4 1-1 1s-1-.5-1-1V1z"/></svg>
    <svg viewBox="0 0 22 12" fill="currentColor" style={{ width: 22, height: 12 }}><rect x="1" y="3" width="18" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="3" y="5" width="14" height="3" rx="1"/><rect x="20" y="5" width="1.5" height="3" rx=".5"/></svg>
  </>
)

const TabBar = ({ active, dark }: { active: string; dark?: boolean }) => {
  const tabs = [
    { id: 'today', label: 'Today', icon: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/> },
    { id: 'trends', label: 'Trends', icon: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></> },
    { id: 'ask', label: 'Ask', icon: <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/> },
    { id: 'cycle', label: 'Cycle', icon: <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></> },
    { id: 'journal', label: 'Journal', icon: <path d="M4 4a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/> },
  ]
  return (
    <nav style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 78,
      background: dark ? 'rgba(20,14,28,0.95)' : 'rgba(253,248,238,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--nova-border-soft)'}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      padding: '10px 8px 22px', zIndex: 5,
    }}>
      {tabs.map(t => (
        <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, color: t.id === active ? (dark ? '#F4D6BD' : 'var(--nova-purple)') : (dark ? 'rgba(255,255,255,0.5)' : 'var(--nova-muted)'), fontSize: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>{t.icon}</svg>
          {t.label}
        </div>
      ))}
    </nav>
  )
}

const IPhone = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <div style={{ width: 320, height: 660, borderRadius: 56, background: '#1a1422', padding: 11, boxShadow: '0 40px 80px rgba(74,63,102,0.25), 0 16px 36px rgba(47,42,40,0.15)', transition: 'transform .4s ease' }}
    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px) rotate(-1deg)')}
    onMouseLeave={e => (e.currentTarget.style.transform = '')}>
    <div style={{ width: '100%', height: '100%', borderRadius: 46, overflow: 'hidden', position: 'relative', background: dark ? '#1a1422' : 'var(--nova-bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 110, height: 28, background: '#000', borderRadius: 999, zIndex: 10 }} />
      {children}
    </div>
  </div>
)

const StatusBar = ({ dark }: { dark?: boolean }) => (
  <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px 0 28px', fontSize: 13, fontWeight: 600, color: dark ? '#fff' : 'var(--nova-text)', flexShrink: 0, zIndex: 5, position: 'relative' }}>
    <span>9:41</span>
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{STATUS_ICONS}</span>
  </div>
)

const MOrb = ({ cls }: { cls: string }) => {
  const bgs: Record<string, string> = {
    s1: 'radial-gradient(circle at 30% 30%,#9B8FB8,#6B5A95)',
    s3: 'radial-gradient(circle at 30% 30%,#B8A5D2,#8A7BA8)',
    s5: 'radial-gradient(circle at 30% 30%,#E8C9D4,#D28CA7)',
    s7: 'radial-gradient(circle at 30% 30%,#F4D6BD,#E8A98B)',
    s9: 'radial-gradient(circle at 30% 30%,#FFE4B8,#F0B570)',
  }
  return <div style={{ width: 32, height: 32, borderRadius: '50%', background: bgs[cls], border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: cls === 's7' ? '0 0 12px rgba(123,111,168,0.4)' : '0 2px 6px rgba(123,111,168,0.18)', transform: cls === 's7' ? 'scale(1.18)' : undefined }} />
}

export default function GetAppPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)', backdropFilter: 'blur(10px)', fontSize: 11, color: 'var(--nova-purple-dark)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nova-peach)', boxShadow: '0 0 0 4px rgba(232,169,139,0.25)', display: 'inline-block' }} />
          Designed for your phone first
        </span>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(40px,5vw,64px)', fontWeight: 400, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.04 }}>
          Novana on your <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>pocket-sized</em> phone.
        </h1>
        <p style={{ color: 'var(--nova-muted)', fontSize: 17, maxWidth: '56ch', margin: '22px auto 0', lineHeight: 1.6 }}>
          Every screen, hand-built for one-thumb living. Capsule notifications. Native dark mode. Apple Health &amp; Health Connect sync. Works on web too — same account, same data.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 36 }}>
          {[['iOS', '16+ · iPhone & iPad'], ['Android', '12+ · Phone'], ['Web', 'Any browser']].map(([sub, label]) => (
            <div key={sub} style={{ background: 'linear-gradient(135deg,#1a1422,#2D2538)', color: '#fff', padding: '10px 22px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500, boxShadow: '0 8px 20px rgba(20,14,28,0.18)' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 4 }}>{sub}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Row 1: Today + Cycle + Ask */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(20px,4vw,56px)', alignItems: 'end', marginBottom: 64 }}>

        {/* TODAY */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <IPhone>
            <StatusBar />
            <div style={{ flex: 1, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', position: 'relative', paddingBottom: 78 }}>
              {/* Today hero */}
              <div style={{ height: 200, position: 'relative', overflow: 'hidden', padding: '24px 20px 22px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flexShrink: 0 }}>
                <img src="/images/sunset-clouds.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 30%,rgba(28,22,38,0.45) 100%)' }} />
                <div style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>SUNDAY · MAY 25</div>
                <h2 style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1, textShadow: '0 2px 8px rgba(46,36,64,0.4)' }}>
                  Good morning, <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>Nova.</em>
                </h2>
              </div>
              <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
                <div style={{ alignSelf: 'flex-start', background: '#15101a', color: '#fff', borderRadius: 999, padding: '5px 14px 5px 5px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 500 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#E8A98B,#D28CA7)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11 }}>✦</span>
                  novana
                  <span style={{ background: 'rgba(255,255,255,0.10)', padding: '2px 8px', borderRadius: 999, fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>today</span>
                </div>
                <div style={{ background: 'rgba(28,22,38,0.78)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '14px 16px', color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 1.5 }}>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 15, color: '#fff', marginBottom: 5 }}>Your week is opening <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>gently.</em></div>
                  Mood has been steady around 7. Sleep is steadiest the mornings you check in before coffee.
                </div>
                <div style={{ background: '#fff', border: '1px solid var(--nova-border-soft)', borderRadius: 18, padding: 16, boxShadow: '0 3px 12px rgba(74,63,102,0.06)' }}>
                  <h4 style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', margin: '0 0 10px', fontWeight: 600 }}>How are you arriving?</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                    {['s1','s3','s5','s7','s9'].map(s => <MOrb key={s} cls={s} />)}
                  </div>
                </div>
              </div>
            </div>
            <TabBar active="today" />
          </IPhone>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>The home screen</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>One-tap <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>daily ritual.</em></h3>
            <p style={{ fontSize: 13.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.5 }}>Greeting, daily Capsule insight, and the mood orb selector — all above the fold. 10 seconds to log.</p>
          </div>
        </div>

        {/* CYCLE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <IPhone>
            <StatusBar />
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 18px', background: 'linear-gradient(160deg,#FCEEDE 0%,#F4DDC8 60%,#E8D5E0 100%)', paddingBottom: 92 }}>
              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <div className="eyebrow" style={{ letterSpacing: '0.2em' }}>Cycle · Day 8 of 28</div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 19, color: 'var(--nova-text)', marginTop: 4 }}>your follicular bloom</div>
              </div>
              {/* Cycle wheel */}
              <div style={{ width: 200, height: 200, margin: '8px auto 16px', position: 'relative' }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="ga-m" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F4DCDC"/><stop offset="100%" stopColor="#C97486"/></linearGradient>
                    <linearGradient id="ga-f" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FCEAD3"/><stop offset="100%" stopColor="#E8A565"/></linearGradient>
                    <linearGradient id="ga-o" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F8E1CF"/><stop offset="100%" stopColor="#E89571"/></linearGradient>
                    <linearGradient id="ga-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8DDF0"/><stop offset="100%" stopColor="#8A7BB8"/></linearGradient>
                  </defs>
                  <path d="M 100 12 A 88 88 0 0 1 173.4 56.4 L 100 100 Z" fill="url(#ga-m)" opacity="0.95"/>
                  <path d="M 173.4 56.4 A 88 88 0 0 1 173.4 143.6 L 100 100 Z" fill="url(#ga-f)" opacity="0.95"/>
                  <path d="M 173.4 143.6 A 88 88 0 0 1 138.9 181.5 L 100 100 Z" fill="url(#ga-o)" opacity="0.95"/>
                  <path d="M 138.9 181.5 A 88 88 0 1 1 100 12 L 100 100 Z" fill="url(#ga-l)" opacity="0.95"/>
                  <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                  <g transform="rotate(102 100 100)">
                    <line x1="100" y1="20" x2="100" y2="6" stroke="#2F2A28" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="100" cy="12" r="6" fill="#fff" stroke="#2F2A28" strokeWidth="1.5"/>
                  </g>
                </svg>
                <div style={{ position: 'absolute', inset: '28%', background: 'rgba(20,14,28,0.7)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 8, letterSpacing: '0.18em', opacity: 0.6 }}>Day</div>
                    <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 32, lineHeight: 1 }}>8</div>
                    <div style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 11, color: '#F4D6BD' }}>follicular</div>
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 18, padding: 16, margin: '0 -6px' }}>
                <h4 style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', margin: '0 0 6px', fontWeight: 600 }}>In 6 days · ovulation</h4>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 18, fontWeight: 400, lineHeight: 1.25, margin: '0 0 4px' }}>Energy <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>peaks</em> · libido often lifts.</div>
                <p style={{ fontSize: 11, color: 'var(--nova-muted)', margin: '4px 0 0', lineHeight: 1.5 }}>Most fertile 24-hour window.</p>
              </div>
            </div>
            <TabBar active="cycle" />
          </IPhone>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Phase atlas</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>Your <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>cycle</em>, at a glance.</h3>
            <p style={{ fontSize: 13.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.5 }}>A living wheel showing where you are, what&apos;s coming, and what your phase usually feels like.</p>
          </div>
        </div>

        {/* ASK */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <IPhone>
            <StatusBar />
            <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px 0', display: 'flex', flexDirection: 'column', gap: 0, background: 'linear-gradient(180deg,#FDF8EE 0%,#F4DDC8 30%,#FDF8EE 60%)', paddingBottom: 78 }}>
              <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: '0 0 12px', lineHeight: 1.2 }}>
                Ask <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>anything.</em>
              </h2>
              {[
                { role: 'nova', text: "Hi, love. I've been reading your last week of check-ins. What's actually on your mind today?" },
                { role: 'you', text: 'why am i so tired this week?' },
                { role: 'nova', text: <span>Your sleep dipped 18% this week — <em style={{ color: 'var(--nova-purple-dark)', fontStyle: 'italic' }}>especially Tuesday–Thursday</em>, when you also logged higher stress.</span> },
              ].map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 12, flexDirection: m.role === 'you' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10, fontWeight: 600, background: m.role === 'nova' ? 'radial-gradient(circle at 30% 30%,#F4D6BD,#D28CA7)' : 'linear-gradient(135deg,var(--nova-purple),var(--nova-purple-dark))' }}>N</div>
                  <div style={{ padding: '9px 14px', borderRadius: 14, fontSize: 11, lineHeight: 1.5, maxWidth: '75%', background: m.role === 'nova' ? '#fff' : 'linear-gradient(135deg,#7B6FA8,#5A5080)', border: m.role === 'nova' ? '1px solid var(--nova-border-soft)' : 'none', color: m.role === 'nova' ? 'var(--nova-text)' : '#fff' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 'auto', padding: '12px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input placeholder="Type a question…" readOnly style={{ flex: 1, background: 'var(--nova-card)', border: '1px solid var(--nova-border-soft)', borderRadius: 999, padding: '9px 14px', fontSize: 12, color: 'var(--nova-text)', outline: 'none' }} />
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#8A7DBC,#5A5080)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
            <TabBar active="ask" />
          </IPhone>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Conversational AI</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>Ask <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>Novana</em>, anything.</h3>
            <p style={{ fontSize: 13.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.5 }}>A real chat that knows your patterns. Calm, curious, never clinical. Never diagnoses, never alarms.</p>
          </div>
        </div>
      </div>

      {/* Row 2: Dashboard + Reports + Circle */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(20px,4vw,56px)', alignItems: 'end', marginBottom: 64 }}>

        {/* DASHBOARD QUICK LOG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <IPhone>
            <StatusBar />
            <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px 0', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 92 }}>
              <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: 0, lineHeight: 1.2 }}>Good morning, <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>Nova.</em></h2>
              <div style={{ background: 'linear-gradient(160deg,rgba(255,240,220,0.7),rgba(232,168,200,0.40))', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 18, padding: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Quick log</div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 16, marginBottom: 12 }}>How are you arriving?</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                  {['s1','s3','s5','s7','s9'].map(s => <MOrb key={s} cls={s} />)}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                  <button style={{ flex: 1, background: 'linear-gradient(135deg,#8A7DBC,#5A5080)', color: '#fff', border: 'none', padding: 9, borderRadius: 999, fontSize: 11, fontWeight: 600 }}>Save today</button>
                  <button style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--nova-text)', border: '1px solid rgba(255,255,255,0.95)', padding: '9px 14px', borderRadius: 999, fontSize: 11 }}>↻</button>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#1a1422,#5a4a6e)', color: '#F4D6BD', display: 'grid', placeItems: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2h6M9 22h6"/></svg>
                </div>
                <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                  {[['Sleep','6h 42m'], ['HRV','48ms'], ['Steps','4.2k']].map(([l, v]) => (
                    <div key={l} style={{ fontSize: 10 }}>
                      <div style={{ fontSize: 8, color: 'var(--nova-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</div>
                      <b style={{ fontFamily: 'var(--font-fraunces)', fontSize: 14, display: 'block' }}>{v}</b>
                    </div>
                  ))}
                </div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5BC287' }} />
              </div>
            </div>
            <TabBar active="today" />
          </IPhone>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Quick log + wearable</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>Wearable does <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>most</em> of the typing.</h3>
            <p style={{ fontSize: 13.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.5 }}>Sleep, HRV, steps auto-sync. You add the mood orb. The whole check-in is one screen.</p>
          </div>
        </div>

        {/* REPORTS dark mode */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <IPhone dark>
            <StatusBar dark />
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingBottom: 78, background: 'linear-gradient(160deg,#1a1422 0%,#2D2538 100%)', color: '#fff' }}>
              <div style={{ height: 220, position: 'relative', overflow: 'hidden', padding: '18px 20px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
                <img src="/images/sunset-mountains.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(26,20,34,0.3),rgba(26,20,34,0.85))' }} />
                <div style={{ position: 'relative', zIndex: 2, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>Issue No. 003 · May 2026</div>
                <h3 style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1 }}>The month you <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>started</em> hearing yourself.</h3>
              </div>
              <div style={{ padding: '4px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: 14, color: 'rgba(255,255,255,0.85)' }}>
                  <h4 style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', fontWeight: 600 }}>By the numbers</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[['22/31','Days logged'], ['6.4','Avg mood'], ['5.8h','Avg sleep'], ['25.7d','Cycle']].map(([v, l]) => (
                      <div key={l}>
                        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, color: '#fff', fontWeight: 400 }}>{v}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <TabBar active="reports" dark />
          </IPhone>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Monthly issues · Dark mode</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>Your <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>monthly</em> magazine.</h3>
            <p style={{ fontSize: 13.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.5 }}>A personal &ldquo;issue&rdquo; every 30 days. Native dark mode adapts to your phone&apos;s appearance settings.</p>
          </div>
        </div>

        {/* CIRCLE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <IPhone>
            <StatusBar />
            <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px 0', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 92 }}>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, lineHeight: 1.15 }}>The <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>circle.</em></div>
              <div style={{ fontSize: 11, color: 'var(--nova-muted)', marginTop: -8 }}>12,847 women here today</div>
              <div style={{ background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', borderRadius: 14, overflow: 'hidden' }}>
                <img src="/images/sunset-clouds.jpg" alt="" style={{ width: '100%', height: 80, objectFit: 'cover' }} />
                <div style={{ padding: 14 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--nova-muted)', letterSpacing: '0.08em', marginBottom: 6 }}>TODAY · 1,284 ANSWERS</div>
                  <h4 style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 14, fontWeight: 400, margin: 0, lineHeight: 1.25 }}>What did your body ask for this morning?</h4>
                </div>
              </div>
              <div style={{ background: 'linear-gradient(160deg,#2D2538,#4A3F66)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: 12, color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 9 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#E8A98B,#D28CA7)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>A woman</span>
                  <span style={{ marginLeft: 'auto', fontSize: 8, padding: '2px 6px', borderRadius: 999, background: 'rgba(244,214,189,0.15)', color: '#F4D6BD', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Luteal</span>
                </div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.92)' }}>two years of being told it&apos;s stress. Finally got the diagnosis. Feeling <em style={{ color: '#F4D6BD', fontStyle: 'italic' }}>lighter.</em></div>
              </div>
            </div>
            <TabBar active="circle" />
          </IPhone>
          <div style={{ textAlign: 'center', maxWidth: 280 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>The Circle</div>
            <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>You&apos;re <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>not</em> the only one.</h3>
            <p style={{ fontSize: 13.5, color: 'var(--nova-muted)', margin: 0, lineHeight: 1.5 }}>Anonymous reflections from women in the same cycle phase. No usernames, no followers. Just nods.</p>
          </div>
        </div>
      </div>

      {/* Native promise */}
      <section style={{
        padding: '56px 48px', borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(160deg,#1a1422 0%,#2D2538 50%,#5A4A6E 100%)',
        color: '#fff', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,169,139,0.35),transparent 70%)', filter: 'blur(20px)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 999, background: 'rgba(244,214,189,0.15)', color: '#F4D6BD', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F4D6BD', display: 'inline-block' }} /> Roadmap · 2026
          </span>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(32px,3.4vw,44px)', fontWeight: 400, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
            Native iOS &amp; Android, <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>shipping soon.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 16, lineHeight: 1.65, margin: '0 0 14px' }}>
            The web app is fully usable today. The native phone apps are in private beta — same account, same data, with the iOS extras: Apple Health sync, Dynamic Island Capsule, home-screen widgets, Lock Screen complications.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 16, lineHeight: 1.65, margin: '0 0 14px' }}>Pre-register and you&apos;ll get TestFlight access in June.</p>
          <a href="/onboarding" style={{ display: 'inline-block', marginTop: 14, padding: '12px 22px', borderRadius: 999, background: 'linear-gradient(135deg,#F4D6BD,#E8A98B)', color: '#2F2A28', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Get on the beta list →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, position: 'relative', zIndex: 2 }}>
          {[['June', 'iOS private beta', 'Apple Health, Capsule live notifications, Lock Screen widget.'], ['August', 'Android beta', 'Health Connect sync, Material You theming, foldable layouts.'], ['Fall 2026', 'Public launch', 'App Store · Google Play. Web stays first-class and free.']].map(([when, what, desc]) => (
            <div key={when} style={{ padding: 18, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{when}</div>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 18, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>{what}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 32 }} />
    </>
  )
}
