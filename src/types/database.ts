export type CycleStatus = 'none' | 'spotting' | 'light' | 'moderate' | 'heavy'

export interface Database {
  public: {
    Tables: {

      profiles: {
        Row: {
          id:         string
          email:      string
          full_name:  string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id:          string
          email:       string
          full_name?:  string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?:         string
          email?:      string
          full_name?:  string | null
          updated_at?: string
        }
        Relationships: []
      }

      symptoms: {
        Row: {
          id:            string
          user_id:       string
          logged_at:     string
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
          id?:           string
          user_id:       string
          logged_at?:    string
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
        Relationships: []
      }

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
        Relationships: []
      }
    }

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
        Relationships: []
      }
    }

    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>
    Enums:     Record<string, string[]>
  }
}

export type ProfileRow    = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export type SymptomRow    = Database['public']['Tables']['symptoms']['Row']
export type SymptomInsert = Database['public']['Tables']['symptoms']['Insert']
export type SymptomUpdate = Database['public']['Tables']['symptoms']['Update']

export type JournalRow    = Database['public']['Tables']['journal_entries']['Row']
export type JournalInsert = Database['public']['Tables']['journal_entries']['Insert']

export type SymptomAvgRow = Database['public']['Views']['symptom_averages_30d']['Row']
