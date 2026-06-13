"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  X,
  Clock,
  TrendingDown,
  Gauge,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchPrediction } from "@/lib/api";
import type { Pipeline, ChartDataPoint } from "@/lib/types";

const REFRESH_RATE_MS = 2000;
const MAX_HISTORY = 20;

interface PipelineMonitorProps {
  pipeline: Pipeline;
  isDemo: boolean;
  isAdmin: boolean;
  onClose: () => void;
}

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 font-mono text-xs font-bold text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="font-mono text-sm font-extrabold"
          style={{ color: entry.color }}
        >
          {entry.value.toFixed(2)} {entry.name === "thickness" ? "mm" : entry.name === "pressure" ? "psi" : "\u00B0C"}
        </p>
      ))}
    </div>
  );
}

export function PipelineMonitor({
  pipeline,
  isDemo,
  isAdmin,
  onClose,
}: PipelineMonitorProps) {
  const [history, setHistory] = useState<ChartDataPoint[]>([]);
  const [currentData, setCurrentData] = useState({
    thickness: pipeline.initial_thickness,
    pressure: 120,
    temperature: 45,
    yearsToFailure: 10,
    corrosionRate: 0.15,
    status: "Normal",
    thicknessLoss: 0,
  });
  const tickRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateDemoData = useCallback(() => {
    tickRef.current += 1;
    const tick = tickRef.current;
    // Увеличиваем скорость коррозии: 0.002 -> 0.05 мм за тик (в 25 раз больше)
    const thickness = pipeline.initial_thickness - tick * 0.05;
    // Увеличиваем амплитуду колебаний давления
    const pressure = 100 + Math.sin(Date.now() / 1000) * 25;
    // Увеличиваем амплитуду колебаний температуры
    const temperature = 40 + Math.cos(Date.now() / 1500) * 15;
    const thicknessLoss = pipeline.initial_thickness - thickness;
    const corrosionRate = thicknessLoss / ((tick * REFRESH_RATE_MS) / 1000 / 3600 / 24 / 365 || 1);
    const yearsToFailure = (thickness - pipeline.min_thickness) / (0.15 || 1);
    const status = yearsToFailure < 1 ? "Critical" : "Normal";

    const point: ChartDataPoint = {
      time: formatTime(),
      thickness: Number.parseFloat(thickness.toFixed(3)),
      pressure: Number.parseFloat(pressure.toFixed(1)),
      temperature: Number.parseFloat(temperature.toFixed(1)),
    };

    setCurrentData({
      thickness,
      pressure,
      temperature,
      yearsToFailure: Math.max(0, yearsToFailure),
      corrosionRate: Math.abs(corrosionRate) > 100 ? 0.15 : Math.abs(corrosionRate),
      status,
      thicknessLoss,
    });

    setHistory((prev) => [...prev, point].slice(-MAX_HISTORY));
  }, [pipeline.initial_thickness, pipeline.min_thickness]);

  const fetchRealData = useCallback(async () => {
    try {
      // Use 'id' field if pipe_id is not available (from database)
      const pipeId = pipeline.pipe_id ?? pipeline.id;
      
      if (!pipeId) {
        console.warn("Pipeline has no valid ID");
        return;
      }

      const data = await fetchPrediction(pipeId);
      const point: ChartDataPoint = {
        time: formatTime(),
        thickness: data.current_thickness_mm,
        pressure: data.Pressure_psi,
        temperature: data.Temperature_C,
      };

      setCurrentData({
        thickness: data.current_thickness_mm,
        pressure: data.Pressure_psi,
        temperature: data.Temperature_C,
        yearsToFailure: data.years_to_failure,
        corrosionRate: data.predicted_thickness_loss_mm / (pipeline.time_in_years || 1),
        status: data.status,
        thicknessLoss: data.predicted_thickness_loss_mm,
      });

      setHistory((prev) => [...prev, point].slice(-MAX_HISTORY));
    } catch (error) {
      console.error("Failed to fetch prediction:", error);
      // Silently fail for real pipelines if backend is down
    }
  }, [pipeline.pipe_id, pipeline.id, pipeline.time_in_years]);

  useEffect(() => {
    // Immediately generate/fetch first point
    if (isDemo) {
      generateDemoData();
    } else {
      fetchRealData();
    }

    intervalRef.current = setInterval(() => {
      if (isDemo) {
        generateDemoData();
      } else {
        fetchRealData();
      }
    }, REFRESH_RATE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDemo, generateDemoData, fetchRealData]);

  const isCritical = currentData.status === "Critical";

  const handleExport = () => {
    const report = [
      "QUBYRFLOW - PIPELINE REPORT",
      "================================",
      "",
      `Pipe ID: PIPE-${pipeline.pipe_id}`,
      `Material: ${pipeline.material}`,
      `Grade: ${pipeline.grade}`,
      `Status: ${currentData.status}`,
      `Current Thickness: ${currentData.thickness.toFixed(3)} mm`,
      `Thickness Loss: ${currentData.thicknessLoss.toFixed(3)} mm`,
      `Corrosion Rate: ${currentData.corrosionRate.toFixed(4)} mm/yr`,
      `Years to Failure: ${currentData.yearsToFailure.toFixed(1)}`,
      `Pressure: ${currentData.pressure.toFixed(1)} psi`,
      `Temperature: ${currentData.temperature.toFixed(1)} C`,
      "",
      `Report generated: ${new Date().toISOString()}`,
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-report-${pipeline.pipe_id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/60 backdrop-blur-sm">
      <div className="my-4 w-full max-w-6xl rounded-2xl border border-border bg-background shadow-2xl sm:my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${isCritical ? "bg-destructive/10" : "bg-primary/10"}`}
            >
              <Gauge
                className={`h-5 w-5 ${isCritical ? "text-destructive" : "text-primary"}`}
              />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold text-foreground">
                PIPE-{pipeline.pipe_id}
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                {pipeline.material} &middot; {pipeline.grade}
              </p>
            </div>
            <Badge
              variant={isCritical ? "destructive" : "secondary"}
              className={`ml-2 font-mono text-xs font-bold ${!isCritical ? "border border-primary/20 bg-primary/10 text-primary" : ""}`}
            >
              {currentData.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* KPI Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Years to Failure */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Clock className="h-4 w-4" />
                Years to Failure
              </div>
              <p
                className={`font-heading text-3xl font-extrabold ${currentData.yearsToFailure < 1 ? "text-destructive" : currentData.yearsToFailure < 5 ? "text-amber-600" : "text-primary"}`}
              >
                {currentData.yearsToFailure.toFixed(1)}
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">years remaining</p>
            </div>

            {/* Corrosion Rate */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                Corrosion Rate
              </div>
              <p className="font-heading text-3xl font-extrabold text-foreground">
                {currentData.corrosionRate.toFixed(4)}
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">mm / year</p>
            </div>

            {/* Current Thickness */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Gauge className="h-4 w-4" />
                Current Thickness
              </div>
              <p className="font-heading text-3xl font-extrabold text-foreground">
                {currentData.thickness.toFixed(3)}
              </p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">millimeters</p>
            </div>
          </div>

          {/* Warning Banner */}
          {isCritical && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm font-bold text-destructive">
                Critical: Pipeline thickness below safe threshold. Immediate
                inspection recommended.
              </p>
            </div>
          )}

          {/* Main Thickness Chart */}
          <div className="mb-6 rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
              Thickness Loss - Real-time
            </h3>
            <div className="h-[300px] sm:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient
                      id="thicknessGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#059669"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                    stroke="hsl(var(--border))"
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                    unit=" mm"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="thickness"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="url(#thicknessGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#059669",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Pressure Chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
                Pressure (psi)
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                      axisLine={false}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="pressure"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#0ea5e9",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Temperature Chart */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 font-heading text-sm font-bold text-foreground">
                Temperature (&deg;C)
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fontFamily: "monospace", fill: "hsl(var(--muted-foreground))" }}
                      stroke="hsl(var(--border))"
                      tickLine={false}
                      axisLine={false}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#d97706"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: "#d97706",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
