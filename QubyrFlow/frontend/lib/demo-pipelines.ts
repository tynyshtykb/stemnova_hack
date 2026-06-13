import type { Pipeline } from "@/lib/types";

const MATERIALS = ["Carbon Steel", "Stainless Steel", "Alloy Steel", "Cast Iron"];
const GRADES = [
  "API 5L X42",
  "API 5L X52",
  "API 5L X65",
  "API 5L X80",
  "API 5L X100",
];
const STATUSES = ["Normal", "Warning", "Critical"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateDemoPipeline(index: number): Pipeline {
  const material = MATERIALS[randomInt(0, MATERIALS.length - 1)];
  const grade = GRADES[randomInt(0, GRADES.length - 1)];
  const initialThickness = randomFloat(8, 16, 1);
  const corrisionImpact = randomFloat(5, 30, 1);
  const yearsInService = randomInt(1, 30);

  // Рассчитываем status на основе corrosion_impact и time_in_years
  let status: "Normal" | "Warning" | "Critical";
  const riskFactor = corrisionImpact * (yearsInService / 10);
  if (riskFactor > 150) status = "Critical";
  else if (riskFactor > 75) status = "Warning";
  else status = "Normal";

  return {
    id: index,
    pipe_id: randomInt(1000, 9999),
    pipe_size: randomInt(100, 1000) * 10,
    min_thickness: randomFloat(2, 6, 1),
    material,
    grade,
    corrosion_impact: corrisionImpact,
    time_in_years: yearsInService,
    initial_thickness: initialThickness,
    status,
  };
}

export const DEMO_PIPELINES = [
  {
    id: 0,
    pipe_id: 1001,
    pipe_size: 500,
    min_thickness: 5.0,
    material: "Carbon Steel",
    grade: "API 5L X65",
    corrosion_impact: 15.0,
    time_in_years: 10,
    initial_thickness: 12.0,
    status: "Normal",
  },
  generateDemoPipeline(1),
  generateDemoPipeline(2),
  generateDemoPipeline(3),
  generateDemoPipeline(4),
  generateDemoPipeline(5),
] as Pipeline[];
