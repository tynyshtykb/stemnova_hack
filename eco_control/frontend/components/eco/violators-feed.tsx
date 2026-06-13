"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Clock, Radio } from "lucide-react"
import { violations, formatCurrency, type Violation } from "@/lib/eco-data"

export function ViolatorsFeed() {
  // Continuously cycle the feed to simulate a live stream.
  const [items, setItems] = useState<Violation[]>(violations)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev
        const bumped: Violation = {
          ...first,
          id: `V-${90413 + Math.floor(Math.random() * 900)}`,
          time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        }
        return [bumped, ...rest]
      })
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eco-bad opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-eco-bad" />
            </span>
            Recent Violations
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Live emissions feed</p>
        </div>
        <Radio className="h-4 w-4 text-eco-bad" />
      </div>

      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto p-3">
        {items.map((v, i) => (
          <article
            key={`${v.id}-${i}`}
            className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-2.5 transition hover:border-eco-bad/30 hover:bg-secondary/70"
          >
            <img
              src={v.image || "/placeholder.svg"}
              alt={`Traffic camera snapshot of ${v.vehicle}`}
              className="h-16 w-20 shrink-0 rounded-lg object-cover ring-1 ring-border"
              crossOrigin="anonymous"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs font-semibold tracking-wider text-foreground ring-1 ring-border">
                  {v.plate}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">{v.id}</span>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">{v.vehicle}</p>
              <p className="mt-1 text-xs font-semibold text-eco-bad">
                {v.gas}: {v.level.toLocaleString()} {v.unit}
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                <span className="flex min-w-0 items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{v.location}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {v.time}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-medium text-eco-warn">
                Fine: {formatCurrency(v.fine)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
