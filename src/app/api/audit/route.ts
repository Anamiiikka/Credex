
import { runAuditEngine } from "@/lib/audit-engine";
import { generateAISummary } from "@/lib/ai-summary";
import { supabase } from "@/lib/supabase";
import { getAllToolIds, getPlansForTool } from "@/lib/pricing-data";
import { AuditInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const VALID_TOOL_IDS = new Set(getAllToolIds());

export async function POST(req: NextRequest) {
  try {
    const auditInput: AuditInput = await req.json();

    // Top-level validation
    if (!auditInput.tools || auditInput.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided." }, { status: 400 });
    }
    if (!auditInput.teamSize || auditInput.teamSize < 1) {
      return NextResponse.json({ error: "Invalid team size." }, { status: 400 });
    }

    // Per-entry validation — catches bad toolId/planId before the engine runs,
    // which would otherwise silently skip entries and inflate totalCurrentSpend.
    for (const entry of auditInput.tools) {
      if (!VALID_TOOL_IDS.has(entry.toolId)) {
        return NextResponse.json(
          { error: `Unknown tool: ${entry.toolId}` },
          { status: 400 }
        );
      }

      const validPlanIds = new Set(getPlansForTool(entry.toolId).map(p => p.id));
      if (!validPlanIds.has(entry.planId)) {
        return NextResponse.json(
          { error: `Unknown plan "${entry.planId}" for tool "${entry.toolId}".` },
          { status: 400 }
        );
      }

      if (!Number.isFinite(entry.seats) || entry.seats < 1) {
        return NextResponse.json(
          { error: `Seats must be at least 1 (got: ${entry.seats}).` },
          { status: 400 }
        );
      }

      if (!Number.isFinite(entry.monthlySpend) || entry.monthlySpend < 0) {
        return NextResponse.json(
          { error: `Monthly spend must be a non-negative number (got: ${entry.monthlySpend}).` },
          { status: 400 }
        );
      }
    }

    const auditResults = runAuditEngine(auditInput);
    const aiSummary = await generateAISummary(auditResults);

    const { data, error } = await supabase
      .from("audits")
      .insert([
        {
          tools: auditInput.tools,
          team_size: auditInput.teamSize,
          use_case: auditInput.useCase,
          results: auditResults,
          total_monthly_savings: auditResults.totalMonthlySavings,
          total_annual_savings: auditResults.totalAnnualSavings,
          total_credex_savings: auditResults.totalCredexSavings,
          is_already_optimal: auditResults.isAlreadyOptimal,
          ai_summary: aiSummary,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to store audit results.", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id }, { status: 201 });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
