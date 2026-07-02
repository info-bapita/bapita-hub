# Bapita — Week 1 Plan
**Date:** 2026-05-22
**Status:** Approved
**Goal:** Brand defined, LP live at bapita.com, working WhatsApp demo on cousin's number, ready to walk into first 10 barbershops.

---

## Project Folder Structure

```
/Users/admin/Desktop/bapita/
├── docs/
│   ├── superpowers/specs/        ← planning docs (this file)
│   ├── brand/                    ← Day 1–2 outputs
│   │   ├── customer-research.md
│   │   ├── positioning.md
│   │   └── brand-voice.md
│   ├── sales/                    ← Day 4 outputs
│   │   ├── walk-in-script.md
│   │   └── dm-sequence.md
│   └── onboarding/               ← Day 7 outputs
│       └── client-checklist.md
├── src/
│   ├── supabase/
│   │   ├── migrations/           ← SQL schema files
│   │   └── functions/            ← Edge functions (one folder each)
│   └── dashboard/                ← Next.js LP (bapita.com)
├── .env.example
└── README.md
```

All work sessions happen inside `/Users/admin/Desktop/bapita/`. Open Claude Code from that folder every session.

---

## Context (do not redo)

- **Domain:** bapita.com — bought
- **Target:** Israeli barbershop/salon owner, 1–3 chairs, Herzliya/Gush Dan. Instagram-active. Answers WhatsApp manually all day. Loses bookings after hours. No booking system.
- **Not targeting:** chains, clinics with reception staff, businesses already using software.
- **Positioning:** "We set it up, you never touch it." — done-for-you, not a platform to learn. [verify this is how it should be or give suggestions to improve]
- **Tone:** [help me decide]
- **Stack:** Supabase + Meta WhatsApp Cloud API + GitHub Actions + Next.js (Vercel)
- **Competitor research:** Done. Competitors: Gambot, CloudFlow, SmartSend, Whale Group, Automaziot, Waliner, Rapidline AI, Coral Tech, STSICONIC, AutomateNexus. Key weakness: all are either SaaS platforms (no hand-holding) or enterprise-feel with unclear pricing. Bapita = human, done-for-you, affordable.


---

## Day 1 — Understand the customer

**Skills to invoke:** `/customer-research` then `/marketing-psychology`
**Output saved to:** `docs/brand/customer-research.md`

### Tasks
1. Run `/customer-research` to map exact pain points of Israeli barbershop/salon owners
2. Run `/marketing-psychology` to understand what emotionally triggers them to buy (fear of missing bookings, social proof from other barbers, ROI framing)

### Prompt for new chat
```
I'm building Bapita — A done-for-you digital operations service for Israeli appointment-based businesses (barbershops, salons, dog groomers, clinics). You configure and run their WhatsApp automations, booking system, Google presence, and client retention — they pay a setup fee and monthly retainer, see results, never touch the engine. I'm based in Herzliya. My target customer: owner-operator, Instagram-active, manually answers WhatsApp all day, loses bookings after hours, no system.

Use /customer-research to deeply map their pain points, daily frustrations, and what would make them immediately say yes to a service like this. Hebrew-speaking market. Output in English. Save to docs/brand/customer-research.md
```

---

## Day 2 — Brand identity

**Skills to invoke:** `/product-marketing` then `/pricing` then `/copywriting` → then Claude Design
**Output saved to:** `docs/brand/positioning.md` and `docs/brand/brand-voice.md`

### Tasks
1. Run `/product-marketing` to write the positioning statement and value prop
2. Run `/pricing` to validate the NIS bundle pricing (Starter 699/mo, No-Show Killer 999/mo, Full Autopilot 1,490/mo, Clinic Pack 1,699/mo) against the market
3. Run `/copywriting` to write: brand voice rules, one-sentence pitch, LP headline
4. Switch to Claude Design: create logo, color palette, typography (warm + modern + Israeli)

### Prompt for new chat
```
I'm building Bapita — a done-for-you WhatsApp automation service for Israeli barbershops and salons.

Positioning: "We set it up, you never touch it." Done-for-you, not a platform.
Competitors are: Gambot (SaaS, cold), Automaziot (broad, no vertical focus), Whale Group (enterprise-feel).
Bapita's edge: human, vertical-focused (barbershops/salons), affordable, Hebrew-first.

Bundles (NIS):
- Starter: 1,200 setup / 699/mo
- No-Show Killer: 1,800 setup / 999/mo  
- Full Autopilot: 2,500 setup / 1,490/mo
- Clinic Pack: 3,000–3,500 setup / 1,699/mo

Use /product-marketing to write positioning, value prop, and what makes Bapita different.
Then use /pricing to validate these NIS price points.
Then use /copywriting to write brand voice rules + LP headline.
Save outputs to docs/brand/positioning.md and docs/brand/brand-voice.md
```

---

## Day 3 — Landing page

**Skills to invoke:** `/site-architecture` then `/cro` then `/frontend-design:frontend-design`
**Output saved to:** `src/dashboard/` (Next.js app, deployed to Vercel at bapita.com)

### Tasks
1. Run `/site-architecture` to structure the LP: pain → solution → demo → bundles → CTA
2. Run `/cro` to optimize LP for conversion (Israeli barbershop owner as persona)
3. Run `/frontend-design:frontend-design` to build the Next.js LP
4. Add a lead magnet: "Free WhatsApp audit for your business" → email capture form
5. Add analytics (Plausible or GA4)
6. Deploy to Vercel, connect bapita.com

### Prompt for new chat
```
I'm building the landing page for Bapita (bapita.com) — a done-for-you WhatsApp automation service for Israeli barbershops and salons.

Brand voice: direct, warm, Israeli, Hebrew-first, not corporate.
Persona: barbershop/salon owner, Herzliya/Gush Dan, manually answers WhatsApp, loses bookings.
Bundles are already defined (see docs/brand/positioning.md).

Working directory: /Users/admin/Desktop/bapita

Use /site-architecture to design the LP flow, then /frontend-design:frontend-design to build it in Next.js inside src/dashboard/. Include a lead magnet ("free WhatsApp audit") with email capture. Mobile-first — owners will see this on their phone.
```

---

## Day 4 — Sales materials

**Skills to invoke:** `/sales-enablement` then `/cold-email` then `/social`
**Output saved to:** `docs/sales/walk-in-script.md` and `docs/sales/dm-sequence.md`

### Tasks
1. Run `/sales-enablement` to build the walk-in pitch (2 min, Hebrew, handles top 3 objections)
2. Run `/cold-email` to write Instagram DM sequence (3 messages: opener → value → ask)
3. Run `/social` to set up Bapita's own Instagram account strategy
4. Prep the free pilot offer script: "30 days free, no contract, just let me show you"

### Prompt for new chat
```
I'm building sales materials for Bapita — a done-for-you WhatsApp automation service for Israeli barbershops and salons.

My outreach plan:
- Walk into barbershops in Herzliya/Tel Aviv with a live demo on my phone
- Instagram DMs to barbershops who are active on Instagram
- Offer: free 30-day pilot, no setup fee, no contract

Target owner speaks Hebrew. Skeptical. Busy. Doesn't trust tech salespeople.

Use /sales-enablement to write a 2-min walk-in pitch in Hebrew (with English translation) that handles objections: "I don't have time", "I'm doing fine without it", "How much does it cost?"
Then use /cold-email to write a 3-message Instagram DM sequence.
Save to docs/sales/walk-in-script.md and docs/sales/dm-sequence.md
```

---

## Day 5–6 — Build tech demo

**Skills to invoke:** `/supabase:supabase` (I build with Claude Code)
**Output saved to:** `src/supabase/` and tested on cousin's WhatsApp number

### Tasks
1. Create Supabase project + connect to repo
2. Write and run schema migration (clients, customers, appointments, messages_log, templates tables)
3. Set up Meta Developer App — WhatsApp Cloud API test number
4. Build `webhook-whatsapp` edge function (inbound messages → confirm/cancel/AI reply)
5. Build `jobs-reminders` edge function (hourly cron → 24h + 2h reminders)
6. Connect GitHub Actions scheduler
7. Test full flow on cousin's number: booking → reminder → confirm/cancel → review request

### Prompt for new chat
```
I'm building the backend for Bapita — a done-for-you WhatsApp automation service for Israeli barbershops.

Stack: Supabase (edge functions) + Meta WhatsApp Cloud API + GitHub Actions (cron) + Next.js dashboard.

Working directory: /Users/admin/Desktop/bapita

I need to build:
1. Database schema (5 tables: clients, customers, appointments, messages_log, templates)
2. Webhook edge function — receives WhatsApp messages, routes confirm/cancel/AI reply
3. Reminder job edge function — runs hourly, sends 24h and 2h appointment reminders
4. GitHub Actions cron — calls the reminder job every hour

Start with the Supabase schema. Use /supabase:supabase skill. All code goes in src/supabase/.
```

---

## Day 7 — Retention + launch prep

**Skills to invoke:** `/referrals` then `/churn-prevention` then `/onboarding`
**Output saved to:** `docs/onboarding/client-checklist.md`

### Tasks
1. Run `/referrals` to design the referral loop: client → refers barber friend → 1 free month
2. Run `/churn-prevention` to review system design for retention (ROI reports, switching cost)
3. Run `/onboarding` to write the step-by-step client onboarding checklist (~3hr process)
4. Finalize week 2 outreach plan: 10 walk-ins + 10 Instagram DMs/day

### Prompt for new chat
```
I'm launching Bapita next week — a done-for-you WhatsApp automation service for Israeli barbershops and salons.

My first clients will be barbershops in Herzliya/Tel Aviv acquired through walk-ins and Instagram DMs.

Use /referrals to design a referral program where barber clients refer other barbers (barbershops talk to each other — word of mouth is the main channel in this market).
Then use /churn-prevention to review and strengthen retention.
Then use /onboarding to write a clear client onboarding checklist (from signed contract to system live in 3-5 days).
Save checklist to docs/onboarding/client-checklist.md
```

---

## After Week 1 — First outreach

- Walk into 10 barbershops in Herzliya/Tel Aviv. Show demo on your phone. Lead with the pain ("you're losing bookings every night after you close"), not the product.
- Send 10 Instagram DMs/day using the sequence from `docs/sales/dm-sequence.md`
- Offer every prospect: **free 30-day pilot** — no setup fee, no contract, just results
- After pilot → 3-month contract + setup fee for next client
- Use cousin's barbershop as demo case study (even if unofficial — "I tested this for a friend")

---

## Revenue targets (from your plan)

| Month | Target |
|---|---|
| June | $3,000 (2 paid clients after pilots) |
| July | $6,000 |
| August | $10,000 |
| September | $15,000 |

---

*Bapita Week 1 Plan — 2026-05-22*
