// ============================================================
// AI Spend Auditor — Type Definitions
// ============================================================

/** Supported AI tools */
export type ToolName =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "openai_api"
  | "anthropic_api"
  | "gemini"
  | "windsurf";

/** Primary use case for AI tools */
export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

/** A plan option for a given tool */
export interface PlanOption {
  id: string;
  name: string;
  monthlyPricePerSeat: number;
  isPerSeat: boolean;
  minSeats?: number;
  maxSeats?: number;
  isCustomPricing?: boolean;
  features?: string[];
}

/** Pricing info for a single AI tool */
export interface ToolPricing {
  toolId: ToolName;
  displayName: string;
  vendor: string;
  plans: PlanOption[];
  sourceUrl: string;
  dateAccessed: string;
}

/** A single tool entry from the spend form */
export interface ToolEntry {
  id: string; // unique form row ID
  toolId: ToolName;
  planId: string;
  monthlySpend: number;
  seats: number;
}

/** Full audit input from the form */
export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

/** Action type for a recommendation */
export type RecommendationAction =
  | "downgrade"
  | "upgrade"
  | "switch_vendor"
  | "use_credex"
  | "keep_current"
  | "consolidate";

/** A single tool recommendation from the audit engine */
export interface ToolRecommendation {
  toolEntry: ToolEntry;
  currentToolName: string;
  currentPlanName: string;
  currentMonthlyCost: number;
  recommendedAction: RecommendationAction;
  recommendedToolName?: string;
  recommendedPlanName?: string;
  newMonthlyCost: number;
  monthlySavings: number;
  reason: string;
  credexSavings?: number;
}

/** Full audit result */
export interface AuditResult {
  id: string;
  recommendations: ToolRecommendation[];
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalCredexSavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  isAlreadyOptimal: boolean; // true if savings < $100/mo
  isHighSavings: boolean; // true if savings > $500/mo
  createdAt: string;
}

/** Lead capture form data */
export interface LeadInput {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  honeypot?: string; // must be empty for valid submission
}

/** Lead record stored in Supabase */
export interface LeadRecord {
  id: string;
  audit_id: string;
  email: string;
  company_name?: string;
  role?: string;
  team_size?: number;
  created_at: string;
}

/** Audit record stored in Supabase */
export interface AuditRecord {
  id: string;
  tools: ToolEntry[];
  team_size: number;
  use_case: UseCase;
  results: ToolRecommendation[];
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary?: string;
  created_at: string;
}

/** API response shapes */
export interface AuditApiResponse {
  success: boolean;
  auditId?: string;
  results?: AuditResult;
  error?: string;
}

export interface LeadApiResponse {
  success: boolean;
  error?: string;
}

export interface SummaryApiResponse {
  success: boolean;
  summary?: string;
  isFallback?: boolean;
  error?: string;
}

/** Form state for localStorage persistence */
export interface FormState {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}
