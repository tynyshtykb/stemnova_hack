"use client";

import { Activity, Layers, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PipelineCardProps {
  pipeId: string | number;
  material: string;
  status: string;
  isDemo?: boolean;
  onClick: () => void;
}

export function PipelineCard({
  pipeId,
  material,
  status,
  isDemo,
  onClick,
}: PipelineCardProps) {
  const isCritical = status === "Critical";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* Top accent border */}
      <div
        className={`h-1 w-full ${isCritical ? "bg-destructive" : "bg-primary"}`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${isCritical ? "bg-destructive/10" : "bg-primary/10"}`}
            >
              <Layers
                className={`h-4 w-4 ${isCritical ? "text-destructive" : "text-primary"}`}
              />
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold text-foreground">
                PIPE-{pipeId}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            <span>{material}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span>Pipeline Monitoring</span>
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          variant={isCritical ? "destructive" : "secondary"}
          className={`font-mono text-xs font-bold ${!isCritical ? "border border-primary/20 bg-primary/10 text-primary" : ""}`}
        >
          {status || "Normal"}
        </Badge>
      </div>
    </button>
  );
}
