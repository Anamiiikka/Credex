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

export function runAuditEngine(input: AuditInput): Omit<AuditResult, "id" | "createdAt" | "aiSummary"> {
  let totalCurrentSpend = 0;
  let totalOptimizedSpend = 0;
  let totalMonthlySavings = 0;
  let totalAnnualSavings = 0;

  // Temporary type for internal recommendations (before transformation)
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

  const recommendations: InternalRecommendation[] = [];

  // Group tools by category to find overlaps
  const toolsByCategory: Record<string, ToolEntry[]> = { chat: [], coding: [], api: [] };
  
  input.tools.forEach(entry => {
    const category = TOOL_CATEGORIES[entry.toolId];
    toolsByCategory[category].push(entry);
    totalCurrentSpend += entry.monthlySpend;
  });

  input.tools.forEach(entry => {
    const plan = getPlan(entry.toolId, entry.planId);
    if (!plan) return;

    const currentCost = entry.monthlySpend;
    const currentToolName = getToolDisplayName(entry.toolId);
    
    let recommendedAction: RecommendationAction = "keep_current";
    let newMonthlyCost = currentCost;
    let recommendedPlanName: string | undefined = undefined;
    let recommendedToolNameStr: string | undefined = undefined;
    let reason = "Optimal plan for your current usage.";

    const category = TOOL_CATEGORIES[entry.toolId];
    const siblings = toolsByCategory[category];

    // 1. Cross-Vendor Consolidations
    // If multiple tools in the same category, recommend dropping the more expensive one or consolidating
    if (siblings.length > 1 && category !== "api") {
      // Find if there's a cheaper or "primary" tool in this category we should keep
      // For simplicity, keep the one with the highest spend as "primary" and recommend dropping this one if it's not primary
      const primaryTool = [...siblings].sort((a, b) => b.monthlySpend - a.monthlySpend)[0];
      
      if (primaryTool.id !== entry.id) {
        recommendedAction = "consolidate";
        // Conservative 50% estimate — user may keep some usage or migrate gradually.
        // Actual savings depend on migration completeness.
        newMonthlyCost = currentCost * 0.5; // Estimate partial savings
        recommendedToolNameStr = getToolDisplayName(primaryTool.toolId);
        
        if (primaryTool.toolId === entry.toolId) {
          reason = `You have multiple ${currentToolName} subscriptions. Consider consolidating into a single Team or Enterprise plan for better management.`;
        } else {
          reason = `You're paying for multiple ${category} tools. Consider consolidating into ${recommendedToolNameStr} — estimated 50% savings on this subscription.`;
        }
      }
    }

    // 2. Same-Vendor Plan Fit (if not already dropping it)
    if (recommendedAction === "keep_current") {
      const allPlans = getPlansForTool(entry.toolId);
      
      // Look for a plan that is better suited
      // Case A: Paying for too many minSeats
      if (plan.minSeats && entry.seats < plan.minSeats) {
        // Find a cheaper per-seat or flat plan
        const betterPlans = allPlans.filter(p => {
          const cost = p.monthlyPricePerSeat === 0 && p.id.includes("payg") 
            ? currentCost 
            : p.monthlyPricePerSeat * entry.seats;
          return cost < currentCost && (!p.minSeats || entry.seats >= p.minSeats) && p.monthlyPricePerSeat > 0;
        });

        if (betterPlans.length > 0) {
          const bestPlan = betterPlans.sort((a, b) => {
            const costA = a.monthlyPricePerSeat * entry.seats;
            const costB = b.monthlyPricePerSeat * entry.seats;
            return costA - costB;
          })[0];
          
          recommendedAction = "downgrade";
          newMonthlyCost = bestPlan.monthlyPricePerSeat * entry.seats;
          recommendedPlanName = bestPlan.name;
          reason = `Your team size (${entry.seats}) is below the minimum required (${plan.minSeats}) for ${plan.name}. Switching to ${bestPlan.name} saves money.`;
        }
      } 
      // Case B: Should upgrade to Teams for better management if cost is similar or if they have many seats
      else if (!plan.id.includes("free") && entry.seats > 3) {
        // Find a Teams plan
        const teamsPlan = allPlans.find(p => p.minSeats && p.minSeats <= entry.seats);
        if (teamsPlan) {
          const cost = teamsPlan.monthlyPricePerSeat * entry.seats;
          // Even if slightly more expensive, recommend upgrade if cost is manageable
          if (cost <= currentCost) { // Only if same cost or cheaper
            recommendedAction = "upgrade";
            newMonthlyCost = cost;
            recommendedPlanName = teamsPlan.name;
            reason = `With ${entry.seats} users, upgrading to ${teamsPlan.name} provides centralized billing and admin controls.`;
          }
        }
      }
    }

    // Calculate credex savings on the new optimized cost
    const credexSavings = newMonthlyCost * CREDEX_DISCOUNT_RATE;

    // If there's Credex savings but no plan change, still highlight Credex savings
    if (recommendedAction === "keep_current" && credexSavings > 5) {
      recommendedAction = "use_credex";
      reason = `Get 20% off your ${currentToolName} ${plan.name} plan by routing billing through Credex.`;
    }

    totalOptimizedSpend += newMonthlyCost;
    totalMonthlySavings += (currentCost - newMonthlyCost); // plan savings only

    recommendations.push({
      toolEntry: entry,
      currentToolName,
      currentPlanName: plan.name,
      currentMonthlyCost: currentCost,
      recommendedAction,
      recommendedToolName: recommendedToolNameStr,
      recommendedPlanName,
      newMonthlyCost,
      monthlySavings: currentCost - newMonthlyCost,
      credexSavings,
      reason
    });
  });

  const totalCredexSavings = recommendations.reduce((sum, r) => sum + (r.credexSavings || 0), 0);
  const totalAnnualPlanSavings = totalMonthlySavings * 12;
  const totalAnnualCredexSavings = totalCredexSavings * 12;
  totalAnnualSavings = totalAnnualPlanSavings + totalAnnualCredexSavings;

  const isAlreadyOptimal = totalMonthlySavings < SAVINGS_THRESHOLDS.OPTIMAL;
  const isHighSavings = (totalMonthlySavings + totalCredexSavings) >= SAVINGS_THRESHOLDS.SHOW_CREDEX;

  // Transform recommendations to match ToolRecommendation interface
  const formattedRecommendations: ToolRecommendation[] = recommendations.map(r => ({
    tool: r.currentToolName,
    currentPlan: { name: r.currentPlanName, price: r.currentMonthlyCost },
    recommendedPlan: { name: r.recommendedPlanName || r.currentPlanName, price: r.newMonthlyCost },
    savings: r.monthlySavings,
    reason: r.reason,
    recommendedAction: r.recommendedAction,
    credexSavings: r.credexSavings,
  }));

  return {
    recommendations: formattedRecommendations,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalCredexSavings,
    totalAnnualSavings,
    isAlreadyOptimal,
    isHighSavings
  };
}

// Export alias for backwards compatibility
export const runAudit = runAuditEngine;
