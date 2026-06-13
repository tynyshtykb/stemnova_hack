export interface Pipeline {
  id: number;
  pipe_id: number;
  pipe_size: number;
  min_thickness: number;
  material: string;
  grade: string;
  corrosion_impact: number;
  time_in_years: number;
  initial_thickness: number;
  status?: string;
}

export interface PredictionData {
  pipe_id: number;
  predicted_thickness_loss_mm: number;
  current_thickness_mm: number;
  years_to_failure: number;
  status: string;
  Temperature_C: number;
  Pressure_psi: number;
}

export interface ChartDataPoint {
  time: string;
  thickness: number;
  pressure: number;
  temperature: number;
}

export type UserRole = "admin" | "analyst" | null;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
