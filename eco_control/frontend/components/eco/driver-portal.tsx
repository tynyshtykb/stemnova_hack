"use client"

import {
  Car,
  Gauge,
  ScanLine,
  AlertTriangle,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
} from "lucide-react"
import { EmissionChart } from "./emission-chart"
import { StatusBadge } from "./status-badge"
import {
  driverProfile,
  driverTickets,
  formatCurrency,
  type EcoRating,
} from "@/lib/eco-data"
import { cn } from "@/lib/utils"

const ratingTone: Record<EcoRating, "good" | "warn" | "bad"> = {
  A: "good",
  B: "good",
  C: "warn",
  Critical: "bad",
}

const ratingColor: Record<EcoRating, string> = {
  A: "text-eco-good",
  B: "text-eco-good",
  C: "text-eco-warn",
  Critical: "text-eco-bad",
}

const statusTone = {
  Unpaid: "bad",
  Disputed: "warn",
  Paid: "good",
} as const

export function DriverPortal() {
  const p = driverProfile
  const totalDue = driverTickets
    .filter((t) => t.status !== "Paid")
    .reduce((sum, t) => sum + t.fine, 0)

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Profile header */}
      <section className="glass rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary ring-1 ring-border">
              <Car className="h-8 w-8 text-eco-good" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{p.name}</p>
              <h2 className="text-xl font-semibold tracking-tight">
                {p.make} {p.model}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-sm font-semibold tracking-wider ring-1 ring-border">
                  {p.plate}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.year} · {p.color}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Eco-Rating
              </p>
              <p className={cn("text-4xl font-bold leading-none", ratingColor[p.rating])}>
                {p.rating}
              </p>
            </div>
            <div className="max-w-[160px] border-l border-border pl-3">
              <StatusBadge tone={ratingTone[p.rating]} dot>
                Needs attention
              </StatusBadge>
              <p className="mt-1.5 text-[11px] text-muted-foreground">{p.ratingNote}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MiniStat icon={ScanLine} label="Total Scans" value={`${p.totalScans}`} />
          <MiniStat icon={AlertTriangle} label="Flagged" value={`${p.flagged}`} tone="warn" />
          <MiniStat icon={Gauge} label="Peak CO" value="1,180 PPM" tone="bad" />
          <MiniStat icon={FileText} label="Total Due" value={formatCurrency(totalDue)} tone="bad" />
        </div>
      </section>

      {/* Chart */}
      <section className="rounded-2xl border border-border bg-card/40 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-eco-good" />
              Vehicle Emission History
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              CO levels (PPM) · last 6 months
            </p>
          </div>
          <StatusBadge tone="bad" dot>
            Limit exceeded 3×
          </StatusBadge>
        </div>
        <EmissionChart />
      </section>

      {/* Tickets inbox */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-eco-good" />
          Violation Notices &amp; Tickets
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {driverTickets.map((t) => (
            <article
              key={t.id}
              className="overflow-hidden rounded-2xl border border-border bg-card/40"
            >
              <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2.5">
                <span className="flex items-center gap-2 text-xs font-medium">
                  <span className="font-mono text-muted-foreground">{t.id}</span>
                </span>
                <StatusBadge tone={statusTone[t.status]} dot>
                  {t.status}
                </StatusBadge>
              </div>
              <div className="flex gap-3 p-4">
                <img
                  src={t.image || "/placeholder.svg"}
                  alt={`Camera snapshot for violation ${t.id}`}
                  className="h-24 w-28 shrink-0 rounded-lg object-cover ring-1 ring-border"
                  crossOrigin="anonymous"
                />
                <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> {t.date}
                  </p>
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {t.location}
                  </p>
                  <p className="font-semibold text-eco-bad">
                    {t.gas}: {t.level} {t.unit}{" "}
                    <span className="font-normal text-muted-foreground">
                      (limit {t.limit})
                    </span>
                  </p>
                  <p className="pt-1 text-sm font-semibold text-foreground">
                    Fine: {formatCurrency(t.fine)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: typeof Gauge
  label: string
  value: string
  tone?: "neutral" | "warn" | "bad"
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-3">
      <Icon
        className={cn(
          "h-4 w-4",
          tone === "neutral" && "text-muted-foreground",
          tone === "warn" && "text-eco-warn",
          tone === "bad" && "text-eco-bad",
        )}
      />
      <p className="mt-2 text-lg font-semibold tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}
