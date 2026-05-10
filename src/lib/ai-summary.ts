import { AuditResult } from "@/types";
import { getGroqClient } from "./anthropic";

type AuditResultLike = Omit<AuditResult, "id" | "createdAt" | "aiSummary">;

/**
 * Generates an AI summary of audit recommendations using Groq (llama-3.3-70b-versatile).
 * Falls back to a templated summary if the API key is missing or the call fails.
 */
export async function generateAISummary(auditResult: AuditResultLike): Promise<string> {
  const client = getGroqClient();

  if (!client) {
    return generateTemplateSummary(auditResult);
  }

  try {
    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 200,
      messages: [{ role: "user", content: buildSummaryPrompt(auditResult) }],
    });

    const text = message.choices[0]?.message?.content;
    if (text && typeof text === "string" && text.trim().length > 0) {
      return text.trim();
    }

    return generateTemplateSummary(auditResult);
  } catch (error) {
    console.error("Groq API error, using fallback:", error);
    return generateTemplateSummary(auditResult);
  }
}

function buildSummaryPrompt(auditResult: AuditResultLike): string {
  const effectiveSavings = auditResult.totalMonthlySavings + auditResult.totalCredexSavings;

  // Sort by total value (plan savings + Credex) so the LLM sees the highest-impact recs first
  const topRecs = [...auditResult.recommendations]
    .sort((a, b) =>
      (b.savings + (b.credexSavings ?? 0)) - (a.savings + (a.credexSavings ?? 0))
    )
    .slice(0, 3);

  const recLines = topRecs.map(rec => {
    const credexNote = rec.credexSavings && rec.credexSavings > 0
      ? ` (+$${Math.round(rec.credexSavings)}/mo via Credex credits)`
      : "";
    return `- ${rec.tool}: ${rec.recommendedAction} → save $${Math.round(rec.savings)}/mo${credexNote}`;
  }).join("\n");

  return `You are a startup spending advisor. Write a 1–2 sentence summary of this AI tool spend audit for a founder. Be direct and encouraging.

Audit numbers:
- Current monthly spend: $${Math.round(auditResult.totalCurrentSpend)}/mo
- Optimized monthly spend: $${Math.round(auditResult.totalOptimizedSpend)}/mo
- Plan savings: $${Math.round(auditResult.totalMonthlySavings)}/mo
- Additional Credex credits savings: $${Math.round(auditResult.totalCredexSavings)}/mo
- Total potential savings: $${Math.round(effectiveSavings)}/mo ($${Math.round(auditResult.totalAnnualSavings)}/year)

Top actions:
${recLines || "No major changes needed — stack is well-optimized."}

Reply with 1–2 sentences only. No markdown, no bullet points.`;
}

export function generateTemplateSummary(auditResult: AuditResultLike): string {
  const {
    totalMonthlySavings,
    totalCredexSavings,
    totalAnnualSavings,
    recommendations,
  } = auditResult;

  const effectiveSavings = totalMonthlySavings + totalCredexSavings;

  if (recommendations.length === 0 || effectiveSavings < 5) {
    return "Your AI tool spend looks well optimized. Keep monitoring for new plan options as vendors update their pricing.";
  }

  // Pick the recommendation with the highest total value
  const topRec = [...recommendations].sort(
    (a, b) => (b.savings + (b.credexSavings ?? 0)) - (a.savings + (a.credexSavings ?? 0))
  )[0];
  const recCount = recommendations.length;
  const topAction = topRec.recommendedAction.replace(/_/g, " ");

  const credexNote =
    totalCredexSavings > 10
      ? ` An extra $${Math.round(totalCredexSavings)}/mo is available via Credex credits.`
      : "";

  if (effectiveSavings < 100) {
    return `You have ${recCount} small optimization${recCount > 1 ? "s" : ""} available — start with ${topAction} on ${topRec.tool}.${credexNote}`;
  }

  if (effectiveSavings > 1000) {
    return `You could save $${Math.round(totalAnnualSavings)}/year with ${recCount} key change${recCount > 1 ? "s" : ""}.${credexNote}`;
  }

  return `Found $${Math.round(totalAnnualSavings)}/year in savings across ${recCount} tool${recCount > 1 ? "s" : ""}.${credexNote}`;
}
