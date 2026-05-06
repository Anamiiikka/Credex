// ============================================================
// AI Spend Auditor — Pricing Data
// Every price is sourced from an official vendor URL.
// See PRICING_DATA.md for full citations.
// ============================================================

import { ToolPricing, ToolName, PlanOption } from "@/types";

/**
 * Complete pricing database for all supported AI tools.
 * Each entry includes the official source URL and date accessed.
 *
 * IMPORTANT: Update PRICING_DATA.md when modifying any prices here.
 */
export const PRICING_DATA: Record<ToolName, ToolPricing> = {
  // ──────────────────────────────────────────────────────────
  // CURSOR — AI-powered code editor
  // ──────────────────────────────────────────────────────────
  cursor: {
    toolId: "cursor",
    displayName: "Cursor",
    vendor: "Anysphere",
    sourceUrl: "https://www.cursor.com/pricing",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "cursor_hobby",
        name: "Hobby",
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ["Limited completions", "Limited agent requests"],
      },
      {
        id: "cursor_pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: [
          "Unlimited completions",
          "Extended agent limits",
          "All frontier models",
        ],
      },
      {
        id: "cursor_pro_plus",
        name: "Pro+",
        monthlyPricePerSeat: 60,
        isPerSeat: false,
        features: ["Everything in Pro", "3x usage credits"],
      },
      {
        id: "cursor_ultra",
        name: "Ultra",
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: [
          "Everything in Pro",
          "20x usage credits",
          "Priority features",
        ],
      },
      {
        id: "cursor_teams",
        name: "Teams",
        monthlyPricePerSeat: 40,
        isPerSeat: true,
        minSeats: 2,
        features: [
          "All Pro features",
          "Centralized billing",
          "Admin dashboard",
          "SAML/OIDC SSO",
        ],
      },
      {
        id: "cursor_enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 40, // estimated; custom pricing
        isPerSeat: true,
        isCustomPricing: true,
        features: [
          "Everything in Teams",
          "Pooled usage",
          "SCIM",
          "Audit logs",
          "Priority support",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // GITHUB COPILOT — AI pair programmer
  // ──────────────────────────────────────────────────────────
  github_copilot: {
    toolId: "github_copilot",
    displayName: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    sourceUrl: "https://github.com/features/copilot#pricing",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "copilot_pro",
        name: "Pro",
        monthlyPricePerSeat: 10,
        isPerSeat: false,
        features: [
          "Code completions",
          "Chat",
          "CLI assistance",
          "$10 AI credits/mo",
        ],
      },
      {
        id: "copilot_pro_plus",
        name: "Pro+",
        monthlyPricePerSeat: 39,
        isPerSeat: false,
        features: [
          "Everything in Pro",
          "Agent mode",
          "$39 AI credits/mo",
          "Premium models",
        ],
      },
      {
        id: "copilot_business",
        name: "Business",
        monthlyPricePerSeat: 19,
        isPerSeat: true,
        minSeats: 1,
        features: [
          "Organization management",
          "Audit logs",
          "Policy management",
          "$19 AI credits/user/mo",
        ],
      },
      {
        id: "copilot_enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 39,
        isPerSeat: true,
        minSeats: 1,
        features: [
          "Everything in Business",
          "Knowledge bases",
          "Fine-tuning",
          "$39 AI credits/user/mo",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // CLAUDE — Anthropic's AI assistant
  // ──────────────────────────────────────────────────────────
  claude: {
    toolId: "claude",
    displayName: "Claude",
    vendor: "Anthropic",
    sourceUrl: "https://www.anthropic.com/pricing",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "claude_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ["Basic access", "Daily usage limits"],
      },
      {
        id: "claude_pro",
        name: "Pro",
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: [
          "5x Free usage",
          "Claude Code",
          "Projects",
          "Priority access",
        ],
      },
      {
        id: "claude_max_5x",
        name: "Max (5x)",
        monthlyPricePerSeat: 100,
        isPerSeat: false,
        features: [
          "5x Pro usage",
          "Claude Code",
          "Highest priority access",
        ],
      },
      {
        id: "claude_max_20x",
        name: "Max (20x)",
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: ["20x Pro usage", "Heavy agentic use"],
      },
      {
        id: "claude_team",
        name: "Team",
        monthlyPricePerSeat: 30,
        isPerSeat: true,
        minSeats: 5,
        features: [
          "Collaboration features",
          "Admin controls",
          "Higher usage limits",
        ],
      },
      {
        id: "claude_enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 30, // base seat; usage billed separately
        isPerSeat: true,
        isCustomPricing: true,
        features: [
          "HIPAA readiness",
          "SSO/SCIM",
          "500K+ context",
          "Compliance tooling",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // CHATGPT — OpenAI's consumer AI
  // ──────────────────────────────────────────────────────────
  chatgpt: {
    toolId: "chatgpt",
    displayName: "ChatGPT",
    vendor: "OpenAI",
    sourceUrl: "https://openai.com/chatgpt/pricing/",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "chatgpt_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ["Basic access", "Limited messages"],
      },
      {
        id: "chatgpt_plus",
        name: "Plus",
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: [
          "Advanced models",
          "Extended message limits",
          "Image generation",
        ],
      },
      {
        id: "chatgpt_pro",
        name: "Pro",
        monthlyPricePerSeat: 200,
        isPerSeat: false,
        features: [
          "20x Plus limits",
          "1M token context",
          "Unlimited deep research",
        ],
      },
      {
        id: "chatgpt_business",
        name: "Business",
        monthlyPricePerSeat: 25,
        isPerSeat: true,
        minSeats: 2,
        features: [
          "Admin console",
          "Data excluded from training",
          "SSO available",
        ],
      },
      {
        id: "chatgpt_enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 50, // estimated; custom pricing
        isPerSeat: true,
        isCustomPricing: true,
        minSeats: 150,
        features: [
          "Unlimited high-speed access",
          "Extended context",
          "Admin analytics",
          "SOC 2",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // OPENAI API — Direct API access
  // ──────────────────────────────────────────────────────────
  openai_api: {
    toolId: "openai_api",
    displayName: "OpenAI API",
    vendor: "OpenAI",
    sourceUrl: "https://openai.com/api/pricing/",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "openai_api_payg",
        name: "Pay-as-you-go",
        monthlyPricePerSeat: 0, // usage-based; user enters their monthly spend
        isPerSeat: false,
        features: [
          "All models available",
          "Token-based pricing",
          "Batch API discounts",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // ANTHROPIC API — Direct API access
  // ──────────────────────────────────────────────────────────
  anthropic_api: {
    toolId: "anthropic_api",
    displayName: "Anthropic API",
    vendor: "Anthropic",
    sourceUrl: "https://www.anthropic.com/pricing#702b2429-ebed-4aee-85de-4e85735feee2",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "anthropic_api_payg",
        name: "Pay-as-you-go",
        monthlyPricePerSeat: 0, // usage-based; user enters their monthly spend
        isPerSeat: false,
        features: [
          "All Claude models",
          "Token-based pricing",
          "Prompt caching",
          "Batch processing",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // GEMINI — Google's AI
  // ──────────────────────────────────────────────────────────
  gemini: {
    toolId: "gemini",
    displayName: "Gemini",
    vendor: "Google",
    sourceUrl: "https://ai.google.dev/pricing",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "gemini_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: ["Basic Gemini access", "Daily limits"],
      },
      {
        id: "gemini_ai_plus",
        name: "AI Plus",
        monthlyPricePerSeat: 8,
        isPerSeat: false,
        features: ["Expanded access", "Extended context"],
      },
      {
        id: "gemini_ai_pro",
        name: "AI Pro",
        monthlyPricePerSeat: 20,
        isPerSeat: false,
        features: [
          "Advanced models (Gemini Pro)",
          "Higher quotas",
          "Workspace integration",
        ],
      },
      {
        id: "gemini_ai_ultra",
        name: "AI Ultra",
        monthlyPricePerSeat: 250,
        isPerSeat: false,
        features: [
          "Premium models",
          "Professional media creation",
          "Priority access",
          "2TB storage",
        ],
      },
      {
        id: "gemini_api_payg",
        name: "API (Pay-as-you-go)",
        monthlyPricePerSeat: 0, // usage-based
        isPerSeat: false,
        features: [
          "All Gemini models",
          "Token-based pricing",
          "Context caching",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // WINDSURF — AI coding IDE (extra tool per spec)
  // ──────────────────────────────────────────────────────────
  windsurf: {
    toolId: "windsurf",
    displayName: "Windsurf",
    vendor: "Codeium",
    sourceUrl: "https://windsurf.com/pricing",
    dateAccessed: "2026-05-06",
    plans: [
      {
        id: "windsurf_free",
        name: "Free",
        monthlyPricePerSeat: 0,
        isPerSeat: false,
        features: [
          "25 credits/mo",
          "Unlimited completions",
        ],
      },
      {
        id: "windsurf_pro",
        name: "Pro",
        monthlyPricePerSeat: 15,
        isPerSeat: false,
        features: [
          "500 credits/mo",
          "All premium models",
          "Full Cascade",
        ],
      },
      {
        id: "windsurf_teams",
        name: "Teams",
        monthlyPricePerSeat: 30,
        isPerSeat: true,
        minSeats: 2,
        features: [
          "500 credits/user/mo",
          "Centralized billing",
          "Admin dashboard",
        ],
      },
      {
        id: "windsurf_enterprise",
        name: "Enterprise",
        monthlyPricePerSeat: 60,
        isPerSeat: true,
        features: [
          "1000 credits/user/mo",
          "SSO/SCIM",
          "RBAC",
          "Enhanced support",
        ],
      },
    ],
  },
};

// ──────────────────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────────────────

/** Get all tool IDs */
export function getAllToolIds(): ToolName[] {
  return Object.keys(PRICING_DATA) as ToolName[];
}

/** Get display name for a tool */
export function getToolDisplayName(toolId: ToolName): string {
  return PRICING_DATA[toolId].displayName;
}

/** Get plans for a specific tool */
export function getPlansForTool(toolId: ToolName): PlanOption[] {
  return PRICING_DATA[toolId].plans;
}

/** Get a specific plan by tool ID and plan ID */
export function getPlan(
  toolId: ToolName,
  planId: string
): PlanOption | undefined {
  return PRICING_DATA[toolId].plans.find((p) => p.id === planId);
}

/** Calculate monthly cost for a tool entry */
export function calculateMonthlyCost(
  toolId: ToolName,
  planId: string,
  seats: number
): number {
  const plan = getPlan(toolId, planId);
  if (!plan) return 0;

  // For pay-as-you-go plans, the user enters their own spend
  if (plan.monthlyPricePerSeat === 0 && planId.includes("payg")) {
    return 0; // User will input manually
  }

  return plan.isPerSeat ? plan.monthlyPricePerSeat * seats : plan.monthlyPricePerSeat;
}

/**
 * Credex discount rate applied to retail pricing.
 * Credex offers discounted AI credits at this rate below retail.
 */
export const CREDEX_DISCOUNT_RATE = 0.20; // 20% off retail

/**
 * Thresholds for result page behavior
 */
export const SAVINGS_THRESHOLDS = {
  /** Below this: "You're spending well" message */
  OPTIMAL: 100,
  /** Above this: prominently feature Credex CTA */
  SHOW_CREDEX: 500,
} as const;
