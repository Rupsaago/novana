'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { JournalRow } from '@/types/database'

const MOODS = [
  { label: 'Calm',       color: '#7B6FA8' },
  { label: 'Soft',       color: '#D28CA7' },
  { label: 'Hopeful',    color: '#E8A98B' },
  { label: 'Heavy',      color: '#6B5A95' },
  { label: 'Anxious',    color: '#B85A75' },
  { label: 'Tired',      color: '#8FA7C6' },
  { label: 'Reflective', color: '#A89ED0' },
  { label: 'Grateful',   color: '#5BC287' },
]

const TAGS = [
  { label: 'rest',         variant: 'default' },
  { label: 'cycle phase',  variant: 'peach'   },
  { label: 'family',       variant: 'default' },
  { label: 'stress',       variant: 'rose'    },
  { label: 'gratitude',    variant: 'sky'     },
  { label: 'sleep',        variant: 'default' },
  { label: 'movement',     variant: 'peach'   },
  { label: 'cramps',       variant: 'rose'    },
  { label: 'work',         variant: 'default' },
  { label: 'solitude',     variant: 'sky'     },
]

function getDayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function tagBg(variant: string, on: boolean) {
  if (!on) return { background: 'var(--nova-card)', borderColor: 'var(--nova-border-soft)', color: 'var(--nova-text)' }
  if (variant === 'peach') return { background: 'var(--nova-peach)', borderColor: 'var(--nova-peach)', color: '#fff' }
  if (variant === 'rose')  return { background: 'var(--nova-rose)',  borderColor: 'var(--nova-rose)',  color: '#fff' }
  if (variant === 'sky')   return { background: 'var(--nova-sky)',   borderColor: 'var(--nova-sky)',   color: '#fff' }
  return { background: 'var(--nova-purple)', borderColor: 'var(--nova-purple)', color: '#fff' }
}

export default function JournalPage() {
  const [entries, setEntries]         = useState<JournalRow[]>([])
  const [content, setContent]         = useState('')
  const [saving, setSaving]           = useState(false)
  const [loading, setLoading]         = useState(true)
  const [summarising, setSummarising] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState('Soft')
  const [activeTags, setActiveTags]   = useState<Set<string>>(new Set(['rest', 'cycle phase', 'gratitude']))

  useEffect(() => {
    fetch('/api/journal')
      .then((r) => r.json())
      .then((j) => { if (j.data) setEntries(j.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const draft = localStorage.getItem('journal_draft')
    if (draft) setContent(draft)
  }, [])

  async function handleSave() {
    if (!content.trim()) return
    setSaving(true); setError(null)
    try {
      const res  = await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to save.'); return }
      setEntries((prev) => [json.data, ...prev])
      setContent('')
      localStorage.removeItem('journal_draft')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch { setError('Network error. Please try again.') }
    finally { setSaving(false) }
  }

  async function handleSummarise(entryId: string, entryContent: string) {
    setSummarising(entryId)
    try {
      const res  = await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'summarise', content: entryContent, entryId }) })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Failed to summarise.'); return }
      setEntries((prev) => prev.map((e) => e.id === entryId ? { ...e, ai_summary: json.summary } : e))
    } catch { setError('Failed to summarise. Please try again.') }
    finally { setSummarising(null) }
  }

  function toggleTag(tag: string) {
    setActiveTags((prev) => { const n = new Set(prev); n.has(tag) ? n.delete(tag) : n.add(tag); return n })
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl">Journal ✦</h1>
          <p className="text-nova-muted mt-1 text-sm">A no-pressure place to put words to a day.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 22, alignItems: 'start' }}>

          {/* Writing card */}
          <section style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--nova-card-2)', border: '1px solid var(--nova-border-soft)', boxShadow: 'var(--shadow)' }}>
            <div className="grain" style={{ padding: '24px 28px', background: 'linear-gradient(160deg, #F2E6DD 0%, #E8C8D0 50%, #E8A98B 100%)' }}>
              <div style={{ fontSize: 12, color: 'rgba(47,42,40,0.65)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{getDayLabel()}</div>
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 400, margin: '6px 0 0' }}>
                How is your <em style={{ fontStyle: 'italic' }}>heart</em> today?
              </h2>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {error && <div style={{ background: 'rgba(210,140,167,0.12)', border: '1px solid rgba(210,140,167,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: 'var(--nova-rose)', marginBottom: 16 }}>{error}</div>}
              {saveSuccess && <div style={{ background: 'rgba(91,194,135,0.12)', border: '1px solid rgba(91,194,135,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#3A8C60', marginBottom: 16 }}>Entry saved ✿</div>}

              <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Mood</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                {MOODS.map((m) => (
                  <button key={m.label} onClick={() => setSelectedMood(m.label)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 999,
                    background: selectedMood === m.label ? m.color : '#fff',
                    border: `1px solid ${selectedMood === m.label ? m.color : 'var(--nova-border-soft)'}`,
                    color: selectedMood === m.label ? '#fff' : 'var(--nova-text)',
                    fontSize: 13, cursor: 'pointer', transition: 'all .15s ease',
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedMood === m.label ? 'rgba(255,255,255,0.6)' : m.color, flexShrink: 0 }} />
                    {m.label}
                  </button>
                ))}
              </div>

              <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>Your words</span>
              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value); setError(null) }}
                placeholder="A few lines is plenty. What was true for today? What is your body asking for tonight?"
                style={{
                  width: '100%', minHeight: 280, border: '1px solid var(--nova-border-soft)',
                  borderRadius: 18, padding: 22, background: '#fff',
                  fontFamily: 'var(--font-fraunces), Georgia, serif',
                  fontSize: 18, lineHeight: 1.7, color: 'var(--nova-text)',
                  resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                }}
                maxLength={5000}
              />

              <span style={{ fontSize: 12, color: 'var(--nova-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '18px 0 10px', display: 'block' }}>Emotion + context tags</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TAGS.map((t) => {
                  const on = activeTags.has(t.label)
                  const styles = tagBg(t.variant, on)
                  return (
                    <button key={t.label} onClick={() => toggleTag(t.label)} style={{
                      padding: '6px 12px', borderRadius: 999,
                      border: `1px solid ${styles.borderColor}`,
                      background: styles.background, color: styles.color,
                      fontSize: 12, cursor: 'pointer',
                    }}>{t.label}</button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--nova-muted)' }}>{wordCount} words{saveSuccess ? ' · saved just now' : ''}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-soft" style={{ fontSize: 13 }} onClick={() => { if (content.trim()) localStorage.setItem('journal_draft', content) }}>Save as draft</button>
                  <button onClick={handleSave} disabled={saving || !content.trim()} className="btn-primary" style={{ opacity: (saving || !content.trim()) ? 0.6 : 1 }}>
                    {saving ? 'Saving…' : '✓ Save entry'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* AI emotional summary */}
            <div className="grain relative" style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              background: 'linear-gradient(160deg, #2D2538 0%, #4A3F66 60%, #7B6FA8 100%)',
              color: '#fff', padding: 24,
            }}>
              <div style={{ position: 'absolute', right: -80, top: -80, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,169,139,0.5) 0%, transparent 70%)', filter: 'blur(18px)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
                <span style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.20)', padding: '4px 12px', borderRadius: 999, fontSize: 11, backdropFilter: 'blur(8px)' }}>
                  ✦ AI emotional summary
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Last 7 entries</span>
              </div>
              <h3 className="font-display" style={{ color: '#fff', fontSize: 22, fontWeight: 400, margin: '14px 0 10px', lineHeight: 1.3, position: 'relative', zIndex: 1 }}>
                A softer week, with warmth at the edges.
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px', position: 'relative', zIndex: 1 }}>
                Your entries this week carried recurring threads of <em style={{ background: 'rgba(232,169,139,0.32)', padding: '1px 4px', borderRadius: 4, fontStyle: 'normal' }}>rest</em>,{' '}
                <em style={{ background: 'rgba(232,169,139,0.32)', padding: '1px 4px', borderRadius: 4, fontStyle: 'normal' }}>gratitude</em>, and family.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 1.6, margin: '0 0 12px', position: 'relative', zIndex: 1 }}>
                Tonight&apos;s entry leans toward <em style={{ background: 'rgba(232,169,139,0.32)', padding: '1px 4px', borderRadius: 4, fontStyle: 'normal' }}>soft and hopeful</em> — a tone Novana has seen most on follicular-phase evenings.
              </p>
              <Link href="/insights" style={{ marginTop: 8, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', padding: '8px 14px', borderRadius: 999, fontSize: 13, cursor: 'pointer', position: 'relative', zIndex: 1, textDecoration: 'none', display: 'inline-block' }}>
                View full insights →
              </Link>
              <div style={{ marginTop: 14, fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Educational — not medical advice.</div>
            </div>

            {/* Quick stats */}
            <div className="card" style={{ padding: 22 }}>
              <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, margin: '0 0 14px' }}>This month</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { lbl: 'Entries', val: String(entries.length || 14) },
                  { lbl: 'Words', val: '2,148' },
                  { lbl: 'Most-used mood', val: 'Soft · 5×' },
                  { lbl: 'Streak', val: '3 days' },
                ].map((s) => (
                  <div key={s.lbl}>
                    <div style={{ fontSize: 11, color: 'var(--nova-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.lbl}</div>
                    <div className="font-display" style={{ fontSize: s.lbl === 'Most-used mood' ? 18 : 28, fontWeight: 400, marginTop: 4 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent entries timeline */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, margin: 0 }}>Recent entries</h3>
                <span style={{ fontSize: 12, color: 'var(--nova-muted)' }}>All →</span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1,2].map((i) => <div key={i} style={{ height: 80, borderRadius: 18, background: 'var(--nova-card)' }} />)}
                </div>
              ) : entries.length === 0 ? (
                <>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontStyle: 'italic', color: 'var(--nova-muted)', fontSize: 14, padding: '8px 4px 6px' }}>This week</div>
                  {[
                    { date: 'Sat · May 24', dots: ['#E8A98B','#7B6FA8'], title: 'Quiet morning, golden walk.', preview: 'Slept better than I expected. The garden was full of those tiny yellow flowers…', meta: 'tired · grateful · 184 words' },
                    { date: 'Thu · May 22', dots: ['#D28CA7'], title: 'A late and anxious one.', preview: 'Couldn\'t sleep, kept thinking about Tuesday\'s meeting. Tea didn\'t really help…', meta: 'anxious · work · 92 words' },
                  ].map((e) => (
                    <div key={e.date} style={{ borderRadius: 18, background: '#fff', border: '1px solid var(--nova-border-soft)', padding: 18, marginBottom: 10, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{e.date}</span>
                        <span style={{ display: 'flex', gap: 6 }}>{e.dots.map((c,i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />)}</span>
                      </div>
                      <h4 className="font-display" style={{ fontSize: 16, fontWeight: 400, margin: '0 0 6px' }}>{e.title}</h4>
                      <p style={{ fontSize: 13, color: 'var(--nova-muted)', lineHeight: 1.5, margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{e.preview}</p>
                      <div style={{ fontSize: 11, color: 'var(--nova-muted)' }}>{e.meta}</div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {entries.slice(0, 4).map((e) => {
                    const d = new Date(e.created_at)
                    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                    const preview = e.content.slice(0, 100)
                    return (
                      <div key={e.id} style={{ borderRadius: 18, background: '#fff', border: '1px solid var(--nova-border-soft)', padding: 18, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--nova-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{dateStr}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--nova-muted)', lineHeight: 1.5, margin: 0 }}>{preview}{e.content.length > 100 ? '…' : ''}</p>
                        {!e.ai_summary && (
                          <button onClick={() => handleSummarise(e.id, e.content)} disabled={summarising === e.id} style={{ marginTop: 8, fontSize: 11, color: 'var(--nova-purple)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            {summarising === e.id ? 'Summarising…' : '✦ Summarise with AI'}
                          </button>
                        )}
                        {e.ai_summary && (
                          <div style={{ marginTop: 8, background: 'rgba(123,111,168,0.08)', border: '1px solid rgba(123,111,168,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: 'var(--nova-muted)' }}>
                            <strong style={{ color: 'var(--nova-purple)' }}>✨ AI: </strong>{e.ai_summary}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>

        <p className="disclaimer" style={{ textAlign: 'center', marginTop: 36 }}>Your entries are encrypted and private. Novana is a wellness tool, not medical advice.</p>
      </div>
    </>
  )
}
