"use client";

import { useState } from "react";
import { LoginScreen } from "@/components/login-screen";
import { Dashboard } from "@/components/dashboard";
import type { UserRole } from "@/lib/types";

export default function Page() {
  const [role, setRole] = useState<UserRole>(null);

  if (!role) {
    return <LoginScreen onLogin={setRole} />;
  }

  return <Dashboard role={role} onLogout={() => setRole(null)} />;
}
