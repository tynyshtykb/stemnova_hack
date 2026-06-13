"use client"

import { useEffect, useState } from "react"
import { Wind, LogOut, Menu } from "lucide-react"
import { StatusBadge } from "./status-badge"

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function TopNav({
  title,
  subtitle,
  user,
  aqi,
  onLogout,
  onToggleSidebar,
}: {
  title: string
  subtitle: string
  user: { name: string; role: string; initials: string }
  aqi?: { value: number; label: string; tone: "good" | "warn" | "bad" }
  onLogout: () => void
  onToggleSidebar?: () => void
}) {
  const now = useClock()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight md:text-lg">
            {title}
          </h1>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {aqi && (
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-1.5 sm:flex">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">City AQI</span>
            <StatusBadge tone={aqi.tone} dot>
              {aqi.value} · {aqi.label}
            </StatusBadge>
          </div>
        )}

        <span className="hidden font-mono text-sm tabular-nums text-muted-foreground lg:block">
          {now
            ? now.toLocaleTimeString("en-GB", { hour12: false })
            : "--:--:--"}
        </span>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card/50 py-1 pl-1 pr-1 md:pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-eco-good/15 text-xs font-semibold text-eco-good">
            {user.initials}
          </div>
          <div className="hidden leading-tight md:block">
            <p className="text-xs font-medium">{user.name}</p>
            <p className="text-[10px] text-muted-foreground">{user.role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-eco-bad/10 hover:text-eco-bad"
          aria-label="Log out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  )
}
