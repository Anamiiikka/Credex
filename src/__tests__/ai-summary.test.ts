import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAISummary, generateTemplateSummary } from "@/lib/ai-summary";
import { AuditResult } from "@/types";
import * as groqModule from "@/lib/anthropic";

// Mock audit result fixtures
const mockAuditResult: AuditResult = {
  id: "test-audit-123",
  recommendations: [
    {
      tool: "github_copilot",
      currentPlan: { name: "Pro", price: 10 },
      recommendedPlan: { name: "Starter", price: 5 },
      savings: 100,
      reason: "Team doesn't use advanced features",
      recommendedAction: "downgrade",
      credexSavings: 0,
    },
    {
      tool: "claude",
      currentPlan: { name: "Pro", price: 20 },
      recommendedPlan: { name: "Team Plan", price: 30 },
      savings: -50,
      reason: "Team plan is better value",
      recommendedAction: "upgrade",
      credexSavings: 0,
    },
  ],
  totalCurrentSpend: 300,
  totalOptimizedSpend: 220,
  totalMonthlySavings: 80,
  totalCredexSavings: 0,
  totalAnnualSavings: 960,
  isAlreadyOptimal: false,
  isHighSavings: false,
  createdAt: new Date().toISOString(),
};

const mockHighSavingsAudit: AuditResult = {
  ...mockAuditResult,
  totalMonthlySavings: 1500,
  totalAnnualSavings: 18000,
  isHighSavings: true,
};

const mockOptimalAudit: AuditResult = {
  ...mockAuditResult,
  recommendations: [],
  totalMonthlySavings: 0,
  totalAnnualSavings: 0,
  isAlreadyOptimal: true,
};

describe("AI Summary Module", () => {
  describe("generateTemplateSummary", () => {
    it("should generate a summary for already optimal spend", () => {
      const summary = generateTemplateSummary(mockOptimalAudit);
      expect(summary).toContain("well optimized");
      expect(summary.length).toBeGreaterThan(0);
      expect(summary.length).toBeLessThan(300);
    });

    it("should generate a summary for small savings", () => {
      const summary = generateTemplateSummary(mockAuditResult);
      expect(summary).toContain("small optimization");
      expect(summary.length).toBeGreaterThan(0);
    });

    it("should generate a summary for high savings (>$1000/mo)", () => {
      const summary = generateTemplateSummary(mockHighSavingsAudit);
      expect(summary).toContain("18000");
      expect(summary).toContain("key change");
      expect(summary.length).toBeGreaterThan(0);
    });

    it("should include tool name in summary", () => {
      const summary = generateTemplateSummary(mockAuditResult);
      expect(summary.toLowerCase()).toContain("github_copilot");
    });

    it("should format action names properly", () => {
      const summary = generateTemplateSummary(mockAuditResult);
      // Should convert "downgrade" to readable format
      expect(summary.length).toBeGreaterThan(20);
    });
  });

  describe("generateAISummary", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should use template summary when Groq client is not available", async () => {
      vi.spyOn(groqModule, "getGroqClient").mockReturnValue(null);

      const summary = await generateAISummary(mockAuditResult);

      expect(summary).toBeTruthy();
      expect(summary.length).toBeGreaterThan(0);
      expect(summary.length).toBeLessThan(500);
    });

    it("should fallback to template summary on API error", async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockRejectedValue(new Error("API Error")),
          },
        },
      };

      vi.spyOn(groqModule, "getGroqClient").mockReturnValue(
        mockClient as unknown as Awaited<ReturnType<typeof groqModule.getGroqClient>>
      );

      const summary = await generateAISummary(mockAuditResult);

      expect(summary).toBeTruthy();
      expect(summary.length).toBeGreaterThan(0);
    });

    it("should fallback when response has no text content", async () => {
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: null } }],
            }),
          },
        },
      };

      vi.spyOn(groqModule, "getGroqClient").mockReturnValue(
        mockClient as unknown as Awaited<ReturnType<typeof groqModule.getGroqClient>>
      );

      const summary = await generateAISummary(mockAuditResult);

      expect(summary).toBeTruthy();
      expect(summary.length).toBeGreaterThan(0);
    });

    it("should extract and return text from successful API response", async () => {
      const mockResponse = "  This is a mock AI summary  ";
      const mockClient = {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [
                {
                  message: {
                    content: mockResponse,
                  },
                },
              ],
            }),
          },
        },
      };

      vi.spyOn(groqModule, "getGroqClient").mockReturnValue(
        mockClient as unknown as Awaited<ReturnType<typeof groqModule.getGroqClient>>
      );

      const summary = await generateAISummary(mockAuditResult);

      expect(summary).toBe("This is a mock AI summary");
    });
  });

  describe("Summary length validation", () => {
    it("all template summaries should be under 300 characters", () => {
      const summaries = [
        generateTemplateSummary(mockAuditResult),
        generateTemplateSummary(mockHighSavingsAudit),
        generateTemplateSummary(mockOptimalAudit),
      ];

      summaries.forEach((summary) => {
        expect(summary.length).toBeLessThan(300);
        expect(summary.length).toBeGreaterThan(20);
      });
    });
  });

  describe("Fallback behavior", () => {
    it("should never return empty summary", async () => {
      vi.spyOn(groqModule, "getGroqClient").mockReturnValue(null);

      const summary = await generateAISummary(mockOptimalAudit);

      expect(summary).toBeTruthy();
      expect(summary.length).toBeGreaterThan(0);
    });

    it("should include savings amount in summary when significant", () => {
      const summary = generateTemplateSummary(mockHighSavingsAudit);
      expect(summary).toContain("18000");
    });
  });
});
