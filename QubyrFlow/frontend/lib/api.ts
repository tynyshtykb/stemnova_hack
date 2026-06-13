import type { Pipeline, PredictionData } from "./types";

const BASE_URL = "http://127.0.0.1:8000";

export async function fetchPipelines(): Promise<Pipeline[]> {
  const res = await fetch(`${BASE_URL}/pipelines`);
  if (!res.ok) throw new Error("Failed to fetch pipelines");
  return res.json();
}

export async function fetchPrediction(
  pipeId: number
): Promise<PredictionData> {
  const res = await fetch(`${BASE_URL}/predict/${pipeId}`);
  if (!res.ok) throw new Error("Failed to fetch prediction");
  return res.json();
}

export async function createPipeline(data: {
  pipe_id: number;
  pipe_size: number;
  min_thickness: number;
  material: string;
  grade: string;
  corrosion_impact: number;
  time_in_years: number;
  initial_thickness: number;
}): Promise<Pipeline> {
  const res = await fetch(`${BASE_URL}/pipeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create pipeline");
  return res.json();
}

/**
 * Call Gemini/PaLM-like API directly from the frontend.
 * Configure URL and optional key via NEXT_PUBLIC_ environment variables:
 * - NEXT_PUBLIC_GEMINI_API_URL
 * - NEXT_PUBLIC_GEMINI_API_KEY (optional)
 */
export async function callGemini(prompt: string): Promise<any> {
  const url = process.env.NEXT_PUBLIC_GEMINI_API_URL;
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_URL is not configured");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) headers["Authorization"] = `Bearer ${key}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini request failed: ${res.status} ${txt}`);
  }

  try {
    return await res.json();
  } catch (e) {
    return { text: await res.text() };
  }
}
