'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ComingSoonPage from '@/components/ComingSoonPage'

const SHOW_PREVIEW = false

const TOPICS = ['All', 'PMOS', 'Cycle science', 'Hormones', 'Mental health', 'Nutrition', 'Movement', 'Skin', 'Fertility', 'Sleep', 'Perimenopause']

const ARTICLES_MAIN = [
  {
    img: '/images/sunset-mountains.jpg',
    tag: 'Hormones', time: '8 min',
    title: <>Insulin resistance, in <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>plain English.</em></>,
    excerpt: 'Why up to 70% of women with PMOS have it, how it drives the other symptoms, and the lifestyle levers that actually move the needle.',
    author: 'Dr. M. Chen',
  },
  {
    img: '/images/desert-dunes.jpg',
    tag: 'Cycle', time: '6 min',
    title: <>The four phases — and why your week-three self is <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>different.</em></>,
    excerpt: 'Estrogen, progesterone, testosterone — when each one peaks, and why your "off days" might be a hormonal weather pattern, not a personal failing.',
    author: 'Novana team',
  },
  {
    quote: true,
    title: '"It took six doctors and seven years before someone said the word PMOS to me."',
    excerpt: 'Twelve women on what they wish they\'d known earlier. (Reader stories, anonymized.)',
    author: 'Twelve women · anonymous',
  },
  {
    img: '/images/sunset-water.jpg',
    tag: 'Mental health', time: '10 min',
    title: <>The grief of <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>diagnosis</em> — and what to do with it.</>,
    excerpt: 'Why getting a name for what you\'ve felt for years can feel like loss, validation, and rage all at once. A therapist\'s gentle framework.',
    author: 'Dr. Lina K., LMFT',
  },
  {
    img: '/images/sunset-clouds.jpg',
    tag: 'Nutrition', time: '9 min',
    title: <>What the research <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>actually</em> says about PMOS &amp; diet.</>,
    excerpt: 'No keto evangelism. No anti-inflammatory miracle promises. Just what the published evidence (last 5 years) shows — and what it doesn\'t.',
    author: 'Dr. K. Iyer, PhD',
  },
  {
    img: '/images/sunset-mountains.jpg',
    tag: 'Movement', time: '5 min',
    title: <>Lifting heavy in your <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>follicular</em> week.</>,
    excerpt: 'Why some athletes program around their cycle now. Phase-by-phase strength, cardio, and recovery — without overcomplicating it.',
    author: 'Coach S. Aldana',
  },
]

const ARTICLES_NEW = [
  {
    img: '/images/sunset-water.jpg', tag: 'Sleep', time: '7 min',
    title: <>Why your sleep gets <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>weird</em> in luteal.</>,
    excerpt: 'Progesterone\'s hidden role in temperature regulation, and the 4 small habits that protect mid-cycle sleep.',
    author: 'Dr. T. Singh',
  },
  {
    img: '/images/desert-dunes.jpg', tag: 'Skin', time: '6 min',
    title: <>Hormonal acne — what <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>actually</em> works.</>,
    excerpt: 'Topicals, spironolactone, inositol, diet — sorted by quality of evidence. Honest about uncertainty.',
    author: 'Dr. A. Morrison',
  },
  {
    img: '/images/sunset-clouds.jpg', tag: 'Fertility', time: '11 min',
    title: <>PMOS &amp; fertility — the <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>fuller</em> picture.</>,
    excerpt: 'Most women with PMOS can and do conceive. Here\'s what the data shows, what affects odds, and what\'s hopeful.',
    author: 'Dr. E. Romero',
  },
]

function ArticleCard({ article }: { article: typeof ARTICLES_MAIN[0] }) {
  if (article.quote) {
    return (
      <article style={{
        background: 'linear-gradient(160deg, #2D2538, #4A3F66)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .25s ease',
        display: 'flex', flexDirection: 'column',
        padding: 32,
        justifyContent: 'space-between',
        border: '1px solid var(--nova-border-soft)',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
            background: 'rgba(244,214,189,0.15)', border: '1px solid rgba(244,214,189,0.25)',
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F4D6BD', fontWeight: 600,
          }}>✿ Letter from a reader</span>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', fontSize: 24, fontWeight: 400, margin: 0, lineHeight: 1.3, color: '#fff' }}>{article.title}</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{article.excerpt}</p>
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{article.author}</span>
            <span style={{ color: '#F4D6BD', fontWeight: 500 }}>Read all 12 →</span>
          </div>
        </div>
      </article>
    )
  }
  return (
    <article style={{
      background: 'var(--nova-card-2)',
      border: '1px solid var(--nova-border-soft)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all .25s ease',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--nova-card)' }}>
        {article.img && <Image src={article.img} alt="" fill className="object-cover" style={{ transition: 'transform .6s ease' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.15) 100%)', zIndex: 1 }} />
        {article.tag && (
          <span style={{
            position: 'absolute', top: 14, left: 14, zIndex: 2,
            padding: '5px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)',
            fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600,
            color: 'var(--nova-purple-dark)',
          }}>{article.tag}</span>
        )}
        {article.time && (
          <span style={{
            position: 'absolute', bottom: 14, right: 14, zIndex: 2,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(20,14,28,0.7)', color: '#fff', backdropFilter: 'blur(10px)',
            fontSize: 11,
          }}>{article.time}</span>
        )}
      </div>
      <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, margin: 0, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{article.title}</h3>
        <p style={{ fontSize: 14, color: 'var(--nova-muted)', lineHeight: 1.5, margin: 0 }}>{article.excerpt}</p>
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--nova-border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--nova-muted)' }}>
          <span><b style={{ color: 'var(--nova-text)', fontWeight: 500 }}>{article.author}</b></span>
          <span style={{ color: 'var(--nova-purple-dark)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>✿ AI summarized</span>
        </div>
      </div>
    </article>
  )
}

export function ResourcesContent() {
  const [activeTopic, setActiveTopic] = useState('All')
  const [askQ, setAskQ] = useState('')

  return (
    <>
      {/* Hero: dark editorial split */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: 36,
        minHeight: 380,
        isolation: 'isolate',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        color: '#fff',
      }}>
        {/* Left: dark meta side */}
        <div style={{
          padding: 48,
          background: 'linear-gradient(135deg, #1a1422 0%, #2D2538 50%, #4A3F66 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative',
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.24em', color: '#F4D6BD', textTransform: 'uppercase', fontWeight: 600, marginBottom: 22 }}>
              ✿ Novana Library · evidence in plain language
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(40px, 4.4vw, 64px)', fontWeight: 400, margin: 0, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.04 }}>
              Your body, <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>explained.</em>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 17, lineHeight: 1.6, margin: '22px 0 0', maxWidth: '42ch' }}>
              No clinical jargon. No fear-mongering. Just calm, well-researched primers on PMOS, cycles, hormones, and the science of how you feel — translated by AI into plain language.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
            {[{ val: '48', lbl: 'articles' }, { val: '200+', lbl: 'studies cited' }, { val: 'Updated', lbl: 'weekly' }].map(s => (
              <div key={s.lbl} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                <b style={{ display: 'block', fontFamily: 'var(--font-fraunces)', fontSize: 26, fontWeight: 400, color: '#F4D6BD', marginBottom: 2 }}>{s.val}</b>
                {s.lbl}
              </div>
            ))}
          </div>
        </div>
        {/* Right: photo */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src="/images/sunset-water.jpg" alt="" fill className="object-cover" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, transparent 60%, rgba(26,20,34,0.9) 100%)' }} />
        </div>
      </section>

      {/* Topic nav */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 8 }}>
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTopic(t)}
            style={{
              padding: '10px 18px', borderRadius: 999,
              background: activeTopic === t ? 'linear-gradient(135deg, #2D2538, #5A4A6E)' : 'var(--nova-card-2)',
              border: activeTopic === t ? '1px solid transparent' : '1px solid var(--nova-border-soft)',
              color: activeTopic === t ? '#fff' : 'var(--nova-text)',
              fontSize: 13, cursor: 'pointer',
              transition: 'all .15s ease',
              whiteSpace: 'nowrap', fontWeight: 500,
            }}
          >{t}</button>
        ))}
      </div>

      {/* Featured article */}
      <article style={{
        position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        marginBottom: 32, display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: 360,
        background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)',
        cursor: 'pointer', transition: 'transform .3s ease',
      }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src="/images/sunset-clouds.jpg" alt="" fill className="object-cover" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(46,36,64,0.25) 0%, transparent 60%)', zIndex: 1 }} />
        </div>
        <div style={{ padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600 }}>
              <span style={{ color: 'var(--nova-peach)', fontSize: 14 }}>✿</span> Editor&apos;s choice · PMOS 101
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.015em', margin: '14px 0' }}>
              What <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>PMOS</em> actually is — and what it isn&apos;t.
            </h2>
            <p style={{ color: 'var(--nova-muted)', fontSize: 16, lineHeight: 1.6, margin: '0 0 16px', maxWidth: '48ch' }}>
              The condition formerly called PCOS was renamed because the old name described one symptom and missed the bigger picture: a metabolic, hormonal, full-body syndrome. Here&apos;s what changed, what the research now shows, and why the new name matters for getting taken seriously.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--nova-muted)', fontSize: 13, marginTop: 'auto' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E8A98B, #D28CA7)', flexShrink: 0 }} />
            <b style={{ color: 'var(--nova-text)', fontWeight: 500 }}>Reviewed by Dr. R. Patel, MD</b>
            <span style={{ color: 'var(--nova-border)' }}>·</span>
            <span>12 min read</span>
            <span style={{ color: 'var(--nova-border)' }}>·</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(244,214,189,0.5), rgba(232,168,200,0.25))',
              border: '1px solid rgba(232,169,139,0.35)',
              fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600,
            }}>✿ AI summary inside</span>
          </div>
        </div>
      </article>

      {/* Article grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 36 }}>
        {ARTICLES_MAIN.map((a, i) => <ArticleCard key={i} article={a} />)}
      </div>

      {/* Curated collection block */}
      <section style={{
        display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'start',
        margin: '0 0 36px', padding: 36,
        background: `radial-gradient(60% 50% at 100% 0%, rgba(244,214,189,0.30), transparent 70%), linear-gradient(160deg, rgba(255,240,220,0.4), rgba(232,168,200,0.20)), var(--nova-card-2)`,
        border: '1px solid var(--nova-border-soft)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(244,214,189,0.5), rgba(232,168,200,0.25))',
            border: '1px solid rgba(232,169,139,0.35)',
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600,
          }}>✿ Curated for you</span>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 30, fontWeight: 400, margin: '14px 0 10px', letterSpacing: '-0.02em' }}>
            Where to start, if <em style={{ fontStyle: 'italic', color: 'var(--nova-purple-dark)' }}>nothing</em> feels obvious yet.
          </h2>
          <p style={{ color: 'var(--nova-muted)', fontSize: 14, lineHeight: 1.55, margin: '0 0 14px', maxWidth: '34ch' }}>
            Based on what you&apos;ve logged so far — irregular cycles, late-luteal symptoms, mood dips — these six pieces are the path Novana would walk through with you first.
          </p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--nova-purple-dark)', letterSpacing: '0.1em' }}>5 PIECES · 38 MIN TOTAL</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: '1', title: 'PMOS 101 — what it is, what it isn\'t', sub: 'Start here. The foundational primer.', time: '12 MIN' },
            { n: '2', title: 'Why your cycle gets shorter under stress', sub: 'Cortisol, LH, and the hypothalamic axis — explained calmly.', time: '6 MIN' },
            { n: '3', title: 'Late-luteal acne — the androgen story', sub: 'Why day 18–22 might be your skin\'s hardest week.', time: '7 MIN' },
            { n: '4', title: 'How to ask for the right bloodwork', sub: 'A scripted, doctor-friendly request you can copy.', time: '5 MIN' },
            { n: '5', title: 'Three lifestyle levers with real evidence', sub: 'No miracle cures — just what the studies actually show.', time: '8 MIN' },
          ].map(item => (
            <div key={item.n} style={{
              background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: 14, padding: '16px 20px',
              display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 14, alignItems: 'center',
              cursor: 'pointer', transition: 'all .15s ease',
            }}>
              <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 18, color: 'var(--nova-purple-dark)' }}>{item.n}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--nova-muted)', marginTop: 2 }}>{item.sub}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--nova-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newest in library */}
      <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, margin: '0 0 20px' }}>Newest in the library</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 36 }}>
        {ARTICLES_NEW.map((a, i) => <ArticleCard key={i} article={a} />)}
      </div>

      {/* Ask Novana bottom CTA */}
      <section style={{
        borderRadius: 'var(--radius-xl)', padding: '44px 48px',
        background: 'linear-gradient(135deg, #1a1422 0%, #2D2538 70%, #4A3F66 100%)',
        color: '#fff',
        display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, alignItems: 'center',
        position: 'relative', overflow: 'hidden', marginBottom: 32,
      }}>
        <span className="orb orb-pink animate-float" style={{ position: 'absolute', width: 100, height: 100, top: '10%', right: '12%' }} />
        <span className="orb orb-peach animate-float delay-2" style={{ position: 'absolute', width: 60, height: 60, bottom: '12%', right: '28%' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999,
            background: 'rgba(244,214,189,0.15)', border: '1px solid rgba(244,214,189,0.3)',
            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F4D6BD', fontWeight: 600,
          }}>✿ Can&apos;t find it? Just ask</span>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 30, fontWeight: 400, color: '#fff', margin: '14px 0 10px' }}>
            Don&apos;t see your <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>exact</em> question?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.55, maxWidth: '48ch' }}>
            Novana can pull from every article and every study cited, and summarize what&apos;s known about whatever you&apos;re wondering. In plain language. With sources.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <input
            value={askQ}
            onChange={e => setAskQ(e.target.value)}
            placeholder="Try: 'Why do I feel worse the week before my period?'"
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16, padding: '14px 18px', color: '#fff',
              width: '100%', fontSize: 14, fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <Link href={askQ ? `/ask?q=${encodeURIComponent(askQ)}` : '/ask'} style={{
            display: 'block', marginTop: 14, width: '100%', textAlign: 'center', padding: 12,
            background: 'var(--nova-purple)', color: '#fff', borderRadius: 999,
            textDecoration: 'none', fontSize: 14, fontWeight: 500,
          }}>
            Ask Novana →
          </Link>
        </div>
      </section>
    </>
  )
}

export default function ResourcesPage() {
  if (!SHOW_PREVIEW) {
    return (
      <ComingSoonPage
        title="Novana Library"
        feature="resources"
        description="Evidence-based articles on PMOS, hormones, cycle science, and more — written in plain language, reviewed by clinicians."
      />
    )
  }
  return <ResourcesContent />
}
