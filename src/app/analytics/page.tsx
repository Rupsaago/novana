// src/app/analytics/page.tsx  (PHASE 6 VERSION)
// ═══════════════════════════════════════════════════════════════════════════
// Analytics Page — symptom trend charts using Recharts.
// Shows 7 charts (one per symptom) + summary stat cards.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import SymptomChart            from '@/components/SymptomChart'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChartDataPoint {
  date:          string
  logged_at:     string
  mood:          number
  fatigue:       number
  sleep_hours:   number
  stress:        number
  acne:          number
  cramps:        number
  exercise_mins: number
  cycle_status:  string
}

interface Averages {
  mood:          number | null
  fatigue:       number | null
  sleep_hours:   number | null
  stress:        number | null
  acne:          number | null
  cramps:        number | null
  exercise_mins: number | null
}

interface AnalyticsData {
  chartData:  ChartDataPoint[]
  averages:   Averages
  totalDays:  number
}

// ── Chart config — one entry per symptom ──────────────────────────────────────
const CHARTS = [
  {
    key:    'mood',
    label:  'Mood',
    emoji:  '🌤',
    color:  '#7B6FA8',  // nova-purple
    unit:   '/10',
    maxY:   10,
    desc:   'How you felt emotionally each day',
  },
  {
    key:    'fatigue',
    label:  'Fatigue',
    emoji:  '💤',
    color:  '#E8A98B',  // nova-peach
    unit:   '/10',
    maxY:   10,
    desc:   'Energy levels — higher = more tired',
  },
  {
    key:    'sleep_hours',
    label:  'Sleep',
    emoji:  '🌙',
    color:  '#8FA7C6',  // nova-sky
    unit:   'h',
    maxY:   12,
    desc:   'Hours of sleep per night',
  },
  {
    key:    'stress',
    label:  'Stress',
    emoji:  '🌀',
    color:  '#D28CA7',  // nova-rose
    unit:   '/10',
    maxY:   10,
    desc:   'Stress and overwhelm levels',
  },
  {
    key:    'acne',
    label:  'Acne / Skin',
    emoji:  '🌸',
    color:  '#C4799A',
    unit:   '/10',
    maxY:   10,
    desc:   'Skin breakout severity',
  },
  {
    key:    'cramps',
    label:  'Cramps / Pain',
    emoji:  '⚡',
    color:  '#A89ED0',
    unit:   '/10',
    maxY:   10,
    desc:   'Pelvic or body pain levels',
  },
  {
    key:    'exercise_mins',
    label:  'Exercise',
    emoji:  '🏃‍♀️',
    color:  '#7B9E9E',
    unit:   'min',
    maxY:   120,
    desc:   'Minutes of movement per day',
  },
]

// ── Day range selector options ────────────────────────────────────────────────
const DAY_OPTIONS = [
  { label: '7 days',  value: 7  },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
]

// ── Cycle status badge ────────────────────────────────────────────────────────
function CycleTimeline({ data }: { data: ChartDataPoint[] }) {
  const cyclePoints = data.filter((d) => d.cycle_status !== 'none')
  if (cyclePoints.length === 0) return null

  const colorMap: Record<string, string> = {
    spotting: 'bg-nova-rose/30 text-nova-rose',
    light:    'bg-nova-rose/50 text-nova-rose',
    moderate: 'bg-nova-rose/70 text-white',
    heavy:    'bg-nova-rose text-white',
  }

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔴</span>
        <h3 className="font-display text-lg text-nova-text">Cycle log</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {cyclePoints.map((d) => (
          <span
            key={d.logged_at}
            className={`text-xs px-3 py-1.5 rounded-full font-medium
                       ${colorMap[d.cycle_status] ?? 'bg-nova-card text-nova-muted'}`}
          >
            {d.date} · {d.cycle_status}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [data, setData]         = useState<AnalyticsData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [days, setDays]         = useState(30)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const res  = await fetch(`/api/analytics?days=${days}`)
        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? 'Failed to load analytics.')
          return
        }

        setData(json)
      } catch {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [days])  // re-fetch whenever the day range changes

  return (
    <div className="space-y-8">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-nova-text">
            Analytics ✦
          </h1>
          <p className="text-nova-muted mt-1 text-sm">
            Your symptom trends over time.
          </p>
        </div>

        {/* Day range selector */}
        <div className="flex items-center gap-2 bg-nova-card rounded-2xl p-1">
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                         ${days === opt.value
                           ? 'bg-nova-white text-nova-purple shadow-nova-sm'
                           : 'text-nova-muted hover:text-nova-text'
                         }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* ── Loading skeleton ──────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-6">
          {/* Stat cards skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="card-sm animate-pulse space-y-2">
                <div className="h-3 bg-nova-border/50 rounded w-16" />
                <div className="h-8 bg-nova-border/30 rounded w-12" />
              </div>
            ))}
          </div>
          {/* Chart skeletons */}
          {[1,2,3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-nova-border/50 rounded w-24 mb-4" />
              <div className="h-48 bg-nova-border/20 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* ── No data state ─────────────────────────────────────────────────── */}
      {!loading && data && data.totalDays === 0 && (
        <div className="card text-center py-16 space-y-4">
          <span className="text-5xl">📊</span>
          <div>
            <h2 className="font-display text-2xl text-nova-text mb-2">
              No data for this period
            </h2>
            <p className="text-nova-muted text-sm max-w-xs mx-auto leading-relaxed">
              Start logging your symptoms on the Daily Log page and
              come back here to see your trends.
            </p>
          </div>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      {!loading && data && data.totalDays > 0 && (
        <div className="space-y-6">

          {/* Summary stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg mood',    val: data.averages.mood,          unit: '/10', color: 'text-nova-purple' },
              { label: 'Avg sleep',   val: data.averages.sleep_hours,   unit: 'hrs', color: 'text-nova-sky'    },
              { label: 'Avg fatigue', val: data.averages.fatigue,       unit: '/10', color: 'text-nova-peach'  },
              { label: 'Avg stress',  val: data.averages.stress,        unit: '/10', color: 'text-nova-rose'   },
            ].map((stat) => (
              <div key={stat.label} className="card-sm">
                <p className="text-xs text-nova-muted mb-1">{stat.label}</p>
                <p className={`text-2xl font-display ${stat.color}`}>
                  {stat.val ?? '—'}
                  {stat.val && (
                    <span className="text-sm text-nova-muted font-sans ml-0.5">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="text-xs text-nova-muted/60 mt-1">
                  Last {days} days · {data.totalDays} logged
                </p>
              </div>
            ))}
          </div>

          {/* Cycle timeline */}
          <CycleTimeline data={data.chartData} />

          {/* Individual symptom charts */}
          {CHARTS.map((chart) => (
            <div key={chart.key} className="card space-y-4">
              {/* Chart header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{chart.emoji}</span>
                  <div>
                    <h3 className="font-display text-lg text-nova-text">
                      {chart.label}
                    </h3>
                    <p className="text-xs text-nova-muted">{chart.desc}</p>
                  </div>
                </div>
                {/* Average badge */}
                {data.averages[chart.key as keyof Averages] !== null && (
                  <div className="text-right">
                    <p className="text-xs text-nova-muted">avg</p>
                    <p className="font-display text-lg"
                       style={{ color: chart.color }}>
                      {data.averages[chart.key as keyof Averages]}
                      <span className="text-xs text-nova-muted font-sans ml-0.5">
                        {chart.unit}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* The chart */}
              <SymptomChart
                data={data.chartData}
                dataKey={chart.key}
                color={chart.color}
                label={chart.label}
                unit={chart.unit}
                maxY={chart.maxY}
                avgValue={data.averages[chart.key as keyof Averages]}
              />
            </div>
          ))}

          {/* Footer note */}
          <p className="text-center text-xs text-nova-muted/50 pb-4">
            ⚠ These charts show personal tracking data only — not medical information.
          </p>
        </div>
      )}
    </div>
  )
}
