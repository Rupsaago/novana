// src/components/SymptomForm.tsx  (REDESIGNED — icons + polished sliders)
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
  acne: 3, cramps: 3, exercise_mins: 30,
  cycle_status: 'none', notes: '',
}

// ── SVG Icons for each symptom ────────────────────────────────────────────────
const Icons = {
  mood: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeWidth="2.5"/>
      <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeWidth="2.5"/>
    </svg>
  ),
  fatigue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <path d="M12 2a10 10 0 0 0-9.95 9h11.64L9.74 7.05A1 1 0 0 1 10.86 5.5l3.67 5.5H21.95A10 10 0 0 0 12 2z"/>
      <path d="M12 12v10"/>
    </svg>
  ),
  sleep: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  stress: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  acne: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  cramps: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  exercise: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         className="w-5 h-5">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  ),
}

// ── Slider config ─────────────────────────────────────────────────────────────
const SLIDERS = [
  {
    key:      'mood'          as const,
    label:    'Mood',
    icon:     Icons.mood,
    desc:     'How are you feeling emotionally?',
    min:      1, max: 10, step: 1,
    unit:     '/10',
    color:    '#7B6FA8',
    labelLow: 'Very low', labelHigh: 'Excellent',
  },
  {
    key:      'fatigue'       as const,
    label:    'Fatigue',
    icon:     Icons.fatigue,
    desc:     'How tired or drained do you feel?',
    min:      1, max: 10, step: 1,
    unit:     '/10',
    color:    '#E8A98B',
    labelLow: 'Energised', labelHigh: 'Exhausted',
  },
  {
    key:      'sleep_hours'   as const,
    label:    'Sleep Quality',
    icon:     Icons.sleep,
    desc:     'How many hours did you sleep?',
    min:      0, max: 12, step: 0.5,
    unit:     'h',
    color:    '#8FA7C6',
    labelLow: '0h', labelHigh: '12h',
  },
  {
    key:      'stress'        as const,
    label:    'Stress',
    icon:     Icons.stress,
    desc:     'How stressed do you feel?',
    min:      1, max: 10, step: 1,
    unit:     '/10',
    color:    '#D28CA7',
    labelLow: 'Calm', labelHigh: 'Very stressed',
  },
  {
    key:      'acne'          as const,
    label:    'Acne',
    icon:     Icons.acne,
    desc:     'Any skin breakouts today?',
    min:      1, max: 10, step: 1,
    unit:     '/10',
    color:    '#C4799A',
    labelLow: 'Clear skin', labelHigh: 'Severe',
  },
  {
    key:      'cramps'        as const,
    label:    'Cramps',
    icon:     Icons.cramps,
    desc:     'Any pelvic or body pain?',
    min:      1, max: 10, step: 1,
    unit:     '/10',
    color:    '#A89ED0',
    labelLow: 'No pain', labelHigh: 'Severe',
  },
  {
    key:      'exercise_mins' as const,
    label:    'Exercise',
    icon:     Icons.exercise,
    desc:     'Minutes of movement today?',
    min:      0, max: 120, step: 5,
    unit:     'min',
    color:    '#7B9E9E',
    labelLow: 'None', labelHigh: '2 hours',
  },
]

const CYCLE_OPTIONS: { value: CycleStatus; label: string; emoji: string }[] = [
  { value: 'none',     label: 'None',     emoji: '○' },
  { value: 'spotting', label: 'Spotting', emoji: '·' },
  { value: 'light',    label: 'Light',    emoji: '◔' },
  { value: 'moderate', label: 'Moderate', emoji: '◑' },
  { value: 'heavy',    label: 'Heavy',    emoji: '●' },
]

// ── Individual symptom row ────────────────────────────────────────────────────
function SymptomRow({
  slider,
  value,
  onChange,
}: {
  slider:   typeof SLIDERS[0]
  value:    number
  onChange: (v: number) => void
}) {
  const pct = ((value - slider.min) / (slider.max - slider.min)) * 100

  return (
    <div className="py-4 border-b border-nova-border/30 last:border-0">
      <div className="flex items-center justify-between mb-3">
        {/* Icon + label */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center
                          bg-nova-bg border border-nova-border/40"
               style={{ color: slider.color }}>
            {slider.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-nova-text">{slider.label}</p>
            <p className="text-xs text-nova-muted">{slider.desc}</p>
          </div>
        </div>

        {/* Value badge */}
        <div className="min-w-[48px] text-right">
          <span className="text-base font-display tabular-nums"
                style={{ color: slider.color }}>
            {slider.key === 'sleep_hours'
              ? `${value}h`
              : slider.key === 'exercise_mins'
              ? `${value}m`
              : `${value}/10`}
          </span>
        </div>
      </div>

      {/* Custom styled slider */}
      <div className="relative px-1">
        <input
          type="range"
          min={slider.min}
          max={slider.max}
          step={slider.step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                     bg-nova-border outline-none"
          style={{
            background: `linear-gradient(to right, ${slider.color} ${pct}%, #DDD4CA ${pct}%)`,
            // Custom thumb via CSS — webkit
            WebkitAppearance: 'none',
          }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-nova-muted/50">{slider.labelLow}</span>
          <span className="text-[10px] text-nova-muted/50">{slider.labelHigh}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main SymptomForm ──────────────────────────────────────────────────────────
export default function SymptomForm() {
  const [values, setValues]                   = useState<SymptomData>(DEFAULTS)
  const [submitting, setSubmitting]           = useState(false)
  const [submitted, setSubmitted]             = useState(false)
  const [alreadyLogged, setAlreadyLogged]     = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [error, setError]                     = useState<string | null>(null)

  useEffect(() => {
    async function loadTodayEntry() {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoadingExisting(false); return }

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
      } catch { /* no entry today */ }
      finally { setLoadingExisting(false) }
    }
    loadTodayEntry()
  }, [])

  function updateField<K extends keyof SymptomData>(key: K, val: SymptomData[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
    setSubmitted(false)
    setAlreadyLogged(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setError('Not logged in. Please refresh.'); return }

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
        }, { onConflict: 'user_id,logged_at' })

      if (saveError) throw saveError
      setSubmitted(true)
      setAlreadyLogged(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingExisting) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3,4].map((i) => (
          <div key={i} className="py-4 border-b border-nova-border/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-nova-border/30" />
              <div className="space-y-1">
                <div className="h-3 bg-nova-border/40 rounded w-20" />
                <div className="h-2 bg-nova-border/20 rounded w-32" />
              </div>
            </div>
            <div className="h-1.5 bg-nova-border/30 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Banners */}
      {alreadyLogged && !submitted && (
        <div className="flex items-start gap-3 bg-nova-sky/15 border border-nova-sky/25
                        rounded-2xl px-4 py-3">
          <span className="text-base mt-0.5">📋</span>
          <p className="text-sm text-nova-muted">
            Already logged today — edit below to update.
          </p>
        </div>
      )}
      {submitted && (
        <div className="flex items-start gap-3 bg-nova-purple/10 border border-nova-purple/20
                        rounded-2xl px-4 py-3">
          <span className="text-base mt-0.5">🌅</span>
          <p className="text-sm text-nova-text font-medium">Saved! Great job checking in.</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200
                        rounded-2xl px-4 py-3">
          <span className="text-base mt-0.5">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Symptom sliders */}
      <div>
        {SLIDERS.map((slider) => (
          <SymptomRow
            key={slider.key}
            slider={slider}
            value={values[slider.key] as number}
            onChange={(v) => updateField(slider.key, v as never)}
          />
        ))}
      </div>

      {/* Cycle status */}
      <div className="pt-2">
        <p className="text-sm font-medium text-nova-text mb-1">Cycle Status</p>
        <p className="text-xs text-nova-muted mb-3">
          Helps the AI spot patterns between cycle phase and symptoms.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {CYCLE_OPTIONS.map((opt) => {
            const isSelected = values.cycle_status === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField('cycle_status', opt.value)}
                className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl
                           border text-xs font-medium transition-all duration-200
                           ${isSelected
                             ? 'bg-nova-rose/15 border-nova-rose/40 text-nova-rose'
                             : 'bg-nova-bg border-nova-border text-nova-muted hover:bg-nova-card'
                           }`}
              >
                <span className="text-lg">{opt.emoji}</span>
                <span className="leading-tight text-center">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="text-sm font-medium text-nova-text mb-1">
          Notes <span className="text-nova-muted font-normal">(optional)</span>
        </p>
        <textarea
          value={values.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          placeholder="Food, events, medication, mood context..."
          className="form-input resize-none"
          maxLength={500}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-4 rounded-2xl font-medium text-white text-sm
                   transition-all duration-200 shadow-nova-sm
                   ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-nova active:scale-98'}
                  `}
        style={{
          background: submitting
            ? '#A89ED0'
            : 'linear-gradient(135deg, #7B6FA8 0%, #D28CA7 100%)',
        }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Saving...
          </span>
        ) : submitted ? '✓ Saved for today!'
          : alreadyLogged ? 'Update today\'s log'
          : 'Save Today\'s Log ♡'}
      </button>

      <p className="text-center text-xs text-nova-muted/40">
        ⚠ Not medical advice · Novana provides pattern insights only
      </p>
    </form>
  )
}
