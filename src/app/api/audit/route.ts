
import { runAudit } from "@/lib/audit-engine";
import { supabase } from "@/lib/supabase";
import { AuditInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auditInput: AuditInput = await req.json();

    // 1. Run the audit engine
    const auditResults = runAudit(auditInput);

    // 2. Store results in Supabase
    const { data, error } = await supabase
      .from("audits")
      .insert([
        {
          tools: auditInput.tools,
          team_size: auditInput.teamSize,
          use_case: auditInput.useCase,
          results: auditResults.recommendations,
          total_monthly_savings: auditResults.totalMonthlySavings,
          total_annual_savings: auditResults.totalAnnualSavings,
          ai_summary: auditResults.aiSummary,
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

    // 3. Return the new audit ID
    return NextResponse.json({ auditId: data.id });
    
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
