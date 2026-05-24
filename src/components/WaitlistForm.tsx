'use client'
import { useState } from 'react'

interface Props {
  feature: string
}

export default function WaitlistForm({ feature }: Props) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'already' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), feature }),
      })
      if (res.status === 409) { setStatus('already'); return }
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{
        background: 'rgba(91,194,135,0.10)', border: '1px solid rgba(91,194,135,0.3)',
        borderRadius: 16, padding: '14px 22px', textAlign: 'center',
        color: '#3A8C60', fontSize: 15, lineHeight: 1.5,
      }}>
        You&apos;re on the list! We&apos;ll be in touch. ✦
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div style={{
        background: 'rgba(123,111,168,0.10)', border: '1px solid rgba(123,111,168,0.25)',
        borderRadius: 16, padding: '14px 22px', textAlign: 'center',
        color: 'var(--nova-purple-dark)', fontSize: 15,
      }}>
        You&apos;re already on the list!
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
      <p style={{ fontSize: 14, color: 'var(--nova-muted)', lineHeight: 1.6, margin: 0 }}>
        Add your email to the waitlist to be considered for early beta access when this feature launches.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          style={{
            width: '100%', padding: '11px 16px', borderRadius: 999,
            border: '1px solid var(--nova-border)', fontSize: 14,
            background: 'rgba(255,255,255,0.8)', outline: 'none',
            color: 'var(--nova-text)', boxSizing: 'border-box' as const,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            padding: '11px 22px', borderRadius: 999,
            background: status === 'loading'
              ? 'rgba(123,111,168,0.5)'
              : 'linear-gradient(135deg, #8A7DBC 0%, #7B6FA8 55%, #6B5A95 100%)',
            color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'opacity .2s',
          }}
        >
          {status === 'loading' ? 'Joining…' : 'Join waitlist'}
        </button>
        {status === 'error' && (
          <p style={{ fontSize: 13, color: 'var(--nova-rose)', margin: 0, textAlign: 'center' }}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  )
}
