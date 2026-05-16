// src/components/SymptomForm.tsx  (FIXED — better auth + error handling)
'use client'

import { useState, useEffect } from 'react'
import { createClient }        from '@/lib/supabase'
import type { CycleStatus }    from '@/types/database'

interface SymptomData {
  mood:          number
  fatigue:       number
  sleep_hours:   number
  stress:        number
  acne:          number
  cramps:        number
  exercise_mins: number
  cycle_status:  CycleStatus
  notes:         string
}

const DEFAULTS: SymptomData = {
  mood: 5, fatigue: 5, sleep_hours: 7, stress: 5,
  acne: 3, cramps: 3, exercise_mins: 30, cycle_status: 'none', notes: '',
}

const SLIDERS = [
  { key: 'mood'          as const, label: 'Mood',          emoji: '🌤', desc: 'How are you feeling emotionally?',   min: 1,  max: 10,  step: 1,   unit: '/10', labelLow: 'Very low',   labelHigh: 'Excellent',       getColor: (v: number) => v >= 7 ? 'accent-nova-purple' : v >= 4 ? 'accent-nova-peach' : 'accent-nova-rose'   },
  { key: 'fatigue'       as const, label: 'Fatigue',       emoji: '💤', desc: 'How tired do you feel?',             min: 1,  max: 10,  step: 1,   unit: '/10', labelLow: 'Energised',  labelHigh: 'Exhausted',       getColor: (v: number) => v >= 7 ? 'accent-nova-rose'   : v >= 4 ? 'accent-nova-peach' : 'accent-nova-sky'    },
  { key: 'sleep_hours'   as const, label: 'Sleep',         emoji: '🌙', desc: 'Hours of sleep last night?',         min: 0,  max: 12,  step: 0.5, unit: 'hrs', labelLow: '0 hours',    labelHigh: '12 hours',        getColor: (v: number) => v >= 7 ? 'accent-nova-sky'    : v >= 5 ? 'accent-nova-peach' : 'accent-nova-rose'   },
  { key: 'stress'        as const, label: 'Stress',        emoji: '🌀', desc: 'How stressed do you feel?',          min: 1,  max: 10,  step: 1,   unit: '/10', labelLow: 'Calm',       labelHigh: 'Very stressed',   getColor: (v: number) => v >= 7 ? 'accent-nova-rose'   : v >= 4 ? 'accent-nova-peach' : 'accent-nova-sky'    },
  { key: 'acne'          as const, label: 'Acne / Skin',   emoji: '🌸', desc: 'Any skin breakouts today?',          min: 1,  max: 10,  step: 1,   unit: '/10', labelLow: 'Clear skin', labelHigh: 'Severe breakout', getColor: (v: number) => v >= 7 ? 'accent-nova-rose'   : v >= 4 ? 'accent-nova-peach' : 'accent-nova-purple' },
  { key: 'cramps'        as const, label: 'Cramps / Pain', emoji: '⚡', desc: 'Any pelvic or body cramps?',         min: 1,  max: 10,  step: 1,   unit: '/10', labelLow: 'No pain',    labelHigh: 'Severe pain',     getColor: (v: number) => v >= 7 ? 'accent-nova-rose'   : v >= 4 ? 'accent-nova-peach' : 'accent-nova-sky'    },
  { key: 'exercise_mins' as const, label: 'Exercise',      emoji: '🏃‍♀️', desc: 'Minutes of movement today?',        min: 0,  max: 120, step: 5,   unit: 'min', labelLow: 'None',       labelHigh: '2 hours',         getColor: (v: number) => v >= 45 ? 'accent-nova-purple': v >= 15 ? 'accent-nova-peach' : 'accent-nova-sky'   },
]

const CYCLE_OPTIONS: { value: CycleStatus; label: string; emoji: string }[] = [
  { value: 'none',     label: 'None',     emoji: '○' },
  { value: 'spotting', label: 'Spotting', emoji: '·' },
  { value: 'light',    label: 'Light',    emoji: '◔' },
  { value: 'moderate', label: 'Moderate', emoji: '◑' },
  { value: 'heavy',    label: 'Heavy',    emoji: '●' },
]

export default function SymptomForm() {
  const [values, setValues]               = useState<SymptomData>(DEFAULTS)
  const [submitting, setSubmitting]       = useState(false)
  const [submitted, setSubmitted]         = useState(false)
  const [alreadyLogged, setAlreadyLogged] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [error, setError]                 = useState<string | null>(null)

  // ── Load today's existing entry directly from Supabase ─────────────────────
  // We query Supabase directly instead of going through the API route
  // to avoid auth cookie issues on mobile/production
  useEffect(() => {
    async function loadTodayEntry() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setLoadingExisting(false)
          return
        }

        const today = new Date().toISOString().split('T')[0]
        const { data } = await supabase
          .from('symptoms')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('logged_at', today)
          .single()

        if (data) {
          setValues({
            mood:          data.mood,
            fatigue:       data.fatigue,
            sleep_hours:   data.sleep_hours,
            stress:        data.stress,
            acne:          data.acne,
            cramps:        data.cramps,
            exercise_mins: data.exercise_mins,
            cycle_status:  data.cycle_status,
            notes:         data.notes ?? '',
          })
          setAlreadyLogged(true)
        }
      } catch (err) {
        console.warn('Could not load existing entry:', err)
      } finally {
        setLoadingExisting(false)
      }
    }
    loadTodayEntry()
  }, [])

  function updateField<K extends keyof SymptomData>(key: K, value: SymptomData[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setSubmitted(false)
    setAlreadyLogged(false)
  }

  // ── Save directly to Supabase instead of going through API route ───────────
  // This is more reliable on mobile because it uses the browser Supabase client
  // which manages its own session cookies
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setError('You are not logged in. Please refresh the page and try again.')
        return
      }

      const today = new Date().toISOString().split('T')[0]

      const { error: saveError } = await supabase
        .from('symptoms')
        .upsert({
          user_id:       session.user.id,
          logged_at:     today,
          mood:          values.mood,
          fatigue:       values.fatigue,
          sleep_hours:   values.sleep_hours,
          stress:        values.stress,
          acne:          values.acne,
          cramps:        values.cramps,
          exercise_mins: values.exercise_mins,
          cycle_status:  values.cycle_status,
          notes:         values.notes || null,
        }, {
          onConflict: 'user_id,logged_at',
        })

      if (saveError) throw saveError

      setSubmitted(true)
      setAlreadyLogged(true)

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setError(message)
      console.error('[SymptomForm submit]', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingExisting) {
    return (
      <div className="card space-y-4 animate-pulse">
        <div className="h-6 bg-nova-border/50 rounded-xl w-40" />
        {[1,2,3,4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-nova-border/40 rounded-lg w-24" />
            <div className="h-2 bg-nova-border/30 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {alreadyLogged && !submitted && (
        <div className="flex items-start gap-3 bg-nova-sky/15 border border-nova-sky/30
                        rounded-2xl px-5 py-4">
          <span className="text-lg mt-0.5">📋</span>
          <div>
            <p className="text-sm font-medium text-nova-text">Already logged today</p>
            <p className="text-xs text-nova-muted mt-0.5">
              Your existing values are shown. Edit and save to update them.
            </p>
          </div>
        </div>
      )}

      {submitted && (
        <div className="flex items-start gap-3 bg-nova-purple/10 border border-nova-purple/25
                        rounded-2xl px-5 py-4">
          <span className="text-lg mt-0.5">🌅</span>
          <div>
            <p className="text-sm font-medium text-nova-text">Saved!</p>
            <p className="text-xs text-nova-muted mt-0.5">
              Your check-in is saved. See trends in Analytics.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200
                        rounded-2xl px-5 py-4">
          <span className="text-lg mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-medium text-red-700">Could not save</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="card space-y-8">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl text-nova-text">Symptom sliders</h3>
          <span className="pill">7 readings</span>
        </div>

        {SLIDERS.map((slider) => {
          const value = values[slider.key] as number
          return (
            <div key={slider.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{slider.emoji}</span>
                  <div>
                    <label htmlFor={slider.key}
                           className="block text-sm font-medium text-nova-text">
                      {slider.label}
                    </label>
                    <p className="text-xs text-nova-muted">{slider.desc}</p>
                  </div>
                </div>
                <span className="text-lg font-display text-nova-purple min-w-[52px]
                                 text-right tabular-nums">
                  {slider.key === 'sleep_hours' ? `${value}h`
                   : slider.key === 'exercise_mins' ? `${value}m`
                   : `${value}/10`}
                </span>
              </div>
              <input
                id={slider.key}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={(e) =>
                  updateField(slider.key, parseFloat(e.target.value) as never)
                }
                className={`symptom-slider ${slider.getColor(value)}`}
              />
              <div className="flex justify-between">
                <span className="text-xs text-nova-muted/60">{slider.labelLow}</span>
                <span className="text-xs text-nova-muted/60">{slider.labelHigh}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card space-y-4">
        <div>
          <h3 className="font-display text-xl text-nova-text mb-1">Cycle status</h3>
          <p className="text-xs text-nova-muted">
            Helps the AI spot patterns between cycle phase and symptoms.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CYCLE_OPTIONS.map((opt) => {
            const isSelected = values.cycle_status === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('cycle_status', opt.value)}
                className={`flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl
                           border text-sm transition-all duration-200 font-medium
                           ${isSelected
                             ? 'bg-nova-rose/15 border-nova-rose/40 text-nova-rose shadow-nova-sm'
                             : 'bg-nova-bg border-nova-border text-nova-muted hover:bg-nova-card'
                           }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-xs text-center leading-tight">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card space-y-3">
        <div>
          <h3 className="font-display text-xl text-nova-text mb-1">
            Notes{' '}
            <span className="text-nova-muted text-base font-sans font-normal">
              (optional)
            </span>
          </h3>
          <p className="text-xs text-nova-muted">
            Food, events, medications. Helps the AI give better insights.
          </p>
        </div>
        <textarea
          value={values.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          placeholder="e.g. Stressful day, skipped lunch, headache around 3pm..."
          className="form-input resize-none"
          maxLength={500}
        />
        <p className="text-right text-xs text-nova-muted/50">{values.notes.length}/500</p>
      </div>

      {/* Summary preview */}
      <div className="bg-nova-card/60 border border-nova-border/40 rounded-3xl p-5">
        <p className="text-xs font-medium text-nova-muted uppercase tracking-widest mb-4">
          Summary preview
        </p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {[
            { label: 'Mood',     val: `${values.mood}/10`,        color: 'text-nova-purple' },
            { label: 'Fatigue',  val: `${values.fatigue}/10`,     color: 'text-nova-peach'  },
            { label: 'Sleep',    val: `${values.sleep_hours}h`,   color: 'text-nova-sky'    },
            { label: 'Stress',   val: `${values.stress}/10`,      color: 'text-nova-rose'   },
            { label: 'Acne',     val: `${values.acne}/10`,        color: 'text-nova-peach'  },
            { label: 'Cramps',   val: `${values.cramps}/10`,      color: 'text-nova-rose'   },
            { label: 'Exercise', val: `${values.exercise_mins}m`, color: 'text-nova-purple' },
            { label: 'Cycle',    val: values.cycle_status,        color: 'text-nova-rose'   },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 text-center">
              <span className={`text-base font-display ${item.color}`}>{item.val}</span>
              <span className="text-xs text-nova-muted/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <button
          type="submit"
          disabled={submitting}
          className={`btn-primary text-base px-8 py-4 w-full sm:w-auto
                     ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving...
            </span>
          ) : submitted ? '✓ Saved!'
            : alreadyLogged ? 'Update today\'s log →'
            : 'Save today\'s log →'}
        </button>
        {!submitted && (
          <button type="button" onClick={() => setValues(DEFAULTS)}
                  className="btn-ghost text-sm">
            Reset
          </button>
        )}
      </div>

      <p className="text-xs text-nova-muted/50 leading-relaxed">
        ⚠ Not medical advice. Novana provides pattern insights only.
      </p>
    </form>
  )
}
