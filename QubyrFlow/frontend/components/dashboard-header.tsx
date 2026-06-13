"use client";

import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/types";

interface DashboardHeaderProps {
  role: UserRole;
  onLogout: () => void;
}

export function DashboardHeader({ role, onLogout }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-extrabold tracking-tight text-foreground">
              QubyrFlow
            </h1>
            <span className="hidden text-sm font-bold text-muted-foreground sm:inline">
              System
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="border border-border font-mono text-xs font-bold uppercase"
          >
            {role}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
