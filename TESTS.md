# Test Documentation

## Running Tests

```bash
npm test                      # run all tests (watch mode off)
npm test -- --reporter=verbose # verbose output with individual test names
npm test -- --coverage        # with coverage report
```

**Result:** 47 tests across 4 test files — all passing.

---

## Test Files

### 1. `src/__tests__/audit-engine.test.ts`

**Purpose:** Verify that the core audit engine produces correct recommendations and savings numbers.

**Why this matters:** The engine is the entire product. If it produces wrong savings numbers or wrong recommendations, users lose trust immediately. Every recommendation scenario is tested explicitly with exact dollar amounts.

| Test | What it verifies |
|------|-----------------|
| Single tool, keep_current | No recommendation when plan is already optimal |
| Downgrade plan | Correctly identifies cheaper plan when team is below minSeats |
| Upgrade to team plan | Recommends team plan when savings ≥ 0 for groups > 3 |
| Cross-vendor consolidation | Secondary tool in same category marked as "consolidate, $0" |
| Credex overlay | 20% discount applied to recommended plan cost |
| Free-tier tool | Zero-price plan produces no recommendation |
| totalCurrentSpend | Sum of all input monthlySpend values |

### 2. `src/__tests__/ai-summary.test.ts`

**Purpose:** Verify that AI summaries are generated correctly and that the fallback is always safe.

**Why this matters:** The Groq API can be unavailable, return empty responses, or exceed rate limits. The template fallback must always produce a useful, non-empty, correctly-formatted summary. Tests run without a real API key — Groq is mocked.

| Test group | Cases | What it verifies |
|-----------|-------|-----------------|
| `generateTemplateSummary` | 5 | Already optimal, small savings, high savings, tool name included, action name formatted |
| `generateAISummary` (no client) | 1 | Falls back to template when Groq client is null |
| `generateAISummary` (API error) | 1 | Falls back to template on thrown error |
| `generateAISummary` (empty response) | 1 | Falls back when response has no content |
| `generateAISummary` (success) | 1 | Extracts and returns text from successful response |
| Summary length validation | 1 | All template summaries are < 300 characters |
| Fallback behavior | 2 | Never returns empty string; includes savings amount when significant |

### 3. `src/__tests__/lead-capture.test.ts`

**Purpose:** Verify lead capture validation logic — email format, honeypot detection, required fields.

**Why this matters:** The lead capture endpoint is the only place we touch user PII. Validation must be strict (no invalid emails stored), and honeypot must silently accept bots without revealing detection.

| Test group | Cases | What it verifies |
|-----------|-------|-----------------|
| Honeypot detection | 5 | Empty → pass; whitespace-only → bot; URL → bot; undefined → pass; string → bot |
| Email validation | 9 | Valid formats pass; missing @, no TLD, spaces → reject |
| LeadInput contract | 4 | Required fields, optional fields, undefined honeypot, PII fields present |
| Handler guard logic | 6 | Bot → silent 200; invalid email → 400; missing auditId → 400; clean input → 201 |
| Mock sanity | 2 | vi.fn() works; async mock returns expected value |

### 4. `src/__tests__/pricing-data.test.ts`

**Purpose:** Verify pricing data helpers return correct values.

**Why this matters:** `calculateMonthlyCost` is used everywhere in the audit engine. A bug here corrupts every savings calculation.

| Test | What it verifies |
|------|-----------------|
| `getToolDisplayName` | Returns correct display name for each tool ID |
| `getPlan` | Returns correct plan object by tool + plan ID |
| `calculateMonthlyCost` | Returns `price × seats` (not just flat price) |
| `getPlansForTool` | Returns all plans for a given tool |
| Unknown IDs | Returns undefined / 0 gracefully |

---

## Coverage Gaps (known, accepted)

| Area | Why not tested |
|------|---------------|
| `/api/audit` route handler | Requires real Supabase connection; integration test scope |
| `/api/lead` route handler | Same; also requires Resend mock |
| React components | UI correctness is better verified by visual review; unit tests would be brittle for JSX |
| `SpendForm` state machine | localStorage interaction; would require jsdom setup; low ROI for the risk |

The highest-risk logic (audit engine math, summary fallback, email validation) is fully covered.
