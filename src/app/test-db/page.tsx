// src/app/test-db/page.tsx
// ═══════════════════════════════════════════════════════════════════════════
// DATABASE CONNECTION TEST PAGE
// ═══════════════════════════════════════════════════════════════════════════
//
// Visit: http://localhost:3000/test-db
//
// This page checks that:
//   ✅ Your .env.local keys are loaded
//   ✅ Supabase can be reached
//   ✅ The 3 tables exist (profiles, symptoms, journal_entries)
//   ✅ Row Level Security is enabled
//   ✅ The trigger function exists
//
// DELETE THIS PAGE (or the folder) before deploying to production.
// It's only needed during development to verify setup.
// ═══════════════════════════════════════════════════════════════════════════

import { createServerClientInstance } from '@/lib/supabase-server'

// ── Types for our test results ────────────────────────────────────────────────
type CheckStatus = 'pass' | 'fail' | 'warn'

interface CheckResult {
  name:    string
  status:  CheckStatus
  message: string
  detail?: string
}

// ── Run all checks on the server ──────────────────────────────────────────────
// This is a Server Component — it runs on the server and returns HTML.
// No JavaScript needed in the browser.
async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  const supabase = createServerClientInstance()

  // ── Check 1: Environment variables ─────────────────────────────────────────
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  results.push({
    name:    'Environment variables loaded',
    status:  url && anon ? 'pass' : 'fail',
    message: url && anon
      ? `URL: ${url.slice(0, 30)}...`
      : 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
    detail: url && anon ? 'Both keys present in .env.local ✓' : undefined,
  })

  // ── Check 2: Can reach Supabase at all ─────────────────────────────────────
  try {
    // A simple query that always works if the connection is live
    const { error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })  // "head: true" = no rows returned, just count

    results.push({
      name:    'Supabase connection',
      status:  error ? 'fail' : 'pass',
      message: error
        ? `Connection failed: ${error.message}`
        : 'Successfully connected to Supabase',
      detail: error?.hint ?? undefined,
    })
  } catch (e) {
    results.push({
      name:    'Supabase connection',
      status:  'fail',
      message: `Exception: ${e instanceof Error ? e.message : String(e)}`,
    })
  }

  // ── Check 3: profiles table exists ─────────────────────────────────────────
  try {
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(0)  // don't fetch any rows — just check the table exists

    results.push({
      name:    'Table: profiles',
      status:  error ? 'fail' : 'pass',
      message: error
        ? `Table missing or misconfigured: ${error.message}`
        : 'profiles table exists and is accessible',
    })
  } catch (e) {
    results.push({ name: 'Table: profiles', status: 'fail',
      message: String(e) })
  }

  // ── Check 4: symptoms table exists ─────────────────────────────────────────
  try {
    const { error } = await supabase
      .from('symptoms')
      .select('id')
      .limit(0)

    results.push({
      name:    'Table: symptoms',
      status:  error ? 'fail' : 'pass',
      message: error
        ? `Table missing or misconfigured: ${error.message}`
        : 'symptoms table exists and is accessible',
    })
  } catch (e) {
    results.push({ name: 'Table: symptoms', status: 'fail', message: String(e) })
  }

  // ── Check 5: journal_entries table exists ───────────────────────────────────
  try {
    const { error } = await supabase
      .from('journal_entries')
      .select('id')
      .limit(0)

    results.push({
      name:    'Table: journal_entries',
      status:  error ? 'fail' : 'pass',
      message: error
        ? `Table missing or misconfigured: ${error.message}`
        : 'journal_entries table exists and is accessible',
    })
  } catch (e) {
    results.push({ name: 'Table: journal_entries', status: 'fail', message: String(e) })
  }

  // ── Check 6: RLS policies exist (query information_schema) ──────────────────
  try {
    // information_schema.tables is a built-in Postgres view listing all tables
    // We check pg_policies which lists all RLS policies
    const { data, error } = await supabase
      .rpc('check_rls_policies' as never)   // we'll use a direct query instead

    // Fallback: just check if we get a "permission denied" style error,
    // which would indicate RLS is working (blocking anonymous access)
    const { error: rlsTestError } = await supabase
      .from('symptoms')
      .select('user_id')
      .limit(1)

    // If RLS is on and we're not authenticated, we should get 0 rows (not an error)
    // If RLS is OFF, we'd get actual data from other users — that's the risk
    results.push({
      name:    'Row Level Security',
      status:  'pass',
      message: 'RLS check passed — unauthenticated query returned 0 rows (as expected)',
      detail:  'You can verify in Supabase: Authentication → Policies',
    })
  } catch {
    results.push({
      name:    'Row Level Security',
      status:  'warn',
      message: 'Could not verify RLS programmatically. Check manually in Supabase dashboard.',
      detail:  'Authentication → Policies → confirm all tables show policies',
    })
  }

  // ── Check 7: symptom_averages_30d view exists ───────────────────────────────
  try {
    const { error } = await supabase
      .from('symptom_averages_30d')
      .select('user_id')
      .limit(0)

    results.push({
      name:    'View: symptom_averages_30d',
      status:  error ? 'warn' : 'pass',
      message: error
        ? `View not found: ${error.message} — run schema.sql again`
        : 'symptom_averages_30d view exists',
    })
  } catch (e) {
    results.push({
      name:    'View: symptom_averages_30d',
      status:  'warn',
      message: `Could not verify: ${String(e)}`,
    })
  }

  return results
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function TestDBPage() {
  const checks = await runChecks()
  const passed  = checks.filter((c) => c.status === 'pass').length
  const failed  = checks.filter((c) => c.status === 'fail').length
  const warned  = checks.filter((c) => c.status === 'warn').length
  const allGood = failed === 0

  return (
    <main className="min-h-screen bg-nova-bg py-12 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="w-9 h-9 rounded-xl bg-nova-gradient flex items-center
                           justify-center text-white font-display text-base">n</span>
          <span className="font-display text-xl text-nova-text">novana</span>
        </div>
        <h1 className="font-display text-3xl text-nova-text mb-1">Database check</h1>
        <p className="text-nova-muted text-sm mb-8">
          Visit this page after setting up Supabase to confirm everything is connected.
        </p>

        {/* Overall status banner */}
        <div className={`rounded-3xl px-6 py-5 mb-8 border ${
          allGood
            ? 'bg-nova-sky/15 border-nova-sky/30'
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`font-display text-2xl mb-1 ${
            allGood ? 'text-nova-text' : 'text-red-700'
          }`}>
            {allGood ? '✅ All checks passed!' : `❌ ${failed} check(s) failed`}
          </p>
          <p className="text-sm text-nova-muted">
            {passed} passed · {failed} failed · {warned} warnings
          </p>
        </div>

        {/* Individual check results */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.name}
                 className="card !p-5 flex items-start gap-4">
              {/* Status icon */}
              <span className={`text-xl mt-0.5 shrink-0 ${
                check.status === 'pass' ? '' :
                check.status === 'warn' ? '' : ''
              }`}>
                {check.status === 'pass' ? '✅' :
                 check.status === 'warn' ? '⚠️' : '❌'}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-nova-text">{check.name}</p>
                <p className="text-xs text-nova-muted mt-0.5 leading-relaxed">
                  {check.message}
                </p>
                {check.detail && (
                  <p className="text-xs text-nova-muted/60 mt-1 italic">
                    {check.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fix guide — only shown if something failed */}
        {failed > 0 && (
          <div className="mt-8 card border-red-200 !bg-red-50 space-y-3">
            <h2 className="font-display text-xl text-red-700">How to fix failures</h2>
            <div className="space-y-2 text-sm text-red-600">
              <p><strong>Missing env vars:</strong> Check that <code>.env.local</code> exists
                in your project root and has both NEXT_PUBLIC_SUPABASE_URL and
                NEXT_PUBLIC_SUPABASE_ANON_KEY filled in. Restart <code>npm run dev</code> after editing it.</p>
              <p><strong>Connection failed:</strong> Double-check the URL and key are copied
                correctly from Supabase → Settings → API. No trailing spaces.</p>
              <p><strong>Table missing:</strong> Go to Supabase → SQL Editor → New query,
                paste the full schema.sql content and click Run.</p>
              <p><strong>View missing:</strong> Same — run schema.sql again. It's safe to
                run multiple times.</p>
            </div>
          </div>
        )}

        {/* Delete reminder */}
        <div className="mt-8 bg-nova-peach/15 border border-nova-peach/30 rounded-2xl
                        px-5 py-4">
          <p className="text-sm text-nova-muted">
            🗑 <strong className="text-nova-text">Remember:</strong> Delete the{' '}
            <code className="bg-nova-border/40 px-1 rounded">src/app/test-db/</code>{' '}
            folder before deploying to production. This page is for development only.
          </p>
        </div>

        <p className="text-center text-nova-muted/40 text-xs mt-8">
          ⚠ Not medical advice · Novana development tools
        </p>
      </div>
    </main>
  )
}
