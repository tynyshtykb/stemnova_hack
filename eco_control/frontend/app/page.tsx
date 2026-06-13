"use client"

import { useState } from "react"
import { LoginView } from "@/components/eco/login-view"
import { AppSidebar } from "@/components/eco/app-sidebar"
import { TopNav } from "@/components/eco/top-nav"
import { AdminDashboard } from "@/components/eco/admin-dashboard"
import { DriverPortal } from "@/components/eco/driver-portal"
import { NewsView } from "@/components/eco/news-view"
import { driverProfile } from "@/lib/eco-data"

export type Role = "driver" | "employee"
export type Section = "dashboard" | "news"

export default function Page() {
  const [role, setRole] = useState<Role | null>(null)
  const [section, setSection] = useState<Section>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!role) {
    return (
      <LoginView
        onLogin={(r) => {
          setRole(r)
          setSection("dashboard")
        }}
      />
    )
  }

  const isEmployee = role === "employee"

  const user = isEmployee
    ? { name: "Daniyar K.", role: "City Eco-Operator", initials: "DK" }
    : { name: driverProfile.name, role: "Registered Driver", initials: "AN" }

  const headerTitle =
    section === "news"
      ? "News & Updates"
      : isEmployee
        ? "Aktobe Eco-Control Center"
        : "My Vehicle Dashboard"

  const headerSubtitle =
    section === "news"
      ? "Latest ecology coverage and regulations"
      : isEmployee
        ? "Real-time emissions monitoring · Aktobe"
        : `${driverProfile.make} ${driverProfile.model} · ${driverProfile.plate}`

  return (
    <div className="flex min-h-dvh">
      <AppSidebar
        role={role}
        section={section}
        onNavigate={setSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          title={headerTitle}
          subtitle={headerSubtitle}
          user={user}
          aqi={
            isEmployee ? { value: 142, label: "Unhealthy", tone: "warn" } : undefined
          }
          onLogout={() => {
            setRole(null)
            setSidebarOpen(false)
          }}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1">
          {section === "news" ? (
            <NewsView />
          ) : isEmployee ? (
            <AdminDashboard />
          ) : (
            <DriverPortal />
          )}
        </main>
      </div>
    </div>
  )
}
