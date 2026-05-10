# Go-To-Market Plan — Credex AI Spend Auditor

**Version:** 1.0 · **Date:** 2026-05-10  
**Author:** Anamika (Intern, Credex)

---

## 1. Product Summary

Credex AI Spend Auditor is a free, one-page tool that analyses a team's
AI tool stack and surfaces plan-level savings, cross-vendor consolidation
opportunities, and Credex credit savings. The output is a shareable URL —
an audit report that a CTO can forward to their finance team or a founder
can bookmark and revisit.

**Core value proposition:** *"Know whether your AI spend is optimised —
in under two minutes, for free."*

---

## 2. Target Customer

### Primary: Technical Founders & CTOs at 5–20-person startups

- **Budget authority:** They approve the company card charges directly.
- **Pain:** No process for AI cost review. Spend just accumulates unexamined.
- **Emotional driver:** Low-grade anxiety about being uninformed
  (validated: Akash, Priya interviews — Day 4).
- **Trigger moment:** Series A fundraise prep, monthly expense review,
  or a large Stripe charge they notice and question.

### Secondary: Engineering Managers at 50–200-person scale-ups

- **Pain:** Decentralised purchasing — multiple teams buying overlapping
  tools (Gemini + ChatGPT + Claude all used for "writing").
- **Need:** Data to build an internal consolidation case for leadership.
- **Trigger moment:** Q-end headcount review or a top-down cost-cutting push.

### Out of scope for MVP

Individual contributors (ICs) don't control spend and don't see invoices.
Students and free-tier users are a future freemium segment, not a Day-1 focus.

---

## 3. Distribution Channels (Priority Order)

### 3.1 LinkedIn (Organic — Week 1–2)

**Why first:** Founders and CTOs consume content on LinkedIn during morning
scroll. A single post from a credible account can reach 5,000–50,000 views
organically with a good hook.

**Content:**
- Post: "I audited our AI tool spend and found $X/month we didn't know
  about. Here's a free tool to do the same."
- Format: Personal story → problem → tool link → call to action.
- Cadence: 3 posts/week for the first two weeks, each angle slightly different
  (savings story, interview quote, behind-the-build).

**Success signal:** 50+ clicks to audit page in 7 days.

### 3.2 Twitter/X (Thread — Week 1)

**Why:** AI-tool Twitter has a high density of technical founders.
A thread that teaches something (e.g., "5 AI pricing mistakes startups make")
is more shareable than a pure product post.

**Content:**
- Thread: "We looked at how 50 startups pay for AI tools. Here's what
  we found." (curated from interview data.)
- Pin to profile. Cross-post to LinkedIn.

**Success signal:** 200+ impressions, 10+ link clicks.

### 3.3 Indie Hacker / Hacker News (Week 2)

**Why:** "Show HN" posts for free tools that solve a real problem perform
well. The Credex audit is genuinely free and produces a shareable URL —
both HN-friendly properties.

**Content:**
- "Show HN: Free AI Spend Auditor — paste your tools, get a savings breakdown"
- IH post: launch story with numbers (audits run, leads captured, savings found).

**Success signal:** 10+ upvotes on HN, 5+ comments engaging with the tool.

### 3.4 Direct Founder Outreach (Week 2–3)

**Why:** Cold outreach with a free audit pre-filled for their known stack
converts far better than generic DMs. If we know a startup uses Cursor
(from their job postings or GitHub), we can send a personalised message.

**Approach:**
- Identify 20 startups that list AI tools in job descriptions.
- Send a WhatsApp/email: "I pre-filled your likely stack — here's your
  audit: [URL]. Takes 30s to verify."
- Target: 3 booked calls, 10 leads.

**Success signal:** 3 calls scheduled in week 3.

### 3.5 Shareable Audit URL (Built-in Virality)

Every audit result is a permanent, shareable URL with dynamic OG tags
showing the savings amount. When a founder shares their audit on LinkedIn
("Look what I found with this free tool"), every viewer sees the savings
number in the preview card — a built-in referral loop.

**Success signal:** Measurable audit-to-share ratio ≥ 5%.

---

## 4. Messaging Framework

| Audience | Hook | Proof | CTA |
|---|---|---|---|
| Founders | "Is your AI spend optimised?" | Real savings numbers | "Run your free audit" |
| CTOs | "Your team might be paying for the same capabilities twice" | Cross-vendor consolidation example | "Audit your stack" |
| EMs | "Get data to consolidate AI vendor spend" | Interview quote (David) | "Get the report" |

**Tone:** Honest, tool-first, not salesy. The audit must speak for itself.
Avoid superlatives. Lead with the number, not the pitch.

---

## 5. Lead Funnel

```
Visitor lands on credex.rocks
    ↓
Fills spend form (2 min) — form state persists in localStorage
    ↓
Views audit results page (shareable URL)
    ↓
Sees ShareButtons — copies link or posts to LinkedIn/X
    ↓
Sees LeadCaptureForm — enters work email
    ↓
Receives confirmation email (Resend) with audit link
    ↓
Credex follows up manually (for MVP) within 48h for high-savings leads
```

**High-savings threshold:** $500+/month savings → priority follow-up flag
(stored in `is_high_savings` column in Supabase).

---

## 6. Launch Metrics (Day-14 Targets)

| Metric | Target |
|---|---|
| Audits run | 50 |
| Leads captured | 10 |
| Audit-to-lead conversion | ≥ 15% |
| Audit-to-share rate | ≥ 5% |
| Booked calls (outreach) | 3 |
| Average audit savings found | $150+/mo |

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Low organic reach (no audience yet) | High | Direct founder outreach as backup; use real interview quotes as social proof |
| Pricing data goes stale | Medium | `dateAccessed` field in pricing-data.ts; monthly review task in backlog |
| Resend delivery to spam | Low | Use "noreply@credex.rocks" domain, plain-text fallback, clear subject line |
| Supabase rate limits at scale | Very Low | Free tier supports 500 MB storage + 2 GB bandwidth — sufficient for MVP |

---

## 8. Post-MVP Growth Levers (Not in scope for Day 5)

1. **Weekly AI pricing digest** — email list built from leads.
2. **Embeddable audit widget** — for blogs and newsletters.
3. **Team dashboard** — track spend month-over-month.
4. **Credex referral credit** — $X credit when audit leads to Credex sign-up.
