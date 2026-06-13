"use client";

import React from "react"

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPipeline } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AddPipelineDialogProps {
  onClose: () => void;
  onCreated: () => void;
}

interface FormData {
  pipe_id: string;
  pipe_size: string;
  min_thickness: string;
  material: string;
  grade: string;
  corrosion_impact: string;
  time_in_years: string;
  initial_thickness: string;
}

const defaultForm: FormData = {
  pipe_id: "",
  pipe_size: "500.0",
  min_thickness: "5.0",
  material: "Carbon Steel",
  grade: "API 5L X52",
  corrosion_impact: "15.0",
  time_in_years: "5.0",
  initial_thickness: "12.0",
};

const fields: { key: keyof FormData; label: string; type: string }[] = [
  { key: "pipe_id", label: "Pipe ID", type: "number" },
  { key: "pipe_size", label: "Pipe Size (mm)", type: "number" },
  { key: "min_thickness", label: "Min Thickness (mm)", type: "number" },
  { key: "material", label: "Material", type: "text" },
  { key: "grade", label: "Grade", type: "text" },
  { key: "corrosion_impact", label: "Corrosion Impact", type: "number" },
  { key: "time_in_years", label: "Time in Years", type: "number" },
  { key: "initial_thickness", label: "Initial Thickness (mm)", type: "number" },
];

export function AddPipelineDialog({
  onClose,
  onCreated,
}: AddPipelineDialogProps) {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPipeline({
        pipe_id: Number(form.pipe_id),
        pipe_size: Number(form.pipe_size),
        min_thickness: Number(form.min_thickness),
        material: form.material,
        grade: form.grade,
        corrosion_impact: Number(form.corrosion_impact),
        time_in_years: Number(form.time_in_years),
        initial_thickness: Number(form.initial_thickness),
      });
      toast({
        title: "Pipeline Created",
        description: `Pipeline ${form.pipe_id} has been added successfully.`,
      });
      onCreated();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create pipeline. Is the backend running?",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            Add New Pipeline
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <Label
                  htmlFor={field.key}
                  className="text-xs font-bold text-muted-foreground"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type}
                  step={field.type === "number" ? "any" : undefined}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  className="font-mono text-sm font-semibold"
                  required
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Pipeline
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
