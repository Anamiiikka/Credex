# Reflection

## 1. What is the core value proposition of your product, and how did it evolve during the week?

The original framing was "find cheaper AI plans." By Day 4, after user interviews, it shifted to something more specific: **certainty about your AI spend**. The dollar savings number is the hook, but the real value is removing the low-grade anxiety founders feel about not knowing whether their AI subscriptions are optimized. Several interviewees described spending 10–15 minutes every few months manually checking pricing pages — that mental overhead is what we're eliminating, not just the dollars.

This shift changed how we present results. Instead of leading with a list of recommendations, we lead with a single large savings number ($X/mo) that creates an immediate emotional response. The recommendations below it are the proof, not the headline.

---

## 2. What was the hardest technical problem you solved, and how did you approach it?

The hardest problem was making the audit engine produce **correct savings numbers**. The initial implementation had `calculateMonthlyCost` returning a flat per-seat price without multiplying by seats — so a team of 14 paying $30/seat appeared to cost $30/mo instead of $420/mo. Every recommendation was wrong as a result.

The fix was to trace the math end-to-end: `currentCost = plan.monthlyPricePerSeat × seats`, and use that consistently throughout the engine. This sounds obvious in hindsight but required understanding the full data flow — from form input, through the engine, to the results page — to catch all the places where the flat price was being used incorrectly.

The lesson: always write a test that asserts the exact dollar amounts before building the recommendation logic on top.

---

## 3. What would you do differently if you had another week?

**Better plan coverage.** The current pricing database covers 8 tools with their main plans. Many tools have annual-vs-monthly pricing, enterprise tiers, and education discounts that we don't model. A week of better data work would make the recommendations significantly more accurate and trustworthy.

**A/B test the results page CTA.** The Credex CTA is the monetization point, but we haven't validated that users click it or that the copy resonates. I'd add basic click tracking (Plausible or simple Supabase events) and test two variants: one focused on the dollar savings number, one focused on the "20% off all AI billing" convenience framing.

**Admin view for leads.** Right now leads go into Supabase and get a Resend email. There's no way to see them without querying the database directly. A simple `/admin` route (protected by a secret header) would make follow-up outreach much easier.

---

## 4. What did you learn about building for a specific target user?

The target user — a CTO or founder at a 5–20 person startup — has very little time and high trust threshold. They won't fill in a form unless the output looks credible. This drove two decisions:

1. **Show the savings number before asking for anything.** The lead capture form only appears *after* the audit result is visible. We don't ask for email upfront. This is counterintuitive for lead generation but necessary for the trust calibration of this audience.

2. **Be specific or be ignored.** Vague recommendations ("consider optimizing your AI spend") get ignored. Specific ones ("downgrade Claude Max to Claude Team for 14 users — saves $980/mo") get forwarded to the finance team. Every recommendation in the engine forces a specific dollar amount to be present before it surfaces.

---

## 5. How would you validate product-market fit, and what metrics would you track?

**PMF signal:** Do users who see high savings (>$200/mo) click the Credex CTA within the same session? That's the tightest possible signal — high intent, immediate context, no friction.

**Leading metrics (first 30 days):**
- Audit completion rate (form submission → results page view): target >70%
- Credex CTA click rate on high-savings results: target >15%
- Return visits (same browser, multiple audits): signals word-of-mouth

**Lagging metrics (30–90 days):**
- Lead capture rate (results page → email submitted): target >8%
- Email-to-Credex-signup conversion: target >20%
- MRR from Credex credit purchases

**The simplest PMF test:** Share the tool in one Slack community of startup founders. If 3 out of 20 people who try it share it with someone else unprompted, the core value prop is real. If nobody shares it, the savings estimates aren't credible enough or the tool is too generic.
