import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { LeadInput } from "@/types";

// ---------------------------------------------------------------------------
// Email sender — uses Resend via plain fetch so we don't need the SDK
// ---------------------------------------------------------------------------
async function sendConfirmationEmail(
  email: string,
  monthlySavings: number,
  auditId: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping confirmation email.");
    return;
  }

  const savingsLine =
    monthlySavings > 0
      ? `<p>Your audit found <strong>$${Math.round(monthlySavings)}/month</strong> in potential savings.</p>`
      : `<p>Your AI stack is looking well-optimised.</p>`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:ui-sans-serif,system-ui,sans-serif;color:#e2e8f0">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#6366f1,#818cf8);padding:32px;text-align:center">
            <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px">
              Credex AI Spend Audit
            </h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px">Your results are ready</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            ${savingsLine}
            <p style="color:#94a3b8;font-size:14px;line-height:1.6">
              View your full breakdown — recommendation cards, spend breakdown, and suggested next steps —
              using the link below. This URL is shareable, so you can forward it to your CTO or finance team.
            </p>
            <div style="margin:28px 0;text-align:center">
              <a href="https://credex.rocks/audit/${auditId}"
                 style="display:inline-block;padding:14px 32px;background:#6366f1;color:#fff;
                        border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">
                View My Audit →
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #334155;margin:24px 0" />
            <p style="color:#475569;font-size:12px;text-align:center;margin:0">
              You received this because you requested your audit results from
              <a href="https://credex.rocks" style="color:#6366f1;text-decoration:none">credex.rocks</a>.
              To unsubscribe, simply ignore future emails — we'll never spam you.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Credex Auditor <noreply@credex.rocks>",
      to: [email],
      subject:
        monthlySavings > 0
          ? `Your AI audit: $${Math.round(monthlySavings)}/mo in savings found`
          : "Your AI spend audit results",
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error:", res.status, body);
  }
}

// ---------------------------------------------------------------------------
// POST /api/lead
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body: LeadInput = await req.json();

    // ── Honeypot check — bots fill this field ──
    if (body.honeypot && body.honeypot.trim() !== "") {
      // Silently accept (don't leak that we rejected)
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── Basic validation ──
    const email = body.email?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!body.auditId) {
      return NextResponse.json(
        { success: false, error: "auditId is required." },
        { status: 400 }
      );
    }

    // ── Verify the audit exists ──
    const { data: audit, error: auditErr } = await supabase
      .from("audits")
      .select("id, total_monthly_savings")
      .eq("id", body.auditId)
      .single();

    if (auditErr || !audit) {
      return NextResponse.json(
        { success: false, error: "Audit not found." },
        { status: 404 }
      );
    }

    // ── Upsert lead (idempotent on email + audit_id) ──
    const { error: insertErr } = await supabase.from("leads").upsert(
      [
        {
          audit_id: body.auditId,
          email,
          company_name: body.companyName ?? null,
          role: body.role ?? null,
          team_size: body.teamSize ?? null,
        },
      ],
      { onConflict: "email,audit_id" }
    );

    if (insertErr) {
      console.error("Supabase lead insert error:", insertErr);
      return NextResponse.json(
        { success: false, error: "Failed to store lead." },
        { status: 500 }
      );
    }

    // ── Send confirmation email (fire-and-forget; failures are non-fatal) ──
    const monthlySavings: number = audit.total_monthly_savings ?? 0;
    sendConfirmationEmail(email, monthlySavings, body.auditId).catch((err) =>
      console.error("Email send error:", err)
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/lead unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
