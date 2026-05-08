
import { runAuditEngine } from "@/lib/audit-engine";
import { supabase } from "@/lib/supabase";
import { AuditInput } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auditInput: AuditInput = await req.json();

    // Validate input
    if (!auditInput.tools || auditInput.tools.length === 0) {
      return NextResponse.json(
        { error: "No tools provided." },
        { status: 400 }
      );
    }
    if (!auditInput.teamSize || auditInput.teamSize < 1) {
      return NextResponse.json(
        { error: "Invalid team size." },
        { status: 400 }
      );
    }

    // Run the audit engine
    const auditResults = runAuditEngine(auditInput);

    // Store full results in Supabase
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
