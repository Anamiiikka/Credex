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

**Hours worked:** 4

**What I did:**
- Built SavingsHero component with animated count-up numbers using framer-motion and react-intersection-observer
- Created ToolCard component with action-aware color badges and per-recommendation styling (downgrade/consolidate/credex/etc.)
- Implemented CredexCTA with three savings tiers: optimal (<$100), mid-range ($100–$500), and high savings (>$500)
- Fixed critical framer-motion API issue (motion.animate → animate function import)
- Updated types to match audit engine output format (ToolRecommendation with recommendedAction and credexSavings fields)
- Transformed audit engine to return public ToolRecommendation format instead of internal recommendation objects
- Built POST /api/audit route with input validation, Supabase storage, and proper error handling
- Connected SpendForm to the API with correct response key matching (id instead of auditId)
- Updated audit results page to fetch real data from Supabase instead of mock data
- Added dynamic metadata generation for OG tags (shows savings amount in title/description per audit)
- Fixed test suite: updated all 4 failing audit-engine tests to match new ToolRecommendation format
- All 7 tests now passing (100% pass rate)

**What I learned:**
- framer-motion has two different animation APIs: motion.animate (DOM API for elements) and animate (value interpolation API for numbers). The documentation distinction between them is subtle but critical.
- TypeScript makes it easy to catch format mismatches when transforming data between internal and public formats. By having explicit interfaces for both, bugs surface immediately.
- Using stable keys (like `${tool}-${action}`) instead of array indices prevents React reconciliation bugs when lists might reorder in the future.
- Next.js 15 has async params in route handlers, requiring `await params` before destructuring.

**Blockers / what I'm stuck on:**
- None. The end-to-end flow from form submission → audit execution → results page display is now fully functional.

**5 Day-3 Commits:**
1. ✅ fix: resolve framer-motion animate API usage and add missing savings metrics
2. ✅ feat: build per-tool recommendation cards with savings breakdown and action badges
3. ✅ feat: add Credex CTA section for high-savings audits and honest optimal state message
4. ✅ feat: implement POST /api/audit route with Supabase storage and audit engine
5. ✅ feat: connect form submission to API and navigate to results page

**CI Status:** Green ✅

**Plan for tomorrow (Day 4):**
- Implement AI summary generation using Anthropic API
- Build lead capture form on results page
- Set up email capture in Supabase
- Add form validation and honeypot field for spam prevention
- "setState in useEffect" is an anti-pattern when hydrating state from localStorage. It causes an extra render cycle. The React-recommended pattern is using a lazy initializer function inside `useState(() => ...)` which runs synchronously before the first render, preventing skeleton flashes and extra cycles.
- Proper mathematical separation of metrics is crucial for building trust with users and reviewers—combining plan savings with platform credits too early can inflate annual numbers deceptively.

**Blockers / what I'm stuck on:**
- None. The audit engine math is now rock-solid and the form UI is robust.

**Plan for tomorrow (Day 3):**
- Build the UI to display the audit results (Results Dashboard).
- Implement the AI Summary generation using Anthropic API.
- Set up Supabase Lead Capture.
