import { describe, it, expect } from "vitest";
import { runAuditEngine } from "../lib/audit-engine";
import { AuditInput } from "../types";

describe("audit-engine", () => {
  it("should detect plan downgrade opportunity due to minSeats", () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: "coding",
      tools: [
        {
          id: "1",
          toolId: "chatgpt",
          planId: "chatgpt_enterprise",
          seats: 5,
          monthlySpend: 7500, // 5 * $50 = 250, but minSeats is 150 ($7500). Let's assume they entered their spend as $7500
        }
      ]
    };

    const result = runAuditEngine(input);
    expect(result.recommendations).toHaveLength(1);
    const rec = result.recommendations[0];
    
    expect(rec.recommendedAction).toBe("downgrade");
    expect(rec.recommendedPlanName).toBe("Plus");
    expect(rec.newMonthlyCost).toBe(100); // 5 seats * $20
    expect(rec.monthlySavings).toBe(7500 - 100);
  });

  it("should recommend consolidating cross-vendor tools", () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "claude", planId: "claude_pro", seats: 10, monthlySpend: 200 },
        { id: "2", toolId: "chatgpt", planId: "chatgpt_plus", seats: 10, monthlySpend: 200 },
        { id: "3", toolId: "cursor", planId: "cursor_pro", seats: 10, monthlySpend: 200 }
      ]
    };
    
    // Let's make chatgpt more expensive so it becomes 'primary', wait they are both $200.
    // If both are same, sort might pick either. Let's make one cost 200 and one 20.
    input.tools[0].monthlySpend = 200; // claude
    input.tools[1].monthlySpend = 400; // chatgpt

    const result = runAuditEngine(input);
    
    // Should have 3 recommendations
    const chatRecs = result.recommendations.filter(r => r.toolEntry.toolId === 'claude' || r.toolEntry.toolId === 'chatgpt');
    
    const consolidated = chatRecs.find(r => r.recommendedAction === 'consolidate');
    expect(consolidated).toBeDefined();
    expect(consolidated?.toolEntry.toolId).toBe('claude'); // Because it's cheaper, it gets dropped
    expect(consolidated?.newMonthlyCost).toBe(100);
    expect(consolidated?.monthlySavings).toBe(100);
    expect(consolidated?.recommendedToolName).toBe("ChatGPT");
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
    expect(rec.newMonthlyCost).toBe(1000); // Cost remains same but with credex savings
    expect(rec.credexSavings).toBe(200); // 20% of 1000
    expect(result.totalMonthlySavings).toBe(0);
  });

  it("should recommend upgrading to teams plan if individual seats are high", () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "cursor", planId: "cursor_pro", seats: 10, monthlySpend: 200 }
      ]
    };

    const result = runAuditEngine(input);
    const rec = result.recommendations[0];

    // Cursor Pro = $20, Teams = $40. 
    // 10 seats * $20 = $200. 10 seats * $40 = $400. 
    // $400 is not <= $200 * 1.5 ($300). So it shouldn't upgrade in this case!
    // Wait, the test might fail if I expect it to upgrade. Let's make an expectation.
    // In our logic, 400 <= 300 is false, so it will recommend use_credex.
    expect(rec.recommendedAction).toBe("use_credex");

    // Let's create a scenario where upgrade IS same cost or cheaper.
    // e.g. Cursor Ultra ($200) vs Cursor Teams ($40). 
    // 10 seats * 200 = 2000. 10 seats * 40 = 400. 400 <= 2000.
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
    expect(recUpgrade.recommendedPlanName).toBe("Teams");
  });

  it("should set isHighSavings if total savings >= 500", () => {
    const input: AuditInput = {
      teamSize: 10,
      useCase: "coding",
      tools: [
        { id: "1", toolId: "chatgpt", planId: "chatgpt_enterprise", seats: 50, monthlySpend: 2500 }
      ]
    };

    const result = runAuditEngine(input);
    // Downgrades to Plus (50 * 20 = 1000)
    // Savings = 2500 - 1000 = 1500 > 500
    expect(result.isHighSavings).toBe(true);
    expect(result.totalMonthlySavings).toBe(1500);
  });

  it("should calculate annual savings as (planSavings + credexSavings) * 12", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "mixed",
      tools: [{ id: "1", toolId: "openai_api", planId: "openai_api_payg", seats: 1, monthlySpend: 500 }]
    };
    const result = runAuditEngine(input);
    const expectedAnnual = (result.totalMonthlySavings + result.totalCredexSavings) * 12;
    expect(result.totalAnnualSavings).toBe(expectedAnnual);
  });
});
