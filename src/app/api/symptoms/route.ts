// src/app/api/symptoms/route.ts
// ═══════════════════════════════════════════════════════════════════════════
// API Route: /api/symptoms
// ═══════════════════════════════════════════════════════════════════════════
//
// WHAT IS AN API ROUTE?
// In Next.js, any file named "route.ts" inside /app/api/ becomes a URL
// endpoint that your frontend can call to read or write data.
// This file handles two actions:
//
//   GET  /api/symptoms  → fetch the current user's symptom history
//   POST /api/symptoms  → save a new daily symptom log
//
// WHY NOT CALL SUPABASE DIRECTLY FROM THE COMPONENT?
// You could — but going through an API route means:
//   1. We can validate the data before saving
//   2. We can check auth on the server (more secure)
//   3. It's easier to add rate limiting or logging later
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance, getSession } from '@/lib/supabase-server'
import type { SymptomInsert } from '@/types/database'

// ── GET /api/symptoms ────────────────────────────────────────────────────────
// Returns the logged-in user's symptoms, newest first.
// Optional query param: ?days=30 (defaults to 30)
//
// Example call from frontend:
//   const res = await fetch('/api/symptoms?days=30')
//   const { data } = await res.json()

export async function GET(request: NextRequest) {
  try {
    // 1. Check the user is logged in
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      )
    }

    // 2. Read optional ?days= query param
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') ?? '30', 10)

    // 3. Query Supabase
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')                          // get all columns
      .eq('user_id', session.user.id)       // only this user's rows
      .gte('logged_at', getDateDaysAgo(days)) // only last N days
      .order('logged_at', { ascending: false }) // newest first

    if (error) throw error

    // 4. Return the data
    return NextResponse.json({ data, count: data.length })

  } catch (err) {
    console.error('[GET /api/symptoms]', err)
    return NextResponse.json(
      { error: 'Failed to fetch symptoms. Please try again.' },
      { status: 500 }
    )
  }
}

// ── POST /api/symptoms ───────────────────────────────────────────────────────
// Saves a new symptom log (or updates today's if one already exists).
//
// The body should be JSON matching the symptom fields:
//   { mood: 7, fatigue: 4, sleep_hours: 7.5, ... }
//
// Uses "upsert" — if a row for today already exists, UPDATE it.
// If not, INSERT a new one.

export async function POST(request: NextRequest) {
  try {
    // 1. Check auth
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in.' },
        { status: 401 }
      )
    }

    // 2. Parse the request body (the form data sent from SymptomForm)
    const body = await request.json()

    // 3. Validate the data — never trust what comes from the browser
    const validation = validateSymptomData(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 }
      )
    }

    // 4. Build the row to insert/update
    const symptomData: SymptomInsert = {
      user_id:       session.user.id,
      logged_at:     new Date().toISOString().split('T')[0], // "2026-05-14"
      mood:          body.mood,
      fatigue:       body.fatigue,
      sleep_hours:   body.sleep_hours,
      stress:        body.stress,
      acne:          body.acne,
      cramps:        body.cramps,
      exercise_mins: body.exercise_mins,
      cycle_status:  body.cycle_status,
      notes:         body.notes ?? null,
    }

    // 5. Upsert into Supabase
    // onConflict: if (user_id + logged_at) already exists, update instead of insert
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from('symptoms')
      .upsert(symptomData, {
        onConflict: 'user_id,logged_at',  // matches our UNIQUE index in schema.sql
        ignoreDuplicates: false,           // false = update on conflict
      })
      .select()  // return the saved row
      .single()  // we expect exactly one row back

    if (error) throw error

    // 6. Return success
    return NextResponse.json(
      { data, message: "Today's check-in saved!" },
      { status: 200 }
    )

  } catch (err) {
    console.error('[POST /api/symptoms]', err)
    return NextResponse.json(
      { error: 'Failed to save symptoms. Please try again.' },
      { status: 500 }
    )
  }
}

// ── Helper: validate incoming symptom data ───────────────────────────────────
function validateSymptomData(body: Record<string, unknown>) {
  const VALID_CYCLE = ['none', 'spotting', 'light', 'moderate', 'heavy']

  const checks: Array<[boolean, string]> = [
    [typeof body.mood          === 'number' && body.mood          >= 1  && body.mood          <= 10,  'mood must be 1–10'],
    [typeof body.fatigue       === 'number' && body.fatigue       >= 1  && body.fatigue       <= 10,  'fatigue must be 1–10'],
    [typeof body.sleep_hours   === 'number' && body.sleep_hours   >= 0  && body.sleep_hours   <= 24,  'sleep_hours must be 0–24'],
    [typeof body.stress        === 'number' && body.stress        >= 1  && body.stress        <= 10,  'stress must be 1–10'],
    [typeof body.acne          === 'number' && body.acne          >= 1  && body.acne          <= 10,  'acne must be 1–10'],
    [typeof body.cramps        === 'number' && body.cramps        >= 1  && body.cramps        <= 10,  'cramps must be 1–10'],
    [typeof body.exercise_mins === 'number' && body.exercise_mins >= 0  && body.exercise_mins <= 1440,'exercise_mins must be 0–1440'],
    [typeof body.cycle_status  === 'string' && VALID_CYCLE.includes(body.cycle_status as string), 'invalid cycle_status'],
  ]

  for (const [valid, message] of checks) {
    if (!valid) return { valid: false, message: `Validation failed: ${message}` }
  }

  return { valid: true, message: '' }
}

// ── Helper: date N days ago as "YYYY-MM-DD" string ───────────────────────────
function getDateDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}
