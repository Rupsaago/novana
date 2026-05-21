import { NextRequest, NextResponse }             from 'next/server'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import { openai }                                 from '@/lib/openai'

const SYSTEM_PROMPT = `You are Novana, a warm and knowledgeable wellness companion for people managing PCOS/PMOS (Polycystic/Polyendocrine Metabolic Ovarian Syndrome) and hormonal health conditions.

You have access to the user's recent symptom tracking data (provided as context). Use it to give personalized, grounded answers.

Rules you must always follow:
1. Never diagnose. Never say "you have X condition."
2. Use gentle, observational language: "based on your patterns", "it looks like", "you may notice"
3. Be warm — like a knowledgeable friend, not a clinical report
4. Keep responses to 2–3 paragraphs max
5. If you reference their data, be specific but gentle
6. End with a brief "Not medical advice" note
7. Never suggest stopping medications or overriding doctor advice`

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const { message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required.' }, { status: 400 })

    const supabase = createServerClientInstance()
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const { data: recent } = await supabase
      .from('symptoms')
      .select('logged_at, mood, fatigue, stress, sleep_hours, cycle_status, exercise_mins, notes')
      .eq('user_id', session.user.id)
      .gte('logged_at', since.toISOString().split('T')[0])
      .order('logged_at', { ascending: false })
      .limit(7)

    const contextStr = recent?.length
      ? `User's recent tracking (last 7 days):\n${recent.map(r =>
          `${r.logged_at}: mood ${r.mood}/10, fatigue ${r.fatigue}/10, stress ${r.stress}/10, sleep ${r.sleep_hours}h, exercise ${r.exercise_mins}min, cycle: ${r.cycle_status}${r.notes ? `, note: ${r.notes}` : ''}`
        ).join('\n')}`
      : 'No recent tracking data available yet.'

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      temperature: 0.72,
      max_tokens:  500,
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\n${contextStr}` },
        { role: 'user',   content: message },
      ],
    })

    const reply = completion.choices[0]?.message?.content
      ?? "I had trouble thinking that through. Try again in a moment?"

    return NextResponse.json({ reply })

  } catch (err) {
    console.error('[POST /api/ask]', err)
    return NextResponse.json({ error: 'Failed to get a response.' }, { status: 500 })
  }
}
