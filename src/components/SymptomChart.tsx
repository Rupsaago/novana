// src/components/SymptomChart.tsx
// ═══════════════════════════════════════════════════════════════════════════
// Reusable chart component built with Recharts.
// Renders a responsive line chart for any symptom field.
// ═══════════════════════════════════════════════════════════════════════════

'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────
interface DataPoint {
  date:          string
  mood?:         number
  fatigue?:      number
  sleep_hours?:  number
  stress?:       number
  acne?:         number
  cramps?:       number
  exercise_mins?: number
  [key: string]: unknown
}

interface SymptomChartProps {
  data:       DataPoint[]
  dataKey:    string           // which field to plot e.g. 'mood'
  color:      string           // hex color for the line
  label:      string           // human label e.g. 'Mood'
  unit?:      string           // unit suffix e.g. '/10' or 'h'
  maxY?:      number           // max Y axis value
  avgValue?:  number | null    // show a reference line at the average
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
// The little popup that appears when you hover over a data point
function CustomTooltip({
  active,
  payload,
  label,
  unit,
  color,
}: {
  active?:  boolean
  payload?: Array<{ value: number }>
  label?:   string
  unit?:    string
  color:    string
}) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-nova-white border border-nova-border/40 rounded-2xl
                    px-4 py-3 shadow-nova text-sm">
      <p className="text-nova-muted text-xs mb-1">{label}</p>
      <p className="font-display text-lg" style={{ color }}>
        {payload[0].value}
        <span className="text-nova-muted text-sm font-sans ml-0.5">{unit}</span>
      </p>
    </div>
  )
}

// ── Main chart component ──────────────────────────────────────────────────────
export default function SymptomChart({
  data,
  dataKey,
  color,
  label,
  unit    = '',
  maxY    = 10,
  avgValue,
}: SymptomChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-nova-muted text-sm">
        No data yet for this period
      </div>
    )
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
        >
          {/* Grid lines */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#DDD4CA"
            strokeOpacity={0.5}
            vertical={false}
          />

          {/* X axis — dates */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#6F6A66' }}
            tickLine={false}
            axisLine={false}
            // Only show every other label if there are lots of data points
            interval={data.length > 14 ? Math.floor(data.length / 7) : 0}
          />

          {/* Y axis — values */}
          <YAxis
            domain={[0, maxY]}
            tick={{ fontSize: 10, fill: '#6F6A66' }}
            tickLine={false}
            axisLine={false}
            tickCount={5}
          />

          {/* Hover tooltip */}
          <Tooltip
            content={
              <CustomTooltip unit={unit} color={color} />
            }
            cursor={{ stroke: color, strokeWidth: 1, strokeOpacity: 0.3 }}
          />

          {/* Average reference line */}
          {avgValue !== null && avgValue !== undefined && (
            <ReferenceLine
              y={avgValue}
              stroke={color}
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{
                value:    `avg ${avgValue}`,
                position: 'insideTopRight',
                fontSize: 9,
                fill:     color,
                opacity:  0.6,
              }}
            />
          )}

          {/* The actual line */}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            dot={{
              r:           3,
              fill:        color,
              strokeWidth: 0,
            }}
            activeDot={{
              r:           5,
              fill:        color,
              stroke:      '#FDFAF7',
              strokeWidth: 2,
            }}
            connectNulls  // connect the line even if there are missing days
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
