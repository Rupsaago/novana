// src/app/insights/page.tsx  (PHASE 5 VERSION)
// ═══════════════════════════════════════════════════════════════════════════
// AI Insights Page
// Shows pattern analysis from the user's symptom history.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface InsightData {
  summary:      string
  correlations: string[]
  suggestions:  string[]
  disclaimer:   string
}

interface InsightResponse {
  insights: InsightData
  meta: {
    daysAnalysed: number
    generatedAt:  string
  }
}

// ── Insight card component ────────────────────────────────────────────────────
function InsightCard({
  icon,
  title,
  color,
  children,
}: {
  icon:     string
  title:    string
  color:    string
  children: React.ReactNode
}) {
  return (
    <div className={`card border-l-4 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-display text-lg text-nova-text">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState<InsightResponse | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [notEnoughData, setNotEnoughData] = useState(false)
  const [daysLogged, setDaysLogged] = useState(0)

  async function handleAnalyse() {
    setLoading(true)
    setError(null)
    setResult(null)
    setNotEnoughData(false)

    try {
      const res  = await fetch('/api/insights', { method: 'POST' })
      const json = await res.json()

      if (res.status === 422 && json.error === 'not_enough_data') {
        setNotEnoughData(true)
        setDaysLogged(json.daysLogged)
        return
      }

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        return
      }

      setResult(json)

    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-nova-text">
          AI Insights ✦
        </h1>
        <p className="text-nova-muted mt-1 text-sm">
          Pattern analysis from your symptom history — powered by GPT-4.
        </p>
      </div>

      {/* ── Disclaimer banner ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-nova-peach/15 border border-nova-peach/30
                      rounded-2xl px-5 py-4">
        <span className="text-lg mt-0.5 shrink-0">⚠️</span>
        <p className="text-sm text-nova-muted leading-relaxed">
          <span className="font-medium text-nova-text">Not medical advice.</span>{' '}
          Novana's AI observes patterns in your personal data only. It cannot
          diagnose conditions or replace a qualified healthcare professional.
          Always speak to your doctor about your health.
        </p>
      </div>

      {/* ── Analyse button ────────────────────────────────────────────────── */}
      {!result && (
        <div className="card text-center py-12 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-nova-gradient flex items-center
                          justify-center text-4xl mx-auto shadow-nova">
            ✨
          </div>
          <div>
            <h2 className="font-display text-2xl text-nova-text mb-2">
              Ready to find your patterns?
            </h2>
            <p className="text-nova-muted text-sm max-w-sm mx-auto leading-relaxed">
              The AI will analyse your last 30 days of symptom logs and look for
              correlations between mood, sleep, fatigue, cramps, and more.
            </p>
          </div>

          <button
            onClick={handleAnalyse}
            disabled={loading}
            className={`btn-primary text-base px-10 py-4 mx-auto
                       ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analysing your patterns...
              </span>
            ) : (
              '✨ Analyse my patterns'
            )}
          </button>

          {loading && (
            <p className="text-nova-muted/60 text-xs">
              This usually takes 5–10 seconds...
            </p>
          )}
        </div>
      )}

      {/* ── Not enough data ───────────────────────────────────────────────── */}
      {notEnoughData && (
        <div className="card text-center py-10 space-y-4">
          <span className="text-5xl">📅</span>
          <div>
            <h2 className="font-display text-2xl text-nova-text mb-2">
              Keep tracking!
            </h2>
            <p className="text-nova-muted text-sm max-w-xs mx-auto leading-relaxed">
              You've logged <span className="font-medium text-nova-text">
              {daysLogged} {daysLogged === 1 ? 'day' : 'days'}</span> so far.
              You need at least 3 days of data for meaningful insights.
            </p>
          </div>
          {/* Progress bar */}
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-nova-border rounded-full overflow-hidden">
              <div
                className="h-2 bg-nova-gradient rounded-full transition-all duration-500"
                style={{ width: `${Math.min((daysLogged / 3) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-nova-muted mt-2">
              {daysLogged}/3 days minimum
            </p>
          </div>
          <button onClick={() => setNotEnoughData(false)} className="btn-ghost text-sm">
            Got it
          </button>
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200
                        rounded-2xl px-5 py-4">
          <span className="text-lg mt-0.5">❌</span>
          <div>
            <p className="text-sm font-medium text-red-700">Something went wrong</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
            <button
              onClick={handleAnalyse}
              className="text-xs text-red-600 underline mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-5">
          {/* Meta info */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-nova-muted">
              Based on{' '}
              <span className="font-medium text-nova-text">
                {result.meta.daysAnalysed} days
              </span>{' '}
              of data · Generated{' '}
              {new Date(result.meta.generatedAt).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            <button
              onClick={handleAnalyse}
              className="text-xs text-nova-purple hover:underline"
            >
              Refresh insights
            </button>
          </div>

          {/* Summary card */}
          <InsightCard
            icon="🌅"
            title="Overview"
            color="border-nova-purple"
          >
            <p className="text-nova-muted text-sm leading-relaxed">
              {result.insights.summary}
            </p>
          </InsightCard>

          {/* Correlations */}
          <InsightCard
            icon="🔗"
            title="Patterns & correlations"
            color="border-nova-sky"
          >
            <ul className="space-y-3">
              {result.insights.correlations.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-nova-sky/20 text-nova-sky
                                   flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-nova-muted text-sm leading-relaxed">{c}</p>
                </li>
              ))}
            </ul>
          </InsightCard>

          {/* Suggestions */}
          <InsightCard
            icon="💡"
            title="Gentle suggestions"
            color="border-nova-peach"
          >
            <ul className="space-y-3">
              {result.insights.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-nova-peach text-base shrink-0">✦</span>
                  <p className="text-nova-muted text-sm leading-relaxed">{s}</p>
                </li>
              ))}
            </ul>
          </InsightCard>

          {/* Disclaimer */}
          <div className="bg-nova-card/60 border border-nova-border/40
                          rounded-2xl px-5 py-4">
            <p className="text-xs text-nova-muted/70 leading-relaxed italic">
              {result.insights.disclaimer}
            </p>
          </div>

          {/* Analyse again button */}
          <button
            onClick={() => setResult(null)}
            className="btn-ghost text-sm w-full"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
