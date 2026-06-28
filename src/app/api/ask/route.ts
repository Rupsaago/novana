import { NextRequest, NextResponse }             from 'next/server'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import { openai }                                 from '@/lib/openai'

function calcCycleDay(periodStartDate: string, cycleLength: number): { day: number; phase: string } {
  const start = new Date(periodStartDate + 'T00:00:00')
  const now   = new Date(); now.setHours(0, 0, 0, 0)
  const daysSince = Math.floor((now.getTime() - start.getTime()) / 86400000)
  const day   = Math.max(1, (daysSince % cycleLength) + 1)
  const phase = day <= 5 ? 'Menstrual' : day <= 13 ? 'Follicular' : day <= 16 ? 'Ovulatory' : 'Luteal'
  return { day, phase }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const { message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required.' }, { status: 400 })

    const supabase = createServerClientInstance()

    // Fetch profile (cycle start + length) and recent symptoms in parallel
    const [{ data: profile }, { data: recent }] = await Promise.all([
      supabase
        .from('profiles')
        .select('period_start_date, cycle_length')
        .eq('id', session.user.id)
        .single(),
      supabase
        .from('symptoms')
        .select('logged_at, mood, fatigue, stress, sleep_hours, cycle_status, exercise_mins, notes')
        .eq('user_id', session.user.id)
        .gte('logged_at', (() => {
          const d = new Date(); d.setDate(d.getDate() - 7)
          return d.toLocaleDateString('en-CA')
        })())
        .order('logged_at', { ascending: false })
        .limit(7),
    ])

    // Build cycle context line
    const cycleLen = profile?.cycle_length ?? 28
    let cycleContext = 'Cycle: not set up yet'
    if (profile?.period_start_date) {
      const { day, phase } = calcCycleDay(profile.period_start_date as string, cycleLen)
      const startFmt = new Date(profile.period_start_date + 'T00:00:00')
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      cycleContext = `Current cycle: Day ${day} of ${cycleLen}, ${phase} phase (period started ${startFmt})`
    }

    // Build symptom context
    const symptomContext = recent?.length
      ? `Recent tracking (last 7 days, newest first):\n${recent.map(r =>
          `${r.logged_at}: mood ${r.mood}/10, fatigue ${r.fatigue}/10, stress ${r.stress}/10, sleep ${r.sleep_hours}h, movement ${r.exercise_mins}min, period flow: ${r.cycle_status}${r.notes ? `, note: "${r.notes}"` : ''}`
        ).join('\n')}`
      : 'Symptom tracking: no data logged yet'

    const systemPrompt = `You are Novana — a warm, direct AI companion for people with PMOS. You speak like a thoughtful friend who deeply understands hormonal health, never like a doctor or medical website.

${cycleContext}
${symptomContext}

Rules:
- Keep responses to 2–4 sentences maximum. Short is kind.
- Never say "hormonal fluctuations", "it is important to", "I recommend", or any clinical phrase
- Never suggest seeing a doctor unless the user explicitly asks
- Use the user's real data to give specific, personal observations — not generic advice
- Speak warmly and directly, like a text from a knowledgeable friend
- End with a gentle observation or soft question (never a disclaimer)
- Only disclaimer allowed: one small line "Educational only — not medical advice" at the very end
- If you don't have enough data to answer, say so honestly and warmly`

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      temperature: 0.7,
      max_tokens:  220,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: message },
      ],
    })

    const reply = completion.choices[0]?.message?.content
      ?? "I had trouble thinking that through just now — try again in a moment?"

    return NextResponse.json({ reply })

  } catch (err) {
    console.error('[POST /api/ask]', err)
    return NextResponse.json({ error: 'Failed to get a response.' }, { status: 500 })
  }
}
