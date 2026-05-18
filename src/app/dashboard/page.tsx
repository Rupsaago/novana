// src/app/dashboard/page.tsx  (FINAL — all fixes applied)
'use client'

import { useEffect, useState } from 'react'
import { createClient }        from '@/lib/supabase'
import SymptomForm             from '@/components/SymptomForm'
import Link                    from 'next/link'
import Image                   from 'next/image'
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type { SymptomAvgRow } from '@/types/database'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Tiny sparkline ────────────────────────────────────────────────────────────
function Spark({ data, dataKey, color }: {
  data: Record<string, unknown>[]
  dataKey: string
  color: string
}) {
  if (!data || data.length < 2) return (
    <p className="text-[10px] text-nova-muted/40 mt-1">No data yet</p>
  )
  return (
    <div className="h-8 w-full mt-1">
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
  const [firstName, setFirstName]     = useState('Nova')
  const [averages, setAverages]       = useState<SymptomAvgRow | null>(null)
  const [streak, setStreak]           = useState(0)
  const [daysLogged, setDaysLogged]   = useState(0)
  const [consistency, setConsistency] = useState(0)
  const [recentData, setRecentData]   = useState<Record<string, unknown>[]>([])
  const [liked, setLiked]             = useState(false)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setLoading(false); return }

      const name = session.user.user_metadata?.full_name
        ?? session.user.email?.split('@')[0] ?? 'Nova'
      setFirstName(name.split(' ')[0])

      const { data: avg } = await supabase
        .from('symptom_averages_30d')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      if (avg) {
        setAverages(avg)
        setDaysLogged(avg.total_days_logged ?? 0)
        setConsistency(Math.round(((avg.total_days_logged ?? 0) / 30) * 100))
      }

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

      const { data: sd } = await supabase
        .from('symptoms').select('logged_at')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false }).limit(60)
      if (sd?.length) {
        let count = 0
        const today = new Date(); today.setHours(0,0,0,0)
        for (let i = 0; i < sd.length; i++) {
          const d = new Date(sd[i].logged_at); d.setHours(0,0,0,0)
          const exp = new Date(today); exp.setDate(today.getDate() - i)
          if (d.getTime() === exp.getTime()) count++; else break
        }
        setStreak(count)
      }

      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-nova-text font-semibold">
            {getGreeting()}, {firstName} ✦
          </h1>
          <p className="text-nova-muted text-sm mt-0.5">
            Let's take care of you today.
          </p>
        </div>
        <Link href="/journal"
              className="hidden md:flex items-center gap-2 bg-nova-purple text-white
                         text-sm font-semibold px-4 py-2.5 rounded-2xl
                         hover:bg-nova-purple-dark transition-colors shadow-nova-sm">
          ✏️ New Journal Entry
        </Link>
      </div>

      {/* ── 3-column grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── COL 1: Daily Symptom Log ──────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/20 p-5 h-full">
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="font-display text-lg font-semibold text-nova-text">
                Daily Symptom Log
              </h2>
              <span className="text-xs text-nova-muted bg-nova-bg px-3 py-1
                               rounded-full border border-nova-border/40 flex items-center gap-1">
                📅 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p className="text-xs text-nova-muted mb-4">
              Track how you're feeling today
            </p>
            <SymptomForm />
          </div>
        </div>

        {/* ── COL 2: Glance + Cycle Phase ───────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Today at a glance */}
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-nova-text">
                Today at a glance
              </h2>
              <Link href="/analytics"
                    className="text-xs text-nova-purple font-medium hover:underline">
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 animate-pulse">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="rounded-2xl p-3 h-24 bg-nova-bg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Mood',     key: 'mood',        val: averages?.avg_mood,       unit: '/10', color: '#7B6FA8', bg: 'bg-nova-purple/10', emoji: '😊' },
                  { label: 'Energy',   key: 'fatigue',     val: averages?.avg_fatigue,    unit: '%',   color: '#E8A98B', bg: 'bg-nova-peach/20',  emoji: '⚡' },
                  { label: 'Sleep',    key: 'sleep_hours', val: averages?.avg_sleep_hours,unit: 'hrs', color: '#8FA7C6', bg: 'bg-nova-sky/20',    emoji: '🌙' },
                  { label: 'Cycle Day',key: 'stress',      val: averages?.avg_stress,     unit: '',    color: '#D28CA7', bg: 'bg-nova-rose/15',   emoji: '🌸' },
                ].map((item) => (
                  <div key={item.label}
                       className={`${item.bg} rounded-2xl p-3 border border-white/60`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-xs font-medium text-nova-muted">
                        {item.label}
                      </span>
                    </div>
                    <p className="font-display text-2xl font-semibold"
                       style={{ color: item.color }}>
                      {item.val ?? '—'}
                      <span className="text-xs text-nova-muted font-sans font-normal ml-0.5">
                        {item.unit}
                      </span>
                    </p>
                    <Spark data={recentData} dataKey={item.key} color={item.color} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cycle Phase card — with sunset-mountains.png background */}
          <div className="rounded-3xl shadow-nova-sm border border-nova-border/20
                          overflow-hidden">
            <div className="relative h-44">
              {/* Background image */}
              <Image
                src="/images/sunset-mountains.png"
                alt="Cycle phase background"
                fill
                className="object-cover"
                style={{ filter: 'brightness(0.75) saturate(0.9)' }}
              />
              {/* Gradient overlay so text is readable */}
              <div className="absolute inset-0"
                   style={{
                     background: 'linear-gradient(160deg, rgba(123,111,168,0.5) 0%, rgba(210,140,167,0.3) 100%)',
                   }} />
              {/* Content */}
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div>
                  <p className="text-white/80 text-xs font-medium mb-1">
                    Cycle Phase
                  </p>
                  <p className="font-display text-2xl font-semibold text-white">
                    Follicular Phase
                  </p>
                  <p className="text-white/70 text-xs mt-1">Day 8 of 28</p>
                </div>
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-white/60 text-[10px] mb-1">
                    <span>Progress</span>
                    <span>28%</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-white/70"
                         style={{ width: '28%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tip below the image */}
            <div className="bg-nova-white p-4 border-t border-nova-border/20">
              <p className="text-xs text-nova-purple font-semibold mb-1">
                💡 Today's tip
              </p>
              <p className="text-xs text-nova-muted leading-relaxed">
                Gentle movement and protein-rich meals can support stable energy
                throughout your cycle.
              </p>
            </div>
          </div>

        </div>

        {/* ── COL 3: AI Insight + Quote + Journey ──────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* AI Insight */}
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-nova-text">
                AI Insight
              </h2>
              <Link href="/insights"
                    className="text-xs text-nova-purple font-medium hover:underline">
                View all →
              </Link>
            </div>
            <p className="text-nova-muted text-sm leading-relaxed mb-4">
              Your sleep quality tends to improve during your follicular phase.
              You also experience{' '}
              <strong className="text-nova-text">higher energy levels</strong>{' '}
              on days you exercise.
            </p>
            <Link href="/insights"
                  className="inline-flex items-center gap-1 text-xs bg-nova-purple/10
                             text-nova-purple font-semibold px-4 py-2 rounded-xl
                             hover:bg-nova-purple/20 transition-colors">
              See full analysis →
            </Link>
            <p className="text-[10px] text-nova-muted/50 italic mt-4">
              ⚠ This is not medical advice
            </p>
          </div>

          {/* You've got this — with sunset-clouds.png background */}
          <div className="rounded-3xl shadow-nova-sm border border-nova-border/20
                          overflow-hidden relative h-44">
            <Image
              src="/images/sunset-clouds.png"
              alt="Inspirational background"
              fill
              className="object-cover"
              style={{ filter: 'brightness(0.8) saturate(0.85)' }}
            />
            <div className="absolute inset-0"
                 style={{
                   background: 'linear-gradient(160deg, rgba(239,230,223,0.7) 0%, rgba(232,169,139,0.5) 100%)',
                 }} />
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl text-nova-muted/60">❝</span>
                {/* Working heart toggle */}
                <button
                  onClick={() => setLiked(!liked)}
                  className="transition-all duration-200 text-xl"
                  aria-label="Like quote"
                >
                  <span className={liked ? 'text-nova-rose' : 'text-nova-muted/40'}>
                    {liked ? '♥' : '♡'}
                  </span>
                </button>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-nova-text leading-snug">
                  Small, consistent choices create powerful changes.
                </p>
                <p className="text-xs text-nova-muted mt-2 font-medium">
                  You've got this ✦
                </p>
              </div>
            </div>
          </div>

          {/* Your Journey */}
          <div className="bg-nova-white rounded-3xl shadow-nova-sm
                          border border-nova-border/20 p-5">
            <h2 className="font-display text-lg font-semibold text-nova-text mb-4">
              Your Journey
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Days logged',    val: daysLogged,      icon: '📅', color: 'text-nova-sky',    bg: 'bg-nova-sky/15'    },
                { label: 'Current streak', val: streak,           icon: '🔥', color: 'text-nova-peach',  bg: 'bg-nova-peach/20'  },
                { label: 'Consistency',    val: `${consistency}%`,icon: '⭐', color: 'text-nova-purple', bg: 'bg-nova-purple/10' },
              ].map((stat) => (
                <div key={stat.label}
                     className={`${stat.bg} rounded-2xl p-3 text-center border border-white/60`}>
                  <p className="text-xl mb-1">{stat.icon}</p>
                  <p className={`font-display text-xl font-semibold ${stat.color}`}>
                    {stat.val}
                  </p>
                  <p className="text-[10px] text-nova-muted leading-tight mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Symptom Trends — always visible ──────────────────────────────── */}
      <div className="mt-4 bg-nova-white rounded-3xl shadow-nova-sm
                      border border-nova-border/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-nova-text">
              Symptom Trends
            </h2>
            <p className="text-xs text-nova-muted mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-nova-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-nova-purple inline-block" />
              Mood
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-nova-peach inline-block" />
              Fatigue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-nova-rose inline-block" />
              Stress
            </span>
          </div>
        </div>

        {recentData.length < 3 ? (
          /* Not enough data state */
          <div className="h-48 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-nova-purple/10 flex items-center
                            justify-center text-3xl">
              📈
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-nova-text">
                Your trends are on their way!
              </p>
              <p className="text-xs text-nova-muted mt-1 max-w-xs leading-relaxed">
                Log symptoms for at least 3 days to see your trend chart appear here.
                You've logged{' '}
                <span className="font-semibold text-nova-purple">
                  {recentData.length} {recentData.length === 1 ? 'day' : 'days'}
                </span>{' '}
                so far.
              </p>
            </div>
            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i}
                     className={`w-2 h-2 rounded-full transition-colors ${
                       i < recentData.length ? 'bg-nova-purple' : 'bg-nova-border'
                     }`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentData}
                         margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD4CA"
                               strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="date"
                       tick={{ fontSize: 10, fill: '#6F6A66' }}
                       tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]}
                       tick={{ fontSize: 10, fill: '#6F6A66' }}
                       tickLine={false} axisLine={false} tickCount={5} />
                <Tooltip
                  contentStyle={{
                    background: '#FDFAF7',
                    border: '1px solid #DDD4CA',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 24px rgba(123,111,168,0.1)',
                  }}
                />
                <Line type="monotone" dataKey="mood" stroke="#7B6FA8"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#7B6FA8', strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                      connectNulls />
                <Line type="monotone" dataKey="fatigue" stroke="#E8A98B"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#E8A98B', strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                      connectNulls />
                <Line type="monotone" dataKey="stress" stroke="#D28CA7"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#D28CA7', strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                      connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-center text-[10px] text-nova-muted/40 mt-3">
          ⚠ This is not medical advice
        </p>
      </div>
    </div>
  )
}
