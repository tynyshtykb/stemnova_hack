import { cn } from "@/lib/utils"

type Tone = "good" | "warn" | "bad" | "neutral"

const toneMap: Record<Tone, string> = {
  good: "bg-eco-good/15 text-eco-good ring-1 ring-eco-good/30",
  warn: "bg-eco-warn/15 text-eco-warn ring-1 ring-eco-warn/30",
  bad: "bg-eco-bad/15 text-eco-bad ring-1 ring-eco-bad/30",
  neutral: "bg-muted text-muted-foreground ring-1 ring-border",
}

export function StatusBadge({
  tone = "neutral",
  children,
  className,
  dot = false,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneMap[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-eco-good": tone === "good",
            "bg-eco-warn": tone === "warn",
            "bg-eco-bad": tone === "bad",
            "bg-muted-foreground": tone === "neutral",
          })}
        />
      )}
      {children}
    </span>
  )
}
