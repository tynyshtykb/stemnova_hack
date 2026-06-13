"use client"

import dynamic from "next/dynamic"
import { Layers, MapPin } from "lucide-react"
import { MetricCards } from "./metric-cards"
import { ViolatorsFeed } from "./violators-feed"
import { sensors } from "@/lib/eco-data"

const EcoMap = dynamic(() => import("./eco-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary/30">
      <p className="animate-pulse text-sm text-muted-foreground">Loading live map…</p>
    </div>
  ),
})

export function AdminDashboard() {
  const alerts = sensors.filter((s) => s.status === "alert").length

  return (
    <div className="space-y-4 p-4 md:p-6">
      <MetricCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65fr_35fr]">
        {/* Map panel */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card/40">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Layers className="h-4 w-4 text-eco-good" />
                Live Eco-Sensor Grid
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Astana · {sensors.length} active sensors · {alerts} in alert
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-eco-good" /> Clean
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-eco-bad" /> Polluted
              </span>
            </div>
          </div>
          <div className="h-[420px] w-full lg:h-[560px]">
            <EcoMap />
          </div>
          <div className="flex items-center gap-2 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Click any sensor marker for detailed readings and the last-hour CO trend.
          </div>
        </section>

        {/* Violators feed */}
        <section className="h-[480px] lg:h-[635px]">
          <ViolatorsFeed />
        </section>
      </div>
    </div>
  )
}
