import { AuditResult } from "@/types";
import { getGroqClient } from "./anthropic";

type AuditResultLike = Omit<AuditResult, "id" | "createdAt" | "aiSummary">;

/**
 * Generates an AI summary of audit recommendations using Groq API.
 * Falls back to templated summary if API is unavailable or fails.
 */
export async function generateAISummary(auditResult: AuditResultLike): Promise<string> {
  const client = getGroqClient();

  if (!client) {
    return generateTemplateSummary(auditResult);
  }

  try {
    const prompt = buildSummaryPrompt(auditResult);

    const message = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.choices[0]?.message?.content;
    if (textContent && typeof textContent === "string") {
      return textContent.trim();
    }

    return generateTemplateSummary(auditResult);
  } catch (error) {
    console.error("Groq API error, using fallback:", error);
    return generateTemplateSummary(auditResult);
  }
}

/**
 * Build a concise prompt for Claude to summarize the audit
 */
function buildSummaryPrompt(auditResult: AuditResultLike): string {
  const topRecommendations = auditResult.recommendations
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 3);

  const recommendationText = topRecommendations
    .map(
      (rec) =>
        `- ${rec.tool}: ${rec.recommendedAction} from $${rec.currentPlan.price}/mo to $${rec.recommendedPlan.price}/mo (save $${Math.round(rec.savings)}/mo)`
    )
    .join("\n");

  return `You are a startup spending advisor. Summarize this AI tool spend audit in 1-2 sentences for a founder. Be encouraging but honest.

Audit Summary:
- Current spend: $${Math.round(auditResult.totalCurrentSpend)}/mo
- Optimized spend: $${Math.round(auditResult.totalOptimizedSpend)}/mo
- Monthly savings: $${Math.round(auditResult.totalMonthlySavings)}/mo ($${Math.round(auditResult.totalAnnualSavings)}/year)

Top Recommendations:
${recommendationText}

Write a brief, actionable summary in 1-2 sentences. Be direct and encouraging.`;
}

/**
 * Graceful fallback: generate a templated summary
 */
export function generateTemplateSummary(auditResult: AuditResultLike): string {
  const { totalMonthlySavings, totalAnnualSavings, recommendations } = auditResult;

  if (recommendations.length === 0) {
    return "Your AI tool spend looks well optimized. Keep monitoring for new plan options.";
  }

  const topRec = recommendations[0];
  const recCount = recommendations.length;
  const topRecAction = topRec.recommendedAction.replace(/_/g, " ");

  if (totalMonthlySavings < 100) {
    return `You have ${recCount} small optimization${recCount > 1 ? "s" : ""} available. Start with ${topRecAction} on ${topRec.tool}.`;
  }

  if (totalMonthlySavings > 1000) {
    return `You could save $${Math.round(totalAnnualSavings)}/year with ${recCount} key change${recCount > 1 ? "s" : ""}. Start with ${topRecAction} on ${topRec.tool}.`;
  }

  return `Found $${Math.round(totalAnnualSavings)}/year in savings across ${recCount} tool${recCount > 1 ? "s" : ""}. Your biggest win: ${topRecAction} ${topRec.tool}.`;
}
