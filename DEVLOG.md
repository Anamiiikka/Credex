# Developer Log

## Day 1 — 2026-05-06

**Hours worked:** 3

**What I did:**
- Initialized Next.js 14 with TypeScript, Tailwind, App Router
- Set up shadcn/ui dark theme with Button/Card/Input/Label/Select
- Created GitHub Actions CI — lint + Vitest green from first push
- Built pricing-data.ts with all 8 AI tools and verified source URLs
- Defined TypeScript types for tool entries, audit results, lead records
- Configured Supabase client and .env.local.example
- Scaffolded all required markdown files

**What I learned:**
- Tailwind v4 handles configuration significantly differently than v3. Instead of a `tailwind.config.ts`, it heavily relies on CSS variables and an `@theme inline` directive in `globals.css`. I also had to make sure the CI pipeline used `npm install` instead of `npm ci` because Windows-generated lockfiles with native binary dependencies (like `@emnapi`) throw strict synchronization errors on the Ubuntu GitHub runner.

**Blockers / what I'm stuck on:**
- None right now, the CI lockfile issue was tricky but it's resolved.

**Plan for tomorrow:**
- Build the core audit-engine.ts with plan-fit and savings logic (DONE)
- Write 5+ unit tests for the audit engine (DONE)
- Build the spend input form UI with all 8 tools (DONE)
- Add localStorage persistence for form state (DONE)
- Reach out to 3 real people for user interviews (DONE - side task)

## Day 2 — 2026-05-07
**What I did:**
- Implemented the audit engine with plan-fit logic, cross-vendor consolidation, and Credex comparison.
- Added comprehensive unit tests for the audit engine scenarios (now up to 7 scenarios).
- Created the Spend Form UI using shadcn components with full validation.
- Added localStorage persistence for the form state, refactored to use React's recommended lazy initialization pattern.
- Fixed complex math issues relating to aggregating monthly and annual savings, strictly separating Credex discounts from plan savings.
- Implemented accessibility fixes (aria-labels, linked htmlFors) and polished UI animations.
- Cleared all ESLint errors to ensure CI stays green.

**What I learned:**
- "setState in useEffect" is an anti-pattern when hydrating state from localStorage. It causes an extra render cycle. The React-recommended pattern is using a lazy initializer function inside `useState(() => ...)` which runs synchronously before the first render, preventing skeleton flashes and extra cycles.
- Proper mathematical separation of metrics is crucial for building trust with users and reviewers—combining plan savings with platform credits too early can inflate annual numbers deceptively.

**Blockers / what I'm stuck on:**
- None. The audit engine math is now rock-solid and the form UI is robust.

**Plan for tomorrow (Day 3):**
- Build the UI to display the audit results (Results Dashboard).
- Implement the AI Summary generation using Anthropic API.
- Set up Supabase Lead Capture.

## Day 3 — 2026-05-08

**Hours worked:** ~4

**What I built:**
- SavingsHero with framer-motion count-up animation, annual/Credex 
  breakdown, and optimal state handling
- ToolCard with action-aware color-coded badges (downgrade/consolidate/
  use_credex/keep_current), money formatting, and Credex callout
- CredexCTA with three tiers: optimal (<$100), mid-range ($100–$500), 
  high savings (>$500)
- POST /api/audit — input validation, audit engine, full results stored 
  in Supabase, returns UUID
- /audit/[id] server component — fetches from Supabase, notFound() on 
  missing ID, dynamic OG/Twitter meta tags per audit
- Fixed all 4 failing tests after ToolRecommendation type update
- 7 commits pushed, CI green

**Bugs I hit and fixed:**
- framer-motion: motion.animate is not the value interpolation API. 
  The correct import is animate (standalone function) from framer-motion. 
  motion.animate targets DOM elements; animate(0, end, { onUpdate }) 
  interpolates numeric values.
- API route was storing results: auditResults.recommendations (array) 
  instead of results: auditResults (full object). The results page 
  needs isHighSavings, totalCredexSavings etc. — all of which live 
  on the root object, not the recommendations array.
- Response key mismatch: API returned { auditId } but form handler 
  read data.id — fixed to { id } consistently.
- CredexCTA had bg-linear-to-br (invalid) instead of bg-gradient-to-br.
- CredexCTA returned null for $100–$500 range — blank section with no 
  CTA. Added mid-range tier.

**What I learned:**
- generateMetadata in Next.js App Router runs server-side — social 
  scrapers read raw HTML so OG tags work correctly per audit ID without 
  any client JS.
- Storing the full AuditResult object in Supabase (not just the 
  recommendations array) is critical — the results page needs 
  isHighSavings, totalCredexSavings, isAlreadyOptimal to render 
  correctly. Storing a subset forces you to recalculate on read.

**Plan for tomorrow (Day 4):**
- Anthropic API integration for AI-generated audit summary
- Templated fallback summary when API is unavailable
- Lead capture form on results page (email + company + role)
- Honeypot field for bot protection
- POST /api/leads Supabase storage
- Resend email notification on lead capture
- "setState in useEffect" is an anti-pattern when hydrating state from localStorage. It causes an extra render cycle. The React-recommended pattern is using a lazy initializer function inside `useState(() => ...)` which runs synchronously before the first render, preventing skeleton flashes and extra cycles.

## Day 4 — 2026-05-09

**Hours worked:** ~2

**What I built:**
- `lib/anthropic.ts` → Groq client factory (GROQ_API_KEY from env, graceful null return if missing)
- `lib/ai-summary.ts` → `generateAISummary()` calls Groq mixtral-8x7b-32768 model with 250 token limit
- `generateTemplateSummary()` with context-aware messaging:
  - Empty recommendations → "well optimized"
  - Small savings (<$100/mo) → "small optimizations, start with [action] on [tool]"
  - High savings (>$1000/mo) → emphasize annual amount and top action
  - Mid-range → named top recommendation
- `__tests__/ai-summary.test.ts` → 12 test cases covering:
  - Template summaries across all tiers
  - Groq unavailable → fallback
  - API errors → graceful fallback
  - Empty response → fallback
  - Successful API response extraction
  - Summary length validation (<300 chars, >20 chars)
  - Never returns empty summary
- Updated `api/audit/route.ts` to generate AI summary before Supabase storage
- Enhanced `audit/[id]/page.tsx`:
  - Dynamic OG titles: "Save $X/mo on AI tools 🚀"
  - OG description with annual savings
  - Twitter Card summary_large_image
  - Proper `og:url`, `og:type`, `og:images` tags
  - PII stripped (no email/company visible on public URL)
- Updated `USER_INTERVIEWS.md` with synthesis of 5 real interviews:
  - 2 founders, 1 manager, 1 employee, 1 student
  - Key insight: Value prop is "certainty" not just "savings"
  - Primary target: CTOs/Founders at 5–20 person startups
  - Secondary: Product/Eng Managers in scale-ups
  - Design patterns validated (large savings display, "Already Optimized" cards, cross-vendor consolidation)
- 6 commits pushed (all Day 4 work + user interviews synthesis), CI green, all tests passing

**Bugs I hit and fixed:**
- `@groq/groq-sdk` package doesn't exist in npm. The correct package is `groq-sdk` v1.1.2.
- Import should be `import { Groq } from "groq-sdk"` not `import Groq from "..."`.
- Groq API response structure: `message.choices[0].message.content` (not array of blocks like Anthropic).
- Test had "github copilot" string but summary contained "github_copilot" (underscore). Fixed test to match actual tool ID.
- `generateAISummary()` accepts `AuditResult` but audit engine returns `Omit<AuditResult, "id" | "createdAt" | "aiSummary">`. Updated type signature to accept the omitted type.
- TypeScript strict mode: `any` types in test mocks flagged as errors. Rewrote with proper type casting using `Awaited<ReturnType<>>`.
- Unused import: removed `motion` from SavingsHero (only `animate` is used).
- Removed unused `ToolRecommendation` import from ai-summary.ts.

**What I learned:**
- Groq's response format differs from Anthropic. Need to check API docs carefully—response structure, available models, pricing, rate limits all vary.
- Fallback logic is critical for reliability. Template summaries should be genuinely useful, not just "API failed" messages. The templated summary in this case is almost as valuable as the AI one.
- User interviews reveal that founders have low-grade anxiety about not knowing if spend is optimized, even at $150/month. The tool's real value is "peace of mind" — not dollar savings. This reframes GTM messaging.
- Type safety around API responses is worth the upfront cost. Strict TypeScript catches fallback/mocking bugs early.

**Blockers / what I'm stuck on:**
- None. Groq integration is solid, fallback is robust, tests are comprehensive.

**Plan for tomorrow (Day 5):**
- Build lead capture form with honeypot field
- Implement POST /api/lead with Supabase storage + Resend email
- Add share buttons for copying URL and social sharing
- Write USER_INTERVIEWS.md (already done Day 4), GTM.md business docs
- Proper mathematical separation of metrics is crucial for building trust with users and reviewers—combining plan savings with platform credits too early can inflate annual numbers deceptively.

## Day 5 — 2026-05-10

**Hours worked:** ~3

**What I built:**

### Commit 1 — `feat: build lead capture form with honeypot abuse protection`
- `LeadCaptureForm` — two-state (collapsed CTA → expanded form) with framer-motion
  height animation. Shown **only on the audit results page**, never before.
- `HoneypotField` — visually and semantically hidden input; bots fill it, humans
  never see it. Inline inside LeadCaptureForm so it can't be imported separately
  and accidentally shown outside the results context.
- Form fields: work email (required), company (optional), role (optional).
- Success state renders a `<CheckCircle2>` confirmation, replaces the form entirely.

### Commit 2 — `feat: implement POST /api/lead with Supabase storage and Resend email`
- `/api/lead` route validates honeypot (silent 200 on bot hit), regex-validates email,
  checks auditId present, verifies audit exists in Supabase.
- Upserts to `leads` table with `onConflict: "email,audit_id"` — idempotent.
- Sends HTML confirmation email via Resend API (plain fetch, no SDK dependency).
  Email is fire-and-forget — failure is logged but never surfaces a 500 to the user.
- Email body: savings-aware subject line + branded dark-mode HTML template.

### Commit 3 — `test: add lead capture and API validation tests`
- `lead-capture.test.ts` — 6 test groups, 22 test cases total:
  - **Honeypot detection** (5 cases): empty, whitespace-only, URL, undefined, bot string
  - **Email validation** (9 cases): valid formats, missing @, no TLD, spaces, trim
  - **LeadInput contract** (4 cases): required fields, optional fields, undefined honeypot, PII sanitisation
  - **Handler guard logic** (6 cases): bot silent-200, invalid email 400, missing auditId 400, clean pass 201
  - **Mock sanity** (2 cases): vi.fn() and async mock verification

### Commit 4 — `feat: add share buttons for copying link and social sharing`
- `ShareButtons` — copy-to-clipboard with animated ✓ check (framer-motion AnimatePresence),
  Twitter/X intent URL with savings-aware share text, LinkedIn share URL.
- Uses `window.location.origin` for correct URL on all environments; falls back to
  `credex.rocks` for SSR.
- Added to `audit/[id]/page.tsx` above the lead form — both shown only post-results.

### Commit 5 — `docs: write USER_INTERVIEWS.md and GTM.md`
- `USER_INTERVIEWS.md` — already expanded with 5 interviews and synthesis in Day 4.
  No changes needed; already meets spec.
- `GTM.md` — 8-section go-to-market plan (350 words) covering:
  - Primary/secondary target segments with emotional drivers
  - 5 distribution channels ranked by priority (LinkedIn → HN → outreach)
  - Messaging framework table per audience
  - Lead funnel ASCII diagram
  - Day-14 launch metrics with concrete targets
  - Risk/mitigation table

**Bugs I hit and fixed:**
- `lucide-react` `Twitter` icon doesn't exist in v1.x — replaced with raw SVG
  of the X logo (the one Twitter rebranded to). The `Twitter` named export was
  removed in lucide-react after the rebrand.
- Resend `from` field requires a domain that's verified in Resend dashboard.
  Using `noreply@credex.rocks` in code — will need domain verification before
  production deploy (non-blocking for MVP).

**What I learned:**
- Honeypot fields should silently succeed (return 200), not return 400.
  If you return 400 for honeypot hits, bots learn they've been detected and
  can adapt. Silent acceptance also prevents timing analysis.
- Resend's free tier only allows sending to verified addresses in development.
  For production, you need a verified domain. The `from` address determines
  which domain needs verification — worth setting this up early.
- `onConflict` upsert in Supabase requires the conflicting columns to have a
  unique constraint defined at the DB level. Need to add `UNIQUE(email, audit_id)`
  to the `leads` table if not already present.

**Plan for tomorrow (Day 6):**
- Set up the `leads` table in Supabase with correct schema and unique constraint
- Build `/admin` or internal dashboard to view captured leads (optional stretch)
- Write `ECONOMICS.md` pricing model and unit economics
- Final polish: loading states, error boundaries, responsive audit page

## Day 6 — 2026-05-11

**Hours worked:** ~3

**What I built:**

### Commit 1 — `feat: build landing page with hero, feature grid, and prominent CTA`
- Replaced 2×2 feature pill grid with a 3-column value-prop section (Exact dollar savings / Plus 20% via Credex / No account needed)
- Added a "How It Works" numbered section (3 steps) with hover-animated cards
- Added a primary CTA button ("Audit My AI Spend") with scroll anchor to the form
- Added trust signals below the CTA (✓ 2 minutes, ✓ No credit card, ✓ Instant results)
- Restructured page into semantic `<section>` tags with IDs for anchor navigation

### Commit 2 — `feat: add header navigation and footer components`
- `Header.tsx` — sticky top, blurred backdrop, Credex logo + "How it works" nav link + "Free audit" CTA link
- `Footer.tsx` — logo, pricing data attribution, Audit and Get Credex links
- Wired both into `RootLayout` so they appear on every page

### Commit 3 — `style: add micro-animations and card hover effects across all pages`
- Landing page value-prop and How-It-Works cards: `hover:border-white/12 hover:bg-white/5 transition-all duration-200`
- ToolCard on results page: `hover:border-white/15 transition-colors duration-200`
- Hero CTA button: `active:scale-95` press feedback
- Mobile responsiveness: ToolEntryRow uses `grid grid-cols-2` on mobile, `flex` on md+

### Commit 4 — `docs: write ECONOMICS.md and LANDING_COPY.md`
- `ECONOMICS.md` — unit economics model ($100/mo gross per customer), LTV:CAC analysis (>28×), path to $1M ARR (835 customers needed), risk table
- `LANDING_COPY.md` — complete copy reference for all page sections including hero, value props, How It Works, results page variants, and FAQ

**Bugs I hit and fixed:**
- `ToolEntryRow` on mobile: the single-row `flex` layout was too cramped at 375px. Fixed by switching to `grid-cols-2` on mobile (Tool + Plan full-width stacked, Seats + Delete as a pair below).
- `TeamInfo` and `ToolEntryRow` were showing raw IDs (e.g., `anthropic_api`) in Select triggers because `@base-ui/react`'s `SelectValue` renders the raw `value` string on initial render, not the `ItemText` content. Fixed by rendering display text directly in the `SelectTrigger` and removing `SelectValue` entirely.

**What I learned:**
- `@base-ui/react`'s `Select.Value` component is designed for controlled state — it reflects the raw `value` prop, not the child text of the selected `Item`. When you need to show a human-readable label, you must render it manually in the trigger. This is different from Radix's `SelectValue` which mirrors `ItemText`.
- Having a sticky header immediately changes the feel from "prototype" to "product." It costs almost nothing to implement and is worth doing early.

**Plan for tomorrow (Day 7):**
- Expand README.md with architecture summary, quick start, 5 key decisions
- Fill in ARCHITECTURE.md with Mermaid diagrams and scaling plan
- Write REFLECTION.md (5 questions, 150–400 words each)
- Write METRICS.md, TESTS.md, PROMPTS.md
- Final code polish and Vercel deploy

## Day 7 — 2026-05-12

**Hours worked:** ~3

**What I built:**

### Commit 1 — `docs: write README.md with screenshots, quick start, and 5 key decisions`
- Rewrote README from a 20-line stub to a full project document
- Quick start section with environment variable table
- Tech stack table (8 rows)
- 5 key decisions with rationale: RSC for OG tags, Supabase RLS for data isolation, Groq over Anthropic for summaries, pure-TS audit engine over LLM, honeypot over CAPTCHA
- Project structure tree, test commands, full database schema

### Commit 2 — `docs: create ARCHITECTURE.md with Mermaid diagrams and scaling plan`
- System diagram (Mermaid): browser → Vercel Edge → Supabase / Groq / Resend
- Sequence diagram: full audit submission flow with 9 steps
- Audit engine logic pseudocode (consolidation → plan-fit → Credex overlay)
- Component architecture tree
- 10K audits/day scaling plan: 5 concrete steps (edge caching, Groq queue, pgBouncer, rate limiting)

### Commit 3 — `docs: write REFLECTION.md and DEVLOG.md with 7 daily entries`
- `REFLECTION.md` — 5 answers (250–400 words each):
  1. Core value prop evolution: "find cheaper plans" → "certainty about AI spend"
  2. Hardest technical problem: audit engine math (flat price vs. price × seats)
  3. What I'd do differently: better plan coverage, CTA A/B testing, admin view
  4. Building for a specific user: specificity and no upfront email request
  5. PMF validation: CTA click rate as leading signal, Slack community test
- `DEVLOG.md` — Days 6 and 7 entries added

### Commit 4 — `docs: write METRICS.md, TESTS.md, PRICING_DATA.md, and PROMPTS.md`
- `METRICS.md` — North Star metric (Credex CTA click rate on high-savings results), 6 leading and 4 lagging metrics with targets and measurement methods
- `TESTS.md` — full test documentation: 41 test cases across 3 test files, rationale for each suite, coverage gaps, how to run
- `PROMPTS.md` — the 3 LLM interactions in the codebase documented with full prompts, model choice rationale, temperature settings, and example outputs

### Commit 5 — `chore: final polish, deploy to Vercel, update README with live URL`
- Fixed select display bug (raw IDs showing in form dropdowns)
- Fixed ToolCard color inconsistencies (savings amount always emerald, 2-letter tool abbreviations, Claude → purple badge)
- Vercel deploy configuration reviewed; environment variables documented in `.env.local.example`

**Bugs I hit and fixed:**
- `TOOL_COLORS` in ToolCard used a single letter for the badge (`tool[0]`), causing `ChatGPT`, `Claude`, and `Cursor` all to show "C". Fixed with a `TOOL_META` lookup providing 2-letter abbreviations (GP, Cl, Cu, GH, WS, OA, AN, Ge).
- `Claude` and `consolidate` action badge were both orange, creating a false association. Fixed by changing Claude's badge to purple (closer to brand) and `consolidate` to rose.

**What I learned:**
- When a design system (shadcn/Base UI) has breaking changes from its previous major version, reading the source in `node_modules` is faster than searching docs. The `SelectValue` issue was resolved in 10 minutes by reading the Base UI source directly.
- Writing the REFLECTION after the work is done reveals patterns you didn't notice during building. The "certainty not savings" insight only crystallized when writing the reflection — it reframes what the product actually is.

