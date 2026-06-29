/** @jest-environment node */
import { NextRequest } from 'next/server'
import { TEST_SESSION, mockQuery } from '../helpers/supabase-mock'

const mockGetSession         = jest.fn()
const mockCreateServerClient = jest.fn()
const mockOpenAI             = jest.fn()

jest.mock('@/lib/supabase-server', () => ({
  getSession:                () => mockGetSession(),
  createServerClientInstance: () => mockCreateServerClient(),
}))
jest.mock('@/lib/openai', () => ({
  openai: { chat: { completions: { create: (...a: unknown[]) => mockOpenAI(...a) } } },
}))

import { GET, POST } from '@/app/api/journal/route'

const ENTRY = { id: 'entry-1', user_id: TEST_SESSION.user.id, content: 'Felt tired today but grateful.', ai_summary: null, created_at: '2026-06-29T10:00:00Z' }

function req(method: string, body?: object) {
  return new NextRequest('http://localhost/api/journal', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  mockOpenAI.mockResolvedValue({ choices: [{ message: { content: 'A soft, reflective week.' } }] })
})

describe('GET /api/journal', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns only the current user\'s journal entries', async () => {
    const q = mockQuery({ data: [ENTRY], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data[0].user_id).toBe(TEST_SESSION.user.id)
  })
})

describe('POST /api/journal — save entry', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await POST(req('POST', { content: 'Hello' }))
    expect(res.status).toBe(401)
  })

  it('saves new entry with correct user_id', async () => {
    const q = mockQuery({ data: ENTRY, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(req('POST', { content: 'Felt tired today but grateful.' }))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data.user_id).toBe(TEST_SESSION.user.id)
  })

  it('rejects empty content', async () => {
    const res = await POST(req('POST', { content: '' }))
    expect(res.status).toBe(400)
  })

  it('rejects content over 5000 characters', async () => {
    const res = await POST(req('POST', { content: 'x'.repeat(5001) }))
    expect(res.status).toBe(400)
  })
})

describe('POST /api/journal — summarise', () => {
  it('calls OpenAI for summarise action', async () => {
    const q = mockQuery({ data: null, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    await POST(req('POST', { action: 'summarise', content: ENTRY.content.repeat(3) }))
    expect(mockOpenAI).toHaveBeenCalledTimes(1)
  })

  it('returns summary text', async () => {
    const q = mockQuery({ data: null, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(req('POST', { action: 'summarise', content: ENTRY.content.repeat(3) }))
    const json = await res.json()
    expect(json.summary).toBe('A soft, reflective week.')
  })

  it('rejects content too short to summarise', async () => {
    const res = await POST(req('POST', { action: 'summarise', content: 'hi' }))
    expect(res.status).toBe(400)
  })
})
