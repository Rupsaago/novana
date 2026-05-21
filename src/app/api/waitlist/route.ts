import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance }  from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { email, feature } = await req.json()
    if (!email || !feature) {
      return NextResponse.json({ error: 'email and feature are required' }, { status: 400 })
    }

    const supabase = createServerClientInstance()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('waitlist').insert({ email: email.trim().toLowerCase(), feature })

    if (error) {
      console.error('[POST /api/waitlist]', error)
      return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/waitlist]', err)
    return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 })
  }
}
