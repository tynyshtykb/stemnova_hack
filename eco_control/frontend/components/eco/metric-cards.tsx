import { TrendingUp, TrendingDown, Minus, Car, AlertTriangle, Gauge, Radio } from "lucide-react"
import { adminMetrics } from "@/lib/eco-data"
import { cn } from "@/lib/utils"

const icons = [Car, AlertTriangle, Gauge, Radio]

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {adminMetrics.map((m, i) => {
        const Icon = icons[i]
        const TrendIcon =
          m.trend === "up" ? TrendingUp : m.trend === "down" ? TrendingDown : Minus
        return (
          <div
            key={m.label}
            className="glass rounded-2xl p-4 transition hover:ring-1 hover:ring-eco-good/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-4.5 w-4.5 text-eco-good" />
              </div>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  m.trend === "up" && "text-eco-warn",
                  m.trend === "down" && "text-eco-good",
                  m.trend === "flat" && "text-muted-foreground",
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {m.delta}
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{m.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{m.label}</p>
          </div>
        )
      })}
    </div>
  )
}
