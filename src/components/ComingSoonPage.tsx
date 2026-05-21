'use client'
import { useState } from 'react'

interface Props {
  title: string
  feature: string
  description?: string
}

export default function ComingSoonPage({ title, feature, description }: Props) {
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), feature }),
      })
      setSubmitted(true)
    } catch { /* silently fail */ }
    setLoading(false)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '48px 24px',
    }}>
      <span className="chip" style={{ marginBottom: 20 }}>
        <i className="dot" style={{ background: 'var(--nova-peach)' }} /> Coming soon
      </span>
      <h1 className="font-display" style={{ fontSize: 'clamp(36px,4vw,56px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.025em' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--nova-muted)', fontSize: 17, maxWidth: '48ch', lineHeight: 1.6, margin: '0 0 36px' }}>
        {description ?? "We’re building something special here."}
      </p>
      {submitted ? (
        <div style={{ background: 'rgba(91,194,135,0.12)', border: '1px solid rgba(91,194,135,0.3)', borderRadius: 18, padding: '14px 28px', color: '#3A8C60', fontSize: 15 }}>
          You&apos;re on the list ✿ We&apos;ll reach out when it&apos;s ready.
        </div>
      ) : (
        <form onSubmit={handleJoin} style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="form-input"
            style={{ maxWidth: 280, minWidth: 220 }}
            required
          />
          <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Joining…' : 'Notify me →'}
          </button>
        </form>
      )}
      <p className="disclaimer" style={{ marginTop: 32 }}>Novana is a wellness tool, not a medical service.</p>
    </div>
  )
}
