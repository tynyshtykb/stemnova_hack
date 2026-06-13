"use client"

import { useState } from "react"
import {
  Leaf,
  Car,
  Building2,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Role } from "@/app/page"

export function LoginView({ onLogin }: { onLogin: (role: Role) => void }) {
  const [tab, setTab] = useState<Role>("driver")
  const [codeSent, setCodeSent] = useState(false)

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-eco-good/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-chart-2/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,var(--background)_75%)]" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-eco-good/15 ring-1 ring-eco-good/30">
            <Leaf className="h-7 w-7 text-eco-good" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            QubyrFlow Control KZ
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
            Smart City vehicle emissions monitoring &amp; control
          </p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-2xl shadow-black/40">
          {/* Tab toggle */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
            <TabButton
              active={tab === "driver"}
              onClick={() => setTab("driver")}
              icon={<Car className="h-4 w-4" />}
              label="Driver Login"
            />
            <TabButton
              active={tab === "employee"}
              onClick={() => setTab("employee")}
              icon={<Building2 className="h-4 w-4" />}
              label="City Employee"
            />
          </div>

          {tab === "driver" ? (
            <DriverForm
              codeSent={codeSent}
              onSendCode={() => setCodeSent(true)}
              onSubmit={() => onLogin("driver")}
            />
          ) : (
            <EmployeeForm onSubmit={() => onLogin("employee")} />
          )}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-eco-good" />
          Secured municipal access · Demo prototype
        </p>
      </div>
    </main>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-card text-foreground shadow-sm ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-secondary/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-eco-good/50 focus:ring-2 focus:ring-eco-good/20"
      />
    </label>
  )
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-eco-good px-4 py-3 text-sm font-semibold text-eco-good-foreground transition hover:brightness-105 active:scale-[0.99]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

function DriverForm({
  codeSent,
  onSendCode,
  onSubmit,
}: {
  codeSent: boolean
  onSendCode: () => void
  onSubmit: () => void
}) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Field
        label="Vehicle License Plate"
        placeholder="123 ABC 04"
        defaultValue="123 ABC 04"
        autoComplete="off"
      />

      {!codeSent ? (
        <button
          type="button"
          onClick={onSendCode}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-secondary/60 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          <MessageSquare className="h-4 w-4 text-eco-good" />
          Send SMS Verification Code
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-lg bg-eco-good/10 px-3 py-2 text-xs text-eco-good ring-1 ring-eco-good/20">
            Code sent to ••• ••• 47 81. Use 0000 for demo.
          </div>
          <Field
            label="SMS Verification Code"
            placeholder="0000"
            defaultValue="0000"
            inputMode="numeric"
            maxLength={4}
          />
          <PrimaryButton onClick={onSubmit}>Login as Driver</PrimaryButton>
        </div>
      )}
    </form>
  )
}

function EmployeeForm({ onSubmit }: { onSubmit: () => void }) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Field
        label="Employee ID"
        placeholder="EMP-00428"
        defaultValue="EMP-00428"
        autoComplete="username"
      />
      <Field
        label="Password"
        type="password"
        placeholder="••••••••"
        defaultValue="ecocontrol"
        autoComplete="current-password"
      />
      <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
        <Activity className="h-3.5 w-3.5 text-chart-2" />
        Access to City Eco-Control command center
      </div>
      <PrimaryButton onClick={onSubmit}>Login as City Employee</PrimaryButton>
    </form>
  )
}
