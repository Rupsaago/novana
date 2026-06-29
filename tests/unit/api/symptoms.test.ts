/** @jest-environment node */
import { NextRequest } from 'next/server'
import { TEST_SESSION, mockQuery } from '../helpers/supabase-mock'

const mockGetSession            = jest.fn()
const mockCreateServerClient    = jest.fn()

jest.mock('@/lib/supabase-server', () => ({
  getSession:                () => mockGetSession(),
  createServerClientInstance: () => mockCreateServerClient(),
}))

// Import after mocks are set up
import { GET, POST } from '@/app/api/symptoms/route'

const TODAY = '2026-06-29'

function makeRequest(method: string, body?: object, search = '') {
  return new NextRequest(`http://localhost/api/symptoms${search}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

const VALID_BODY = {
  logged_at:     TODAY,
  mood:          7,
  fatigue:       5,
  sleep_hours:   7,
  stress:        4,
  acne:          3,
  cramps:        2,
  exercise_mins: 30,
  cycle_status:  'none',
}

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  const q = mockQuery({ data: [{ id: '1', ...VALID_BODY, user_id: TEST_SESSION.user.id }], error: null })
  mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
})

describe('GET /api/symptoms', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET(makeRequest('GET', undefined, '?days=7'))
    expect(res.status).toBe(401)
  })

  it('returns only current user\'s symptoms', async () => {
    const res = await GET(makeRequest('GET', undefined, `?days=7&today=${TODAY}`))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toHaveProperty('data')
    expect(json).toHaveProperty('count')
  })

  it('returns empty array for new users with no symptoms', async () => {
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET(makeRequest('GET', undefined, `?days=7&today=${TODAY}`))
    const json = await res.json()
    expect(json.data).toEqual([])
    expect(json.count).toBe(0)
  })

  it('passes today param to date range calculation', async () => {
    const res = await GET(makeRequest('GET', undefined, `?days=30&today=${TODAY}`))
    expect(res.status).toBe(200)
  })
})

describe('POST /api/symptoms', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await POST(makeRequest('POST', VALID_BODY))
    expect(res.status).toBe(401)
  })

  it('saves symptom entry with correct user_id', async () => {
    const saved = { ...VALID_BODY, user_id: TEST_SESSION.user.id, id: 'new-id' }
    const q = mockQuery({ data: saved, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(makeRequest('POST', VALID_BODY))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data.user_id).toBe(TEST_SESSION.user.id)
  })

  it('uses client-provided logged_at date', async () => {
    const q = mockQuery({ data: { ...VALID_BODY, user_id: TEST_SESSION.user.id, logged_at: TODAY }, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await POST(makeRequest('POST', { ...VALID_BODY, logged_at: TODAY }))
    expect(res.status).toBe(200)
  })

  it('rejects mood out of range', async () => {
    const res = await POST(makeRequest('POST', { ...VALID_BODY, mood: 11 }))
    expect(res.status).toBe(400)
  })

  it('rejects invalid cycle_status', async () => {
    const res = await POST(makeRequest('POST', { ...VALID_BODY, cycle_status: 'invalid' }))
    expect(res.status).toBe(400)
  })

  it('upserts correctly (returns saved data)', async () => {
    const q = mockQuery({ data: { id: 'existing', ...VALID_BODY, user_id: TEST_SESSION.user.id }, error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res1 = await POST(makeRequest('POST', VALID_BODY))
    const res2 = await POST(makeRequest('POST', { ...VALID_BODY, mood: 8 }))
    expect(res1.status).toBe(200)
    expect(res2.status).toBe(200)
  })
})
