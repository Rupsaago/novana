// src/app/dashboard/page.tsx  (POLISHED — hero bg, proportions, SVG icons)
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

// ── SVG icons for symptom glance cards ───────────────────────────────────────
const GlanceIcons = {
  mood: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <circle cx="10" cy="10" r="8"/>
      <path d="M7 12s1 1.5 3 1.5 3-1.5 3-1.5"/>
      <circle cx="7.5" cy="8.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="12.5" cy="8.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  energy: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <polygon points="11,2 4,11 10,11 9,18 16,9 10,9"/>
    </svg>
  ),
  sleep: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M17 14A8 8 0 0 1 6 3a8 8 0 1 0 11 11z"/>
    </svg>
  ),
  cycle: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M10 3 C6 3 3 6 3 10 C3 14 6 17 10 17"/>
      <path d="M10 17 C14 17 17 14 17 10 C17 6 14 3 10 3"/>
      <path d="M10 6 L10 10 L13 13"/>
    </svg>
  ),
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
        .from('symptom_averages_30d').select('*')
        .eq('user_id', session.user.id).single()
      if (avg) {
        setAverages(avg)
        setDaysLogged(avg.total_days_logged ?? 0)
        setConsistency(Math.round(((avg.total_days_logged ?? 0) / 30) * 100))
      }

      const ago7 = new Date()
      ago7.setDate(ago7.getDate() - 7)
      const { data: recent } = await supabase
        .from('symptoms').select('*')
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
    <div className="min-h-screen -mx-5 -mt-6 md:-mx-7 md:-mt-7">

      {/* ── Hero header with desert-dunes bg image ──────────────────────── */}
      <div className="relative overflow-hidden px-6 pt-8 pb-36 md:px-8">
        {/* Background image */}
        <Image
          src="/images/desert-dunes.png"
          alt="Desert dunes background"
          fill
          className="object-cover object-center"
          style={{ filter: 'brightness(0.7) saturate(0.85)' }}
          priority
        />
        {/* Gradient overlay — fades to dashboard bg color at bottom */}
        <div className="absolute inset-0"
             style={{
               background: 'linear-gradient(to bottom, rgba(100,80,130,0.35) 0%, rgba(239,232,225,0.95) 85%, #EFE8E1 100%)',
             }} />

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-nova-text font-semibold drop-shadow-sm">
              {getGreeting()}, {firstName} ✦
            </h1>
            <p className="text-nova-muted text-sm mt-1">
              Let's take care of you today.
            </p>
          </div>
          <Link href="/journal"
                className="hidden md:flex items-center gap-2 bg-nova-purple text-white
                           text-sm font-semibold px-5 py-3 rounded-2xl shadow-nova
                           hover:bg-nova-purple-dark transition-colors">
            ✏️ New Journal Entry
          </Link>
        </div>
      </div>

      {/* ── Cards — pulled UP over the faded image ──────────────────────── */}
      <div className="-mt-28 relative z-10 px-5 md:px-7 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── COL 1: Daily Symptom Log ────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-nova-sm
                            border border-nova-border/15 p-5 h-full">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="font-display text-lg font-semibold text-nova-text">
                  Daily Symptom Log
                </h2>
                <span className="text-xs text-nova-muted bg-nova-bg/80 px-3 py-1.5
                                 rounded-full border border-nova-border/30 flex items-center gap-1">
                  📅 {new Date().toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-xs text-nova-muted mb-4">
                Track how you're feeling today
              </p>
              <SymptomForm />
            </div>
          </div>

          {/* ── COL 2: Glance + Cycle Phase ─────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Today at a glance */}
            <div className="bg-white rounded-3xl shadow-nova-sm border border-nova-border/15 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-nova-text">
                  Today at a glance
                </h2>
                <Link href="/analytics"
                      className="text-xs text-nova-purple font-semibold hover:underline">
                  View all →
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-3 animate-pulse">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="rounded-2xl p-3 h-28 bg-nova-bg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Mood',     key: 'mood',        val: averages?.avg_mood,       unit: '/10', color: '#7B6FA8', bg: 'bg-nova-purple/10', iconColor: 'text-nova-purple',  icon: GlanceIcons.mood   },
                    { label: 'Energy',   key: 'fatigue',     val: averages?.avg_fatigue,    unit: '%',   color: '#E8A98B', bg: 'bg-nova-peach/20',  iconColor: 'text-nova-peach',   icon: GlanceIcons.energy },
                    { label: 'Sleep',    key: 'sleep_hours', val: averages?.avg_sleep_hours,unit: 'hrs', color: '#8FA7C6', bg: 'bg-nova-sky/20',    iconColor: 'text-nova-sky',     icon: GlanceIcons.sleep  },
                    { label: 'Cycle Day',key: 'stress',      val: averages?.avg_stress,     unit: '',    color: '#D28CA7', bg: 'bg-nova-rose/15',   iconColor: 'text-nova-rose',    icon: GlanceIcons.cycle  },
                  ].map((item) => (
                    <div key={item.label}
                         className={`${item.bg} rounded-2xl p-4 border border-white/50`}>
                      <div className={`flex items-center gap-1.5 mb-2 ${item.iconColor}`}>
                        {item.icon}
                        <span className="text-xs font-semibold text-nova-muted">
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

            {/* Cycle Phase with image */}
            <div className="rounded-3xl shadow-nova-sm border border-nova-border/15 overflow-hidden">
              <div className="relative h-44">
                <Image src="/images/sunset-mountains.png" alt="Cycle phase" fill
                       className="object-cover"
                       style={{ filter: 'brightness(0.72) saturate(0.9)' }} />
                <div className="absolute inset-0"
                     style={{ background: 'linear-gradient(160deg,rgba(100,80,150,0.5) 0%,rgba(200,120,150,0.3) 100%)' }} />
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-white/75 text-xs font-medium mb-1">Cycle Phase</p>
                    <p className="font-display text-2xl font-semibold text-white">
                      Follicular Phase
                    </p>
                    <p className="text-white/70 text-xs mt-1">Day 8 of 28</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-white/60 text-[10px] mb-1.5">
                      <span>Progress</span><span>28%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-white/75" style={{ width: '28%' }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 border-t border-nova-border/15">
                <p className="text-xs text-nova-purple font-semibold mb-1">💡 Today's tip</p>
                <p className="text-xs text-nova-muted leading-relaxed">
                  Gentle movement and protein-rich meals can support stable energy
                  throughout your cycle.
                </p>
              </div>
            </div>
          </div>

          {/* ── COL 3: AI Insight + Quote + Journey ─────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* AI Insight — with colored button box */}
            <div className="bg-white rounded-3xl shadow-nova-sm border border-nova-border/15 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-semibold text-nova-text">
                  AI Insight
                </h2>
                <Link href="/insights"
                      className="text-xs text-nova-purple font-semibold hover:underline">
                  View all →
                </Link>
              </div>
              <p className="text-nova-muted text-sm leading-relaxed mb-4">
                Your sleep quality tends to improve during your follicular phase.
                You also experience{' '}
                <strong className="text-nova-text font-semibold">
                  higher energy levels
                </strong>{' '}
                on days you exercise.
              </p>
              {/* Colored button — was missing */}
              <Link href="/insights"
                    className="flex items-center justify-center gap-1.5 text-xs
                               bg-nova-purple/12 text-nova-purple font-semibold
                               px-4 py-2.5 rounded-xl w-full
                               hover:bg-nova-purple/20 transition-colors border
                               border-nova-purple/20">
                See full analysis →
              </Link>
              <p className="text-[10px] text-nova-muted/40 italic mt-3">
                ⚠ This is not medical advice
              </p>
            </div>

            {/* You've got this — sunset-clouds bg */}
            <div className="rounded-3xl shadow-nova-sm border border-nova-border/15
                            overflow-hidden relative h-44">
              <Image src="/images/sunset-clouds.png" alt="Quote background" fill
                     className="object-cover"
                     style={{ filter: 'brightness(0.78) saturate(0.8)' }} />
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(160deg,rgba(239,230,223,0.65) 0%,rgba(232,169,139,0.45) 100%)' }} />
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl text-nova-muted/50 leading-none">❝</span>
                  {/* Heart — more visible rose when liked */}
                  <button
                    onClick={() => setLiked(!liked)}
                    className="transition-all duration-200 p-1"
                    aria-label="Like quote"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={liked ? '#D28CA7' : 'none'}
                         stroke={liked ? '#D28CA7' : '#6F6A66'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-nova-text leading-snug">
                    Small, consistent choices create powerful changes.
                  </p>
                  <p className="text-xs text-nova-muted font-medium mt-2">
                    You've got this ✦
                  </p>
                </div>
              </div>
            </div>

            {/* Your Journey */}
            <div className="bg-white rounded-3xl shadow-nova-sm border border-nova-border/15 p-5">
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

        {/* ── Symptom Trends ──────────────────────────────────────────────── */}
        <div className="mt-4 bg-white rounded-3xl shadow-nova-sm
                        border border-nova-border/15 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-nova-text">
                Symptom Trends
              </h2>
              <p className="text-xs text-nova-muted mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-nova-muted">
              {[
                { label: 'Mood',    color: '#7B6FA8' },
                { label: 'Fatigue', color: '#E8A98B' },
                { label: 'Stress',  color: '#D28CA7' },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 rounded inline-block"
                        style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {recentData.length < 3 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-nova-purple/10 flex items-center
                              justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7B6FA8" strokeWidth="1.8"
                     className="w-7 h-7">
                  <polyline points="3,17 9,11 13,15 21,7"/>
                  <polyline points="14,7 21,7 21,14"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-nova-text">
                  Your trends are on their way!
                </p>
                <p className="text-xs text-nova-muted mt-1 max-w-xs leading-relaxed">
                  Log symptoms for at least 3 days to see your trend chart.
                  You've logged{' '}
                  <span className="font-semibold text-nova-purple">
                    {recentData.length} {recentData.length === 1 ? 'day' : 'days'}
                  </span>{' '}
                  so far.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[0,1,2].map((i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                    i < recentData.length ? 'bg-nova-purple' : 'bg-nova-border'
                  }`} />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DDD4CA" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6F6A66' }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0,10]} tick={{ fontSize: 10, fill: '#6F6A66' }} tickLine={false} axisLine={false} tickCount={5} />
                  <Tooltip contentStyle={{ background: '#FDFAF7', border: '1px solid #DDD4CA', borderRadius: '12px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="mood" stroke="#7B6FA8" strokeWidth={2.5} dot={{ r: 4, fill: '#7B6FA8', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} connectNulls />
                  <Line type="monotone" dataKey="fatigue" stroke="#E8A98B" strokeWidth={2.5} dot={{ r: 4, fill: '#E8A98B', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} connectNulls />
                  <Line type="monotone" dataKey="stress" stroke="#D28CA7" strokeWidth={2.5} dot={{ r: 4, fill: '#D28CA7', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="text-center text-[10px] text-nova-muted/40 mt-3">
            ⚠ This is not medical advice
          </p>
        </div>
      </div>
    </div>
  )
}
