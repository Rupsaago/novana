// src/app/api/analytics/route.ts
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/analytics
// Returns the last N days of symptom data formatted for Recharts.
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse }              from 'next/server'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') ?? '30', 10)

    const supabase = createServerClientInstance()

    // Fetch symptoms oldest-first so charts read left→right chronologically
    const { data: symptoms, error } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('logged_at', getDateDaysAgo(days))
      .order('logged_at', { ascending: true })

    if (error) throw error

    console.log('[GET /api/analytics]', {
      userId: session.user.id,
      days,
      dateFrom: getDateDaysAgo(days),
      rowCount: symptoms?.length ?? 0,
      sample: symptoms?.[0] ?? null,
    })

    // Format dates to short readable labels e.g. "May 13"
    const chartData = (symptoms ?? []).map((s) => ({
      ...s,
      date: new Date(s.logged_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
      }),
    }))

    // Calculate overall averages for the summary cards
    const avg = (key: string) => {
      const vals = chartData.map((s) => Number((s as Record<string, unknown>)[key])).filter((v) => !isNaN(v))
      return vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : null
    }

    const averages = {
      mood:          avg('mood'),
      fatigue:       avg('fatigue'),
      sleep_hours:   avg('sleep_hours'),
      stress:        avg('stress'),
      acne:          avg('acne'),
      cramps:        avg('cramps'),
      exercise_mins: avg('exercise_mins'),
    }

    return NextResponse.json({ chartData, averages, totalDays: chartData.length })

  } catch (err) {
    console.error('[GET /api/analytics]', err)
    return NextResponse.json({ error: 'Failed to fetch analytics.' }, { status: 500 })
  }
}

function getDateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}
