# LLM Prompts

This document records all LLM interactions in the codebase: the exact prompts, model choices, and design rationale.

---

## 1. AI Audit Summary (Production)

**File:** `src/lib/ai-summary.ts` → `buildSummaryPrompt()`

**Model:** `llama-3.3-70b-versatile` via Groq API

**Temperature:** Default (Groq default is 1.0; no override set — summary writing benefits from slight variation)

**Max tokens:** 200

**Prompt:**

```
You are a startup spending advisor. Write a 1–2 sentence summary of this AI tool spend audit for a founder. Be direct and encouraging.

Audit numbers:
- Current monthly spend: $X/mo
- Optimized monthly spend: $X/mo
- Plan savings: $X/mo
- Additional Credex credits savings: $X/mo
- Total potential savings: $X/mo ($Y/year)

Top actions:
- ChatGPT: consolidate → save $280/mo
- Claude: upgrade → save $980/mo (+$84/mo via Credex credits)
- Cursor: use_credex → save $0/mo (+$12/mo via Credex credits)

Reply with 1–2 sentences only. No markdown, no bullet points.
```

**Design decisions:**
- "Be direct and encouraging" — audit results can feel negative ("you're wasting money"). Framing the summary as a startup spending advisor who is encouraging improves how users receive the recommendation.
- Recommendations are sorted by total value (savings + Credex) before being passed to the LLM, so the model always sees the most impactful actions first.
- The strict "1–2 sentences only, no markdown" instruction prevents the model from generating lists or headers that would render poorly in the plain-text `<p>` tag on the results page.
- Max 200 tokens: enough for 2 sentences (~60–80 words) with headroom.

**Fallback:** If Groq is unavailable, returns empty API key, or throws an error, `generateTemplateSummary()` is called instead (see below).

**Example output:**
> "Your team could save $1,260/mo by consolidating on Claude Team and cancelling redundant ChatGPT subscriptions — that's $15,120/year back in your budget. Start with the Claude upgrade today to get the biggest win fastest."

---

## 2. AI Audit Summary (Template Fallback)

**File:** `src/lib/ai-summary.ts` → `generateTemplateSummary()`

**Model:** None — pure TypeScript string template

**When used:** Groq client is null (no API key), API call throws, or response is empty.

**Template logic:**

```
if no recommendations or savings < $5:
  → "Your AI tool spend looks well optimized..."

if high savings (> $1000/mo):
  → "Your team is spending $X/mo on AI tools, with $Y/mo ($Z/yr) in immediate savings available.
     Top action: {action} on {tool}. An extra $W/mo available via Credex credits."

if mid savings ($100–$1000/mo):
  → "Found {N} saving opportunit(y/ies) totalling $X/mo ($Y/yr). 
     Biggest win: {action} on {tool}. An extra $W/mo available via Credex credits."

if small savings (< $100/mo):
  → "You have {N} small optimization(s). Start with {action} on {tool}.
     An extra $W/mo available via Credex credits."
```

**Design decisions:**
- The fallback is designed to be genuinely useful, not just an error message. A user who never gets the AI summary (e.g., running locally without a Groq key) still gets a clear, actionable sentence.
- Credex savings are appended as a separate sentence only when > $5/mo, so low-Credex-value results don't get a misleading "An extra $0/mo available" line.

---

## 3. Development Assistance (Not in production)

**Tool:** Claude Code (Anthropic)

**Used for:** Audit engine logic review, UI component iteration, debugging TypeScript errors, writing documentation.

**Notable interactions:**
- Diagnosed `calculateMonthlyCost` returning flat price instead of `price × seats` — traced through 4 files to find the root cause
- Identified `@base-ui/react` `SelectValue` rendering raw `value` prop instead of `ItemText` content — fixed by rendering display text directly in `SelectTrigger`
- Reviewed Tailwind v4 breaking changes (`bg-gradient-to-r` → `bg-linear-to-r`, `@theme inline` configuration)

These interactions do not appear in production code; they were part of the development process.
