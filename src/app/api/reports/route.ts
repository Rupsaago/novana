import { NextResponse }                          from 'next/server'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import { openai }                                 from '@/lib/openai'
import type { SupabaseClient }                    from '@supabase/supabase-js'

// monthly_summaries table is created via supabase/monthly_summaries.sql migration.
// We use 'any' table access here since the table isn't in the typed Database schema.
function monthlySummaries(supabase: SupabaseClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase as any).from('monthly_summaries')
}

// GET /api/reports — list saved monthly summaries
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const supabase = createServerClientInstance()
    const { data, error } = await monthlySummaries(supabase)
      .select('*')
      .eq('user_id', session.user.id)
      .order('month', { ascending: false })
      .limit(12)

    if (error) {
      if (error.code === '42P01') return NextResponse.json({ data: [] })
      throw error
    }

    return NextResponse.json({ data: data ?? [] })

  } catch (err) {
    console.error('[GET /api/reports]', err)
    return NextResponse.json({ data: [] })
  }
}

// POST /api/reports — generate a new monthly summary via OpenAI
export async function POST() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const supabase = createServerClientInstance()

    const since = new Date()
    since.setDate(since.getDate() - 30)
    const sinceStr = since.toISOString().split('T')[0]
    const month    = since.toISOString().slice(0, 7) // "2026-04"

    const { data: symptoms } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('logged_at', sinceStr)
      .order('logged_at', { ascending: true })

    if (!symptoms?.length) {
      return NextResponse.json({ error: 'not_enough_data', daysLogged: 0 }, { status: 422 })
    }

    const dataLines = symptoms.map((s) =>
      `${s.logged_at}: mood ${s.mood}/10, fatigue ${s.fatigue}/10, stress ${s.stress}/10, sleep ${s.sleep_hours}h, cycle: ${s.cycle_status}`
    ).join('\n')

    const n   = symptoms.length
    const avg = (key: keyof typeof symptoms[0]) => {
      const vals = symptoms.map(s => Number(s[key])).filter(v => !isNaN(v))
      return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null
    }

    const averages = {
      avg_mood:    avg('mood'),
      avg_fatigue: avg('fatigue'),
      avg_stress:  avg('stress'),
      avg_sleep:   avg('sleep_hours'),
      days_logged: n,
    }

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      temperature: 0.72,
      max_tokens:  700,
      messages: [
        {
          role: 'system',
          content: `You are Novana, writing a warm monthly wellness report for a user tracking PCOS/PMOS symptoms. Write in second person, like a thoughtful letter. 3–4 paragraphs. Observe patterns, celebrate consistency, and gently note what's worth watching. Never diagnose. End with a one-line disclaimer.`,
        },
        {
          role: 'user',
          content: `Write my monthly wellness summary. Data from the last 30 days:\n\n${dataLines}\n\nAverages: mood ${averages.avg_mood}/10, fatigue ${averages.avg_fatigue}/10, stress ${averages.avg_stress}/10, sleep ${averages.avg_sleep}h, ${n} days logged out of 30.`,
        },
      ],
    })

    const summary_text = completion.choices[0]?.message?.content ?? ''

    // Save to monthly_summaries (silently skip if table doesn't exist yet)
    try {
      await monthlySummaries(supabase)
        .upsert(
          { user_id: session.user.id, month, summary_text, averages_json: averages },
          { onConflict: 'user_id,month' }
        )
    } catch { /* table may not exist yet — SQL migration needed */ }

    return NextResponse.json({ summary_text, month, averages })

  } catch (err) {
    console.error('[POST /api/reports]', err)
    return NextResponse.json({ error: 'Failed to generate report.' }, { status: 500 })
  }
}
