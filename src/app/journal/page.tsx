// src/app/journal/page.tsx  (PHASE 5 VERSION)
// ═══════════════════════════════════════════════════════════════════════════
// Journal Page — free text writing with AI emotional pattern summaries.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import type { JournalRow }     from '@/types/database'

// ── Journal entry card ────────────────────────────────────────────────────────
function JournalEntryCard({
  entry,
  onSummarise,
  summarising,
}: {
  entry:       JournalRow
  onSummarise: (id: string, content: string) => void
  summarising: boolean
}) {
  const date = new Date(entry.created_at).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
  const time = new Date(entry.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="card space-y-4">
      {/* Date + time */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-nova-text">{date}</p>
          <p className="text-xs text-nova-muted">{time}</p>
        </div>
        <span className="text-2xl">📓</span>
      </div>

      {/* Journal content */}
      <p className="text-nova-muted text-sm leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>

      {/* AI summary — shown if one exists */}
      {entry.ai_summary && (
        <div className="bg-nova-purple/8 border border-nova-purple/20 rounded-2xl px-4 py-3">
          <p className="text-xs font-medium text-nova-purple mb-1">✨ AI summary</p>
          <p className="text-xs text-nova-muted leading-relaxed">{entry.ai_summary}</p>
        </div>
      )}

      {/* Summarise button — only if no summary yet */}
      {!entry.ai_summary && (
        <button
          onClick={() => onSummarise(entry.id, entry.content)}
          disabled={summarising}
          className={`btn-secondary text-sm w-full justify-center
                     ${summarising ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {summarising ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Summarising...
            </span>
          ) : '✨ Summarise with AI'}
        </button>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function JournalPage() {
  const [entries, setEntries]           = useState<JournalRow[]>([])
  const [content, setContent]           = useState('')
  const [saving, setSaving]             = useState(false)
  const [loading, setLoading]           = useState(true)
  const [summarising, setSummarising]   = useState<string | null>(null) // entry ID being summarised
  const [saveSuccess, setSaveSuccess]   = useState(false)
  const [error, setError]               = useState<string | null>(null)

  // ── Load existing entries on mount ─────────────────────────────────────────
  useEffect(() => {
    async function loadEntries() {
      try {
        const res  = await fetch('/api/journal')
        const json = await res.json()
        if (json.data) setEntries(json.data)
      } catch (err) {
        console.error('Failed to load journal entries:', err)
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  // ── Save new entry ─────────────────────────────────────────────────────────
  async function handleSave() {
    if (!content.trim()) return
    setSaving(true)
    setError(null)

    try {
      const res  = await fetch('/api/journal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Failed to save.')
        return
      }

      // Add new entry to the top of the list
      setEntries((prev) => [json.data, ...prev])
      setContent('')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)

    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── AI summarise an entry ──────────────────────────────────────────────────
  async function handleSummarise(entryId: string, entryContent: string) {
    setSummarising(entryId)

    try {
      const res  = await fetch('/api/journal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          action:  'summarise',
          content: entryContent,
          entryId,
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Failed to summarise.')
        return
      }

      // Update the entry in state with the new summary
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, ai_summary: json.summary } : e
        )
      )

    } catch {
      setError('Failed to summarise. Please try again.')
    } finally {
      setSummarising(null)
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-nova-text">
          Journal ✦
        </h1>
        <p className="text-nova-muted mt-1 text-sm">
          Write freely. The AI can summarise your emotional patterns.
        </p>
      </div>

      {/* ── New entry form ────────────────────────────────────────────────── */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-nova-text">New entry</h2>
          <span className="text-nova-muted text-sm">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200
                          rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="flex items-center gap-2 bg-nova-sky/15 border border-nova-sky/30
                          rounded-xl px-4 py-3">
            <span>✅</span>
            <p className="text-sm text-nova-text">Entry saved!</p>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError(null)
          }}
          rows={6}
          placeholder="How are you feeling today? What's on your mind? Write anything — there's no right or wrong here."
          className="form-input resize-none"
          maxLength={5000}
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-nova-muted/50">{content.length}/5000</p>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className={`btn-primary px-6 py-2.5
                       ${(saving || !content.trim()) ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Saving...
              </span>
            ) : 'Save entry →'}
          </button>
        </div>

        <p className="text-xs text-nova-muted/50">
          ⚠ Your journal is private. AI summaries are optional and generated on-demand only.
        </p>
      </div>

      {/* ── Past entries ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-xl text-nova-text mb-4">Past entries</h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse space-y-3">
                <div className="h-4 bg-nova-border/50 rounded w-32" />
                <div className="h-3 bg-nova-border/30 rounded" />
                <div className="h-3 bg-nova-border/30 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-nova-muted text-sm">
              No entries yet. Write your first one above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onSummarise={handleSummarise}
                summarising={summarising === entry.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
