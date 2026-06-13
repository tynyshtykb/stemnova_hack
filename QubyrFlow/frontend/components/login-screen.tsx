"use client";

import { Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/types";

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04352a]">
      {/* Animated background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5,150,105,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(5,150,105,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/20 blur-[120px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-emerald-900/50 bg-emerald-950/60 p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white">
            QubyrFlow
          </h1>
          <p className="text-center text-sm font-semibold text-emerald-300/70">
            Real-time Pipeline Predictive Maintenance System
          </p>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-emerald-800/50" />
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/60">
            Select Role
          </span>
          <div className="h-px flex-1 bg-emerald-800/50" />
        </div>

        {/* Role Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => onLogin("admin")}
            className="h-14 gap-3 rounded-xl bg-emerald-600 font-heading text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
          >
            <Shield className="h-5 w-5" />
            Login as Admin
          </Button>
          <Button
            onClick={() => onLogin("analyst")}
            variant="outline"
            className="h-14 gap-3 rounded-xl border-emerald-800/60 bg-transparent font-heading text-base font-bold text-emerald-300 transition-all hover:border-emerald-600 hover:bg-emerald-900/40 hover:text-emerald-200"
          >
            <Eye className="h-5 w-5" />
            Login as Analyst
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs font-semibold text-emerald-700/60">
          Admin: Full access &middot; Analyst: Read-only monitoring
        </p>
      </div>
    </div>
  );
}
