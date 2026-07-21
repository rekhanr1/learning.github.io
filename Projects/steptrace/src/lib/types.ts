export type CaptureType = "none" | "numeric" | "pass_fail" | "numeric_pass_fail";

export interface ParsedStep {
  title: string;
  description: string;
  tools: string[];
  materials: string[];
  caution: string | null;
  captureType: CaptureType;
  specLabel: string | null;
  specValue: string | null;
  specUnit: string | null;
}
