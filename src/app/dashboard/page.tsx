// src/app/dashboard/page.tsx  (REDESIGNED)
'use client'

import { useEffect, useState } from 'react'
import { createClient }        from '@/lib/supabase'
import SymptomForm             from '@/components/SymptomForm'
import {
  ResponsiveContainer, LineChart, Line, Tooltip, ReferenceLine
} from 'recharts'
import type { SymptomAvgRow }  from '@/types/database'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Mini sparkline chart ──────────────────────────────────────────────────────
function MiniChart({
  data,
  dataKey,
  color,
}: {
  data: Record<string, unknown>[]
  dataKey: string
  color: string
}) {
  if (!data || data.length < 2) return (
    <div className="h-10 flex items-center justify-center">
      <p className="text-xs text-nova-muted/40">Not enough data</p>
    </div>
  )
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Tooltip
            contentStyle={{ display: 'none' }}
            cursor={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Today at a glance card ────────────────────────────────────────────────────
function GlanceCard({
  emoji,
  label,
  value,
  unit,
  color,
  data,
  dataKey,
}: {
  emoji:   string
  label:   string
  value:   number | null
  unit:    string
  color:   string
  data:    Record<string, unknown>[]
  dataKey: string
}) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 space-y-2
                    border border-white/40 shadow-nova-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{emoji}</span>
          <span className="text-xs text-nova-muted font-medium">{label}</span>
        </div>
        <span className="text-sm font-display" style={{ color }}>
          {value ?? '—'}
          <span className="text-xs text-nova-muted font-sans ml-0.5">{unit}</span>
        </span>
      </div>
      <MiniChart data={data} dataKey={dataKey} color={color} />
    </div>
  )
}

// ── Main dashboard page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [firstName, setFirstName]     = useState('there')
  const [averages, setAverages]       = useState<SymptomAvgRow | null>(null)
  const [streak, setStreak]           = useState(0)
  const [monthCount, setMonthCount]   = useState(0)
  const [recentData, setRecentData]   = useState<Record<string, unknown>[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }

      // Get user name
      const name = session.user.user_metadata?.full_name
        ?? session.user.email?.split('@')[0] ?? 'there'
      setFirstName(name.split(' ')[0])

      // Get 30-day averages
      const { data: avgData } = await supabase
        .from('symptom_averages_30d')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      if (avgData) {
        setAverages(avgData)
        setMonthCount(avgData.total_days_logged ?? 0)
      }

      // Get last 7 days for sparklines
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data: recent } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('logged_at', sevenDaysAgo.toISOString().split('T')[0])
        .order('logged_at', { ascending: true })

      if (recent) {
        setRecentData(recent.map((r) => ({
          ...r,
          date: new Date(r.logged_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric',
          }),
        })))
      }

      // Calculate streak
      const { data: streakData } = await supabase
        .from('symptoms')
        .select('logged_at')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false })
        .limit(60)

      if (streakData && streakData.length > 0) {
        let count = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        for (let i = 0; i < streakData.length; i++) {
          const d = new Date(streakData[i].logged_at)
          d.setHours(0, 0, 0, 0)
          const expected = new Date(today)
          expected.setDate(today.getDate() - i)
          if (d.getTime() === expected.getTime()) count++
          else break
        }
        setStreak(count)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  const greeting = getGreeting()
  const today    = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const glanceItems = [
    { emoji: '🌤', label: 'Mood',    dataKey: 'mood',        value: averages?.avg_mood,          unit: '/10', color: '#7B6FA8' },
    { emoji: '💤', label: 'Fatigue', dataKey: 'fatigue',     value: averages?.avg_fatigue,        unit: '/10', color: '#E8A98B' },
    { emoji: '🌙', label: 'Sleep',   dataKey: 'sleep_hours', value: averages?.avg_sleep_hours,    unit: 'h',   color: '#8FA7C6' },
    { emoji: '🌀', label: 'Stress',  dataKey: 'stress',      value: averages?.avg_stress,         unit: '/10', color: '#D28CA7' },
  ]

  return (
    <div className="min-h-screen bg-nova-bg -mx-5 -mt-6 md:-mx-10 md:-mt-8">

      {/* ── Gradient hero header ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-6 pt-8 pb-24 md:px-10"
           style={{
             background: 'linear-gradient(160deg, #7B6FA8 0%, #C48AAA 40%, #E8A98B 100%)',
           }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full
                        bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full
                        bg-nova-peach/20 blur-2xl pointer-events-none" />

        {/* Greeting */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-white/70 text-sm mb-1">{today}</p>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-1">
            {greeting}, {firstName} ✦
          </h1>
          <p className="text-white/60 text-sm">
            Let's take care of you today.
          </p>

          {/* Streak + count pills */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm
                            rounded-full px-4 py-2 border border-white/30">
              <span className="text-base">🔥</span>
              <div>
                <span className="text-white text-sm font-medium">{streak} day streak</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm
                            rounded-full px-4 py-2 border border-white/30">
              <span className="text-base">📅</span>
              <span className="text-white text-sm font-medium">
                {monthCount} days logged
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content pulled up over the gradient ──────────────────────────── */}
      <div className="relative -mt-16 px-5 md:px-10 pb-10 max-w-4xl mx-auto space-y-5">

        {/* ── Today at a glance ──────────────────────────────────────────── */}
        {!loading && (
          <div className="bg-nova-white/80 backdrop-blur-md rounded-3xl
                          shadow-nova border border-nova-border/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-nova-text">
                Today at a glance
              </h2>
              <span className="text-xs text-nova-muted">7-day avg</span>
            </div>

            {recentData.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-nova-muted text-sm">
                  No data yet — log your first check-in below! 👇
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {glanceItems.map((item) => (
                  <GlanceCard
                    key={item.label}
                    emoji={item.emoji}
                    label={item.label}
                    value={item.value ?? null}
                    unit={item.unit}
                    color={item.color}
                    data={recentData}
                    dataKey={item.dataKey}
                  />
                ))}
              </div>
            )}

            {/* Motivational quote */}
            <div className="mt-4 bg-nova-purple/8 border border-nova-purple/15
                            rounded-2xl px-4 py-3">
              <p className="text-xs text-nova-purple font-medium mb-0.5">✦ Remember</p>
              <p className="text-xs text-nova-muted leading-relaxed italic">
                Small, consistent choices create powerful changes.
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton for glance card */}
        {loading && (
          <div className="bg-nova-white/80 rounded-3xl shadow-nova p-5 animate-pulse">
            <div className="h-4 bg-nova-border/50 rounded w-32 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-nova-bg rounded-2xl p-4 space-y-2">
                  <div className="h-3 bg-nova-border/40 rounded w-16" />
                  <div className="h-10 bg-nova-border/20 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Daily check-in form ────────────────────────────────────────── */}
        <div className="bg-nova-white rounded-3xl shadow-nova border
                        border-nova-border/30 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-nova-text">
                Daily Symptom Log
              </h2>
              <p className="text-xs text-nova-muted mt-0.5">
                Track how you're feeling today
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-nova-bg rounded-full
                            px-3 py-1.5 border border-nova-border/40">
              <span className="text-xs text-nova-muted">📅</span>
              <span className="text-xs text-nova-muted font-medium">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <SymptomForm />
        </div>

      </div>
    </div>
  )
}
