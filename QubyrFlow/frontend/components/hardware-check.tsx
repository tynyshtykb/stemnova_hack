"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Zap, Thermometer, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HardwareCheckProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface HardwareStatus {
  name: string;
  status: "checking" | "success" | "error";
  icon: React.ReactNode;
}

const HARDWARE_CHECKS = [
  { name: "ESP32 Microcontroller", icon: <Zap className="h-5 w-5" /> },
  { name: "BMP180 Pressure Sensor", icon: <Gauge className="h-5 w-5" /> },
  { name: "Temperature Sensor", icon: <Thermometer className="h-5 w-5" /> },
  { name: "WiFi Connection", icon: <Zap className="h-5 w-5" /> },
];

export function HardwareCheck({ onSuccess, onCancel }: HardwareCheckProps) {
  const [checks, setChecks] = useState<HardwareStatus[]>(
    HARDWARE_CHECKS.map((hw) => ({
      name: hw.name,
      status: "checking" as const,
      icon: hw.icon,
    }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const [allSuccess, setAllSuccess] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < checks.length) {
        // 80% успех, 20% ошибка (реалистично)
        const success = Math.random() > 0.2;
        
        setChecks((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: success ? "success" : "error",
          };
          return updated;
        });
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        
        // Проверяем, все ли успешно
        setChecks((prev) => {
          const allSuccess = prev.every((check) => check.status === "success");
          setAllSuccess(allSuccess);
          return prev;
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md border-2 bg-card">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Hardware Verification
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            Checking connected devices and sensors...
          </p>
        </div>

        {/* Checks List */}
        <div className="space-y-3 px-6 py-6">
          {checks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3 transition-all"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                {check.status === "checking" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : check.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <span
                className={`flex-1 text-sm font-semibold ${
                  check.status === "success"
                    ? "text-emerald-500"
                    : check.status === "error"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {check.name}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {check.status === "checking"
                  ? "..."
                  : check.status === "success"
                    ? "OK"
                    : "Failed"}
              </span>
            </div>
          ))}
        </div>

        {/* Status Message */}
        {isComplete && (
          <div
            className={`border-t px-6 py-4 ${allSuccess ? "bg-emerald-950/40" : "bg-destructive/10"}`}
          >
            <p
              className={`text-center text-sm font-semibold ${allSuccess ? "text-emerald-500" : "text-destructive"}`}
            >
              {allSuccess
                ? "✓ All systems operational. Ready to proceed."
                : "⚠ Some hardware checks failed. Retry or continue as analyst."}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 border-t px-6 py-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={!isComplete}
          >
            Cancel
          </Button>
          {isComplete && (
            <Button
              onClick={onSuccess}
              className="flex-1"
              disabled={!allSuccess}
              variant={allSuccess ? "default" : "secondary"}
            >
              {allSuccess ? "Proceed as Admin" : "Retry Check"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
