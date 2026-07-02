# Bapita v2 — Planning Spec
**Date:** 2026-06-07
**Status:** Historical record — architecture updated since this session (see v2/docs/mvp-design.md for current state)
**Session:** Brainstorming — product pivot from WhatsApp-first to booking platform

---

## What changed from v1

v1 (May 2026): WhatsApp automation as core product. Booking was via Calendly webhook. Dashboard was secondary.

v2 (June 2026): Booking platform as core product. Custom booking site + owner dashboard is the main deliverable. WhatsApp automations become a paid add-on.

---

## Decisions made this session

### Product
- Core: booking website (public) + owner dashboard (private)
- Booking site: services, gallery, calendar picker, booking form
- Dashboard: today/week view, booking list, client history, basic stats
- Confirmation: email + Google Calendar `.ics` file (free, no API needed v1)
- Add-ons: WhatsApp automations, Stripe payments, Google Business, social media, ads

### Pricing
- Internal: ₪2,500 setup / ₪200/mo dashboard access + support (not optional — subscription model)
- NOT shown on website — agency/consultation model
- WhatsApp add-on: +₪200/mo
- Stripe add-on: +₪100/mo or %
- Google Business add-on: +₪150/mo
- Scope-based (contact): social media, ads, full digital transformation

### Architecture (updated after this session — see mvp-design.md)
- Booking site: Next.js template per client, own Vercel project, own domain
- Dashboard: centralized at dashboard.bapita.com from day 1 — one Supabase project, RLS per tenant
- Monthly ₪200 = dashboard access. Stop paying = lose access.
- Original decision was Option C (per-client Supabase → migrate later). Updated: dashboard centralized from start.

### LP (bapita.com)
- Same design file (amber/cream/Heebo) — update copy only
- No prices shown
- Services listed with descriptions
- Full Digital Transformation section: accordion/dropdown with add-ons
- CTA: WhatsApp consultation (Israeli-native conversion path)
- New LP file: `src/dashboard/index-v2.html` (keep v1 untouched)

### Demo strategy
- Pre-build personalized demo per barbershop before walking in
- Use their Instagram data: name, services, photos
- Show live on phone: "This is already yours"

### Initial niche
- Start: barbershops (Herzliya/Gush Dan)
- Scale: any appointment business (salons, dog groomers, clinics, nail studios)
- LP positions for all appointment businesses, door-to-door targets barbers first

---

## What stays from v1

- Brand identity: amber/cream/Heebo, same visual system
- Tech stack: Supabase + Vercel + Next.js
- WhatsApp architecture (v1 design flags 1–8 still apply when add-on is built)
- Door-to-door outreach + free pilot offer
- Revenue targets: June ₪9k, July ₪15k+
- Anti-churn logic (customer data, monthly reports, switching cost)

---

## Folder structure (current — updated June 2026)

```
bapita/
├── shared/research/         ← competitive intel, market map
├── v1/                      ← archived (this session's original decisions)
└── v2/                      ← current
    ├── docs/
    │   ├── strategy.md
    │   ├── mvp-design.md
    │   ├── google-doc-summary.md
    │   ├── brand/
    │   └── design/
    ├── specs/               ← this file
    └── src/dashboard/       ← v2 LP
```

---

## Open items / next steps

1. **Update all docs** — brand, strategy, google doc summary, README
2. **Build v2 LP** (`index-v2.html`) — same amber/cream design, new copy
3. **Write walk-in script** — v2 pitch (booking platform, not WhatsApp bot)
4. **Pre-build first demo site** — one barbershop from Herzliya Instagram
5. **Walk into first 5 barbershops** with live demo
6. **Build full Next.js booking template** (after closing first client)

---

## Session sources

- Israeli WhatsApp API repriced March 2026: ₪0.045/msg (down from ₪0.08) — competitor quotes now 30–50% overpriced
- Market: done-for-you website + booking $199–599/mo internationally. Bapita = competitive at ₪200/mo post-₪2,500 setup.
- StyleSeat: $35/mo all-in. SQUIRE: $30–50/mo. These are DIY. Bapita = done-for-you premium above them.

---

*Bapita v2 Planning Spec — 2026-06-07*
