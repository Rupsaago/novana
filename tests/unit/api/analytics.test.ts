/** @jest-environment node */
import { NextRequest } from 'next/server'
import { TEST_SESSION, mockQuery } from '../helpers/supabase-mock'

const mockGetSession         = jest.fn()
const mockCreateServerClient = jest.fn()

jest.mock('@/lib/supabase-server', () => ({
  getSession:                () => mockGetSession(),
  createServerClientInstance: () => mockCreateServerClient(),
}))

import { GET } from '@/app/api/analytics/route'

const TODAY = '2026-06-29'

function req(search = '') {
  return new NextRequest(`http://localhost/api/analytics${search}`)
}

const SYMPTOMS = [
  { logged_at: '2026-06-27', mood: 7, fatigue: 5, sleep_hours: 7.5, stress: 4, acne: 3, cramps: 2, exercise_mins: 30, cycle_status: 'none' },
  { logged_at: '2026-06-28', mood: 6, fatigue: 6, sleep_hours: 6.0, stress: 5, acne: 4, cramps: 3, exercise_mins: 0,  cycle_status: 'none' },
  { logged_at: '2026-06-29', mood: 8, fatigue: 4, sleep_hours: 8.0, stress: 3, acne: 2, cramps: 1, exercise_mins: 45, cycle_status: 'none' },
]

beforeEach(() => {
  mockGetSession.mockResolvedValue(TEST_SESSION)
  const q = mockQuery({ data: SYMPTOMS, error: null })
  mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
})

describe('GET /api/analytics', () => {
  it('returns 401 if not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET(req(`?days=7&today=${TODAY}`))
    expect(res.status).toBe(401)
  })

  it('returns chartData and averages', async () => {
    const res = await GET(req(`?days=7&today=${TODAY}`))
    const json = await res.json()
    expect(json).toHaveProperty('chartData')
    expect(json).toHaveProperty('averages')
    expect(json).toHaveProperty('totalDays')
  })

  it('chartData has a date label for each entry', async () => {
    const res = await GET(req(`?days=7&today=${TODAY}`))
    const json = await res.json()
    expect(json.chartData[0]).toHaveProperty('date')
    expect(typeof json.chartData[0].date).toBe('string')
  })

  it('returns empty chartData for new users with no symptoms', async () => {
    const q = mockQuery({ data: [], error: null })
    mockCreateServerClient.mockReturnValue({ from: jest.fn().mockReturnValue(q) })
    const res = await GET(req(`?days=7&today=${TODAY}`))
    const json = await res.json()
    expect(json.chartData).toEqual([])
    expect(json.totalDays).toBe(0)
  })

  it('calculates correct averages', async () => {
    const res = await GET(req(`?days=7&today=${TODAY}`))
    const json = await res.json()
    // avg mood = (7+6+8)/3 = 7.0
    expect(json.averages.mood).toBeCloseTo(7.0, 1)
  })

  it('respects the days parameter by using today param', async () => {
    // When today is provided the route uses it as reference date
    const res = await GET(req(`?days=30&today=${TODAY}`))
    expect(res.status).toBe(200)
  })

  it('falls back to UTC when today param is absent', async () => {
    // Should still work — just uses server UTC date
    const res = await GET(req('?days=7'))
    expect(res.status).toBe(200)
  })
})
