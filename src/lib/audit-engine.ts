import {
  AuditInput,
  AuditResult,
  ToolEntry,
  ToolRecommendation,
  RecommendationAction,
  ToolName
} from "@/types";
import {
  getToolDisplayName,
  getPlan,
  getPlansForTool,
  calculateMonthlyCost,
  CREDEX_DISCOUNT_RATE,
  SAVINGS_THRESHOLDS
} from "./pricing-data";

const TOOL_CATEGORIES: Record<ToolName, "chat" | "coding" | "api"> = {
  chatgpt: "chat",
  claude: "chat",
  gemini: "chat",
  cursor: "coding",
  github_copilot: "coding",
  windsurf: "coding",
  openai_api: "api",
  anthropic_api: "api"
};

interface InternalRecommendation {
  toolEntry: ToolEntry;
  currentToolName: string;
  currentPlanName: string;
  currentMonthlyCost: number;
  recommendedAction: RecommendationAction;
  recommendedToolName?: string;
  recommendedPlanName?: string;
  newMonthlyCost: number;
  monthlySavings: number;
  credexSavings: number;
  reason: string;
}

export function runAuditEngine(input: AuditInput): Omit<AuditResult, "id" | "createdAt" | "aiSummary"> {
  let totalCurrentSpend = 0;
  let totalOptimizedSpend = 0;
  let totalMonthlySavings = 0;

  const internalRecs: InternalRecommendation[] = [];

  // Group tools by category to detect overlaps
  const toolsByCategory: Record<string, ToolEntry[]> = { chat: [], coding: [], api: [] };

  for (const entry of input.tools) {
    const category = TOOL_CATEGORIES[entry.toolId];
    if (category) toolsByCategory[category].push(entry);
    totalCurrentSpend += entry.monthlySpend;
  }

  for (const entry of input.tools) {
    const plan = getPlan(entry.toolId, entry.planId);
    if (!plan) continue;

    const currentCost = entry.monthlySpend;
    const currentToolName = getToolDisplayName(entry.toolId);
    const category = TOOL_CATEGORIES[entry.toolId];
    const siblings = toolsByCategory[category] ?? [];

    let recommendedAction: RecommendationAction = "keep_current";
    let newMonthlyCost = currentCost;
    let recommendedPlanName: string | undefined;
    let recommendedToolName: string | undefined;
    let reason = "Optimal plan for your current usage.";

    // ── 1. Cross-vendor consolidation ────────────────────────────────────────
    // If the team uses multiple tools in the same category, drop the lower-cost
    // one and fully consolidate onto the primary (highest-spend) tool.
    // API tools are excluded — redundant API usage is tracked separately.
    if (siblings.length > 1 && category !== "api") {
      const primaryTool = [...siblings].sort((a, b) => b.monthlySpend - a.monthlySpend)[0];

      if (primaryTool.id !== entry.id) {
        recommendedAction = "consolidate";
        newMonthlyCost = 0; // cancel this subscription entirely
        recommendedPlanName = "Cancel subscription";
        recommendedToolName = getToolDisplayName(primaryTool.toolId);

        if (primaryTool.toolId === entry.toolId) {
          reason = `You have multiple ${currentToolName} subscriptions. Consolidate into a single Team or Enterprise plan to eliminate duplicate spend.`;
        } else {
          reason = `Your team is paying for both ${currentToolName} and ${recommendedToolName}. Cancel ${currentToolName} and fully consolidate onto ${recommendedToolName}.`;
        }
      }
    }

    // ── 2. Same-vendor plan-fit ───────────────────────────────────────────────
    // Only runs if we're not already recommending consolidation.
    if (recommendedAction === "keep_current") {
      const allPlans = getPlansForTool(entry.toolId);

      // Case A: team is below the plan's minimum seat requirement — overpaying.
      if (plan.minSeats && entry.seats < plan.minSeats) {
        const betterPlans = allPlans.filter(p => {
          if (p.monthlyPricePerSeat === 0) return false; // skip free/payg plans
          const cost = calculateMonthlyCost(entry.toolId, p.id, entry.seats);
          return cost < currentCost && (!p.minSeats || entry.seats >= p.minSeats);
        });

        if (betterPlans.length > 0) {
          const bestPlan = betterPlans.sort((a, b) =>
            calculateMonthlyCost(entry.toolId, a.id, entry.seats) -
            calculateMonthlyCost(entry.toolId, b.id, entry.seats)
          )[0];

          newMonthlyCost = calculateMonthlyCost(entry.toolId, bestPlan.id, entry.seats);
          recommendedAction = "downgrade";
          recommendedPlanName = bestPlan.name;
          reason = `Your team (${entry.seats} seats) is below the minimum required for ${plan.name} (${plan.minSeats} seats). Switching to ${bestPlan.name} saves $${Math.round(currentCost - newMonthlyCost)}/mo.`;
        }
      }

      // Case B: team-sized group on individual plans — a Teams plan may be cheaper
      // or provide meaningful management benefits at the same cost.
      else if (!plan.id.includes("free") && entry.seats > 3) {
        const teamsPlan = allPlans.find(p => p.minSeats && p.minSeats <= entry.seats);
        if (teamsPlan) {
          const cost = calculateMonthlyCost(entry.toolId, teamsPlan.id, entry.seats);
          if (cost <= currentCost) {
            recommendedAction = "upgrade";
            newMonthlyCost = cost;
            recommendedPlanName = teamsPlan.name;
            reason = `With ${entry.seats} users, ${teamsPlan.name} ($${Math.round(cost)}/mo) provides centralized billing and admin controls at the same or lower cost.`;
          }
        }
      }
    }

    // ── 3. Credex discount ────────────────────────────────────────────────────
    // Credex offers 20% off the recommended spend.
    // Don't apply Credex to tools being cancelled (newMonthlyCost = 0).
    const credexSavings = newMonthlyCost > 0
      ? Math.round(newMonthlyCost * CREDEX_DISCOUNT_RATE * 100) / 100
      : 0;

    // If no plan change but Credex alone saves > $5/mo, surface the discount.
    if (recommendedAction === "keep_current" && credexSavings > 5) {
      recommendedAction = "use_credex";
      reason = `No plan change needed, but routing ${currentToolName} billing through Credex saves ${Math.round(CREDEX_DISCOUNT_RATE * 100)}% ($${Math.round(credexSavings)}/mo).`;
    }

    // Skip tools that are truly optimal with no Credex benefit worth showing.
    if (recommendedAction === "keep_current") continue;

    totalOptimizedSpend += newMonthlyCost;
    totalMonthlySavings += currentCost - newMonthlyCost;

    internalRecs.push({
      toolEntry: entry,
      currentToolName,
      currentPlanName: plan.name,
      currentMonthlyCost: currentCost,
      recommendedAction,
      recommendedToolName,
      recommendedPlanName,
      newMonthlyCost,
      monthlySavings: currentCost - newMonthlyCost,
      credexSavings,
      reason,
    });
  }

  // Tools with keep_current (no actionable rec) still count toward optimized spend
  for (const entry of input.tools) {
    const hasRec = internalRecs.some(r => r.toolEntry.id === entry.id);
    if (!hasRec) totalOptimizedSpend += entry.monthlySpend;
  }

  const totalCredexSavings = internalRecs.reduce((sum, r) => sum + r.credexSavings, 0);
  const totalAnnualPlanSavings = totalMonthlySavings * 12;
  const totalAnnualCredexSavings = totalCredexSavings * 12;
  const totalAnnualSavings = totalAnnualPlanSavings + totalAnnualCredexSavings;

  const isAlreadyOptimal = (totalMonthlySavings + totalCredexSavings) < SAVINGS_THRESHOLDS.OPTIMAL;
  const isHighSavings = (totalMonthlySavings + totalCredexSavings) >= SAVINGS_THRESHOLDS.SHOW_CREDEX;

  const recommendations: ToolRecommendation[] = internalRecs.map(r => ({
    tool: r.currentToolName,
    currentPlan: { name: r.currentPlanName, price: r.currentMonthlyCost },
    recommendedPlan: {
      name: r.recommendedPlanName ?? r.currentPlanName,
      price: r.newMonthlyCost,
    },
    savings: r.monthlySavings,
    reason: r.reason,
    recommendedAction: r.recommendedAction,
    credexSavings: r.credexSavings,
  }));

  return {
    recommendations,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalCredexSavings,
    totalAnnualSavings,
    isAlreadyOptimal,
    isHighSavings,
  };
}

export const runAudit = runAuditEngine;
