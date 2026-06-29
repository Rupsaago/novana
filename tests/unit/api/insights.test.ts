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
  openai: { chat: { completions: { create: (...args: unknown[]) => mockOpenAI(...args) } } },
}))

import { POST } from '@/app/api/insights/route'

const AI_RESPONSE = {
  choices: [{
    message: {
      content: JSON.stringify({
        summary: 'Your mood has been stable this week.',
        correlations: ['Sleep and mood correlate positively.'],
        suggestions: ['Keep logging daily for better patterns.'],
        disclaimer: 'Not medical advice.',
      }),
    },
  }],
}

function makePost() {
  return new NextRequest('http://localhost/api/insights', { method: 'POST' })
}

function makeSymptomsData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    logged_at: `2026-06-${String(i + 1).padStart(2, '0')}`,
    mood: 7, fatigue: 5, sleep_hours: 7, stress: 4,
    acne: 3, cramps: 2, exercise_mins: 30, cycle_status: 'none', notes: null,
  }))
}

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  mockOpenAI.mockResolvedValue(AI_RESPONSE)
})

describe('POST /api/insights', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await POST(makePost())
    expect(res.status).toBe(401)
  })

  it('returns 422 if fewer than 3 days logged', async () => {
    const q = mockQuery({ data: makeSymptomsData(2), error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(makePost())
    const json = await res.json()
    expect(res.status).toBe(422)
    expect(json.error).toBe('not_enough_data')
  })

  it('calls OpenAI when enough data exists', async () => {
    const q = mockQuery({ data: makeSymptomsData(5), error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    await POST(makePost())
    expect(mockOpenAI).toHaveBeenCalledTimes(1)
  })

  it('includes symptom data in OpenAI prompt', async () => {
    const symptoms = makeSymptomsData(5)
    const q = mockQuery({ data: symptoms, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    await POST(makePost())
    const callArg = mockOpenAI.mock.calls[0][0]
    // symptom context is injected into system message — check all messages for 'mood'
    const allContent = callArg.messages.map((m: { content: string }) => m.content).join(' ')
    expect(allContent).toMatch(/mood|fatigue|stress/i)
  })

  it('returns structured insight object', async () => {
    const q = mockQuery({ data: makeSymptomsData(5), error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(makePost())
    const json = await res.json()
    expect(json.insights).toHaveProperty('summary')
    expect(json.insights).toHaveProperty('correlations')
    expect(json.insights).toHaveProperty('suggestions')
    expect(json.insights).toHaveProperty('disclaimer')
  })

  it('includes "not medical advice" in disclaimer', async () => {
    const q = mockQuery({ data: makeSymptomsData(5), error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(makePost())
    const json = await res.json()
    expect(json.insights.disclaimer.toLowerCase()).toContain('not medical advice')
  })

  it('handles OpenAI timeout gracefully', async () => {
    mockOpenAI.mockRejectedValue(new Error('Connection timeout'))
    const q = mockQuery({ data: makeSymptomsData(5), error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(makePost())
    expect(res.status).toBe(500)
  })
})
