'use client'
import { useState } from 'react'
import Image from 'next/image'
import ComingSoonPage from '@/components/ComingSoonPage'

const SHOW_PREVIEW = false

const FILTER_CHIPS = ['All', 'Same phase as me', 'PMOS', 'Cycle aware', 'First timers', 'Long days']

const PHASE_TAG_STYLES: Record<string, { bg: string; color: string }> = {
  menstrual:  { bg: 'rgba(201,116,134,0.15)', color: '#A14F60' },
  follicular: { bg: 'rgba(232,165,101,0.15)', color: '#8C6035' },
  ovulatory:  { bg: 'rgba(232,149,113,0.15)', color: '#8E5236' },
  luteal:     { bg: 'rgba(138,123,184,0.15)', color: '#5A4A8C' },
}

const POSTS = [
  { variant: 'quote', av: 'linear-gradient(135deg, #E8A98B, #D28CA7)', phase: 'luteal', time: '2 MIN AGO', text: '"My body asked for <em>quiet</em>. I gave it three hours and a long bath. It was enough."', r1: { label: '✿ Held · 48', active: true }, r2: { label: '↻ Same · 22', active: false } },
  { variant: 'normal', av: 'linear-gradient(135deg, #B8A5D2, #8A7BB8)', phase: 'follicular', time: '8 MIN AGO', text: 'first week post-IUD removal. Cramps less, mood weirdly bright. Anyone else find their follicular hits harder after coming off hormones?', r1: { label: '✿ Held · 12', active: false }, r2: { label: '↻ Same · 41', active: true } },
  { variant: 'dark', av: 'linear-gradient(135deg, #F4D6BD, #E8A98B)', phase: 'luteal', time: '14 MIN AGO', text: 'two years of being told it\'s just stress. finally got the PMOS diagnosis this week. somehow feeling… <em>lighter?</em> like — okay, this is real. I\'m not making it up.', r1: { label: '✿ Held · 187', active: true }, r2: { label: '↻ Same · 64', active: false } },
  { variant: 'normal', av: 'linear-gradient(135deg, #C97486, #A14F60)', phase: 'menstrual', time: '18 MIN AGO', text: 'day one. cancelled the dinner. boyfriend was kind about it. small win for boundaries.', r1: { label: '✿ Held · 89', active: false }, r2: { label: '↻ Same · 32', active: true } },
  { variant: 'scenic', img: '/images/sunset-mountains.jpg', av: 'linear-gradient(135deg, #E8DDF0, #8A7BB8)', phase: 'follicular', time: '22 MIN AGO', text: 'walked at 6am. the sky did <em>this</em>. wanted to share it with someone who\'d just… see it without making it about anything.', r1: { label: '✿ Held · 312', active: true }, r2: { label: '↻ Same · 18', active: false } },
  { variant: 'normal', av: 'linear-gradient(135deg, #8A7BB8, #5A4A8C)', phase: 'luteal', time: '26 MIN AGO', text: "does anyone else's appetite shift hard around day 22? I'm not even hungry — just want to eat. Novana flagged it last cycle too.", r1: { label: '✿ Held · 28', active: false }, r2: { label: '↻ Same · 94', active: true } },
  { variant: 'quote', av: 'linear-gradient(135deg, #F1C9A8, #E8A565)', phase: 'ovulatory', time: '31 MIN AGO', text: '"finally feel like the version of <em>me</em> I keep promising myself."', r1: { label: '✿ Held · 218', active: true }, r2: { label: '↻ Same · 76', active: false } },
  { variant: 'normal', av: 'linear-gradient(135deg, #E0B6BE, #C97486)', phase: 'menstrual', time: '38 MIN AGO', text: 'my mom texted "how are you holding up?" without me saying anything. is this what generational softness looks like? i\'m in tears.', r1: { label: '✿ Held · 156', active: true }, r2: { label: '↻ Same · 22', active: false } },
  { variant: 'normal', av: 'linear-gradient(135deg, #FCEAD3, #E8A565)', phase: 'follicular', time: '42 MIN AGO', text: 'started lifting heavy this week. read here that follicular is the best for strength gains. felt unreal. who knew my own cycle was the cheat code.', r1: { label: '✿ Held · 74', active: false }, r2: { label: '↻ Same · 38', active: true } },
  { variant: 'dark', av: 'linear-gradient(135deg, #B8A5D2, #5A4A8C)', phase: 'luteal', time: '50 MIN AGO', text: "in PMS for the third day in a row and i finally told my partner the truth: \"I don't need you to fix this. I just need you to not take it personally for the next five days.\" he <em>got it.</em>", r1: { label: '✿ Held · 412', active: true }, r2: { label: '↻ Same · 187', active: false } },
  { variant: 'quote', av: 'linear-gradient(135deg, #E8C5D4, #D28CA7)', phase: 'ovulatory', time: '1 H AGO', text: '"i think this is the kindest i\'ve ever been to <em>myself</em>. and apparently it took an app to teach me."', r1: { label: '✿ Held · 89', active: true }, r2: { label: '↻ Same · 14', active: false } },
  { variant: 'normal', av: 'linear-gradient(135deg, #8FA7C6, #5A6E8C)', phase: 'luteal', time: '1 H AGO', text: '38 and never tracked before. eight weeks in. i had no idea my "random bad days" were not random at all.', r1: { label: '✿ Held · 263', active: true }, r2: { label: '↻ Same · 102', active: false } },
]

function PhaseTag({ phase }: { phase: string }) {
  const s = PHASE_TAG_STYLES[phase] || PHASE_TAG_STYLES.follicular
  return (
    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 600, background: s.bg, color: s.color }}>
      {phase}
    </span>
  )
}

function PostReactions({ r1, r2, dark }: { r1: { label: string; active: boolean }; r2: { label: string; active: boolean }; dark?: boolean }) {
  const [a1, setA1] = useState(r1.active)
  const [a2, setA2] = useState(r2.active)
  const base = dark
    ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }
    : { background: 'rgba(255,255,255,0.6)', border: '1px solid var(--nova-border-soft)', color: 'var(--nova-text)' }
  const activeStyle = { background: 'linear-gradient(135deg, #F4D6BD, #E8A98B)', border: '1px solid transparent', color: 'var(--nova-text)' }
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'var(--nova-border-soft)'}` }}>
      <button onClick={() => setA1(!a1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, fontSize: 11, cursor: 'pointer', ...(a1 ? activeStyle : base) }}>{r1.label}</button>
      <button onClick={() => setA2(!a2)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, fontSize: 11, cursor: 'pointer', ...(a2 ? activeStyle : base) }}>{r2.label}</button>
      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, fontSize: 11, cursor: 'pointer', ...(dark ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' } : { background: 'rgba(255,255,255,0.6)', border: '1px solid var(--nova-border-soft)', color: 'var(--nova-text)' }) }}>+ Save</button>
    </div>
  )
}

export function CircleContent() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [compose, setCompose] = useState('')

  return (
    <>
      {/* Centered narrative header */}
      <div style={{ textAlign: 'center', padding: '24px 0 36px', position: 'relative', marginBottom: 24 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px',
          borderRadius: 999, background: 'rgba(255,255,255,0.7)', border: '1px solid var(--nova-border-soft)',
          backdropFilter: 'blur(10px)', color: 'var(--nova-purple-dark)', fontSize: 11,
          letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 18,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--nova-peach)', boxShadow: '0 0 0 4px rgba(232,169,139,0.25)', display: 'inline-block' }} />
          The Circle · anonymous · private
        </span>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 400, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.02 }}>
          You&apos;re not the <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>only one.</em>
        </h1>
        <p style={{ color: 'var(--nova-muted)', fontSize: 17, maxWidth: '56ch', margin: '18px auto 0', lineHeight: 1.6 }}>
          Soft reflections from other women, anonymized. No usernames. No followers. No likes — just gentle nods. Speak only when you want to.
        </p>
      </div>

      {/* Mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        {[
          { v: '12,847', lbl: 'In the circle today' },
          { v: <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>284</em>, lbl: 'Sharing this hour' },
          { v: '61%', lbl: 'In luteal this week' },
          { v: '100%', lbl: 'Anonymous, always' },
        ].map((t, i) => (
          <div key={i} style={{ padding: 18, borderRadius: 'var(--radius)', background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 30, fontWeight: 400, color: 'var(--nova-text)' }}>{t.v}</div>
            <div style={{ fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{t.lbl}</div>
          </div>
        ))}
      </div>

      {/* Today's prompt card */}
      <section style={{
        position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: 32,
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: 280,
        background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)',
      }}>
        <div style={{ padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14, zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.1em' }}>SUNDAY · MAY 25 · TODAY&apos;S PROMPT</div>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400, margin: 0, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            What did your body <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>ask for</em> this morning — and did you listen?
          </h2>
          <p style={{ fontSize: 13, color: 'var(--nova-muted)', margin: 0 }}>Answered by <b style={{ color: 'var(--nova-text)', fontWeight: 500 }}>1,284 women</b> today.</p>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src="/images/sunset-clouds.jpg" alt="" fill className="object-cover" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, transparent 0%, rgba(252,246,238,0.0) 50%, var(--nova-card-2) 100%)' }} />
        </div>
      </section>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => setActiveFilter(chip)}
            style={{
              padding: '8px 16px', borderRadius: 999,
              background: activeFilter === chip ? 'linear-gradient(135deg, #2D2538, #5A4A6E)' : 'rgba(255,255,255,0.6)',
              border: activeFilter === chip ? '1px solid transparent' : '1px solid var(--nova-border-soft)',
              color: activeFilter === chip ? '#fff' : 'var(--nova-text)',
              fontSize: 13, cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: activeFilter === chip ? '0 4px 14px rgba(45,37,56,0.3)' : undefined,
              transition: 'all .15s ease',
            }}
          >{chip}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ padding: '8px 14px', borderRadius: 999, background: 'transparent', border: '1px solid var(--nova-border-soft)', fontSize: 12, color: 'var(--nova-muted)', cursor: 'pointer' }}>Latest ↓</button>
      </div>

      {/* Masonry feed */}
      <div style={{ columnCount: 3, columnGap: 18 }}>
        {POSTS.map((post, i) => {
          const isDark = post.variant === 'dark'
          const isQuote = post.variant === 'quote'
          const isScenic = post.variant === 'scenic'
          const textColor = isDark || isScenic ? 'rgba(255,255,255,0.92)' : 'var(--nova-text)'
          const phaseTagStyle = isDark ? { background: 'rgba(244,214,189,0.15)', color: '#F4D6BD' } : undefined

          return (
            <div
              key={i}
              style={{
                breakInside: 'avoid',
                marginBottom: 18,
                borderRadius: 'var(--radius-lg)',
                border: isDark || isScenic ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--nova-border-soft)',
                position: 'relative',
                transition: 'transform .2s ease, box-shadow .2s ease',
                overflow: 'hidden',
                ...(isScenic ? { padding: 0 } : { padding: 24 }),
                ...(isDark ? { background: 'linear-gradient(160deg, #2D2538, #4A3F66)', color: '#fff' }
                  : isQuote ? { background: 'linear-gradient(160deg, rgba(255,240,220,0.5), rgba(232,168,200,0.25)), var(--nova-card-2)' }
                  : { background: 'var(--nova-card-2)' }),
              }}
            >
              {isScenic && post.img && (
                <div style={{ position: 'relative', height: 160 }}>
                  <Image src={post.img} alt="" fill className="object-cover" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(28,22,38,0.5) 100%)', zIndex: 1 }} />
                </div>
              )}
              <div style={isScenic ? { padding: '18px 22px 22px', background: 'linear-gradient(180deg, #2D2538, #1a1422)' } : undefined}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, fontSize: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: post.av, flexShrink: 0 }} />
                  <span style={{ fontWeight: 500, color: textColor }}>
                    A woman in{' '}
                    <span style={phaseTagStyle ? { ...phaseTagStyle, fontSize: 10, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 600 } : undefined}>
                      {!phaseTagStyle && <PhaseTag phase={post.phase} />}
                      {phaseTagStyle && post.phase}
                    </span>
                  </span>
                  <span style={{ color: isDark || isScenic ? 'rgba(255,255,255,0.55)' : 'var(--nova-muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em' }}>{post.time}</span>
                </div>
                {/* Body */}
                <p
                  style={{
                    fontSize: isQuote ? 19 : 15,
                    lineHeight: isQuote ? 1.4 : 1.55,
                    color: textColor,
                    fontFamily: isQuote ? 'var(--font-fraunces)' : 'inherit',
                    fontStyle: isQuote ? 'italic' : 'normal',
                    margin: 0,
                  }}
                  dangerouslySetInnerHTML={{ __html: post.text.replace(/<em>/g, `<em style="font-style:italic;color:${isDark || isScenic ? '#F4D6BD' : 'var(--nova-purple-dark)'}">`).replace(/<\/em>/g, '</em>') }}
                />
                <PostReactions r1={post.r1} r2={post.r2} dark={isDark || isScenic} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Compose dock — sticky bottom */}
      <div style={{
        position: 'sticky', bottom: 16, margin: '32px 0 0',
        background: 'rgba(20,14,28,0.78)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 24, padding: '18px 22px', color: '#fff',
        boxShadow: '0 20px 48px rgba(20,14,28,0.35)',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center',
        zIndex: 20,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #E8A98B, #D28CA7)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>N</div>
        <div>
          <input
            value={compose}
            onChange={e => setCompose(e.target.value)}
            placeholder="Share a soft reflection… (you're anonymous in The Circle)"
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 15, width: '100%', outline: 'none', fontFamily: 'inherit' }}
          />
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, letterSpacing: '0.04em' }}>
            Posting as: <b style={{ color: 'rgba(255,255,255,0.75)' }}>A woman in Follicular</b> · No name, no profile, no history shown.
          </div>
        </div>
        <button style={{ background: 'linear-gradient(135deg, #F4D6BD, #E8A98B)', color: '#2F2A28', border: 'none', padding: '10px 22px', borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .2s ease' }}>
          Share
        </button>
      </div>

      <div style={{ height: 24 }} />
    </>
  )
}

export default function CirclePage() {
  if (!SHOW_PREVIEW) {
    return (
      <ComingSoonPage
        title="The Circle"
        feature="Circle Community"
        description="An anonymous community for women to share soft reflections, connect across cycle phases, and feel less alone."
      />
    )
  }
  return <CircleContent />
}
