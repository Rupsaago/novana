// src/types/database.ts
// ═══════════════════════════════════════════════════════════════════════════
// TypeScript types that match your Supabase database schema exactly.
//
// WHY DOES THIS FILE EXIST?
// When you query Supabase — e.g. supabase.from('symptoms').select('*') —
// TypeScript needs to know what shape the data will come back as.
// This file teaches TypeScript the shape of every table.
//
// In a production app you'd generate this file automatically with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID
//
// For now, we've written it by hand to match our schema.sql exactly.
// ═══════════════════════════════════════════════════════════════════════════

export type CycleStatus = 'none' | 'spotting' | 'light' | 'moderate' | 'heavy'

// Database type — passed as a generic to createBrowserClient<Database>
// This unlocks autocomplete when you type supabase.from('symptoms')
export interface Database {
  public: {
    Tables: {

      // ── profiles table ───────────────────────────────────────────────────
      profiles: {
        // Row = what you get back when you SELECT
        Row: {
          id:         string
          email:      string
          full_name:  string | null
          created_at: string
          updated_at: string
        }
        // Insert = what you send when you INSERT (id required, rest optional)
        Insert: {
          id:         string
          email:      string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        // Update = what you send when you UPDATE (all fields optional)
        Update: {
          id?:         string
          email?:      string
          full_name?:  string | null
          updated_at?: string
        }
      }

      // ── symptoms table ───────────────────────────────────────────────────
      symptoms: {
        Row: {
          id:            string
          user_id:       string
          logged_at:     string    // date string e.g. "2026-05-14"
          mood:          number
          fatigue:       number
          sleep_hours:   number
          stress:        number
          acne:          number
          cramps:        number
          exercise_mins: number
          cycle_status:  CycleStatus
          notes:         string | null
          created_at:    string
        }
        Insert: {
          id?:           string    // optional — DB generates it
          user_id:       string
          logged_at?:    string    // optional — DB defaults to today
          mood:          number
          fatigue:       number
          sleep_hours:   number
          stress:        number
          acne:          number
          cramps:        number
          exercise_mins: number
          cycle_status:  CycleStatus
          notes?:        string | null
          created_at?:   string
        }
        Update: {
          mood?:          number
          fatigue?:       number
          sleep_hours?:   number
          stress?:        number
          acne?:          number
          cramps?:        number
          exercise_mins?: number
          cycle_status?:  CycleStatus
          notes?:         string | null
        }
      }

      // ── journal_entries table ────────────────────────────────────────────
      journal_entries: {
        Row: {
          id:          string
          user_id:     string
          content:     string
          ai_summary:  string | null
          created_at:  string
          updated_at:  string
        }
        Insert: {
          id?:         string
          user_id:     string
          content:     string
          ai_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?:    string
          ai_summary?: string | null
          updated_at?: string
        }
      }
    }

    // ── Views ────────────────────────────────────────────────────────────────
    Views: {
      symptom_averages_30d: {
        Row: {
          user_id:           string
          avg_mood:          number | null
          avg_fatigue:       number | null
          avg_sleep_hours:   number | null
          avg_stress:        number | null
          avg_acne:          number | null
          avg_cramps:        number | null
          avg_exercise_mins: number | null
          total_days_logged: number | null
        }
      }
    }

    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}

// ── Convenience type aliases ─────────────────────────────────────────────────
// These let you write "SymptomRow" instead of "Database['public']['Tables']['symptoms']['Row']"

export type ProfileRow        = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert     = Database['public']['Tables']['profiles']['Insert']

export type SymptomRow        = Database['public']['Tables']['symptoms']['Row']
export type SymptomInsert     = Database['public']['Tables']['symptoms']['Insert']
export type SymptomUpdate     = Database['public']['Tables']['symptoms']['Update']

export type JournalRow        = Database['public']['Tables']['journal_entries']['Row']
export type JournalInsert     = Database['public']['Tables']['journal_entries']['Insert']

export type SymptomAvgRow     = Database['public']['Views']['symptom_averages_30d']['Row']
