'use client'
import WaitlistForm from '@/components/WaitlistForm'

interface Props {
  title: string
  feature: string
  description?: string
}

export default function ComingSoonPage({ title, feature, description }: Props) {
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
        {description ?? "We're building something special here."}
      </p>
      <WaitlistForm feature={feature} />
      <p className="disclaimer" style={{ marginTop: 32 }}>Novana is a wellness tool, not a medical service.</p>
    </div>
  )
}
