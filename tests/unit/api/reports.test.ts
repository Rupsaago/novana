/** @jest-environment node */
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

import { GET, POST } from '@/app/api/reports/route'

const SUMMARY_TEXT = 'This month you showed up consistently. Your mood averaged 6.4 and fatigue stayed steady. Sleep was the lever that moved everything else. Not medical advice.'

function makeSymptoms(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    logged_at:    `2026-06-${String(i + 1).padStart(2, '0')}`,
    mood:         7,
    fatigue:      5,
    stress:       4,
    sleep_hours:  7.5,
    acne:         3,
    cramps:       2,
    exercise_mins: 30,
    cycle_status: 'none',
  }))
}

const SAVED_REPORT = {
  id: 'report-1',
  user_id: TEST_SESSION.user.id,
  month: '2026-06',
  summary_text: SUMMARY_TEXT,
  averages_json: { avg_mood: 7, avg_fatigue: 5, avg_stress: 4, avg_sleep: 7.5, days_logged: 10 },
  created_at: '2026-06-29T10:00:00Z',
}

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  mockOpenAI.mockResolvedValue({
    choices: [{ message: { content: SUMMARY_TEXT } }],
  })
})

// ── Helper: sets up from() to return different results per call ──────────────
function setupClient(symptomsData: unknown[], summariesData: unknown[] = []) {
  const symptomsQ  = mockQuery({ data: symptomsData,  error: null })
  const summariesQ = mockQuery({ data: summariesData, error: null })
  const fromMock   = jest.fn()
    .mockReturnValueOnce(symptomsQ)   // symptoms query
    .mockReturnValueOnce(summariesQ)  // monthly_summaries upsert
  mockCreateServerClient.mockReturnValue({ from: fromMock })
}

// ── GET tests ────────────────────────────────────────────────────────────────
describe('GET /api/reports', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns list of saved summaries', async () => {
    const q = mockQuery({ data: [SAVED_REPORT], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].month).toBe('2026-06')
  })

  it('returns empty array for new users with no reports', async () => {
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns empty array if monthly_summaries table does not exist (42P01)', async () => {
    const q = mockQuery({ data: null, error: { code: '42P01', message: 'relation does not exist' } })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data).toEqual([])
  })

  it('returns empty array on unexpected database error (graceful degradation)', async () => {
    const q = mockQuery({ data: null, error: { code: '500', message: 'connection error' } })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET()
    const json = await res.json()
    // Route catches errors and returns empty data
    expect(json.data).toEqual([])
  })
})

// ── POST tests ───────────────────────────────────────────────────────────────
describe('POST /api/reports', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST()
    expect(res.status).toBe(401)
  })

  it('returns 422 if no symptoms exist', async () => {
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST()
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.error).toBe('not_enough_data')
  })

  it('calls OpenAI when symptoms are available', async () => {
    setupClient(makeSymptoms(10))
    await POST()
    expect(mockOpenAI).toHaveBeenCalledTimes(1)
  })

  it('returns summary_text, month, and averages', async () => {
    setupClient(makeSymptoms(10))
    const res = await POST()
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toHaveProperty('summary_text')
    expect(json).toHaveProperty('month')
    expect(json).toHaveProperty('averages')
  })

  it('summary_text comes from OpenAI response', async () => {
    setupClient(makeSymptoms(10))
    const res = await POST()
    const json = await res.json()
    expect(json.summary_text).toBe(SUMMARY_TEXT)
  })

  it('averages include mood, fatigue, stress, sleep, days_logged', async () => {
    setupClient(makeSymptoms(10))
    const res = await POST()
    const json = await res.json()
    expect(json.averages).toHaveProperty('avg_mood')
    expect(json.averages).toHaveProperty('avg_fatigue')
    expect(json.averages).toHaveProperty('avg_stress')
    expect(json.averages).toHaveProperty('avg_sleep')
    expect(json.averages).toHaveProperty('days_logged')
  })

  it('calculates correct averages from symptom data', async () => {
    // All symptoms have mood=7, fatigue=5
    setupClient(makeSymptoms(5))
    const res = await POST()
    const json = await res.json()
    expect(json.averages.avg_mood).toBe(7)
    expect(json.averages.avg_fatigue).toBe(5)
    expect(json.averages.days_logged).toBe(5)
  })

  it('month field is in YYYY-MM format', async () => {
    setupClient(makeSymptoms(5))
    const res = await POST()
    const json = await res.json()
    expect(json.month).toMatch(/^\d{4}-\d{2}$/)
  })

  it('includes symptom data in OpenAI user message', async () => {
    setupClient(makeSymptoms(5))
    await POST()
    const userMsg = mockOpenAI.mock.calls[0][0].messages[1].content as string
    expect(userMsg).toContain('mood')
    expect(userMsg).toContain('30 days')
  })

  it('system prompt instructs warm letter style and no diagnosis', async () => {
    setupClient(makeSymptoms(5))
    await POST()
    const sysMsg = mockOpenAI.mock.calls[0][0].messages[0].content as string
    expect(sysMsg).toMatch(/warm|letter|never diagnos/i)
  })

  it('still returns 200 even if saving to monthly_summaries fails', async () => {
    // The route catches upsert errors silently
    const symptomsQ = mockQuery({ data: makeSymptoms(5), error: null })
    const failQ     = mockQuery({ data: null, error: { code: '42P01', message: 'table missing' } })
    const fromMock  = jest.fn()
      .mockReturnValueOnce(symptomsQ)
      .mockReturnValueOnce(failQ)
    mockCreateServerClient.mockReturnValue({ from: fromMock })
    const res = await POST()
    // Route should still return the generated summary even if saving failed
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.summary_text).toBe(SUMMARY_TEXT)
  })

  it('returns 500 when OpenAI throws', async () => {
    mockOpenAI.mockRejectedValue(new Error('OpenAI timeout'))
    setupClient(makeSymptoms(5))
    const res = await POST()
    expect(res.status).toBe(500)
  })
})
