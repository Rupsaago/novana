import { NextResponse }                               from 'next/server'
import { createServerClientInstance, getSession }    from '@/lib/supabase-server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

    const supabase = createServerClientInstance()

    const [{ data: symptoms, error: sErr }, { data: journals, error: jErr }] = await Promise.all([
      supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false }),
      supabase
        .from('journal_entries')
        .select('id, content, ai_summary, created_at, updated_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false }),
    ])

    if (sErr) throw sErr
    if (jErr) throw jErr

    const archive = {
      exported_at:    new Date().toISOString(),
      user_id:        session.user.id,
      symptoms:       symptoms ?? [],
      journal_entries: journals ?? [],
    }

    const dateStr = new Date().toISOString().split('T')[0]
    return new Response(JSON.stringify(archive, null, 2), {
      headers: {
        'Content-Type':        'application/json',
        'Content-Disposition': `attachment; filename="novana-export-${dateStr}.json"`,
      },
    })
  } catch (err) {
    console.error('[GET /api/export]', err)
    return NextResponse.json({ error: 'Failed to export data.' }, { status: 500 })
  }
}
