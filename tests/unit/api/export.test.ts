/** @jest-environment node */
import { TEST_SESSION, mockQuery } from '../helpers/supabase-mock'

const mockGetSession         = jest.fn()
const mockCreateServerClient = jest.fn()

jest.mock('@/lib/supabase-server', () => ({
  getSession:                () => mockGetSession(),
  createServerClientInstance: () => mockCreateServerClient(),
}))

import { GET } from '@/app/api/export/route'

const SYMPTOMS = [
  { id: '1', user_id: TEST_SESSION.user.id, logged_at: '2026-06-29', mood: 7, fatigue: 5, sleep_hours: 7, stress: 4, acne: 3, cramps: 2, exercise_mins: 30, cycle_status: 'none', notes: null },
]
const JOURNAL_ENTRIES = [
  { id: '1', user_id: TEST_SESSION.user.id, content: 'Felt good today.', ai_summary: null, created_at: '2026-06-29T10:00:00Z' },
]

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  const symptomsQ = mockQuery({ data: SYMPTOMS,       error: null })
  const journalQ  = mockQuery({ data: JOURNAL_ENTRIES, error: null })
  const fromMock  = jest.fn()
    .mockReturnValueOnce(symptomsQ)
    .mockReturnValueOnce(journalQ)
  mockCreateServerClient.mockReturnValue({ from: fromMock })
})

describe('GET /api/export', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns all user symptoms', async () => {
    const res = await GET()
    const json = await res.json()
    expect(json).toHaveProperty('symptoms')
    expect(json.symptoms).toHaveLength(1)
    expect(json.symptoms[0].user_id).toBe(TEST_SESSION.user.id)
  })

  it('returns all user journal entries', async () => {
    const res = await GET()
    const json = await res.json()
    expect(json).toHaveProperty('journal_entries')
    expect(json.journal_entries).toHaveLength(1)
  })

  it('sets Content-Disposition header for file download', async () => {
    const res = await GET()
    const disposition = res.headers.get('Content-Disposition')
    expect(disposition).toContain('attachment')
    expect(disposition).toContain('.json')
  })

  it('returns empty arrays for new users', async () => {
    const emptyQ   = mockQuery({ data: [], error: null })
    const fromMock = jest.fn().mockReturnValue(emptyQ)
    mockCreateServerClient.mockReturnValue({ from: fromMock })
    const res = await GET()
    const json = await res.json()
    expect(json.symptoms).toEqual([])
    expect(json.journal_entries).toEqual([])
  })
})
