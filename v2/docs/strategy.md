# Bapita — Business Strategy
*v2 · June 2026*

---

## What Bapita is

Bapita is a done-for-you digital agency for Israeli appointment-based businesses. We build each client a booking website — their name, their services, their photos, their domain — and deploy it in 48 hours. They pay once to launch. After that, they manage everything through the Bapita dashboard (dashboard.bapita.com), a shared platform all clients log into. WhatsApp stays for conversation; the chaos of managing bookings through it goes away.

---

## Who it's for (ICP)

- Israeli appointment business owner: barbershop, salon, nail tech, dog groomer, physio, beauty clinic
- 1–5 staff
- Runs bookings entirely on WhatsApp — no booking link, no system
- Has Instagram but no booking CTA
- Located in Gush Dan / Herzliya area (walk-in market)
- Knows they need something but can't be bothered to figure out a SaaS tool themselves

---

## The core problem

Three problems in one:

1. **WhatsApp chaos** — every booking is a manual DM thread. Answered at midnight, between clients, on weekends. No system, no breathing room.
2. **No online booking** — no page to send clients to. Every inquiry requires a human response.
3. **No visibility** — owner has no dashboard, no weekly overview, no client history. Business state lives in a WhatsApp chat.

The market has DIY tools (SimplyBook, Fresha, vcita, SQUIRE). Owners know they exist. They don't use them because nobody set it up for them and nobody runs it. That's the gap Bapita fills.

---

## What Bapita builds

### Core (every client)
- **Booking website** (public): services, gallery, calendar availability picker, booking form, email confirmation + Google Calendar invite — deployed on client's own domain (e.g. ramibarber.com)
- **Owner dashboard** (private): today/week view, booking list with status management, client history, basic stats — centralized at dashboard.bapita.com, works on phone. Active as long as monthly subscription is live.

### Add-ons (paid separately)
- WhatsApp automations: 24h/2h reminders, post-visit review request, FAQ bot
- Online payments at booking (Stripe)
- Google Business Profile management
- Social media scheduling + posting
- Click-to-WhatsApp paid ads

---

## Pricing (internal — do NOT show on website)

| Item | Price |
|---|---|
| Setup (site + onboarding) | ₪2,500 |
| Dashboard access + support (monthly) | ₪200/mo |
| WhatsApp add-on | +₪200/mo |
| Stripe payments add-on | +₪100/mo |
| Google Business add-on | +₪150/mo |
| Social/ads | Quote per scope |

**These are approximate.** Adjust per client complexity, scope, and negotiation. No need to be rigid.

Verbal pitch: *"₪2,500 פעם אחת — בונים לך את האתר עם הדומיין שלך. אחר כך ₪200 בחודש לגישה לדשבורד שלך — שם רואים את כל התורים, הלקוחות, הסטטיסטיקות. פחות מסט מספריים חדש."*

---

## How we sell

Door-to-door. Three-step process:

1. **Find on Instagram** — search Herzliya/Gush Dan barbershops. Look for: active account, real clients in photos, no booking link in bio.
2. **Pre-build their demo** — use their real name, services, and photos. Deploy to a Vercel preview URL. Takes ~1 hour.
3. **Walk in** — show the live site on your phone. Say: *"בנינו לך אתר. רגע אחד לראות?"* ("We built you a site. One second to see it?")

The demo is the pitch. "This is already yours. Live with your domain in 48 hours."

---

## Demo script (Hebrew + English)

**Walk-in opener:**
> HE: "בנינו לך אתר. רגע אחד לראות?"
> EN: "We built you a site. One second to see it?"

**Show the demo on phone. Let them scroll.**

**Close:**
> HE: "₪2,500 פעם אחת — בונים לך אתר עם דומיין שלך. אחר כך ₪200 בחודש לדשבורד — רואים תורים, לקוחות, הכנסות. מפסיק לשלם — מאבד גישה לדשבורד. מה אתה אומר?"
> EN: "₪2,500 once — we build your site on your domain. Then ₪200/mo for dashboard access — bookings, clients, stats. Stop paying, lose the dashboard. What do you think?"

**Objections:**
- "יש לי Fresha" → "Fresha לוקחת עמלה על כל תור. אתר שלך — אין עמלות."
- "לא עכשיו" → "בסדר. האתר הזה אפשר להשאיר אצלך ל-48 שעות אם רוצה לחשוב."
- "כמה זמן לוקח?" → "שיחה של 15 דקות, ואנחנו מסיימים הכל תוך יומיים."

---

## How we deliver

Actual work: ~2–3 hours per client.

1. Clone Next.js booking site template
2. Fill `config.ts`: business name, services, prices, colors, photos
3. Deploy to Vercel, connect client's domain
4. Create tenant in shared Supabase project (one row, RLS handles isolation)
5. Create client login in dashboard.bapita.com
6. 30-minute walkthrough call with owner

Done. Client has a live booking site on their domain and dashboard access at dashboard.bapita.com. We own the platform. They WhatsApp us for changes.

---

## Next steps (priority order)

1. ~~Update all docs~~ ✓
2. ~~Build v2 LP~~ ✓ — live at bapita.com (GitHub: ramikan96-collab/bapita, Vercel: dashboard project)
3. Write walk-in script (`v2/docs/sales/walk-in-script.md`)
4. Pre-build first demo site (one Herzliya barbershop from Instagram)
5. Walk into first 5 barbershops
6. Build Next.js booking site template (after closing first client)
7. Build centralized dashboard at dashboard.bapita.com (multi-tenant, after closing first client)

---

## Revenue targets

- **June 2026:** First paying client. ₪2,500 collected.
- **July 2026:** 3 clients total. ₪200/mo recurring × 2–3 = ₪400–600/mo MRR.
- **Q3 2026:** 5–8 clients. Add-ons selling. MRR ₪1,500+.
