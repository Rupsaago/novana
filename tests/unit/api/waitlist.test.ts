/** @jest-environment node */
import { NextRequest } from 'next/server'
import { mockQuery } from '../helpers/supabase-mock'

const mockCreateServerClient = jest.fn()
const mockResendSend         = jest.fn()

jest.mock('@/lib/supabase-server', () => ({
  getSession:                () => Promise.resolve(null),
  createServerClientInstance: () => mockCreateServerClient(),
}))
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: (...a: unknown[]) => mockResendSend(...a) },
  })),
}))

import { POST } from '@/app/api/waitlist/route'

function req(body: object) {
  return new NextRequest('http://localhost/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  const q = mockQuery({ data: { id: 'wl-1' }, error: null })
  mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
  mockResendSend.mockResolvedValue({ data: { id: 'email-1' } })
})

describe('POST /api/waitlist', () => {
  it('saves email and feature to the database', async () => {
    const res = await POST(req({ email: 'user@example.com', feature: 'Circle Community' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('rejects missing email', async () => {
    const res = await POST(req({ feature: 'Circle Community' }))
    expect(res.status).toBe(400)
  })

  it('rejects missing feature', async () => {
    const res = await POST(req({ email: 'user@example.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 409 with friendly message for duplicate email + feature', async () => {
    const q = mockQuery({ data: null, error: { code: '23505', message: 'unique violation' } })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(req({ email: 'user@example.com', feature: 'Circle Community' }))
    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.error).toBe('already_on_list')
  })

  it('sends confirmation email after successful save', async () => {
    await POST(req({ email: 'user@example.com', feature: 'Premium' }))
    expect(mockResendSend).toHaveBeenCalledTimes(1)
    const call = mockResendSend.mock.calls[0][0]
    expect(call.to).toBe('user@example.com')
    expect(call.subject).toContain('list')
  })

  it('still returns success even if Resend email fails', async () => {
    mockResendSend.mockRejectedValue(new Error('SMTP error'))
    const res = await POST(req({ email: 'user@example.com', feature: 'Premium' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })
})
