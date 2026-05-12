# Reflection

## 1. The hardest bug you hit this week, and how you debugged it

The hardest bug was the audit engine producing completely wrong savings numbers across every recommendation. Every output was off — the numbers were inconsistent, suspiciously low, and a few cents for what should have been hundreds of dollars.

**Hypotheses I formed:**
1. The engine logic itself had wrong formulas (maybe summing costs incorrectly)
2. The input data from the form was wrong (seats not being passed)
3. The pricing data helper was returning the wrong value

I started by adding `console.log` inside `runAuditEngine` to print `currentCost` for each tool entry. Every tool was showing its per-seat price ($20, $30, $100) regardless of how many seats were entered. I ruled out hypothesis 1 — the formulas were fine, they were just receiving a wrong `currentCost` value.

I then checked where `currentCost` came from: `entry.monthlySpend`. That's set by `updateTool()` in SpendForm via `calculateMonthlyCost()`. I added another log inside `calculateMonthlyCost` and found it was returning `plan.monthlyPricePerSeat` — the flat per-seat price — without multiplying by `seats`.

The fix was one line: `return plan.monthlyPricePerSeat * seats`. But finding it required tracing through 4 files (SpendForm → updateTool → calculateMonthlyCost → PlanOption). The bug had propagated silently because TypeScript had no complaint — the function signature was correct, just the logic was wrong.

What I'd do differently: write the test `expect(calculateMonthlyCost('chatgpt', 'chatgpt_plus', 10)).toBe(200)` before writing the engine that depends on it.

---

## 2. A decision you reversed mid-week, and what made you reverse it

I initially planned to use the Anthropic API for the AI audit summary — it was the stated preference in the brief and I had API access. On Day 4, when I went to integrate it, I hit the rate limits and latency on the free-credits tier: each summary call took 3–5 seconds and occasionally timed out in the API route. That's too slow to block the audit result page load on.

I switched to Groq with `llama-3.3-70b-versatile`. The call went from 3–5 seconds to under 1 second, the free tier is more generous, and the output quality for a 1–2 sentence summary was indistinguishable from Claude in my testing.

The reversal taught me something: "preferred tool" in a spec is a starting point, not a constraint. If the tool doesn't fit the production requirement (in this case: blocking latency in a route handler), you document the tradeoff and pick the tool that ships.

I documented this in the PROMPTS.md and ARCHITECTURE.md rather than hiding it.

---

## 3. What you would build in week 2

**Priority 1: Pricing data refresh pipeline.** The audit engine is only as good as the prices it knows. Right now, prices are hardcoded and manually verified. I'd write a scheduled GitHub Action (or Vercel Cron) that fetches pricing pages weekly and alerts me if a price has changed more than 10%. This is the single highest-ROI infrastructure investment — wrong prices undermine trust faster than anything else.

**Priority 2: Benchmark mode.** Add a "companies like yours spend $X/developer on AI tools" comparison. This requires aggregate data across submitted audits (anonymised). The moment you have 100 audits, you can compute median AI spend per developer segmented by team size and use case. That comparison creates a second "aha moment" beyond just the savings number — it answers "am I normal?"

**Priority 3: Admin lead view.** Right now, leads go into Supabase and get an email. There's no way to see them without running a SQL query. A simple `/admin` route behind a secret header that shows a sortable table of leads, their audit savings, and when they submitted — this would take half a day and make the sales workflow 10x faster.

**Priority 4: Embeddable widget.** A `<script>` tag that a startup-focused blogger or newsletter author can drop into their content. The widget renders a mini version of the form. Incoming lead volume from embedded widgets would likely exceed direct traffic within a month.

---

## 4. How you used AI tools

**Tool used:** Claude Code (Anthropic) throughout the week, accessed via the Claude Code CLI.

**What I used it for:**
- Generating boilerplate (API route structure, Supabase client setup, component scaffolding)
- Debugging TypeScript errors — paste the error, get the explanation and fix
- Reviewing audit engine logic for edge cases I might have missed
- Drafting documentation structure (then rewriting the actual content myself)
- Checking Tailwind v4 syntax when I kept hitting `bg-gradient-to-r` vs `bg-linear-to-r` issues

**What I didn't trust it with:**
- The actual pricing numbers — I verified every price against official vendor pages myself. An AI trained on data from 6 months ago will have stale prices.
- The user interview content — those conversations happened with real people.
- The audit engine logic decisions (which action to recommend in which situation) — I wrote those rules based on what a finance-literate person would find defensible, not what the AI suggested.

**One time the AI was wrong and I caught it:**

Claude Code suggested wrapping `sendConfirmationEmail` in a try-catch that surfaced the error to the API response as a `500`. I questioned this — if the email fails, the lead is already saved in Supabase. Returning a 500 would make the frontend show an error to the user even though their data was captured successfully. The right behavior is fire-and-forget: log the failure server-side, return `201` to the client regardless. I overrode the suggestion and documented the reason in the route handler.

---

## 5. Self-ratings

**Discipline: 7/10**
Committed on 6 of the 7 calendar days. Day 6 code was completed on Day 7 morning due to real-life interruptions the evening of Day 6 — visible in git timestamps. I'd rate myself higher if the commits were more evenly distributed; the Day 10 and Day 12 clusters are a little heavy.

**Code quality: 8/10**
TypeScript strict throughout, no `any` in production code, clean separation between the audit engine (pure functions, fully tested) and the UI. The main gap: some API route handlers could be split into smaller functions and the pricing-data.ts file is long. Neither is a bug but both would slow down a new contributor.

**Design sense: 7/10**
The dark theme is intentional, the emerald savings color is consistent, and the typography hierarchy is clear. What I'm less confident in: spacing rhythm (some sections feel too tight or too loose on mobile), and I don't have a formal type scale. I made decisions by eye rather than by system.

**Problem-solving: 8/10**
I caught the flat-price bug by systematic logging and tracing. I diagnosed the Base UI `SelectValue` issue by reading the component source in `node_modules` rather than searching StackOverflow (the issue wasn't on StackOverflow). I made a defensible call on fire-and-forget email. Where I lost a point: I initially had to undo and redo the CredexCTA conditions twice before getting the threshold logic right.

**Entrepreneurial thinking: 7/10**
I ran 3 real user interviews on Day 2 and used the insight ("certainty, not just savings") to redesign the hero. I wrote specific GTM with named channels and concrete week-1 targets. I ran the unit economics math. Where I'm self-critical: I don't have real data yet on conversion rates, and the ECONOMICS.md makes assumptions I haven't validated. A founder would have found a faster path to one real validated datapoint before writing the spreadsheet.
