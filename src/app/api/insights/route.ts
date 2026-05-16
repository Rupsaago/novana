// src/app/api/insights/route.ts
// ═══════════════════════════════════════════════════════════════════════════
// POST /api/insights
// ═══════════════════════════════════════════════════════════════════════════
//
// What this does:
//   1. Checks the user is logged in
//   2. Fetches their last 30 days of symptom data from Supabase
//   3. Formats the data into a clear summary for the AI
//   4. Sends it to OpenAI GPT-4 with a careful system prompt
//   5. Returns summaries, correlations, and suggestions
//
// Safety rules baked into the system prompt:
//   - Never diagnose
//   - Never say "you have X condition"
//   - Only observe patterns ("you may notice...")
//   - Always recommend consulting a doctor
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse }                              from 'next/server'
import { openai }                                    from '@/lib/openai'
import { createServerClientInstance, getSession }    from '@/lib/supabase-server'
import type { SymptomRow }                           from '@/types/database'

// ── The system prompt — this controls how the AI behaves ─────────────────────
// This is the most important part. It tells GPT-4 exactly what role to play
// and what it must NEVER do. Changing this carelessly could cause harm.
const SYSTEM_PROMPT = `
You are Novana's wellness insight assistant. Novana is a PMOS (Polyendocrine Metabolic Ovarian Syndrome) symptom tracking app.

Your role is to help users understand PATTERNS in their own symptom data — not to diagnose, treat, or provide medical advice.

STRICT RULES you must always follow:
1. NEVER diagnose any condition or suggest the user has a specific disorder
2. NEVER use language like "you have", "you are suffering from", "this indicates a condition"
3. ALWAYS use gentle, observational language: "you may notice", "your data suggests", "it looks like", "there seems to be a pattern"
4. ALWAYS end with a reminder that this is not medical advice and to consult a healthcare professional
5. Be warm, supportive, and non-alarming — the user may be going through a difficult time
6. Focus on patterns and correlations, not conclusions
7. If data is limited (fewer than 5 days), note that more data will give better insights

Your response must be valid JSON with exactly this structure:
{
  "summary": "2-3 sentence overview of the user's recent trends in a warm, supportive tone",
  "correlations": [
    "A specific pattern you noticed between two or more symptoms",
    "Another correlation",
    "Another correlation"
  ],
  "suggestions": [
    "A gentle, practical lifestyle observation (not medical advice)",
    "Another suggestion",
    "Another suggestion"
  ],
  "disclaimer": "This is not medical advice. These insights are based on your personal tracking data only. Please consult a qualified healthcare professional for any medical concerns."
}

Return ONLY the JSON object. No markdown, no backticks, no extra text.
`.trim()

// ── Format symptom data into readable text for the AI ─────────────────────────
function formatSymptomsForAI(symptoms: SymptomRow[]): string {
  if (symptoms.length === 0) {
    return 'No symptom data available yet.'
  }

  const lines = symptoms.map((s) => {
    return [
      `Date: ${s.logged_at}`,
      `Mood: ${s.mood}/10`,
      `Fatigue: ${s.fatigue}/10`,
      `Sleep: ${s.sleep_hours} hours`,
      `Stress: ${s.stress}/10`,
      `Acne/Skin: ${s.acne}/10`,
      `Cramps/Pain: ${s.cramps}/10`,
      `Exercise: ${s.exercise_mins} minutes`,
      `Cycle status: ${s.cycle_status}`,
      s.notes ? `Notes: ${s.notes}` : null,
    ]
      .filter(Boolean)
      .join(', ')
  })

  return lines.join('\n')
}

// ── Calculate some basic stats to include with the prompt ─────────────────────
function calculateBasicStats(symptoms: SymptomRow[]) {
  if (symptoms.length === 0) return null

  const avg = (key: keyof SymptomRow) => {
    const vals = symptoms.map((s) => Number(s[key])).filter((v) => !isNaN(v))
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 'N/A'
  }

  return {
    days:         symptoms.length,
    avgMood:      avg('mood'),
    avgFatigue:   avg('fatigue'),
    avgSleep:     avg('sleep_hours'),
    avgStress:    avg('stress'),
    avgAcne:      avg('acne'),
    avgCramps:    avg('cramps'),
    avgExercise:  avg('exercise_mins'),
  }
}

// ── Main POST handler ─────────────────────────────────────────────────────────
export async function POST() {
  try {
    // 1. Auth check
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // 2. Fetch last 30 days of symptoms
    const supabase = createServerClientInstance()
    const { data: symptoms, error: dbError } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', session.user.id)
      .order('logged_at', { ascending: false })
      .limit(30)

    if (dbError) throw dbError

    // 3. Check if there's enough data
    if (!symptoms || symptoms.length < 3) {
      return NextResponse.json({
        error: 'not_enough_data',
        message: 'You need at least 3 days of logged symptoms to generate insights. Keep tracking!',
        daysLogged: symptoms?.length ?? 0,
      }, { status: 422 })
    }

    // 4. Format the data
    const formattedData = formatSymptomsForAI(symptoms)
    const stats         = calculateBasicStats(symptoms)

    // 5. Build the user message
    const userMessage = `
Here is my PMOS symptom tracking data for the last ${symptoms.length} days:

${formattedData}

Overall averages across these ${symptoms.length} days:
- Average mood: ${stats?.avgMood}/10
- Average fatigue: ${stats?.avgFatigue}/10
- Average sleep: ${stats?.avgSleep} hours
- Average stress: ${stats?.avgStress}/10
- Average acne severity: ${stats?.avgAcne}/10
- Average cramps: ${stats?.avgCramps}/10
- Average exercise: ${stats?.avgExercise} minutes/day

Please analyse these patterns and provide insights in the JSON format specified.
    `.trim()

    // 6. Call OpenAI
    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',  // fast + cheap, great for this use case
      max_tokens:  1000,
      temperature: 0.7,            // slight creativity for warm tone
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage   },
      ],
    })

    // 7. Parse the response
    const rawText = completion.choices[0]?.message?.content ?? ''

    let insights
    try {
      // Strip any accidental markdown backticks before parsing
      const cleaned = rawText.replace(/```json|```/g, '').trim()
      insights = JSON.parse(cleaned)
    } catch {
      console.error('OpenAI returned non-JSON:', rawText)
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.' },
        { status: 500 }
      )
    }

    // 8. Return the insights + metadata
    return NextResponse.json({
      insights,
      meta: {
        daysAnalysed: symptoms.length,
        generatedAt:  new Date().toISOString(),
      },
    })

  } catch (err) {
    console.error('[POST /api/insights]', err)
    return NextResponse.json(
      { error: 'Failed to generate insights. Please try again.' },
      { status: 500 }
    )
  }
}
