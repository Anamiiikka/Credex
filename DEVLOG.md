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
- Proper mathematical separation of metrics is crucial for building trust with users and reviewers—combining plan savings with platform credits too early can inflate annual numbers deceptively.

**Blockers / what I'm stuck on:**
- None. The audit engine math is now rock-solid and the form UI is robust.

**Plan for tomorrow (Day 3):**
- Build the UI to display the audit results (Results Dashboard).
- Implement the AI Summary generation using Anthropic API.
- Set up Supabase Lead Capture.
