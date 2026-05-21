'use client'
import { useState } from 'react'

export default function WaitlistFooterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feature: 'launch' }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p style={{ fontSize: 13, color: '#5BC287', marginTop: 12 }}>✓ You&apos;re on the list</p>
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        style={{
          width: '100%', padding: '8px 12px', borderRadius: 999,
          border: '1px solid var(--nova-border-soft)',
          fontSize: 13, marginBottom: 8, boxSizing: 'border-box' as const,
          background: '#fff', outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          width: '100%', padding: '8px 12px', borderRadius: 999,
          background: 'var(--nova-purple)', color: '#fff',
          border: 'none', fontSize: 13, cursor: 'pointer',
          opacity: status === 'loading' ? 0.7 : 1,
        }}
      >
        {status === 'loading' ? 'Joining…' : 'Join the waitlist →'}
      </button>
      {status === 'error' && (
        <p style={{ fontSize: 12, color: 'var(--nova-rose)', marginTop: 6 }}>Something went wrong. Try again.</p>
      )}
    </form>
  )
}
