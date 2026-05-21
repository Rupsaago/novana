import { NextRequest, NextResponse }             from 'next/server'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import { openai }                                 from '@/lib/openai'

const SYSTEM_PROMPT = `You are Novana, helping a user prepare for a doctor's appointment about PCOS/PMOS and hormonal health.

Based on the symptom data provided, generate exactly 5 specific questions the user should ask their doctor. Each question must be:
- Grounded in the actual patterns in the data
- Specific enough that a doctor can investigate it
- Phrased as exploration, not diagnosis ("should I check..." not "do I have...")
- Relevant to PCOS/PMOS, hormonal health, or the symptoms observed

Return ONLY valid JSON with this exact structure — no markdown, no extra text:
{
  "questions": [
    { "q": "Question text here?", "why": "One sentence explaining why this question is relevant based on the data." },
    { "q": "...", "why": "..." },
    { "q": "...", "why": "..." },
    { "q": "...", "why": "..." },
    { "q": "...", "why": "..." }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const body = await req.json()
    const windowTab: string = body.windowTab ?? 'Last 90 days'
    const days = windowTab.includes('90') ? 90 : windowTab.includes('60') ? 60 : 30

    const supabase = createServerClientInstance()
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data: symptoms } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('logged_at', since.toISOString().split('T')[0])
      .order('logged_at', { ascending: true })

    if (!symptoms?.length) {
      return NextResponse.json({ error: 'not_enough_data', daysLogged: 0 }, { status: 422 })
    }

    const summary = symptoms.map((s) =>
      `${s.logged_at}: mood ${s.mood}/10, fatigue ${s.fatigue}/10, stress ${s.stress}/10, sleep ${s.sleep_hours}h, acne ${s.acne}/10, cramps ${s.cramps}/10, exercise ${s.exercise_mins}min, cycle: ${s.cycle_status}`
    ).join('\n')

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      temperature: 0.6,
      max_tokens:  800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: `My symptom logs for the last ${days} days (${symptoms.length} entries):\n\n${summary}` },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      return NextResponse.json(parsed)
    } catch {
      console.error('[POST /api/doctor-prep] non-JSON from AI:', raw)
      return NextResponse.json({ error: 'AI returned unexpected format.' }, { status: 500 })
    }

  } catch (err) {
    console.error('[POST /api/doctor-prep]', err)
    return NextResponse.json({ error: 'Failed to generate questions.' }, { status: 500 })
  }
}
