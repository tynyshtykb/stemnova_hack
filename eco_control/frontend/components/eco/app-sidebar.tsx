"use client"

import { Leaf, LayoutDashboard, Newspaper, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Role, Section } from "@/app/page"

export function AppSidebar({
  role,
  section,
  onNavigate,
  open,
  onClose,
}: {
  role: Role
  section: Section
  onNavigate: (s: Section) => void
  open: boolean
  onClose: () => void
}) {
  const items: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
    {
      id: "dashboard",
      label: role === "employee" ? "Eco-Control" : "My Vehicle",
      icon: LayoutDashboard,
    },
    { id: "news", label: "News & Updates", icon: Newspaper },
  ]

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-eco-good/15 ring-1 ring-eco-good/30">
              <Leaf className="h-5 w-5 text-eco-good" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">QubyrFlow Control</p>
              <p className="text-[10px] text-muted-foreground">
                {role === "employee" ? "City Operator" : "Citizen Portal"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {items.map((item) => {
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  onClose()
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-eco-good/15 text-eco-good ring-1 ring-eco-good/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="m-3 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">QubyrFlow v2.4</p>
          <p className="mt-0.5">Live since 06:00 · 142 sensors online</p>
        </div>
      </aside>
    </>
  )
}
