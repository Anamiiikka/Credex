import { describe, it, expect } from "vitest";
import { runAuditEngine } from "../lib/audit-engine";
import { AuditInput } from "../types";

describe("audit-engine", () => {
  it("should detect plan downgrade opportunity due to minSeats", () => {
    // ChatGPT Enterprise requires 150 seats minimum; 5-seat team is overpaying.
    const input: AuditInput = {
      teamSize: 5,
      useCase: "coding",
      tools: [
        {
          id: "1",
          toolId: "chatgpt",
          planId: "chatgpt_enterprise",
          seats: 5,
          monthlySpend: 7500,
        }
      ]
    };

    const result = runAuditEngine(input);
    expect(result.recommendations).toHaveLength(1);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlan.name).toBe("Plus");
    // calculateMonthlyCost("chatgpt", "chatgpt_plus", 5) = $20 × 5 = $100
    expect(rec.recommendedPlan.price).toBe(100);
    expect(rec.savings).toBe(7500 - 100);
  });

  it("should recommend consolidating cross-vendor chat tools", () => {
    // Claude ($200) + ChatGPT ($400) in the same category → drop Claude (cheaper).
    const input: AuditInput = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "claude",   planId: "claude_pro",     seats: 10, monthlySpend: 200 },
        { id: "2", toolId: "chatgpt",  planId: "chatgpt_plus",   seats: 10, monthlySpend: 400 },
        { id: "3", toolId: "cursor",   planId: "cursor_pro",     seats: 10, monthlySpend: 200 },
      ]
    };

    const result = runAuditEngine(input);

    const chatRecs = result.recommendations.filter(r => r.tool === "Claude" || r.tool === "ChatGPT");
    const consolidated = chatRecs.find(r => r.recommendedAction === "consolidate");

    expect(consolidated).toBeDefined();
    // Claude has lower spend so it gets dropped
    expect(consolidated?.tool).toBe("Claude");
    // Recommended price is $0 — cancel the subscription entirely
    expect(consolidated?.recommendedPlan.price).toBe(0);
    expect(consolidated?.savings).toBe(200);
    expect(consolidated?.reason).toContain("ChatGPT");
    // No Credex discount on a cancelled subscription
    expect(consolidated?.credexSavings).toBe(0);
  });

  it("should calculate Credex savings for API tools without changing plans", () => {
    const input: AuditInput = {
      teamSize: 20,
      useCase: "mixed",
      tools: [
        { id: "1", toolId: "openai_api", planId: "openai_api_payg", seats: 1, monthlySpend: 1000 }
      ]
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedAction).toBe("use_credex");
    // No plan change — price stays the same
    expect(rec.recommendedPlan.price).toBe(1000);
    // 20% of $1000 = $200
    expect(rec.credexSavings).toBe(200);
    // Plan savings are zero; only Credex savings apply
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalCredexSavings).toBe(200);
  });

  it("should recommend upgrading to teams plan when it costs the same or less", () => {
    // Cursor Pro ($20/seat) × 10 = $200. Teams ($40/seat) × 10 = $400 — more expensive → no upgrade.
    const inputNoUpgrade: AuditInput = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "cursor", planId: "cursor_pro", seats: 10, monthlySpend: 200 }
      ]
    };

    const resultNoUpgrade = runAuditEngine(inputNoUpgrade);
    const recNoUpgrade = resultNoUpgrade.recommendations[0];
    // Teams is more expensive here so we fall through to use_credex
    expect(recNoUpgrade.recommendedAction).toBe("use_credex");

    // Cursor Ultra ($200/seat) × 10 = $2000. Teams ($40/seat) × 10 = $400 ≤ $2000 → upgrade.
    const inputUpgrade: AuditInput = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "cursor", planId: "cursor_ultra", seats: 10, monthlySpend: 2000 }
      ]
    };

    const resultUpgrade = runAuditEngine(inputUpgrade);
    const recUpgrade = resultUpgrade.recommendations[0];
    expect(recUpgrade.recommendedAction).toBe("upgrade");
    expect(recUpgrade.recommendedPlan.name).toBe("Teams");
    expect(recUpgrade.recommendedPlan.price).toBe(400); // $40 × 10
  });

  it("should set isHighSavings when total savings >= $500/mo", () => {
    // ChatGPT Enterprise (50 seats at $50/seat = $2500) but minSeats = 150 → downgrade to Plus.
    const input: AuditInput = {
      teamSize: 50,
      useCase: "mixed",
      tools: [
        { id: "1", toolId: "chatgpt", planId: "chatgpt_enterprise", seats: 50, monthlySpend: 2500 }
      ]
    };

    const result = runAuditEngine(input);
    // Plus: $20 × 50 = $1000. Savings = $1500. Credex on $1000 = $200. Total = $1700 ≥ $500.
    expect(result.isHighSavings).toBe(true);
    expect(result.totalMonthlySavings).toBe(1500);
  });

  it("should calculate annual savings as (planSavings + credexSavings) × 12", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "mixed",
      tools: [{ id: "1", toolId: "openai_api", planId: "openai_api_payg", seats: 1, monthlySpend: 500 }]
    };

    const result = runAuditEngine(input);
    const expectedAnnual = (result.totalMonthlySavings + result.totalCredexSavings) * 12;
    expect(result.totalAnnualSavings).toBe(expectedAnnual);
  });

  it("should not include keep_current tools in recommendations", () => {
    // A single free-tier tool with zero spend → nothing to recommend.
    const input: AuditInput = {
      teamSize: 1,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "cursor", planId: "cursor_hobby", seats: 1, monthlySpend: 0 }
      ]
    };

    const result = runAuditEngine(input);
    expect(result.recommendations).toHaveLength(0);
    expect(result.isAlreadyOptimal).toBe(true);
  });

  it("totalCurrentSpend should equal the sum of all input monthlySpend values", () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "cursor",  planId: "cursor_pro",    seats: 5, monthlySpend: 300 },
        { id: "2", toolId: "chatgpt", planId: "chatgpt_plus",  seats: 5, monthlySpend: 100 },
      ]
    };

    const result = runAuditEngine(input);
    expect(result.totalCurrentSpend).toBe(400);
  });
});
