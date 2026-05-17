// src/app/dashboard/page.tsx  (DESKTOP REDESIGN — matches mockup)
'use client'

import { useEffect, useState } from 'react'
import { createClient }        from '@/lib/supabase'
import SymptomForm             from '@/components/SymptomForm'
import Link                    from 'next/link'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { SymptomAvgRow }  from '@/types/database'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Tiny sparkline ────────────────────────────────────────────────────────────
function Spark({ data, dataKey, color }: {
  data: Record<string, unknown>[], dataKey: string, color: string
}) {
  if (!data || data.length < 2) return (
    <div className="h-8 flex items-center">
      <p className="text-xs text-nova-muted/40">No data</p>
    </div>
  )
  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey={dataKey} stroke={color}
                strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [firstName, setFirstName]   = useState('Nova')
  const [averages, setAverages]     = useState<SymptomAvgRow | null>(null)
  const [streak, setStreak]         = useState(0)
  const [daysLogged, setDaysLogged] = useState(0)
  const [consistency, setConsistency] = useState(0)
  const [recentData, setRecentData] = useState<Record<string, unknown>[]>([])
  const [aiInsight, setAiInsight]   = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }

      const name = session.user.user_metadata?.full_name
        ?? session.user.email?.split('@')[0] ?? 'Nova'
      setFirstName(name.split(' ')[0])

      // 30-day averages
      const { data: avg } = await supabase
        .from('symptom_averages_30d')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      if (avg) {
        setAverages(avg)
        setDaysLogged(avg.total_days_logged ?? 0)
        // consistency = days logged / 30
        setConsistency(Math.round(((avg.total_days_logged ?? 0) / 30) * 100))
      }

      // Last 7 days for charts
      const ago7 = new Date()
      ago7.setDate(ago7.getDate() - 7)
      const { data: recent } = await supabase
        .from('symptoms')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('logged_at', ago7.toISOString().split('T')[0])
        .order('logged_at', { ascending: true })

      if (recent) {
        setRecentData(recent.map((r) => ({
          ...r,
          date: new Date(r.logged_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric',
          }),
        })))
      }

      // Streak
      const { data: sd } = await supabase
        .from('symptoms')
        .select('logged_at')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false })
        .limit(60)
      if (sd?.length) {
        let count = 0
        const today = new Date(); today.setHours(0,0,0,0)
        for (let i = 0; i < sd.length; i++) {
          const d = new Date(sd[i].logged_at); d.setHours(0,0,0,0)
          const exp = new Date(today); exp.setDate(today.getDate() - i)
          if (d.getTime() === exp.getTime()) count++
          else break
        }
        setStreak(count)
      }

      // Quick AI insight from localStorage cache (real one from insights page)
      const cached = localStorage.getItem('novana_last_insight')
      if (cached) setAiInsight(cached)

      setLoading(false)
    }
    load()
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-nova-text">
            {getGreeting()}, {firstName} ✦
          </h1>
          <p className="text-nova-muted text-sm mt-0.5">
            Let's take care of you today.
          </p>
        </div>
        <Link href="/journal"
              className="hidden md:flex items-center gap-2 bg-nova-purple text-white
                         text-sm font-medium px-4 py-2.5 rounded-2xl
                         hover:bg-nova-purple-dark transition-colors shadow-nova-sm">
          <span>✏️</span>
          New Journal Entry
        </Link>
      </div>

      {/* ── DESKTOP: 3-column grid ──────────────────────────────────────────── */}
      {/* MOBILE: single column stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── COLUMN 1: Daily Symptom Log ──────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/30 p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg text-nova-text">
                Daily Symptom Log
              </h2>
            </div>
            <p className="text-xs text-nova-muted mb-4">
              Track how you're feeling today
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-nova-muted" />
              <span className="text-xs text-nova-muted bg-nova-bg px-3 py-1
                               rounded-full border border-nova-border/40">
                📅 {new Date().toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric',
                })}
              </span>
            </div>
            <SymptomForm />
          </div>
        </div>

        {/* ── COLUMN 2: Today at a Glance + Cycle Phase + Tips ─────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Today at a glance */}
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-nova-text">
                Today at a glance
              </h2>
              <Link href="/analytics"
                    className="text-xs text-nova-purple hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 animate-pulse">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="bg-nova-bg rounded-2xl p-3 h-20" />
                ))}
              </div>
            ) : recentData.length === 0 ? (
              <p className="text-nova-muted text-sm text-center py-4">
                Log your first check-in to see stats!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Mood',       key: 'mood',        val: averages?.avg_mood,        unit: '/10', color: '#7B6FA8', emoji: '🌤' },
                  { label: 'Energy',     key: 'fatigue',     val: averages?.avg_fatigue,      unit: '%',  color: '#E8A98B', emoji: '⚡' },
                  { label: 'Sleep',      key: 'sleep_hours', val: averages?.avg_sleep_hours,  unit: 'hrs',color: '#8FA7C6', emoji: '🌙' },
                  { label: 'Cycle Day',  key: 'stress',      val: averages?.avg_stress,       unit: '',   color: '#D28CA7', emoji: '🌸' },
                ].map((item) => (
                  <div key={item.label}
                       className="bg-nova-bg rounded-2xl p-3 border border-nova-border/30">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-xs text-nova-muted">{item.label}</span>
                    </div>
                    <p className="font-display text-xl" style={{ color: item.color }}>
                      {item.val ?? '—'}
                      <span className="text-xs text-nova-muted font-sans ml-0.5">
                        {item.unit}
                      </span>
                    </p>
                    <Spark data={recentData} dataKey={item.key} color={item.color} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cycle Phase card */}
          <div className="rounded-3xl shadow-nova-sm border border-nova-border/30
                          overflow-hidden">
            {/* Gradient header */}
            <div className="px-5 pt-5 pb-16 relative"
                 style={{
                   background: 'linear-gradient(135deg, #8FA7C6 0%, #D28CA7 60%, #E8A98B 100%)',
                 }}>
              <div className="absolute inset-0 opacity-20"
                   style={{
                     backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)',
                   }} />
              <p className="text-white/80 text-xs mb-1">Cycle Phase</p>
              <p className="font-display text-2xl text-white">Follicular Phase</p>
              <p className="text-white/70 text-xs mt-1">Day 8 of 28</p>
            </div>

            {/* Progress */}
            <div className="bg-nova-white px-5 pb-5 -mt-8 pt-4 rounded-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-nova-muted">Progress</span>
                <span className="text-xs font-medium text-nova-text">28%</span>
              </div>
              <div className="h-1.5 bg-nova-border rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                     style={{
                       width: '28%',
                       background: 'linear-gradient(90deg, #8FA7C6, #D28CA7)',
                     }} />
              </div>
              {/* Tip */}
              <div className="mt-4 bg-nova-bg rounded-2xl p-3
                              border border-nova-border/30">
                <p className="text-xs text-nova-purple font-medium mb-1">
                  💡 Today's tip
                </p>
                <p className="text-xs text-nova-muted leading-relaxed">
                  Focus on movement and protein-rich meals — they support stable energy
                  throughout your cycle.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── COLUMN 3: AI Insight + Quote + Journey ────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* AI Insight card */}
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-nova-text">AI Insight</h2>
              <Link href="/insights"
                    className="text-xs text-nova-purple hover:underline">
                View all →
              </Link>
            </div>

            {aiInsight ? (
              <p className="text-nova-muted text-sm leading-relaxed">{aiInsight}</p>
            ) : (
              <div className="space-y-3">
                <p className="text-nova-muted text-sm leading-relaxed">
                  Your sleep quality tends to improve during your follicular phase.
                  You also experience higher energy levels on days you exercise.
                </p>
                <Link href="/insights"
                      className="inline-flex items-center gap-1 text-xs
                                 text-nova-purple font-medium hover:underline">
                  See full analysis →
                </Link>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-nova-border/30">
              <p className="text-xs text-nova-muted/50 italic">
                ⚠ This is not medical advice
              </p>
            </div>
          </div>

          {/* You've got this card */}
          <div className="rounded-3xl shadow-nova-sm border border-nova-border/30
                          overflow-hidden relative">
            {/* Sunset gradient bg */}
            <div className="absolute inset-0"
                 style={{
                   background: 'linear-gradient(160deg, #EFE6DF 0%, #F0D9CF 50%, #E8C4B8 100%)',
                 }} />
            <div className="relative p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">❝</span>
                <button className="text-nova-rose/40 hover:text-nova-rose transition-colors">
                  ♡
                </button>
              </div>
              <p className="font-display text-lg text-nova-text leading-snug mb-1">
                Small, consistent choices create powerful changes.
              </p>
              <p className="text-xs text-nova-muted mt-3">You've got this ✦</p>
            </div>
          </div>

          {/* Your Journey card */}
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/30 p-5">
            <h2 className="font-display text-lg text-nova-text mb-4">
              Your Journey
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Days logged', val: daysLogged, icon: '📅', color: 'text-nova-sky' },
                { label: 'Current streak', val: streak, icon: '🔥', color: 'text-nova-peach' },
                { label: 'Consistency', val: `${consistency}%`, icon: '⭐', color: 'text-nova-purple' },
              ].map((stat) => (
                <div key={stat.label}
                     className="bg-nova-bg rounded-2xl p-3 text-center
                                border border-nova-border/30">
                  <p className="text-xl mb-1">{stat.icon}</p>
                  <p className={`font-display text-lg ${stat.color}`}>{stat.val}</p>
                  <p className="text-[10px] text-nova-muted leading-tight mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM: Symptom Trends full width ──────────────────────────────── */}
      {recentData.length > 1 && (
        <div className="mt-5 bg-nova-white rounded-3xl shadow-nova-sm
                        border border-nova-border/30 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-nova-text">
              Symptom Trends
            </h2>
            <div className="flex items-center gap-4 text-xs text-nova-muted">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 rounded bg-nova-purple inline-block" />
                Mood
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 rounded bg-nova-peach inline-block" />
                Fatigue
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 rounded bg-nova-rose inline-block" />
                Stress
              </span>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentData}
                         margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD4CA"
                               strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6F6A66' }}
                       tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#6F6A66' }}
                       tickLine={false} axisLine={false} tickCount={5} />
                <Tooltip
                  contentStyle={{
                    background: '#FDFAF7',
                    border: '1px solid #DDD4CA',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="mood" stroke="#7B6FA8"
                      strokeWidth={2.5} dot={{ r: 3, fill: '#7B6FA8', strokeWidth: 0 }}
                      connectNulls />
                <Line type="monotone" dataKey="fatigue" stroke="#E8A98B"
                      strokeWidth={2.5} dot={{ r: 3, fill: '#E8A98B', strokeWidth: 0 }}
                      connectNulls />
                <Line type="monotone" dataKey="stress" stroke="#D28CA7"
                      strokeWidth={2.5} dot={{ r: 3, fill: '#D28CA7', strokeWidth: 0 }}
                      connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-nova-muted/40 mt-3">
            This is not medical advice
          </p>
        </div>
      )}
    </div>
  )
}
