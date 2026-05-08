# User Interviews

Three interviews conducted on 2026-05-07 via WhatsApp text.

---

## Interview 1 — Akash (Akash Sir)
**Role:** Founder, CallHQ AI  
**Company Stage:** Early-stage AI startup  
**Date:** 2026-05-07

**Summary:**
Akash's team of 11 uses Claude and Cursor, paying $20/user — 
totalling $220/month. He has never questioned whether the plan 
is right for them, describing it as a decision that just gets 
paid without review.

**Direct Quotes:**
1. "Yes we do — we use Claude and Cursor."
2. "$20/user. Have a team of 11. So 220."
3. "No" [when asked if he'd ever questioned the plan or 
   considered switching to save money]

**Most Surprising Thing:**
A founder actively building an AI product spends $220/month 
on AI tools and has never once thought about whether that 
spend is optimized. Cost awareness is completely absent even 
among technically sophisticated users.

**What This Changed About My Design:**
The tool cannot assume users know they're overspending — 
they genuinely don't think about it. The audit results page 
needs to lead with the total savings number in large, 
impossible-to-miss text. The "aha moment" must be 
immediate and visceral.

---

## Interview 2 — Parth Bhaiya
**Role:** Developer (Senior)  
**Company Stage:** Employed at a company with company-wide 
Claude Teams subscription  
**Date:** 2026-05-07

**Summary:**
Parth uses Claude through a company Teams subscription. He 
doesn't know what the company pays — that visibility sits 
with IT. He personally uses it infrequently but finds value 
when working on complex multi-context tasks. He would not 
switch tools for cost savings alone unless the performance 
difference was significant.

**Direct Quotes:**
1. "Teams subscription company wide, don't have subscription 
   ka idea, worth it? For me — yes, just my usage is v less."
2. "Thinking about saving money for LLMs is not part of my 
   job — that is overlooked by IT teams."
3. "Use it? No, because I prefer to work with single LLM 
   because it has context specific to me and knows my work 
   style. Might try it out if performance is really better — 
   if money diff is not much I won't switch."

**Most Surprising Thing:**
Individual contributors inside companies have zero visibility 
into what their company spends on AI tools. The purchasing 
decision and cost awareness are entirely siloed in IT/finance. 
This means the real target user for the audit tool is the 
engineering manager or CTO — not the individual developer.

**What This Changed About My Design:**
The GTM.md target user needs to be more specific: 
"Engineering Manager or CTO at a 5–50 person startup" — 
not individual developers. Individual devs don't control 
budget and don't care about cost. Added a note to the 
results page that the shareable URL is designed for 
forwarding to a decision-maker.

---

## Interview 3 — Friend (Student/Early Career)
**Role:** Student / Individual user  
**Company Stage:** N/A — personal use  
**Date:** 2026-05-07

**Summary:**
Uses ChatGPT frequently but only on the free plan. Cost has 
actively stopped them from trying paid AI tools multiple 
times. Would immediately use a tool that helped identify 
savings.

**Direct Quotes:**
1. "Yes, I use ChatGPT frequently."
2. "I use it for free."
3. "Yes, it happened many times." [cost stopping them from 
   trying a tool]
4. "Sure, why not." [on using a free savings audit tool]

**Most Surprising Thing:**
Even free-tier users are a valid audience — cost anxiety 
stops them from upgrading to paid plans they might actually 
benefit from. The tool could serve a "should I upgrade?" 
use case, not just "am I overspending?"

**What This Changed About My Design:**
Added a use case to the audit engine: if a user is on a 
free plan but their usage pattern suggests they'd benefit 
from a paid plan, surface that recommendation honestly. 
The tool should optimize spend in both directions — 
down AND up when justified.
