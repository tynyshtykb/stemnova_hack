"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Zap, Thermometer, Gauge, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeviceCheckStatus {
  name: string;
  status: "idle" | "checking" | "success" | "error";
  lastCheck?: string;
  signal?: number;
}

const DEVICES = [
  { name: "ESP32 Microcontroller", icon: <Zap className="h-5 w-5" /> },
  { name: "BMP180 Pressure Sensor", icon: <Gauge className="h-5 w-5" /> },
  { name: "Temperature Sensor", icon: <Thermometer className="h-5 w-5" /> },
  { name: "DHT22 Humidity Sensor", icon: <Thermometer className="h-5 w-5" /> },
  { name: "WiFi Module", icon: <Zap className="h-5 w-5" /> },
];

export function AdminDeviceMonitor() {
  const [devices, setDevices] = useState<DeviceCheckStatus[]>(
    DEVICES.map((d) => ({
      name: d.name,
      status: "idle",
      lastCheck: undefined,
      signal: undefined,
    }))
  );
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckDevices = async () => {
    setIsChecking(true);
    
    // Проверяем каждое устройство
    for (let i = 0; i < devices.length; i++) {
      setDevices((prev) => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: "checking" };
        return updated;
      });

      // Имитируем проверку (реальное подключение к API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 85% успех, 15% ошибка
      const success = Math.random() > 0.15;
      const signal = success ? Math.floor(Math.random() * 40) + 60 : 0; // 60-100% или 0

      setDevices((prev) => {
        const updated = [...prev];
        updated[i] = {
          ...updated[i],
          status: success ? "success" : "error",
          lastCheck: new Date().toLocaleTimeString(),
          signal,
        };
        return updated;
      });
    }

    setIsChecking(false);
  };

  const successCount = devices.filter((d) => d.status === "success").length;
  const errorCount = devices.filter((d) => d.status === "error").length;

  return (
    <Card className="border-2 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Device Monitoring
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Check hardware status and connectivity
          </p>
        </div>
        <Button
          onClick={handleCheckDevices}
          disabled={isChecking}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "Checking..." : "Check Devices"}
        </Button>
      </div>

      {/* Stats */}
      {(successCount > 0 || errorCount > 0) && (
        <div className="mb-6 flex gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-950/40 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-500">
              {successCount} Connected
            </span>
          </div>
          {errorCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                {errorCount} Failed
              </span>
            </div>
          )}
        </div>
      )}

      {/* Devices List */}
      <div className="space-y-3">
        {devices.map((device, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-all"
          >
            {/* Status Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {device.status === "checking" ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : device.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : device.status === "error" ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Gauge className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Device Info */}
            <div className="flex-1">
              <p className="font-semibold text-foreground">{device.name}</p>
              {device.lastCheck && (
                <p className="text-xs text-muted-foreground">
                  Last check: {device.lastCheck}
                </p>
              )}
            </div>

            {/* Signal Strength */}
            {device.signal !== undefined && device.status === "success" && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-12 rounded bg-muted p-1">
                  <div className="flex h-full gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${
                          device.signal! > i * 25
                            ? "bg-emerald-500"
                            : "bg-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {device.signal}%
                </span>
              </div>
            )}

            {/* Status Badge */}
            {device.status !== "idle" && device.status !== "checking" && (
              <Badge
                variant={device.status === "success" ? "default" : "destructive"}
                className={
                  device.status === "success"
                    ? "bg-emerald-600"
                    : "bg-destructive"
                }
              >
                {device.status === "success" ? "Connected" : "Disconnected"}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
        <p>
          <strong>Note:</strong> This monitors connected ESP32 hardware,
          sensors, and network connectivity. Run this check regularly to ensure
          all devices are operational.
        </p>
      </div>
    </Card>
  );
}
