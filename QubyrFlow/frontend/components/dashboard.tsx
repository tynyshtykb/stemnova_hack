"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { PipelineCard } from "@/components/pipeline-card";
import { PipelineMonitor } from "@/components/pipeline-monitor";
import { AddPipelineDialog } from "@/components/add-pipeline-dialog";
import { AiChat } from "@/components/ai-chat";
import { fetchPipelines } from "@/lib/api";
import type { Pipeline, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface DashboardProps {
  role: UserRole;
  onLogout: () => void;
}

const DEMO_PIPELINE: Pipeline = {
  id: 0,
  pipe_id: 0,
  pipe_size: 500,
  min_thickness: 5.0,
  material: "Carbon Steel",
  grade: "API 5L X65",
  corrosion_impact: 15.0,
  time_in_years: 10,
  initial_thickness: 12.0,
  status: "Normal",
};

export function Dashboard({ role, onLogout }: DashboardProps) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipe, setSelectedPipe] = useState<Pipeline | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const loadPipelines = useCallback(async () => {
    try {
      const data = await fetchPipelines();
      // Ensure pipe_id is set for all pipelines
      const normalizedData = data.map((pipeline) => ({
        ...pipeline,
        pipe_id: pipeline.pipe_id ?? pipeline.id,
      }));
      setPipelines(normalizedData);
      console.log("Loaded pipelines:", normalizedData);
    } catch (error) {
      console.error("Failed to load pipelines:", error);
      toast({
        title: "Backend Offline",
        description:
          "Could not connect to the API. Demo pipeline is still available.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadPipelines();
    
    // Обновлять данные каждые 6 секунд
    const interval = setInterval(() => {
      loadPipelines();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [loadPipelines]);

  const handleOpenMonitor = (pipeline: Pipeline, demo: boolean) => {
    setSelectedPipe(pipeline);
    setIsDemo(demo);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role={role} onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Pipeline Overview
          </h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Monitor pipeline health and predictive maintenance data in real-time
          </p>
        </div>

        {/* Pipeline Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Demo Card */}
          <PipelineCard
            pipeId="DEMO-001"
            material="Carbon Steel - API 5L X65"
            status="Normal"
            isDemo
            onClick={() => handleOpenMonitor(DEMO_PIPELINE, true)}
          />

          {/* Real Pipelines */}
          {pipelines.map((p) => (
            <PipelineCard
              key={p.id}
              pipeId={p.pipe_id}
              material={`${p.material} - ${p.grade}`}
              status={p.status || "Normal"}
              onClick={() => handleOpenMonitor(p, false)}
            />
          ))}
        </div>
      </main>

      {/* Admin FAB */}
      {role === "admin" && (
        <Button
          onClick={() => setShowAddDialog(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-primary p-0 text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:bg-primary/90"
          aria-label="Add pipeline"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Monitor Modal */}
      {selectedPipe && (
        <PipelineMonitor
          pipeline={selectedPipe}
          isDemo={isDemo}
          isAdmin={role === "admin"}
          onClose={() => setSelectedPipe(null)}
        />
      )}

      {/* Add Pipeline Dialog */}
      {showAddDialog && (
        <AddPipelineDialog
          onClose={() => setShowAddDialog(false)}
          onCreated={() => {
            setShowAddDialog(false);
            loadPipelines();
          }}
        />
      )}

      {/* AI Chat */}
      <AiChat />

      <Toaster />
    </div>
  );
}
