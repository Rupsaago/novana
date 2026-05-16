// src/app/dashboard/page.tsx  (PHASE 4 VERSION)
// ═══════════════════════════════════════════════════════════════════════════
// WHAT CHANGED FROM PHASE 2:
//   - Reads real user name from Supabase session
//   - Loads real 30-day averages from the database
//   - Shows real streak count
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import SymptomForm from '@/components/SymptomForm'
import type { SymptomAvgRow } from '@/types/database'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const [firstName, setFirstName]   = useState('there')
  const [averages, setAverages]     = useState<SymptomAvgRow | null>(null)
  const [streak, setStreak]         = useState(0)
  const [monthCount, setMonthCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get user info
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const name = session.user.user_metadata?.full_name
          ?? session.user.email?.split('@')[0]
          ?? 'there'
        setFirstName(name.split(' ')[0])
      }

      if (!session?.user) return

      // Get 30-day averages from our view
      const { data: avgData } = await supabase
        .from('symptom_averages_30d')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (avgData) {
        setAverages(avgData)
        setMonthCount(avgData.total_days_logged ?? 0)
      }

      // Calculate streak — get last 60 days and count consecutive days from today
      const { data: recentSymptoms } = await supabase
        .from('symptoms')
        .select('logged_at')
        .eq('user_id', session.user.id)
        .order('logged_at', { ascending: false })
        .limit(60)

      if (recentSymptoms && recentSymptoms.length > 0) {
        let streakCount = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < recentSymptoms.length; i++) {
          const logDate = new Date(recentSymptoms[i].logged_at)
          logDate.setHours(0, 0, 0, 0)
          const expectedDate = new Date(today)
          expectedDate.setDate(today.getDate() - i)

          if (logDate.getTime() === expectedDate.getTime()) {
            streakCount++
          } else {
            break
          }
        }
        setStreak(streakCount)
      }
    }

    loadData()
  }, [])

  const greeting = getGreeting()

  return (
    <div className="space-y-8">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-nova-text">
            {greeting}, {firstName} ✦
          </h1>
          <p className="text-nova-muted mt-1 text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>

        {/* Streak + month count */}
        <div className="flex items-center gap-3">
          <div className="card-sm flex items-center gap-2.5 !py-3 !px-4">
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-xs text-nova-muted">Current streak</p>
              <p className="text-sm font-medium text-nova-text">
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
          <div className="card-sm flex items-center gap-2.5 !py-3 !px-4">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-xs text-nova-muted">Logged this month</p>
              <p className="text-sm font-medium text-nova-text">
                {monthCount} {monthCount === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 30-day stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Avg mood',
            val:   averages?.avg_mood    ?? '—',
            unit:  averages ? '/10' : '',
            color: 'text-nova-purple',
          },
          {
            label: 'Avg sleep',
            val:   averages?.avg_sleep_hours ?? '—',
            unit:  averages ? 'hrs' : '',
            color: 'text-nova-sky',
          },
          {
            label: 'Avg fatigue',
            val:   averages?.avg_fatigue ?? '—',
            unit:  averages ? '/10' : '',
            color: 'text-nova-peach',
          },
          {
            label: 'Avg stress',
            val:   averages?.avg_stress  ?? '—',
            unit:  averages ? '/10' : '',
            color: 'text-nova-rose',
          },
        ].map((stat) => (
          <div key={stat.label} className="card-sm">
            <p className="text-xs text-nova-muted mb-1">{stat.label}</p>
            <p className={`text-2xl font-display ${stat.color}`}>
              {stat.val}
              <span className="text-sm text-nova-muted font-sans ml-0.5">{stat.unit}</span>
            </p>
            <p className="text-xs text-nova-muted/60 mt-1">Last 30 days</p>
          </div>
        ))}
      </div>

      {/* ── Symptom form ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl text-nova-text mb-2">
          Today's check-in
        </h2>
        <p className="text-nova-muted text-sm mb-6">
          Slide each symptom to reflect how you're feeling right now.
          Takes about 60 seconds.
        </p>
        <SymptomForm />
      </div>
    </div>
  )
}
