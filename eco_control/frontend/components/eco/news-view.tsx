import { Calendar, ArrowUpRight } from "lucide-react"
import { news } from "@/lib/eco-data"
import { StatusBadge } from "./status-badge"

const categoryTone: Record<string, "good" | "warn" | "bad" | "neutral"> = {
  Infrastructure: "good",
  Regulation: "warn",
  Tips: "neutral",
  Sustainability: "good",
}

export function NewsView() {
  const [feature, ...rest] = news
  return (
    <div className="space-y-5 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">News &amp; Updates</h2>
        <p className="text-sm text-muted-foreground">
          City ecology, emission regulations, and tips to drive cleaner.
        </p>
      </div>

      {/* Featured */}
      <article className="group grid overflow-hidden rounded-2xl border border-border bg-card/40 md:grid-cols-2">
        <div className="relative h-56 md:h-auto">
          <img
            src={feature.image || "/placeholder.svg"}
            alt={feature.title}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent md:bg-gradient-to-r" />
        </div>
        <div className="flex flex-col justify-center gap-3 p-6">
          <div className="flex items-center gap-2">
            <StatusBadge tone={categoryTone[feature.category]}>
              {feature.category}
            </StatusBadge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> {feature.date}
            </span>
          </div>
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-balance">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {feature.excerpt}
          </p>
          <button className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-medium text-eco-good hover:underline">
            Read full story <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </article>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition hover:border-eco-good/30"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                crossOrigin="anonymous"
              />
              <div className="absolute left-3 top-3">
                <StatusBadge tone={categoryTone[item.category]}>
                  {item.category}
                </StatusBadge>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> {item.date}
              </span>
              <h3 className="font-semibold leading-snug tracking-tight text-balance">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {item.excerpt}
              </p>
              <button className="mt-auto inline-flex w-fit items-center gap-1 pt-2 text-sm font-medium text-eco-good hover:underline">
                Read more <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
