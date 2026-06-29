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

import { POST } from '@/app/api/doctor-prep/route'

const VALID_QUESTIONS = {
  questions: [
    { q: 'Should I check my LH/FSH ratio?', why: 'Cycle irregularities noted across 3 months.' },
    { q: 'Could my fatigue be thyroid-related?', why: 'Consistently high fatigue scores.' },
    { q: 'Is late-luteal acne linked to androgens?', why: 'Acne clusters on days 18–22.' },
    { q: 'Should I have an AMH test?', why: 'Cycle length shortened over time.' },
    { q: 'What lifestyle changes have the best evidence?', why: 'User wants actionable guidance.' },
  ],
}

function makeSymptoms(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    logged_at: `2026-0${Math.floor(i / 30) + 3}-${String((i % 28) + 1).padStart(2, '0')}`,
    mood: 6, fatigue: 7, stress: 6, sleep_hours: 6.5,
    acne: 5, cramps: 4, exercise_mins: 20, cycle_status: 'none',
  }))
}

function req(body: object = {}) {
  return new NextRequest('http://localhost/api/doctor-prep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  mockOpenAI.mockResolvedValue({
    choices: [{ message: { content: JSON.stringify(VALID_QUESTIONS) } }],
  })
  const q = mockQuery({ data: makeSymptoms(10), error: null })
  mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
})

describe('POST /api/doctor-prep', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await POST(req())
    expect(res.status).toBe(401)
  })

  it('returns 422 if no symptom data exists', async () => {
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(req())
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.error).toBe('not_enough_data')
  })

  it('calls OpenAI when symptom data is available', async () => {
    await POST(req())
    expect(mockOpenAI).toHaveBeenCalledTimes(1)
  })

  it('returns 5 questions on success', async () => {
    const res = await POST(req())
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.questions).toHaveLength(5)
  })

  it('each question has q and why fields', async () => {
    const res = await POST(req())
    const json = await res.json()
    json.questions.forEach((q: { q: string; why: string }) => {
      expect(q).toHaveProperty('q')
      expect(q).toHaveProperty('why')
      expect(typeof q.q).toBe('string')
      expect(typeof q.why).toBe('string')
    })
  })

  it('uses 90-day window when windowTab is "Last 90 days"', async () => {
    const q = mockQuery({ data: makeSymptoms(30), error: null })
    const fromMock = jest.fn().mockReturnValue(q)
    mockCreateServerClient.mockReturnValue({ from: fromMock })
    await POST(req({ windowTab: 'Last 90 days' }))
    expect(mockOpenAI).toHaveBeenCalledTimes(1)
    const userMsg = mockOpenAI.mock.calls[0][0].messages[1].content as string
    expect(userMsg).toContain('90 days')
  })

  it('uses 30-day window when windowTab is "Last 30 days"', async () => {
    await POST(req({ windowTab: 'Last 30 days' }))
    const userMsg = mockOpenAI.mock.calls[0][0].messages[1].content as string
    expect(userMsg).toContain('30 days')
  })

  it('defaults to 90-day window when windowTab is absent', async () => {
    // Route defaults windowTab to "Last 90 days" → 90 days
    await POST(req({}))
    const userMsg = mockOpenAI.mock.calls[0][0].messages[1].content as string
    expect(userMsg).toContain('90 days')
  })

  it('includes symptom data in the OpenAI user message', async () => {
    await POST(req())
    const userMsg = mockOpenAI.mock.calls[0][0].messages[1].content as string
    expect(userMsg).toContain('mood')
    expect(userMsg).toContain('fatigue')
  })

  it('returns 500 when AI returns non-JSON', async () => {
    mockOpenAI.mockResolvedValue({
      choices: [{ message: { content: 'Here are your questions: ...' } }],
    })
    const res = await POST(req())
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.error).toContain('unexpected format')
  })

  it('handles AI response wrapped in markdown code fences', async () => {
    mockOpenAI.mockResolvedValue({
      choices: [{ message: { content: '```json\n' + JSON.stringify(VALID_QUESTIONS) + '\n```' } }],
    })
    const res = await POST(req())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.questions).toHaveLength(5)
  })

  it('returns 500 when OpenAI throws', async () => {
    mockOpenAI.mockRejectedValue(new Error('OpenAI timeout'))
    const res = await POST(req())
    expect(res.status).toBe(500)
  })

  it('system prompt instructs AI to ask exploration questions, not diagnose', async () => {
    await POST(req())
    const sysMsg = mockOpenAI.mock.calls[0][0].messages[0].content as string
    expect(sysMsg).toMatch(/should I check|phrased as exploration|not diagnos/i)
  })
})
