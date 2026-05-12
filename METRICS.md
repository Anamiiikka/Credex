# Metrics

## North Star Metric

**Credex CTA click rate on high-savings audit results (savings ≥ $200/mo)**

This is the tightest possible signal of product-market fit: a user who saw a credible savings number and had high enough intent to click through to Credex. It captures both audit quality (savings estimate was believable) and product-market fit (user wants to act on it).

**Target:** ≥ 15% of high-savings result pages generate a CTA click within the session.

---

## Leading Metrics (first 30 days)

| Metric | Definition | Target | Measurement |
|--------|-----------|--------|-------------|
| Audit completion rate | % of users who load the form and submit it | ≥ 70% | Supabase: audits created / page views |
| High-savings audit rate | % of submitted audits with ≥ $200/mo savings | ≥ 40% | Supabase: `total_monthly_savings >= 200` |
| Credex CTA click rate | % of high-savings result pages with CTA click | ≥ 15% | Click event → Supabase or Plausible |
| Lead capture rate | % of result page views → email submitted | ≥ 8% | Supabase: leads / audit page views |
| Share rate | % of result pages where share button is clicked | ≥ 5% | Click event logging |
| Return audit rate | Same browser submits > 1 audit | ≥ 10% | localStorage + Supabase dedup |

---

## Lagging Metrics (30–90 days)

| Metric | Definition | Target |
|--------|-----------|--------|
| Credex signup rate | % of CTA clicks → Credex account created | ≥ 20% |
| MRR from audit funnel | Monthly recurring Credex billing from audit-sourced leads | $1,000+ by day 90 |
| Payback period | Days from first Credex purchase to CAC recovery | ≤ 30 days |
| Net Promoter Score | Would you recommend Credex to a colleague? | ≥ 40 |

---

## Instrumentation Plan

### Phase 1 (current — MVP)
- Supabase `audits` table: counts and savings distributions via SQL
- Supabase `leads` table: email capture rate, time-to-capture
- No client-side event tracking yet

### Phase 2 (post-launch)
- Add Plausible (privacy-friendly, no cookies) for page-level analytics
- Track 3 custom events: `audit_submitted`, `cta_clicked`, `lead_captured`
- Dashboard query: CTA click rate by savings bucket ($0–$100, $100–$500, $500+)

### Phase 3 (growth)
- Add audit UUID to Credex signup referral parameter
- Track full funnel: audit → CTA click → signup → first purchase
- Weekly retention cohorts by first-audit savings amount

---

## Anti-Metrics (things we explicitly do not optimize for)

- **Total audits run** — vanity metric. Easy to inflate with bots or low-intent visitors.
- **Time on site** — we want instant results, not engagement loops.
- **Email open rate** — proxy metric. Irrelevant if users never click through to Credex.
