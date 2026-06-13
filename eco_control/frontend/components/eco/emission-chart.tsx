"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { driverEmissionHistory } from "@/lib/eco-data"

const LEGAL_LIMIT = 800

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const value = payload[0].value as number
  const over = value > LEGAL_LIMIT
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground">{label} 2026</p>
      <p
        className="mt-0.5 text-sm font-semibold"
        style={{ color: over ? "var(--eco-bad)" : "var(--eco-good)" }}
      >
        {value} PPM CO
      </p>
      <p className="text-[10px] text-muted-foreground">
        {over ? `+${value - LEGAL_LIMIT} over limit` : `${LEGAL_LIMIT - value} under limit`}
      </p>
    </div>
  )
}

export function EmissionChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={driverEmissionHistory} margin={{ top: 10, right: 12, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="coFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--eco-good)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--eco-good)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            domain={[0, 1300]}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)" }} />
          <ReferenceLine
            y={LEGAL_LIMIT}
            stroke="var(--eco-bad)"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: "Legal Limit 800 PPM",
              position: "insideTopRight",
              fill: "var(--eco-bad)",
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="co"
            stroke="var(--eco-good)"
            strokeWidth={2.5}
            fill="url(#coFill)"
            dot={{ r: 3, fill: "var(--eco-good)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
