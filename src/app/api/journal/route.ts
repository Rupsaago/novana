// src/app/api/journal/route.ts
// ═══════════════════════════════════════════════════════════════════════════
// GET  /api/journal  → fetch user's journal entries
// POST /api/journal  → save a new journal entry
// POST /api/journal/summarise → AI summarises a journal entry
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse }             from 'next/server'
import { openai }                                from '@/lib/openai'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import type { JournalInsert }                    from '@/types/database'

// ── GET — fetch journal entries ───────────────────────────────────────────────
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return NextResponse.json({ data })

  } catch (err) {
    console.error('[GET /api/journal]', err)
    return NextResponse.json({ error: 'Failed to fetch journal.' }, { status: 500 })
  }
}

// ── POST — save a new entry OR summarise an existing one ─────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const body = await request.json()

    // ── Action: summarise ──────────────────────────────────────────────────
    // Called when user clicks "Summarise with AI" on an existing entry
    if (body.action === 'summarise') {
      if (!body.content || body.content.trim().length < 20) {
        return NextResponse.json(
          { error: 'Entry is too short to summarise.' },
          { status: 400 }
        )
      }

      const completion = await openai.chat.completions.create({
        model:       'gpt-4o-mini',
        max_tokens:  300,
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: `You are a compassionate wellness journal assistant for Novana, a PMOS symptom tracking app.
Your job is to summarise the emotional patterns and themes in a user's journal entry in 2-3 warm, supportive sentences.
Do NOT diagnose, do NOT give medical advice. Focus on emotions, patterns, and observations.
Use gentle language like "it sounds like", "you seem to be", "you mentioned".
Always end with one short encouraging sentence.`,
          },
          {
            role: 'user',
            content: `Please summarise the emotional patterns in this journal entry:\n\n${body.content}`,
          },
        ],
      })

      const summary = completion.choices[0]?.message?.content ?? ''

      // If an entry ID was provided, update it in the database
      if (body.entryId) {
        const supabase = createServerClientInstance()
        await supabase
          .from('journal_entries')
          .update({ ai_summary: summary })
          .eq('id', body.entryId)
          .eq('user_id', session.user.id)
      }

      return NextResponse.json({ summary })
    }

    // ── Action: save new entry ─────────────────────────────────────────────
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Content cannot be empty.' }, { status: 400 })
    }

    if (body.content.length > 5000) {
      return NextResponse.json(
        { error: 'Entry is too long (max 5000 characters).' },
        { status: 400 }
      )
    }

    const entry: JournalInsert & { mood?: string; tags?: string[] } = {
      user_id: session.user.id,
      content: body.content.trim(),
      ...(body.mood  ? { mood: String(body.mood) } : {}),
      ...(Array.isArray(body.tags) ? { tags: body.tags } : {}),
    }

    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data, message: 'Journal entry saved!' })

  } catch (err) {
    console.error('[POST /api/journal]', err)
    return NextResponse.json({ error: 'Failed to save journal entry.' }, { status: 500 })
  }
}
