# Credex — AI Spend Auditor

**Free, instant audit of your team's AI tool subscriptions. Find exact dollar savings in under 2 minutes.**

Live: [credex.rocks](https://credex.rocks)

---

## Screenshots

| Landing page | Audit form | Results page |
|-------------|-----------|-------------|
| ![Landing page — hero with CTA and How It Works](https://credex.rocks/og-image.png) | *(form with tool/plan/seat inputs)* | *(savings hero + ToolCards)* |

> **For reviewers:** full-resolution screenshots and a 30-second screen recording are available at the live URL above. The results page for a sample 10-seat startup using Claude Max + ChatGPT Team is at: `https://credex.rocks/audit/[id]` (generated on first audit run).

---

## What it does

Most startups overpay for AI tools by 30–60%. Credex analyzes your current AI subscriptions — ChatGPT, Claude, Cursor, GitHub Copilot, Windsurf, Gemini, OpenAI API, Anthropic API — and produces specific recommendations:

- Downgrade to a cheaper plan for your team size
- Consolidate overlapping tools (e.g. paying for both Claude and ChatGPT)
- Switch to annual billing
- Route purchases through Credex credits for an extra 20% off

Every recommendation includes the exact monthly and annual dollar savings.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-handle/credex.git
cd credex

# 2. Install
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          GROQ_API_KEY, RESEND_API_KEY

# 4. Run
npm run dev
# → http://localhost:3000

# 5. Test
npm test
```

### Environment variables

| Variable | Required | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (public) |
| `GROQ_API_KEY` | No | Groq key for AI summaries (falls back to template) |
| `RESEND_API_KEY` | No | Resend key for confirmation emails |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Database | Supabase (Postgres) |
| AI | Groq (`llama-3.3-70b-versatile`) |
| Email | Resend |
| Testing | Vitest |
| CI | GitHub Actions |
| Deploy | Vercel |

---

## 5 Key Technical Decisions

### 1. Next.js App Router with server components for result pages
Result pages (`/audit/[id]`) are server components that fetch from Supabase directly. This makes OG/Twitter meta tags work correctly for social sharing — scrapers read the raw HTML, no client JS required.

### 2. Supabase for fast, secure data separation
The `audits` table is publicly readable (by UUID). The `leads` table is write-only from the API — no client can read it. Row Level Security enforces this at the database level, not just in application code.

### 3. Groq instead of Anthropic for AI summaries
The AI summary is a nice-to-have, not a core feature. Groq's `llama-3.3-70b-versatile` model is fast (< 1s), cheap, and has a generous free tier. A robust template fallback ensures the audit result is always useful even when Groq is unavailable.

### 4. Audit engine as pure TypeScript, not an LLM
All recommendation logic — plan-fit analysis, cross-vendor consolidation, Credex discount calculation — is deterministic TypeScript. The LLM only writes a natural-language summary *after* the engine runs. This makes the engine fully testable, predictable, and free to run.

### 5. Honeypot over CAPTCHA for bot protection
The lead capture form includes a hidden `website` field. Bots fill it; humans never see it. Hitting a filled honeypot returns HTTP 200 (silent rejection) so bots can't detect they've been blocked. No CAPTCHA friction for real users.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout (header, footer, fonts)
│   ├── globals.css           # Tailwind v4 theme + dark palette
│   ├── api/
│   │   ├── audit/route.ts    # POST /api/audit — runs engine, stores result
│   │   └── lead/route.ts     # POST /api/lead — stores lead, sends email
│   └── audit/[id]/
│       └── page.tsx          # Results page (server component)
├── components/
│   ├── layout/               # Header, Footer
│   ├── spend-form/           # SpendForm, ToolEntryRow, TeamInfo
│   ├── results/              # SavingsHero, ToolCard, CredexCTA, ShareButtons, LeadCaptureForm
│   └── ui/                   # shadcn primitives (button, input, select, ...)
├── lib/
│   ├── pricing-data.ts       # All tool/plan pricing + helper functions
│   ├── audit-engine.ts       # Core recommendation engine
│   ├── ai-summary.ts         # Groq summary + template fallback
│   └── supabase.ts           # Supabase client
└── types/
    └── index.ts              # All shared TypeScript types
```

---

## Running Tests

```bash
npm test          # run all tests
npm test -- --coverage  # with coverage report
```

Tests cover: audit engine scenarios (7 cases), AI summary generation (12 cases), lead capture validation (22 cases).

---

## Database Schema

```sql
-- Audit results (public read by UUID)
create table audits (
  id uuid primary key default gen_random_uuid(),
  tools jsonb not null,
  team_size int not null,
  use_case text not null,
  results jsonb not null,
  total_monthly_savings numeric,
  total_annual_savings numeric,
  total_credex_savings numeric,
  ai_summary text,
  created_at timestamptz default now()
);

-- Lead captures (write-only from API)
create table leads (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id),
  email text not null,
  company_name text,
  role text,
  team_size int,
  created_at timestamptz default now(),
  unique(email, audit_id)
);
```
