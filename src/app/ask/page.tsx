'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
  role: 'nova' | 'you'
  content: string
  citations?: string[]
  isTyping?: boolean
}

const suggestions = [
  'Why have I been so tired this week?',
  "What's happening in my body right now?",
  'My mood feels off — any patterns?',
  'What helped me sleep best lately?',
  "I'm cramping. Anything to notice?",
]

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'nova',
      content: "I've been reading your last week of check-ins. A few things stood out — but tell me what's actually on your mind today. There's no wrong question.",
      citations: ['Reading: 7 days', 'Cycle: Day 8 · Follicular', '3 patterns noticed'],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function autosize() {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }

  async function submit() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setMessages(prev => [...prev, { role: 'you', content: q }, { role: 'nova', content: '', isTyping: true }])
    setLoading(true)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      })
      const data = await res.json()
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'nova', content: data.reply || 'I had trouble reaching that part of my brain just now. Try again in a moment?' }
        return next
      })
    } catch {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'nova', content: 'I had trouble reaching that part of my brain just now. Try again in a moment?' }
        return next
      })
    }
    setLoading(false)
  }

  return (
    <>
      {/* Hero strip with sunset-clouds.jpg */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        padding: '28px 32px',
        color: '#fff',
        marginBottom: 18,
        isolation: 'isolate',
        minHeight: 140,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 24,
        alignItems: 'center',
      }}>
        <Image src="/images/sunset-clouds.jpg" alt="" fill className="object-cover" style={{ zIndex: 0 }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(46,36,64,0.45) 0%, rgba(46,36,64,0.15) 60%, transparent 100%)',
        }} />
        {/* Floating orbs */}
        <span className="orb orb-pink animate-float" style={{ position: 'absolute', zIndex: 2, width: 70, height: 70, top: '20%', right: '22%' }} />
        <span className="orb orb-peach animate-float delay-2" style={{ position: 'absolute', zIndex: 2, width: 48, height: 48, bottom: '22%', right: '8%' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ color: '#fff', fontFamily: 'var(--font-fraunces)', fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.015em' }}>
            Ask anything. I&apos;ll be <em style={{ fontStyle: 'italic', color: '#F4D6BD' }}>gentle.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.86)', margin: '6px 0 0', fontSize: 14 }}>
            I can reflect on your patterns, explain your phase, or sit with a feeling. I never diagnose — and never share what we say.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="chip" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff', whiteSpace: 'nowrap' }}>
            <i className="dot" style={{ background: '#F4D6BD' }} /> Private to you
          </span>
        </div>
      </section>

      {/* 2-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Conversation surface */}
        <div style={{
          background: 'var(--nova-card-2)',
          border: '1px solid var(--nova-border-soft)',
          borderRadius: 'var(--radius-lg)',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Scrollable messages */}
          <div ref={scrollRef} style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: 6,
            marginBottom: 18,
            display: 'flex', flexDirection: 'column', gap: 18,
            minHeight: 0,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 14,
                maxWidth: '88%',
                marginLeft: msg.role === 'you' ? 'auto' : undefined,
                flexDirection: msg.role === 'you' ? 'row-reverse' : 'row',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  display: 'grid', placeItems: 'center', color: '#fff',
                  fontSize: 13, fontWeight: 600,
                  background: msg.role === 'nova'
                    ? 'radial-gradient(circle at 30% 30%, #F4D6BD 0%, #E8A98B 50%, #D28CA7 100%)'
                    : 'linear-gradient(135deg, var(--nova-purple), var(--nova-purple-dark))',
                  boxShadow: msg.role === 'nova' ? '0 0 12px rgba(232,169,139,0.4)' : undefined,
                }}>N</div>

                {/* Bubble */}
                <div style={{
                  background: msg.role === 'you' ? 'linear-gradient(135deg, #7B6FA8, #5A5080)' : 'rgba(255,255,255,0.7)',
                  border: msg.role === 'you' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 18,
                  borderBottomRightRadius: msg.role === 'you' ? 6 : 18,
                  borderBottomLeftRadius: msg.role === 'nova' ? 6 : 18,
                  padding: '14px 18px',
                  lineHeight: 1.55,
                  fontSize: 14.5,
                  color: msg.role === 'you' ? '#fff' : 'var(--nova-text)',
                  boxShadow: '0 4px 16px rgba(123,111,168,0.08)',
                }}>
                  {msg.role === 'nova' && i === 0 && (
                    <div style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', color: 'var(--nova-purple-dark)', fontSize: 16, marginBottom: 8 }}>
                      Hi, love.
                    </div>
                  )}
                  {msg.isTyping ? (
                    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                      {[0, 150, 300].map(d => (
                        <span key={d} style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--nova-purple)',
                          display: 'inline-block',
                          animation: 'bounce 1.2s infinite ease-in-out',
                          animationDelay: `${d}ms`,
                          opacity: 0.4,
                        }} />
                      ))}
                    </span>
                  ) : msg.content}
                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{
                      marginTop: 12, paddingTop: 10,
                      borderTop: '1px dashed var(--nova-border)',
                      display: 'flex', flexWrap: 'wrap', gap: 6,
                      fontSize: 11, color: 'var(--nova-muted)',
                    }}>
                      {msg.citations.map(c => (
                        <span key={c} style={{
                          background: 'rgba(232,169,139,0.15)', color: 'var(--nova-purple-dark)',
                          padding: '3px 9px', borderRadius: 999, fontWeight: 500,
                        }}>{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); textareaRef.current?.focus() }}
                style={{
                  padding: '9px 16px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid var(--nova-border-soft)',
                  fontSize: 13, color: 'var(--nova-text)',
                  cursor: 'pointer',
                  transition: 'all .15s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >{s}</button>
            ))}
          </div>

          {/* Composer */}
          <div style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid var(--nova-border)',
            borderRadius: 18,
            padding: '6px 6px 6px 18px',
            display: 'flex', alignItems: 'flex-end', gap: 10,
            backdropFilter: 'blur(12px)',
          }}>
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask anything…"
              value={input}
              onChange={e => { setInput(e.target.value); autosize() }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
              style={{
                flex: 1, border: 'none', background: 'transparent', resize: 'none',
                fontFamily: 'inherit', fontSize: 15, color: 'var(--nova-text)',
                padding: '12px 0', maxHeight: 140, lineHeight: 1.5, outline: 'none',
              }}
            />
            <button
              onClick={submit}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #8A7DBC, #5A5080)',
                color: '#fff', border: 'none',
                display: 'grid', placeItems: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !loading ? 1 : 0.4,
                transition: 'all .2s ease',
                boxShadow: '0 4px 14px rgba(123,111,168,0.4)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="disclaimer" style={{ marginTop: 10, textAlign: 'center' }}>
            Novana is a wellness companion. Not medical advice. If something feels urgent, please call your doctor.
          </p>
        </div>

        {/* Context sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Context panel */}
          <div style={{
            background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)',
            borderRadius: 'var(--radius)', padding: 22,
          }}>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 14px' }}>
              What I&apos;m seeing
            </h4>
            {[
              { label: 'Cycle day', value: '8 of 28' },
              { label: 'Phase', value: 'Follicular' },
              { label: 'Mood (7d avg)', value: '6.2 / 10' },
              { label: 'Sleep (7d avg)', value: '5.4 / 10' },
              { label: 'Stress (7d avg)', value: '5.8 / 10' },
              { label: 'Movement', value: '4 of 7 days' },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                fontSize: 13,
                borderBottom: i < arr.length - 1 ? '1px solid var(--nova-border-soft)' : 'none',
              }}>
                <span style={{ color: 'var(--nova-muted)' }}>{row.label}</span>
                <span style={{ fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Insight capsule */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(160deg, #2D2538 0%, #4A3F66 60%, #6B5687 100%)',
            padding: '20px 22px',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff',
          }}>
            <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,139,0.35), transparent 70%)', top: -10, right: 20, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Today</span>
              <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 17, fontWeight: 400, margin: '6px 0 6px', color: '#fff' }}>Energy usually peaks now.</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>
                Days 8–11 of your cycle tend to feel lighter. Anything you&apos;ve been putting off may move easier today.
              </p>
              <p className="disclaimer" style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Educational only — not medical advice.</p>
            </div>
          </div>

          {/* Recent prompts */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(244,214,189,0.4), rgba(232,168,200,0.25))',
            border: '1px solid var(--nova-border-soft)',
            borderRadius: 'var(--radius)',
            padding: 22,
          }}>
            <h4 style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--nova-purple-dark)', fontWeight: 600, margin: '0 0 14px' }}>
              Recent prompts
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              {['"Why is my skin breaking out?"', '"What\'s a luteal phase mood?"', '"Help me write to my doctor"'].map(p => (
                <button
                  key={p}
                  onClick={() => { setInput(p.replace(/^"|"$/g, '')); textareaRef.current?.focus() }}
                  style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nova-muted)', fontSize: 13, padding: 0 }}
                >
                  ↻ {p}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
